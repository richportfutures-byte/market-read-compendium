import type { FigureSpec } from "../../figure-spec/schema.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { tokens } from "../../design-tokens/tokens.ts";
import { rect, text, arrow, ARROW_DEFS, esc } from "../svgPrimitives.ts";

export function renderReadStackFlow(spec: FigureSpec, opts: RenderOptions = {}): string {
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
  parts.push(text(32, 64, spec.teaching_objective, { size: 12, fill: t.text.secondary }));

  const layerX = 160;
  const rowH = 40;
  let rowY = 100;
  
  const col1X = 330;
  const col2X = 650;
  const colW = 300;

  // Columns Headers
  parts.push(text(col1X + 10, rowY - 10, "DAY ONE (Clean Day)", { size: 12, weight: 700, fill: t.state.accepted }));
  parts.push(text(col2X + 10, rowY - 10, "DAY TWO (Corrupted Day)", { size: 12, weight: 700, fill: t.state.rejected }));

  const layers = [
    { n: "1. Catalyst", d1: "None (Clean day)", d2: "Hot 8:30 release" },
    { n: "2. HTF Auction", d1: "Imbalance higher, accepted", d2: "Unresolved repricing" },
    { n: "3. Session", d1: "Quiet overnight, upper 1/3", d2: "Overnight spike down/retrace" },
    { n: "4. Volatility", d1: "Moderate regime", d2: "Realized volatility doubled" },
    { n: "5. Intermarket", d1: "ZN flat", d2: "ZN one-timeframing lower" },
    { n: "6. Location", d1: "Open 5512 (above prior VAH)", d2: "Open 5512" },
    { n: "7. Tape", d1: "Identical 9:32 thrust (+7k delta)", d2: "Identical 9:32 thrust (+7k delta)" },
    { n: "8. Setup", d1: "Pullback to 5508", d2: "Failed attempt to bounce" },
    { n: "9. Permission", d1: "Authorized", d2: "Denied / Wait for short" },
    { n: "10. Trade-state", d1: "Initiative Continuation (Long)", d2: "Unresolved Repricing (Short-covering)" },
    { n: "11. Review", d1: "Expected behavior", d2: "Higher timeframe dominates" }
  ];

  // 1. Core Stack
  let layerGroup = !drop.has("eleven_ordered_layers") ? `<g data-evidence-id="eleven_ordered_layers">` : `<g>`;
  
  for (let i = 0; i < layers.length; i++) {
    const l = layers[i];
    // Layer name
    layerGroup += rect(layerX, rowY, 150, rowH - 4, { fill: t.surface.panelRaised, stroke: t.surface.border, sw: 1 });
    layerGroup += text(layerX + 10, rowY + 22, l.n, { size: 12, weight: 700 });
    
    // Day 1 Output
    let fill1 = t.surface.panel;
    let stroke1 = t.surface.border;
    if (i < 5) stroke1 = t.state.accepted; // Context
    if (i === 6) fill1 = `${t.evidence.price}22`; // highlight tape
    
    let d1Group = `<g>`;
    if (i === 0 && !drop.has("written_layer_output")) {
      d1Group = `<g data-evidence-id="written_layer_output">`;
      parts.push(text(col1X + 10, rowY - 30, "Written output required", { size: 10, fill: t.evidence.structure }));
      parts.push(arrow(col1X + 50, rowY - 26, col1X + 50, rowY));
    }

    layerGroup += d1Group;
    layerGroup += rect(col1X, rowY, colW, rowH - 4, { fill: fill1, stroke: stroke1, sw: 1 });
    layerGroup += text(col1X + 10, rowY + 22, l.d1, { size: 12, fill: i === 6 ? t.evidence.price : t.text.primary, weight: i===6?700:400 });
    layerGroup += `</g>`;

    // Day 2 Output
    let fill2 = t.surface.panel;
    let stroke2 = t.surface.border;
    if (i < 5) stroke2 = t.state.rejected; // Context
    if (i === 6) fill2 = `${t.evidence.price}22`; // highlight tape

    layerGroup += rect(col2X, rowY, colW, rowH - 4, { fill: fill2, stroke: stroke2, sw: 1 });
    layerGroup += text(col2X + 10, rowY + 22, l.d2, { size: 12, fill: i === 6 ? t.evidence.price : t.text.primary, weight: i===6?700:400 });

    rowY += rowH;
  }
  layerGroup += `</g>`;
  parts.push(layerGroup);

  // 2. The Governing Flow (Left Arrow)
  if (!drop.has("order_is_content")) {
    parts.push(`<g data-evidence-id="order_is_content">`);
    parts.push(arrow(layerX - 40, 100, layerX - 40, 100 + 11*rowH - 20));
    parts.push(`<text x="${layerX - 55}" y="${100 + 5*rowH}" fill="${t.text.secondary}" font-family="${tokens.typography.body}" font-size="11" font-weight="700" text-anchor="middle" transform="rotate(-90, ${layerX - 55}, ${100 + 5*rowH})">ORDER IS CONTENT</text>`);
    parts.push(`</g>`);
  }

  // 3. Right Rail Brackets
  if (!drop.has("higher_governs_context")) {
    const rx = col2X + colW + 20; // 650 + 300 + 20 = 970
    parts.push(`<g data-evidence-id="higher_governs_context">`);
    // Context bracket (layers 1-5)
    parts.push(`<path d="M ${rx} 100 L ${rx+10} 100 L ${rx+10} ${100 + 5*rowH - 4} L ${rx} ${100 + 5*rowH - 4}" fill="none" stroke="${t.text.secondary}" stroke-width="2" />`);
    parts.push(text(rx + 20, 100 + 2.5*rowH, "Governs Context", { size: 12, fill: t.text.primary, weight: 700 }));
    
    // Timing bracket (layers 6-11)
    parts.push(`<path d="M ${rx} ${100 + 5*rowH} L ${rx+10} ${100 + 5*rowH} L ${rx+10} ${100 + 11*rowH - 4} L ${rx} ${100 + 11*rowH - 4}" fill="none" stroke="${t.text.secondary}" stroke-width="2" />`);
    parts.push(text(rx + 20, 100 + 8*rowH, "Governs Timing", { size: 12, fill: t.text.primary, weight: 700 }));
    parts.push(`</g>`);
  }

  // 4. Same Tape, Different Trade contrast
  if (!drop.has("same_tape_different_trade")) {
    const ty = 100 + 6*rowH; // Layer 7
    parts.push(`<g data-evidence-id="same_tape_different_trade">`);
    parts.push(rect(col1X - 5, ty - 5, colW * 2 + 30 + 10, rowH + 6, { fill: "none", stroke: t.evidence.price, sw: 2, rx: 6 }));
    parts.push(text(col1X + colW + 15, ty + rowH + 16, "Same tape, different trade (governed by context layers)", { size: 12, fill: t.evidence.price, anchor: "middle", weight: 700 }));
    parts.push(`</g>`);
  }

  parts.push(text(32, H - 20, spec.concept, { size: 11, fill: t.text.muted }));

  parts.push(`</svg>`);
  return parts.join("\n").replace('data-export-ready="false"', 'data-export-ready="true"');
}
