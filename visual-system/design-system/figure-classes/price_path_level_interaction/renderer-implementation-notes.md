STATUS: CANDIDATE, NOT APPROVED

# Price Path Level Interaction Renderer Implementation Notes

These notes are grounded in existing repository contracts where possible. Because no renderer is currently wired for this figure type, implementation requirements are forward-looking.

## Existing Contract Evidence

- `packages/figure-spec/enums.ts` defines `price_path_level_interaction`.
- `packages/figure-registry/registry.ts` stores each spec's `figure_type`.
- `packages/renderers/renderFigure.ts` maps renderers by `figure_type`.
- `renderFigure.ts` does not currently include `price_path_level_interaction` in `rendererMap`.
- Render functions elsewhere use `(spec: FigureSpec, opts: RenderOptions) => string`.
- Render QA extracts `data-evidence-id` from SVG and checks `data-figure-id` plus `data-export-ready="true"`.
- `RenderOptions.dropEvidenceIds` exists in the current renderer contract.

## Layer-3 Blocker

There is no wired renderer for `price_path_level_interaction`. CH06 specs of this type can be Layer-2 compatible but are blocked from Layer-3 production until a renderer is designed and implemented after human approval of grammar and composition target.

## Required Future Renderer Behavior

A future renderer must:

- implement the approved regions from `layout-rules.md`;
- render all required evidence ids in body marks;
- support up to 11 required evidence ids without rail-only stamping;
- distinguish latent and activated stop-pool states;
- distinguish user stop pin from crowd pool;
- render professional alternatives as decision objects tied to body geometry;
- preserve the defended branch;
- use only verified tokens;
- output a deterministic static SVG from spec and deterministic fixture;
- expose `data-evidence-id` only as machine attributes, never visible text.

## What The Renderer May Not Do

- Invent a local layout system.
- Drop the defended branch to make density easier.
- Treat stop pools as active before trigger evidence.
- Advise hiding or removing stops.
- Create live broker, order, P&L, account, or execution semantics.
- Mark any asset approved or set `qa.visual_snapshot` true.

## Not Done In This Task

No renderer was created, edited, invoked, exported, snapshotted, or used to produce a candidate artifact.
