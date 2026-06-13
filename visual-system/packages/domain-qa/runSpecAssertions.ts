import type { FigureSpec } from "../figure-spec/schema.ts";

export type SpecQaResult = {
  figure_id: string;
  status: "pass" | "fail";
  failures: string[];
};

// Spec-level rule families. These check the spec is conceptually well-formed.
// They run ALONGSIDE the render assertions, which check the drawing. Both are
// required: spec rules catch a badly authored card, render rules catch a
// renderer that fails to draw what the card declares (issue 1).
type Rule = (spec: FigureSpec) => string | null; // returns failure message or null

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
};

export function runDomainAssertions(spec: FigureSpec): SpecQaResult {
  const rules = ruleFamilies[spec.qa.domain_rule_family];
  if (!rules) {
    return { figure_id: spec.figure_id, status: "fail",
      failures: [`no rule family "${spec.qa.domain_rule_family}" registered`] };
  }
  const failures = rules.map((r) => r(spec)).filter((x): x is string => x !== null);
  return { figure_id: spec.figure_id, status: failures.length ? "fail" : "pass", failures };
}
