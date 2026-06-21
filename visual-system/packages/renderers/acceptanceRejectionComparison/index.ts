import type { FigureSpec } from "../../figure-spec/schema.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import { rect, text, esc } from "../svgPrimitives.ts";
import { renderReviewSvg } from "../reviewSvg.ts";

// ─── Local SVG helpers ────────────────────────────────────────────────────────

const t = tokens.color;
const sk = tokens.stroke;

function ln(x1: number, y1: number, x2: number, y2: number,
  color = t.text.muted, sw = sk.normal, dash = ""): string {
  const da = dash ? ` stroke-dasharray="${dash}"` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}"${da}/>`;
}

function priceTag(x: number, y: number, label: string, color: string, side: "left" | "right" = "right", outlined = false): string {
  const w = label.length * 7.2 + 10;
  const lx = side === "right" ? x + 4 : x - w - 4;
  if (outlined) {
    return rect(lx, y - 10, w, 19, { fill: t.surface.canvas, stroke: color, sw: 1, rx: 2 })
      + text(lx + w / 2, y + 4, label, { size: 10, weight: 700, fill: color, anchor: "middle", mono: true });
  }
  return rect(lx, y - 10, w, 19, { fill: color, rx: 2 })
    + text(lx + w / 2, y + 4, label, { size: 10, weight: 700, fill: t.surface.canvas, anchor: "middle", mono: true });
}

function evGroup(id: string, drop: Set<string>, ...parts: string[]): string {
  if (drop.has(id)) return "";
  return `<g data-evidence-id="${esc(id)}">${parts.join("")}</g>`;
}

// ─── OHLCV synthetic data ─────────────────────────────────────────────────────

type Bar = { o: number; h: number; l: number; c: number; v: number; bull: boolean };

function rangePhase(): Bar[] {
  const bars: Bar[] = [];
  let cp = 21430;
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 4;
    const target = 21432 + Math.sin(angle) * 8;
    const o = cp;
    const c = target + (Math.sin(i * 13.1) * 3);
    const h = Math.max(o, c) + 1 + Math.abs(Math.sin(i * 7) * 3);
    const l = Math.min(o, c) - 1 - Math.abs(Math.cos(i * 5) * 3);
    bars.push({ o, h, l, c, v: 150 + Math.abs(Math.sin(i * 11) * 100), bull: c >= o });
    cp = c;
  }
  return bars;
}

function breakoutPhase(): Bar[] {
  return [
    { o: 21435, h: 21441, l: 21434, c: 21440, v: 400, bull: true },
    { o: 21440, h: 21448, l: 21439, c: 21447, v: 650, bull: true },
    { o: 21447, h: 21455, l: 21446, c: 21454, v: 850, bull: true },
    { o: 21454, h: 21459, l: 21452, c: 21458, v: 920, bull: true },
    { o: 21458, h: 21461, l: 21456, c: 21457, v: 500, bull: false },
  ];
}

function trappedPhase(): Bar[] {
  return [
    { o: 21457, h: 21458, l: 21450, c: 21451, v: 300, bull: false },
    { o: 21451, h: 21453, l: 21448, c: 21449, v: 250, bull: false },
    { o: 21449, h: 21450, l: 21445, c: 21446, v: 350, bull: false }, // probe
    { o: 21446, h: 21447, l: 21440, c: 21441, v: 750, bull: false }, // trigger
    { o: 21441, h: 21442, l: 21432, c: 21433, v: 950, bull: false }, // acceleration
    { o: 21433, h: 21435, l: 21425, c: 21426, v: 1100, bull: false },// cascade
    { o: 21426, h: 21428, l: 21422, c: 21424, v: 800, bull: false }, // release
    { o: 21424, h: 21427, l: 21423, c: 21425, v: 400, bull: true },
  ];
}

function defendedPhase(): Bar[] {
  return [
    { o: 21457, h: 21459, l: 21451, c: 21452, v: 280, bull: false },
    { o: 21452, h: 21454, l: 21449, c: 21450, v: 240, bull: false },
    { o: 21450, h: 21451, l: 21447, c: 21448, v: 220, bull: false }, // hold 21448
    { o: 21448, h: 21451, l: 21447, c: 21450, v: 190, bull: true },  // bids refresh
    { o: 21450, h: 21454, l: 21449, c: 21453, v: 270, bull: true },
    { o: 21453, h: 21458, l: 21452, c: 21457, v: 450, bull: true },  // value migrates
    { o: 21457, h: 21463, l: 21456, c: 21462, v: 600, bull: true },  // push
    { o: 21462, h: 21465, l: 21459, c: 21464, v: 550, bull: true },
  ];
}

// ─── Chart renderer ───────────────────────────────────────────────────────────

interface ChartRegion {
  x: number; y: number; w: number; h: number;
  priceMin: number; priceMax: number;
  bars: Bar[];
  volH: number;
}

function drawChart(region: ChartRegion): string {
  const { x, y, w, h, priceMin, priceMax, bars, volH } = region;
  const chartH = h - volH;
  const n = bars.length;
  // Let gaps be fluid but max bar width constrained
  const gap = w / Math.max(n, 1);
  const bw = Math.min(6, Math.max(1, gap * 0.7));
  const maxVol = Math.max(...bars.map(b => b.v), 1);
  const parts: string[] = [];

  const py = (price: number) => y + chartH - ((price - priceMin) / (priceMax - priceMin)) * chartH;

  for (let i = 0; i < n; i++) {
    const bar = bars[i];
    const cx = x + i * gap + gap / 2;
    const bx = cx - bw / 2;
    const bodyTop = py(Math.max(bar.o, bar.c));
    const bodyBot = py(Math.min(bar.o, bar.c));
    const bodyH = Math.max(1, bodyBot - bodyTop);
    // Darker, crisper bar colors for a non-pastel look
    const color = bar.bull ? "#059669" : "#DC2626";

    parts.push(ln(cx, py(bar.h), cx, bodyTop, color, 1));
    parts.push(ln(cx, bodyBot, cx, py(bar.l), color, 1));
    parts.push(`<rect x="${bx}" y="${bodyTop}" width="${bw}" height="${bodyH}" fill="${color}" />`);

    const volBarH = Math.max(2, (bar.v / maxVol) * (volH - 4));
    const vcolor = bar.bull ? "#05966966" : "#DC262666";
    parts.push(`<rect x="${bx}" y="${y + h - volBarH}" width="${bw}" height="${volBarH}" fill="${vcolor}" />`);
  }

  return parts.join("");
}

// ─── Main premium renderer ───────────────────────────────────────────────────

function renderCh06DefendedVsTrapped(spec: FigureSpec, opts: RenderOptions = {}): string {
  const W = 1280;
  const H = 720;
  const drop = new Set(opts.dropEvidenceIds ?? []);
  const parts: string[] = [];

  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" `
    + `data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`);

  parts.push(`<defs>`
    + `<marker id="arrowW" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">`
    + `<path d="M0,0 L10,5 L0,10 z" fill="${t.text.primary}"/></marker>`
    + `<marker id="arrowG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">`
    + `<path d="M0,0 L10,5 L0,10 z" fill="#059669"/></marker>`
    + `<marker id="arrowR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">`
    + `<path d="M0,0 L10,5 L0,10 z" fill="#DC2626"/></marker>`
    + `<pattern id="hatchRed" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">`
    + `<line x1="0" y1="0" x2="0" y2="8" stroke="#DC2626" stroke-width="1.5" opacity="0.3"/></pattern>`
    + `<pattern id="hatchTeal" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">`
    + `<line x1="0" y1="0" x2="0" y2="8" stroke="#0D9488" stroke-width="1.5" opacity="0.2"/></pattern>`
    + `</defs>`);

  parts.push(rect(0, 0, W, H, { fill: "#FFFFFF", rx: 0 }));

  const PAD = 24;
  const TITLE_H = 48;
  const TOP_H = 260;
  const BOT_Y = TITLE_H + TOP_H + 16;
  const BOT_H = H - BOT_Y - PAD;
  const MID_X = W / 2;
  const LEFT_W = MID_X - PAD - 8;
  const RIGHT_W = W - MID_X - PAD + 8;

  // Title
  parts.push(text(PAD, 32, "Same Displacement, Two Resolutions: Trapped vs Defended", {
    size: 20, weight: 800, fill: t.text.primary,
  }));

  // ── SHARED SETUP PANEL ───────────────────────────────────────────────────
  const setupX = PAD;
  const setupY = TITLE_H;
  const setupW = W - PAD * 2;

  // Crisp border, no fill
  parts.push(rect(setupX, setupY, setupW, TOP_H, {
    fill: "none", stroke: t.text.muted, sw: 1, rx: 0,
  }));
  // Panel title line (clean separator)
  parts.push(ln(setupX, setupY + 32, setupX + setupW, setupY + 32, t.text.muted, 1));
  parts.push(text(setupX + 16, setupY + 20, "SHARED SETUP: PRE-RESOLUTION DISPLACEMENT", { size: 12, weight: 800, fill: t.text.primary }));

  const SETUP_CHART_X = setupX + 16;
  const SETUP_CHART_W = setupW - 120; // leave right margin
  const SETUP_CHART_Y = setupY + 44;
  const SETUP_CHART_H = TOP_H - 44 - 36;
  const SETUP_VOL_H = 36;
  const SETUP_PMIN = 21405;
  const SETUP_PMAX = 21466;

  const spy = (price: number) => SETUP_CHART_Y + SETUP_CHART_H - ((price - SETUP_PMIN) / (SETUP_PMAX - SETUP_PMIN)) * SETUP_CHART_H;

  const setupBars = [...rangePhase(), ...breakoutPhase()];

  parts.push(evGroup("shared_displacement_setup", drop,
    drawChart({
      x: SETUP_CHART_X, y: SETUP_CHART_Y, w: SETUP_CHART_W, h: SETUP_CHART_H + SETUP_VOL_H,
      priceMin: SETUP_PMIN, priceMax: SETUP_PMAX, bars: setupBars, volH: SETUP_VOL_H,
    }),
  ));

  // Entrant zone (clean outline)
  const entrantX = SETUP_CHART_X + SETUP_CHART_W * 0.72;
  const entrantW = SETUP_CHART_W * 0.28;
  const y458 = spy(21458);
  const y446 = spy(21446);

  parts.push(evGroup("shared_price_scale", drop,
    rect(entrantX, y458, entrantW, y446 - y458, {
      fill: "url(#hatchTeal)", stroke: "#0D9488", sw: 1, rx: 0,
    }),
    text(entrantX + 6, y458 + 14, "ENTRANT ZONE", { size: 11, weight: 800, fill: "#0D9488" }),
    priceTag(entrantX + entrantW, y458, "21,458", "#0D9488", "right", true),
    priceTag(entrantX + entrantW, y446, "21,446", "#0D9488", "right", true),
  ));

  // Stop pool band (precise dashed line + hatched bottom)
  const y440 = spy(21440);
  parts.push(ln(setupX, y440, setupX + setupW, y440, "#DC2626", 1, "4 4"));
  parts.push(rect(setupX, y440, setupW, SETUP_CHART_Y + SETUP_CHART_H - y440, { fill: "url(#hatchRed)" }));
  parts.push(text(setupX + 16, y440 + 14, "FORCED-EXIT STOP POOL", { size: 10, weight: 800, fill: "#DC2626" }));
  parts.push(priceTag(setupX + setupW, y440, "21,440", "#DC2626", "left"));

  // ── BOTTOM-LEFT: TRAPPED RESOLUTION ──────────────────────────────────────
  const TLX = PAD;
  const TLY = BOT_Y;
  const TLW = LEFT_W;
  const TLH = BOT_H;

  parts.push(rect(TLX, TLY, TLW, TLH, { fill: "none", stroke: t.text.muted, sw: 1, rx: 0 }));
  parts.push(ln(TLX, TLY + 32, TLX + TLW, TLY + 32, t.text.muted, 1));
  parts.push(text(TLX + 16, TLY + 20, "TRAPPED RESOLUTION: REENTRY & CASCADE", { size: 12, weight: 800, fill: "#DC2626" }));

  // Integration of definition inline right below header
  parts.push(text(TLX + 16, TLY + 46, "Defined by:", { size: 10, weight: 700, fill: t.text.muted }));
  parts.push(text(TLX + 76, TLY + 46, "1. Reentry trigger  2. Acceleration through stops  3. Downside release", { size: 10, fill: t.text.primary }));

  const TRAP_PMIN = 21420;
  const TRAP_PMAX = 21466;
  const TRAP_VOL_H = 40;
  const TRAP_CHART_X = TLX + 16;
  const TRAP_CHART_W = TLW - 80;
  const TRAP_CHART_Y = TLY + 60;
  const TRAP_CHART_H = TLH - 60 - 24;

  const tpy = (price: number) => TRAP_CHART_Y + (TRAP_CHART_H - TRAP_VOL_H) - ((price - TRAP_PMIN) / (TRAP_PMAX - TRAP_PMIN)) * (TRAP_CHART_H - TRAP_VOL_H);

  // Focus on the end of setup + trapped phase
  const trapSetupBars = setupBars.slice(-15);
  const tBars = trappedPhase();
  const allTrapBars = [...trapSetupBars, ...tBars];

  parts.push(evGroup("shared_displacement_setup", drop,
    drawChart({
      x: TRAP_CHART_X, y: TRAP_CHART_Y, w: TRAP_CHART_W, h: TRAP_CHART_H + TRAP_VOL_H,
      priceMin: TRAP_PMIN, priceMax: TRAP_PMAX, bars: allTrapBars, volH: TRAP_VOL_H,
    }),
  ));

  // Trapped specifics
  parts.push(evGroup("trapped_reentry_trigger", drop,
    ln(TRAP_CHART_X, tpy(21445), TRAP_CHART_X + TRAP_CHART_W, tpy(21445), t.evidence.price, 1, "2 2"),
    text(TRAP_CHART_X + 16, tpy(21445) - 6, "Watched level fails to hold", { size: 10, fill: t.text.primary }),
    `<line x1="${TRAP_CHART_X + TRAP_CHART_W * 0.6}" y1="${tpy(21446) - 24}" x2="${TRAP_CHART_X + TRAP_CHART_W * 0.65}" y2="${tpy(21443)}" stroke="${t.text.primary}" stroke-width="1.5" marker-end="url(#arrowW)"/>`,
    text(TRAP_CHART_X + TRAP_CHART_W * 0.45, tpy(21446) - 30, "Reentry Trigger", { size: 11, weight: 800, fill: t.text.primary })
  ));

  const tPoolY = tpy(21440);
  parts.push(evGroup("trapped_forced_exit_cascade", drop,
    ln(TRAP_CHART_X, tPoolY, TRAP_CHART_X + TRAP_CHART_W, tPoolY, "#DC2626", 1, "4 4"),
    priceTag(TRAP_CHART_X + TRAP_CHART_W, tPoolY, "21,440", "#DC2626", "left"),
    `<line x1="${TRAP_CHART_X + TRAP_CHART_W * 0.72}" y1="${tpy(21440)}" x2="${TRAP_CHART_X + TRAP_CHART_W * 0.85}" y2="${tpy(21428)}" stroke="#DC2626" stroke-width="2" marker-end="url(#arrowR)"/>`,
    text(TRAP_CHART_X + TRAP_CHART_W * 0.75, tpy(21434), "Cascade", { size: 11, weight: 800, fill: "#DC2626" }),
    priceTag(TRAP_CHART_X + TRAP_CHART_W, tpy(21428), "21,428", "#DC2626", "left")
  ));


  // ── BOTTOM-RIGHT: DEFENDED RESOLUTION ────────────────────────────────────
  const DRX = MID_X + 8;
  const DRY = BOT_Y;
  const DRW = RIGHT_W;
  const DRH = BOT_H;

  parts.push(rect(DRX, DRY, DRW, DRH, { fill: "none", stroke: t.text.muted, sw: 1, rx: 0 }));
  parts.push(ln(DRX, DRY + 32, DRX + DRW, DRY + 32, t.text.muted, 1));
  parts.push(text(DRX + 16, DRY + 20, "DEFENDED RESOLUTION: ABSORPTION & CONTINUATION", { size: 12, weight: 800, fill: "#059669" }));

  // Integration of definition inline right below header
  parts.push(text(DRX + 16, DRY + 46, "Defined by:", { size: 10, weight: 700, fill: t.text.muted }));
  parts.push(text(DRX + 76, DRY + 46, "1. Hold  2. Bids refresh / absorption  3. Value migration up", { size: 10, fill: t.text.primary }));

  const DEF_PMIN = 21435;
  const DEF_PMAX = 21468;
  const DEF_VOL_H = 40;
  const DEF_CHART_X = DRX + 16;
  const DEF_CHART_W = DRW - 80;
  const DEF_CHART_Y = DRY + 60;
  const DEF_CHART_H = DRH - 60 - 24;

  const dpy = (price: number) => DEF_CHART_Y + (DEF_CHART_H - DEF_VOL_H) - ((price - DEF_PMIN) / (DEF_PMAX - DEF_PMIN)) * (DEF_CHART_H - DEF_VOL_H);

  const dBars = defendedPhase();
  const allDefBars = [...trapSetupBars, ...dBars];

  parts.push(evGroup("shared_displacement_setup", drop,
    drawChart({
      x: DEF_CHART_X, y: DEF_CHART_Y, w: DEF_CHART_W, h: DEF_CHART_H + DEF_VOL_H,
      priceMin: DEF_PMIN, priceMax: DEF_PMAX, bars: allDefBars, volH: DEF_VOL_H,
    }),
  ));

  // Defended specifics
  parts.push(evGroup("defended_pullback_hold", drop,
    ln(DEF_CHART_X, dpy(21448), DEF_CHART_X + DEF_CHART_W, dpy(21448), t.evidence.price, 1.5, "2 2"),
    priceTag(DEF_CHART_X + DEF_CHART_W, dpy(21448), "21,448", t.evidence.price, "left"),
    text(DEF_CHART_X + 16, dpy(21448) - 6, "Pullback Holds", { size: 11, weight: 800, fill: t.text.primary }),
    `<line x1="${DEF_CHART_X + DEF_CHART_W * 0.55}" y1="${dpy(21442)}" x2="${DEF_CHART_X + DEF_CHART_W * 0.6}" y2="${dpy(21447)}" stroke="${t.text.primary}" stroke-width="1.5" marker-end="url(#arrowW)"/>`,
    text(DEF_CHART_X + DEF_CHART_W * 0.4, dpy(21440), "Absorption", { size: 10, fill: t.text.primary })
  ));

  parts.push(evGroup("defended_value_migration", drop,
    `<line x1="${DEF_CHART_X + DEF_CHART_W * 0.65}" y1="${dpy(21453)}" x2="${DEF_CHART_X + DEF_CHART_W * 0.85}" y2="${dpy(21462)}" stroke="#059669" stroke-width="2" marker-end="url(#arrowG)"/>`,
    text(DEF_CHART_X + DEF_CHART_W * 0.62, dpy(21458), "VALUE MIGRATES UP", { size: 11, weight: 800, fill: "#059669" })
  ));


  parts.push(`</svg>`);
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function renderAcceptanceRejectionComparison(spec: FigureSpec, opts: RenderOptions = {}): string {
  if (spec.figure_id === "CH06_DEFENDED_BREAKOUT_VS_TRAPPED_BREAKOUT_001") {
    return renderCh06DefendedVsTrapped(spec, opts);
  }
  return renderReviewSvg(spec, "comparison");
}
