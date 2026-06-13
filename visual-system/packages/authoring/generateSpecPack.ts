import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

// Generates the complete 109-figure spec tree from the section-14 inventory in
// the manuscript. Every generated file has status "draft": it validates against
// the schema but is NOT rendered by the gate until a human promotes it to
// "validated" and fills the TODO fields. This makes the pack STRUCTURE turnkey
// without pretending the conceptual authoring is done. Existing files are never
// overwritten, so hand-authored gold specs are preserved.

const PLAN_DEFAULT = join(ROOT, "..", "manuscript", "Junior_Trader_Handbook_Combined_v2.md");

function slugId(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 48);
}
function slugSection(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const ruleFamilyByChapter: Record<string, string> = {
  CH01: "event_read_rules", CH02: "level_interaction_rules", CH03: "auction_profile_rules",
  CH04: "absorption_tape_rules", CH05: "momentum_sponsorship_rules", CH06: "trap_positioning_rules",
  CH07: "session_context_rules", CH08: "volatility_regime_rules", CH09: "intermarket_confirmation_rules",
  CH10: "catalyst_interpretation_rules", CH11: "trade_state_rules", CH12: "setup_quality_rules",
  CH13: "read_stack_rules",
};

// Map the inventory "Type" string to a figure_type + interaction + learning_mode.
function mapType(typeStr: string): { figure_type: string; interaction: string; learning_mode: string } {
  const t = typeStr.toLowerCase();
  const pick = (figure_type: string, interaction: string, learning_mode: string) => ({ figure_type, interaction, learning_mode });
  if (/pipeline/.test(t)) return pick("event_evidence_read_decision_pipeline", "reveal", "static_explanatory");
  if (/toggle|a\/b|before\/after|same.?distance|two-path/.test(t)) return pick("acceptance_rejection_comparison", "toggle", "toggle_comparison");
  if (/footprint|dom/.test(t)) return pick("footprint_dom_delta_sequence", "step_through", "step_through_sequence");
  if (/profile/.test(t) && /sequence|repair|migration/.test(t)) return pick("market_profile_sequence", "step_through", "step_through_sequence");
  if (/profile/.test(t)) return pick("market_profile_static", "none", "static_explanatory");
  if (/sequence|step-through|storyboard/.test(t)) return pick("trap_storyboard", "step_through", "step_through_sequence");
  if (/matrix|2x2|classification/.test(t)) return pick("classification_matrix", "classification", "classification_drill");
  if (/gate|decision/.test(t)) return pick("setup_quality_gate", "decision_gate", "gate_checklist");
  if (/regime|compression|expansion/.test(t)) return pick("volatility_regime_map", "toggle", "toggle_comparison");
  if (/band|statistical/.test(t)) return pick("rotation_size_band_chart", "none", "static_explanatory");
  if (/timeline|session/.test(t)) return pick("session_timeline", "none", "static_explanatory");
  if (/state machine|lifecycle/.test(t)) return pick("trade_state_lifecycle", "step_through", "step_through_sequence");
  if (/intermarket|confirmation matrix/.test(t)) return pick("intermarket_matrix", "none", "static_explanatory");
  if (/catalyst|transmission|chain/.test(t)) return pick("catalyst_transmission_chain", "step_through", "step_through_sequence");
  if (/card|scorecard|diagnostic|journal/.test(t)) return pick("diagnostic_card", "none", "static_explanatory");
  if (/comparison/.test(t)) return pick("acceptance_rejection_comparison", "toggle", "toggle_comparison");
  // default, flagged for human review
  return pick("price_path_level_interaction", "none", "static_explanatory");
}

type Row = { chapter: string; concept: string; type: string };

function parseInventory(md: string): Row[] {
  const lines = md.split("\n");
  const s14 = lines.findIndex((l) => /^## 14\. /.test(l));
  const s15 = lines.findIndex((l, i) => i > s14 && /^## 15\. /.test(l));
  const block = lines.slice(s14, s15 === -1 ? undefined : s15);
  const rows: Row[] = [];
  let chapter = "";
  for (const l of block) {
    const ch = l.match(/^### (CH\d{2})/);
    if (ch) { chapter = ch[1]; continue; }
    const cells = l.split("|").map((c) => c.trim()).filter((c) => c.length);
    if (chapter && cells.length === 3 && cells[0] !== "Concept" && !/^-+$/.test(cells[0])) {
      rows.push({ chapter, concept: cells[0], type: cells[1] });
    }
  }
  return rows;
}

export function generateSpecPack(planPath = PLAN_DEFAULT) {
  if (!existsSync(planPath)) throw new Error(`plan source not found at ${planPath}`);
  const rows = parseInventory(readFileSync(planPath, "utf8"));
  let created = 0, skipped = 0;
  const createdIds: string[] = [];

  for (const row of rows) {
    const id = `${row.chapter}_${slugId(row.concept)}_001`;
    const dir = join(ROOT, "specs", row.chapter);
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `${id}.json`);
    if (existsSync(file)) { skipped++; continue; }

    const m = mapType(row.type);
    const draft = {
      figure_id: id,
      version: "0.0.1-draft",
      chapter: row.chapter,
      tier: "TIER_2_CHAPTER_SUPPORT",
      status: "draft",
      title: row.concept,
      concept: row.concept,
      source_refs: [`${row.chapter}:${slugSection(row.concept)}`],
      teaching_objective: `TODO: state what ${row.concept} teaches the reader to do.`,
      junior_error: "TODO: state the specific junior mistake this prevents.",
      professional_read: "TODO: state the professional read.",
      decision_consequence: "TODO: state the decision that follows.",
      required_evidence: [
        { id: "todo_evidence", label: "TODO: define required evidence", required: true },
      ],
      forbidden_errors: [
        { id: "todo_forbidden", description: "TODO: define a misread this figure must not imply." },
      ],
      figure_type: m.figure_type,
      learning_mode: m.learning_mode,
      interaction: m.interaction,
      panels: [{ id: "main", role: "generic", title: row.concept }],
      annotations: [],
      fixture: { kind: "deterministic_synthetic", description: `TODO: fixture for ${row.concept} (mapped from "${row.type}").`, instruments: [] },
      outputs: ["static_svg", "interactive_html"],
      placement: { chapter: row.chapter, section_slug: slugSection(row.concept), position: "after_section_heading" },
      export: { width: 1100, height: 620 },
      qa: { domain_rule_family: ruleFamilyByChapter[row.chapter], render_evidence_check: false, visual_snapshot: false },
      acceptance_criteria: ["TODO: define acceptance criteria for this figure."],
    };
    writeFileSync(file, JSON.stringify(draft, null, 2));
    created++; createdIds.push(id);
  }
  return { total: rows.length, created, skipped, createdIds };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const planArg = process.argv[2];
  const r = generateSpecPack(planArg);
  console.log(`gen:specs  inventory ${r.total}, created ${r.created} drafts, skipped ${r.skipped} existing`);
}
