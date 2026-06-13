import type { FigureSpec } from "../figure-spec/schema.ts";
import { renderPipeline, type RenderOptions } from "./pipelineRenderer.ts";

// Renderer map keyed by figure_type. Only the slice-zero type is wired now;
// the rest are added as each renderer is built (issue 2: thin thread first).
const rendererMap: Partial<Record<FigureSpec["figure_type"],
  (spec: FigureSpec, opts: RenderOptions) => string>> = {
  event_evidence_read_decision_pipeline: renderPipeline,
};

export type RenderResult = {
  svg: string;
  drawnEvidenceIds: string[]; // parsed from the SVG output, NOT read from the spec
};

// Extracts the evidence ids that the renderer ACTUALLY stamped into the output.
// This is the heart of the issue-1 fix: we inspect the drawing, not the spec.
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
