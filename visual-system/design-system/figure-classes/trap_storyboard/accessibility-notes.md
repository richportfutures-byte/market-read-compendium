STATUS: CANDIDATE, NOT APPROVED

# Trap Storyboard Accessibility Notes

Accessibility is part of the candidate grammar. Claims remain design intent until verified on a real approved export.

## Redundant Encoding

- Trap branch: warm rejected color, downward path, stop markers, arrowheads, and "forced exits" label.
- Defended branch: accepted color, hold shape, value migration block, bid-refresh ticks, and "defended" label.
- Watched level: dashed line, price badge, and structural label.
- Entry zone: band plus bracket endpoints.
- Stop pool: stacked stop markers plus location label.

Color is never the only carrier.

## Grayscale Survival

The trap and defended branches must remain distinct when color is removed:

- trap uses solid forced path, stop markers, and downward acceleration;
- defended uses dashed or alternate continuation path plus value block;
- fork marker separates both outcomes;
- stop pool markers differ in shape from entry bands.

## Contrast

Use verified text and surface tokens only. Essential labels use `color.text.primary` or semantically strong state/evidence colors against `color.surface.panel` or `color.surface.panelRaised`. Muted text is reserved for scaffolding and metadata, not required evidence labels.

## Motion And Static Equivalent

Target specs may declare step-through interaction. The static export must still show all major beats: setup, displacement, fork, trap branch, defended branch. No beat may exist only in an interactive frame.

## Alt Text Requirements

Published trap-storyboard figures need authored alt text stating:

- the watched level and entrant zone;
- the stop pool or forced-exit location;
- the fork between trap and defended outcomes;
- the trigger evidence for the trap branch;
- the professional decision consequence;
- the forbidden misread being prevented.
