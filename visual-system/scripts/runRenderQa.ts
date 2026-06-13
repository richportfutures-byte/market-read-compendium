import { buildRegistry } from "../packages/figure-registry/registry.ts";
import { runRenderAssertions } from "../packages/domain-qa/runRenderAssertions.ts";

const reg = buildRegistry();
let failed = 0;
for (const e of reg.filterRenderEvidenceChecked()) {
  const r = runRenderAssertions(e.spec);
  if (r.status === "pass") console.log(`test:render-qa  PASS  ${r.figure_id}`);
  else { failed++; console.log(`test:render-qa  FAIL  ${r.figure_id}\n    ${r.failures.join("\n    ")}`); }
}
process.exit(failed ? 1 : 0);
