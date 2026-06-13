import type { FigureSpec } from "../figure-spec/schema.ts";
import { tokens } from "../design-tokens/tokens.ts";
import { syntheticGoldFixture } from "../fixtures/syntheticGoldFixtures.ts";
import { rect, text, arrow, ARROW_DEFS, esc } from "./svgPrimitives.ts";

const t = tokens.color;

export type ReviewStyle =
  | "two_state"
  | "sequence"
  | "timeline"
  | "matrix"
  | "chain"
  | "lifecycle"
  | "gate"
  | "stack";

type Point = { x: number; y: number };

function words(s: string, max = 42): string[] {
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
  fill?: string; size?: number; weight?: number; max?: number; leading?: number; mono?: boolean;
} = {}): number {
  const lines = words(s, opts.max ?? 42);
  const leading = opts.leading ?? ((opts.size ?? 13) + 5);
  lines.forEach((line, i) => parts.push(text(x, y + i * leading, line, opts)));
  return y + Math.max(1, lines.length) * leading;
}

function line(x1: number, y1: number, x2: number, y2: number, color = t.text.muted, sw = tokens.stroke.normal): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" />`;
}

function poly(points: Point[], color: string, sw = tokens.stroke.emphasis): string {
  const d = points.map((p) => `${p.x},${p.y}`).join(" ");
  return `<polyline points="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" />`;
}

function circle(x: number, y: number, r: number, fill: string, stroke = "none"): string {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${tokens.stroke.normal}" />`;
}

function pill(parts: string[], x: number, y: number, label: string, fill: string, w = 116): void {
  parts.push(rect(x, y, w, 28, { fill, stroke: fill, sw: 1, rx: 14 }));
  parts.push(text(x + w / 2, y + 18, label, { size: 11, weight: 700, anchor: "middle", fill: t.surface.canvas }));
}

function openSvg(spec: FigureSpec): string[] {
  const W = spec.export.width;
  const H = spec.export.height;
  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`);
  parts.push(ARROW_DEFS);
  parts.push(rect(0, 0, W, H, { fill: t.surface.canvas, rx: 0 }));
  parts.push(text(24, 34, spec.title, { size: 20, weight: 700 }));
  multi(parts, 24, 58, spec.teaching_objective, { size: 12, fill: t.text.secondary, max: 112 });
  return parts;
}

function closeSvg(parts: string[]): string {
  parts.push("</svg>");
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}

function evidenceRail(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  parts.push(rect(x, y, w, h, { fill: t.surface.panelRaised, stroke: t.state.watch, sw: 1 }));
  parts.push(text(x + 16, y + 28, "REQUIRED EVIDENCE", { size: 12, weight: 700, fill: t.text.secondary }));
  let yy = y + 54;
  for (const item of spec.required_evidence) {
    parts.push(rect(x + 14, yy, w - 28, 46, {
      fill: t.surface.panel,
      stroke: t.evidence.price,
      sw: 1,
      evidenceId: item.id,
    }));
    multi(parts, x + 28, yy + 19, item.label, { size: 11, max: 34, leading: 14 });
    yy += 54;
  }
  if (spec.forbidden_errors.length) {
    yy += 6;
    parts.push(text(x + 16, yy, "MUST NOT IMPLY", { size: 11, weight: 700, fill: t.risk.forbidden }));
    yy += 20;
    for (const f of spec.forbidden_errors.slice(0, 3)) {
      multi(parts, x + 18, yy, `- ${f.description}`, { size: 10, fill: t.text.muted, max: 38, leading: 13 });
      yy += 32;
    }
  }
}

function notesPanel(parts: string[], spec: FigureSpec, x: number, y: number, w: number): void {
  const fx = syntheticGoldFixture(spec);
  parts.push(rect(x, y, w, 82, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  parts.push(text(x + 14, y + 24, "DETERMINISTIC SYNTHETIC FIXTURE", { size: 10, weight: 700, fill: t.text.muted }));
  multi(parts, x + 14, y + 44, fx.headline, { size: 11, fill: t.text.secondary, max: Math.floor(w / 8.5), leading: 14 });
}

function phaseRail(parts: string[], spec: FigureSpec, x: number, y: number, w: number): void {
  const fx = syntheticGoldFixture(spec);
  const gap = w / Math.max(1, fx.phases.length - 1);
  parts.push(line(x, y, x + w, y, t.text.muted, 1.5));
  fx.phases.forEach((p, i) => {
    const px = x + i * gap;
    parts.push(circle(px, y, 8, i === 0 ? t.state.watch : i === fx.phases.length - 1 ? t.state.accepted : t.evidence.volume));
    multi(parts, px - 50, y + 28, p, { size: 10, fill: t.text.secondary, max: 14, leading: 12 });
  });
}

function drawTwoState(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  const fx = syntheticGoldFixture(spec);
  parts.push(rect(x, y, w, h, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  phaseRail(parts, spec, x + 72, y + 58, w - 144);
  const mid = x + w / 2;
  parts.push(line(mid, y + 110, mid, y + h - 24, t.text.muted, 1));

  const leftY = y + 146;
  parts.push(text(x + 32, leftY, "STATE A", { size: 11, weight: 700, fill: t.state.accepted }));
  parts.push(poly([{ x: x + 44, y: leftY + 86 }, { x: x + 138, y: leftY + 42 }, { x: x + 242, y: leftY + 70 }, { x: mid - 54, y: leftY + 24 }], t.state.accepted));
  parts.push(rect(x + 34, leftY + 118, mid - x - 68, 102, { fill: t.surface.panelRaised, stroke: t.state.accepted, sw: 1.5 }));
  multi(parts, x + 50, leftY + 144, fx.leftState ?? "Acceptance branch: response confirms value and continuation.", { size: 12, max: 42, leading: 16 });

  parts.push(text(mid + 32, leftY, "STATE B", { size: 11, weight: 700, fill: t.state.rejected }));
  parts.push(poly([{ x: mid + 44, y: leftY + 42 }, { x: mid + 138, y: leftY + 20 }, { x: mid + 220, y: leftY + 98 }, { x: x + w - 46, y: leftY + 130 }], t.state.rejected));
  parts.push(rect(mid + 34, leftY + 118, x + w - mid - 68, 102, { fill: t.surface.panelRaised, stroke: t.state.rejected, sw: 1.5 }));
  multi(parts, mid + 50, leftY + 144, fx.rightState ?? "Rejection branch: response fails and reverses through the reference.", { size: 12, max: 42, leading: 16 });
}

function drawSequence(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  const fx = syntheticGoldFixture(spec);
  parts.push(rect(x, y, w, h, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  phaseRail(parts, spec, x + 72, y + 56, w - 144);
  const baseY = y + 168;
  const stepW = Math.min(142, (w - 84) / fx.phases.length);
  fx.phases.forEach((p, i) => {
    const sx = x + 34 + i * (stepW + 12);
    parts.push(rect(sx, baseY + (i % 2) * 38, stepW, 92, {
      fill: i === fx.phases.length - 1 ? t.surface.panelRaised : t.surface.panel,
      stroke: i === fx.phases.length - 1 ? t.state.accepted : t.evidence.volume,
      sw: 1.5,
    }));
    parts.push(text(sx + 12, baseY + 24 + (i % 2) * 38, `STEP ${i + 1}`, { size: 10, weight: 700, fill: t.text.muted }));
    multi(parts, sx + 12, baseY + 48 + (i % 2) * 38, p, { size: 12, max: 16, leading: 15 });
    if (i < fx.phases.length - 1) {
      parts.push(arrow(sx + stepW + 2, baseY + 46 + (i % 2) * 38, sx + stepW + 12, baseY + 46 + ((i + 1) % 2) * 38));
    }
  });
  if (fx.leftState && fx.rightState) {
    parts.push(rect(x + 48, y + h - 112, w / 2 - 62, 72, { fill: t.surface.panelRaised, stroke: t.state.rejected, sw: 1.2 }));
    multi(parts, x + 64, y + h - 84, fx.leftState, { size: 11, max: 42, leading: 14 });
    parts.push(rect(x + w / 2 + 14, y + h - 112, w / 2 - 62, 72, { fill: t.surface.panelRaised, stroke: t.state.accepted, sw: 1.2 }));
    multi(parts, x + w / 2 + 30, y + h - 84, fx.rightState, { size: 11, max: 42, leading: 14 });
  }
}

function drawTimeline(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  const fx = syntheticGoldFixture(spec);
  parts.push(rect(x, y, w, h, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  const sessions = ["Asia", "London", "New York"];
  const widths = [0.25, 0.38, 0.37];
  let sx = x + 34;
  sessions.forEach((s, i) => {
    const sw = (w - 68) * widths[i];
    parts.push(rect(sx, y + 76, sw - 10, 132, { fill: i === 0 ? t.surface.panelRaised : t.surface.panel, stroke: [t.state.watch, t.state.rejected, t.state.accepted][i], sw: 1.5 }));
    parts.push(text(sx + 14, y + 104, s, { size: 14, weight: 700 }));
    multi(parts, sx + 14, y + 130, fx.rows?.[i] ?? fx.phases[i] ?? "", { size: 11, fill: t.text.secondary, max: 26, leading: 14 });
    if (i < 2) parts.push(arrow(sx + sw - 18, y + 142, sx + sw + 12, y + 142));
    sx += sw;
  });
  parts.push(poly([{ x: x + 56, y: y + 286 }, { x: x + 214, y: y + 250 }, { x: x + 392, y: y + 320 }, { x: x + 574, y: y + 284 }, { x: x + w - 60, y: y + 296 }], t.evidence.price));
  phaseRail(parts, spec, x + 76, y + h - 96, w - 152);
}

function drawMatrix(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  const fx = syntheticGoldFixture(spec);
  parts.push(rect(x, y, w, h, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  const rows = fx.rows ?? ["Layer 1", "Layer 2", "Layer 3", "Layer 4"];
  const rowH = 54;
  parts.push(text(x + 30, y + 42, "LAYER", { size: 11, weight: 700, fill: t.text.muted }));
  parts.push(text(x + 260, y + 42, "MECHANISM", { size: 11, weight: 700, fill: t.text.muted }));
  parts.push(text(x + w - 170, y + 42, "VERDICT", { size: 11, weight: 700, fill: t.text.muted }));
  rows.forEach((r, i) => {
    const yy = y + 62 + i * rowH;
    parts.push(rect(x + 22, yy, w - 44, rowH - 8, { fill: i % 2 ? t.surface.panel : t.surface.panelRaised, stroke: t.text.muted, sw: 0.5 }));
    multi(parts, x + 38, yy + 28, r, { size: 12, max: 26, leading: 14 });
    multi(parts, x + 260, yy + 28, i === rows.length - 1 ? "No causal repricing" : "Real-rate repricing chain", { size: 12, fill: t.text.secondary, max: 28, leading: 14 });
    pill(parts, x + w - 182, yy + 9, i === rows.length - 1 ? "CONFLICT" : "CONFIRM", i === rows.length - 1 ? t.state.rejected : t.state.accepted, 124);
  });
  parts.push(rect(x + 46, y + h - 98, w - 92, 58, { fill: t.surface.panelRaised, stroke: t.state.stalk, sw: 1.5 }));
  multi(parts, x + 62, y + h - 66, "Coherence count controls permission: confirmation upgrades size; conflicts cap or ban adds.", { size: 12, max: 86, leading: 15 });
}

function drawChain(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  const fx = syntheticGoldFixture(spec);
  parts.push(rect(x, y, w, h, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  const xs = [x + 58, x + 228, x + 398, x + 568, x + w - 140];
  const labels = fx.phases.slice(0, 5);
  labels.forEach((label, i) => {
    const yy = y + 126 + (i % 2) * 72;
    parts.push(rect(xs[i], yy, 128, 66, { fill: t.surface.panelRaised, stroke: i === 1 ? t.state.accepted : t.evidence.volume, sw: 1.5 }));
    multi(parts, xs[i] + 14, yy + 28, label, { size: 12, weight: 700, max: 16, leading: 14 });
    if (i < labels.length - 1) parts.push(arrow(xs[i] + 130, yy + 32, xs[i + 1] - 8, y + 158 + ((i + 1) % 2) * 72));
  });
  (fx.rows ?? []).forEach((r, i) => multi(parts, x + 58, y + h - 126 + i * 24, r, { size: 12, fill: t.text.secondary, max: 90, leading: 14 }));
}

function drawLifecycle(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  const fx = syntheticGoldFixture(spec);
  parts.push(rect(x, y, w, h, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  const states = ["INTACT", "WEAKENING", "INVALIDATED", "COMPLETE"];
  const colors = [t.state.accepted, t.state.stalk, t.risk.forbidden, t.evidence.price];
  states.forEach((s, i) => {
    const cx = x + 112 + i * ((w - 224) / 3);
    parts.push(circle(cx, y + 150, 48, t.surface.panelRaised, colors[i]));
    parts.push(text(cx, y + 154, s, { size: 11, weight: 700, anchor: "middle", fill: colors[i] }));
    if (i < states.length - 1) parts.push(arrow(cx + 54, y + 150, x + 112 + (i + 1) * ((w - 224) / 3) - 56, y + 150));
  });
  parts.push(rect(x + 54, y + 256, w - 108, 76, { fill: t.surface.panelRaised, stroke: t.state.watch, sw: 1.4 }));
  multi(parts, x + 72, y + 286, "Same +4.75 open P&L can be intact or weakening. Evidence against the written thesis sets state.", { size: 13, max: 90, leading: 16 });
  (fx.rows ?? []).forEach((r, i) => multi(parts, x + 74 + (i % 2) * 330, y + h - 126 + Math.floor(i / 2) * 30, r, { size: 12, fill: t.text.secondary, max: 34, leading: 14 }));
}

function drawGate(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  const fx = syntheticGoldFixture(spec);
  drawMatrix(parts, spec, x, y, w, h);
  parts.push(rect(x + w - 280, y + h - 172, 224, 74, { fill: t.surface.canvas, stroke: t.risk.forbidden, sw: 2 }));
  parts.push(text(x + w - 168, y + h - 126, "NO-TRADE", { size: 20, weight: 700, anchor: "middle", fill: t.risk.forbidden }));
  phaseRail(parts, spec, x + 72, y + h - 46, w - 144);
  (fx.rows ?? []).slice(0, 3).forEach((r, i) => multi(parts, x + 54, y + h - 156 + i * 24, r, { size: 11, fill: t.text.secondary, max: 36, leading: 13 }));
}

function drawStack(parts: string[], spec: FigureSpec, x: number, y: number, w: number, h: number): void {
  const fx = syntheticGoldFixture(spec);
  parts.push(rect(x, y, w, h, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  const layers = fx.phases;
  const colW = (w - 68) / 2;
  layers.forEach((layer, i) => {
    const col = i < 6 ? 0 : 1;
    const row = col ? i - 6 : i;
    const xx = x + 34 + col * (colW + 20);
    const yy = y + 40 + row * 54;
    parts.push(rect(xx, yy, colW, 42, { fill: t.surface.panelRaised, stroke: i < 5 ? t.state.stalk : t.state.watch, sw: 1 }));
    parts.push(text(xx + 14, yy + 26, `${i + 1}. ${layer}`, { size: 12, weight: 700 }));
    parts.push(text(xx + colW - 16, yy + 26, "output slot", { size: 10, anchor: "end", fill: t.text.muted }));
  });
  parts.push(arrow(x + w / 2, y + 46, x + w / 2, y + h - 54, t.state.accepted));
  (fx.rows ?? []).forEach((r, i) => multi(parts, x + 56 + i * 230, y + h - 56, r, { size: 11, fill: t.text.secondary, max: 26, leading: 13 }));
}

export function renderReviewSvg(spec: FigureSpec, style: ReviewStyle): string {
  const W = spec.export.width;
  const H = spec.export.height;
  const parts = openSvg(spec);
  const railW = Math.min(330, Math.max(292, Math.round(W * 0.28)));
  const mainX = 24;
  const mainY = 96;
  const mainW = W - railW - 64;
  const mainH = H - 218;
  const railX = W - railW - 24;

  notesPanel(parts, spec, mainX, H - 104, mainW);
  evidenceRail(parts, spec, railX, mainY, railW, H - mainY - 24);

  if (style === "two_state") drawTwoState(parts, spec, mainX, mainY, mainW, mainH);
  else if (style === "timeline") drawTimeline(parts, spec, mainX, mainY, mainW, mainH);
  else if (style === "matrix") drawMatrix(parts, spec, mainX, mainY, mainW, mainH);
  else if (style === "chain") drawChain(parts, spec, mainX, mainY, mainW, mainH);
  else if (style === "lifecycle") drawLifecycle(parts, spec, mainX, mainY, mainW, mainH);
  else if (style === "gate") drawGate(parts, spec, mainX, mainY, mainW, mainH);
  else if (style === "stack") drawStack(parts, spec, mainX, mainY, mainW, mainH);
  else drawSequence(parts, spec, mainX, mainY, mainW, mainH);

  return closeSvg(parts);
}
