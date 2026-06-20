STATUS: CANDIDATE, NOT APPROVED

# Trap Storyboard Output Fidelity Notes

This file states target fidelity for later production. It does not claim any rendered CH06 plate passes.

## Canvas

CH06 target specs currently declare `1100 x 620`. This candidate grammar uses that as the CH06 working canvas. The protocol names `1280` as full-column standard width, so final production should reconcile the canvas before Layer-3 if Design Authority requires strict full-column width.

## Print Readiness

- Price labels, evidence labels, and branch labels must be legible at book size.
- Forced-exit and defended branches must remain distinguishable in grayscale print.
- No evidence mark may sit outside the safe area.
- Thin lines must not carry required meaning alone.

## SVG And PNG Boundary

The authoritative future asset is deterministic SVG and vector PDF. PNG is only review or fallback. This Layer-2 package produced no PNG and did not invoke snapshot generation.

## Metadata

Future assets must record spec version, grammar version, renderer identity, generator identity if applicable, source commit, and human approval records. A renderer never invents approval metadata.

## Deferred Items

- Human-approved composition target for each calibrated CH06 trap-storyboard layout.
- Renderer alignment after approval.
- Actual contrast, colorblind, grayscale, and print proof verification on exported assets.
