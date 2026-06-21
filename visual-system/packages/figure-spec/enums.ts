// Canonical enums for the figure spec. Single source for allowed values.

export const CHAPTERS = [
  "CH01", "CH02", "CH03", "CH04", "CH05", "CH06", "CH07",
  "CH08", "CH09", "CH10", "CH11", "CH12", "CH13",
] as const;

export const TIERS = [
  "TIER_1_CANONICAL",
  "TIER_2_CHAPTER_SUPPORT",
  "TIER_3_ASSESSMENT",
] as const;

export const FIGURE_STATUS = ["draft", "validated", "exported", "deprecated"] as const;

export const LEARNING_MODES = [
  "static_explanatory",
  "step_through_sequence",
  "toggle_comparison",
  "classification_drill",
  "gate_checklist",
] as const;

export const INTERACTION_MODES = [
  "none", "step_through", "toggle", "reveal", "classification", "decision_gate",
] as const;

export const OUTPUT_MODES = [
  "static_svg", "static_png", "static_pdf", "interactive_html",
] as const;

export const FIGURE_TYPES = [
  "event_evidence_read_decision_pipeline",
  "price_path_level_interaction",
  "acceptance_rejection_comparison",
  "market_profile_static",
  "market_profile_sequence",
  "footprint_dom_delta_sequence",
  "momentum_participation_comparison",
  "trap_storyboard",
  "session_timeline",
  "volatility_regime_map",
  "rotation_size_band_chart",
  "intermarket_matrix",
  "catalyst_transmission_chain",
  "setup_quality_gate",
  "trade_state_lifecycle",
  "read_stack_flow",
  "classification_matrix",
  "diagnostic_card",
] as const;

export const PLACEMENT_POSITIONS = [
  "after_section_heading",
  "after_in_practice",
  "at_marker",
] as const;

// Panel roles: the semantic slot a panel fills inside a figure.
export const PANEL_ROLES = [
  "price_path", "profile", "footprint", "dom_ladder", "delta",
  "evidence_rail", "forbidden_rail", "read_branches", "decision",
  "matrix", "timeline", "chart", "legend", "callout", "generic",
] as const;

export const ANNOTATION_TYPES = ["arrow", "bracket", "callout", "label", "zone"] as const;

export const FIXTURE_KINDS = ["deterministic_synthetic", "none"] as const;

export const SOURCE_CLASSES = [
  "REAL_MARKET_CAPTURE",
  "REAL_DATA_EXPORT",
  "MANUAL_MARKET_LOG",
  "MANUSCRIPT_REFERENCE",
  "SYNTHETIC_TEACHING_MODEL",
] as const;

export const PRODUCTION_METHODS = [
  "RAW_CAPTURE",
  "ANNOTATED_CAPTURE",
  "DATA_DERIVED_RECONSTRUCTION",
  "SYNTHETIC_RENDERER_OUTPUT",
] as const;

export const VALUE_STATUS = [
  "raw",
  "aggregated",
  "redrawn",
  "normalized",
  "anonymized",
  "synthetic",
] as const;
