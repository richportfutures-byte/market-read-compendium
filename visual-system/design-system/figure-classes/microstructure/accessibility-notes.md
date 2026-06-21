# Microstructure Accessibility Notes

Status: CANDIDATE class grammar, pending human Visual Art Director review. Not approved.

Accessibility is part of quality, not a downstream compliance pass (`VISUAL_PRODUCTION_PROTOCOL.md` section 12). These notes set the accessibility law for the Microstructure (`footprint_dom_delta_sequence`) class. They inherit the Visual Language Specification (protocol section 7.3) and the accessibility requirements (protocol section 11.4, section 12).

Writing convention: no em dashes.

Note on verification: the contrast and colorblind claims below are design intent for the proposed token roles. They must be verified against the actual exported asset and the final token hex values during human review. Nothing here may be reported as machine-verified until the gate and a real export confirm it (protocol section 7, rules marked enforced must not be falsely reported as machine-enforced before automation exists).

## 1. Contrast

- All text and all essential marks must pass WCAG AA contrast against their background surface (protocol section 7.3, section 11.4).
- The three surface tiers (canvas, panel, raised panel) and the three text tiers (primary, secondary, muted) must be paired so that every label clears AA. Muted text is reserved for non-essential scaffolding (region tags, axis hints), never for evidence labels.
- Essential marks (price path, defended level, footprint aggressive cell, delta line, reload ticks, resolution arrow) must clear AA contrast against their panel, not only against the canvas.
- The candidate status banner must be high contrast so it cannot be missed.

## 2. Grayscale survivability

The absorption read must survive complete removal of color (protocol section 7.3, section 12). With color removed, the following must remain distinguishable by shape and position alone:

- Effort versus result: the climbing delta line and the highlighted footprint cell (effort) versus the flat price segment at the level (result). Distinguished by line slope, cell outline, and the flat-versus-sloped path.
- Aggressor versus absorber: the aggressive-volume cell (single bold value with a leader) versus the reload stack (multiple stacked tick shapes with a refresh-count glyph). Distinguished by shape, not hue.
- Up versus down and accept versus reject: the defended level (dashed line) versus the resolution (solid downward arrow), and price up is up by position. Distinguished by stroke style, arrowhead, and vertical direction.

Review step: render the asset to grayscale and confirm all three distinctions above are still legible.

## 3. Colorblind-safe redundancy

- Every state distinction must survive deuteranopia and protanopia (protocol section 11.4, section 12).
- The default palette uses cool versus warm (teal versus rust) rather than pure red versus green (protocol section 7.3, section 15.1), which protects the most common CVD types.
- Redundant encoding is mandatory: each participant and each state carries shape, position, and a direct label in addition to color.
  - Aggressor effort: highlighted cell plus bold numeral plus the word "aggressive" plus the teal accent.
  - Passive absorber: stacked refresh ticks plus a refresh-count glyph plus the word "reload" plus the blue accent.
  - Outcome against aggressors: dashed level line and downward arrow plus the words "defended", "no print", "resolution away" plus the rust accent.
- The forbidden-rail glyph is a no-entry mark plus a label, never red alone.

Review step: simulate deuteranopia and protanopia on the export and confirm no distinction collapses.

## 4. No color-only encoding

- Color is never the sole carrier of meaning (protocol section 7.3). This is the governing rule for the class.
- The delta sign is carried by baseline position (above or below the zero line) and by shape (line direction or bar direction), not by color alone.
- Aggressor, absorber, and outcome are separable with all color stripped. If they are not, the plate fails check F in `class-specific-checklist.md`.
- Reload intensity is shown as a count glyph, not as color intensity alone.

## 5. Reduced-motion and static-equivalent rule

- The calibration figure declares an interactive step-through mode (spec `learning_mode` step_through_sequence, `interaction` step_through). Any animated or interactive variant requires a complete static equivalent (protocol section 11.4, section 12).
- The static export must show all four sequence beats at once: effort in, mechanism, no result, resolution away. No beat may exist only in an animation frame.
- Export is always static and motion-free (protocol section 12). The renderer and export path contain no animation (`README.md` architecture rules).
- A reader with reduced-motion settings, or reading the printed book, must get the full read from the static plate.

## 6. Screen and print readability

- The plate is a print artifact first and a screen artifact second (protocol section 7.1). Both targets must be readable.
- On screen at full-column width, all labels and numerals are legible without zoom.
- In print at full-column width and at the 300 dpi PNG fallback, thin strokes must not vanish and small labels must not drop below the minimum size in section 7.
- Dark-surface design is the default; if print legibility requires it, a light variant is a Design Authority decision (protocol section 15.3), not a local change.

## 7. Minimum label clarity

- Numeric data labels (footprint and DOM cells, delta values) sit at the data-label size and must remain legible at print size; do not shrink numerals to fit more rows. If they do not fit, reduce rows toward the lower end of the 6 to 8 ceiling.
- Annotation and rail labels sit at the annotation and rail roles; they must not clip, overlap, or fall below the approved scale.
- Region tags and axis hints are the smallest text on the plate and are non-essential scaffolding; they must never carry meaning required for the read.
- No label may overlap, stack, crowd, or fight for a lane (protocol section 7.8).

## 8. Monospace numeric treatment

- All prices, volumes, deltas, resting sizes, and refresh counts use the monospace family for column alignment and tabular legibility (protocol section 7.2 enforced).
- Numeric columns in the footprint and DOM are center-aligned in fixed columns so digits line up and the eye can scan a column without drift.
- Prose, labels, headings, caption, and footer use the humanist sans family. Mixing the two families within a single value is not allowed.

## 9. Authored alt text

Every published Microstructure figure carries authored alt text (protocol section 12). Alt text must state:

- the teaching concept (absorption as effort without result);
- the key sequence (effort in, passive reload, failure to progress, resolution away);
- the professional read (aggressive volume and delta into the level, the offer reloads, price fails through, resolution against the buyers);
- the decision consequence (responsive trade against the absorbed aggressors once price fails and rolls, in context; not permission to chase);
- the forbidden misread (a low-volume pause is not absorption; an accepted break-through is not clean absorption).

The master plate carries a candidate version of this alt text in its `<title>` and `<desc>`. Production alt text is authored and recorded per figure at approval time.
