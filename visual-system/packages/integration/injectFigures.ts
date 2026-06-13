import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRegistry } from "../figure-registry/registry.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

// Issue 4: figures must land at the exact spot in the chapter where the concept
// is taught, or you have a gallery next to a book instead of an illustrated book.
// Each spec carries `placement`. This reads the registry, finds each figure's
// chapter section, and injects an embed block pointing at the exported SVG.

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function embedBlock(figureId: string): string {
  return [
    ``,
    `<!-- FIGURE:${figureId} (auto-injected) -->`,
    `<figure data-figure-id="${figureId}">`,
    `  <img src="../out/svg/${figureId}.svg" alt="${figureId}" />`,
    `</figure>`,
    ``,
  ].join("\n");
}

// Find the line index to insert at, based on placement.position.
function insertIndexFor(lines: string[], placement: any): number {
  if (placement.position === "at_marker" && placement.marker) {
    const i = lines.findIndex((l) => l.includes(placement.marker));
    if (i !== -1) return i + 1;
  }
  // locate the section heading
  const head = lines.findIndex((l) => l.startsWith("## ") && slugify(l.slice(3)) === placement.section_slug);
  if (head === -1) throw new Error(`section_slug "${placement.section_slug}" not found in chapter`);

  // section end = next "## " or EOF
  let sectionEnd = lines.length;
  for (let i = head + 1; i < lines.length; i++) if (lines[i].startsWith("## ")) { sectionEnd = i; break; }

  if (placement.position === "after_section_heading") return head + 1;

  if (placement.position === "after_in_practice") {
    for (let i = head + 1; i < sectionEnd; i++) {
      if (/^###\s+In Practice/i.test(lines[i])) {
        // end of the In Practice subsection = next "### " or section end
        for (let j = i + 1; j < sectionEnd; j++) if (lines[j].startsWith("### ")) return j;
        return sectionEnd;
      }
    }
    return sectionEnd; // fall back to end of section
  }
  return sectionEnd;
}

export function injectFigures(): { chaptersWritten: string[]; injected: string[]; skipped: string[] } {
  const reg = buildRegistry();
  const byChapterFile = new Map<string, typeof reg.entries>();
  // Only validated figures are placed. Drafts have placeholder placements that
  // do not bind to real headings yet, so they are not injected until promoted.
  for (const e of reg.entries) {
    if (e.status !== "validated" && e.status !== "exported") continue;
    const file = join(ROOT, "chapters", `${e.chapter}.md`);
    if (!existsSync(file)) continue;
    (byChapterFile.get(file) ?? byChapterFile.set(file, []).get(file)!).push(e);
  }

  const chaptersWritten: string[] = [];
  const injected: string[] = [];
  const skipped: string[] = [];

  for (const [file, entries] of byChapterFile) {
    let lines = readFileSync(file, "utf8").split("\n");
    const planned: { id: string; at: number }[] = [];
    for (const e of entries) {
      try {
        planned.push({ id: e.figure_id, at: insertIndexFor(lines, e.spec.placement) });
      } catch {
        skipped.push(e.figure_id); // section not found yet; leave for human binding
      }
    }
    planned.sort((a, b) => b.at - a.at); // insert bottom-up so indices stay valid
    for (const p of planned) {
      lines.splice(p.at, 0, embedBlock(p.id));
      injected.push(p.id);
    }
    const outFile = file.replace(/\.md$/, ".injected.md");
    writeFileSync(outFile, lines.join("\n"));
    chaptersWritten.push(outFile);
  }
  return { chaptersWritten, injected, skipped };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = injectFigures();
  console.log(`inject:chapters  injected ${r.injected.length}, skipped ${r.skipped.length} (unresolved/section pending) into ${r.chaptersWritten.length} chapter file(s)`);
  for (const f of r.chaptersWritten) console.log(`  - ${f}`);
}
