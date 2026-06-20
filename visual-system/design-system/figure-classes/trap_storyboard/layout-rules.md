STATUS: CANDIDATE, NOT APPROVED

# Trap Storyboard Layout Rules

This file defines candidate layout law for CH06 `trap_storyboard` figures. It is Layer-2 only and does not authorize renderer work.

## Canonical Composition

The canonical composition is a located sequence with a visible fork.

1. Title band: figure title, one-line teaching claim, candidate status if an SVG target is later created.
2. Main price-path panel: prior range, watched level, displacement, entry band, stop pool, fork point.
3. Sequence lane: step cards or time blocks for setup, displacement, absorption, trigger, cascade, defended cancellation.
4. Branch lane: trap path and defended path share the same setup and diverge only after the fork.
5. Evidence rail: required evidence ids, grouped by location, trigger, forced flow, defended branch.
6. Forbidden rail: hindsight, no-location, displacement-as-event, every-breakout-is-trap, premature entry.
7. Caption/footer: professional read, decision consequence, status metadata.

## Named Regions

- `title-band`: top 56 px.
- `main-sequence`: left two-thirds of the canvas, dominant region.
- `branch-fork`: below or embedded in `main-sequence`, visually centered on the unresolved point.
- `activation-lane`: optional horizontal lane for reentry, forced-exit layers, liquidity thinning, target.
- `defended-lane`: parallel lane with hold, bid refresh, absorption, value migration.
- `evidence-rail`: right side.
- `forbidden-rail`: bottom band or lower right stacked block.
- `caption-footer`: bottom safe area.

Producers fill these regions. They do not invent one-off regions.

## Reading Order

Read left to right and top to bottom:

1. Locate the crowd.
2. Locate the stop pool.
3. Watch deterioration at the extreme.
4. Stop at the fork.
5. Read the trap branch only after reentry and acceleration.
6. Read the defended branch only after hold and value migration.

The trap label appears after the trigger, never at the displacement.

## Mark Vocabulary

- Watched level: dashed horizontal line using `color.evidence.price` or `color.state.watch`.
- Entrant zone: translucent band with bracket label and price endpoints.
- Stop pool: stacked small stop markers below or above structure, never a single decorative glow.
- Displacement: price path segment plus volume/delta inset or paired bars.
- Absorption: compact refresh marks at the extreme plus rising delta and stalled price.
- Fork: labeled node or vertical guide reading "read made before outcome."
- Trap branch: rejected/down path using `color.state.rejected` and arrowheads.
- Defended branch: accepted/up path using `color.state.accepted`, value migration block, bid-refresh ticks.
- Liquidity thinning: tapering depth marks or widening gap marks, always labeled as thinning, not automation.

## Evidence Placement

- Location evidence lives near the watched level and entry band.
- Trigger evidence lives at the reentry print, not in the rail.
- Cascade evidence lives along the forced-exit path, grouped as layers when dense.
- Defended evidence lives in the defended lane with hold and value migration.
- Rail rows point back to body marks by number or icon only. Rail rows do not host primary evidence.

## Label Lanes

- Price badges use the monospace family and sit outside the path where possible.
- Setup labels sit above the watched level.
- Entry-band labels sit inside or immediately above the band.
- Stop-pool labels sit beside the pool, never over the pool markers.
- Trigger labels sit on the reentry lane.
- Cascade labels sit below the forced path.
- Defended labels sit above the defended continuation path.

No label lane may carry two competing callouts.

## Shared Scale

When two outcomes are compared in one storyboard, both branches inherit the same price scale and same initial displacement. If scale differs, the scale break must be explicit and permitted by the spec. CH06 target specs do not permit hidden scale changes.

## Split Rule

Keep one plate when the story can be grouped into setup, fork, trap, defended, and rail.

Recommend a split before rendering if:

- more than 10 evidence items require independent body marks;
- more than 6 price badges are necessary in the main body;
- the defended branch cannot remain legible without shrinking the trap branch;
- the activation sequence needs more than 4 separate forced-exit layer labels.

A split recommendation is a human decision before Layer-3.

## Stop Conditions

Stop if:

- the trap is labeled before reentry;
- entry zone or stop pool is missing;
- the defended branch is omitted when the spec requires it;
- forced exits look like fresh conviction;
- rails carry evidence the body cannot carry;
- labels overlap or require smaller type to fit;
- the canvas cannot preserve shared displacement and branch separation.
