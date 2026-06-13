// Canonical enums for the figure spec. Single source for allowed values.

export const CHAPTERS = [
  "CH01", "CH02", "CH03", "CH04", "CH05", "CH06", "CH07",
  "CH08", "CH09", "CH10", "CH11", "CH12", "CH13",
] as const;

export const TIERS = [
  "TIER_1_CANONICAL",
  "TIER_2_CHAPTER_SUPPORT",
  "TIER_3_ASSESSMENT",
  // Note: the old TIER_4_OPTIONAL_DECORATIVE was removed.
  // The system forbids decorative figures, so the tier that allowed them is gone.
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
] as const;

// Where in the manuscript the figure is dropped (issue 4).
export const PLACEMENT_POSITIONS = [
  "after_section_heading", // immediately under the named heading
  "after_in_practice",     // after the "In Practice" subsection of the section
  "at_marker",             // at an explicit <!-- FIGURE:id --> comment in the chapter
] as const;
