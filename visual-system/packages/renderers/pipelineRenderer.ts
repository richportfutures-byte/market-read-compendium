import type { FigureSpec } from "../figure-spec/schema.ts";
import { tokens } from "../design-tokens/tokens.ts";
import { rect, text, arrow, ARROW_DEFS, esc } from "./svgPrimitives.ts";

export type RenderOptions = {
  // Test hook only: simulate a renderer bug by skipping an evidence element,
  // so the render-evidence QA (issue 1) can be shown catching it. Never used in
  // real rendering.
  dropEvidenceIds?: string[];
};

// event_evidence_read_decision_pipeline renderer.
// Draws: Touch event -> Evidence cards -> two Reads -> two Decision states.
// Each evidence card stamps data-evidence-id, which the render QA verifies.
export function renderPipeline(spec: FigureSpec, opts: RenderOptions = {}): string {
  const W = spec.export.width;
  const H = spec.export.height;
  const drop = new Set(opts.dropEvidenceIds ?? []);
  const t = tokens.color;

  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" `
    + `data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`);
  parts.push(ARROW_DEFS);
  parts.push(rect(0, 0, W, H, { fill: t.surface.canvas, rx: 0 }));

  // Header
  parts.push(text(24, 34, spec.title, { size: 18, weight: 700 }));
  parts.push(text(24, 56, spec.teaching_objective, { size: 12, fill: t.text.secondary }));

  // Column 1: the Touch event
  const colY = 96;
  parts.push(rect(24, colY, 150, 70, { fill: t.surface.panelRaised, stroke: t.state.watch, sw: 1.5 }));
  parts.push(text(36, colY + 26, "EVENT", { size: 11, fill: t.text.muted, weight: 700 }));
  parts.push(text(36, colY + 48, "Touch of 5484.00", { size: 13 }));

  // Column 2: Evidence cards, one per required evidence item
  const evX = 210;
  const evW = 250;
  const cardH = 40;
  const gap = 10;
  const evidence = spec.required_evidence;
  let yy = colY - 8;
  parts.push(text(evX, yy, "EVIDENCE ON THE TAPE", { size: 11, fill: t.text.muted, weight: 700 }));
  yy += 8;
  for (const item of evidence) {
    if (drop.has(item.id)) continue; // simulated omission for the negative demo
    parts.push(rect(evX, yy, evW, cardH, {
      fill: t.surface.panel, stroke: t.evidence.price, sw: 1, evidenceId: item.id,
    }));
    parts.push(text(evX + 12, yy + 25, item.label, { size: 12 }));
    yy += cardH + gap;
  }

  // Arrow event -> evidence
  parts.push(arrow(174, colY + 35, evX - 6, colY + 35));

  // Column 3: two Reads
  const rX = evX + evW + 56;
  parts.push(arrow(evX + evW + 6, colY + 35, rX - 6, colY + 35));
  parts.push(text(rX, colY - 8, "READ", { size: 11, fill: t.text.muted, weight: 700 }));
  parts.push(rect(rX, colY, 200, 70, { fill: t.surface.panel, stroke: t.state.rejected, sw: 1.5 }));
  parts.push(text(rX + 12, colY + 24, "Absorption, no progression", { size: 12, fill: t.state.rejected }));
  parts.push(text(rX + 12, colY + 46, "-> Rejection", { size: 12, fill: t.text.secondary }));

  parts.push(rect(rX, colY + 96, 200, 70, { fill: t.surface.panel, stroke: t.state.accepted, sw: 1.5 }));
  parts.push(text(rX + 12, colY + 120, "Lifts through, holds retest", { size: 12, fill: t.state.accepted }));
  parts.push(text(rX + 12, colY + 142, "-> Acceptance", { size: 12, fill: t.text.secondary }));

  // Column 4: Decision states
  const dX = rX + 232;
  parts.push(text(dX, colY - 8, "DECISION", { size: 11, fill: t.text.muted, weight: 700 }));
  parts.push(arrow(rX + 206, colY + 35, dX - 6, colY + 35));
  parts.push(rect(dX, colY, 150, 70, { fill: t.surface.panelRaised, stroke: t.state.rejected, sw: 1.5 }));
  parts.push(text(dX + 12, colY + 40, "Responsive short", { size: 12 }));

  parts.push(arrow(rX + 206, colY + 131, dX - 6, colY + 131));
  parts.push(rect(dX, colY + 96, 150, 70, { fill: t.surface.panelRaised, stroke: t.state.accepted, sw: 1.5 }));
  parts.push(text(dX + 12, colY + 136, "Continuation long", { size: 12 }));

  // Footer: one-line summary
  parts.push(text(24, H - 24, spec.concept, { size: 12, fill: t.text.muted }));

  parts.push(`</svg>`);
  // Mark export-ready only once the full string is assembled (no async paint).
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}
