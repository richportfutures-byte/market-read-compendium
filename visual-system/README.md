# Visual System

Schema-driven visual judgment-training system for the Market-Read Compendium.

This repository produces deterministic, reader-facing instructional figures from structured specs. The system is governed by `VISUAL_PRODUCTION_PROTOCOL.md`.

## Governing Standard

`VISUAL_PRODUCTION_PROTOCOL.md` is the single source of truth for visual-aid production. `CLAUDE.md` is subordinate agent guidance. If any workflow, README text, prior approval label, generated review packet, or renderer-first practice conflicts with the protocol, the protocol wins.

Clean-slate visual approval state is now in force:

- Approved premium plates under the new protocol: zero.
- Approved class grammars under the new protocol: zero.
- Approved master plates under the new protocol: zero.
- Existing specs and renderers may be legacy inputs, but they are not approved visual plates.
- Prior rendered outputs and approval labels are legacy candidates only.

## Production Sequence

The governing production sequence is:

1. Semantic spec.
2. Class grammar.
3. Approved composition target.
4. Renderer implementation.
5. QA.
6. PNG review.
7. Human sign-off.

Renderer code remains production machinery, not art-direction authority. Coding agents implement approved targets after art direction and composition approval.

Generated outputs under `out/` are not committed unless explicitly re-chartered.

## Run It

```bash
npm install
npm run gate
npm run coverage
npm run snapshot:png <figure_id>
```

The PNG snapshot command writes generated output to:

```txt
out/png/<figure_id>.png
```

## Spec Pack Status

Figure specs carry `status` values such as `validated` or `draft`. Live counts must be verified from the repository, not from this README:

```bash
npm run coverage
```

The gate refuses to render, domain-QA, or inject a draft until a human promotes it to `validated`.

## Architecture Rules

- Specs are semantic inputs, not composition authority.
- The Figure Registry is the execution spine for inventory, QA, export, and coverage.
- Renderers are pure deterministic `spec -> SVG string` functions.
- No Canvas, browser APIs, DOM, localStorage, network, filesystem reads, randomness, time dependence, runtime fetching, or animation in the renderer or export path.
- `snapshot:png` may use a headless browser only as a visual-review rasterizer, off the export critical path.
- No live market data. Fixtures are deterministic synthetic only.
- No broker, order, account, fill, margin, execution, P&L, or trading automation.

## Layout

```txt
packages/
  figure-spec/        Zod schema + enums + validator
  figure-registry/    registry built from specs
  design-tokens/      token set for renderers
  renderers/          pure SVG renderers + render map + evidence extraction
  domain-qa/          spec-level rules + output-level render assertions
  export/             headless SVG serialization + manifest
  authoring/          authoring helpers and spec-pack tooling
  integration/        chapter injection
specs/CH01..CH13/     figure spec pack
scripts/              QA runners, coverage, gate, snapshot
out/                  generated artifacts, not committed unless re-chartered
```
