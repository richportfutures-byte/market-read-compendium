# Microstructure Failure Examples

Status: CANDIDATE class grammar, pending human Visual Art Director review. Not approved.

Purpose: these are concrete failure patterns, strong enough to block weak future work for the Microstructure (`footprint_dom_delta_sequence`) class. Each entry states the failure, why it is a failure under `VISUAL_PRODUCTION_PROTOCOL.md`, how to detect it, and the fix or the stop. A plate that matches any pattern is rejected, not patched into acceptance.

Writing convention: no em dashes.

How to use this file: in review, walk every pattern against the rendered plate. If a pattern matches, the plate fails and the matching pattern id is recorded in the review notes. Do not argue a failing plate into approval with "close enough" or by explaining away the image (protocol section 16).

---

## F1. Rail-dependent teaching

What it looks like: the body panels are thin or generic, and the actual absorption argument lives in the evidence rail. The reader cannot tell absorption from a pause without reading the rail text.

Why it fails: violates the defining quality law. The body must teach the distinction before the rail is read (protocol section 1, section 11.6). Moving the read into the rail is an explicit stop condition (protocol section 16).

How to detect: cover the evidence rail, the forbidden rail, the caption, and the footer. If the four-beat read (effort in, mechanism, no result, resolution away) is no longer legible, this pattern is present.

Fix or stop: rebuild the body to carry the read. If the body cannot carry it, stop and escalate; do not relocate evidence to the rail.

## F2. Generic renderer scaffold

What it looks like: evenly sized boxes, placeholder titles ("Panel 1", "Chart"), default axis ticks, no effort-versus-result spine, no participant attribution. It reads as engine output, not as a textbook plate.

Why it fails: scaffold language and serviceable-only layout are explicit blockers (protocol section 11.6: no scaffold language, no placeholder labels; protocol section 4: coding agents discover design through failure and must not invent final composition). Art direction precedes renderer code.

How to detect: look for uniform panel weighting, missing effort and result emphasis, generic labels, and the absence of the aggressor and absorber distinction.

Fix or stop: return to this grammar and the master plate. Implement the approved composition, not a scaffold.

## F3. Label clutter

What it looks like: more than one callout per lane, badges stacked on badges, labels overrunning panel edges, rail text clipped, numbers and labels colliding in the footprint or DOM.

Why it fails: density and clutter rules (protocol section 7.8) and the density ceiling in `layout-rules.md` section 10. Overlapping or stacked labels are a stop condition (protocol section 16).

How to detect: scan each lane for more than one competing element; check every panel edge for overrun; check the rails for clipped text.

Fix or stop: reduce to the allowed callouts (result, resolution, reload, effort bracket, aggressive-volume label). If the read needs more labels than the ceiling allows, the plate is too dense; stop.

## F4. Overlapping lanes

What it looks like: the aggressive-volume label and the no-print label share the footprint right lane; the reload label and a DOM size collide; the effort bracket overlaps the delta line.

Why it fails: labels fighting for the same visual lane is a stop condition (protocol section 7.8, section 16). The label-lane strategy exists precisely to prevent this (`layout-rules.md` section 9).

How to detect: trace each fixed lane; confirm exactly one occupant per lane per panel.

Fix or stop: reassign to the defined lanes. If two marks genuinely need the same lane, the composition is over capacity; stop.

## F5. Missing passive reload

What it looks like: the DOM panel shows a single static resting size at the defended price, or omits the DOM entirely, so there is no reload mechanism.

Why it fails: `passive_reload` is required evidence and `omit_passive_reload` is a forbidden error (calibration spec). The reload is the mechanism that produces non-progression (protocol canonical DOM mark, section 7.4: refresh, pull, and stack shown as explicit state changes).

How to detect: confirm the DOM defended-level row shows an explicit repeated refresh (stacked ticks plus a refresh count), not one static number.

Fix or stop: add the reload as an explicit state change. Without it, the plate does not teach absorption; it teaches a stall of unknown cause.

## F6. Missing delta

What it looks like: no delta panel, or a delta panel with no signed series, or delta present but with no effort reference into the level.

Why it fails: `delta` is required evidence and `omit_delta` is a forbidden error (calibration spec). Effort without result is unreadable without delta (protocol section 7.4 canonical delta mark: signed series aligned beneath price on a shared x-axis).

How to detect: confirm a signed cumulative delta climbs into the level, is aligned to the price time origin, and carries an effort reference.

Fix or stop: add the delta spine. Without it, "effort" is asserted, not shown.

## F7. Pause mislabeled as absorption

What it looks like: a flat, quiet price with light or absent volume, no climbing delta, no reload, presented and labeled as absorption.

Why it fails: `low_volume_pause_as_absorption` is a forbidden error (calibration spec). Treating stillness as proof of absorption is the core junior misread this class must prevent (design brief). Absorption requires a contest with heavy effort.

How to detect: check that aggressive volume and a strong signed delta are actually present and visually dominant. If the plate is dominated by flatness with no effort, this pattern is present.

Fix or stop: either show the real effort (if the fixture supports it) or stop and correct the spec or fixture. Never relabel a pause as absorption.

## F8. Accepted breakout mislabeled as absorption

What it looks like: price prints through the defended level, the footprint shows volume above the level, and the plate still calls it clean absorption.

Why it fails: `accepted_break_through` is a forbidden error (calibration spec acceptance criteria: the figure never shows an accepted break through the absorbed level). An accepted move through the level is the opposite of a level that holds.

How to detect: confirm the price path is flat at the level with no print through, and the footprint cells above the level are zero by zero. Any print above the level fails this check.

Fix or stop: the level must hold. If the case is genuinely a break-through, it is a different figure (failed absorption or acceptance), not this one. Do not relabel.

## F9. Decorative dashboard aesthetic

What it looks like: a trading-terminal look with gradients, glow, drop shadows, decorative gridlines, multiple unrelated widgets, color used for mood rather than meaning.

Why it fails: color must be semantic, not decorative (protocol section 7.3); no chartjunk, no ornament that competes with evidence (protocol section 7.7); the objective is a textbook instructional plate, not an attractive dashboard (protocol section 1, design brief).

How to detect: look for any ink that does not carry evidence; look for color that maps to mood rather than to a semantic role.

Fix or stop: strip ornament. Every mark must earn its place by carrying evidence, sequence, participant behavior, or decision consequence.

## F10. Token drift

What it looks like: a renderer references colors, sizes, or token paths that do not exist in `packages/design-tokens/tokens.ts`, or hardcodes hex values, so the plate renders with undefined or off-palette fills.

Why it fails: token-only color and approved type scale are enforced (protocol section 7.2, section 7.3, section 11.3). Hardcoded hex in a renderer is a violation.

Concrete instance found in the legacy candidate: the existing `packages/renderers/footprintDomDeltaSequence/index.ts` references `t.surface.border` and `t.evidence.structure`, neither of which exists in the current token set. This is token drift and is exactly the failure to avoid. Note: this grammar does not fix that renderer; renderer alignment is a later task after human composition approval (see `renderer-implementation-notes.md`).

How to detect: diff every color and size against the token file; confirm no path resolves to undefined; confirm no literal hex appears in a renderer.

Fix or stop: reference existing token roles only. If a needed role is missing, that is a token decision for the Design Authority, not a local invention.

## F11. Textbook-insert failure

What it looks like: the plate is screen-only. At print size or in grayscale it loses the read: thin strokes vanish, color-coded participants merge, small labels become unreadable, or the plate does not fit the column without reflow.

Why it fails: textbook plates are print artifacts first (protocol section 7.1); grayscale survivability and print fidelity are required (protocol section 7.3, section 11.4, section 11.5); the plate must be insertable into the finished handbook as-is (protocol section 11.6).

How to detect: render to grayscale and to print size. Confirm aggressor, absorber, and outcome remain distinct by shape and position; confirm every label is legible; confirm the plate fits the full column.

Fix or stop: restore redundant non-color encoding and minimum label sizes (see `accessibility-notes.md` and `output-fidelity-notes.md`). If the read cannot survive print, stop.

---

## Cross-cutting rejection rules

- A checklist that says pass while the plate visually fails is itself a failure (protocol section 16). Trust the image.
- Conceptual truth outranks polish. A beautiful plate that teaches a pause as absorption is the highest-severity defect (protocol section 3).
- Any plate matching a forbidden error in the calibration spec is rejected regardless of how strong the rest of the composition is.
