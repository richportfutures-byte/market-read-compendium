import type { FigureSpec } from "../figure-spec/schema.ts";

export type SpecQaResult = {
  figure_id: string;
  status: "pass" | "fail" | "skipped";
  failures: string[];
};

// Spec-level rule families. They run ALONGSIDE the render assertions: spec rules
// catch a badly authored card, render rules catch a renderer that fails to draw
// what the card declares (issue 1).
type Rule = (spec: FigureSpec) => string | null;

const ruleFamilies: Record<string, Rule[]> = {
  event_read_rules: [
    (s) => s.required_evidence.some((e) => /volume/i.test(e.label)) ? null
      : "event-read figure must include a volume-signature evidence item",
    (s) => s.required_evidence.some((e) => /delta|displacement/i.test(e.label)) ? null
      : "event-read figure must include a delta-vs-displacement evidence item",
    (s) => s.required_evidence.some((e) => /retest|post.?touch|acceptance|rejection/i.test(e.label)) ? null
      : "event-read figure must include a post-touch structure evidence item",
    (s) => s.forbidden_errors.some((f) => /touch.*signal|signal.*touch/i.test(f.description)) ? null
      : "event-read figure must forbid treating the touch itself as a signal",
  ],
  level_interaction_rules: [
    (s) => s.required_evidence.some((e) => /time|volume|beyond/i.test(e.label)) ? null
      : "level-interaction figure must show time/volume beyond the level",
    (s) => s.required_evidence.some((e) => /value|poc|migration/i.test(e.label)) ? null
      : "level-interaction figure must show value migration relative to the level",
    (s) => s.required_evidence.some((e) => /profile|tail|excess|single.?print/i.test(e.label)) ? null
      : "level-interaction figure must show profile shape (fattened vs excess tail)",
    (s) => s.forbidden_errors.some((f) => /touch|cross|single.*close|close.*above/i.test(f.description)) ? null
      : "level-interaction figure must forbid verdict-by-touch (a single cross as acceptance)",
  ],
  absorption_tape_rules: [
    (s) => s.required_evidence.some((e) => /aggressive|traded volume/i.test(e.label)) ? null
      : "absorption figure must show aggressive traded volume",
    (s) => s.required_evidence.some((e) => /delta/i.test(e.label)) ? null
      : "absorption figure must show delta",
    (s) => s.required_evidence.some((e) => /passive|reload/i.test(e.label)) ? null
      : "absorption figure must show passive reload",
    (s) => s.required_evidence.some((e) => /fail|through|progress/i.test(e.label)) ? null
      : "absorption figure must show failure to move through the level",
    (s) => s.required_evidence.some((e) => /resolution|away/i.test(e.label)) ? null
      : "absorption figure must show resolution away from the absorbed side",
    (s) => s.forbidden_errors.some((f) => /low.?volume.*absorption|pause.*absorption/i.test(f.description)) ? null
      : "absorption figure must forbid labeling a low-volume pause as absorption",
  ],
};

export function hasRuleFamily(name: string): boolean {
  return name in ruleFamilies;
}

export function runDomainAssertions(spec: FigureSpec): SpecQaResult {
  // Drafts are not held to domain rules yet; they are not finished.
  if (spec.status === "draft") {
    return { figure_id: spec.figure_id, status: "skipped", failures: [] };
  }
  const rules = ruleFamilies[spec.qa.domain_rule_family];
  if (!rules) {
    return { figure_id: spec.figure_id, status: "fail",
      failures: [`no rule family "${spec.qa.domain_rule_family}" registered`] };
  }
  const failures = rules.map((r) => r(spec)).filter((x): x is string => x !== null);
  return { figure_id: spec.figure_id, status: failures.length ? "fail" : "pass", failures };
}
