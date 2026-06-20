STATUS: CANDIDATE, NOT APPROVED

# Trap Storyboard Design Brief

Governing authority: `VISUAL_PRODUCTION_PROTOCOL.md`, `CLAUDE.md`, and the CH06 Layer-2 production prompt. This package is candidate Layer-2 design law only. It is not a renderer, not a rendered plate, and not approval.

## Class Identity

- Governed `figure_type`: `trap_storyboard`.
- CH06 target specs: `CH06_TRAP_SEQUENCE_STORYBOARD_001` and `CH06_FORCED_EXIT_CASCADE_001`.
- Protocol class slot: trap storyboard or branching sequence.
- Candidate package unit: one package per `figure_type`, based on protocol section 8.3 path pattern, the schema enum, registry entries, and renderer map keys.

## Teaching Purpose

This class teaches a trap as a located population moving through a sequence, not as a reversal label. The reader must see the setup before the outcome: watched level, breakout entrant zone, reentry or failure level, stop pool, and same initial displacement. The class then separates two outcomes:

- Trapped branch: reentry plus acceleration, with acceleration driven by liquidation or forced exits rather than fresh conviction.
- Defended branch: hold, absorption, and value migration where applicable, with continuation driven by acceptance rather than liquidation.

The body must carry this distinction before any rail is read.

## What The Reader Must See First

The first read is the fork, not the finish. The body must show:

1. A watched level and prior range.
2. A displacement through that level that creates an entrant population.
3. The entry band and forced-exit stop pool named before resolution.
4. A deterioration phase, usually absorption at the extreme.
5. A fork where the trap is not yet confirmed.
6. A trap path requiring reentry plus acceleration.
7. A defended path requiring hold, absorption of sells, and value migration.

If the reader can only understand the figure by reading the evidence rail, the plate fails.

## Required Body Evidence

The grammar must materially encode every required evidence id from its target specs in the body, not only in rails.

- Location evidence: entrant population entry zone, watched level, forced-exit stop pool.
- Displacement evidence: delta and volume burst, shown as cohort creation, not as verdict.
- Deterioration evidence: absorption at the extreme, offer refresh, rising delta with stalled price.
- Trigger evidence: reentry through the entry zone, for CH06 usually the 21,443 print with speed and sell-volume burst.
- Forced-flow evidence: late entrants forced first, stop pool activation, liquidity thinning, finite cascade target.
- Defended evidence: hold above the level, bid refresh, sells absorbed, value migration, and cascade cancellation.

The trap path must never be drawn as active before reentry. The defended path must never be visually weaker than the trap path if the spec requires branch comparison.

## Participant Behavior

- Breakout entrants are a visible cohort with a price band, not anonymous dots.
- Late entrants are a sub-layer at weaker location when the spec calls for them.
- Forced exits are a conversion from optional exit to mandatory exit.
- Liquidity thinning is an accelerant, not an automated execution claim.
- Defending participants are shown by hold behavior, refreshed bids, absorption of selling, and value migration.

## Branch Doctrine Coverage

This grammar preserves all CH06 separations:

- Failed breakout is not the same as defended breakout.
- Breakout alone is not confirmed trap.
- Short covering or forced exits are not fresh demand or fresh conviction.
- User stop placement is not the same as the crowd stop pool.
- No trap without named location.
- No hindsight-only trap label.
- Not every failed breakout is a trap.

## What Belongs In Rails

Rails verify the body. They do not teach in place of the body.

- Evidence rail: lists required evidence ids in plain reader language.
- Forbidden rail: lists the spec's forbidden misreads with short labels.
- Decision note or caption: states that action waits for trigger evidence and that no-trade remains valid before confirmation.

If a required evidence item is present only in a rail, the candidate fails.

## Density Ceiling

- Canvas: CH06 candidate specs declare `1100 x 620`; any final reconciliation with the protocol full-column `1280` target is a Design Authority decision before Layer-3.
- Body panels: 3 to 5, including price path, fork or branch lane, optional activation timeline, optional cascade detail, and defended branch.
- Rails: evidence rail plus forbidden-misread rail when forbidden errors exist.
- Evidence items visible in the rail: up to 10 for this class. If a spec exceeds 10, use grouped rail rows tied to body marks, not smaller type.
- Primary body callouts: at most 8 total, with no more than 2 competing in any panel.
- Price badges: at most 6 named price badges in the main body.
- Label lanes: top setup lane, entry-band lane, stop-pool lane, trigger lane, cascade lane, defended lane.

`CH06_FORCED_EXIT_CASCADE_001` is the density calibrator. It is compatible only if the activation sequence is grouped into layers rather than rendered as many independent badges.

## Token Discipline

Use only verified token paths from `packages/design-tokens/tokens.ts`:

- Surfaces: `color.surface.canvas`, `color.surface.panel`, `color.surface.panelRaised`.
- Text: `color.text.primary`, `color.text.secondary`, `color.text.muted`.
- Evidence and price: `color.evidence.price`, `color.evidence.volume`, `color.evidence.deltaPositive`, `color.evidence.deltaNegative`.
- State: `color.state.accepted`, `color.state.rejected`, `color.state.watch`, `color.state.stalk`.
- Risk: `color.risk.forbidden`, `color.risk.allowed`.
- Type families: `typography.body`, `typography.mono`.
- Spacing and strokes: `spacing.*`, `stroke.*`.

The current token file has no dedicated structural-line, grid-line, rail-background, or callout-background role. This candidate uses the verified surface and text roles above and flags any need for more specific roles as a Design Authority token gap.

## Human Review Questions

- Whether CH06 trap storyboards should keep the spec-declared `1100 x 620` canvas or migrate to the protocol full-column `1280` width before Layer-3.
- Whether cascade-heavy storyboards need a separate approved composition target after this grammar, before renderer alignment.
- Whether the forbidden rail should be a bottom band or a right rail extension for CH06 storyboards at book size.
