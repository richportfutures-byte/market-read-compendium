import type { FigureSpec } from "../../figure-spec/schema.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { ARROW_DEFS, arrow, esc, rect, text } from "../svgPrimitives.ts";

const c = tokens.color;

type Point = { x: number; y: number };
type ProfileBar = { price: number; balance: number; trend: number };

const profileBars: ProfileBar[] = [
  { price: 6032, balance: 6, trend: 50 },
  { price: 6028, balance: 18, trend: 72 },
  { price: 6024, balance: 38, trend: 80 },
  { price: 6020, balance: 68, trend: 62 },
  { price: 6016, balance: 92, trend: 44 },
  { price: 6012, balance: 108, trend: 32 },
  { price: 6008, balance: 88, trend: 18 },
  { price: 6004, balance: 54, trend: 10 },
];

const balancePath: Point[] = [
  { x: 54, y: 166 },
  { x: 132, y: 124 },
  { x: 220, y: 164 },
  { x: 310, y: 126 },
  { x: 394, y: 168 },
];

const trendPath: Point[] = [
  { x: 54, y: 176 },
  { x: 136, y: 132 },
  { x: 224, y: 112 },
  { x: 314, y: 88 },
  { x: 404, y: 58 },
];

const balanceValueBands = [
  { y: 76, h: 30, label: "Prior value" },
  { y: 104, h: 30, label: "Overlap" },
  { y: 132, h: 30, label: "Today value" },
];

const trendValueBands = [
  { y: 144, h: 28, label: "Old value" },
  { y: 106, h: 28, label: "Migration" },
  { y: 68, h: 28, label: "New value" },
];

function line(x1: number, y1: number, x2: number, y2: number, color = c.text.muted, sw = tokens.stroke.normal): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" />`;
}

function polyline(points: Point[], color: string, sw = tokens.stroke.emphasis, evidenceId?: string): string {
  const ev = evidenceId ? ` data-evidence-id="${esc(evidenceId)}"` : "";
  return `<polyline points="${points.map((p) => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${ev} />`;
}

function labelBg(x: number, y: number, w: number, h: number, stroke = c.text.muted): string {
  return rect(x, y, w, h, { fill: c.surface.canvas, stroke, sw: 1, rx: 6 });
}

function smallLabel(parts: string[], x: number, y: number, label: string, fill = c.text.primary, w = 116): void {
  parts.push(labelBg(x, y, w, 24));
  parts.push(text(x + w / 2, y + 16, label, { size: 11, weight: 700, anchor: "middle", fill }));
}

function heading(parts: string[], x: number, y: number, title: string, sub: string, stroke: string): void {
  parts.push(rect(x, y, 532, 52, { fill: c.surface.panelRaised, stroke, sw: 1.5, rx: 8 }));
  parts.push(text(x + 18, y + 22, title, { size: 16, weight: 800, fill: stroke }));
  parts.push(text(x + 18, y + 42, sub, { size: 11, fill: c.text.secondary }));
}

function drawSharedOpeningPush(parts: string[], x: number, y: number, w: number): void {
  parts.push(rect(x, y, w, 78, { fill: c.surface.panel, stroke: c.state.watch, sw: 1.5, rx: 8 }));
  parts.push(text(x + 16, y + 24, "SAME FIRST TEN MINUTES", { size: 12, weight: 800, fill: c.text.secondary }));
  parts.push(text(x + 16, y + 47, "Identical push through 6024. The candle is deliberately not the classifier.", {
    size: 12,
    fill: c.text.primary,
  }));
  const px = x + 632;
  const py = y + 16;
  parts.push(line(px, py + 42, px + 286, py + 42, c.text.muted, 1));
  parts.push(polyline([
    { x: px + 8, y: py + 42 },
    { x: px + 78, y: py + 30 },
    { x: px + 150, y: py + 22 },
    { x: px + 228, y: py + 12 },
    { x: px + 278, y: py + 10 },
  ], c.evidence.price, 2.5));
  smallLabel(parts, px + 200, py + 34, "breaks 6024", c.evidence.price, 104);
}

function drawPriceAxis(parts: string[], x: number, y: number): void {
  parts.push(line(x, y, x, y + 278, c.text.muted, 1));
  for (const bar of profileBars) {
    const yy = priceY(y, bar.price);
    parts.push(line(x - 5, yy, x + 5, yy, c.text.muted, 1));
    parts.push(text(x - 12, yy + 4, String(bar.price), { size: 10, anchor: "end", fill: c.text.muted, mono: true }));
  }
}

function priceY(axisTop: number, price: number): number {
  return axisTop + (6032 - price) * 9;
}

function drawProfileBars(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
  evidenceOnFirst?: boolean;
}): void {
  const maxW = 130;
  const scale = opts.side === "balance" ? 1 : 1.22;
  profileBars.forEach((bar, i) => {
    const width = Math.round((opts.side === "balance" ? bar.balance : bar.trend) * scale);
    const yy = priceY(opts.y, bar.price) - 8;
    const isPoc = opts.side === "balance" ? bar.price === 6012 : bar.price === 6024;
    parts.push(rect(opts.x, yy, width, 16, {
      fill: isPoc ? c.evidence.price : c.evidence.volume,
      stroke: isPoc ? c.evidence.price : c.surface.panelRaised,
      sw: isPoc ? 1.5 : 0.5,
      rx: 3,
      evidenceId: opts.evidenceOnFirst && i === 0 ? "profile_shape" : undefined,
    }));
  });
  const shape = opts.side === "balance" ? "fat symmetric TPO bulge" : "elongated thin profile";
  smallLabel(parts, opts.x + maxW + 44, opts.y - 30, shape, c.evidence.volume, opts.side === "balance" ? 162 : 154);
}

function drawValueBehavior(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
}): void {
  const bands = opts.side === "balance" ? balanceValueBands : trendValueBands;
  bands.forEach((band, i) => {
    parts.push(rect(opts.x, opts.y + band.y, 186, band.h, {
      fill: opts.side === "balance" ? c.state.watch : c.state.accepted,
      stroke: c.surface.panelRaised,
      sw: 1,
      rx: 5,
      evidenceId: i === 1 ? "value_behavior" : undefined,
    }));
    parts.push(text(opts.x + 12, opts.y + band.y + 21, band.label, { size: 11, fill: c.surface.canvas, weight: 700 }));
  });
}

function drawRotations(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
}): void {
  const pts = (opts.side === "balance" ? balancePath : trendPath).map((p) => ({ x: opts.x + p.x, y: opts.y + p.y }));
  parts.push(polyline(pts, opts.side === "balance" ? c.state.watch : c.state.accepted, 3, "rotation_symmetry"));
  const label = opts.side === "balance" ? "comparable rotations" : "one-sided extension";
  smallLabel(parts, opts.x + 42, opts.y + 190, label, opts.side === "balance" ? c.state.watch : c.state.accepted, 154);
}

function drawPoc(parts: string[], opts: {
  x: number;
  axisTop: number;
  side: "balance" | "trend";
}): void {
  const y = priceY(opts.axisTop, opts.side === "balance" ? 6012 : 6024);
  const labelX = opts.side === "balance" ? opts.x + 234 : opts.x + 104;
  const labelY = opts.side === "balance" ? y - 38 : y + 16;
  const labelW = opts.side === "balance" ? 126 : 146;
  parts.push(line(opts.x + 72, y, opts.x + 256, y, c.evidence.price, 2.5));
  parts.push(rect(labelX, labelY, labelW, 26, {
    fill: c.surface.canvas,
    stroke: c.evidence.price,
    sw: 1,
    rx: 5,
    evidenceId: "poc_location",
  }));
  parts.push(text(labelX + labelW / 2, labelY + 17, opts.side === "balance" ? "POC parked 6012" : "POC trails price", {
    size: 11,
    weight: 800,
    anchor: "middle",
    fill: c.evidence.price,
  }));
}

function drawVolumeAtExtremes(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
}): void {
  const bars = opts.side === "balance"
    ? [
      { label: "low", h: 34 },
      { label: "mid", h: 88 },
      { label: "high", h: 28 },
    ]
    : [
      { label: "old", h: 32 },
      { label: "break", h: 72 },
      { label: "extension", h: 108 },
    ];
  parts.push(rect(opts.x, opts.y, 172, 132, { fill: c.surface.panelRaised, stroke: c.text.muted, sw: 1, rx: 8 }));
  parts.push(text(opts.x + 14, opts.y + 24, "EXTREME VOLUME", { size: 11, weight: 800, fill: c.text.secondary }));
  bars.forEach((bar, i) => {
    const bx = opts.x + 24 + i * 45;
    const by = opts.y + 108 - bar.h;
    parts.push(rect(bx, by, 24, bar.h, {
      fill: opts.side === "balance" ? c.state.rejected : c.state.accepted,
      stroke: "none",
      sw: 0,
      rx: 3,
      evidenceId: i === 2 ? "volume_at_extremes" : undefined,
    }));
    parts.push(text(bx + 12, opts.y + 122, bar.label, { size: 9, anchor: "middle", fill: c.text.muted }));
  });
  parts.push(text(opts.x + 14, opts.y + 48, opts.side === "balance" ? "contracts at high" : "expands on extension", {
    size: 10,
    fill: c.text.primary,
  }));
}

function drawTactic(parts: string[], x: number, y: number, title: string, body: string, stroke: string): void {
  parts.push(rect(x, y, 500, 52, { fill: c.surface.panelRaised, stroke, sw: 1.5, rx: 8 }));
  parts.push(text(x + 16, y + 22, title, { size: 12, weight: 800, fill: stroke }));
  parts.push(text(x + 16, y + 42, body, { size: 11, fill: c.text.primary }));
}

function drawRegime(parts: string[], opts: {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  side: "balance" | "trend";
  stroke: string;
}): void {
  heading(parts, opts.x, opts.y, opts.title, opts.subtitle, opts.stroke);
  const bodyY = opts.y + 66;
  const axisTop = bodyY + 72;
  parts.push(rect(opts.x, bodyY, 532, 448, { fill: c.surface.panel, stroke: opts.stroke, sw: 1.2, rx: 8 }));
  parts.push(text(opts.x + 18, bodyY + 28, "Developing profile", { size: 12, weight: 800, fill: c.text.secondary }));
  drawPriceAxis(parts, opts.x + 70, axisTop);
  drawProfileBars(parts, { x: opts.x + 84, y: axisTop, side: opts.side, evidenceOnFirst: true });
  drawValueBehavior(parts, { x: opts.x + 270, y: bodyY + 20, side: opts.side });
  drawRotations(parts, { x: opts.x + 56, y: bodyY + 142, side: opts.side });
  drawPoc(parts, { x: opts.x, axisTop, side: opts.side });
  drawVolumeAtExtremes(parts, { x: opts.x + 342, y: bodyY + 248, side: opts.side });
  const tacticTitle = opts.side === "balance" ? "TACTIC: fade extremes" : "TACTIC: trade with extension";
  const tacticBody = opts.side === "balance"
    ? "Failed 6026.75 top points back toward middle/opposite extreme 6004."
    : "Pullback holds 6024.25; value builds 6026-6032. Stop fading.";
  drawTactic(parts, opts.x + 16, bodyY + 382, tacticTitle, tacticBody, opts.stroke);
}

function evidenceSummary(parts: string[], x: number, y: number): void {
  parts.push(rect(x, y, 170, 500, { fill: c.surface.panelRaised, stroke: c.evidence.price, sw: 1.2, rx: 8 }));
  parts.push(text(x + 16, y + 26, "REQUIRED EVIDENCE", { size: 11, weight: 800, fill: c.text.secondary }));
  const items = [
    ["Profile shape", "fat profile vs thin profile"],
    ["Value behavior", "overlap vs migration"],
    ["Extreme volume", "contract vs expand"],
    ["Rotation quality", "rotations vs extension"],
    ["POC location", "central vs trailing POC"],
  ];
  let yy = y + 54;
  for (const [title, label] of items) {
    parts.push(rect(x + 14, yy, 142, 48, { fill: c.surface.panel, stroke: c.evidence.price, sw: 1, rx: 6 }));
    parts.push(text(x + 24, yy + 19, title, { size: 10, weight: 800, fill: c.evidence.price }));
    parts.push(text(x + 24, yy + 38, label, { size: 10, fill: c.text.primary }));
    yy += 62;
  }
  parts.push(text(x + 16, y + 394, "MUST NOT IMPLY", { size: 11, weight: 800, fill: c.risk.forbidden }));
  parts.push(text(x + 16, y + 422, "The candle classifies", { size: 10, fill: c.text.secondary }));
  parts.push(text(x + 16, y + 440, "the regime, or that", { size: 10, fill: c.text.secondary }));
  parts.push(text(x + 16, y + 458, "trend extension should", { size: 10, fill: c.text.secondary }));
  parts.push(text(x + 16, y + 476, "be faded.", { size: 10, fill: c.text.secondary }));
}

export function renderMarketProfileStatic(spec: FigureSpec, _opts: RenderOptions = {}): string {
  const W = spec.export.width;
  const H = spec.export.height;
  const parts: string[] = [];

  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`);
  parts.push(ARROW_DEFS);
  parts.push(rect(0, 0, W, H, { fill: c.surface.canvas, rx: 0 }));
  parts.push(text(24, 34, spec.title, { size: 21, weight: 800 }));
  parts.push(text(24, 58, "Same opening push. Opposite auction regimes. The auction, not the candle, selects the tactic.", {
    size: 13,
    fill: c.text.secondary,
  }));

  drawSharedOpeningPush(parts, 24, 82, 1042);
  evidenceSummary(parts, 1086, 82);
  parts.push(arrow(538, 160, 282, 198, c.state.watch));
  parts.push(arrow(552, 160, 846, 198, c.state.accepted));

  drawRegime(parts, {
    x: 24,
    y: 184,
    title: "BALANCE PROFILE",
    subtitle: "Rotates and fades from extremes",
    side: "balance",
    stroke: c.state.watch,
  });
  drawRegime(parts, {
    x: 554,
    y: 184,
    title: "TREND PROFILE",
    subtitle: "Migrates value and trades with extension",
    side: "trend",
    stroke: c.state.accepted,
  });

  parts.push(text(24, H - 20, "Reader check: identical opening push; profile, value, volume, rotations, and POC decide the regime.", {
    size: 11,
    fill: c.text.muted,
  }));
  parts.push("</svg>");
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}
