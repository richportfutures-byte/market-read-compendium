import type { FigureSpec } from "../figure-spec/schema.ts";
import { renderFigure } from "../renderers/renderFigure.ts";
import type { RenderOptions } from "../renderers/pipelineRenderer.ts";

export type RenderQaResult = {
  figure_id: string;
  status: "pass" | "fail";
  failures: string[];
};

// Issue 1: this checks the RENDERED OUTPUT, not the spec.
// A spec can claim it shows delta; this fails if the renderer did not draw it.
export function runRenderAssertions(spec: FigureSpec, opts: RenderOptions = {}): RenderQaResult {
  const failures: string[] = [];
  const { svg, drawnEvidenceIds } = renderFigure(spec, opts);
  const drawn = new Set(drawnEvidenceIds);

  // 1. Every REQUIRED evidence item must appear in the actual drawing.
  for (const item of spec.required_evidence) {
    if (item.required && !drawn.has(item.id)) {
      failures.push(`required evidence "${item.id}" (${item.label}) was NOT drawn in the figure`);
    }
  }

  // 2. The output must carry the figure id and be marked export-ready.
  if (!svg.includes(`data-figure-id="${spec.figure_id}"`)) {
    failures.push(`output missing data-figure-id="${spec.figure_id}"`);
  }
  if (!svg.includes('data-export-ready="true"')) {
    failures.push(`output not marked data-export-ready="true"`);
  }

  return { figure_id: spec.figure_id, status: failures.length ? "fail" : "pass", failures };
}
