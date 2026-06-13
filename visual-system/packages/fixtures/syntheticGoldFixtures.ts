import type { FigureSpec } from "../figure-spec/schema.ts";

export type SyntheticGoldFixture = {
  headline: string;
  phases: string[];
  leftState?: string;
  rightState?: string;
  rows?: string[];
};

const fixtures: Partial<Record<FigureSpec["figure_type"], SyntheticGoldFixture>> = {
  acceptance_rejection_comparison: {
    headline: "Same prior-day high: 21,560. The response after the break determines state.",
    leftState: "ACCEPT: value migrates above; pullbacks hold; volume fattens.",
    rightState: "REJECT: spike fails; snap-back; excess tail traps breakout longs.",
    phases: ["Shared level", "Break", "Response", "Decision"],
  },
  market_profile_static: {
    headline: "Same opening push through 6024. Regime is classified by profile and value behavior.",
    leftState: "BALANCE: symmetric profile, central POC, fade back toward value.",
    rightState: "TREND: elongated profile, value follows price, continuation tactics.",
    phases: ["Identical push", "Profile forms", "Value behavior", "Tactic consequence"],
  },
  footprint_dom_delta_sequence: {
    headline: "Aggressive buyers spend effort at one price while passive supply prevents progress.",
    phases: ["Aggressive buys", "Delta climbs", "Offer reloads", "No print above", "Flush away"],
  },
  momentum_participation_comparison: {
    headline: "Two equal-sized up moves. Participation, not distance or slope, classifies the move.",
    leftState: "MOMENTUM: large prints, sustained delta, bought pullbacks, thinner reloads.",
    rightState: "DRIFT: small prints, flat delta, thin book, one program unwinds the glide.",
    phases: ["Same distance", "Volume/delta", "Book behavior", "Pullback quality"],
  },
  trap_storyboard: {
    headline: "Entrants chase the break; the trap is confirmed only when price re-enters the entry zone.",
    leftState: "TRAP: reentry through 21,446-21,458 accelerates into stops under 21,440.",
    rightState: "DEFENDED: holds above 21,445; value migrates up; continuation to 21,464.",
    phases: ["Range", "Displacement", "Absorption", "Fork", "Resolution"],
  },
  session_timeline: {
    headline: "Regional auctions hand structure to the next session with different liquidity depth.",
    phases: ["Asia balance", "London handoff", "London value", "NY data test", "NY open"],
    rows: ["Asia: thin, value 5487", "London: ZN and 6E sponsor downside", "NY: opens inside London value"],
  },
  volatility_regime_map: {
    headline: "Compression stores fuel; expansion changes stop size and tactics.",
    leftState: "REAL: retest holds outside; initiative continues; value builds above edge.",
    rightState: "FALSE: no second buyer; snap-back traps chasers inside the coil.",
    phases: ["Coil", "Stop fuel", "Release", "Retest", "Regime switch"],
  },
  intermarket_matrix: {
    headline: "Confirmation requires a mechanism across dollar, rates, equities, and gold.",
    phases: ["Hot CPI", "Rates reprice", "Dollar bids", "Equity/gold respond", "Permission changes"],
    rows: ["Rates: confirm", "Dollar: confirm", "Equity: confirm", "Gold: confirm", "Overlay case: conflict/no mechanism"],
  },
  catalyst_transmission_chain: {
    headline: "Catalysts transmit through leaders, transmitters, then laggards; delay can be information.",
    phases: ["Headline", "Leader", "Transmitters", "Gamma-filtered index", "Breadth verdict"],
    rows: ["ZN first second", "6E first minute", "NQ delayed second stage", "Single-instrument twitch fails breadth"],
  },
  trade_state_lifecycle: {
    headline: "Trade state is reclassified by evidence against the written thesis, not open P&L.",
    phases: ["Intact", "Weakening", "Invalidated", "Complete", "Checkpoint"],
    rows: ["Intact: hold", "Weakening: reduce/tighten", "Invalidated: exit now", "Complete: take exit"],
  },
  setup_quality_gate: {
    headline: "Execution permission is a gate: score sets size, vetoes override score.",
    phases: ["WAIT", "SETUP", "EXECUTE", "NO-TRADE", "STAND ASIDE"],
    rows: ["Catalyst veto", "Intermarket veto", "Unreadable regime veto", "Four of seven is not full alignment"],
  },
  read_stack_flow: {
    headline: "The order is the content: upper layers govern context; lower layers only time action.",
    phases: ["Catalyst", "HTF auction", "Session", "Volatility", "Intermarket", "Location", "Tape", "Setup", "Permission", "Trade-state", "Review"],
    rows: ["Same 9:32 thrust", "Day one: continuation context", "Day two: post-event repricing context"],
  },
};

export function syntheticGoldFixture(spec: FigureSpec): SyntheticGoldFixture {
  return fixtures[spec.figure_type] ?? {
    headline: spec.fixture.description,
    phases: spec.panels.map((p) => p.title ?? p.id),
  };
}
