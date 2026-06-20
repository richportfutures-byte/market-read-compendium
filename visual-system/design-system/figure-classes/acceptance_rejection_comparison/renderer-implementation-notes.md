STATUS: CANDIDATE, NOT APPROVED

# Acceptance Rejection Comparison Renderer Implementation Notes

These notes are grounded in the current renderer interface and are forward-looking for later Layer-3 work.

## Existing Contract Evidence

- `packages/figure-spec/enums.ts` defines `acceptance_rejection_comparison`.
- `packages/renderers/renderFigure.ts` maps this figure type to `renderAcceptanceRejectionComparison`.
- Render functions accept `(spec: FigureSpec, opts: RenderOptions) => string`.
- Render QA extracts `data-evidence-id` attributes from SVG and checks `data-figure-id` plus `data-export-ready="true"`.
- `RenderOptions.dropEvidenceIds` exists for negative evidence checks.
- `svgPrimitives.ts` and `tokens.ts` are the current primitive and token sources.

## Existing Renderer Warning

The current `renderAcceptanceRejectionComparison` is legacy candidate Layer-3 code. It is not aligned to this CH06 grammar, and it is not a source of visual approval. It also appears calibrated to older generic acceptance/rejection examples, not the CH06 trapped/defended and covering/demand specs.

## Required Later Alignment

A future renderer must:

- implement the approved shared-setup and outcome regions;
- preserve shared scale for comparisons;
- place every required evidence id on body marks, not rail rows;
- support no-trade decision strip when the spec requires it;
- distinguish forced covering from fresh demand by structure and labels;
- use verified tokens only;
- keep all output deterministic and static for export;
- avoid visible raw schema ids, debug terms, and placeholder labels.

## Missing Or Risky Capability

The renderer type is wired, but CH06-specific comparison grammar is not approved. Any renderer alignment is blocked until human composition approval.

## Not Done In This Task

No renderer was invoked, edited, exported, snapshotted, or used to create candidate composition output.
