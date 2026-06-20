STATUS: CANDIDATE, NOT APPROVED

# Acceptance Rejection Comparison Design Brief

This package is candidate Layer-2 grammar for `acceptance_rejection_comparison`. It is not approval and does not authorize rendering.

## Class Identity

- Governed `figure_type`: `acceptance_rejection_comparison`.
- CH06 target specs: `CH06_DEFENDED_BREAKOUT_VS_TRAPPED_BREAKOUT_001` and `CH06_SHORT_COVERING_VS_DEMAND_001`.
- Protocol class slot: acceptance versus rejection comparison.
- Candidate package unit: one package per `figure_type`, based on protocol section 8.3 path pattern, schema enum values, registry entries, and renderer map keys.

## Teaching Purpose

This class teaches that the same initial event can resolve into different professional reads. The comparison must keep the shared setup visibly identical and make the deciding follow-on evidence carry the classification.

For CH06 it covers two comparison forms:

- Defended breakout versus trapped breakout: same break and entrant zone, opposite post-displacement behavior.
- Short covering versus fresh demand: same reclaim and vertical impulse, different first-pullback evidence, with an explicit no-trade branch when evidence is mixed.

The reader must see that the burst is the question, not the answer.

## What The Reader Must See First

The body must lead with the shared setup:

1. One initial displacement, reclaim, break, or forced impulse.
2. One common reference level and population location.
3. One shared scale or visibly declared scale relationship.
4. A post-event evidence test.
5. Divergent outcomes, each tied to evidence rather than label.

The class fails if the two sides look like unrelated examples.

## Required Body Evidence

For defended versus trapped breakout:

- shared displacement setup;
- shared price scale;
- defended pullback hold;
- defended value migration;
- trapped reentry trigger;
- trapped forced-exit cascade.

For short covering versus demand:

- trapped short population and short-entry zone;
- failed-breakdown displacement;
- forced-covering trigger;
- covering impulse;
- first-pullback evidence test;
- covering-only exhaustion;
- demand-confirmed branch;
- no-trade branch;
- final classification.

Every required evidence id must have a body mark. Rail rows verify but do not carry primary evidence.

## Branch Doctrine Coverage

This grammar preserves:

- failed breakout versus defended breakout;
- breakout or burst alone versus confirmed trap or confirmed demand;
- short covering versus fresh demand;
- no trap without location;
- no hindsight-only labeling;
- not every failed breakout is a trap or fade;
- continuation by acceptance versus acceleration by forced exits.

For short-covering comparisons, the forced branch is inverted: trapped shorts buy to exit. That forced buying must not be drawn as fresh initiative demand.

## Participant Behavior

- Entrants or trapped shorts must be located in an entry zone before the outcome.
- Stop pools or buy-stop pools must be located before activation.
- Covering flow is finite and position-closing.
- Fresh demand is new commitment that defends pullbacks and migrates value.
- Defended breakout is acceptance, not the absence of a trap label.
- No-trade is a legitimate branch when evidence is incomplete.

## Rail Use

- Evidence rail groups body evidence by shared setup, deciding evidence, and outcome.
- Forbidden rail names the misreads: classify at burst, hindsight label, all rallies are covering, all breakouts are traps, hidden scale changes, missing shared setup.
- Rails must not outshine the two outcome panels.

## Density Ceiling

- Canvas: CH06 candidate specs declare `1100 x 620`; final width reconciliation is a Design Authority decision before Layer-3.
- Body panels: 4 to 5.
- Shared setup panel: mandatory.
- Outcome panels: 2 for defended versus trapped, 2 plus no-trade decision lane for covering versus demand.
- Evidence items: up to 9 with grouped rail rows.
- Forbidden items: up to 7.
- Primary callouts: at most 2 in the shared setup and 2 per outcome panel.
- Shared-scale badges: one explicit badge near the shared axis.

The no-trade branch should be a decision lane, not a third full chart, unless human composition review approves a wider target.

## Token Discipline

Use only verified tokens from `packages/design-tokens/tokens.ts`:

- defended, demand-confirmed, and acceptance: `color.state.accepted`, reinforced by hold/value marks;
- trapped, covering-only exhaustion, rejection, and forced-exit paths: `color.state.rejected`, reinforced by path direction and stop markers;
- watched levels and price references: `color.evidence.price`;
- volume or impulse evidence: `color.evidence.volume`;
- delta signs: `color.evidence.deltaPositive`, `color.evidence.deltaNegative`;
- no-trade, watch, or unresolved state: `color.state.watch`;
- evidence accent and branch test: `color.state.stalk`;
- forbidden glyphs: `color.risk.forbidden`.

No dedicated callout-background, structural-line, or rail-background token exists yet. Use verified surface roles and flag any more specific role as a token gap.

## Human Review Questions

- Whether short-covering-vs-demand should be a two-outcome comparison with a decision strip, or a three-branch composition.
- Whether all CH06 comparisons should use a shared setup row above outcome panels for corpus consistency.
- Whether final CH06 output should retain `1100 x 620` or migrate to the protocol `1280` full-column standard.
