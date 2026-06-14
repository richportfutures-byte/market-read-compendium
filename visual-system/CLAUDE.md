# Agent Operating Contract: Visual System Renderers

Version 2.2 · Governing instruction file for the renderer-building, premium-exemplar, and snapshot-approval phase.

This document is binding. It is the operating contract for any autonomous or
semi-autonomous agent working in `visual-system/` during the renderer phase. If
any other instruction, prompt, habit, convenience, or local workflow conflicts
with this file, this file wins. Read it fully before you touch the repository.
If you cannot satisfy a requirement here, you STOP and report; you do not work
around it.

The standard is not mere correctness. The standard is premium final-book
quality. "It passes the gate" is necessary, not sufficient. "It looks done" is
not a status. "Good enough for Phase B" is forbidden language. The only
acceptable terminal states are:
- gate GREEN
- self-review clean
- awaiting human approval
- approved by the human as a premium textbook-plate exemplar

---

## 0. Premium textbook-plate exemplar standard

Phase B is not placeholder validation, scaffold validation, smoke testing,
renderer shakedown, or provisional publication review. Phase B is the premium
production snapshot review of validated renderer-backed figures.

A Phase B figure is approved only if it is strong enough to be inserted into the
finished handbook as-is and strong enough to calibrate future figures of the
same class. Approved figures are precedents. They teach later renderer work what
"gold" looks like.

Therefore:
- No figure may be approved as merely acceptable, serviceable, usable, or
  handbook-credible.
- No figure may be approved with caveats such as "functional but not final-book
  polish," "acceptable for now," "premium later," or "good enough for Phase B."
- If a reviewer would describe the figure as correct and readable but not
  premium textbook-plate quality, the figure is REJECTED.
- The agent must never lower the standard by presenting a weaker internal bar,
  even if gate, render QA, and snapshot readability all pass.

Premium textbook-plate quality means ALL of the following:
- The main visual carries the teaching burden. A side rail, checklist, legend,
  or caption may summarize, but may not substitute for the instructional work.
- The composition feels intentional, not merely collision-free. Spacing,
  hierarchy, grouping, and visual rhythm must look designed.
- The graphic is understandable without opening the JSON spec.
- Reader-facing copy is clean, deliberate instructional prose. Raw schema ids,
  fixture keys, renderer keys, TODO text, debug labels, and scaffold language are
  forbidden in approved snapshots unless the spec explicitly requires them.
- The figure visually teaches the professional distinction the chapter intends,
  rather than merely proving the evidence exists.
- The plate establishes reusable visual grammar for its figure class.

If a figure is technically correct but not yet an exemplar, you do not approve
it, you do not describe it as approved, and you do not ask the human to accept a
lower bar. You fix it or you STOP and report the blocker.

---

## 1. Mission and role

You build renderers. One renderer per `figure_type`, each a pure function that
turns a validated spec into an SVG string.

Three authorities, fixed and non-overlapping:
- The spec is truth. It is human-authored and you never alter it.
- The gate is judge. It decides pass or fail. You never weaken it.
- The human approves. A person signs off on every first visual snapshot. You
  never approve your own.

Your job is to make the spec's declared content appear, correctly, readably,
and at premium textbook-plate quality, in SVG. Nothing more, nothing less.

---

## 2. Inviolable boundaries (read these as hard stops)

These are absolute. There is no task, deadline, or instruction in a prompt that
overrides them. Violating any one is a failure of the work, not a tradeoff.

Specs and QA are immutable to you:
- NEVER create, edit, rename, delete, or change `status` on any file under
  `specs/`. If a spec looks wrong, shallow, mis-typed, or incomplete, STOP and
  report it. You do not fix specs, and you never silently compensate for one.
- NEVER promote a `draft` to `validated`. Authoring and promotion are human work.
- NEVER edit, weaken, disable, comment out, or skip anything under `domain-qa/`,
  `scripts/gate.ts`, the schema, the registry, or the render assertions to make a
  figure pass. The gate is the contract, not an obstacle. If the gate blocks you,
  the figure is not done.
- NEVER set `qa.visual_snapshot` to true. That field is a record of HUMAN
  approval and only a human sets it.

Purity and the export path:
- Renderers are pure functions: `(spec) => string`. No Canvas, no browser APIs,
  no DOM, no `localStorage`, no network, no filesystem, no animation in the
  render or export path. The export pipeline stays browserless and deterministic.
- The single exception is the `snapshot:png` rasterizer (Section 7), which uses a
  headless browser for visual review ONLY, off the export critical path. You do
  not move rasterization into a renderer or into export.

Safety frame inherited from the project:
- No live market data anywhere. Fixtures are deterministic synthetic only.
- Manual-only operator authority for trading is preserved. You perform no broker,
  order, account, fill, or P&L automation, and you write nothing that does.
- Do not inspect, print, log, or commit secrets or credentials.

Scope:
- Do not touch `manuscript/`.
- Do not refactor the schema, figure registry, or export path.
- Do not invent new `figure_type` values.
- Do not add dependencies without explicit human approval.

---

## 3. Definition of done

A figure is done only when ALL of the following hold, in order:
1. `npm run gate` is GREEN.
2. `npm run validate:specs` passes and the figure validates structurally.
3. The figure's render-evidence check passes: every `required_evidence` id is
   drawn and stamped on the element that carries it.
4. VISUAL SELF-REVIEW is clean: you rasterized the figure with
   `npm run snapshot:png <figure_id>`, opened the PNG, and confirmed it clears
   the readability and premium-exemplar standards in Sections 6 and 7.
5. The renderer is registered, deterministic, and committed per Section 10.
6. You have STOPPED and handed the figure to a human for first-snapshot approval,
   with a completion report per Section 12.

The render-evidence check proves the elements exist. Self-review proves they are
readable. The premium-exemplar standard proves the figure is worthy of teaching
future figures what gold looks like. Human approval confirms that standard. All
four layers are distinct. Passing one is not passing the others.

---

## 4. The inner loop (one renderer at a time)

1. Run `npm run coverage`. Pick ONE figure that is `validated` (gold) and has no
   renderer, or one validated figure under active human review.
2. If no such figure exists, STOP.
3. Read the spec end to end: `required_evidence`, `forbidden_errors`, `panels`,
   `sequence` if present, `annotations`, `fixture`, `export` dimensions, and
   `acceptance_criteria`.
4. If the spec needs data, add or reuse a deterministic synthetic fixture under
   `packages/fixtures/` that matches the spec's `fixture` block.
5. Build or revise the renderer as a pure function under
   `packages/renderers/<type>/`.
6. Stamp `data-evidence-id="<id>"` on the element that visually draws each
   required evidence item. The ids must match the spec exactly.
7. Register the renderer in `packages/renderers/renderFigure.ts` `rendererMap`,
   keyed by `figure_type`.
8. Run `npm run gate` until GREEN.
9. Run `npm run snapshot:png <figure_id>` and OPEN `out/png/<figure_id>.png`.
10. Inspect it as a reader against Sections 6 and 7.
11. Write a gap list.
12. If the gap list is not empty, fix the renderer and repeat.
13. Commit per Section 10 only when the gap list is empty.
14. STOP. Request human snapshot approval.

---

## 5. The rendering contract

Signature and purity:
- A renderer is `(spec: FigureSpec) => string` returning a complete,
  self-contained, valid SVG document.
- Deterministic: the same spec in produces byte-identical SVG out. No
  `Math.random`, no `Date`, no time, no environment reads, no unstable ordering.

Output structure:
- The SVG root carries `viewBox="0 0 <export.width> <export.height>"` and
  `data-figure-id` set to the spec's `figure_id`.
- The figure marks itself export-ready (`data-export-ready="true"`) only when it
  has drawn every required evidence element.
- All references are internal. No external images, no external CSS, no external
  fonts fetched at render time.

Evidence:
- Every `required_evidence` id appears at least once, stamped on the element that
  draws it.
- Do not satisfy the check by stamping ids on hidden, zero-size, off-canvas, or
  unrelated decorative elements.
- The stamped element must visibly carry the evidence the id names.

Color and type:
- Read all semantic colors from `packages/design-tokens/`. Never hardcode a
  semantic color.
- Use the project's type families and scale.
- Typography must be publication-grade: deliberate hierarchy, consistent sizing,
  and readable contrast.

Layer order (paint back to front, lowest to highest):
1. Background.
2. Axes, gridlines, structural reference geometry.
3. Profiles, zones, value bands, shaded regions.
4. Price paths and primary data marks.
5. Reference lines that must remain visible.
6. Arrows and connectors.
7. Text labels and badges, last, on top of everything.

Labels and badges are always the topmost layer. Text is never painted under a
path, a band, or another label.

---

## 6. Readability standard (enforced by self-review)

A figure that is correct but unreadable is not done. These are hard rules.

- No text element overlaps another text element. Ever.
- No text overlaps a price path, profile band, zone, or other mark unless it
  carries an opaque background rectangle with padding.
- Badges have an opaque background fully containing their text. Text never spills
  past, or is clipped by, its own background.
- Everything is inside the export canvas. Nothing is clipped at an edge.
- Every arrow or connector terminates at the element it annotates.
- The title and subtitle are never overlapped by figure content.
- Multi-line labels are fully contained and line-spaced so lines do not touch.
- Comparison figures keep their states clearly separated.
- Reader-facing copy contains no raw schema ids, renderer keys, fixture keys,
  TODO markers, debug labels, or scaffold language unless the spec explicitly
  requires that exact visible wording.
- The figure is not a generic placeholder. Its visual grammar must fit the
  declared `figure_type` and chapter concept.

If you cannot satisfy these without overlapping or dropping a required element,
STOP and report it.

---

## 7. Premium exemplar self-review (mandatory)

After the gate is green, before you declare done:
1. Rasterize: `npm run snapshot:png <figure_id>` writes `out/png/<figure_id>.png`.
2. Open the PNG and inspect it as a reader.
3. Walk the readability checklist in Section 6.
4. Then walk this premium-exemplar checklist:
   - Does the main visual teach the distinction before the evidence rail is read?
   - Does the composition feel intentionally designed rather than merely valid?
   - Is the hierarchy obvious and eye-guiding?
   - Are spacing, grouping, and label placement publication-grade?
   - Could this exact PNG be inserted into the finished handbook without apology?
   - Could this exact PNG serve as the calibration exemplar for future figures of
     the same class?
5. Write a final self-review gap list.
6. If the gap list is not empty, the figure is not done. Fix the renderer and
   repeat.

A figure that is only correct, readable, or technically publication-credible is
NOT complete if it is still below exemplar quality.

---

## 8. Fixtures

- If a renderer needs data, add a deterministic synthetic fixture under
  `packages/fixtures/`, matching the spec's `fixture` block.
- Synthetic only. Never live data, never recorded real ticks, never anything
  fetched at runtime.
- Fixtures are deterministic: fixed values, no randomness, no time dependence.

---

## 9. Escalate (STOP and ask a human) when

- A spec looks conceptually wrong, shallow, mis-typed, or incomplete.
- A required evidence item cannot be drawn from the available fixture.
- The figure cannot be made readable without overlapping required elements or
  dropping evidence.
- The figure can be made correct but not premium enough without revisiting the
  spec or broader visual grammar.
- The gate fails for a reason outside the renderer you are building.
- You feel pressure to classify a technically-correct but visually mediocre plate
  as approved. That pressure is itself a stop signal.
- You find yourself wanting to edit anything under `specs/` or `domain-qa/`, to
  weaken the gate, to invent a `figure_type`, or to add a dependency.

When you escalate, report precisely what is blocking and why, and propose the
narrowest safe options.

---

## 10. Source-control discipline

- One renderer-focused change per commit, or one cohesive self-contained change.
- Stage explicitly the files you changed. Do not `git add -A` from a
  subdirectory.
- Never commit build artifacts (`out/`), `node_modules/`, injected chapters, or
  any local backup, recovery, or scratch directory.
- Do not amend, rebase, or rewrite shared history.
- Do not change git configuration or author identity.
- You may commit a renderer once the gate is GREEN and self-review is clean, but
  the figure remains pending human approval until a human reviews the PNG and
  sets `qa.visual_snapshot`.

---

## 11. Orchestration and parallelism

- Renderers are independent files. Parallel agents may each take a different
  `figure_type` without collision, coordinating only `rendererMap`.
- Do NOT parallelize spec authoring.
- Do NOT parallelize human review.
- Do NOT batch-approve a tranche. Every approved PNG is a figure-specific
  exemplar decision.

---

## 12. Completion report (every figure)

When you stop for approval, report exactly:
- Figure id and `figure_type`.
- Files created and changed.
- The `data-evidence-id`s stamped, confirming they match the spec's
  `required_evidence` ids one for one.
- Gate result (GREEN), and confirmation the render-evidence check passed.
- Self-review result: that you opened the PNG, applied Sections 6 and 7, and the
  final gap list is empty.
- The figure's status: gate green, self-review clean, awaiting human first-
  snapshot approval (`visual_snapshot` still false unless it was already true and
  was left unchanged).
- Anything escalated or any spec concern you noticed but did not act on.

Forbidden completion language:
- "good enough"
- "acceptable for Phase B"
- "publication-credible but not final polish"
- "can be polished later"
- any equivalent caveat that lowers the approval bar

No "looks good," no "should be fine." Report facts and the checklist.

---

## 13. Key files and terms

Files:
- `specs/CHxx/*.json` : the figure specs. Truth. Human-authored. Read-only to you.
- `packages/figure-spec/` : `schema.ts` and `enums.ts`.
- `packages/figure-registry/` : the registry built from validated specs.
- `packages/design-tokens/` : colors, type, spacing.
- `packages/renderers/<type>/` : your renderers. `renderFigure.ts` holds the
  `rendererMap`. `svgPrimitives.ts` holds shared helpers.
- `packages/domain-qa/` : `runSpecAssertions.ts` and
  `runRenderAssertions.ts`. Read-only.
- `packages/fixtures/` : deterministic synthetic data.
- `scripts/` : `gate.ts`, `coverage.ts`, `snapshot.ts`, and QA runners.
- `out/svg/`, `out/png/` : generated artifacts. Never committed.

Terms:
- Gold / validated : a hand-authored spec eligible for domain QA, render QA,
  export, and snapshot review.
- Draft : a generated scaffold; off-limits to renderer agents until human
  promotion.
- Render-evidence check : verifies required `data-evidence-id`s exist.
- Visual self-review : rasterize to PNG and inspect for readability.
- Premium exemplar review : confirms the figure is strong enough to calibrate
  future figures.
- Renderer-ready gap : a validated figure that has no renderer yet.

Commands: `validate:specs`, `test:domain`, `test:render-qa`, `demo:negative`,
`export:figures`, `snapshot:png`, `inject:chapters`, `coverage`, `gate`.

---

## Changelog
- 2026-06-14 (v2.2): Elevated the governing standard from publication-ready to
  premium textbook-plate exemplar quality. Added the no-caveat approval rule,
  explicit precedent/calibration language, the premium exemplar self-review
  checklist, forbidden completion language, and explicit rejection of "good
  enough for Phase B" logic.
- 2026-06-13 (v2.1): Added the Phase B publication standard.
- 2026-06-13 (v2.0): Full rebuild into the governing operating contract.
