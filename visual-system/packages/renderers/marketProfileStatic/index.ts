import type { FigureSpec } from "../../figure-spec/schema.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { esc, rect, text } from "../svgPrimitives.ts";

const c = tokens.color;

type Point = { x: number; y: number };
type ProfileRow = { price: number; balance: number; trend: number };

const rows: ProfileRow[] = [
  { price: 6032, balance: 10, trend: 70 },
  { price: 6028, balance: 34, trend: 104 },
  { price: 6024, balance: 74, trend: 112 },
  { price: 6020, balance: 116, trend: 78 },
  { price: 6016, balance: 138, trend: 48 },
  { price: 6012, balance: 150, trend: 30 },
  { price: 6008, balance: 118, trend: 18 },
  { price: 6004, balance: 58, trend: 10 },
];

const balanceRotation: Point[] = [
  { x: 52, y: 292 },
  { x: 118, y: 246 },
  { x: 184, y: 288 },
  { x: 250, y: 246 },
  { x: 318, y: 290 },
];

const trendExtension: Point[] = [
  { x: 52, y: 314 },
  { x: 124, y: 268 },
  { x: 196, y: 238 },
  { x: 270, y: 202 },
  { x: 344, y: 154 },
];

function line(x1: number, y1: number, x2: number, y2: number, color = c.text.muted, sw = tokens.stroke.normal): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" />`;
}

function polyline(points: Point[], color: string, sw = tokens.stroke.emphasis, evidenceId?: string): string {
  const ev = evidenceId ? ` data-evidence-id="${esc(evidenceId)}"` : "";
  return `<polyline points="${points.map((p) => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${ev} />`;
}

function circle(cx: number, cy: number, r: number, opts: { fill?: string; stroke?: string; sw?: number } = {}): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${opts.fill ?? c.surface.panel}" stroke="${opts.stroke ?? "none"}" stroke-width="${opts.sw ?? 0}" />`;
}

function label(parts: string[], x: number, y: number, labelText: string, opts: {
  w: number;
  color?: string;
  fill?: string;
  size?: number;
  evidenceId?: string;
}): void {
  parts.push(rect(x, y, opts.w, 28, {
    fill: opts.fill ?? c.surface.canvas,
    stroke: opts.color ?? c.text.muted,
    sw: 1,
    rx: 7,
    evidenceId: opts.evidenceId,
  }));
  parts.push(text(x + opts.w / 2, y + 18, labelText, {
    size: opts.size ?? 11,
    weight: 800,
    anchor: "middle",
    fill: opts.color ?? c.text.primary,
  }));
}

function priceY(axisTop: number, price: number): number {
  return axisTop + (6032 - price) * 8.4;
}

function drawTitle(parts: string[], spec: FigureSpec): void {
  parts.push(text(36, 44, spec.title, { size: 24, weight: 800 }));
  parts.push(text(36, 72, "Same first-ten-minute push. Opposite trades. The auction regime, not the candle, decides.", {
    size: 13,
    fill: c.text.secondary,
  }));
}

function drawSharedBridge(parts: string[]): void {
  const x = 36;
  const y = 96;
  const w = 968;
  parts.push(rect(x, y, w, 94, { fill: c.surface.panel, stroke: c.text.muted, sw: 1.2, rx: 8 }));
  parts.push(text(x + 22, y + 28, "Shared reference: the opening push is identical", {
    size: 13,
    weight: 800,
    fill: c.text.primary,
  }));
  parts.push(text(x + 22, y + 54, "Both reads push through 6024. The profile that forms around it creates two opposite tactic families.", {
    size: 12,
    fill: c.text.secondary,
  }));

  const chartX = x + 566;
  const chartY = y + 18;
  parts.push(line(chartX, chartY + 48, chartX + 286, chartY + 48, c.text.muted, 1));
  parts.push(text(chartX + 292, chartY + 52, "6024", { size: 10, fill: c.text.muted, mono: true }));
  parts.push(polyline([
    { x: chartX + 10, y: chartY + 48 },
    { x: chartX + 78, y: chartY + 36 },
    { x: chartX + 152, y: chartY + 26 },
    { x: chartX + 226, y: chartY + 16 },
    { x: chartX + 276, y: chartY + 14 },
  ], c.evidence.price, 3));
  label(parts, chartX + 182, chartY + 52, "same candle", { w: 112, color: c.evidence.price });

  parts.push(line(x + 244, y + 94, x + 244, y + 118, c.state.watch, 1.5));
  parts.push(line(x + 724, y + 94, x + 724, y + 118, c.state.accepted, 1.5));
  parts.push(text(x + 164, y + 116, "auction evidence rotates", { size: 10, fill: c.state.watch }));
  parts.push(text(x + 630, y + 116, "auction evidence migrates", { size: 10, fill: c.state.accepted }));
}

function drawPriceScale(parts: string[], x: number, axisTop: number): void {
  parts.push(line(x, axisTop, x, axisTop + 236, c.text.muted, 1));
  for (const row of rows) {
    const yy = priceY(axisTop, row.price);
    parts.push(line(x - 5, yy, x + 5, yy, c.text.muted, 1));
    parts.push(text(x - 12, yy + 4, String(row.price), { size: 9, anchor: "end", fill: c.text.muted, mono: true }));
  }
}

function drawProfile(parts: string[], opts: {
  x: number;
  axisTop: number;
  side: "balance" | "trend";
  color: string;
}): void {
  const rowH = 13;
  for (const row of rows) {
    const width = opts.side === "balance" ? row.balance : row.trend;
    const yy = priceY(opts.axisTop, row.price) - rowH / 2;
    const isPoc = opts.side === "balance" ? row.price === 6012 : row.price === 6024;
    parts.push(rect(opts.x, yy, width, rowH, {
      fill: isPoc ? c.evidence.price : c.evidence.volume,
      stroke: isPoc ? c.evidence.price : c.surface.panelRaised,
      sw: isPoc ? 1.4 : 0.5,
      rx: 3,
      evidenceId: row.price === 6032 ? "profile_shape" : undefined,
    }));
  }
  label(parts, opts.x + (opts.side === "balance" ? 12 : 20), opts.axisTop - 42,
    opts.side === "balance" ? "fat symmetric profile" : "thin elongated profile", {
      w: opts.side === "balance" ? 166 : 174,
      color: opts.color,
    });
}

function drawValueStack(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
}): void {
  if (opts.side === "balance") {
    const bands = [
      { y: 0, label: "Prior value" },
      { y: 36, label: "Overlap" },
      { y: 72, label: "Today value" },
    ];
    for (const [i, band] of bands.entries()) {
      parts.push(rect(opts.x + i * 10, opts.y + band.y, 178, 32, {
        fill: c.state.watch,
        stroke: c.surface.panelRaised,
        sw: 1,
        rx: 6,
        evidenceId: i === 1 ? "value_behavior" : undefined,
      }));
      parts.push(text(opts.x + 14 + i * 10, opts.y + band.y + 21, band.label, {
        size: 11,
        weight: 800,
        fill: c.surface.canvas,
      }));
    }
    label(parts, opts.x + 24, opts.y + 112, "value overlaps", { w: 138, color: c.state.watch });
    return;
  }

  const bands = [
    { x: 0, y: 88, label: "Old value" },
    { x: 24, y: 46, label: "Migrating value" },
    { x: 48, y: 4, label: "New value" },
  ];
  for (const [i, band] of bands.entries()) {
    parts.push(rect(opts.x + band.x, opts.y + band.y, 190, 32, {
      fill: c.state.accepted,
      stroke: c.surface.panelRaised,
      sw: 1,
      rx: 6,
      evidenceId: i === 1 ? "value_behavior" : undefined,
    }));
    parts.push(text(opts.x + band.x + 14, opts.y + band.y + 21, band.label, {
      size: 11,
      weight: 800,
      fill: c.surface.canvas,
    }));
  }
  label(parts, opts.x + 64, opts.y + 124, "value migrates", { w: 138, color: c.state.accepted });
}

function drawPoc(parts: string[], opts: {
  x: number;
  axisTop: number;
  side: "balance" | "trend";
  color: string;
}): void {
  const price = opts.side === "balance" ? 6012 : 6024;
  const y = priceY(opts.axisTop, price);
  const labelText = opts.side === "balance" ? "POC parked near 6012" : "POC trails price";
  const labelX = opts.side === "balance" ? opts.x + 18 : opts.x + 178;
  const labelY = opts.side === "balance" ? y - 72 : y + 16;
  parts.push(line(opts.x, y, opts.x + 286, y, c.evidence.price, 2.4));
  label(parts, labelX, labelY, labelText, {
    w: opts.side === "balance" ? 154 : 136,
    color: c.evidence.price,
    evidenceId: "poc_location",
  });
}

function drawRotationOrExtension(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
  color: string;
}): void {
  const points = (opts.side === "balance" ? balanceRotation : trendExtension)
    .map((p) => ({ x: opts.x + p.x, y: opts.y + p.y }));
  parts.push(polyline(points, opts.color, 3.4, "rotation_symmetry"));
  if (opts.side === "balance") {
    label(parts, opts.x + 68, opts.y + 278, "balanced rotations", { w: 150, color: c.state.watch });
  } else {
    parts.push(circle(opts.x + 268, opts.y + 202, 4, { fill: c.state.accepted }));
    parts.push(circle(opts.x + 344, opts.y + 154, 4, { fill: c.state.accepted }));
    label(parts, opts.x + 82, opts.y + 278, "one-sided extension", { w: 166, color: c.state.accepted });
  }
}

function drawVolume(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
}): void {
  const bars = opts.side === "balance"
    ? [
      { label: "low", h: 18 },
      { label: "mid", h: 42 },
      { label: "high", h: 14 },
    ]
    : [
      { label: "old", h: 16 },
      { label: "break", h: 34 },
      { label: "extend", h: 54 },
    ];
  parts.push(rect(opts.x, opts.y, 166, 108, { fill: c.surface.panelRaised, stroke: c.text.muted, sw: 1, rx: 8 }));
  parts.push(text(opts.x + 14, opts.y + 23, opts.side === "balance" ? "Volume contracts" : "Volume expands", {
    size: 10,
    weight: 800,
    fill: c.text.secondary,
  }));
  parts.push(text(opts.x + 14, opts.y + 41, opts.side === "balance" ? "near the edges" : "on extension", {
    size: 10,
    fill: c.text.primary,
  }));
  for (const [i, bar] of bars.entries()) {
    const bx = opts.x + 24 + i * 43;
    const by = opts.y + 96 - bar.h;
    parts.push(rect(bx, by, 24, bar.h, {
      fill: opts.side === "balance" ? c.state.rejected : c.state.accepted,
      rx: 4,
      evidenceId: i === 2 ? "volume_at_extremes" : undefined,
    }));
    parts.push(text(bx + 12, opts.y + 102, bar.label, { size: 8, anchor: "middle", fill: c.text.muted }));
  }
}

function drawTactic(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
  color: string;
}): void {
  const title = opts.side === "balance" ? "TACTIC: fade extremes" : "TACTIC: stop fading; follow extension";
  const body = opts.side === "balance"
    ? "Failed push above 6024 points back toward value and the opposite edge."
    : "Pullback holds above 6024; value builds higher with price.";
  parts.push(rect(opts.x, opts.y, 418, 58, { fill: c.surface.panelRaised, stroke: opts.color, sw: 1.4, rx: 8 }));
  parts.push(text(opts.x + 18, opts.y + 24, title, { size: 12, weight: 800, fill: opts.color }));
  parts.push(text(opts.x + 18, opts.y + 45, body, { size: 10, fill: c.text.primary }));
}

function drawRegimePlate(parts: string[], opts: {
  x: number;
  y: number;
  side: "balance" | "trend";
  title: string;
  subtitle: string;
  color: string;
}): void {
  parts.push(rect(opts.x, opts.y, 470, 468, { fill: c.surface.panel, stroke: opts.color, sw: 1.6, rx: 9 }));
  parts.push(text(opts.x + 22, opts.y + 34, opts.title, { size: 18, weight: 800, fill: opts.color }));
  parts.push(text(opts.x + 22, opts.y + 58, opts.subtitle, { size: 11, fill: c.text.secondary }));
  parts.push(line(opts.x + 22, opts.y + 78, opts.x + 448, opts.y + 78, c.surface.panelRaised, 1));

  const axisTop = opts.y + 132;
  drawPriceScale(parts, opts.x + 70, axisTop);
  drawProfile(parts, { x: opts.x + 86, axisTop, side: opts.side, color: opts.color });
  drawPoc(parts, { x: opts.x + 70, axisTop, side: opts.side, color: opts.color });
  drawValueStack(parts, { x: opts.x + 244, y: opts.y + 112, side: opts.side });
  drawRotationOrExtension(parts, { x: opts.x + 46, y: opts.y + 62, side: opts.side, color: opts.color });
  drawVolume(parts, { x: opts.x + 282, y: opts.y + 266, side: opts.side });
  drawTactic(parts, { x: opts.x + 26, y: opts.y + 392, side: opts.side, color: opts.color });
}

function drawEvidenceRail(parts: string[]): void {
  const x = 1032;
  const y = 96;
  parts.push(rect(x, y, 212, 580, { fill: c.surface.panelRaised, stroke: c.evidence.price, sw: 1.2, rx: 9 }));
  parts.push(text(x + 18, y + 30, "Reader checklist", { size: 13, weight: 800, fill: c.text.primary }));
  parts.push(text(x + 18, y + 54, "The body should prove:", { size: 10, fill: c.text.secondary }));
  const items = [
    ["Profile shape", "fat balance / thin trend"],
    ["Value behavior", "overlap / migration"],
    ["Extreme volume", "contracts / expands"],
    ["Rotation quality", "two-way / one-way"],
    ["POC location", "parked / trailing"],
  ];
  let yy = y + 82;
  for (const [title, body] of items) {
    parts.push(rect(x + 16, yy, 180, 54, { fill: c.surface.panel, stroke: c.evidence.price, sw: 1, rx: 7 }));
    parts.push(text(x + 30, yy + 21, title, { size: 10, weight: 800, fill: c.evidence.price }));
    parts.push(text(x + 30, yy + 40, body, { size: 10, fill: c.text.primary }));
    yy += 68;
  }
  parts.push(text(x + 18, y + 456, "Forbidden read", { size: 11, weight: 800, fill: c.risk.forbidden }));
  parts.push(text(x + 18, y + 484, "The breakout candle", { size: 10, fill: c.text.secondary }));
  parts.push(text(x + 18, y + 502, "alone classifies the", { size: 10, fill: c.text.secondary }));
  parts.push(text(x + 18, y + 520, "auction, or trend", { size: 10, fill: c.text.secondary }));
  parts.push(text(x + 18, y + 538, "extension should be", { size: 10, fill: c.text.secondary }));
  parts.push(text(x + 18, y + 556, "faded.", { size: 10, fill: c.text.secondary }));
}

export function renderMarketProfileStatic(spec: FigureSpec, _opts: RenderOptions = {}): string {
  const W = spec.export.width;
  const H = spec.export.height;
  const parts: string[] = [];

  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`);
  parts.push(rect(0, 0, W, H, { fill: c.surface.canvas, rx: 0 }));
  drawTitle(parts, spec);
  drawSharedBridge(parts);
  drawRegimePlate(parts, {
    x: 36,
    y: 214,
    side: "balance",
    title: "BALANCE PROFILE",
    subtitle: "Fat profile; overlapping value; fade failed extremes.",
    color: c.state.watch,
  });
  drawRegimePlate(parts, {
    x: 534,
    y: 214,
    side: "trend",
    title: "TREND PROFILE",
    subtitle: "Thin migration; trailing POC; trade with extension.",
    color: c.state.accepted,
  });
  drawEvidenceRail(parts);
  parts.push(text(36, H - 26, "Teaching read: the same push through 6024 produces opposite trades only after the auction evidence classifies the regime.", {
    size: 11,
    fill: c.text.muted,
  }));
  parts.push("</svg>");

  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}
