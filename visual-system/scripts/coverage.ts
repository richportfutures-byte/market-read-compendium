import { buildRegistry } from "../packages/figure-registry/registry.ts";
import { hasRenderer } from "../packages/renderers/renderFigure.ts";

// Authoring dashboard: how much of the 109-figure pack is gold vs draft, by chapter.
const reg = buildRegistry();
const chapters = [...new Set(reg.entries.map((e) => e.chapter))].sort();

let gold = 0, draft = 0, renderable = 0;
console.log("chapter  total  gold  draft  renderer-ready");
for (const ch of chapters) {
  const rows = reg.entries.filter((e) => e.chapter === ch);
  const g = rows.filter((e) => e.status === "validated" || e.status === "exported").length;
  const d = rows.filter((e) => e.status === "draft").length;
  const r = rows.filter((e) => (e.status === "validated" || e.status === "exported") && hasRenderer(e.figure_type)).length;
  gold += g; draft += d; renderable += r;
  console.log(`${ch}      ${String(rows.length).padStart(3)}    ${String(g).padStart(3)}   ${String(d).padStart(3)}    ${String(r).padStart(3)}`);
}
console.log("-".repeat(48));
console.log(`TOTAL    ${String(reg.entries.length).padStart(3)}    ${String(gold).padStart(3)}   ${String(draft).padStart(3)}    ${String(renderable).padStart(3)}`);
console.log(`\n${gold}/${reg.entries.length} specs authored to validated; ${renderable} have a wired renderer and export today.`);
