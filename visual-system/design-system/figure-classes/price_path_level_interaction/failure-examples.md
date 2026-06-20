STATUS: CANDIDATE, NOT APPROVED

# Price Path Level Interaction Failure Examples

These failures block CH06 price-path level maps.

## F1. Generic Level Chart

What it looks like: price crosses a line, with no entrant zone, stop pool, pain threshold, or decision consequence.

Why it fails: this class teaches participant location and risk geometry, not line crossing.

Detection: cover labels. If the population cannot be found, fail.

Fix or stop: add body marks for population, pool, and trigger. If the spec lacks them, stop at Layer-1.

## F2. Stop Pool As Entry Signal

What it looks like: a pool below the level is drawn as an immediate short signal.

Why it fails: CH06 says the pool is latent until failure and reentry.

Detection: activation arrow appears before the reentry trigger.

Fix or stop: split latent and activated states.

## F3. User Stop Equals Crowd Pool

What it looks like: the user's stop and the crowd pool are one indistinct mark.

Why it fails: `CH06_USER_STOP_INSIDE_CROWD_STOP_POOL_001` teaches their relationship and separation.

Detection: the reader cannot point to the individual stop versus the pool.

Fix or stop: use a single user pin over a separate pool stack.

## F4. Comfort Stop Treated As Protection

What it looks like: a tight stop inside the normal sweep zone is praised as disciplined.

Why it fails: CH06 teaches location, sizing, evidence exit, or no-trade, not stop evasion or false protection.

Detection: no structural invalidation or professional alternative is visible.

Fix or stop: add sweep zone, structural stop, evidence exit, reduced size, or no-trade decision.

## F5. All Late Entries Fail

What it looks like: late entry is shown only as a losing outcome.

Why it fails: the defended branch must remain possible, while the geometry remains poor.

Detection: no defended branch showing survival with poor process.

Fix or stop: add defended branch or recommend split if it cannot fit.

## F6. Hindsight Population Mapping

What it looks like: entrant or stop locations appear only after the reversal.

Why it fails: CH06 requires mapping before the outcome.

Detection: locations are absent from the pre-resolution setup.

Fix or stop: move location marks upstream.

## F7. Decision As Moral Advice

What it looks like: "do not chase" appears as a slogan without risk geometry.

Why it fails: the lesson is structural location and invalidation geometry.

Detection: the professional alternative lacks a level, zone, or trigger.

Fix or stop: anchor every decision to the body geometry.
