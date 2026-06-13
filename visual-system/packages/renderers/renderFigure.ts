import type { FigureSpec } from "../figure-spec/schema.ts";
import { renderPipeline, type RenderOptions } from "./pipelineRenderer.ts";
import { renderAcceptanceRejectionComparison } from "./acceptanceRejectionComparison/index.ts";
import { renderMarketProfileStatic } from "./marketProfileStatic/index.ts";
import { renderFootprintDomDeltaSequence } from "./footprintDomDeltaSequence/index.ts";
import { renderMomentumParticipationComparison } from "./momentumParticipationComparison/index.ts";
import { renderTrapStoryboard } from "./trapStoryboard/index.ts";
import { renderSessionTimeline } from "./sessionTimeline/index.ts";
import { renderVolatilityRegimeMap } from "./volatilityRegimeMap/index.ts";
import { renderIntermarketMatrix } from "./intermarketMatrix/index.ts";
import { renderCatalystTransmissionChain } from "./catalystTransmissionChain/index.ts";
import { renderTradeStateLifecycle } from "./tradeStateLifecycle/index.ts";
import { renderSetupQualityGate } from "./setupQualityGate/index.ts";
import { renderReadStackFlow } from "./readStackFlow/index.ts";

const rendererMap: Partial<Record<FigureSpec["figure_type"],
  (spec: FigureSpec, opts: RenderOptions) => string>> = {
  event_evidence_read_decision_pipeline: renderPipeline,
  acceptance_rejection_comparison: renderAcceptanceRejectionComparison,
  market_profile_static: renderMarketProfileStatic,
  footprint_dom_delta_sequence: renderFootprintDomDeltaSequence,
  momentum_participation_comparison: renderMomentumParticipationComparison,
  trap_storyboard: renderTrapStoryboard,
  session_timeline: renderSessionTimeline,
  volatility_regime_map: renderVolatilityRegimeMap,
  intermarket_matrix: renderIntermarketMatrix,
  catalyst_transmission_chain: renderCatalystTransmissionChain,
  trade_state_lifecycle: renderTradeStateLifecycle,
  setup_quality_gate: renderSetupQualityGate,
  read_stack_flow: renderReadStackFlow,
};

export function hasRenderer(figureType: FigureSpec["figure_type"]): boolean {
  return figureType in rendererMap;
}

export type RenderResult = { svg: string; drawnEvidenceIds: string[] };

function extractDrawnEvidenceIds(svg: string): string[] {
  const ids = new Set<string>();
  const re = /data-evidence-id="([a-z0-9_]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg)) !== null) ids.add(m[1]);
  return [...ids];
}

export function renderFigure(spec: FigureSpec, opts: RenderOptions = {}): RenderResult {
  const fn = rendererMap[spec.figure_type];
  if (!fn) throw new Error(`No renderer wired for figure_type "${spec.figure_type}" (figure ${spec.figure_id}).`);
  const svg = fn(spec, opts);
  return { svg, drawnEvidenceIds: extractDrawnEvidenceIds(svg) };
}
