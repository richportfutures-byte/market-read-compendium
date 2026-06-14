import type { FigureSpec } from "../../figure-spec/schema.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import { ARROW_DEFS, arrow, esc, rect, text } from "../svgPrimitives.ts";
import { renderReviewSvg } from "../reviewSvg.ts";

type Point = { x: number; y: number };

const t = tokens.color;

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

function line(x1: number, y1: number, x2: number, y2: number, color = t.text.muted, sw = tokens.stroke.normal, dash = ""): string {
  const dashed = dash ? ` stroke-dasharray="${dash}"` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}"${dashed} />`;
}

function poly(points: Point[], color: string, sw = tokens.stroke.emphasis, dash = "", evidenceId = ""): string {
  const d = points.map((p) => `${p.x},${p.y}`).join(" ");
  const dashed = dash ? ` stroke-dasharray="${dash}"` : "";
  const ev = evidenceId ? ` data-evidence-id="${esc(evidenceId)}"` : "";
  return `<polyline points="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dashed}${ev} />`;
}

function path(d: string, color: string, sw = tokens.stroke.emphasis, dash = "", evidenceId = ""): string {
  const dashed = dash ? ` stroke-dasharray="${dash}"` : "";
  const ev = evidenceId ? ` data-evidence-id="${esc(evidenceId)}"` : "";
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dashed}${ev} />`;
}

function circle(x: number, y: number, r: number, fill: string, stroke = "none", evidenceId = ""): string {
  const ev = evidenceId ? ` data-evidence-id="${esc(evidenceId)}"` : "";
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${tokens.stroke.normal}"${ev} />`;
}

function renderCh06TrapSequence(spec: FigureSpec, opts: RenderOptions): string {
  const W = spec.export.width;
  const H = spec.export.height;
  const drop = new Set(opts.dropEvidenceIds ?? []);
  const parts: string[] = [];

  const has = (id: string) => !drop.has(id);
  const ev = (id: string, body: string[]) => {
    if (has(id)) parts.push(`<g data-evidence-id="${esc(id)}">`, ...body, `</g>`);
  };
  const priceY = (price: number) => {
    const top = 156;
    const bottom = 420;
    const min = 21424;
    const max = 21468;
    return bottom - ((price - min) / (max - min)) * (bottom - top);
  };

  const mainX = 24;
  const mainY = 104;
  const mainW = 760;
  const mainH = 486;
  const railX = 804;
  const railY = 104;
  const railW = 272;
  const railH = 486;
  const chartX = 54;
  const chartY = 138;
  const chartW = 700;
  const chartH = 306;
  const levelY = priceY(21445);
  const entryTop = priceY(21458);
  const entryBottom = priceY(21446);
  const stopTop = priceY(21440);
  const stopBottom = priceY(21428);
  const targetY = priceY(21428);

  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`);
  parts.push(ARROW_DEFS);
  parts.push(rect(0, 0, W, H, { fill: t.surface.canvas, rx: 0 }));
  parts.push(text(24, 36, spec.title, { size: 23, weight: 700 }));
  multi(parts, 24, 60, "Locate the breakout crowd first; trade only when reentry converts them into forced exits.", {
    size: 13,
    fill: t.text.secondary,
    max: 94,
  });

  parts.push(rect(mainX, mainY, mainW, mainH, { fill: t.surface.panel, stroke: t.text.muted, sw: 1 }));
  parts.push(text(mainX + 18, mainY + 28, "MAIN SEQUENCE: LOCATION BEFORE RESOLUTION", { size: 11, weight: 700, fill: t.text.muted }));

  for (let i = 0; i <= 4; i++) {
    const y = chartY + i * (chartH / 4);
    parts.push(line(chartX, y, chartX + chartW, y, t.surface.panelRaised, 1));
  }
  parts.push(line(chartX, levelY, chartX + chartW, levelY, t.evidence.price, 1.8, "6 5"));
  parts.push(rect(chartX + 8, levelY - 29, 132, 22, { fill: t.surface.canvas, stroke: t.evidence.price, sw: 1, rx: 3 }));
  parts.push(text(chartX + 16, levelY - 14, "break level 21,445", { size: 11, fill: t.evidence.price, mono: true, weight: 700 }));
  parts.push(line(chartX, targetY, chartX + chartW, targetY, t.text.muted, 1, "3 6"));
  parts.push(text(chartX + 10, targetY + 18, "range bottom 21,428", { size: 10, fill: t.text.muted, mono: true }));

  ev("entrant_population_entry_zone", [
    rect(282, entryTop, 186, entryBottom - entryTop, {
      fill: `${t.state.stalk}33`,
      stroke: t.state.stalk,
      sw: 1.8,
      rx: 3,
    }),
    line(294, entryBottom + 10, 456, entryBottom + 10, t.state.stalk, 2),
  ]);

  ev("forced_exit_stop_pool", [
    rect(514, stopTop, 226, stopBottom - stopTop, {
      fill: `${t.state.rejected}2E`,
      stroke: t.state.rejected,
      sw: 1.8,
      rx: 3,
    }),
    ...[542, 576, 610, 644, 678, 712].map((x) =>
      path(`M ${x} ${stopTop + 62} l 9 14 l -18 0 z`, t.state.rejected, 1.2)
        .replace('fill="none"', `fill="${t.state.rejected}"`)
    ),
  ]);

  parts.push(poly([
    { x: 72, y: priceY(21412) },
    { x: 142, y: priceY(21422) },
    { x: 218, y: priceY(21439) },
    { x: 274, y: levelY },
  ], t.text.secondary, 2));
  parts.push(text(78, priceY(21413) + 28, "90-minute range", { size: 11, fill: t.text.muted }));

  ev("displacement_delta_and_volume", [
    path(`M 274 ${levelY} C 302 ${priceY(21447)}, 326 ${priceY(21456)}, 380 ${priceY(21458)}`, t.state.accepted, 5),
    arrow(304, levelY - 10, 374, priceY(21457), t.state.accepted),
    rect(162, 452, 34, 54, { fill: `${t.evidence.volume}55`, stroke: t.evidence.volume, sw: 1, rx: 3 }),
    rect(202, 428, 34, 78, { fill: `${t.evidence.volume}AA`, stroke: t.evidence.volume, sw: 1, rx: 3 }),
    rect(242, 402, 34, 104, { fill: t.evidence.volume, stroke: t.evidence.volume, sw: 1, rx: 3 }),
    poly([{ x: 300, y: 500 }, { x: 324, y: 476 }, { x: 348, y: 462 }, { x: 372, y: 442 }], t.evidence.deltaPositive, 2.4),
    text(162, 526, "break burst: +delta, about 3x volume", { size: 11, fill: t.text.primary }),
  ]);

  ev("absorption_at_extreme", [
    poly([{ x: 380, y: priceY(21458) }, { x: 424, y: priceY(21457) }, { x: 464, y: priceY(21458) }, { x: 504, y: priceY(21457) }], t.evidence.price, 3),
    ...[402, 426, 450, 474, 498].map((x, i) =>
      rect(x, priceY(21458) - 30 + i % 2 * 6, 18, 24, { fill: `${t.state.rejected}66`, stroke: t.state.rejected, sw: 1, rx: 2 })
    ),
    rect(388, priceY(21458) - 68, 144, 32, { fill: t.surface.canvas, stroke: t.state.rejected, sw: 1, rx: 4 }),
    text(400, priceY(21458) - 48, "offers refresh; price stalls", { size: 11, fill: t.state.rejected, weight: 700 }),
  ]);

  parts.push(poly([{ x: 504, y: priceY(21457) }, { x: 536, y: priceY(21451) }], t.text.secondary, 2));
  parts.push(circle(536, priceY(21451), 8, t.surface.canvas, t.text.muted));
  parts.push(text(536, priceY(21451) + 4, "F", { size: 9, fill: t.text.secondary, weight: 700, anchor: "middle" }));

  ev("reentry_through_entry_trigger", [
    path(`M 536 ${priceY(21451)} C 558 ${priceY(21447)}, 574 ${priceY(21443)}, 590 ${priceY(21443)}`, t.state.rejected, 4),
    circle(590, priceY(21443), 8, t.state.rejected, t.surface.canvas),
  ]);

  ev("forced_exit_cascade_to_target", [
    path(`M 590 ${priceY(21443)} C 630 ${priceY(21438)}, 662 ${priceY(21431)}, 720 ${targetY}`, t.state.rejected, 4.5),
    arrow(622, priceY(21440), 654, priceY(21435), t.state.rejected),
    arrow(662, priceY(21435), 696, priceY(21429), t.state.rejected),
    ...[616, 648, 680, 712].map((x, i) => circle(x, priceY(21439 - i * 3), 4.5, t.state.rejected, t.surface.canvas)),
  ]);

  ev("defended_branch_value_migration", [
    path(`M 536 ${priceY(21451)} C 572 ${priceY(21448)}, 614 ${priceY(21448)}, 654 ${priceY(21458)} S 712 ${priceY(21464)}, 744 ${priceY(21464)}`, t.state.accepted, 3.2, "8 7"),
    rect(628, priceY(21464) - 18, 104, 92, { fill: `${t.state.accepted}22`, stroke: t.state.accepted, sw: 1.4, rx: 4 }),
    rect(648, priceY(21458), 62, 10, { fill: `${t.state.accepted}66`, rx: 2 }),
    rect(642, priceY(21461), 78, 10, { fill: `${t.state.accepted}88`, rx: 2 }),
    rect(636, priceY(21464), 92, 10, { fill: t.state.accepted, rx: 2 }),
    rect(636, priceY(21464) - 10, 118, 42, { fill: t.surface.canvas, stroke: t.state.accepted, sw: 1, rx: 4 }),
    text(648, priceY(21464) + 10, "defended hold", { size: 11, fill: t.state.accepted, weight: 700 }),
    text(648, priceY(21464) + 26, "value to 21,464", { size: 10, fill: t.text.primary, mono: true }),
  ]);

  parts.push(rect(292, entryTop + 4, 172, 46, { fill: t.surface.canvas, stroke: t.state.stalk, sw: 1, rx: 4 }));
  parts.push(text(304, entryTop + 24, "entrant population", { size: 12, fill: t.state.stalk, weight: 700 }));
  parts.push(text(304, entryTop + 42, "entries 21,446-21,458", { size: 11, fill: t.text.primary, mono: true }));
  parts.push(line(536, priceY(21451) + 10, 430, 458, t.text.muted, 1));
  parts.push(line(590, priceY(21443) + 10, 592, 458, t.state.rejected, 1));
  parts.push(line(620, stopTop + 48, 430, 500, t.state.rejected, 1));
  parts.push(line(718, targetY - 6, 592, 500, t.state.rejected, 1));
  parts.push(rect(392, 426, 360, 110, { fill: t.surface.panelRaised, stroke: t.text.muted, sw: 1, rx: 5 }));
  parts.push(text(408, 444, "TRAP RESOLUTION LANE", { size: 9, fill: t.text.muted, weight: 700 }));
  [
    { x: 408, y: 454, n: "F", title: "Fork", detail: "before outcome", color: t.text.secondary },
    { x: 570, y: 454, n: "T", title: "Trigger", detail: "21,443 + speed", color: t.state.rejected },
    { x: 408, y: 494, n: "S", title: "Stop pool", detail: "under 21,440", color: t.state.rejected },
    { x: 570, y: 494, n: "X", title: "Forced exits", detail: "to 21,428", color: t.state.rejected },
  ].forEach((card) => {
    parts.push(rect(card.x, card.y, 154, 34, { fill: t.surface.canvas, stroke: card.color, sw: 1, rx: 4 }));
    parts.push(circle(card.x + 13, card.y + 17, 9, card.color));
    parts.push(text(card.x + 13, card.y + 21, card.n, { size: 8, fill: t.surface.canvas, weight: 700, anchor: "middle" }));
    parts.push(text(card.x + 30, card.y + 15, card.title, { size: 10, fill: card.color, weight: 700 }));
    parts.push(text(card.x + 30, card.y + 29, card.detail, { size: 8, fill: t.text.secondary, mono: true }));
  });

  parts.push(rect(mainX + 28, mainY + mainH - 42, mainW - 56, 28, { fill: t.surface.panelRaised, stroke: t.state.stalk, sw: 1, rx: 4 }));
  parts.push(text(mainX + mainW / 2, mainY + mainH - 23, "Trap read waits for reentry; defended read survives by holding above 21,445.", {
    size: 12,
    fill: t.text.primary,
    anchor: "middle",
    weight: 700,
  }));

  parts.push(rect(railX, railY, railW, railH, { fill: t.surface.panelRaised, stroke: t.text.muted, sw: 1 }));
  parts.push(text(railX + 16, railY + 28, "EVIDENCE RAIL", { size: 11, weight: 700, fill: t.text.muted }));
  const railRows = [
    ["1", "Entry zone", "21,446-21,458 entrants located"],
    ["2", "Stop pool", "stops densest under 21,440"],
    ["3", "Displacement", "+delta and about 3x volume"],
    ["4", "Absorption", "offers refresh while price stalls"],
    ["5", "Trigger", "21,443 reentry with speed"],
    ["6", "Cascade", "forced exits into 21,428"],
    ["7", "Defended branch", "hold plus value migration"],
  ];
  railRows.forEach((row, i) => {
    const y = railY + 50 + i * 56;
    const color = i === 6 ? t.state.accepted : i >= 3 ? t.state.rejected : t.evidence.price;
    parts.push(rect(railX + 14, y, railW - 28, 44, { fill: t.surface.panel, stroke: color, sw: 1, rx: 5 }));
    parts.push(circle(railX + 33, y + 22, 11, color));
    parts.push(text(railX + 33, y + 26, row[0], { size: 10, weight: 700, fill: t.surface.canvas, anchor: "middle" }));
    parts.push(text(railX + 52, y + 18, row[1], { size: 11, weight: 700, fill: color }));
    parts.push(text(railX + 52, y + 34, row[2], { size: 10, fill: t.text.secondary }));
  });
  parts.push(rect(railX + 14, railY + railH - 48, railW - 28, 28, { fill: t.surface.canvas, stroke: t.text.muted, sw: 1, rx: 4 }));
  parts.push(text(railX + 28, railY + railH - 30, "Rail verifies; main body teaches.", { size: 11, fill: t.text.secondary, weight: 700 }));

  parts.push(text(24, H - 14, spec.concept, { size: 10, fill: t.text.muted }));
  parts.push(`</svg>`);
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}

export function renderTrapStoryboard(spec: FigureSpec, opts: RenderOptions = {}): string {
  if (spec.figure_id === "CH06_TRAP_SEQUENCE_STORYBOARD_001") {
    return renderCh06TrapSequence(spec, opts);
  }
  return renderReviewSvg(spec, "sequence");
}
