import { z } from "zod";
import {
  CHAPTERS, TIERS, FIGURE_STATUS, LEARNING_MODES, INTERACTION_MODES,
  OUTPUT_MODES, FIGURE_TYPES, PLACEMENT_POSITIONS,
  PANEL_ROLES, ANNOTATION_TYPES, FIXTURE_KINDS,
} from "./enums.ts";

// Evidence carries a STABLE id. The renderer stamps that id onto the SVG element
// that draws it (data-evidence-id). Render-level QA confirms the drawing actually
// contains every required item, instead of trusting the spec (issue 1).
export const EvidenceItem = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, "evidence id must be snake_case"),
  label: z.string().min(1),
  required: z.boolean().default(true),
});

export const ForbiddenError = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  description: z.string().min(1),
});

// Panel layout: which semantic panels the figure is composed of and how they sit.
export const PanelSpec = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  role: z.enum(PANEL_ROLES),
  title: z.string().optional(),
  grid: z.string().optional(), // free-form layout hint, e.g. "row:1 col:1-2"
});

// Sequence step: an instructional step. reveal lists panel/evidence ids made
// visible at this step. Drives the StepThrough interaction and the export frames.
export const SequenceStep = z.object({
  step: z.number().int().nonnegative(),
  caption: z.string().min(1),
  reveal: z.array(z.string()).default([]),
});

export const AnnotationSpec = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  type: z.enum(ANNOTATION_TYPES),
  target: z.string().min(1), // panel id or evidence id the annotation points at
  text: z.string().min(1),
});

// Fixture requirements: what synthetic data the renderer needs.
export const FixtureSpec = z.object({
  kind: z.enum(FIXTURE_KINDS),
  description: z.string().min(1),
  instruments: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const Placement = z.object({
  chapter: z.enum(CHAPTERS),
  section_slug: z.string().min(1),
  position: z.enum(PLACEMENT_POSITIONS),
  marker: z.string().optional(),
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

  // Production layout fields.
  panels: z.array(PanelSpec).min(1),
  sequence: z.array(SequenceStep).optional(),
  annotations: z.array(AnnotationSpec).default([]),
  fixture: FixtureSpec,

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

  // Human-readable pass conditions for this specific figure.
  acceptance_criteria: z.array(z.string().min(1)).min(1),
});

export type FigureSpec = z.infer<typeof FigureSpec>;
export type EvidenceItem = z.infer<typeof EvidenceItem>;
export type PanelSpec = z.infer<typeof PanelSpec>;
export type SequenceStep = z.infer<typeof SequenceStep>;
