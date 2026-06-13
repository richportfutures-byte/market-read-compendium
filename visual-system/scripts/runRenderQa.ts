import { buildRegistry } from "../packages/figure-registry/registry.ts";
import { hasRenderer } from "../packages/renderers/renderFigure.ts";
import { runRenderAssertions } from "../packages/domain-qa/runRenderAssertions.ts";

const reg = buildRegistry();
let failed = 0, ran = 0, skipped = 0;
for (const e of reg.entries) {
  if (e.status === "draft" || !e.spec.qa.render_evidence_check) { skipped++; continue; }
  if (!hasRenderer(e.figure_type)) { skipped++; continue; } // renderer pending
  ran++;
  const r = runRenderAssertions(e.spec);
  if (r.status === "pass") console.log(`test:render-qa  PASS  ${r.figure_id}`);
  else { failed++; console.log(`test:render-qa  FAIL  ${r.figure_id}\n    ${r.failures.join("\n    ")}`); }
}
console.log(`test:render-qa  ran ${ran}, skipped ${skipped} (draft or renderer-pending)`);
process.exit(failed ? 1 : 0);
