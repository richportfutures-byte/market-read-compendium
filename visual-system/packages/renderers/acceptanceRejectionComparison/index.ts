import type { FigureSpec } from "../../figure-spec/schema.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import { rect, text, arrow, ARROW_DEFS, esc } from "../svgPrimitives.ts";
import { renderReviewSvg } from "../reviewSvg.ts";

function words(s: string, max = 70): string[] {
  const out: string[] = [];
  let line = "";
  for (const w of s.split(/\s+/)) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > max && line) {
      out.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) out.push(line);
  return out;
}

function multi(parts: string[], x: number, y: number, s: string, opts: {
  fill?: string; size?: number; weight?: number; max?: number; leading?: number; anchor?: string; mono?: boolean;
} = {}): number {
  const lines = words(s, opts.max ?? 70);
  const leading = opts.leading ?? ((opts.size ?? 12) + 5);
  lines.forEach((line, i) => parts.push(text(x, y + i * leading, line, opts)));
  return y + Math.max(1, lines.length) * leading;
}

function line(x1: number, y1: number, x2: number, y2: number, color = tokens.color.text.muted, sw = tokens.stroke.normal, dash = ""): string {
  const dashed = dash ? ` stroke-dasharray="${dash}"` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}"${dashed} />`;
}

function poly(points: {x: number, y: number}[], color: string, sw = tokens.stroke.emphasis, dash = "", evidenceId = ""): string {
  const d = points.map((p) => `${p.x},${p.y}`).join(" ");
  const dashed = dash ? ` stroke-dasharray="${dash}"` : "";
  const ev = evidenceId ? ` data-evidence-id="${esc(evidenceId)}"` : "";
  return `<polyline points="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dashed}${ev} />`;
}

function circle(x: number, y: number, r: number, fill: string, stroke = "none"): string {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${tokens.stroke.normal}" />`;
}

function renderCh06DefendedVsTrapped(spec: FigureSpec, opts: RenderOptions = {}): string {
  const W = spec.export.width;
  const H = spec.export.height;
  const drop = new Set(opts.dropEvidenceIds ?? []);
  const t = tokens.color;

  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`);
  parts.push(ARROW_DEFS);
  parts.push(rect(0, 0, W, H, { fill: t.surface.canvas, rx: 0 }));

  // Regions
  const paddingX = 24;
  const railW = 280;
  const mainW = W - railW - paddingX * 3;
  const mainX = paddingX;
  const railX = W - paddingX - railW;

  const setupY = 80;
  const setupH = 180;
  const outcomesY = setupY + setupH + 16;
  const outcomeH = 260;
  const halfW = (mainW - 16) / 2;
  const leftX = mainX;
  const rightX = mainX + halfW + 16;

  const has = (id: string) => !drop.has(id);
  const ev = (id: string, body: string[]) => {
    if (has(id)) parts.push(`<g data-evidence-id="${esc(id)}">`, ...body, `</g>`);
  };

  // Title band
  parts.push(text(paddingX, 36, spec.title, { size: 23, weight: 700 }));
  multi(parts, paddingX, 60, spec.teaching_objective || spec.concept, { size: 13, fill: t.text.secondary, max: 120 });

  // Helper price scale
  const priceY = (price: number, yStart: number, yEnd: number) => {
    const min = 21420;
    const max = 21470;
    return yEnd - ((price - min) / (max - min)) * (yEnd - yStart);
  };

  // Shared Setup Region
  ev("shared_displacement_setup", [
    rect(mainX, setupY, mainW, setupH, { fill: t.surface.panel, stroke: t.text.muted, sw: 1, rx: 4 }),
    text(mainX + 16, setupY + 24, "SHARED SETUP: DISPLACEMENT BURST", { size: 11, weight: 700, fill: t.text.muted }),
    
    // Level 21,445
    line(mainX, priceY(21445, setupY + 40, setupY + setupH - 10), mainX + mainW, priceY(21445, setupY + 40, setupY + setupH - 10), t.evidence.price, 1.5, "6 4"),
    rect(mainX + 8, priceY(21445, setupY + 40, setupY + setupH - 10) - 10, 52, 20, { fill: t.surface.canvas, rx: 2 }),
    text(mainX + 12, priceY(21445, setupY + 40, setupY + setupH - 10) + 4, "21,445", { size: 11, fill: t.evidence.price, mono: true }),
    
    // Entrant zone 21,446 to 21,458
    rect(mainX + mainW * 0.4, priceY(21458, setupY + 40, setupY + setupH - 10), mainW * 0.4, priceY(21446, setupY + 40, setupY + setupH - 10) - priceY(21458, setupY + 40, setupY + setupH - 10), { fill: `${t.state.stalk}22`, stroke: t.state.stalk, sw: 1, rx: 2 }),
    text(mainX + mainW * 0.4 + 8, priceY(21458, setupY + 40, setupY + setupH - 10) + 16, "Entrant zone 21,446 to 21,458", { size: 11, fill: t.state.stalk }),
    
    // Stop pool under 21,440
    rect(mainX + mainW * 0.6, priceY(21440, setupY + 40, setupY + setupH - 10), mainW * 0.2, priceY(21428, setupY + 40, setupY + setupH - 10) - priceY(21440, setupY + 40, setupY + setupH - 10), { fill: `${t.state.rejected}22`, stroke: "none", rx: 2 }),
    text(mainX + mainW * 0.6 + 8, priceY(21434, setupY + 40, setupY + setupH - 10), "Stops densest under 21,440", { size: 11, fill: t.state.rejected }),
    
    // Path (Displacement)
    poly([
      {x: mainX + 50, y: priceY(21430, setupY + 40, setupY + setupH - 10)},
      {x: mainX + 120, y: priceY(21440, setupY + 40, setupY + setupH - 10)},
      {x: mainX + mainW * 0.4 + 20, y: priceY(21446, setupY + 40, setupY + setupH - 10)},
      {x: mainX + mainW * 0.5, y: priceY(21458, setupY + 40, setupY + setupH - 10)}
    ], t.evidence.volume, 3),
    arrow(mainX + mainW * 0.4 + 20, priceY(21446, setupY + 40, setupY + setupH - 10), mainX + mainW * 0.5, priceY(21458, setupY + 40, setupY + setupH - 10), t.evidence.volume),
    text(mainX + mainW * 0.5 + 10, priceY(21458, setupY + 40, setupY + setupH - 10) - 10, "Break of 21,445 bursts to 21,458 on +delta, 3x vol", { size: 11, fill: t.evidence.volume })
  ]);

  // Shared Scale Badge
  ev("shared_price_scale", [
    rect(mainX + mainW / 2 - 80, outcomesY - 8, 160, 16, { fill: t.surface.canvas, stroke: t.text.muted, sw: 1, rx: 8 }),
    text(mainX + mainW / 2, outcomesY + 3, "IDENTICAL PRICE SCALE", { size: 9, fill: t.text.muted, weight: 700, anchor: "middle" })
  ]);

  // Left Outcome: Trapped Branch
  parts.push(rect(leftX, outcomesY, halfW, outcomeH, { fill: t.surface.panel, stroke: t.text.muted, sw: 1, rx: 4 }));
  parts.push(text(leftX + 16, outcomesY + 24, "TRAPPED RESOLUTION", { size: 11, weight: 700, fill: t.state.rejected }));

  // Level lines inside panel
  parts.push(line(leftX, priceY(21445, outcomesY + 40, outcomesY + outcomeH - 10), leftX + halfW, priceY(21445, outcomesY + 40, outcomesY + outcomeH - 10), t.evidence.price, 1.5, "6 4"));

  // Entrant zone ghost
  parts.push(rect(leftX + 20, priceY(21458, outcomesY + 40, outcomesY + outcomeH - 10), halfW - 40, priceY(21446, outcomesY + 40, outcomesY + outcomeH - 10) - priceY(21458, outcomesY + 40, outcomesY + outcomeH - 10), { fill: `${t.state.stalk}11`, stroke: t.state.stalk, sw: 1, dash: "4 4", rx: 2 }));

  // Trapped trigger
  ev("trapped_reentry_trigger", [
    poly([
      {x: leftX + 40, y: priceY(21458, outcomesY + 40, outcomesY + outcomeH - 10)},
      {x: leftX + 100, y: priceY(21443, outcomesY + 40, outcomesY + outcomeH - 10)}
    ], t.state.rejected, 3),
    circle(leftX + 100, priceY(21443, outcomesY + 40, outcomesY + outcomeH - 10), 4, t.state.rejected),
    rect(leftX + 110, priceY(21443, outcomesY + 40, outcomesY + outcomeH - 10) - 10, 150, 20, { fill: t.surface.panelRaised, rx: 2, stroke: t.state.rejected, sw: 1 }),
    text(leftX + 116, priceY(21443, outcomesY + 40, outcomesY + outcomeH - 10) + 4, "21,443 reentry w/ speed", { size: 10, fill: t.state.rejected })
  ]);

  // Trapped cascade
  ev("trapped_forced_exit_cascade", [
    poly([
      {x: leftX + 100, y: priceY(21443, outcomesY + 40, outcomesY + outcomeH - 10)},
      {x: leftX + 160, y: priceY(21428, outcomesY + 40, outcomesY + outcomeH - 10)}
    ], t.state.rejected, 3),
    arrow(leftX + 130, priceY(21435, outcomesY + 40, outcomesY + outcomeH - 10), leftX + 160, priceY(21428, outcomesY + 40, outcomesY + outcomeH - 10), t.state.rejected),
    text(leftX + 170, priceY(21428, outcomesY + 40, outcomesY + outcomeH - 10) + 4, "Cascade to 21,428", { size: 10, fill: t.state.rejected })
  ]);

  // Right Outcome: Defended Branch
  parts.push(rect(rightX, outcomesY, halfW, outcomeH, { fill: t.surface.panel, stroke: t.text.muted, sw: 1, rx: 4 }));
  parts.push(text(rightX + 16, outcomesY + 24, "DEFENDED RESOLUTION", { size: 11, weight: 700, fill: t.state.accepted }));

  // Level lines inside panel
  parts.push(line(rightX, priceY(21445, outcomesY + 40, outcomesY + outcomeH - 10), rightX + halfW, priceY(21445, outcomesY + 40, outcomesY + outcomeH - 10), t.evidence.price, 1.5, "6 4"));

  // Entrant zone ghost
  parts.push(rect(rightX + 20, priceY(21458, outcomesY + 40, outcomesY + outcomeH - 10), halfW - 40, priceY(21446, outcomesY + 40, outcomesY + outcomeH - 10) - priceY(21458, outcomesY + 40, outcomesY + outcomeH - 10), { fill: `${t.state.stalk}11`, stroke: t.state.stalk, sw: 1, dash: "4 4", rx: 2 }));

  // Defended hold
  ev("defended_pullback_hold", [
    poly([
      {x: rightX + 40, y: priceY(21458, outcomesY + 40, outcomesY + outcomeH - 10)},
      {x: rightX + 80, y: priceY(21448, outcomesY + 40, outcomesY + outcomeH - 10)},
      {x: rightX + 110, y: priceY(21448, outcomesY + 40, outcomesY + outcomeH - 10)}
    ], t.state.accepted, 3),
    circle(rightX + 95, priceY(21448, outcomesY + 40, outcomesY + outcomeH - 10), 4, t.state.accepted),
    rect(rightX + 50, priceY(21448, outcomesY + 40, outcomesY + outcomeH - 10) + 12, 120, 20, { fill: t.surface.panelRaised, rx: 2, stroke: t.state.accepted, sw: 1 }),
    text(rightX + 56, priceY(21448, outcomesY + 40, outcomesY + outcomeH - 10) + 26, "Hold 21,448, bids refresh", { size: 10, fill: t.state.accepted })
  ]);

  // Defended value migration
  ev("defended_value_migration", [
    poly([
      {x: rightX + 110, y: priceY(21448, outcomesY + 40, outcomesY + outcomeH - 10)},
      {x: rightX + 180, y: priceY(21464, outcomesY + 40, outcomesY + outcomeH - 10)}
    ], t.state.accepted, 3),
    arrow(rightX + 145, priceY(21456, outcomesY + 40, outcomesY + outcomeH - 10), rightX + 180, priceY(21464, outcomesY + 40, outcomesY + outcomeH - 10), t.state.accepted),
    rect(rightX + 180, priceY(21464, outcomesY + 40, outcomesY + outcomeH - 10) - 30, 110, 20, { fill: t.surface.panelRaised, rx: 2, stroke: t.state.accepted, sw: 1 }),
    text(rightX + 186, priceY(21464, outcomesY + 40, outcomesY + outcomeH - 10) - 16, "Push prints 21,464", { size: 10, fill: t.state.accepted }),
    
    // Value blocks (building time)
    rect(rightX + 110, priceY(21458, outcomesY + 40, outcomesY + outcomeH - 10), 30, 8, { fill: `${t.state.accepted}66`, rx: 2 }),
    rect(rightX + 110, priceY(21454, outcomesY + 40, outcomesY + outcomeH - 10), 40, 8, { fill: `${t.state.accepted}88`, rx: 2 }),
    rect(rightX + 110, priceY(21450, outcomesY + 40, outcomesY + outcomeH - 10), 30, 8, { fill: `${t.state.accepted}66`, rx: 2 })
  ]);

  // Evidence Rail
  parts.push(rect(railX, setupY, railW, setupH + outcomeH + 16, { fill: t.surface.panelRaised, stroke: t.text.muted, sw: 1, rx: 4 }));
  parts.push(text(railX + 16, setupY + 24, "DECIDING EVIDENCE", { size: 11, weight: 700, fill: t.text.muted }));

  const railRows = [
    { n: "1", title: "Shared setup", desc: "Break to 21,458 entrant zone", color: t.evidence.volume },
    { n: "2", title: "Stop pool", desc: "Densest under 21,440", color: t.state.rejected },
    { n: "3", title: "Defended hold", desc: "Pullback holds 21,448", color: t.state.accepted },
    { n: "4", title: "Value migration", desc: "Push prints 21,464", color: t.state.accepted },
    { n: "5", title: "Trapped reentry", desc: "21,443 prints with speed", color: t.state.rejected },
    { n: "6", title: "Cascade", desc: "Forced exits to 21,428", color: t.state.rejected }
  ];

  railRows.forEach((row, i) => {
    const y = setupY + 44 + i * 56;
    parts.push(rect(railX + 14, y, railW - 28, 46, { fill: t.surface.panel, stroke: row.color, sw: 1, rx: 4 }));
    parts.push(circle(railX + 32, y + 23, 11, row.color));
    parts.push(text(railX + 32, y + 27, row.n, { size: 10, weight: 700, fill: t.surface.canvas, anchor: "middle" }));
    parts.push(text(railX + 52, y + 20, row.title, { size: 11, weight: 700, fill: row.color }));
    parts.push(text(railX + 52, y + 36, row.desc, { size: 10, fill: t.text.secondary }));
  });

  parts.push(rect(railX + 14, setupY + setupH + outcomeH + 16 - 44, railW - 28, 30, { fill: t.surface.canvas, stroke: t.text.muted, sw: 1, rx: 4 }));
  parts.push(text(railX + 28, setupY + setupH + outcomeH + 16 - 24, "Wait for outcome. Do not fade break.", { size: 10, fill: t.text.secondary, weight: 700 }));

  // Caption/footer
  multi(parts, paddingX, H - 40, spec.concept, { size: 11, fill: t.text.muted, max: 140 });

  parts.push(`</svg>`);
  return parts.join("\\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}

export function renderAcceptanceRejectionComparison(spec: FigureSpec, opts: RenderOptions = {}): string {
  if (spec.figure_id === "CH06_DEFENDED_BREAKOUT_VS_TRAPPED_BREAKOUT_001") {
    return renderCh06DefendedVsTrapped(spec, opts);
  }
  return renderReviewSvg(spec, "comparison");
}
