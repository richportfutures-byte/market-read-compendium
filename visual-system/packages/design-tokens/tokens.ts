// Minimal token set for the slice-zero. Renderers must read from here, never
// hardcode semantic colors. The full token set from the plan slots in here later.
export const tokens = {
  color: {
    surface: { canvas: "#0E1116", panel: "#151A21", panelRaised: "#1B222C" },
    text: { primary: "#E8E1D6", secondary: "#B8AEA2", muted: "#7F8792" },
    evidence: { price: "#D8C7A1", volume: "#8BA6C9", deltaPositive: "#6FAE8C", deltaNegative: "#C97868" },
    state: { accepted: "#6FAE8C", rejected: "#C97868", watch: "#8A97A8", stalk: "#C4A35A" },
    risk: { forbidden: "#D16262", allowed: "#6FAE8C" },
  },
  typography: { body: "Inter, system-ui, sans-serif", mono: "JetBrains Mono, ui-monospace, monospace" },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  stroke: { hairline: 1, normal: 1.5, emphasis: 2.5, structural: 3 },
} as const;
