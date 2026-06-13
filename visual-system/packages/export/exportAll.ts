import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRegistry } from "../figure-registry/registry.ts";
import { renderFigure, hasRenderer } from "../renderers/renderFigure.ts";
import { runRenderAssertions } from "../domain-qa/runRenderAssertions.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
export const OUT_SVG = join(HERE, "..", "..", "out", "svg");

// Three honest buckets, fail-closed:
//   rendered          status validated AND a renderer exists -> render + QA + write
//   renderer_pending  status validated but no renderer wired yet -> tracked, not drawn
//   draft             status draft -> never rendered until a human promotes it
export function exportAll() {
  mkdirSync(OUT_SVG, { recursive: true });
  const reg = buildRegistry();
  const rendered: string[] = [];
  const rendererPending: string[] = [];
  const draft: string[] = [];
  const figures: object[] = [];

  for (const entry of reg.entries) {
    if (entry.status === "draft") { draft.push(entry.figure_id); continue; }
    if (!entry.outputs.includes("static_svg")) continue;
    if (!hasRenderer(entry.figure_type)) { rendererPending.push(entry.figure_id); continue; }

    const qa = runRenderAssertions(entry.spec);
    if (qa.status !== "pass") {
      throw new Error(`refusing to export ${entry.figure_id}: render QA failed -> ${qa.failures.join("; ")}`);
    }
    const { svg } = renderFigure(entry.spec);
    writeFileSync(join(OUT_SVG, `${entry.figure_id}.svg`), svg, "utf8");
    rendered.push(entry.figure_id);
    figures.push({ figure_id: entry.figure_id, chapter: entry.chapter, export_status: "pass" });
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    source: "figureRegistry",
    counts: { rendered: rendered.length, renderer_pending: rendererPending.length, draft: draft.length },
    figures,
  };
  writeFileSync(join(OUT_SVG, "..", "export-manifest.json"), JSON.stringify(manifest, null, 2));
  return { rendered, rendererPending, draft, manifest };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = exportAll();
  console.log(`export:figures  rendered ${r.rendered.length}, renderer-pending ${r.rendererPending.length}, draft ${r.draft.length}`);
  for (const f of r.rendered) console.log(`  rendered          ${f}`);
  for (const f of r.rendererPending) console.log(`  renderer-pending  ${f}`);
}
