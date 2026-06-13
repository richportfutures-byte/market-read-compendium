# Agent Brief: Visual System Renderers

You build renderers. You do not author specs. Read this fully before acting.

## Definition of done (the gate is the judge)
- `npm run gate` is GREEN.
- The target figure's render-evidence check passes (every required evidence item is drawn).
- Then STOP and hand the rendered SVG to a human for first-snapshot approval. You never approve your own snapshot.

## Inner loop (one renderer at a time)
1. Run `npm run coverage`. Pick ONE figure that is `validated` (gold) and has no renderer (renderer-ready gap).
2. If no such figure exists, STOP. Authoring is human work and is not yours to do.
3. Build the renderer as a pure function `(spec) => svg string` under `packages/renderers/<type>/`.
4. Stamp `data-evidence-id="<id>"` on the element that draws each required evidence item. The ids must match the spec's `required_evidence` ids exactly.
5. Register the renderer in `packages/renderers/renderFigure.ts` `rendererMap` keyed by `figure_type`.
6. Run `npm run gate` until green.
7. STOP. Request human snapshot approval.

## Hard rules (non-negotiable)
- NEVER create, edit, rename, delete, or change `status` on any file under `specs/`. Specs are human-authored. If a spec looks wrong or incomplete, STOP and report it. Do not fix it.
- NEVER promote a `draft` to `validated`.
- NEVER edit, weaken, disable, or skip anything under `domain-qa/`, `scripts/gate.ts`, or the render assertions to make a figure pass. The gate is the contract, not an obstacle.
- NO Canvas. NO browser APIs. NO localStorage. NO animation in the render/export path. Renderers are pure and return SVG strings.
- Read colors from `packages/design-tokens/`. Never hardcode a semantic color.
- One renderer per `figure_type`. Do not invent new `figure_type` values.
- Do not touch `manuscript/`. Do not refactor the schema, registry, or export path. Do not add dependencies without asking.

## Fixtures
- If a renderer needs data, add a deterministic synthetic fixture under `packages/fixtures/`. Never use live data. Match the spec's `fixture` block.

## Escalate (stop and ask the human) when
- A spec looks conceptually wrong, shallow, or incomplete.
- A required evidence item cannot be drawn from the available fixture.
- The gate fails for a reason outside the renderer you are building.
- You are tempted to edit anything under `specs/` or `domain-qa/` to pass.

## Orchestration
- Renderers are independent files. Parallel agents may each take a different `figure_type`.
- Do NOT parallelize spec authoring. It is human, serial, and off-limits to you.
