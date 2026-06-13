# Visual System — Slice Zero

A working thin vertical thread for the Market-Read Compendium visual learning system.
This is the slice-zero proof: one trivial figure pushed all the way through the
pipeline before any tokens, primitive library, or CH04 work. The gate is green.

## Run it

```bash
npm install
npm run gate          # validate -> spec QA -> render QA -> negative demo -> export -> inject
```

Individual steps:

```bash
npm run validate:specs    # Zod-validate every spec
npm run test:domain       # spec-level domain rules
npm run test:render-qa    # output-level evidence check (issue 1)
npm run demo:negative     # proves render-QA catches a missing-evidence renderer bug
npm run export:figures    # serialize SVG to out/svg (no browser, no screenshot)
npm run inject:chapters   # drop figures into chapters at their bound placement (issue 4)
npm run author:draft      # draft a spec card from chapter prose (issue 3)
```

## What each fix looks like in the code

- **Issue 1 (semantic check inspects the drawing, not the card).**
  Renderers stamp `data-evidence-id` on each drawn element.
  `packages/domain-qa/runRenderAssertions.ts` parses the *rendered SVG* and fails
  if any required evidence item was not actually drawn. `scripts/demoNegativeRender.ts`
  forces the renderer to skip delta and confirms the check catches it. A spec-only
  check would have passed that bug.

- **Issue 2 (thinnest thread first).** Slice-zero is `CH01_TOUCH_VS_READ_001`,
  SVG-only, no Canvas, no animation, no D3. The full gate is green on it before
  any of the heavier layers exist. CH04 absorption is the *second* slice.

- **Issue 3 (authoring throughput).** `packages/authoring/draftSpecFromChapter.ts`
  reads the chapter prose and drafts a spec card (title, teaching objective,
  junior error, and evidence items pulled from "How Traders Identify It"),
  leaving clearly marked TODOs for human review. Drafts are written as
  `*.draft.json` and ignored by the validator until a human promotes them.

- **Issue 4 (figures land in the manuscript).** Each spec carries a `placement`
  block (chapter, section slug, position). `packages/integration/injectFigures.ts`
  inserts the exported figure at that spot. The CH01 figure lands after the
  "In Practice" subsection of "The Read vs. The Touch."

- **Issue 5 (stack).** No Canvas. The renderer is a pure `spec -> SVG string`
  function. Export serializes that string to disk; no browser, no animation
  timing, so no snapshot flake. The same function feeds the React studio, which
  wraps it and adds Framer Motion for interactivity only. Playwright is reserved
  for optional PNG rasterization and visual-regression snapshots, off the
  critical path.

## Layout

```
packages/
  figure-spec/        Zod schema + enums + validator (evidence ids, placement)
  figure-registry/    single source of truth, built from validated specs
  design-tokens/      minimal token set (renderers never hardcode color)
  renderers/          pure SVG renderers + render map + evidence extraction
  domain-qa/          spec-level rules + output-level render assertions
  export/             headless SVG serialization + manifest
  authoring/          draft-spec-from-prose helper
  integration/        chapter injection
specs/CH01/           the slice-zero spec
scripts/              QA runners, negative demo, gate
chapters/             working chapter copy + injected output
out/                  exported svg, manifest, preview png
```
