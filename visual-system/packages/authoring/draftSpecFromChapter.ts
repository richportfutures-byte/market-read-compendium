import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

// Issue 3: the real bottleneck is writing ~150 conceptually correct spec cards by
// hand. This drafts a candidate card from the chapter prose so a human edits a
// draft instead of starting from a blank file. It is deliberately conservative:
// it extracts what it can and leaves clearly marked TODOs. The draft is written
// as *.draft.json and is IGNORED by the validator/registry until a human renames
// it. Throughput aid, not an authority.

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Pull the body of one "## Heading" section out of a chapter markdown file.
function extractSection(md: string, sectionTitle: string): string {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => l.startsWith("## ") && slugify(l.slice(3)) === slugify(sectionTitle));
  if (start === -1) throw new Error(`section "${sectionTitle}" not found`);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) { end = i; break; }
  }
  return lines.slice(start, end).join("\n");
}

function firstSentence(s: string): string {
  const m = s.replace(/\s+/g, " ").trim().match(/^(.*?[.!?])(\s|$)/);
  return (m ? m[1] : s).trim();
}

// Turn each "How Traders Identify It" bullet into a draft evidence item.
function evidenceFromIdentify(section: string): { id: string; label: string; required: boolean }[] {
  const block = section.split(/### How Traders Identify It/i)[1];
  if (!block) return [];
  const stop = block.split(/###/)[0];
  const bullets = stop.split("\n").filter((l) => l.trim().startsWith("- "));
  return bullets.map((b) => {
    const headRaw = b.replace(/^- /, "").split(":")[0].trim();
    return { id: slugify(headRaw).replace(/-/g, "_").slice(0, 40) || "evidence", label: headRaw, required: true };
  });
}

export function draftSpecFromChapter(args: {
  chapterFile: string; sectionTitle: string; figureId: string;
  chapter: string; figureType: string; ruleFamily: string;
}) {
  const md = readFileSync(args.chapterFile, "utf8");
  const section = extractSection(md, args.sectionTitle);

  const core = section.split(/### Core Concept/i)[1]?.split(/###/)[0] ?? "";
  const oneLine = section.split(/### One-Line Summary/i)[1]?.split(/###/)[0] ?? "";
  const juniorMatch = section.match(/[^.]*junior error[^.]*\./i);

  const draft = {
    figure_id: args.figureId,
    version: "0.0.1-draft",
    chapter: args.chapter,
    tier: "TIER_1_CANONICAL",
    status: "draft",
    title: args.sectionTitle,
    concept: firstSentence(oneLine.replace(/^[>\s]+/, "")) || "TODO: one-line concept",
    source_refs: [`${args.chapter}:${slugify(args.sectionTitle)}`],
    teaching_objective: firstSentence(core) || "TODO: teaching objective",
    junior_error: juniorMatch ? firstSentence(juniorMatch[0]) : "TODO: state the junior error",
    professional_read: "TODO: state the professional read (human review)",
    decision_consequence: "TODO: state the decision consequence (human review)",
    required_evidence: evidenceFromIdentify(section),
    forbidden_errors: [
      { id: "touch_as_signal", description: "Do not imply the touch itself is a signal." },
    ],
    figure_type: args.figureType,
    learning_mode: "static_explanatory",
    interaction: "reveal",
    outputs: ["static_svg", "interactive_html"],
    placement: { chapter: args.chapter, section_slug: slugify(args.sectionTitle), position: "after_in_practice" },
    export: { width: 1100, height: 360 },
    qa: { domain_rule_family: args.ruleFamily, render_evidence_check: true, visual_snapshot: true },
  };

  const outPath = join(ROOT, "specs", args.chapter, `${args.figureId}.draft.json`);
  writeFileSync(outPath, JSON.stringify(draft, null, 2));
  return { outPath, evidenceCount: draft.required_evidence.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = draftSpecFromChapter({
    chapterFile: join(ROOT, "chapters", "CH01.md"),
    sectionTitle: "The Read vs. The Touch",
    figureId: "CH01_TOUCH_VS_READ_001",
    chapter: "CH01",
    figureType: "event_evidence_read_decision_pipeline",
    ruleFamily: "event_read_rules",
  });
  console.log(`author:draft  drafted ${r.outPath}`);
  console.log(`  extracted ${r.evidenceCount} evidence items from prose; TODOs remain for human review.`);
}
