STATUS: CANDIDATE, NOT APPROVED

# Trap Storyboard Renderer Implementation Notes

These notes are grounded in the existing renderer contract where it exists. They are forward-looking requirements for any later Layer-3 work and do not authorize renderer changes.

## Existing Contract Evidence

- `packages/figure-spec/enums.ts` defines `figure_type` value `trap_storyboard`.
- `packages/renderers/renderFigure.ts` maps `trap_storyboard` to `renderTrapStoryboard`.
- Renderer functions use `(spec: FigureSpec, opts: RenderOptions) => string`.
- `RenderOptions` currently supports `dropEvidenceIds?: string[]` for negative render QA.
- `renderFigure` extracts `data-evidence-id="..."` from the SVG output and requires `data-figure-id` plus `data-export-ready="true"` for render QA.
- `packages/renderers/svgPrimitives.ts` provides pure SVG string helpers and imports verified tokens.

## Existing Renderer Warning

`packages/renderers/trapStoryboard/index.ts` contains a special CH06 implementation for `CH06_TRAP_SEQUENCE_STORYBOARD_001` and falls back to a review SVG for other trap-storyboard specs. Under the governing protocol, that code is legacy candidate Layer-3 work. It is not approval and is not used by this Layer-2 task.

## Required Later Alignment

After human approval of this grammar and a composition target, a Layer-3 renderer must:

- implement the approved regions from `layout-rules.md`;
- render all required evidence ids in the body with exact `data-evidence-id` values;
- avoid stamping evidence ids on rail-only rows;
- preserve a shared initial displacement and shared scale for branch comparisons;
- encode the fork before the trap label;
- render the defended branch when required;
- use only verified tokens from `packages/design-tokens/tokens.ts`;
- keep `qa.visual_snapshot` unchanged unless separately authorized by humans.

## Stop Conditions For Layer-3

Stop renderer work if:

- the approved grammar cannot fit a target spec without a density split;
- a needed token role is missing and cannot be mapped to a verified token;
- the renderer must invent a local layout system;
- the only way to pass render QA is to move evidence into rails;
- render output would imply visual approval.

## Not Done In This Task

No renderer was invoked, edited, exported, snapshotted, or used to produce a candidate artifact for this package.
