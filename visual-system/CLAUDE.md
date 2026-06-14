# Agent Operating Contract

`VISUAL_PRODUCTION_PROTOCOL.md` is the governing authority for visual-aid production in this repository. This file is subordinate to that protocol and records only the agent-facing consequences.

## Authority

- `VISUAL_PRODUCTION_PROTOCOL.md` supersedes the older renderer-first Phase B workflow.
- Prior visual approvals are void for governing purposes.
- Approved premium plates under the new protocol: zero.
- Approved class grammars under the new protocol: zero.
- Approved master plates under the new protocol: zero.
- Per-figure renderer implementations created under the prior renderer-first loop are legacy candidates pending revalidation.
- Existing specs, renderers, review packets, and generated images may inform future work, but none are approved visual production under the new protocol.

## Production Order

The required order is:

1. Semantic spec.
2. Figure-class art direction and approved class grammar.
3. Human-approved composition target.
4. Renderer implementation.
5. Automated semantic and integrity QA.
6. Rasterized PNG review.
7. Human sign-off.

Coding agents implement approved composition targets. They do not invent final composition from prose. Art direction and approved class grammar precede renderer implementation.

No figure work begins unless the applicable class grammar and composition target exist, except when the agent is explicitly assigned to create those design-authority artifacts. Do not create fake class-grammar folders or placeholder master plates.

## Approval Boundaries

- Checklists block approval. They do not grant approval.
- Automated gates validate known constraints. They do not judge premium instructional quality.
- No agent may mark a figure approved.
- No agent may set `qa.visual_snapshot` true.
- Human approval must be explicit, asset-specific, version-specific, and recorded under the governing protocol.

## Preservation Boundaries

Authored teaching content and semantic specs are preserved unless a task explicitly authorizes edits to those exact files.

Preserve:

- manuscript prose
- chapter teaching content
- semantic specs
- teaching objectives
- required evidence ids
- forbidden misreads
- fixtures, unless explicitly confirmed as generated junk
- schema
- registry
- QA harness
- gate scripts
- render assertions
- export pipeline
- design-token infrastructure
- durable renderer infrastructure

Do not weaken QA, schema, registry, gate logic, render assertions, or export integration to make a figure pass.

## Source Control

- Do not stage or commit `out/` unless explicitly re-chartered.
- Do not commit generated review packets or PNGs as production artifacts unless explicitly instructed.
- Do not mix unrelated figure work in one commit.
- Do not carry approved but uncommitted work into another figure.
- Run `git status --short` before and after source-control operations when asked to prepare commits.
