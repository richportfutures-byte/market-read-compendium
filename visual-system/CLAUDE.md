# Agent Operating Contract: Visual System Renderers

Version 2.0 · Governing instruction file for the renderer-building phase.

This document is binding. It is the operating contract for any autonomous or
semi-autonomous agent working in `visual-system/` during the renderer phase. If
any other instruction, prompt, habit, or convenience conflicts with this file,
this file wins. Read it fully before you touch the repository. If you cannot
satisfy a requirement here, you STOP and report; you do not work around it.

The standard is production-grade: every figure that ships is correct against its
spec, provably readable, deterministic, and committed cleanly. "It passes the
gate" is necessary, not sufficient. "It looks done" is not a status. The only
statuses are: gate GREEN, self-review clean, and awaiting human approval.

---

## 1. Mission and role

You build renderers. One renderer per `figure_type`, each a pure function that
turns a validated spec into an SVG string.

Three authorities, fixed and non-overlapping:
- The spec is truth. It is human-authored and you never alter it.
- The gate is judge. It decides pass or fail. You never weaken it.
- The human approves. A person signs off on every first visual snapshot. You
  never approve your own.

Your job is to make the spec's declared content appear, correctly and readably,
in SVG. Nothing more, nothing less.

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

Safety frame inherited from the project (applies even though renderers do not
touch trading):
- No live market data anywhere. Fixtures are deterministic synthetic only.
- Manual-only operator authority for trading is preserved. You perform no broker,
  order, account, fill, or P&L automation, and you write nothing that does.
- Do not inspect, print, log, or commit secrets or credentials.

Scope:
- Do not touch `manuscript/`. Do not refactor the schema, the figure registry, or
  the export path. Do not invent new `figure_type` values. Do not add
  dependencies without explicit human approval.

---

## 3. Definition of done

A figure is done only when ALL of the following hold, in order:
1. `npm run gate` is GREEN.
2. `npm run validate:specs` passes and the figure validates structurally.
3. The figure's render-evidence check passes: every `required_evidence` id is
   drawn and stamped on the element that carries it.
4. VISUAL SELF-REVIEW is clean: you rasterized the figure with
   `npm run snapshot:png <figure_id>`, opened the PNG, and confirmed it reads
   cleanly against the readability standard in Section 6.
5. The renderer is registered, deterministic, and committed per Section 10.
6. You have STOPPED and handed the figure to a human for first-snapshot approval,
   with a completion report per Section 9.

The render-evidence check proves the elements exist. Self-review proves they are
readable. Human approval judges whether they are good. All three are distinct.
Passing one is not passing the others.

---

## 4. The inner loop (one renderer at a time)

1. Run `npm run coverage`. Pick ONE figure that is `validated` (gold) and has no
   renderer (a renderer-ready gap).
2. If no such figure exists, STOP. There is no renderer work to do, and authoring
   is not yours.
3. Read the spec end to end: `required_evidence`, `forbidden_errors`, `panels`,
   `sequence` if present, `annotations`, `fixture`, `export` dimensions, and
   `acceptance_criteria`. The spec dictates what must appear and what must not be
   implied. Honor both.
4. If the spec needs data, add or reuse a deterministic synthetic fixture under
   `packages/fixtures/` that matches the spec's `fixture` block (Section 8).
5. Build the renderer as a pure function under `packages/renderers/<type>/`.
   Follow the rendering contract (Section 5) and the readability standard
   (Section 6).
6. Stamp `data-evidence-id="<id>"` on the element that visually draws each
   required evidence item. The ids must match the spec's `required_evidence` ids
   exactly. Stamp the element that actually carries the evidence, never a
   decorative or invisible element to satisfy the check.
7. Register the renderer in `packages/renderers/renderFigure.ts` `rendererMap`,
   keyed by `figure_type`.
8. Run `npm run gate` until GREEN.
9. Run `npm run snapshot:png <figure_id>` and OPEN `out/png/<figure_id>.png`.
   Inspect it as a reader, not as code, against Section 6.
10. If anything collides, clips, is buried, or is hard to read, fix the renderer
    (layout and z-order only; never drop or move a required evidence element to
    resolve a collision) and return to step 8. Repeat until the PNG is clean.
11. Commit per Section 10. STOP. Request human snapshot approval.

---

## 5. The rendering contract

Signature and purity:
- A renderer is `(spec: FigureSpec) => string` returning a complete,
  self-contained, valid SVG document.
- Deterministic: the same spec in produces byte-identical SVG out. No
  `Math.random`, no `Date`, no time, no environment reads, no ordering that
  depends on object iteration that is not stable. Determinism is what makes
  rasterization and future visual-regression snapshots trustworthy.

Output structure:
- The SVG root carries `viewBox="0 0 <export.width> <export.height>"` and
  `data-figure-id` set to the spec's `figure_id`.
- The figure marks itself export-ready (`data-export-ready="true"`) only when it
  has drawn every required evidence element.
- All references are internal. No external images, no external CSS, no external
  fonts fetched at render time. Fonts are referenced by family name only and
  resolve at raster or display time.

Evidence:
- Every `required_evidence` id appears at least once, stamped on the element that
  draws it. If the figure shows two states (for example an acceptance side and a
  rejection side) the same evidence may legitimately appear on each; that is fine
  as long as every required id is present.
- Do not satisfy the check by stamping ids on hidden, zero-size, or off-canvas
  elements. The element must visibly carry the evidence the id names.

Color and type:
- Read all semantic colors from `packages/design-tokens/`. Never hardcode a
  semantic color. Tokens are the single source for the palette so the whole pack
  stays coherent and themeable.
- Use the project's type families. Keep type sizes within the scale the tokens
  and existing renderers establish.

Layer order (paint back to front, lowest to highest):
1. Background.
2. Axes, gridlines, structural reference geometry.
3. Profiles, zones, value bands, shaded regions.
4. Price paths and primary data marks.
5. Reference lines that must remain visible (for example the shared level line).
6. Arrows and connectors.
7. Text labels and badges, last, on top of everything, each with an opaque
   background where it sits over non-background content.

Labels and badges are always the topmost layer. Text is never painted under a
path, a band, or another label.

---

## 6. Readability standard (enforced by self-review)

A figure that is correct but unreadable is not done. These are the concrete,
checkable rules. The render-evidence check cannot see them; you must.

- No text element overlaps another text element. Ever.
- No text overlaps a price path, profile band, zone, or other mark unless it
  carries an opaque background rectangle sized to the text with padding, so the
  text reads cleanly over what is behind it.
- Badges (labelled callouts) have an opaque background fully containing their
  text, with padding on all sides. Text never spills past, or is clipped by, its
  own background. Badge text has legible contrast against the badge fill; never
  dark text on a dark or saturated fill.
- Everything is inside the export canvas. Nothing is clipped at an edge, nothing
  runs off-canvas, and content respects a consistent outer margin.
- Every arrow or connector terminates at the element it annotates, and starts
  from its label. No arrows pointing at empty space.
- The title and subtitle are never overlapped by figure content.
- Multi-line labels are fully contained and line-spaced so lines do not touch.
- Comparison figures keep their two states clearly separated; a label belonging
  to one state never bleeds into the other.

If you cannot satisfy these without overlapping or dropping a required element,
the spec may be over-dense for its canvas. Do not ship it unreadable and do not
drop evidence to fit. STOP and report it (Section 8 escalation).

---

## 7. Visual self-review (mandatory)

After the gate is green, before you declare done:
1. Rasterize: `npm run snapshot:png <figure_id>` writes
   `out/png/<figure_id>.png`. This uses a headless browser for rasterization
   only; it does not touch the export path.
2. Open the PNG and inspect it as a reader. Walk the Section 6 checklist
   explicitly. Verify, in addition, that every `required_evidence` element is not
   just present but visible and identifiable, and that no `forbidden_errors`
   misread is implied by the layout.
3. If anything fails, fix the renderer and re-run the gate and the snapshot.
   Repeat until clean.

Self-review reduces the number of human review rounds. It does not replace human
approval. The human still judges taste and signs off on the first snapshot.

---

## 8. Fixtures

- If a renderer needs data, add a deterministic synthetic fixture under
  `packages/fixtures/`, matching the spec's `fixture` block (kind, instruments,
  the described scenario and numbers).
- Synthetic only. Never live data, never recorded real ticks, never anything
  fetched at runtime.
- Fixtures are deterministic: fixed values, no randomness, no time dependence.

---

## 9. Escalate (STOP and ask a human) when

- A spec looks conceptually wrong, shallow, mis-typed (for example a
  `figure_type` that does not match the figure the spec describes), or
  incomplete. Report it. Do not fix the spec.
- A required evidence item cannot be drawn from the available fixture.
- The figure cannot be made readable without overlapping required elements or
  dropping evidence (the spec may be over-dense for its canvas).
- The gate fails for a reason outside the renderer you are building.
- You find yourself wanting to edit anything under `specs/` or `domain-qa/`, to
  weaken the gate, to invent a `figure_type`, or to add a dependency, in order to
  pass. The pull to do any of these is itself the signal to stop and ask.

When you escalate, report precisely what is blocking and why, and propose options
if you have them. Do not proceed on a guess.

---

## 10. Source-control discipline

Clean history is part of the deliverable.

- One renderer per commit (or one cohesive, self-contained change). The commit
  message names the figure or figure_type and what was done.
- Stage explicitly the files you changed. Do not `git add -A` from a
  subdirectory; it sweeps in unrelated changes and untracked artifacts. Know
  exactly what you are committing.
- Never commit build artifacts (`out/`), `node_modules/`, injected chapters, or
  any local backup, recovery, or scratch directory. If you create such a
  directory, add it to `.gitignore` before committing anything.
- Do not amend, rebase, or rewrite history that has been shared or pushed. Tidy
  only local, un-pushed work, and prefer a new commit over a rewrite.
- Do not change git configuration or author identity.
- You may commit a renderer once the gate is GREEN and self-review is clean, but
  the figure remains pending human snapshot approval until a human reviews the
  PNG and sets `qa.visual_snapshot` (a spec edit, human-only). Your commit
  records the renderer; it does not record approval.

---

## 11. Orchestration and parallelism

- Renderers are independent files. Parallel agents may each take a different
  `figure_type` without collision, since each writes its own renderer directory
  and adds one line to `rendererMap`.
- Coordinate the single shared edit (`renderFigure.ts` `rendererMap`) so parallel
  agents do not clobber each other; each adds only its own key.
- Do NOT parallelize spec authoring. It is human, serial, and off-limits.

---

## 12. Completion report (every figure)

When you stop for approval, report exactly:
- Figure id and `figure_type`.
- Files created and changed (renderer, fixture, the `rendererMap` line).
- The `data-evidence-id`s stamped, confirming they match the spec's
  `required_evidence` ids one for one.
- Gate result (GREEN), and confirmation the render-evidence check passed.
- Self-review result: that you opened the PNG and the readability checklist is
  clean, noting anything you deliberately left for human judgment.
- The figure's status: gate green, self-review clean, awaiting human first-
  snapshot approval (`visual_snapshot` still false).
- Anything you escalated or any spec concern you noticed but did not act on.

No "looks good," no "should be fine." Report facts and the checklist.

---

## 13. Key files and terms

Files:
- `specs/CHxx/*.json` : the figure specs. Truth. Human-authored. Read-only to you.
- `packages/figure-spec/` : `schema.ts` (the Zod `FigureSpec`) and `enums.ts`
  (allowed `figure_type`, `tier`, `status`, panel roles, annotation types, etc.).
- `packages/figure-registry/` : the registry built from validated specs.
- `packages/design-tokens/` : colors, type, spacing. The only source of semantic
  color.
- `packages/renderers/<type>/` : your renderers. `renderFigure.ts` holds the
  `rendererMap`. `svgPrimitives.ts` holds shared SVG helpers.
- `packages/domain-qa/` : `runSpecAssertions.ts` (spec-level rule families) and
  `runRenderAssertions.ts` (the output-level render-evidence check). Read-only.
- `packages/fixtures/` : deterministic synthetic data.
- `scripts/` : `gate.ts`, `coverage.ts`, `snapshot.ts`, and the QA runners.
- `out/svg/`, `out/png/` : generated artifacts. Never committed.

Terms:
- Gold / validated : a hand-authored spec that passes domain and render QA.
- Draft : a generated scaffold; the gate refuses to render, QA, or inject it
  until a human promotes it.
- Render-evidence check : parses the rendered SVG and fails if a required
  `data-evidence-id` is missing. The inner-loop oracle that elements exist.
- Visual self-review : rasterize to PNG and inspect for readability. The oracle
  that elements are readable.
- Renderer-ready gap : a validated figure that has no renderer yet. Your work
  queue.

Commands: `validate:specs`, `test:domain`, `test:render-qa`, `demo:negative`,
`export:figures`, `snapshot:png`, `inject:chapters`, `coverage`, `gate`.

---

## Changelog
- 2026-06-13 (v2.0): Full rebuild into the governing operating contract. Added
  inviolable boundaries as a single hard-stop section (Section 2); an explicit,
  checkable Readability Standard (Section 6) and a mandatory Visual Self-Review
  step using the new `snapshot:png` rasterizer (Section 7), closing the gap where
  layout collisions passed the presence-based render-evidence check undetected;
  determinism and SVG-validity requirements in the rendering contract (Section 5);
  source-control discipline (Section 10) covering atomic per-renderer commits,
  explicit staging, never committing artifacts or local backups, and never
  rewriting shared history or changing author identity; a structured completion-
  report format (Section 12); and a key-files-and-terms map (Section 13). Human
  first-snapshot approval and the spec/QA immutability rules are unchanged and
  remain absolute.
- 2026-06-13 (v1.1): Added the initial visual self-review step to the inner loop.
- (v1.0): Original agent brief: definition of done, inner loop, hard rules,
  fixtures, escalation, orchestration.
