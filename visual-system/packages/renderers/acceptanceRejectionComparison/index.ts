import type { FigureSpec } from "../../figure-spec/schema.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import { rect, text, arrow, ARROW_DEFS, esc } from "../svgPrimitives.ts";

export function renderAcceptanceRejectionComparison(spec: FigureSpec, opts: RenderOptions = {}): string {
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
  parts.push(text(32, 40, spec.title, { size: 24, weight: 700 }));
  parts.push(text(32, 64, spec.teaching_objective, { size: 14, fill: t.text.secondary }));

  const colY = 120;
  const midX = W / 2;
  const levelY = 360;

  // Shared Reference Line
  parts.push(`<line x1="32" y1="${levelY}" x2="${W - 32}" y2="${levelY}" stroke="${t.text.secondary}" stroke-width="2" stroke-dasharray="6 6" />`);
  parts.push(text(midX - 100, levelY - 10, "Prior day high: 21,560", { size: 14, fill: t.text.secondary, mono: true, weight: 700 }));

  // --- ACCEPTANCE (LEFT) ---
  const leftX = 60;
  parts.push(text(leftX, colY, "ACCEPTANCE", { size: 18, fill: t.state.accepted, weight: 700 }));
  parts.push(text(leftX, colY + 20, "Time, volume, and value migrate above the level", { size: 12, fill: t.text.secondary }));

  // Price path
  const pathA = "M 80 480 L 140 300 L 200 330 L 280 230 L 340 260 L 420 180 L 460 200 L 520 140 L 560 160";
  parts.push(`<path d="${pathA}" fill="none" stroke="${t.state.accepted}" stroke-width="3" />`);

  if (!drop.has("time_volume_beyond_level")) {
    parts.push(`<path d="M 280 120 L 280 110 L 560 110 L 560 120" fill="none" stroke="${t.evidence.structure}" stroke-width="1.5" data-evidence-id="time_volume_beyond_level" />`);
    parts.push(text(420, 100, "40 minutes building beyond level", { size: 12, anchor: "middle" }));
  }

  if (!drop.has("pullback_structure")) {
    parts.push(rect(320, 250, 100, 24, { fill: t.surface.panelRaised, stroke: t.evidence.structure, sw: 1, evidenceId: "pullback_structure" }));
    parts.push(text(325, 266, "Pullback holds", { size: 11, fill: t.state.accepted }));
    parts.push(arrow(320, 262, 300, 262));
  }

  if (!drop.has("delta_on_return")) {
    parts.push(rect(450, 210, 100, 24, { fill: t.surface.panelRaised, stroke: t.evidence.structure, sw: 1, evidenceId: "delta_on_return" }));
    parts.push(text(455, 226, "Bid refresh (Δ+)", { size: 11, fill: t.state.accepted }));
  }

  // Acceptance Profile
  const profAX = 600;
  const profileA = [
    {y: 140, w: 20}, {y: 160, w: 40}, {y: 180, w: 70}, {y: 200, w: 100},
    {y: 220, w: 140}, {y: 240, w: 160, isPoc: true}, {y: 260, w: 130},
    {y: 280, w: 90}, {y: 300, w: 50}, {y: 320, w: 30}, // Above
    {y: 340, w: 40}, {y: 360, w: 20}, {y: 380, w: 20}, {y: 400, w: 30}, {y: 420, w: 15} // Below
  ];
  
  if (!drop.has("profile_shape")) {
    let shapeTags = `<g data-evidence-id="profile_shape">`;
    for (const p of profileA) {
      shapeTags += `<rect x="${profAX - p.w}" y="${p.y}" width="${p.w}" height="18" fill="${p.isPoc ? t.evidence.price : t.state.accepted + '55'}" />`;
    }
    shapeTags += `</g>`;
    parts.push(shapeTags);
  } else {
    for (const p of profileA) {
      parts.push(`<rect x="${profAX - p.w}" y="${p.y}" width="${p.w}" height="18" fill="${p.isPoc ? t.evidence.price : t.state.accepted + '55'}" />`);
    }
  }

  if (!drop.has("value_migration")) {
    parts.push(`<g data-evidence-id="value_migration">`);
    parts.push(arrow(profAX - 200, 249, profAX - 170, 249, t.evidence.structure));
    parts.push(text(profAX - 210, 253, "VAH/POC migrated above", { size: 12, anchor: "end", fill: t.evidence.price }));
    parts.push(`</g>`);
  }

  // --- REJECTION (RIGHT) ---
  const rightX = midX + 60;
  parts.push(text(rightX, colY, "REJECTION", { size: 18, fill: t.state.rejected, weight: 700 }));
  parts.push(text(rightX, colY + 20, "Fast probe, trapped longs, value remains below", { size: 12, fill: t.text.secondary }));

  // Price path
  const pathR = "M 720 480 L 800 360 L 860 140 L 920 180 L 980 380 L 1040 440 L 1100 420 L 1160 460";
  parts.push(`<path d="${pathR}" fill="none" stroke="${t.state.rejected}" stroke-width="3" />`);

  if (!drop.has("time_volume_beyond_level")) {
    parts.push(`<path d="M 860 120 L 860 110 L 920 110 L 920 120" fill="none" stroke="${t.evidence.structure}" stroke-width="1.5" data-evidence-id="time_volume_beyond_level" />`);
    parts.push(text(890, 100, "90-second spike", { size: 12, anchor: "middle" }));
  }

  // Trapped longs
  parts.push(rect(840, 130, 100, 60, { fill: `${t.state.rejected}33`, rx: 4, stroke: t.state.rejected, sw: 1 }));
  parts.push(text(850, 120, "Trapped Breakout Longs (Fuel)", { size: 11, fill: t.state.rejected, weight: 700 }));

  if (!drop.has("pullback_structure")) {
    parts.push(rect(950, 360, 120, 24, { fill: t.surface.panelRaised, stroke: t.evidence.structure, sw: 1, evidenceId: "pullback_structure" }));
    parts.push(text(955, 376, "Snap-back through", { size: 11, fill: t.state.rejected }));
    parts.push(arrow(950, 372, 920, 372));
  }

  if (!drop.has("delta_on_return")) {
    parts.push(rect(1020, 400, 120, 24, { fill: t.surface.panelRaised, stroke: t.evidence.structure, sw: 1, evidenceId: "delta_on_return" }));
    parts.push(text(1025, 416, "Negative Δ answers", { size: 11, fill: t.state.rejected }));
  }

  // Rejection Profile
  const profRX = W - 40;
  const profileR = [
    {y: 140, w: 10}, {y: 160, w: 10}, {y: 180, w: 10}, {y: 200, w: 10},
    {y: 220, w: 10}, {y: 240, w: 10}, {y: 260, w: 10}, {y: 280, w: 10},
    {y: 300, w: 15}, {y: 320, w: 25}, // Single-print excess tail above
    {y: 340, w: 50}, {y: 360, w: 80}, {y: 380, w: 130}, {y: 400, w: 150, isPoc: true}, 
    {y: 420, w: 110}, {y: 440, w: 70}, {y: 460, w: 40} // Heavy volume below
  ];

  if (!drop.has("profile_shape")) {
    let shapeTags = `<g data-evidence-id="profile_shape">`;
    for (const p of profileR) {
      shapeTags += `<rect x="${profRX - p.w}" y="${p.y}" width="${p.w}" height="18" fill="${p.isPoc ? t.evidence.price : t.state.rejected + '55'}" />`;
    }
    shapeTags += `</g>`;
    parts.push(shapeTags);
    parts.push(text(profRX - 120, 220, "Single-print excess", { size: 11, fill: t.text.secondary, anchor: "end" }));
    parts.push(arrow(profRX - 110, 216, profRX - 20, 216));
  } else {
    for (const p of profileR) {
      parts.push(`<rect x="${profRX - p.w}" y="${p.y}" width="${p.w}" height="18" fill="${p.isPoc ? t.evidence.price : t.state.rejected + '55'}" />`);
    }
  }

  if (!drop.has("value_migration")) {
    parts.push(`<g data-evidence-id="value_migration">`);
    parts.push(arrow(profRX - 180, 409, profRX - 160, 409, t.evidence.structure));
    parts.push(text(profRX - 190, 413, "POC anchored below", { size: 12, anchor: "end", fill: t.evidence.price }));
    parts.push(`</g>`);
  }

  parts.push(text(32, H - 24, spec.concept, { size: 12, fill: t.text.muted }));

  parts.push(`</svg>`);
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}
