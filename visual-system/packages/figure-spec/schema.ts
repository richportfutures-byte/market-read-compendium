import { z } from "zod";
import {
  CHAPTERS, TIERS, FIGURE_STATUS, LEARNING_MODES, INTERACTION_MODES,
  OUTPUT_MODES, FIGURE_TYPES, PLACEMENT_POSITIONS,
} from "./enums.ts";

// An evidence item now carries a STABLE id. The renderer must stamp that same id
// onto the SVG element that draws it (data-evidence-id). The render-level QA
// (issue 1) confirms the drawing actually contains every required item, instead
// of trusting that the spec listed it.
export const EvidenceItem = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, "evidence id must be snake_case"),
  label: z.string().min(1),
  required: z.boolean().default(true),
});

export const ForbiddenError = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  description: z.string().min(1),
});

// Issue 4: binds the figure to the exact spot in the manuscript where it is taught.
export const Placement = z.object({
  chapter: z.enum(CHAPTERS),
  section_slug: z.string().min(1), // slug of the heading the figure belongs under
  position: z.enum(PLACEMENT_POSITIONS),
  marker: z.string().optional(),   // only used when position === "at_marker"
});

export const FigureSpec = z.object({
  figure_id: z.string().regex(/^CH\d{2}_[A-Z0-9_]+$/),
  version: z.string(),

  chapter: z.enum(CHAPTERS),
  tier: z.enum(TIERS),
  status: z.enum(FIGURE_STATUS),

  title: z.string().min(1),
  concept: z.string().min(1),
  source_refs: z.array(z.string()).default([]),

  teaching_objective: z.string().min(1),
  junior_error: z.string().min(1),
  professional_read: z.string().min(1),
  decision_consequence: z.string().min(1),

  required_evidence: z.array(EvidenceItem).min(1),
  forbidden_errors: z.array(ForbiddenError).default([]),

  figure_type: z.enum(FIGURE_TYPES),
  learning_mode: z.enum(LEARNING_MODES),
  interaction: z.enum(INTERACTION_MODES),

  outputs: z.array(z.enum(OUTPUT_MODES)).min(1),

  placement: Placement,

  export: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),

  qa: z.object({
    domain_rule_family: z.string().min(1),
    render_evidence_check: z.boolean().default(true),
    visual_snapshot: z.boolean().default(false),
  }),
});

export type FigureSpec = z.infer<typeof FigureSpec>;
export type EvidenceItem = z.infer<typeof EvidenceItem>;
