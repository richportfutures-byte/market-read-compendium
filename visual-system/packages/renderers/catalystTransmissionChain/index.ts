import type { FigureSpec } from "../../figure-spec/schema.ts";
import type { RenderOptions } from "../pipelineRenderer.ts";
import { renderReviewSvg } from "../reviewSvg.ts";

export function renderCatalystTransmissionChain(spec: FigureSpec, _opts: RenderOptions = {}): string {
  return renderReviewSvg(spec, "chain");
}
