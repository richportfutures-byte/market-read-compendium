import { execSync } from "node:child_process";

// The whole point of slice-zero (issue 2): prove the thin thread is green on ONE
// trivial figure before building tokens, the primitive library, or CH04.
const steps: [string, string][] = [
  ["validate:specs", "tsx packages/figure-spec/validateAllSpecs.ts"],
  ["test:domain (spec-level)", "tsx scripts/runDomainQa.ts"],
  ["test:render-qa (output-level, issue 1)", "tsx scripts/runRenderQa.ts"],
  ["demo:negative (issue 1 is real)", "tsx scripts/demoNegativeRender.ts"],
  ["export:figures (SVG, no browser)", "tsx packages/export/exportAll.ts"],
  ["inject:chapters (issue 4)", "tsx packages/integration/injectFigures.ts"],
];

let ok = true;
for (const [name, cmd] of steps) {
  console.log(`\n=== ${name} ===`);
  try { console.log(execSync(cmd, { encoding: "utf8" }).trim()); }
  catch (err: any) { ok = false; console.log((err.stdout || "") + (err.stderr || "")); break; }
}

console.log("\n" + "=".repeat(48));
console.log(ok ? "GATE: GREEN" : "GATE: RED");
console.log("=".repeat(48));
process.exit(ok ? 0 : 1);
