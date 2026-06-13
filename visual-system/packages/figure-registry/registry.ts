import { loadAllSpecs } from "../figure-spec/validateAllSpecs.ts";
import type { FigureSpec } from "../figure-spec/schema.ts";

export type RegistryEntry = {
  figure_id: string;
  chapter: FigureSpec["chapter"];
  tier: FigureSpec["tier"];
  figure_type: FigureSpec["figure_type"];
  status: FigureSpec["status"];
  outputs: FigureSpec["outputs"];
  spec_path: string;
  spec: FigureSpec;
};

export type FigureRegistry = {
  entries: RegistryEntry[];
  byId(id: string): RegistryEntry | undefined;
  filterExportable(): RegistryEntry[];
  filterRenderEvidenceChecked(): RegistryEntry[];
  filterByTier(tier: FigureSpec["tier"]): RegistryEntry[];
  groupByChapter(): Record<string, RegistryEntry[]>;
};

export function buildRegistry(): FigureRegistry {
  const loaded = loadAllSpecs();
  const entries: RegistryEntry[] = loaded.map(({ path, spec }) => ({
    figure_id: spec.figure_id,
    chapter: spec.chapter,
    tier: spec.tier,
    figure_type: spec.figure_type,
    status: spec.status,
    outputs: spec.outputs,
    spec_path: path,
    spec,
  }));

  return {
    entries,
    byId: (id) => entries.find((e) => e.figure_id === id),
    filterExportable: () => entries.filter((e) => e.outputs.includes("static_svg")),
    filterRenderEvidenceChecked: () => entries.filter((e) => e.spec.qa.render_evidence_check),
    filterByTier: (tier) => entries.filter((e) => e.tier === tier),
    groupByChapter: () =>
      entries.reduce<Record<string, RegistryEntry[]>>((acc, e) => {
        (acc[e.chapter] ||= []).push(e);
        return acc;
      }, {}),
  };
}
