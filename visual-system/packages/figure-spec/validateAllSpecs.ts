import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FigureSpec } from "./schema.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
export const SPECS_DIR = join(HERE, "..", "..", "specs");

function walkJson(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walkJson(full));
    else if (name.endsWith(".json") && !name.endsWith(".draft.json")) out.push(full);
  }
  return out;
}

export function loadAllSpecs(): { path: string; spec: FigureSpec }[] {
  const files = walkJson(SPECS_DIR);
  return files.map((path) => {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    const spec = FigureSpec.parse(raw); // throws with a clear message if invalid
    return { path, spec };
  });
}

// Run directly: `tsx validateAllSpecs.ts`
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const specs = loadAllSpecs();
    console.log(`validate:specs  PASS  (${specs.length} spec${specs.length === 1 ? "" : "s"})`);
    for (const { spec } of specs) console.log(`  - ${spec.figure_id}  [${spec.chapter} / ${spec.tier}]`);
    process.exit(0);
  } catch (err) {
    console.error("validate:specs  FAIL");
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
