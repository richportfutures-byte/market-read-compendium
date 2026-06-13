# Visual System

Schema-driven visual learning system for the Market-Read Compendium.
The slice-zero thread is green and the full 109-figure spec pack exists.

## Run it

```bash
npm install
npm run gate        # validate -> domain QA -> render QA -> negative demo -> export -> inject
npm run coverage    # authoring dashboard: gold vs draft, by chapter
```

## Spec pack status (honest separation)

The pack is 109 figures. Each carries a `status`:

- `validated` (gold): hand-authored, full teaching content, passes domain + render QA,
  exported only when a renderer is wired.
- `draft`: generated from the chapter inventory. Validates against the schema so the
  structure is complete, but every conceptual field is a TODO. The gate refuses to
  render, domain-QA, or inject a draft until a human promotes it to `validated`.

Two figures are gold today: `CH01_TOUCH_VS_READ_001` (renders and exports) and
`CH04_ABSORPTION_001` (validated; its renderer is pending). The other 107 are drafts.

## Promoting a draft to gold

1. Open `specs/CHxx/CHxx_<NAME>_001.json`.
2. Replace every `TODO` (teaching_objective, junior_error, professional_read,
   decision_consequence, required_evidence with stable ids, forbidden_errors,
   panels, fixture, acceptance_criteria).
3. Bind `placement.section_slug` to the real chapter heading slug.
4. Set `status` to `validated` and `qa.render_evidence_check` to `true`.
5. Run `npm run validate:specs` then `npm run gate`.

`npm run author:draft` can pre-fill a single card from chapter prose to reduce typing.

## Regenerating the pack

```bash
npm run gen:specs   # creates any missing draft from the inventory; never overwrites
```

Run once to scaffold. It skips files that already exist, so hand-edited specs are safe.

## What each fix maps to

- Issue 1: renderers stamp `data-evidence-id`; `domain-qa/runRenderAssertions.ts`
  parses the rendered SVG and fails if a required item was not drawn.
  `scripts/demoNegativeRender.ts` proves it catches a missing-evidence bug.
- Issue 2: slice-zero (`CH01_TOUCH_VS_READ_001`) is SVG-only and green before any
  heavy layer; CH04 is the second slice.
- Issue 3: `authoring/draftSpecFromChapter.ts` (one card) and
  `authoring/generateSpecPack.ts` (the whole tree) attack authoring throughput.
- Issue 4: each spec carries `placement`; `integration/injectFigures.ts` drops
  validated figures into the manuscript at the bound section.
- Issue 5: no Canvas. Renderers are pure `spec -> SVG string`; export serializes
  with no browser and no animation, so no snapshot flake. Framer Motion lives only
  in the studio wrapper. Playwright is reserved for optional PNG + visual regression.

## Layout

```
packages/
  figure-spec/        Zod schema + enums + validator (panels, sequence, fixture, acceptance)
  figure-registry/    single source of truth, built from validated specs
  design-tokens/      token set (renderers never hardcode color)
  renderers/          pure SVG renderers + render map + evidence extraction
  domain-qa/          spec-level rules + output-level render assertions
  export/             headless SVG serialization + manifest (3 honest buckets)
  authoring/          draft-from-prose + full-pack generator
  integration/        chapter injection
specs/CH01..CH13/     the 109-figure spec pack (2 gold, 107 draft)
scripts/              QA runners, negative demo, coverage, gate
```
