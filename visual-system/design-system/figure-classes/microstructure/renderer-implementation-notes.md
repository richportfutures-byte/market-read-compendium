# Microstructure Renderer Implementation Notes

Status: CANDIDATE class grammar, pending human Visual Art Director review. Not approved. These notes guide a future renderer engineer. They do not implement renderer code, and no renderer may be changed on the strength of this candidate. Renderer alignment is a later task, after human composition approval.

Governing authority: `VISUAL_PRODUCTION_PROTOCOL.md`, section 6.3 (Layer 3 renderer), section 14.2 (coding agents), section 13.4 (source control). The renderer implements an approved target; it does not invent the target (protocol section 4, section 6.3).

Writing convention: no em dashes.

Scope guard: this file is design-authority documentation under `design-system/`. It must not be read as authorization to modify `packages/renderers/`, `packages/figure-spec/`, `packages/design-tokens/`, `specs/`, `scripts/`, or anything under `out/`. The current task created design-authority artifacts only.

## 1. Where this maps in the existing architecture

The repository already has the relevant infrastructure (see `README.md` "Layout"):

- `figure_type` enum `footprint_dom_delta_sequence` in `packages/figure-spec/enums.ts`.
- Panel role enums `price_path`, `footprint`, `dom_ladder`, `delta`, `evidence_rail`, `forbidden_rail` in `packages/figure-spec/enums.ts`.
- Calibration spec `specs/CH04/CH04_ABSORPTION_001.json` (`export` 1280 by 720, five required evidence ids, five forbidden errors).
- A legacy candidate renderer `packages/renderers/footprintDomDeltaSequence/index.ts`, wired in `packages/renderers/renderFigure.ts`.
- Pure SVG string helpers in `packages/renderers/svgPrimitives.ts` (`rect`, `text`, `arrow`, `ARROW_DEFS`, `esc`).
- Tokens in `packages/design-tokens/tokens.ts`.
- Evidence extraction by regex on `data-evidence-id` attributes in `renderFigure.ts` (`extractDrawnEvidenceIds`).

A renderer aligned to this grammar is a pure `spec -> SVG string` function consistent with the existing `renderFootprintDomDeltaSequence` signature, returning a string that `renderFigure` wraps and scans for evidence ids. No new architecture is introduced by this grammar.

## 2. Required SVG layer order

Render back to front so later layers sit above earlier ones, matching the existing renderer convention:

1. `<svg>` open with `viewBox="0 0 1280 720"`, `data-figure-id` set from the spec, and an export-ready flag that is flipped to true only at the end (the legacy renderer writes `data-export-ready="false"` then replaces it with `"true"` on return).
2. `<defs>` markers for arrowheads.
3. Background canvas rect (surface canvas token), full bleed.
4. Title band: title and subtitle.
5. Status banner: only on candidate or unapproved assets. An approved production asset omits the banner and instead carries provenance metadata; the banner is never faked and never removed without a real approval record.
6. Body panel backgrounds (panel token) for the four panels, in region order: price-path, footprint, dom-reload, delta.
7. Panel static content: titles, axis references, gridlines (minimal), numeric columns.
8. Evidence marks, each wrapped in a group stamped with its `data-evidence-id` (see section 3).
9. Annotations: brackets, callouts, arrows, the shared-axis guide.
10. Rails: evidence rail then forbidden rail (raised-surface token).
11. Caption then footer.
12. `</svg>` close, then flip the export-ready flag.

Evidence marks sit above panel backgrounds and below nothing that would obscure them. Rails render after the body so a stray body mark can never paint over rail text, but rails must not be allowed to grow into the body region.

## 3. Evidence-id stamping expectations

- Every required evidence id from the spec must appear as a `data-evidence-id` on the group that draws its primary mark, using the exact spec id: `aggressive_volume`, `delta`, `passive_reload`, `failure_to_progress`, `resolution_away`.
- The id is stamped on the body mark, never on a rail element. The rail item is a verification label, not the evidence carrier. Stamping the id on a rail element would let a rail-only plate pass evidence extraction while failing the teaching law; do not do it.
- The extractor matches `data-evidence-id="([a-z0-9_]+)"`. Keep ids lower-case, underscore-delimited, and identical to the spec ids so domain QA can reconcile drawn ids against required ids.
- The grammar supports the existing negative-render path: the renderer should honor a drop set (the legacy renderer reads `opts.dropEvidenceIds`) so QA can prove that removing an id makes the figure fail. Do not stamp an id whose mark was dropped.
- `data-evidence-id` is a machine attribute. It is never rendered as visible reader text.

## 4. Token-only styling expectations

- All color comes from `packages/design-tokens/tokens.ts` by role. No hardcoded hex in the renderer (protocol section 7.3 enforced).
- Map the grammar color roles (`layout-rules.md` section 13) to existing token paths: aggressor effort to `color.evidence.deltaPositive` or `color.state.accepted`; passive absorber to `color.evidence.volume`; outcome to `color.evidence.deltaNegative` or `color.state.rejected`; accent and bracket to `color.state.stalk`; forbidden glyphs to `color.risk.forbidden`; surfaces and text per `color.surface` and `color.text`.
- If a needed role is missing from the token file, that is a Design Authority token decision, not a local addition. Two roles the master plate uses conceptually but that are not yet distinct tokens are a panel-border role and a structural-line role; the legacy renderer already drifts by referencing nonexistent `surface.border` and `evidence.structure`. Do not reintroduce that drift. Raise the token gap for a human decision.
- Type families and sizes come from token roles, never raw values (protocol section 7.2). The numeric and prose family split is mandatory: monospace for prices, volumes, deltas, and resting sizes; humanist sans for prose and labels.
- Spacing is in multiples of 8 (protocol section 7.1 enforced).

## 5. Deterministic fixture expectations

- The figure renders only from its declared deterministic synthetic fixture (calibration spec `fixture`: heavy aggressive buy volume, cumulative delta near plus 1800, an offer that refreshes at least five times, zero prints above the level, then a flush of roughly six ticks against the buyers).
- No randomness, no time dependence, no network, no filesystem reads, no Canvas, no DOM, no runtime fetching, no animation in the renderer or export path (`README.md` architecture rules; protocol section 14.6 safety boundary).
- The figure shows no data not present in its fixture (protocol section 7.7). Footprint cells, DOM sizes, delta values, refresh counts, and the resolution magnitude all trace to fixture values.
- Counts are bounded and fixed. The plate must be byte-reproducible from the same spec and fixture.
- No live market data, no broker, order, account, fill, margin, execution, or P&L (protocol section 14.6; `README.md`).

## 6. Export-safe constraints

- Output is a single self-contained SVG string. No external font fetches at render time; font families are declared and rely on embedding or fallback at export (protocol section 15.2 print embedding is a separate human decision).
- The export path serializes the same pure SVG used by any interactive studio wrapper. Export never touches an animation library and is always static and motion-free (protocol section 12; `svgPrimitives.ts` notes).
- The `viewBox` is fixed at `0 0 1280 720`; intrinsic width and height may be set for raster fallback but must preserve aspect.
- Safe area is the 32 px outer margin; no evidence or label is placed outside the content box.
- Export metadata (asset version, spec version, generator identity) is recorded per protocol section 11.5 and section 13.3. The renderer does not invent approval metadata.

## 7. What the renderer may choose

- Exact coordinates within the approved regions and lanes (protocol section 6.3: exact coordinates only inside the approved grammar and composition).
- Footprint row count within the 6 to 8 ceiling, centered on the defended level, consistent with the fixture.
- Stepped line versus signed bars for delta, provided sign is carried by baseline position and shape, not color alone.
- Tick geometry for the reload stack, provided the refresh count is shown as a count glyph.
- Minor gridline placement within the no-chartjunk rule.

## 8. What the renderer may not choose

- The region map, panel count, reading order, or which panel hosts which evidence id.
- Moving any evidence id into a rail, or stamping an id on a rail element.
- Inventing layout regions or a new layout system locally (explicit stop condition, protocol section 16).
- Changing the canvas size, the grid unit, the type scale, or the token palette.
- Adding a fifth body panel or a third rail.
- Showing an accepted print through the defended level.
- Omitting delta or passive reload.
- Setting `qa.visual_snapshot` true, marking a figure approved, or removing the candidate status banner without a recorded approval (protocol section 5.3, section 14.2; `CLAUDE.md`).

## 9. How to avoid local layout invention

- Treat `approved-master-plate.svg` and `layout-rules.md` as the layout source of truth once they are human-approved. Read coordinates and lanes from the grammar; do not derive a fresh layout from the spec prose.
- If the spec seems to require something the grammar does not support, that is a stop condition. Escalate to the Visual Art Director and Domain Owner. Do not solve it by inventing layout.
- If two marks cannot fit without sharing a lane, the plate is over the density ceiling. Stop; do not crowd.

## 10. Sequence of work (later task, not now)

This is the intended order once the master plate is human-approved. It is recorded for planning only and is not authorized by the current task:

1. Confirm the spec is `validated` and the class grammar is approved.
2. Confirm the composition target (this master plate) is approved.
3. Align or rewrite `packages/renderers/footprintDomDeltaSequence/index.ts` to the approved regions, lanes, and token roles, fixing the existing token drift.
4. Run `npm run gate` and confirm green.
5. Generate the PNG with `npm run snapshot:png CH04_ABSORPTION_001` and open it for review.
6. Complete `class-specific-checklist.md` as a blocker pass.
7. Record Domain Owner and Visual Art Director sign-offs.
8. Commit focused source files only; never stage `out/` (protocol section 13.4).

Until step 2 is satisfied by a real human approval, no renderer work begins.
