# Microstructure Class-Specific Checklist

Status: CANDIDATE class grammar, pending human Visual Art Director review. Not approved.

This is a BLOCKER checklist, not an approval checklist. Checklists block approval; they do not grant it (`VISUAL_PRODUCTION_PROTOCOL.md` section 3, section 5.4; `CLAUDE.md`). Every item is phrased so that a failure blocks the plate. Passing every item does not approve the plate. Approval is a separate, recorded human act by the Domain Owner and the Visual Art Director against a specific spec version and asset version.

How to run it: review the rendered image first, then reconcile attributes. Vision review of the image against the spec is primary; attribute presence is secondary (protocol section 11.1). Record the id of any failed item in the review notes. Any failed item means the plate is not approved.

Writing convention: no em dashes.

## A. Conceptual truth checks (Domain Owner)

- [ ] BLOCK if the plate does not teach absorption as effort without result.
- [ ] BLOCK if heavy aggressive effort is not actually present and dominant (a pause is shown, not a contest).
- [ ] BLOCK if the passive reload mechanism is absent or not shown as a repeated state change.
- [ ] BLOCK if price prints through the defended level (accepted break-through shown as absorption).
- [ ] BLOCK if the resolution is drawn with the aggressors rather than against them.
- [ ] BLOCK if the participant attribution is wrong (aggressor and absorber swapped or indistinct).
- [ ] BLOCK if the decision consequence is overstated as standalone trade permission rather than preparation with resolution as the trigger.
- [ ] BLOCK if the professional read or decision consequence does not match the CH04 chapter.

## B. Encoding integrity checks

- [ ] BLOCK if delta is omitted, or present without a signed series, or not aligned to the price time origin.
- [ ] BLOCK if aggressive volume is not encoded in the footprint at the defended level.
- [ ] BLOCK if the failure to progress is not encoded on both the price path and the footprint cells above the level.
- [ ] BLOCK if any panel uses a non-canonical encoding for its data family (protocol section 7.4).
- [ ] BLOCK if scales are dishonest, the lie factor departs from near 1, or a non-zero baseline is used without an explicit axis-break mark and spec flag.
- [ ] BLOCK if the plate shows any data not present in the declared fixture.
- [ ] BLOCK if a decorative mark competes with evidence.

## C. Main-body teaching checks

- [ ] BLOCK if, with the evidence rail, forbidden rail, caption, and footer covered, the four-beat read (effort in, mechanism, no result, resolution away) is not legible from the body alone.
- [ ] BLOCK if the effort-versus-result relationship is not the dominant visual relationship on the canvas.
- [ ] BLOCK if any required evidence id has its primary mark in a rail rather than the body.
- [ ] BLOCK if the reading sequence cannot be followed left to right and top to bottom without untangling by effort.

## D. Label and density checks

- [ ] BLOCK if there are more or fewer than four body panels or two rails.
- [ ] BLOCK if footprint rows fall outside 6 to 8, or DOM rows are not aligned one-to-one with footprint rows.
- [ ] BLOCK if any lane holds more than one competing label or callout.
- [ ] BLOCK if labels overlap, badges stack or crowd, rail text clips, or callouts knot.
- [ ] BLOCK if any callout leader crosses another leader or a panel boundary (the shared-axis guide is exempt and must be faint and labeled).
- [ ] BLOCK if numeric values are not in the monospace family or prose is not in the humanist sans family.
- [ ] BLOCK if any font size is outside the approved scale or any spacing is off the 8 px grid except hairlines.

## E. Rail-use checks

- [ ] BLOCK if the evidence rail introduces evidence the body does not draw.
- [ ] BLOCK if the forbidden rail is used as a teaching surface rather than a guardrail.
- [ ] BLOCK if a rail carries data marks, charts, or footprint or DOM cells.
- [ ] BLOCK if removing the rails would remove the read (the rails must be removable without losing the lesson).

## F. Accessibility checks

- [ ] BLOCK if aggressor, absorber, and outcome are separable by color only (no shape, position, or label redundancy).
- [ ] BLOCK if the plate fails WCAG AA contrast for any text or essential mark.
- [ ] BLOCK if any state distinction fails under deuteranopia or protanopia simulation.
- [ ] BLOCK if the read does not survive grayscale.
- [ ] BLOCK if authored alt text is missing or does not state the concept, the key sequence, the professional read, the decision consequence, and the forbidden misread.
- [ ] BLOCK if any animated or interactive variant lacks a complete static equivalent (export is always static).

## G. Output-fidelity checks

- [ ] BLOCK if the `viewBox` is not `0 0 1280 720` or the canvas is not full-column.
- [ ] BLOCK if the plate does not survive print at full-column width (thin strokes vanish, labels become unreadable).
- [ ] BLOCK if any evidence or label sits outside the 32 px safe area.
- [ ] BLOCK if required metadata (asset version, spec version, generator identity where applicable) is absent.
- [ ] BLOCK if a renderer hardcodes hex or references a nonexistent token path.
- [ ] BLOCK if raw schema ids, `data-evidence-id` strings, figure ids, debug terms, TODOs, placeholder labels, or scaffold language are visible as reader content.

## H. Human-review checks

- [ ] BLOCK if the candidate status banner is present on an asset being claimed as approved, or absent on an asset that has no recorded approval.
- [ ] BLOCK if approval is being inferred from a green gate, a passing checklist, or a generated PNG rather than from recorded human sign-offs.
- [ ] BLOCK if Domain Owner sign-off is not explicitly recorded against this spec version and asset version.
- [ ] BLOCK if Visual Art Director sign-off is not explicitly recorded against this spec version and asset version.
- [ ] BLOCK if approval depends on "close enough" language or on explaining away the image.

## I. Stop conditions (escalate, do not work around)

- [ ] STOP if the four panels cannot hold the five evidence ids without overlap.
- [ ] STOP if any required evidence can only fit in a rail.
- [ ] STOP if the figure cannot be made premium without changing the spec.
- [ ] STOP if the canvas is too dense for the required evidence.
- [ ] STOP if a renderer needs architecture changes outside its assigned scope.
- [ ] STOP if a renderer begins inventing a local layout system.
- [ ] STOP if the plate cannot survive print export.
- [ ] STOP if a checklist says pass but the image visibly fails.

A stop condition protects the visual law (protocol section 16). Record it and escalate to the Domain Owner and Visual Art Director.
