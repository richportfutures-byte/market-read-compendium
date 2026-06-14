# Visual System

Schema-driven visual judgment-training system for the Market-Read Compendium.

This repository does not produce decorative diagrams. It produces validated,
deterministic, reader-facing instructional figures whose job is to teach market-
read distinctions from structured specs.

## Governing standard

`CLAUDE.md` is the binding operating contract for renderer work and Phase B
snapshot approval. If this README conflicts with `CLAUDE.md`, `CLAUDE.md` wins.

The governing approval standard is now absolute:

> A Phase B PNG is approved only if it is a premium textbook-plate exemplar
> strong enough to populate the finished handbook as-is and strong enough to
> calibrate future figures of the same class.

That means:
- No "acceptable for now" approvals.
- No "good enough for Phase B" approvals.
- No "correct but not final polish" approvals.
- If a figure is correct and readable but still not premium, it is rejected.

## Current operating state

As of the current renderer-review pass, the spec pack contains:
- 109 total figure specs.
- 13 `validated` / gold specs.
- 96 `draft` specs.
- 13 renderer-backed gold figures in the current review tranche.

Verify live counts from the repo, not from this README:

```bash
npm run coverage
```

## Run it

```bash
npm install
npm run gate
npm run coverage
npm run snapshot:png <figure_id>
```

The PNG is written to:

```txt
out/png/<figure_id>.png
```

`out/` is generated output and must not be committed.

## Phase semantics

### Phase B — premium exemplar review of the gold renderer tranche

Phase B is the current operating phase for the 13 validated/gold renderer-backed
figures.

Phase B is not a smoke test and not a provisional publication pass. A human-
approved Phase B snapshot must be premium final-book quality. Each approved PNG
becomes a calibration exemplar for later figures.

Required loop for each gold figure:
1. Run the gate.
2. Generate the PNG snapshot.
3. Open the PNG.
4. Review it as a reader against `CLAUDE.md`.
5. If it fails, fix the renderer only.
6. Re-run gate and snapshot.
7. Commit focused renderer changes.
8. Stop for human approval.

A figure is not Phase B approved merely because it passes render QA. Render QA
proves required evidence ids are present. Snapshot review proves readability.
Human review decides whether the figure is a premium exemplar.

Phase B hard rules:
- The primary visual must encode the required evidence, not merely list it.
- Generic placeholder renderers are hard failures.
- Reader-facing labels must be clean instructional prose.
- Raw internal ids, fixture keys, renderer keys, debug labels, and TODO/scaffold
  text are not acceptable in approved snapshots unless the spec explicitly
  requires them.
- An approved figure must be worthy of insertion into the finished handbook as-is.
- An approved figure must be worthy of serving as the visual precedent for its
  figure class.
- `qa.visual_snapshot` remains human-only.

### Later phases

Later phases expand scope; they do not lower the standard.
- Full chapter expansion: promote and render the broader chapter inventory.
- Assessment layer: build classification drills and decision-gate modules.
- Capstone layer: build the CH13 integrated read-stack experience.
- Packaging/final assembly: integrate approved figures into the finished handbook
  and any presentation/export formats.

## Spec pack status

Each figure carries a `status`:
- `validated` / gold: hand-authored, full teaching content, eligible for domain
  QA, render QA, export, PNG snapshot review, and handbook population after
  human approval.
- `draft`: generated from the chapter inventory. Validates structurally, but is
  not renderer work. Draft promotion is human/spec-authoring work.

The gate refuses to render, domain-QA, or inject a draft until a human promotes
it to `validated`.

## QA responsibilities

- Spec-level domain QA verifies that a validated spec declares the required
  conceptual evidence and forbids dangerous misreads.
- Render QA verifies that the rendered SVG actually stamps every required
  `data-evidence-id`.
- PNG snapshot review verifies readability and exemplar quality.
- Human approval is the final decision.

Do not confuse these layers. Gate GREEN is necessary, not sufficient.

## Architecture rules

- Specs are canonical.
- The Figure Registry is the execution spine for inventory, QA, export, and
  coverage.
- Renderers are pure deterministic `spec -> SVG string` functions.
- No Canvas, browser APIs, DOM, localStorage, network, filesystem reads,
  randomness, time dependence, runtime fetching, or animation in the renderer or
  export path.
- `snapshot:png` may use a headless browser only as a visual-review rasterizer,
  off the export critical path.
- No live market data. Fixtures are deterministic synthetic only.
- No broker, order, account, fill, margin, execution, P&L, or trading automation.

## Layout

```txt
packages/
  figure-spec/        Zod schema + enums + validator
  figure-registry/    single source of truth, built from validated specs
  design-tokens/      token set; renderers never hardcode semantic color
  renderers/          pure SVG renderers + render map + evidence extraction
  domain-qa/          spec-level rules + output-level render assertions
  export/             headless SVG serialization + manifest
  authoring/          draft-from-prose + full-pack generator
  integration/        chapter injection
specs/CH01..CH13/     109-figure spec pack
scripts/              QA runners, negative demo, coverage, gate, snapshot
out/svg/, out/png/    generated artifacts; never commit
```
