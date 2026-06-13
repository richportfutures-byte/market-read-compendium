import type { FigureSpec } from "../../figure-spec/schema.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import { rect, text, arrow, ARROW_DEFS, esc } from "../svgPrimitives.ts";

export function renderFootprintDomDeltaSequence(spec: FigureSpec, opts: RenderOptions = {}): string {
  const W = spec.export.width;
  const H = spec.export.height;
  const drop = new Set(opts.dropEvidenceIds ?? []);
  const t = tokens.color;
  const parts: string[] = [];

  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" `
    + `data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`);
  parts.push(ARROW_DEFS);
  parts.push(rect(0, 0, W, H, { fill: t.surface.canvas, rx: 0 }));

  parts.push(text(32, 40, spec.title, { size: 24, weight: 700 }));
  parts.push(text(32, 64, spec.teaching_objective, { size: 14, fill: t.text.secondary }));

  const topY = 100;
  const topH = 350;
  
  const col1X = 32;
  const col1W = 380;
  
  const col2X = 432;
  const col2W = 380;
  
  const col3X = 832;
  const col3W = W - 32 - 832; // 416

  // --- PANEL 1: PRICE PATH ---
  parts.push(rect(col1X, topY, col1W, topH, { fill: t.surface.panel, stroke: t.surface.border, sw: 1 }));
  parts.push(text(col1X + 16, topY + 24, "PRICE PATH", { size: 12, fill: t.text.muted, weight: 700 }));
  
  // Grid lines
  for (let i = 0; i < 5; i++) {
    const y = topY + 80 + i * 50;
    parts.push(`<line x1="${col1X}" y1="${y}" x2="${col1X + col1W}" y2="${y}" stroke="${t.surface.border}" stroke-width="1" />`);
  }
  // 5484.00 line is at topY + 130
  const levelY = topY + 130;
  parts.push(`<line x1="${col1X}" y1="${levelY}" x2="${col1X + col1W}" y2="${levelY}" stroke="${t.state.rejected}" stroke-width="2" stroke-dasharray="4 4" />`);
  parts.push(text(col1X + 10, levelY - 5, "5484.00 Ceiling", { size: 11, fill: t.state.rejected }));

  // Path
  const pPath = `M ${col1X + 30} ${levelY + 200} L ${col1X + 80} ${levelY + 120} L ${col1X + 120} ${levelY + 140} L ${col1X + 180} ${levelY} L ${col1X + 240} ${levelY} L ${col1X + 300} ${levelY} L ${col1X + 350} ${levelY + 150}`;
  parts.push(`<path d="${pPath}" fill="none" stroke="${t.text.primary}" stroke-width="3" />`);

  if (!drop.has("resolution_away")) {
    parts.push(`<g data-evidence-id="resolution_away">`);
    parts.push(arrow(col1X + 320, levelY + 50, col1X + 320, levelY + 120, t.state.rejected));
    parts.push(text(col1X + 220, levelY + 80, "Resolution away", { size: 12, fill: t.state.rejected }));
    parts.push(`</g>`);
  }

  // --- PANEL 2: FOOTPRINT ---
  parts.push(rect(col2X, topY, col2W, topH, { fill: t.surface.panel, stroke: t.surface.border, sw: 1 }));
  parts.push(text(col2X + 16, topY + 24, "FOOTPRINT (Bid x Ask)", { size: 12, fill: t.text.muted, weight: 700 }));

  const fpRows = [
    { p: "5484.50", b: "0", a: "0" },
    { p: "5484.25", b: "0", a: "0", noProg: true },
    { p: "5484.00", b: "0", a: "1850", agg: true },
    { p: "5483.75", b: "120", a: "80" },
    { p: "5483.50", b: "350", a: "20" },
    { p: "5483.25", b: "150", a: "10" }
  ];

  let fy = topY + 80;
  for (const r of fpRows) {
    if (r.agg && !drop.has("aggressive_volume")) {
      parts.push(`<g data-evidence-id="aggressive_volume">`);
      parts.push(rect(col2X + col2W/2 + 20, fy - 16, 60, 24, { fill: `${t.state.accepted}33`, rx: 4 }));
      parts.push(arrow(col2X + col2W - 20, fy - 4, col2X + col2W/2 + 85, fy - 4, t.state.accepted));
      parts.push(text(col2X + col2W - 25, fy + 12, "Aggressive volume", { size: 11, anchor: "end", fill: t.state.accepted }));
      parts.push(text(col2X + col2W/2 + 50, fy, r.a, { size: 13, mono: true, anchor: "middle", fill: t.state.accepted, weight: 700 }));
      parts.push(`</g>`);
    } else {
      parts.push(text(col2X + col2W/2 + 50, fy, r.a, { size: 13, mono: true, anchor: "middle", fill: t.text.primary }));
    }

    if (r.noProg && !drop.has("failure_to_progress")) {
      parts.push(`<g data-evidence-id="failure_to_progress">`);
      parts.push(rect(col2X + 40, fy - 16, col2W - 80, 24, { fill: "none", stroke: t.state.rejected, sw: 1.5, rx: 4 }));
      parts.push(text(col2X + col2W/2, fy - 22, "Failure to print through (0 x 0)", { size: 11, anchor: "middle", fill: t.state.rejected }));
      parts.push(`</g>`);
    }

    parts.push(text(col2X + col2W/2, fy, r.p, { size: 13, mono: true, anchor: "middle", weight: 700, fill: r.agg ? t.state.rejected : t.text.secondary }));
    parts.push(text(col2X + col2W/2 - 50, fy, r.b, { size: 13, mono: true, anchor: "middle", fill: t.text.primary }));
    fy += 45;
  }

  // --- PANEL 3: DOM LADDER ---
  parts.push(rect(col3X, topY, col3W, topH, { fill: t.surface.panel, stroke: t.surface.border, sw: 1 }));
  parts.push(text(col3X + 16, topY + 24, "DOM LADDER", { size: 12, fill: t.text.muted, weight: 700 }));
  
  parts.push(text(col3X + 60, topY + 50, "BIDS", { size: 10, fill: t.text.muted }));
  parts.push(text(col3X + col3W/2, topY + 50, "PRICE", { size: 10, fill: t.text.muted, anchor: "middle" }));
  parts.push(text(col3X + col3W - 60, topY + 50, "ASKS", { size: 10, fill: t.text.muted, anchor: "end" }));

  let dy = topY + 80;
  for (const r of fpRows) {
    parts.push(text(col3X + col3W/2, dy, r.p, { size: 13, mono: true, anchor: "middle", weight: 700 }));
    
    // Asks
    if (r.agg) {
      if (!drop.has("passive_reload")) {
        parts.push(`<g data-evidence-id="passive_reload">`);
        parts.push(rect(col3X + col3W/2 + 40, dy - 16, 80, 24, { fill: `${t.state.rejected}33`, rx: 4 }));
        parts.push(text(col3X + col3W/2 + 80, dy, "2000", { size: 13, mono: true, anchor: "middle", fill: t.state.rejected, weight: 700 }));
        parts.push(arrow(col3X + col3W - 20, dy - 4, col3X + col3W/2 + 125, dy - 4, t.state.rejected));
        parts.push(text(col3X + col3W - 25, dy + 12, "Passive reload (Iceberg)", { size: 11, anchor: "end", fill: t.state.rejected }));
        parts.push(`</g>`);
      } else {
        parts.push(text(col3X + col3W/2 + 80, dy, "2000", { size: 13, mono: true, anchor: "middle", fill: t.text.primary }));
      }
    } else {
      const askSize = r.p === "5484.50" ? "450" : (r.p === "5484.25" ? "320" : "");
      parts.push(text(col3X + col3W/2 + 80, dy, askSize, { size: 13, mono: true, anchor: "middle", fill: t.text.primary }));
    }

    // Bids
    const bidSize = (r.p === "5483.75" || r.p === "5483.50") ? "150" : "";
    parts.push(text(col3X + col3W/2 - 80, dy, bidSize, { size: 13, mono: true, anchor: "middle", fill: t.text.primary }));
    
    dy += 45;
  }

  // --- PANEL 4: DELTA CHART ---
  const dY = 470;
  const dH = 220;
  parts.push(rect(col1X, dY, W - 64, dH, { fill: t.surface.panel, stroke: t.surface.border, sw: 1 }));
  parts.push(text(col1X + 16, dY + 24, "CUMULATIVE DELTA", { size: 12, fill: t.text.muted, weight: 700 }));
  
  parts.push(`<line x1="${col1X}" y1="${dY + dH/2}" x2="${col1X + W - 64}" y2="${dY + dH/2}" stroke="${t.surface.border}" stroke-width="1" stroke-dasharray="2 2" />`);
  parts.push(text(col1X + 10, dY + dH/2 - 5, "0", { size: 10, fill: t.text.secondary }));

  const dPath = `M ${col1X + 30} ${dY + dH/2 + 30} L ${col1X + 80} ${dY + dH/2 + 10} L ${col1X + 120} ${dY + dH/2 - 20} L ${col1X + 180} ${dY + 40} L ${col1X + 240} ${dY + 30} L ${col1X + 300} ${dY + 20} L ${col1X + 350} ${dY + 30} L ${col1X + 450} ${dY + 50} L ${col1X + 600} ${dY + 50} L ${col1X + 1100} ${dY + 50}`;
  parts.push(`<path d="${dPath}" fill="none" stroke="${t.state.accepted}" stroke-width="3" />`);

  if (!drop.has("delta")) {
    parts.push(`<g data-evidence-id="delta">`);
    parts.push(`<path d="M ${col1X + 180} ${dY + 15} L ${col1X + 180} ${dY + 5} L ${col1X + 300} ${dY + 5} L ${col1X + 300} ${dY + 15}" fill="none" stroke="${t.evidence.structure}" stroke-width="1.5" />`);
    parts.push(text(col1X + 240, dY - 5, "Effort: Large positive delta climbs into level (+1800)", { size: 12, fill: t.evidence.structure, anchor: "middle" }));
    parts.push(`</g>`);
  }

  parts.push(text(32, H - 12, spec.concept, { size: 11, fill: t.text.muted }));

  parts.push(`</svg>`);
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}
