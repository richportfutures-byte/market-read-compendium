import { buildRegistry } from "../packages/figure-registry/registry.ts";
import { runRenderAssertions } from "../packages/domain-qa/runRenderAssertions.ts";

// Proves the issue-1 guarantee is real: force the renderer to "forget" to draw
// delta (a renderer bug), and confirm the render-QA FAILS even though the spec
// still lists delta. A spec-only check would have passed this. This is the gap
// the original plan left open.
const reg = buildRegistry();
const e = reg.byId("CH01_TOUCH_VS_READ_001");
if (!e) { console.error("spec not found"); process.exit(2); }

const r = runRenderAssertions(e.spec, { dropEvidenceIds: ["delta_vs_displacement"] });

if (r.status === "fail" && r.failures.some((f) => f.includes("delta_vs_displacement"))) {
  console.log("demo:negative  PASS  (render-QA correctly caught the missing delta)");
  console.log(`    reported: ${r.failures.join("; ")}`);
  process.exit(0);
} else {
  console.log("demo:negative  FAIL  (render-QA did NOT catch the missing evidence)");
  process.exit(1);
}
