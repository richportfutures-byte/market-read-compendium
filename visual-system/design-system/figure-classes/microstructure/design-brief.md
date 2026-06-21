# Microstructure Figure-Class Design Brief

Status: CANDIDATE class grammar, pending human Visual Art Director and Domain Owner review. Not approved. No approval record exists or may be inferred from this file.

Governing authority: `VISUAL_PRODUCTION_PROTOCOL.md`. This brief is subordinate to that protocol and inherits the Visual Language Specification (protocol section 7). Where this brief and the protocol disagree, the protocol wins and this brief is defective and must be corrected.

Writing convention: no em dashes, per protocol.

## Class identity

- Class name: Microstructure (absorption through footprint, DOM, and delta).
- Protocol class slot: "Absorption, footprint, DOM, and delta microstructure" (protocol section 8.1) and "Microstructure grammar" (protocol section 10.1).
- Governed figure type: `footprint_dom_delta_sequence` (the canonical `figure_type` enum in `packages/figure-spec/enums.ts`).
- Calibration figure: `CH04_ABSORPTION_001` ("Absorption: Effort Without Result"), `specs/CH04/CH04_ABSORPTION_001.json`.
- Folder-naming note: the protocol artifact path pattern in section 8.3 is written as `design-system/figure-classes/<figure_type>/`, which would literally resolve to `footprint_dom_delta_sequence/`. The protocol class naming in sections 8.1 and 10.1 uses `microstructure`. This folder uses `microstructure` per explicit task instruction and because no prior `design-system/figure-classes/` convention exists. Reconciliation of the two naming forms is a human decision and is flagged in the completion report.

## What market-read distinction this class teaches

This class teaches the reader to see **absorption as effort without result**, and to separate it from three look-alikes that a junior trader confuses with it:

1. A genuine, contested defense of a price (real absorption).
2. A quiet low-volume pause where no contest is being fought (not absorption).
3. An accepted move through a level that only looks like a defense in hindsight (failed absorption or no absorption, never "clean absorption").

The professional distinction is mechanical, not aesthetic. Absorption exists only when heavy initiative effort (aggressive traded volume and signed delta) is spent into a level, the passive side keeps replenishing resting size at the defended price, price fails to progress through the level, and the move resolves against the side that spent the effort. The reader must learn to require all of that evidence at once, and to withhold the absorption read when any piece is missing.

## What the reader must see first (before any rail, caption, or prose)

The body must deliver the read in this order, by composition alone:

1. **Effort went in.** Heavy aggressive volume and a climbing signed delta press into the defended level. The eye sees a large, directional commitment.
2. **Result did not follow.** On the price path, price arrives at the level and flatlines: no print through. The effort and the flat result sit side by side so the divergence is unavoidable.
3. **Why it did not follow.** The passive side reloads resting liquidity at the defended price (the iceberg or refresh signature), so the effort is consumed without moving price.
4. **How it ends.** Price resolves away from the absorbed side, against the aggressors who spent the effort.

If the reader covers the evidence rail, the forbidden rail, the caption, and the footer, the four-beat read above must still be legible from the body panels alone. That is the protocol's defining quality law (section 1) applied to this class. A Microstructure plate that needs the rail to make the absorption read is a failed plate.

## What the body must encode

The body (not the rail) must materially encode every required evidence id from the calibration spec:

- `aggressive_volume`: heavy aggressive traded volume into the level, shown in the footprint at the defended price.
- `delta`: signed cumulative delta pressing into the level, shown as a dedicated delta spine aligned beneath the price path on a shared time axis.
- `passive_reload`: passive resting liquidity refreshing at the defended price, shown on the DOM panel as an explicit repeated-refresh state, not as a single static number.
- `failure_to_progress`: price failing to print through the level, shown both on the price path (flat at the ceiling or floor) and in the footprint (zero or near-zero volume in the cells beyond the level).
- `resolution_away`: resolution away from the absorbed side, shown on the price path as the move against the aggressors.

The effort-versus-result structure is the spine of the composition. The plate must place an explicit effort reference (footprint volume plus delta climb) against an explicit result reference (flat price path, no print through) so the contradiction is the dominant visual relationship on the canvas.

## What participant behavior must be visible

The plate must make the two participants visually distinct and correctly attributed:

- **Aggressors** apply effort. They are the initiative side lifting the offer (or hitting the bid). Their behavior is encoded by aggressive traded volume in the footprint and by the signed delta climbing into the level. They are labeled as aggressors, not merely as "buyers" or "volume."
- **Passive absorber** absorbs effort. It is the resting, reloading side at the defended price (the iceberg or refreshed offer). Its behavior is encoded on the DOM panel as a repeated reload at one price, and reinforced by the structural treatment of the defended level on the price path.

The reader must be able to say, from the body alone, who spent and who absorbed. Effort and absorber must not be rendered in a way that lets the reader mistake the aggressor's commitment for a winning move.

## What decision consequence must be visible

The plate must encode the decision consequence from the calibration spec without overstating it:

- Confirmed absorption authorizes a **responsive** trade against the absorbed aggressors **once price fails through and rolls**, in context.
- Absorption is **preparation evidence**, not standalone execution permission. Tape and footprint alone do not authorize a trade outside auction context.

The composition must therefore frame the resolution as the trigger, not the absorption signature alone, and must avoid any visual that reads as "see effort, take trade." The decision-consequence line belongs in the caption and in the evidence rail, but the resolution-as-trigger must also be visible in the body (the move away is drawn, not merely asserted).

## What junior misread must be prevented

The grammar must structurally prevent each forbidden misread in the calibration spec (`forbidden_errors`), and the prevention must be visible in the body, not only listed in the forbidden rail:

- `low_volume_pause_as_absorption`: never present a low-volume stall as absorption. Heavy effort must be visibly present, or the plate is not teaching absorption.
- `accepted_break_through`: never show an accepted break through the absorbed level while labeling it absorption. The level holds; price does not print through.
- `omit_delta`: never omit delta. Effort without result is unreadable without the signed series.
- `omit_passive_reload`: never omit the passive reload. It is the mechanism that produces non-progression.
- `tape_authorizes_alone`: never imply tape alone authorizes a trade outside auction context.

Two additional junior misreads, named in the task and enforced by this grammar:

- Treating **stillness as proof** of absorption. A flat price with no effort is a pause, not absorption. The plate must show effort, not just flatness.
- Treating tape as **full trade permission**. The plate must frame absorption as preparation, with resolution as the trigger.

## What belongs in the rail only

The rail verifies; it never carries the read. In the rail, and only in the rail:

- The **evidence rail** restates the five required evidence ids as a checklist a reviewer can tick against the body. It names each evidence item; it does not introduce evidence that the body fails to draw.
- The **forbidden rail** restates the misreads this plate must not imply. It is a guardrail for the reviewer, not a teaching surface.

If any required evidence appears only in the rail and not in the body, the plate fails (protocol stop condition: required evidence moved into the rail because the body cannot carry it).

## Density ceiling

The Microstructure class is the densest in the corpus, so its ceiling is strict and is a stop condition when exceeded, not a layout problem to crowd through:

- Body panels: exactly four (price path, footprint, DOM, delta). No fifth body panel.
- Rails: exactly two (evidence, forbidden). No third rail.
- Footprint price rows: 6 to 8 inclusive. The defended level plus a small neighborhood above and below. Not a full ladder dump.
- DOM price rows: aligned one-to-one with the footprint rows. No independent DOM ladder length.
- Primary body callouts: at most three (effort, result, reload). One effort-versus-result bracket pair counts as one callout relationship.
- One callout maximum per body panel competing for a lane. No stacked or knotted callouts.
- Evidence rail items: at most five (one per required evidence id).
- Forbidden rail items: at most five (one per forbidden error).
- Annotation leaders crossing panel boundaries: zero. Leaders stay inside their panel or terminate in a defined callout zone.

Exceeding any ceiling is a stop condition. Do not shrink type, overlap lanes, or stack badges to fit.

## Label architecture

- Direct labeling is preferred over legends. Every effort and absorber mark carries its own inline label in its own lane.
- Numeric values (prices, volumes, deltas, resting sizes) use the monospace family. Prose labels use the humanist sans family.
- Fixed label lanes per region (defined in `layout-rules.md`): a right-edge lane on the price path for the level label and resolution label; a center price column in the footprint; a right-edge reload lane in the DOM; a top lane in the delta panel for the effort bracket.
- Callouts anchor to defined callout zones with single, non-crossing leaders. No leader crosses another leader. No leader crosses a panel boundary.
- No raw schema ids, no `data-evidence-id` strings, no figure_id, no debug terms, and no placeholder text are visible to the reader in a production plate. Evidence-id mapping lives in renderer notes and in non-rendering authoring comments only.

## Output format requirements

- Screen: SVG with a fixed `viewBox` of `0 0 1280 720` (full-column width per protocol section 7.1; matches the calibration spec `export` dimensions).
- Print: vector PDF primary.
- Fallback: 300 dpi PNG.
- 8 px spacing unit governs all internal spacing; all spacing is a multiple of 8 except hairline strokes (protocol section 7.1).
- Token-only color in any renderer that implements this grammar. No hardcoded hex in the renderer.
- Dark-surface design unless print legibility forces a light variant (protocol section 15.3).
- Full detail of output fidelity expectations lives in `output-fidelity-notes.md`.

## Relationship to CH04 absorption

`CH04_ABSORPTION_001` is the calibration figure for this class, not the only figure it governs. The relationship is:

- The spec owns **what to teach**: teaching objective, junior error, professional read, decision consequence, required evidence ids, forbidden misreads, panels, sequence, fixture, and export dimensions. This grammar does not restate or override the spec; it inherits it.
- This grammar owns **how the class looks and teaches**: canonical composition, layout regions, label lanes, density ceiling, color and typography roles, rail behavior, and acceptable and unacceptable layouts.
- The calibration is the absorption case (effort without result, defended ceiling, resolution down against buyers). The class must render this case as a premium textbook plate before it is trusted to render any other microstructure case.

The CH04 chapter also contains adjacent specs that this class will likely govern or inform once promoted (for example pause-versus-absorption, passive-reload-versus-pull, delta-divergence, acceptance-through-an-absorbed-level, sweep-versus-initiative-drive). Those are explicitly out of scope for this candidate set and are listed only to show the intended reuse surface. No claim is made here that this grammar is approved for them.

## What makes this class reusable beyond CH04

This grammar is reusable because absorption is one instance of a general microstructure read: **effort, mechanism, result, resolution**, told across a coordinated footprint, DOM, and delta composition on a shared price and time frame. The same four-panel spine, the same effort-versus-result relationship, the same participant attribution, and the same rail behavior carry to other microstructure reads with only the content of the panels changing, for example:

- Passive pull versus passive reload (mechanism flips: liquidity disappears instead of refreshing, and price progresses).
- Sweep through liquidity versus initiative drive (effort consumes resting size and continues, versus effort that fails).
- Delta divergence at a turn (signed effort and price disagree).
- Acceptance through a previously absorbed level (the failed-absorption or no-absorption case).

In each, the body must still carry the read, the participants must still be attributed, and the resolution must still be the decision trigger. That is why the class is worth defining once, to a premium standard, rather than designing each microstructure figure from scratch.

## Open questions for human review

These are flagged for the Visual Art Director and Domain Owner; they are not resolved here:

1. Folder naming: `microstructure/` (used here) versus `footprint_dom_delta_sequence/` (literal protocol section 8.3 pattern). Pick one canonical form for `design-system/figure-classes/`.
2. Participant color mapping: in the calibration case the aggressors are buyers (up or constructive accent) and the resolution is down (bearish accent). Confirm that initiative-side color follows the aggressor's direction rather than a fixed "effort" hue, so the grammar reads correctly when the aggressors are sellers.
3. Whether the effort-versus-result bracket pair should be a single connecting annotation across the price and delta panels, or two anchored callouts, given the zero-leader-crossing rule.
