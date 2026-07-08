#!/usr/bin/env python3
"""
Build the Junior Trader Handbook HTML artifact from the bound Markdown source.

Install dependency:
    python3 -m pip install -r requirements.txt

The Markdown source remains the source of truth. This script only generates
manuscript/Junior_Trader_Handbook.html.
"""

from __future__ import annotations

import html
import json
import re
import sys
import unicodedata
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path

try:
    import markdown
except ImportError:
    print("Missing dependency: Markdown", file=sys.stderr)
    print("Install with: python3 -m pip install -r requirements.txt", file=sys.stderr)
    raise


REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCE = REPO_ROOT / "manuscript" / "Junior_Trader_Handbook_BOUND.md"
OUTPUT = REPO_ROOT / "manuscript" / "Junior_Trader_Handbook.html"
TITLE = "Junior Trader Handbook"

STRUCTURAL_H1 = {"Introduction", "Part One", "Part Two", "Part Three", "Part Four"}
BADGE_CLASSES = {
    "VERIFIED": "badge-verified",
    "LIKELY": "badge-likely",
    "UNKNOWN": "badge-unknown",
    "FACT": "badge-fact",
    "JUDGMENT": "badge-judgment",
    "ASSUMPTION": "badge-assumption",
}
BADGE_PATTERN = re.compile(
    r"(?<![A-Za-z0-9_-])("
    + "|".join(re.escape(token) for token in sorted(BADGE_CLASSES, key=len, reverse=True))
    + r")(?![A-Za-z0-9_-])"
)
HEADING_PATTERN = re.compile(r"^(#{1,6})\s+(.+?)\s*$")


@dataclass
class Chapter:
    title: str
    slug: str


@dataclass
class Part:
    title: str
    slug: str
    chapters: list[Chapter] = field(default_factory=list)


def slugify(text: str, used: set[str]) -> str:
    base = unicodedata.normalize("NFKD", text)
    base = base.encode("ascii", "ignore").decode("ascii").lower()
    base = re.sub(r"[^a-z0-9]+", "-", base).strip("-")
    if not base:
        base = "section"
    slug = base
    suffix = 2
    while slug in used:
        slug = f"{base}-{suffix}"
        suffix += 1
    used.add(slug)
    return slug


def clean_heading_text(text: str) -> str:
    return re.sub(r"\s+\{#[A-Za-z0-9_-]+\}\s*$", "", text).strip()


def parse_structure(markdown_text: str) -> tuple[list[Part], list[dict[str, str]]]:
    used: set[str] = set()
    parts: list[Part] = []
    sections: list[dict[str, str]] = []
    current_part: Part | None = None

    for line in markdown_text.splitlines():
        match = HEADING_PATTERN.match(line)
        if not match:
            continue

        level = len(match.group(1))
        title = clean_heading_text(match.group(2))

        if level == 1 and title in STRUCTURAL_H1:
            slug = slugify(title, used)
            current_part = Part(title=title, slug=slug)
            parts.append(current_part)
            sections.append(
                {
                    "type": "divider",
                    "title": title,
                    "slug": slug,
                    "partTitle": title,
                    "partSlug": slug,
                    "chapterTitle": "",
                    "chapterSlug": "",
                }
            )
            continue

        if (
            level == 2
            and current_part
            and current_part.title != "Introduction"
            and title.startswith("Chapter ")
        ):
            slug = slugify(title, used)
            chapter = Chapter(title=title, slug=slug)
            current_part.chapters.append(chapter)
            sections.append(
                {
                    "type": "chapter",
                    "title": title,
                    "slug": slug,
                    "partTitle": current_part.title,
                    "partSlug": current_part.slug,
                    "chapterTitle": title,
                    "chapterSlug": slug,
                }
            )

    return parts, sections


def add_heading_ids(markdown_text: str, sections: list[dict[str, str]]) -> str:
    slug_by_title_level: dict[tuple[int, str], list[str]] = {}
    for section in sections:
        level = 1 if section["type"] == "divider" else 2
        slug_by_title_level.setdefault((level, section["title"]), []).append(section["slug"])

    rendered_lines: list[str] = []
    for line in markdown_text.splitlines():
        match = HEADING_PATTERN.match(line)
        if not match:
            rendered_lines.append(line)
            continue

        level = len(match.group(1))
        title = clean_heading_text(match.group(2))
        slugs = slug_by_title_level.get((level, title))
        if slugs:
            slug = slugs.pop(0)
            rendered_lines.append(f"{match.group(1)} {title} {{#{slug}}}")
        else:
            rendered_lines.append(line)

    return "\n".join(rendered_lines) + "\n"


class BadgeHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=False)
        self.parts: list[str] = []
        self.skip_stack: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.parts.append(self.get_starttag_text() or self._format_starttag(tag, attrs))
        if tag.lower() in {"code", "pre", "script", "style"}:
            self.skip_stack.append(tag.lower())

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.parts.append(self.get_starttag_text() or self._format_starttag(tag, attrs, closed=True))

    def handle_endtag(self, tag: str) -> None:
        self.parts.append(f"</{tag}>")
        if self.skip_stack and self.skip_stack[-1] == tag.lower():
            self.skip_stack.pop()

    def handle_data(self, data: str) -> None:
        if self.skip_stack:
            self.parts.append(html.escape(data, quote=False))
            return
        self.parts.append(BADGE_PATTERN.sub(self._badge, html.escape(data, quote=False)))

    def handle_entityref(self, name: str) -> None:
        self.parts.append(f"&{name};")

    def handle_charref(self, name: str) -> None:
        self.parts.append(f"&#{name};")

    def handle_comment(self, data: str) -> None:
        self.parts.append(f"<!--{data}-->")

    def handle_decl(self, decl: str) -> None:
        self.parts.append(f"<!{decl}>")

    def unknown_decl(self, data: str) -> None:
        self.parts.append(f"<![{data}]>")

    @staticmethod
    def _format_starttag(
        tag: str,
        attrs: list[tuple[str, str | None]],
        closed: bool = False,
    ) -> str:
        pieces = [tag]
        for name, value in attrs:
            if value is None:
                pieces.append(name)
            else:
                pieces.append(f'{name}="{html.escape(value, quote=True)}"')
        suffix = " /" if closed else ""
        return "<" + " ".join(pieces) + suffix + ">"

    @staticmethod
    def _badge(match: re.Match[str]) -> str:
        token = match.group(1)
        badge_class = BADGE_CLASSES[token]
        return f'<span class="evidence-badge {badge_class}">{token}</span>'

    def html(self) -> str:
        return "".join(self.parts)


def add_evidence_badges(rendered_html: str) -> str:
    parser = BadgeHTMLParser()
    parser.feed(rendered_html)
    parser.close()
    return parser.html()


def render_markdown(markdown_text: str) -> str:
    return markdown.markdown(
        markdown_text,
        extensions=["extra", "attr_list", "sane_lists"],
        output_format="html5",
    )


def nav_html(parts: list[Part]) -> str:
    chunks: list[str] = []
    for index, part in enumerate(parts):
        if part.title == "Introduction":
            chunks.append(
                f'<a class="nav-link nav-intro" data-target="{html.escape(part.slug)}" '
                f'href="#{html.escape(part.slug)}">{html.escape(part.title)}</a>'
            )
            continue

        open_attr = " open" if index == 1 else ""
        chunks.append(
            f'<details class="part-group" data-slug="{html.escape(part.slug)}"{open_attr}>'
            f'<summary class="part-summary" data-target="{html.escape(part.slug)}">'
            f'<span>{html.escape(part.title)}</span>'
            f'<span class="chevron" aria-hidden="true"></span>'
            f"</summary>"
            f'<div class="chapter-list">'
        )
        for chapter in part.chapters:
            chunks.append(
                f'<a class="nav-link chapter-link" data-target="{html.escape(chapter.slug)}" '
                f'href="#{html.escape(chapter.slug)}">{html.escape(chapter.title)}</a>'
            )
        chunks.append("</div></details>")
    return "\n".join(chunks)


def build_html(
    content_html: str,
    parts: list[Part],
    sections: list[dict[str, str]],
    markdown_version: str,
) -> str:
    chapter_ids = [section["slug"] for section in sections if section["type"] == "chapter"]
    section_json = json.dumps(sections, ensure_ascii=True).replace("</", "<\\/")
    chapter_json = json.dumps(chapter_ids, ensure_ascii=True).replace("</", "<\\/")

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(TITLE)}</title>
<script>
(function () {{
  try {{
    var savedTheme = localStorage.getItem("handbook-theme");
    if (savedTheme) {{
      document.documentElement.dataset.theme = savedTheme;
    }}
  }} catch (error) {{}}
}}());
</script>
<style>
:root {{
  color-scheme: light dark;
  --bg: #f7f3ec;
  --paper: #fffdf8;
  --text: #211d18;
  --muted: #6e655b;
  --line: #ded5ca;
  --soft-line: #ebe2d8;
  --sidebar: #efe7dc;
  --sidebar-text: #2a241f;
  --accent: #8f5335;
  --accent-strong: #6f3922;
  --blockquote-bg: #f6eee4;
  --code-bg: #f1e8dd;
  --table-head: #f0e7dc;
  --shadow: 0 12px 32px rgba(66, 45, 25, 0.12);
  --badge-text: #161412;
}}

@media (prefers-color-scheme: dark) {{
  :root:not([data-theme="light"]) {{
    --bg: #151514;
    --paper: #1d1c1a;
    --text: #ebe2d7;
    --muted: #b8aa9a;
    --line: #3c3833;
    --soft-line: #2b2926;
    --sidebar: #111110;
    --sidebar-text: #ece2d6;
    --accent: #d8996f;
    --accent-strong: #f0b287;
    --blockquote-bg: #28241f;
    --code-bg: #2a2825;
    --table-head: #27231f;
    --shadow: 0 12px 36px rgba(0, 0, 0, 0.32);
    --badge-text: #101010;
  }}
}}

:root[data-theme="dark"] {{
  --bg: #151514;
  --paper: #1d1c1a;
  --text: #ebe2d7;
  --muted: #b8aa9a;
  --line: #3c3833;
  --soft-line: #2b2926;
  --sidebar: #111110;
  --sidebar-text: #ece2d6;
  --accent: #d8996f;
  --accent-strong: #f0b287;
  --blockquote-bg: #28241f;
  --code-bg: #2a2825;
  --table-head: #27231f;
  --shadow: 0 12px 36px rgba(0, 0, 0, 0.32);
  --badge-text: #101010;
}}

* {{
  box-sizing: border-box;
}}

html {{
  scroll-behavior: smooth;
}}

body {{
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Georgia, "Iowan Old Style", "Source Serif Pro", "Source Serif", serif;
  font-size: 18px;
  line-height: 1.68;
}}

a {{
  color: inherit;
}}

#progress {{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: 0%;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-strong));
}}

.sidebar {{
  position: fixed;
  inset: 0 auto 0 0;
  width: 320px;
  overflow-y: auto;
  padding: 28px 22px 36px;
  background: var(--sidebar);
  color: var(--sidebar-text);
  border-right: 1px solid var(--line);
}}

.brand {{
  margin: 0 0 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.3;
  letter-spacing: 0;
  color: var(--muted);
}}

.brand strong {{
  display: block;
  margin-top: 4px;
  color: var(--sidebar-text);
  font-size: 1.28rem;
  font-weight: 700;
}}

.nav-tree {{
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 0.9rem;
  line-height: 1.35;
}}

.nav-link,
.part-summary {{
  border-radius: 7px;
}}

.nav-link {{
  display: block;
  padding: 8px 10px;
  color: var(--muted);
  text-decoration: none;
}}

.chapter-link {{
  padding-left: 18px;
}}

.nav-link:hover,
.part-summary:hover {{
  color: var(--sidebar-text);
  background: color-mix(in srgb, var(--accent) 9%, transparent);
}}

.nav-link.active {{
  color: var(--accent-strong);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  font-weight: 650;
}}

.part-group {{
  margin: 4px 0;
}}

.part-summary {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 10px;
  cursor: pointer;
  color: var(--sidebar-text);
  font-weight: 700;
  list-style: none;
}}

.part-summary::-webkit-details-marker {{
  display: none;
}}

.chevron {{
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(-45deg);
  transition: transform 160ms ease;
  opacity: 0.7;
}}

.part-group[open] .chevron {{
  transform: rotate(45deg);
}}

.chapter-list {{
  margin: 2px 0 8px 8px;
  padding-left: 8px;
  border-left: 1px solid var(--line);
}}

.page {{
  min-height: 100vh;
  margin-left: 320px;
}}

.topbar {{
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 32px;
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  border-bottom: 1px solid var(--soft-line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
}}

.current-context {{
  min-width: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.25;
}}

.current-part {{
  display: block;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}}

.current-chapter {{
  display: block;
  overflow: hidden;
  color: var(--text);
  font-size: 0.98rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}}

.theme-toggle {{
  flex: 0 0 auto;
  padding: 8px 12px;
  color: var(--text);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 0.82rem;
  cursor: pointer;
}}

.theme-toggle:hover {{
  border-color: var(--accent);
  color: var(--accent-strong);
}}

.content-wrap {{
  padding: 56px 36px 96px;
}}

.book-content {{
  max-width: 70ch;
  margin: 0 auto;
  padding: 52px 58px 78px;
  background: var(--paper);
  border: 1px solid var(--soft-line);
  border-radius: 8px;
  box-shadow: var(--shadow);
}}

.book-content h1,
.book-content h2,
.book-content h3,
.book-content h4,
.book-content h5,
.book-content h6 {{
  scroll-margin-top: 96px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.16;
  letter-spacing: 0;
}}

.book-content h1 {{
  margin: 2.6em 0 0.75em;
  padding-top: 0.25em;
  color: var(--accent-strong);
  font-size: clamp(2.15rem, 5vw, 4.15rem);
  font-weight: 800;
}}

.book-content h1:first-child {{
  margin-top: 0;
}}

.book-content h2 {{
  margin: 2.3em 0 0.75em;
  font-size: clamp(1.6rem, 3vw, 2.35rem);
}}

.book-content h3 {{
  margin: 2.1em 0 0.55em;
  font-size: 1.22rem;
}}

.book-content h4 {{
  margin: 1.7em 0 0.45em;
  font-size: 1.02rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}}

.book-content p {{
  margin: 0 0 1.15em;
}}

.book-content hr {{
  margin: 2.6em 0;
  border: 0;
  border-top: 1px solid var(--line);
}}

.book-content blockquote {{
  margin: 1.7em 0;
  padding: 0.35em 0 0.35em 1.15em;
  color: var(--text);
  background: var(--blockquote-bg);
  border-left: 4px solid var(--accent);
  font-size: 1.06em;
  font-style: italic;
}}

.book-content blockquote p:last-child {{
  margin-bottom: 0;
}}

.book-content table {{
  width: 100%;
  margin: 1.7em 0;
  border-collapse: collapse;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 0.9rem;
  line-height: 1.45;
}}

.book-content th,
.book-content td {{
  padding: 11px 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}}

.book-content th {{
  background: var(--table-head);
  color: var(--text);
  font-weight: 750;
  text-align: left;
}}

.book-content tr:last-child td {{
  border-bottom: 0;
}}

.book-content code {{
  padding: 0.08em 0.28em;
  background: var(--code-bg);
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.88em;
}}

.book-content pre {{
  overflow-x: auto;
  padding: 16px;
  background: var(--code-bg);
  border-radius: 7px;
}}

.book-content pre code {{
  padding: 0;
  background: transparent;
}}

.evidence-badge {{
  display: inline-block;
  margin: 0 0.08em;
  padding: 0.08em 0.42em;
  border-radius: 999px;
  color: var(--badge-text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 0.72em;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.04em;
  vertical-align: 0.08em;
}}

.badge-verified {{
  background: #8fd19e;
}}

.badge-likely,
.badge-judgment {{
  background: #e6bc67;
}}

.badge-unknown,
.badge-assumption {{
  background: #b8b8b8;
}}

.badge-fact {{
  background: #8fb9e8;
}}

@media (max-width: 900px) {{
  .sidebar {{
    position: static;
    width: auto;
    max-height: 48vh;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }}

  .page {{
    margin-left: 0;
  }}

  .topbar {{
    padding: 12px 18px;
  }}

  .content-wrap {{
    padding: 24px 14px 64px;
  }}

  .book-content {{
    max-width: 100%;
    padding: 34px 22px 56px;
  }}
}}
</style>
</head>
<body>
<div id="progress" aria-hidden="true"></div>
<aside class="sidebar" aria-label="Handbook navigation">
  <p class="brand">Generated handbook<strong>{html.escape(TITLE)}</strong></p>
  <nav class="nav-tree">
{nav_html(parts)}
  </nav>
</aside>
<div class="page">
  <header class="topbar">
    <div class="current-context" aria-live="polite">
      <span class="current-part" id="current-part">Introduction</span>
      <span class="current-chapter" id="current-chapter">The Architecture of Chaos</span>
    </div>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle light and dark theme">Theme</button>
  </header>
  <main class="content-wrap">
    <article class="book-content">
{content_html}
    </article>
  </main>
</div>
<script>
const SECTIONS = {section_json};
const CHAPTER_IDS = {chapter_json};

const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const partGroups = Array.from(document.querySelectorAll(".part-group"));
const currentPart = document.getElementById("current-part");
const currentChapter = document.getElementById("current-chapter");
const progress = document.getElementById("progress");
const themeToggle = document.getElementById("theme-toggle");
let activeSection = SECTIONS[0] || null;

function setActive(section) {{
  if (!section) return;
  activeSection = section;

  navLinks.forEach((link) => {{
    link.classList.toggle("active", link.dataset.target === section.slug);
  }});

  if (section.type === "chapter") {{
    currentPart.textContent = section.partTitle;
    currentChapter.textContent = section.chapterTitle;
  }} else {{
    currentPart.textContent = section.title;
    currentChapter.textContent = section.title === "Introduction" ? "The Architecture of Chaos" : "Part opener";
  }}

  if (section.partSlug) {{
    const group = document.querySelector('.part-group[data-slug="' + section.partSlug + '"]');
    if (group) group.open = true;
  }}
}}

function sectionForId(id) {{
  return SECTIONS.find((section) => section.slug === id);
}}

function scrollToId(id) {{
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({{ behavior: "smooth", block: "start" }});
}}

document.querySelectorAll("[data-target]").forEach((item) => {{
  item.addEventListener("click", (event) => {{
    const id = item.dataset.target;
    if (!id) return;
    if (item.classList.contains("part-summary")) {{
      event.preventDefault();
      const details = item.closest("details");
      if (details) details.open = !details.open;
      scrollToId(id);
    }}
  }});
}});

navLinks.forEach((link) => {{
  link.addEventListener("click", (event) => {{
    const id = link.dataset.target;
    if (!id) return;
    event.preventDefault();
    history.pushState(null, "", "#" + id);
    scrollToId(id);
  }});
}});

const observer = new IntersectionObserver((entries) => {{
  entries.forEach((entry) => {{
    if (!entry.isIntersecting) return;
    const section = sectionForId(entry.target.id);
    if (section) setActive(section);
  }});
}}, {{
  root: null,
  rootMargin: "-18% 0px -72% 0px",
  threshold: 0
}});

SECTIONS.forEach((section) => {{
  const element = document.getElementById(section.slug);
  if (element) observer.observe(element);
}});

function updateProgress() {{
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
  progress.style.width = percent + "%";
}}

window.addEventListener("scroll", updateProgress, {{ passive: true }});
window.addEventListener("resize", updateProgress);

document.addEventListener("keydown", (event) => {{
  const tagName = (event.target && event.target.tagName || "").toLowerCase();
  if (["input", "textarea", "select"].includes(tagName)) return;

  const forward = event.key === "ArrowRight" || event.key === "]";
  const backward = event.key === "ArrowLeft" || event.key === "[";
  if (!forward && !backward) return;

  const currentId = activeSection && activeSection.type === "chapter" ? activeSection.slug : "";
  let index = CHAPTER_IDS.indexOf(currentId);
  if (index < 0) index = forward ? -1 : 0;
  const nextIndex = index + (forward ? 1 : -1);
  if (nextIndex >= 0 && nextIndex < CHAPTER_IDS.length) {{
    event.preventDefault();
    const id = CHAPTER_IDS[nextIndex];
    history.pushState(null, "", "#" + id);
    scrollToId(id);
  }}
}});

function preferredTheme() {{
  const saved = localStorage.getItem("handbook-theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}}

function applyTheme(theme) {{
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "Dark" : "Light";
}}

themeToggle.addEventListener("click", () => {{
  const next = preferredTheme() === "dark" ? "light" : "dark";
  localStorage.setItem("handbook-theme", next);
  applyTheme(next);
}});

applyTheme(preferredTheme());

if (location.hash) {{
  const initial = sectionForId(location.hash.slice(1));
  if (initial) setActive(initial);
}} else {{
  setActive(activeSection);
}}
updateProgress();
</script>
<!-- Built with Python-Markdown {html.escape(markdown_version)}. Smart dash substitution is not enabled. -->
</body>
</html>
"""


def main() -> int:
    if not SOURCE.exists():
        print(f"Missing source: {SOURCE}", file=sys.stderr)
        return 1

    source_text = SOURCE.read_text(encoding="utf-8")
    parts, sections = parse_structure(source_text)
    markdown_with_ids = add_heading_ids(source_text, sections)
    content_html = add_evidence_badges(render_markdown(markdown_with_ids))
    output_html = build_html(content_html, parts, sections, markdown.__version__)
    OUTPUT.write_text(output_html, encoding="utf-8")

    part_count = sum(1 for part in parts if part.title != "Introduction")
    chapter_count = sum(len(part.chapters) for part in parts)
    print(f"Built {OUTPUT.relative_to(REPO_ROOT)}")
    print(f"Detected Parts: {part_count} plus Introduction")
    print(f"Detected Chapters: {chapter_count}")
    print("Navigation tree derived from headings:")
    for part in parts:
        if part.title == "Introduction":
            print(f"  {part.title}: 0 chapters")
        else:
            print(f"  {part.title}: {len(part.chapters)} chapters")
    print("Smart dash substitution: disabled (Python-Markdown smarty extension not enabled)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
