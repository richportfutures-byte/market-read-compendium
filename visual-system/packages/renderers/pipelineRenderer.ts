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

  const colY = 120;

  // --- Column 1: The Raw Event (Price Touch) ---
  const evX = 30;
  parts.push(text(evX, colY - 20, "RAW EVENT", { size: 11, fill: t.text.muted, weight: 700 }));
  parts.push(rect(evX, colY, 160, 100, { fill: t.surface.panel, stroke: t.surface.border, sw: 1 }));
  
  // Level line
  const levelY = colY + 30;
  parts.push(`<line x1="${evX + 10}" y1="${levelY}" x2="${evX + 150}" y2="${levelY}" stroke="${t.text.secondary}" stroke-width="1" stroke-dasharray="4 4" />`);
  parts.push(text(evX + 10, levelY - 6, "5484.00", { size: 10, fill: t.text.secondary, mono: true }));
  
  // Price path touching from below
  const touchX = evX + 110;
  parts.push(`<path d="M ${evX + 20} ${colY + 80} L ${evX + 50} ${colY + 60} L ${evX + 80} ${colY + 70} L ${touchX} ${levelY}" fill="none" stroke="${t.evidence.price}" stroke-width="2" />`);
  // Touch point
  parts.push(`<circle cx="${touchX}" cy="${levelY}" r="4" fill="${t.state.watch}" />`);
  parts.push(text(evX + 15, colY + 115, "Touch of level", { size: 12, fill: t.text.primary }));

  // --- The False Shortcut ---
  // Junior error: treating touch directly as a signal
  const fsY = colY + 160;
  parts.push(`<path d="M ${touchX} ${levelY + 5} Q ${touchX} ${fsY - 20} ${evX + 170} ${fsY}" fill="none" stroke="${t.state.rejected}" stroke-width="1.5" stroke-dasharray="2 2" marker-end="url(#arrow)" />`);
  parts.push(rect(evX + 180, fsY - 15, 140, 30, { fill: t.surface.panel, stroke: t.state.rejected, sw: 1 }));
  parts.push(text(evX + 190, fsY + 5, "Instant Execution", { size: 11, fill: t.state.rejected }));
  // Big Red X
  parts.push(`<line x1="${evX + 150}" y1="${fsY - 10}" x2="${evX + 170}" y2="${fsY + 10}" stroke="${t.state.rejected}" stroke-width="3" />`);
  parts.push(`<line x1="${evX + 170}" y1="${fsY - 10}" x2="${evX + 150}" y2="${fsY + 10}" stroke="${t.state.rejected}" stroke-width="3" />`);
  parts.push(text(evX + 180, fsY + 30, "FALSE SHORTCUT", { size: 10, fill: t.state.rejected, weight: 700 }));

  // --- Column 2: Evidence Gathering ---
  const gathX = 380;
  parts.push(text(gathX, colY - 20, "EVIDENCE GATHERING", { size: 11, fill: t.text.muted, weight: 700 }));
  // Arrow from Touch to Evidence
  parts.push(arrow(touchX + 10, levelY, gathX - 10, levelY));

  const gathW = 220;
  const cardH = 34;
  const gap = 8;
  let yy = colY;
  
  parts.push(rect(gathX - 10, yy - 10, gathW + 20, (cardH + gap) * spec.required_evidence.length + 10, { fill: t.surface.panelRaised, rx: 8, stroke: t.state.watch, sw: 1 }));

  for (const item of spec.required_evidence) {
    if (drop.has(item.id)) continue;
    parts.push(rect(gathX, yy, gathW, cardH, {
      fill: t.surface.panel, stroke: t.evidence.structure, sw: 1, evidenceId: item.id,
    }));
    parts.push(`<circle cx="${gathX + 16}" cy="${yy + cardH / 2}" r="3" fill="${t.state.watch}" />`);
    parts.push(text(gathX + 30, yy + 21, item.label, { size: 12 }));
    yy += cardH + gap;
  }

  // --- Column 3: Diverging Reads ---
  const readX = 650;
  parts.push(text(readX, colY - 20, "VALIDATED READ", { size: 11, fill: t.text.muted, weight: 700 }));
  
  // Rejection Read (Top)
  const rejY = colY;
  parts.push(arrow(gathX + gathW + 15, levelY - 20, readX - 10, rejY + 40));
  parts.push(rect(readX, rejY, 210, 90, { fill: t.surface.panel, stroke: t.state.rejected, sw: 1.5 }));
  
  const rLevelY = rejY + 30;
  parts.push(`<line x1="${readX + 10}" y1="${rLevelY}" x2="${readX + 120}" y2="${rLevelY}" stroke="${t.text.secondary}" stroke-width="1" stroke-dasharray="4 4" />`);
  // Absorption path (hits level, fails to break, flushes down)
  parts.push(`<path d="M ${readX + 10} ${rejY + 70} L ${readX + 30} ${rejY + 50} L ${readX + 45} ${rLevelY} L ${readX + 55} ${rejY + 40} L ${readX + 65} ${rLevelY} L ${readX + 80} ${rejY + 45} L ${readX + 100} ${rejY + 80}" fill="none" stroke="${t.state.rejected}" stroke-width="2" />`);
  
  parts.push(text(readX + 130, rejY + 25, "Absorption", { size: 12, fill: t.state.rejected, weight: 700 }));
  parts.push(text(readX + 130, rejY + 45, "No progression", { size: 11, fill: t.text.secondary }));
  parts.push(text(readX + 130, rejY + 65, "-> Rejection", { size: 11, fill: t.state.rejected }));

  // Acceptance Read (Bottom)
  const accY = colY + 115;
  parts.push(arrow(gathX + gathW + 15, levelY + 20, readX - 10, accY + 40));
  parts.push(rect(readX, accY, 210, 90, { fill: t.surface.panel, stroke: t.state.accepted, sw: 1.5 }));
  
  const aLevelY = accY + 50;
  parts.push(`<line x1="${readX + 10}" y1="${aLevelY}" x2="${readX + 120}" y2="${aLevelY}" stroke="${t.text.secondary}" stroke-width="1" stroke-dasharray="4 4" />`);
  // Lift and retest path (breaks above, pulls back to level, holds)
  parts.push(`<path d="M ${readX + 10} ${accY + 80} L ${readX + 35} ${accY + 60} L ${readX + 50} ${accY + 20} L ${readX + 70} ${aLevelY} L ${readX + 85} ${accY + 35} L ${readX + 105} ${accY + 15}" fill="none" stroke="${t.state.accepted}" stroke-width="2" />`);
  
  parts.push(text(readX + 130, accY + 25, "Lifts through", { size: 12, fill: t.state.accepted, weight: 700 }));
  parts.push(text(readX + 130, accY + 45, "Holds retest", { size: 11, fill: t.text.secondary }));
  parts.push(text(readX + 130, accY + 65, "-> Acceptance", { size: 11, fill: t.state.accepted }));

  // --- Column 4: Decisions ---
  const decX = 900;
  parts.push(text(decX, colY - 20, "DECISION", { size: 11, fill: t.text.muted, weight: 700 }));
  
  parts.push(arrow(readX + 215, rejY + 45, decX - 10, rejY + 45));
  parts.push(rect(decX, rejY + 10, 160, 60, { fill: t.surface.panelRaised, stroke: t.state.rejected, sw: 1.5 }));
  parts.push(text(decX + 20, rejY + 45, "Responsive short", { size: 13, weight: 700 }));

  parts.push(arrow(readX + 215, accY + 45, decX - 10, accY + 45));
  parts.push(rect(decX, accY + 10, 160, 60, { fill: t.surface.panelRaised, stroke: t.state.accepted, sw: 1.5 }));
  parts.push(text(decX + 20, accY + 45, "Continuation long", { size: 13, weight: 700 }));

  // Footer: one-line summary
  parts.push(text(24, H - 24, spec.concept, { size: 12, fill: t.text.muted }));

  parts.push(`</svg>`);
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}
