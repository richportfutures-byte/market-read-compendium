import type { FigureSpec } from "../figure-spec/schema.ts";

export type SpecQaResult = {
  figure_id: string;
  status: "pass" | "fail" | "skipped";
  failures: string[];
};

// Spec-level rule families. They run ALONGSIDE the render assertions: spec rules
// catch a badly authored card, render rules catch a renderer that fails to draw
// what the card declares (issue 1).
type Rule = (spec: FigureSpec) => string | null;

const ruleFamilies: Record<string, Rule[]> = {
  event_read_rules: [
    (s) => s.required_evidence.some((e) => /volume/i.test(e.label)) ? null
      : "event-read figure must include a volume-signature evidence item",
    (s) => s.required_evidence.some((e) => /delta|displacement/i.test(e.label)) ? null
      : "event-read figure must include a delta-vs-displacement evidence item",
    (s) => s.required_evidence.some((e) => /retest|post.?touch|acceptance|rejection/i.test(e.label)) ? null
      : "event-read figure must include a post-touch structure evidence item",
    (s) => s.forbidden_errors.some((f) => /touch.*signal|signal.*touch/i.test(f.description)) ? null
      : "event-read figure must forbid treating the touch itself as a signal",
  ],
  momentum_sponsorship_rules: [
    (s) => s.required_evidence.some((e) => /volume/i.test(e.label)) ? null
      : "momentum figure must show volume signature (volume per unit of price)",
    (s) => s.required_evidence.some((e) => /delta/i.test(e.label)) ? null
      : "momentum figure must show delta alignment",
    (s) => s.required_evidence.some((e) => /dom|book|tape|print/i.test(e.label)) ? null
      : "momentum figure must show book or tape participation",
    (s) => s.forbidden_errors.some((f) => /slope|distance|shape/i.test(f.description)) ? null
      : "momentum figure must forbid classifying by slope, distance, or chart shape",
  ],
  auction_profile_rules: [
    (s) => s.required_evidence.some((e) => /profile shape|symmetric|elongated/i.test(e.label)) ? null
      : "auction-profile figure must show profile shape (symmetric vs elongated)",
    (s) => s.required_evidence.some((e) => /value|overlap|migrat/i.test(e.label)) ? null
      : "auction-profile figure must show value behavior (overlapping vs migrating)",
    (s) => s.required_evidence.some((e) => /volume/i.test(e.label)) ? null
      : "auction-profile figure must show volume response at the extremes",
    (s) => s.forbidden_errors.some((f) => /candle|breakout|consequence|decoration/i.test(f.description)) ? null
      : "auction-profile figure must forbid candle-only classification or labels without consequence",
  ],
  level_interaction_rules: [
    (s) => s.required_evidence.some((e) => /time|volume|beyond/i.test(e.label)) ? null
      : "level-interaction figure must show time/volume beyond the level",
    (s) => s.required_evidence.some((e) => /value|poc|migration/i.test(e.label)) ? null
      : "level-interaction figure must show value migration relative to the level",
    (s) => s.required_evidence.some((e) => /profile|tail|excess|single.?print/i.test(e.label)) ? null
      : "level-interaction figure must show profile shape (fattened vs excess tail)",
    (s) => s.forbidden_errors.some((f) => /touch|cross|single.*close|close.*above/i.test(f.description)) ? null
      : "level-interaction figure must forbid verdict-by-touch (a single cross as acceptance)",
  ],
  absorption_tape_rules: [
    (s) => s.required_evidence.some((e) => /aggressive|traded volume/i.test(e.label)) ? null
      : "absorption figure must show aggressive traded volume",
    (s) => s.required_evidence.some((e) => /delta/i.test(e.label)) ? null
      : "absorption figure must show delta",
    (s) => s.required_evidence.some((e) => /passive|reload/i.test(e.label)) ? null
      : "absorption figure must show passive reload",
    (s) => s.required_evidence.some((e) => /fail|through|progress/i.test(e.label)) ? null
      : "absorption figure must show failure to move through the level",
    (s) => s.required_evidence.some((e) => /resolution|away/i.test(e.label)) ? null
      : "absorption figure must show resolution away from the absorbed side",
    (s) => s.forbidden_errors.some((f) => /low.?volume.*absorption|pause.*absorption/i.test(f.description)) ? null
      : "absorption figure must forbid labeling a low-volume pause as absorption",
  ],
  trap_positioning_rules: [
    (s) => s.required_evidence.some((e) => /entrant|entry zone|population/i.test(e.label)) ? null
      : "trap figure must show the entrant population entry zone",
    (s) => s.required_evidence.some((e) => /stop pool|forced.?exit/i.test(e.label)) ? null
      : "trap figure must show the forced-exit stop pool / forced-exit location",
    (s) => s.required_evidence.some((e) => /displacement|delta|volume/i.test(e.label)) ? null
      : "trap figure must show the displacement with delta and volume",
    (s) => s.required_evidence.some((e) => /absorption|absorb/i.test(e.label)) ? null
      : "trap figure must show absorption at the extreme",
    (s) => s.required_evidence.some((e) => /reentry|re-entry|cross.?back|trigger/i.test(e.label)) ? null
      : "trap figure must show the reentry-through-entry trigger",
    (s) => s.required_evidence.some((e) => /defended|value migrat/i.test(e.label)) ? null
      : "trap figure must show the defended branch (hold plus value migration), not only the trap",
    (s) => s.forbidden_errors.some((f) => /hindsight/i.test(f.description)) ? null
      : "trap figure must forbid hindsight trap-labeling",
    (s) => s.forbidden_errors.some((f) => /without location|no location/i.test(f.description)) ? null
      : "trap figure must forbid a trap with no named entry/forced-exit location",
  ],
  session_context_rules: [
    (s) => s.required_evidence.some((e) => /asia|london/i.test(e.label)) ? null
      : "session figure must show the three regional sessions (Asia, London, NY)",
    (s) => s.required_evidence.some((e) => /liquidity|depth|thin|thick/i.test(e.label)) ? null
      : "session figure must show liquidity depth differences across sessions",
    (s) => s.required_evidence.some((e) => /value|migrat|accept|reject/i.test(e.label)) ? null
      : "session figure must show value migration / accept-reject across the handoff",
    (s) => s.required_evidence.some((e) => /session of record|origin|built|which session/i.test(e.label)) ? null
      : "session figure must show which session built the reference (session of record)",
    (s) => s.required_evidence.some((e) => /cross.?asset|sponsor|rates|fx|6e|zn/i.test(e.label)) ? null
      : "session figure must show cross-asset sponsorship at the handoff",
    (s) => s.forbidden_errors.some((f) => /undifferentiated|same ink|one block|unlabeled|wrong session/i.test(f.description)) ? null
      : "session figure must forbid treating overnight as one undifferentiated block",
  ],
  volatility_regime_rules: [
    (s) => s.required_evidence.some((e) => /compress|coil|balance|contraction/i.test(e.label)) ? null
      : "volatility figure must show the compression / coil phase",
    (s) => s.required_evidence.some((e) => /expansion|release|breakout/i.test(e.label)) ? null
      : "volatility figure must show the expansion / release phase",
    (s) => s.required_evidence.some((e) => /stop fuel|stop cluster|stops/i.test(e.label)) ? null
      : "volatility figure must show stop fuel at the edge",
    (s) => s.required_evidence.some((e) => /retest|initiative|real.*false|false.*real|acceptance/i.test(e.label)) ? null
      : "volatility figure must show real-vs-false discrimination at the retest",
    (s) => s.required_evidence.some((e) => /tactic|stop|size|permission|target/i.test(e.label)) ? null
      : "volatility figure must show that the regime changes tactic, stop, size, or permission",
    (s) => s.forbidden_errors.some((f) => /first tick|trade the break|pre.?commit|direction from|coil.*direction/i.test(f.description)) ? null
      : "volatility figure must forbid trading the first tick or pre-committing direction from the coil",
  ],
  intermarket_confirmation_rules: [
    (s) => s.required_evidence.some((e) => /dollar|rates|gold|equit|yield/i.test(e.label)) ? null
      : "intermarket figure must show the cross-market layers (dollar, rates, equity, gold)",
    (s) => s.required_evidence.some((e) => /mechanism|reprice|forced|discount|real.?rate/i.test(e.label)) ? null
      : "intermarket figure must show a named mechanism (why each market must reprice)",
    (s) => s.required_evidence.some((e) => /confirm|conflict|coherence/i.test(e.label)) ? null
      : "intermarket figure must show confirm-vs-conflict coherence",
    (s) => s.required_evidence.some((e) => /magnitude|proportion|sequence/i.test(e.label)) ? null
      : "intermarket figure must show magnitude / sequence proportionate to the mechanism",
    (s) => s.required_evidence.some((e) => /size|permission|conviction|upgrade|downgrade/i.test(e.label)) ? null
      : "intermarket figure must show the size / permission consequence",
    (s) => s.forbidden_errors.some((f) => /overlay|correlation as|co.?movement|shopping/i.test(f.description)) ? null
      : "intermarket figure must forbid chart-overlay confirmation and confirmation shopping",
  ],
  trade_state_rules: [
    (s) => s.required_evidence.some((e) => /intact|weakening|invalidated|complete/i.test(e.label)) ? null
      : "trade-state figure must show the four thesis states (intact, weakening, invalidated, complete)",
    (s) => s.required_evidence.some((e) => /evidence|thesis|kill/i.test(e.label)) ? null
      : "trade-state figure must show transitions driven by evidence against the written thesis",
    (s) => s.required_evidence.some((e) => /p&l|p\/l|green|red|profit/i.test(e.label)) ? null
      : "trade-state figure must show state is independent of open P&L",
    (s) => s.required_evidence.some((e) => /hold|reduce|exit|tighten|action/i.test(e.label)) ? null
      : "trade-state figure must show the state-to-action mapping",
    (s) => s.required_evidence.some((e) => /checkpoint|rotation|reference|re.?classif/i.test(e.label)) ? null
      : "trade-state figure must show checkpoint re-classification",
    (s) => s.forbidden_errors.some((f) => /p&l|green.*proof|favorable price|profit.*intact/i.test(f.description)) ? null
      : "trade-state figure must forbid using green P&L as proof of an intact thesis",
  ],
};

export function hasRuleFamily(name: string): boolean {
  return name in ruleFamilies;
}

export function runDomainAssertions(spec: FigureSpec): SpecQaResult {
  // Drafts are not held to domain rules yet; they are not finished.
  if (spec.status === "draft") {
    return { figure_id: spec.figure_id, status: "skipped", failures: [] };
  }
  const rules = ruleFamilies[spec.qa.domain_rule_family];
  if (!rules) {
    return { figure_id: spec.figure_id, status: "fail",
      failures: [`no rule family "${spec.qa.domain_rule_family}" registered`] };
  }
  const failures = rules.map((r) => r(spec)).filter((x): x is string => x !== null);
  return { figure_id: spec.figure_id, status: failures.length ? "fail" : "pass", failures };
}
