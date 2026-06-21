import { z } from "zod";
import {
  CHAPTERS, TIERS, FIGURE_STATUS, LEARNING_MODES, INTERACTION_MODES,
  OUTPUT_MODES, FIGURE_TYPES, PLACEMENT_POSITIONS,
  PANEL_ROLES, ANNOTATION_TYPES, FIXTURE_KINDS,
  SOURCE_CLASSES, PRODUCTION_METHODS, VALUE_STATUS,
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

const REAL_MARKET_SOURCE_CLASSES = [
  "REAL_MARKET_CAPTURE",
  "REAL_DATA_EXPORT",
  "MANUAL_MARKET_LOG",
] as const;

function isRealMarketSource(sourceClass: string): boolean {
  return REAL_MARKET_SOURCE_CLASSES.some((c) => c === sourceClass);
}

function hasText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export const SourceEvidence = z.object({
  source_class: z.enum(SOURCE_CLASSES),
  production_method: z.enum(PRODUCTION_METHODS).optional(),
  value_status: z.array(z.enum(VALUE_STATUS)).default([]),
  instrument: z.string().min(1).optional(),
  market: z.string().min(1).optional(),
  session: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must use YYYY-MM-DD").optional(),
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
  timezone: z.string().min(1).optional(),
  platform: z.string().min(1).optional(),
  data_vendor_feed: z.string().min(1).optional(),
  capture_method: z.string().min(1).optional(),
  source_artifact: z.string().min(1).optional(),
  source_file_or_reference: z.string().min(1).optional(),
  transformation_notes: z.string().min(1).optional(),
  integrity_statement: z.string().min(1).optional(),
  anonymization_notes: z.string().min(1).optional(),
  redaction_notes: z.string().min(1).optional(),
  confidence_notes: z.string().min(1).optional(),
}).superRefine((source, ctx) => {
  const realMarketSource = isRealMarketSource(source.source_class);
  const anonymized = source.value_status.includes("anonymized");

  if (realMarketSource) {
    if (!source.production_method) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["production_method"],
        message: "real-market source evidence must declare a production method",
      });
    } else if (source.production_method === "SYNTHETIC_RENDERER_OUTPUT") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["production_method"],
        message: "real-market source evidence cannot use synthetic renderer output as its production method",
      });
    }
    if (source.value_status.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value_status"],
        message: "real-market source evidence must declare value status",
      });
    } else if (source.value_status.includes("synthetic")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value_status"],
        message: "real-market source evidence cannot declare synthetic value status",
      });
    }
    if (!hasText(source.integrity_statement)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["integrity_statement"],
        message: "real-market source evidence requires an integrity statement",
      });
    }
    if (!hasText(source.source_artifact) && !hasText(source.source_file_or_reference)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["source_artifact"],
        message: "real-market source evidence requires a source artifact or source reference",
      });
    }
    if (!anonymized) {
      const missing = ["instrument", "date", "session", "start_time", "end_time", "timezone"]
        .filter((key) => !hasText(source[key as keyof typeof source] as string | undefined));
      for (const key of missing) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: "real-market source evidence requires instrument, date, time, session, and timezone metadata unless anonymized",
        });
      }
    } else if (!hasText(source.anonymization_notes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["anonymization_notes"],
        message: "anonymized real-market source evidence requires anonymization notes",
      });
    }
  }

  if (source.production_method === "DATA_DERIVED_RECONSTRUCTION") {
    if (source.source_class !== "REAL_DATA_EXPORT") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["source_class"],
        message: "data-derived reconstructions require REAL_DATA_EXPORT source class",
      });
    }
    if (!hasText(source.source_artifact)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["source_artifact"],
        message: "data-derived reconstructions require a source artifact",
      });
    }
    if (!hasText(source.transformation_notes)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["transformation_notes"],
        message: "data-derived reconstructions require transformation notes",
      });
    }
  }

  if (
    (source.production_method === "RAW_CAPTURE" || source.production_method === "ANNOTATED_CAPTURE") &&
    source.source_class !== "REAL_MARKET_CAPTURE"
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["source_class"],
      message: "raw or annotated captures require REAL_MARKET_CAPTURE source class",
    });
  }

  if (source.source_class === "SYNTHETIC_TEACHING_MODEL") {
    if (source.production_method && source.production_method !== "SYNTHETIC_RENDERER_OUTPUT") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["production_method"],
        message: "synthetic teaching models cannot use a real-market production method",
      });
    }
    if (source.value_status.length > 0 && !source.value_status.includes("synthetic")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value_status"],
        message: "synthetic teaching models must include synthetic value status when value status is declared",
      });
    }
  }
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
  source_evidence: z.array(SourceEvidence).default([]),

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
export type SourceEvidence = z.infer<typeof SourceEvidence>;
