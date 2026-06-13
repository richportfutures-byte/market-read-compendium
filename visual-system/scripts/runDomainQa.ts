import { buildRegistry } from "../packages/figure-registry/registry.ts";
import { runDomainAssertions } from "../packages/domain-qa/runSpecAssertions.ts";

const reg = buildRegistry();
let failed = 0;
for (const e of reg.entries) {
  const r = runDomainAssertions(e.spec);
  if (r.status === "pass") console.log(`test:domain  PASS  ${r.figure_id}`);
  else { failed++; console.log(`test:domain  FAIL  ${r.figure_id}\n    ${r.failures.join("\n    ")}`); }
}
process.exit(failed ? 1 : 0);
