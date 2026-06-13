import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRegistry } from "../figure-registry/registry.ts";
import { renderFigure } from "../renderers/renderFigure.ts";
import { runRenderAssertions } from "../domain-qa/runRenderAssertions.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
export const OUT_SVG = join(HERE, "..", "..", "out", "svg");

// Export = serialize the SVG string to disk. No Canvas, no Playwright, no
// animation timing (issue 5). Playwright is only needed later for optional PNG
// rasterization and visual-regression snapshots, off the critical path.
export function exportAll(): { exported: string[]; manifest: object } {
  mkdirSync(OUT_SVG, { recursive: true });
  const reg = buildRegistry();
  const exported: string[] = [];
  const figures: object[] = [];

  for (const entry of reg.filterExportable()) {
    // Gate: never export a figure that fails its render-evidence check.
    const qa = runRenderAssertions(entry.spec);
    if (qa.status !== "pass") {
      throw new Error(`refusing to export ${entry.figure_id}: render QA failed -> ${qa.failures.join("; ")}`);
    }
    const { svg } = renderFigure(entry.spec);
    const file = join(OUT_SVG, `${entry.figure_id}.svg`);
    writeFileSync(file, svg, "utf8");
    exported.push(file);
    figures.push({
      figure_id: entry.figure_id, chapter: entry.chapter,
      outputs: entry.outputs, export_status: "pass",
    });
  }

  const manifest = { generated_at: new Date().toISOString(), source: "figureRegistry", figures };
  writeFileSync(join(OUT_SVG, "..", "export-manifest.json"), JSON.stringify(manifest, null, 2));
  return { exported, manifest };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { exported } = exportAll();
  console.log(`export:figures  PASS  (${exported.length} file${exported.length === 1 ? "" : "s"})`);
  for (const f of exported) console.log(`  - ${f}`);
}
