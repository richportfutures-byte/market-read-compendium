import type { FigureSpec } from "../../figure-spec/schema.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import { rect, text, arrow, ARROW_DEFS, esc } from "../svgPrimitives.ts";

export function renderAcceptanceRejectionComparison(spec: FigureSpec, opts: RenderOptions = {}): string {
  const W = spec.export.width;
  const H = spec.export.height;
  const drop = new Set(opts.dropEvidenceIds ?? []);
  const t = tokens.color;

  // Three rendering layers so annotations always sit above profiles and paths.
  const profileParts: string[] = [];
  const pathParts: string[] = [];
  const annotationParts: string[] = [];

  const midX = W / 2;  // 640
  const levelY = 360;

  // ── Shared reference level line + label ──────────────────────────────────
  // Emitted in annotationParts so the dashed line and label paint over profiles/paths.
  annotationParts.push(
    `<line x1="32" y1="${levelY}" x2="${W - 32}" y2="${levelY}" `
    + `stroke="${t.text.secondary}" stroke-width="2" stroke-dasharray="6 6" />`
  );
  // Opaque background behind the center label so no path line shows through.
  const lvlLabelX = midX - 100;
  const lvlLabelY = levelY - 12;
  annotationParts.push(rect(lvlLabelX - 4, lvlLabelY - 14, 200, 20, { fill: t.surface.canvas, rx: 2 }));
  annotationParts.push(text(lvlLabelX, lvlLabelY, "Prior day high: 21,560",
    { size: 14, fill: t.text.secondary, mono: true, weight: 700 }));

  // ── ACCEPTANCE column header ─────────────────────────────────────────────
  annotationParts.push(text(60, 120, "ACCEPTANCE", { size: 18, fill: t.state.accepted, weight: 700 }));
  annotationParts.push(text(60, 140, "Time, volume, and value migrate above the level",
    { size: 12, fill: t.text.secondary }));

  // ── Acceptance price path ────────────────────────────────────────────────
  const pathA = "M 80 480 L 140 300 L 200 330 L 280 230 L 340 260 L 420 180 L 460 200 L 520 140 L 560 160";
  pathParts.push(`<path d="${pathA}" fill="none" stroke="${t.state.accepted}" stroke-width="3" />`);

  // time_volume_beyond_level — bracket spanning acceptance build zone
  if (!drop.has("time_volume_beyond_level")) {
    annotationParts.push(
      `<path d="M 280 120 L 280 110 L 560 110 L 560 120" fill="none" `
      + `stroke="${t.evidence.structure}" stroke-width="1.5" data-evidence-id="time_volume_beyond_level" />`
    );
    // Opaque bg then label above bracket
    annotationParts.push(rect(296, 88, 250, 18, { fill: t.surface.canvas, rx: 2 }));
    annotationParts.push(text(420, 102, "40 minutes building beyond level", { size: 12, anchor: "middle" }));
  }

  // pullback_structure — badge left of the pullback point (340, 260), arrow right to it
  if (!drop.has("pullback_structure")) {
    annotationParts.push(rect(218, 272, 100, 22,
      { fill: t.surface.panelRaised, stroke: t.evidence.structure, sw: 1, evidenceId: "pullback_structure" }));
    annotationParts.push(text(223, 287, "Pullback holds", { size: 11, fill: t.state.accepted }));
    annotationParts.push(arrow(318, 283, 340, 262));
  }

  // delta_on_return — bid-refresh badge at the acceptance path turn (460, 200)
  if (!drop.has("delta_on_return")) {
    annotationParts.push(rect(462, 164, 102, 22,
      { fill: t.surface.panelRaised, stroke: t.evidence.structure, sw: 1, evidenceId: "delta_on_return" }));
    annotationParts.push(text(467, 179, "Bid refresh (Δ+)", { size: 11, fill: t.state.accepted }));
    annotationParts.push(arrow(513, 186, 480, 200));
  }

  // ── Acceptance volume profile ────────────────────────────────────────────
  const profAX = 600;
  const profileA = [
    { y: 140, w: 20 }, { y: 160, w: 40 }, { y: 180, w: 70 }, { y: 200, w: 100 },
    { y: 220, w: 140 }, { y: 240, w: 160, isPoc: true }, { y: 260, w: 130 },
    { y: 280, w: 90 },  { y: 300, w: 50 }, { y: 320, w: 30 },
    { y: 340, w: 40 },  { y: 360, w: 20 }, { y: 380, w: 20 }, { y: 400, w: 30 }, { y: 420, w: 15 },
  ];

  if (!drop.has("profile_shape")) {
    let shapeTags = `<g data-evidence-id="profile_shape">`;
    for (const p of profileA) {
      shapeTags += `<rect x="${profAX - p.w}" y="${p.y}" width="${p.w}" height="18" `
        + `fill="${p.isPoc ? t.evidence.price : t.state.accepted + "55"}" />`;
    }
    shapeTags += `</g>`;
    profileParts.push(shapeTags);
  } else {
    for (const p of profileA) {
      profileParts.push(
        `<rect x="${profAX - p.w}" y="${p.y}" width="${p.w}" height="18" `
        + `fill="${p.isPoc ? t.evidence.price : t.state.accepted + "55"}" />`
      );
    }
  }

  // value_migration — VAH/POC migrated above; positioned at y=218, above POC band at y=240.
  // This keeps it clear of the "Pullback holds" badge at y=272 and the POC bar itself.
  if (!drop.has("value_migration")) {
    annotationParts.push(`<g data-evidence-id="value_migration">`);
    annotationParts.push(arrow(394, 218, 434, 218, t.evidence.structure));
    // Opaque bg spanning approx text width (anchor="end" means text ends at x=390)
    annotationParts.push(rect(176, 206, 216, 18, { fill: t.surface.canvas, rx: 2 }));
    annotationParts.push(text(390, 218, "VAH/POC migrated above",
      { size: 12, anchor: "end", fill: t.evidence.price }));
    annotationParts.push(`</g>`);
  }

  // ── REJECTION column header ──────────────────────────────────────────────
  const rightX = midX + 60;
  annotationParts.push(text(rightX, 120, "REJECTION", { size: 18, fill: t.state.rejected, weight: 700 }));
  annotationParts.push(text(rightX, 140, "Fast probe, trapped longs, value remains below",
    { size: 12, fill: t.text.secondary }));

  // ── Rejection price path ─────────────────────────────────────────────────
  const pathR = "M 720 480 L 800 360 L 860 140 L 920 180 L 980 380 L 1040 440 L 1100 420 L 1160 460";
  pathParts.push(`<path d="${pathR}" fill="none" stroke="${t.state.rejected}" stroke-width="3" />`);

  // time_volume_beyond_level — narrow bracket over the 90-second spike
  if (!drop.has("time_volume_beyond_level")) {
    annotationParts.push(
      `<path d="M 860 120 L 860 110 L 920 110 L 920 120" fill="none" `
      + `stroke="${t.evidence.structure}" stroke-width="1.5" data-evidence-id="time_volume_beyond_level" />`
    );
    // Opaque bg + label above bracket, clear of trapped-longs rect below (y=130)
    annotationParts.push(rect(834, 88, 118, 18, { fill: t.surface.canvas, rx: 2 }));
    annotationParts.push(text(890, 102, "90-second spike", { size: 12, anchor: "middle" }));
  }

  // Trapped longs zone — red outlined rect with BOTH label lines inside the box.
  // Sits at y=128–174 (path spike is at x=860, y=140), text inside so it reads as a zone,
  // not a stray UI box floating above the bracket.
  annotationParts.push(rect(838, 128, 106, 46,
    { fill: `${t.state.rejected}44`, rx: 4, stroke: t.state.rejected, sw: 1.5 }));
  annotationParts.push(text(891, 146, "Trapped Breakout",
    { size: 10, fill: t.state.rejected, weight: 700, anchor: "middle" }));
  annotationParts.push(text(891, 161, "Longs (Fuel)",
    { size: 10, fill: t.state.rejected, weight: 700, anchor: "middle" }));

  // pullback_structure — snap-back badge BELOW level line (y=390+) so it does not sit on the dashed line.
  // Arrow points up-left to where path crosses back below level (~980, 382).
  if (!drop.has("pullback_structure")) {
    annotationParts.push(rect(948, 392, 124, 22,
      { fill: t.surface.panelRaised, stroke: t.evidence.structure, sw: 1, evidenceId: "pullback_structure" }));
    annotationParts.push(text(953, 407, "Snap-back through", { size: 11, fill: t.state.rejected }));
    annotationParts.push(arrow(948, 403, 982, 383));
  }

  // delta_on_return — negative delta badge (kept at x=1020, y=400 as original)
  if (!drop.has("delta_on_return")) {
    annotationParts.push(rect(1020, 400, 122, 22,
      { fill: t.surface.panelRaised, stroke: t.evidence.structure, sw: 1, evidenceId: "delta_on_return" }));
    annotationParts.push(text(1025, 415, "Negative Δ answers", { size: 11, fill: t.state.rejected }));
  }

  // ── Rejection volume profile ─────────────────────────────────────────────
  const profRX = W - 40; // 1240
  const profileR = [
    { y: 140, w: 10 }, { y: 160, w: 10 }, { y: 180, w: 10 }, { y: 200, w: 10 },
    { y: 220, w: 10 }, { y: 240, w: 10 }, { y: 260, w: 10 }, { y: 280, w: 10 },
    { y: 300, w: 15 }, { y: 320, w: 25 },
    { y: 340, w: 50 },  { y: 360, w: 80 },  { y: 380, w: 130 }, { y: 400, w: 150, isPoc: true },
    { y: 420, w: 110 }, { y: 440, w: 70 },  { y: 460, w: 40 },
  ];

  if (!drop.has("profile_shape")) {
    let shapeTags = `<g data-evidence-id="profile_shape">`;
    for (const p of profileR) {
      shapeTags += `<rect x="${profRX - p.w}" y="${p.y}" width="${p.w}" height="18" `
        + `fill="${p.isPoc ? t.evidence.price : t.state.rejected + "55"}" />`;
    }
    shapeTags += `</g>`;
    profileParts.push(shapeTags);
    // Single-print excess label — annotated in the top annotation layer
    annotationParts.push(text(profRX - 120, 220, "Single-print excess",
      { size: 11, fill: t.text.secondary, anchor: "end" }));
    annotationParts.push(arrow(profRX - 110, 216, profRX - 20, 216));
  } else {
    for (const p of profileR) {
      profileParts.push(
        `<rect x="${profRX - p.w}" y="${p.y}" width="${p.w}" height="18" `
        + `fill="${p.isPoc ? t.evidence.price : t.state.rejected + "55"}" />`
      );
    }
  }

  // value_migration — POC anchored below; placed at y=447, below "Negative Δ" badge (y=400-422).
  if (!drop.has("value_migration")) {
    annotationParts.push(`<g data-evidence-id="value_migration">`);
    annotationParts.push(arrow(profRX - 178, 447, profRX - 158, 447, t.evidence.structure));
    // Opaque bg; text is anchor="end" ending at profRX-188=1052, ~128px wide
    annotationParts.push(rect(profRX - 316, 434, 128, 18, { fill: t.surface.canvas, rx: 2 }));
    annotationParts.push(text(profRX - 188, 447, "POC anchored below",
      { size: 12, anchor: "end", fill: t.evidence.price }));
    annotationParts.push(`</g>`);
  }

  // ── Assemble layers in z-order: background → header → profiles → paths → annotations ──
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" `
      + `data-figure-id="${esc(spec.figure_id)}" data-export-ready="false">`,
    ARROW_DEFS,
    rect(0, 0, W, H, { fill: t.surface.canvas, rx: 0 }),
    text(32, 40, spec.title, { size: 24, weight: 700 }),
    text(32, 64, spec.teaching_objective, { size: 14, fill: t.text.secondary }),
    ...profileParts,
    ...pathParts,
    ...annotationParts,
    text(32, H - 24, spec.concept, { size: 12, fill: t.text.muted }),
    `</svg>`,
  ];

  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}
