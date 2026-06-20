STATUS: CANDIDATE, NOT APPROVED

# Trap Storyboard Failure Examples

These failures block CH06 `trap_storyboard` work. Passing this list does not approve any figure.

## F1. Hindsight Trap Label

What it looks like: the reversal is labeled "trap" only after the cascade reaches target.

Why it fails: CH06 requires entry location and forced-exit location before resolution.

Detection: cover the final outcome. If no trap-risk location remains visible, this failure is present.

Fix or stop: move the trap-risk setup into the pre-resolution body. If it cannot fit, stop.

## F2. Displacement As Verdict

What it looks like: the break of 21,445 is drawn as the trade signal.

Why it fails: the break creates a cohort. It does not decide defended versus trapped.

Detection: check whether the short or trap label appears before reentry through the entry zone.

Fix or stop: make the fork explicit and delay the trap label until the trigger.

## F3. Missing Defended Branch

What it looks like: the trap path is shown, but the defended path is absent or tiny.

Why it fails: CH06 must prevent "every breakout is a trap."

Detection: the reader should be able to name the defended hold, absorption, and value migration.

Fix or stop: restore a legible defended lane. If density prevents that, recommend a split.

## F4. No Trap Locations

What it looks like: no named entry band and no named stop pool.

Why it fails: no locations, no trap.

Detection: scan the body for price-zone labels, not just a generic "buyers trapped" callout.

Fix or stop: add entry and forced-exit zones. If the spec lacks them, stop at Layer-1.

## F5. Forced Exits Drawn As Fresh Selling

What it looks like: the cascade is a generic bearish momentum arrow.

Why it fails: CH06 teaches liquidation-driven acceleration, not fresh conviction.

Detection: the forced-exit path must show stop activation or inventory conversion.

Fix or stop: add forced-exit layer marks and a finite target tied to the stop pool.

## F6. Rail-Dependent Sequence

What it looks like: the rail lists the steps, but the body is a simple line chart.

Why it fails: the body must teach before rails are read.

Detection: cover the rails. If the sequence disappears, fail the plate.

Fix or stop: rebuild the body around setup, fork, trap, and defended lanes.

## F7. Density Cramming

What it looks like: ten evidence labels become ten small badges around one path.

Why it fails: label crowding is a protocol stop condition.

Detection: badge stacks, crossed leaders, or reduced type indicate the failure.

Fix or stop: group evidence into activation layers, or recommend a split before rendering.
