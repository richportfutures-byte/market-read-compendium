STATUS: CANDIDATE, NOT APPROVED

# Price Path Level Interaction Design Brief

This package is candidate Layer-2 grammar for `price_path_level_interaction`. It is not approval and does not authorize rendering.

## Class Identity

- Governed `figure_type`: `price_path_level_interaction`.
- CH06 target specs: `CH06_BREAKOUT_ENTRANT_POPULATION_MAP_001`, `CH06_LATE_ENTRANT_PAIN_MAP_001`, `CH06_STOP_POOL_BELOW_FAILED_BREAKOUT_001`, and `CH06_USER_STOP_INSIDE_CROWD_STOP_POOL_001`.
- Protocol class relationship: reusable price path and level grammar for structural-location and participant-location maps.
- Candidate package unit: one package per `figure_type`, based on protocol section 8.3 path pattern, schema enum values, registry entries, and renderer map keys.

## Teaching Purpose

This class teaches how price interacting with a named level creates participant locations, risk geometry, and conditional forced-flow zones. The class is not a generic line chart. It is a location map: who entered, where they entered, where pain begins, where the stop pool sits, what activates it, and what professional alternative exists.

For CH06 it must cover:

- breakout entrant population map;
- late entrant pain map;
- stop pool below failed breakout;
- user stop inside crowd stop pool.

## What The Reader Must See First

The body must make location visible before outcome:

1. The watched level or structural reference.
2. The price path crossing or testing the level.
3. The participant zone created by that interaction.
4. The stop pool or invalidation zone tied to the population.
5. The conditional trigger that activates forced flow.
6. The defended or dormant branch that prevents every-breakout-is-trap logic.
7. The professional decision alternative where the spec requires it.

## Required Body Evidence

Across the four CH06 target specs, body evidence includes:

- breakout reference level;
- entrant population entry zone;
- early versus late entrant distribution;
- forced-exit or crowd stop pool;
- pain threshold;
- deteriorated entry geometry;
- evidence-based invalidation versus comfort stop;
- trap-risk reentry context;
- latent versus activated stop-pool state;
- user stop inside crowd stop pool;
- normal pullback and sweep zone;
- professional wait, evidence exit, reduced size, structural stop, or no-trade alternatives;
- defended branch where the pool remains latent or late entry survives.

The grammar must support up to 11 required evidence ids without moving evidence into rails. `CH06_USER_STOP_INSIDE_CROWD_STOP_POOL_001` is the density calibrator.

## Branch Doctrine Coverage

This grammar preserves:

- failed breakout versus defended breakout;
- breakout alone versus confirmed trap;
- user stop placement versus crowd stop pool;
- latent pool versus activated forced flow;
- no trap without location;
- no hindsight-only trap label;
- not every failed breakout or late entry fails;
- comfort stop versus evidence-based invalidation;
- forced exits versus fresh conviction.

## Participant Behavior

- Entrants are shown as a located cohort, split into early and late zones when required.
- Stops are shown as crowd liquidity, not personalized stop hunting.
- A user stop is one unit overlapping the pool when the spec requires it, not the whole pool.
- Pain threshold is a geometry marker before the outcome.
- Professional action alternatives are visible decision objects, not moral advice.
- Defended branch shows value migration and pool dormancy.

## Rail Use

- Evidence rail verifies location, geometry, trigger, forced-flow, defended branch, and decision alternatives.
- Forbidden rail blocks: breakout equals validation, no-location trap, stop pool as signal, all late entries fail, all stops are wrong, hide/remove stops advice, hindsight mapping, P&L as lesson.
- Rails must use short grouped labels. Long spec prose belongs in the spec, not the rail.

## Density Ceiling

- Canvas: CH06 target specs declare `1100 x 620`; final protocol-width reconciliation is a Design Authority decision before Layer-3.
- Body panels: 4 to 5.
- Main price panel: mandatory.
- Secondary map panel: entrant distribution, pain geometry, or stop-pool map.
- Trigger/activation panel: optional but required for stop-pool activation specs.
- Decision panel: required for late-entrant and user-stop specs.
- Defended branch: required in every CH06 target spec.
- Evidence items: up to 11 grouped in rail, all with body marks.
- Forbidden items: up to 8 grouped in rail.
- Primary callouts: at most 9, no more than 2 per panel.
- Price badges: at most 7.

If a target spec cannot show the defended branch and professional alternative without shrinking type, recommend split or human composition review before Layer-3.

## Token Discipline

Use only verified token paths:

- structural level and price references: `color.evidence.price` or `color.state.watch`;
- entrant zones and caution zones: `color.state.stalk`;
- accepted/defended/value-migration branch: `color.state.accepted`;
- rejected/forced-exit/activated-pool branch: `color.state.rejected`;
- volume or displacement marks: `color.evidence.volume`;
- delta signs: `color.evidence.deltaPositive`, `color.evidence.deltaNegative`;
- user risk alternatives allowed: `color.risk.allowed`;
- forbidden rail: `color.risk.forbidden`;
- surfaces, text, typography, spacing, and strokes from existing token groups.

Dedicated structural-line, grid-line, rail-background, and callout-background tokens do not currently exist. Do not invent them.

## Renderer Capability Note

No renderer is currently wired for `price_path_level_interaction` in `packages/renderers/renderFigure.ts`. This is a Layer-3 blocker after grammar and composition approval, not a Layer-2 blocker.

## Human Review Questions

- Whether the user-stop and late-entrant specs should remain single plates or split into location map plus risk-decision companion.
- Whether CH06 price-path maps should use a bottom forbidden rail or a right rail extension.
- Whether final canvas should stay `1100 x 620` or move to protocol full-column width.
