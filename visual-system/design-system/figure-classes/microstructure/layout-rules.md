# Microstructure Layout Rules

Status: CANDIDATE class grammar, pending human Visual Art Director review. Not approved. These rules are proposed visual law for the Microstructure (`footprint_dom_delta_sequence`) class and become binding only after recorded human approval.

Governing authority: `VISUAL_PRODUCTION_PROTOCOL.md`, section 7 (Visual Language Specification) and section 8 (figure-class grammars). This file inherits the Visual Language Specification and adds class-specific composition rules. It does not reinterpret the spine.

Writing convention: no em dashes.

Coordinates below reference `approved-master-plate.svg` in this folder. The plate is the canonical composition; these rules generalize it.

## 1. Canonical composition

The Microstructure plate is a four-panel coordinated microstructure read on a shared price and time frame, with two verifying rails, a caption, and a footer. The single sentence the composition must teach by layout alone:

> Heavy effort (footprint volume plus signed delta) went into a level, the passive side reloaded, price did not progress, and price resolved away from the side that spent the effort.

The composition expresses this as an explicit **effort versus result** relationship. Effort lives in the footprint and delta. Result lives in the price path. Mechanism lives in the DOM. Resolution lives in the price path. The reader reads effort against result first; the rails are read last.

## 2. Canvas and grid

- Fixed `viewBox`: `0 0 1280 720` (full-column width, protocol section 7.1; matches calibration spec `export`).
- Outer margin: 32 px on all sides. Content box: x 32 to 1248, y 32 to 688.
- Spacing unit: 8 px. All internal spacing, panel sizes, gutters, and band heights are multiples of 8. Only hairline strokes may be off-grid (protocol section 7.1).
- Half-column variant (640 viewBox) is not defined for this class. Microstructure requires full-column width to carry four panels plus rails without breaching the density ceiling. A half-column microstructure plate is a stop condition, not a layout exercise.

## 3. Named layout regions

The grammar defines eight named regions. Producers fill these regions. Producers do not invent local regions (protocol section 7.1).

| Region | Name | Bounds (x, y, w, h) | Role |
| --- | --- | --- | --- |
| Title band | `title-band` | 32, 32, 1216, 48 | Figure title and subtitle |
| Status banner | `status-banner` | 32, 88, 1216, 32 | Review-status banner (candidate plates only) |
| Body panel A | `price-path` | 32, 136, 312, 264 | Result and resolution |
| Body panel B | `footprint` | 360, 136, 312, 264 | Aggressive effort and failure to progress |
| Body panel C | `dom-reload` | 688, 136, 312, 264 | Passive reload mechanism |
| Body panel D | `delta` | 32, 416, 968, 104 | Signed effort spine |
| Evidence rail | `evidence-rail` | 1016, 136, 232, 384 | Verifies required evidence |
| Forbidden rail | `forbidden-misread-rail` | 32, 536, 1216, 64 | Verifies misreads excluded |
| Caption | `caption` | 32, 608, 1216, 40 | Professional read and decision consequence |
| Footer | `footer` | 32, 656, 1216, 24 | Provenance and status metadata |

The status banner is mandatory on candidate plates and is removed only when a real approval record exists. It never substitutes for a recorded sign-off.

## 4. Allowed panel count

- Body panels: exactly four. Price path, footprint, DOM reload, delta. No fifth body panel, no merged panel, no dropped panel.
- Rails: exactly two. Evidence rail and forbidden-misread rail.
- A microstructure read that appears to need a fifth panel has exceeded the class and is a stop condition. Escalate; do not crowd.

## 5. Panel hierarchy

Visual weight, strongest to weakest:

1. The effort versus result relationship: the footprint aggressive-volume cell and the delta climb (effort) read against the flat price path at the level (result). This relationship is the loudest thing on the canvas.
2. The passive reload on the DOM (the mechanism that explains the non-progression).
3. The resolution away on the price path (the decision trigger).
4. Panel titles, axis references, and direct labels.
5. The two rails.
6. Caption and footer.

If any rail outweighs the body, the hierarchy is inverted and the plate fails (protocol section 1).

## 6. Sequence reading order

The plate encodes a four-beat sequence that maps to the calibration spec `sequence` steps:

1. Effort in: price rises to the level (price path) while aggressive volume and delta climb (footprint, delta). Spec step 0 and 1.
2. Mechanism: the passive offer reloads at the defended price (DOM). Spec step 1.
3. Result: price fails to print through (price path flat at the level; footprint 0 by 0 above). Spec step 2.
4. Resolution: price resolves away, against the aggressors (price path down move). Spec step 3.

Reading direction is left to right and top to bottom. Time flows left to right within every time-based panel. Price up is up. A `time` direction cue appears on the price path and the shared time axis is marked on the delta panel.

## 7. Evidence zones

Each required evidence id has a fixed home in the body. None lives in a rail.

| Evidence id | Body home | Mark |
| --- | --- | --- |
| `aggressive_volume` | footprint, defended-level row, ask side | highlighted heavy volume cell plus direct label |
| `delta` | delta panel | signed cumulative series climbing into the level plus effort bracket |
| `passive_reload` | dom-reload, defended-level row, ask side | stacked refresh ticks plus reload label plus refresh count |
| `failure_to_progress` | price path flat at the level, and footprint 0 by 0 cells above the level | flat path segment plus outlined empty cells |
| `resolution_away` | price path | downward move plus arrow plus label |

The evidence rail names these five. It never introduces a sixth, and it never hosts the primary mark for any of them.

## 8. Callout placement

- Annotation types are limited to the protocol set (section 7.6): arrow, bracket, callout, label, zone, rail.
- At most one callout competes for a lane in any single panel. The master plate uses: one result callout (price path), one resolution arrow (price path, distinct lane), one aggressive-volume label (footprint right lane), one reload label (DOM right lane), one effort bracket (delta top lane).
- Callouts anchor to defined callout zones. The price-path callout zone is the band at y 184 to 206 above the level line.
- Leaders are single and short. No leader crosses another leader. No callout leader crosses a panel boundary.
- Shared-axis alignment guides are a separate class of annotation from callout leaders. A faint vertical time-alignment guide is permitted to express the shared x-axis between price and delta and does not count against the no-crossing rule. It is faint, dashed, muted, and labeled.

## 9. Label-lane strategy

Fixed lanes, one purpose each, so labels never fight:

- Price path: a right-edge lane (anchor end at x 328) for the level value; a left lane for the level name; a dedicated top callout zone for the result callout; the lower-right for the resolution label.
- Footprint: three fixed numeric columns (bid at x 432, price at x 516, ask at x 600), all monospace, center-anchored; a right-edge lane (anchor end at x 656) for the aggressive-volume and no-print labels.
- DOM: three fixed numeric columns (bids at x 752, price at x 844, asks at x 936); a right-edge label lane at x 980 for the reload annotation.
- Delta: a top lane (y 426 to 444) for the effort bracket; a left lane for the zero label; a baseline-aligned lane for axis text.
- Evidence rail: a checkbox column at x 1032 and a text column at x 1052.
- Forbidden rail: five evenly spaced item slots across the full width, each with a glyph and a two-line label.

Numeric values use the monospace family. Prose labels use the humanist sans family. This split is mandatory (protocol section 7.2).

## 10. Density ceiling

The Microstructure ceiling is the strictest in the corpus. Exceeding any item is a stop condition (protocol section 7.8).

- 4 body panels, 2 rails. No more.
- Footprint rows: 6 to 8 inclusive, centered on the defended level.
- DOM rows: aligned one-to-one with the footprint rows.
- Primary body callouts: at most 3 (result, resolution, reload), plus 1 effort bracket and 1 aggressive-volume label. No second callout in the same lane.
- Evidence rail items: at most 5. Forbidden rail items: at most 5.
- Callout leaders crossing a panel boundary: 0.
- Overlapping labels, stacked badges, crowded badges, rail text clipping, callout knots, leader tangles: all are zero-tolerance.

## 11. Rail behavior

- Both rails are present on every Microstructure plate. The evidence rail is the right column spanning body rows 1 and 2. The forbidden rail is a full-width band below the body.
- The evidence rail verifies; it never teaches. If a reviewer can only make the absorption read by reading the evidence rail, the plate fails.
- The forbidden rail lists excluded misreads. It is a reviewer guardrail, not instruction.
- Rail backgrounds use the raised-surface role to separate them from body panels. Rails carry no data marks, no charts, and no footprint or DOM cells.

## 12. Typography roles

Inherited from the Visual Language Specification (protocol section 7.2). Class usage:

- figure title: title band, sans, 24, weight 700.
- figure subtitle: title band, sans, 13, secondary.
- panel title: each body panel header, sans, 11, weight 700, muted.
- axis label and tick label: delta zero, DOM and footprint headers, sans or mono as appropriate, 10.
- data label: footprint and DOM cell values, mono, 12.
- annotation label: callouts and bracket text, sans, 10.
- evidence rail heading: sans, 11, weight 700. evidence rail item: sans, 11.
- forbidden rail heading: sans, 11, weight 700. forbidden rail item: sans, 10.
- caption: sans, 12 primary and 11 secondary.
- footer metadata: sans, 10, muted.

Producers reference type roles, never raw sizes, in any renderer (protocol section 7.2).

## 13. Semantic color roles

Color is semantic, never decorative (protocol section 7.3). Class mapping, by token role:

- Aggressor effort (initiative side into the level): the aggressor's directional accent. In the calibration case the aggressors are buyers, so this is the up or constructive accent (`evidence.deltaPositive` / `state.accepted`, teal). Reinforced by the highlighted footprint cell, the climbing delta line, and the word "aggressive."
- Passive absorber (resting and reloading liquidity): the passive accent (`evidence.volume`, blue), reinforced by the stacked refresh-tick shape, the refresh-count glyph, and the word "reload." This treatment must be visually distinct from the aggressor treatment so the participant distinction survives.
- Outcome against the aggressors (defended level, failure to progress, resolution away): the down or rejected accent (`evidence.deltaNegative` / `state.rejected`, rust), reinforced by the dashed level line, the outlined empty cells, and the downward arrow.
- Evidence accent and brackets: the sand accent (`state.stalk`), used for the effort bracket and the candidate-status banner.
- Forbidden glyphs: the forbidden role (`risk.forbidden`, red) with a redundant no-entry glyph, used only in the forbidden rail.
- Surfaces and text: canvas, panel, raised-panel, and the three text tiers per tokens.

Color is never the sole carrier. Aggressor versus absorber versus outcome must be distinguishable by position, shape, and label with color removed (see `accessibility-notes.md`).

Participant-direction rule: the aggressor accent follows the aggressors' direction, not a fixed "effort hue." When the aggressors are sellers, the aggressor accent is the down accent and the resolution accent is the up accent. This keeps the encoding honest across microstructure cases. This rule is flagged for human confirmation.

## 14. Stop conditions (layout-specific)

Stop and escalate when:

- the four panels cannot hold the five evidence ids without overlap;
- a required evidence mark can only fit in a rail;
- the footprint needs more than 8 rows to make the read;
- delta cannot be aligned to the price time origin without a crossing leader;
- the resolution cannot be drawn against the aggressors within the price panel;
- any callout must stack or share a lane to fit;
- the plate cannot survive print at full-column width.

A stop condition protects the visual law. It is not a failure of the task (protocol section 16).

## 15. Acceptable variations

- Aggressors are sellers instead of buyers: swap the aggressor and outcome accents per the participant-direction rule; the layout is unchanged.
- Defended level is a floor instead of a ceiling: mirror the price path vertically; effort presses down, resolution is up; the four-panel structure is unchanged.
- Footprint row count of 6, 7, or 8, centered on the defended level.
- Refresh count on the DOM reload may vary with the fixture, shown as a count glyph, not as color intensity alone.
- Delta may be drawn as a stepped line or as signed bars, provided sign is carried by baseline position and shape, not color alone.

## 16. Non-acceptable variations

- Moving any required evidence mark into a rail.
- Replacing the delta panel with a rail item or a caption sentence.
- A full DOM ladder dump beyond the footprint neighborhood.
- A generic multi-widget dashboard layout with no effort-versus-result spine.
- Color-only participant distinction (aggressor and absorber separable by hue only).
- An accepted print through the defended level while labeling the plate clean absorption.
- A flat, low-volume price panel presented as absorption with no effort marks.
- Decorative gridlines, ornament, drop shadows, gradients used as decoration, or any mark that competes with evidence.
- Half-column or non-1280 canvas for this class.
- Raw schema ids, `data-evidence-id` strings, figure ids, debug terms, TODOs, or placeholder labels visible as reader content.
