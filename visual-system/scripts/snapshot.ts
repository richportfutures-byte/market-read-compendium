// scripts/snapshot.ts
// Rasterizes exported SVG figures to PNG for VISUAL SELF-REVIEW.
//
// This is the ONLY place a headless browser is allowed, and it is OFF the export
// critical path. The export pipeline itself stays browserless, pure, and
// deterministic. This script never touches specs, domain-qa, or export.
//
// Usage:
//   npm run snapshot:png                 # rasterize every SVG in out/svg
//   npm run snapshot:png CH02_ACCEPTANCE_VS_REJECTION_AT_SAME_LEVEL_001
//   npm run snapshot:png CH02 CH04       # any number of figure-id prefixes
//
// Output: out/png/<figure_id>.png  (deviceScaleFactor 2 for crisp text)
//
// FONT FIDELITY (important): collision review is only trustworthy if the PNG is
// rendered with the same fonts the figures use (Inter, JetBrains Mono). Chromium
// will use those families if they are installed on this machine. For machine-
// independent fidelity, point SNAPSHOT_FONT_CSS at a CSS file containing
// @font-face rules (referencing local font files), e.g.:
//   SNAPSHOT_FONT_CSS=assets/fonts/figure-fonts.css npm run snapshot:png CH02
// If neither system fonts nor SNAPSHOT_FONT_CSS provide the families, the script
// still runs but warns that text falls back and review fidelity is reduced.

import { chromium } from "playwright";
import {
  readFileSync, readdirSync, mkdirSync, existsSync,
} from "node:fs";
import { join, basename, resolve } from "node:path";

const SVG_DIR = "out/svg";
const PNG_DIR = "out/png";
const EXPECTED_FAMILIES = ["Inter", "JetBrains Mono"];

function viewBoxSize(svg: string): { width: number; height: number } {
  const vb = svg.match(/viewBox\s*=\s*"([\d.\s-]+)"/);
  if (vb) {
    const p = vb[1].trim().split(/\s+/).map(Number);
    if (p.length === 4 && p[2] > 0 && p[3] > 0) {
      return { width: Math.round(p[2]), height: Math.round(p[3]) };
    }
  }
  const w = svg.match(/\bwidth\s*=\s*"(\d+)"/);
  const h = svg.match(/\bheight\s*=\s*"(\d+)"/);
  return { width: w ? Number(w[1]) : 1280, height: h ? Number(h[1]) : 720 };
}

function loadFontCss(): string | null {
  const p = process.env.SNAPSHOT_FONT_CSS;
  if (!p) return null;
  const abs = resolve(p);
  if (!existsSync(abs)) {
    console.warn(`snapshot:png  SNAPSHOT_FONT_CSS set but not found: ${abs}`);
    return null;
  }
  return readFileSync(abs, "utf8");
}

async function main() {
  if (!existsSync(SVG_DIR)) {
    console.error(`snapshot:png  no ${SVG_DIR}/ directory. Run "npm run export:figures" first.`);
    process.exit(1);
  }
  mkdirSync(PNG_DIR, { recursive: true });

  const filters = process.argv.slice(2);
  const all = readdirSync(SVG_DIR).filter((f) => f.endsWith(".svg"));
  const targets = filters.length
    ? all.filter((f) => filters.some((q) => f.startsWith(q)))
    : all;

  if (targets.length === 0) {
    console.error(`snapshot:png  no SVGs in ${SVG_DIR}/ matching: ${filters.join(", ") || "(all)"}`);
    process.exit(1);
  }

  const fontCss = loadFontCss();
  const browser = await chromium.launch();
  let fidelityWarned = false;

  try {
    for (const file of targets) {
      const svg = readFileSync(join(SVG_DIR, file), "utf8");
      const { width, height } = viewBoxSize(svg);
      const name = basename(file, ".svg");

      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: 2,
      });

      // Size html/body/svg to fill the viewport exactly so the figure
      // rasterizes 1:1 with its viewBox. Inject font CSS if provided.
      const style =
        `html,body{margin:0;padding:0;width:${width}px;height:${height}px}` +
        `svg{display:block;width:${width}px;height:${height}px}` +
        (fontCss ? `\n${fontCss}` : "");

      await page.setContent(
        `<!doctype html><html><head><meta charset="utf-8"><style>${style}</style></head>` +
        `<body>${svg}</body></html>`,
        { waitUntil: "load" },
      );

      // Wait for font layout to settle before screenshotting, then check which
      // expected families actually resolved (fidelity signal).
      const fidelity = await page.evaluate(async (families: string[]) => {
        await (document as any).fonts.ready;
        const probe = "48px";
        return families.map((fam) => ({
          family: fam,
          available: (document as any).fonts.check(`${probe} "${fam}"`),
        }));
      }, EXPECTED_FAMILIES);

      const missing = fidelity.filter((f) => !f.available).map((f) => f.family);
      if (missing.length && !fidelityWarned) {
        console.warn(
          `snapshot:png  WARNING: font(s) not resolved (${missing.join(", ")}). ` +
          `Text is falling back, so collision review fidelity is REDUCED. ` +
          `Install the fonts system-wide or set SNAPSHOT_FONT_CSS.`,
        );
        fidelityWarned = true;
      }

      const out = join(PNG_DIR, `${name}.png`);
      await page.screenshot({ path: out, clip: { x: 0, y: 0, width, height } });
      await page.close();
      console.log(`snapshot:png  wrote ${out}  (${width}x${height})`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("snapshot:png  failed:", err);
  process.exit(1);
});
