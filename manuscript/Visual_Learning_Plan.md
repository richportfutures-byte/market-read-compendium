# Market-Read Compendium Visual Learning System  
## Updated Implementation Plan

This plan defines the implementation architecture for a schema-driven visual-learning operating system for the Market-Read Compendium. The system is designed to produce validated static and lightweight interactive teaching objects only where they materially improve junior-trader concept transfer.

This version includes the following architectural requirements:

1. **Design token system is mandatory.**
2. **Shared primitive library is mandatory.**
3. **Framer Motion is the standardized transition layer.**
4. **CH08 Expected Rotation-Size Bands uses React + SVG/D3 only; Vega-Lite is removed from production routing.**
5. **The Figure Registry is the single source of truth for QA, export, visual regression, and coverage.**

---

## 1. Executive Reality Check

The correct system is not a collection of diagrams. It is a **domain-governed visual renderer**.

The operating loop is:

```txt
Figure Spec
  ↓
Zod Validation
  ↓
Figure Registry
  ↓
Domain QA Routing
  ↓
Renderer Selection
  ↓
React/SVG/D3 Rendering
  ↓
Framer Motion Interaction Layer
  ↓
Playwright Export
  ↓
Visual Regression
  ↓
Coverage / QA / Export Reports
```

The critical implementation rule is that the **Registry owns the execution graph**. Playwright, domain QA, export, and reports all derive from the Registry. No duplicate hardcoded figure lists.

---

## 2. Implementation Stack

| Layer | Purpose | Required Tooling |
|---|---|---|
| Figure Spec Schema | Canonical source of truth for every visual aid | TypeScript + Zod |
| Design Token System | Governs visual consistency across 100+ visuals | TypeScript token package + CSS variables |
| Shared Primitive Library | Prevents rebuilding the same layout/interaction patterns repeatedly | React + TypeScript + SVG |
| Core Domain Renderers | Render market-read visuals from validated specs | React + SVG/D3 |
| Dense Microstructure Renderer | Footprint, DOM ladder, volume-at-price, tape panels | React + SVG/Canvas |
| Transition Layer | Controlled instructional transitions | Framer Motion |
| Registry | Single source of truth for inventory, QA, export, coverage | TypeScript |
| Domain QA Harness | Prevents conceptually false figures | TypeScript assertion rules |
| Static Export | PNG/SVG/HTML output from actual rendered components | Playwright |
| Visual Regression | Prevents layout/semantic drift | Playwright snapshots |
| Studio App | Internal preview/gallery/export route | React + Vite |
| Optional Polish Layer | Typography, layout review, presentation packaging | Figma / Claude Design only after semantic renderer exists |

Removed from production path:

```txt
- Vega-Lite
- AI-generated instructional figures
- Figma-only diagram production
- Python-only chart scripts
- Manual PNG workflow
```

Python remains optional only for deterministic synthetic fixtures or validation helpers.

---

## 3. Non-Negotiable Architecture Invariants

### 3.1 Canonical source of truth

Every figure starts from a structured figure spec.

No figure is authored directly as a standalone SVG, PNG, Figma frame, or hand-built React page.

### 3.2 Registry single-source invariant

The **Figure Registry** is the single runtime source of truth for:

```txt
- figure inventory
- renderer selection
- domain QA routing
- Playwright export coverage
- visual snapshot coverage
- chapter coverage
- tier coverage
- export manifest generation
- QA report generation
```

No separate Playwright figure list.  
No separate QA figure list.  
No separate export list.  
No separate chapter coverage file.

Correct wiring:

```txt
specs/*.json
  ↓
Zod validation
  ↓
Registry build
  ↓
Domain QA runner reads Registry
  ↓
Renderer smoke tests read Registry
  ↓
Playwright export reads Registry
  ↓
Visual regression reads Registry
  ↓
Coverage/export/QA reports generated from Registry
```

### 3.3 Static and interactive parity

Static and interactive versions must render from the same canonical spec and the same component family.

### 3.4 Framer Motion constraint

Framer Motion is allowed only for instructional transitions.

Allowed:

```txt
- step transitions
- reveal transitions
- toggle comparison crossfades
- evidence highlight transitions
- state badge transitions
- panel emphasis
```

Forbidden:

```txt
- decorative animation
- fake market replay
- gamified P&L behavior
- motion implying prediction
- overanimated dashboard effects
```

### 3.5 D3 production standard

D3 is the standardized production path for all chart-like figures, including CH08 Expected Rotation-Size Bands.

Vega-Lite is removed from the production plan because the system needs shared tokens, annotations, evidence rails, semantic states, and renderer parity across the full visual system.

---

## 4. Repository Structure

```txt
visual-system/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json

  apps/
    studio/
      src/
        main.tsx
        App.tsx
        routes/
          FigureGalleryRoute.tsx
          FigureDetailRoute.tsx
          ExportPreviewRoute.tsx
        styles/
          global.css
      index.html
      vite.config.ts

  packages/
    figure-spec/
      src/
        schema.ts
        enums.ts
        types.ts
        parseFigureSpec.ts
        validateFigureSpec.ts
        validateAllSpecs.ts
      tests/
        schema.test.ts

    figure-registry/
      src/
        registry.ts
        buildFigureRegistry.ts
        loadAllFigureSpecs.ts
        filters.ts
        coverage.ts
      tests/
        registry.test.ts

    design-tokens/
      src/
        tokens.ts
        semanticStateStyles.ts
        evidenceStyles.ts
        cssVariables.ts
      dist/
        tokens.css

    primitives/
      src/
        FigureFrame.tsx
        PanelGrid.tsx
        EvidenceRail.tsx
        ForbiddenMisreadRail.tsx
        AnnotationLayer.tsx
        StateBadge.tsx
        StepThrough.tsx
        TogglePanel.tsx
        ClassificationDrill.tsx
        DecisionGate.tsx
        SequenceStepper.tsx
      tests/
        primitives.test.tsx

    renderers/
      src/
        FigureRenderer.tsx
        rendererMap.ts

        price-path/
          PricePathPanel.tsx
          LevelBand.tsx
          AcceptanceRejectionOverlay.tsx

        profile/
          MarketProfilePanel.tsx
          ValueAreaBand.tsx
          POCMarker.tsx
          HVNLVNTerrain.tsx

        footprint/
          FootprintGrid.tsx
          DeltaCurve.tsx
          VolumeAtPriceColumn.tsx

        dom/
          DOMLadder.tsx
          ReloadIndicator.tsx
          LiquidityBand.tsx

        matrix/
          IntermarketMatrix.tsx

        gates/
          SetupQualityGate.tsx
          ExecutionPermissionGate.tsx

        state-machine/
          TradeStateMachine.tsx
          ReadStackFlow.tsx

        storyboard/
          TrapStoryboard.tsx

      tests/
        rendererMap.test.tsx
        renderSmoke.test.tsx

    fixtures/
      src/
        syntheticSequences/
          ch03Acceptance.ts
          ch04Absorption.ts
          ch05MomentumDrift.ts
          ch06Trap.ts
          ch08RotationBands.ts

    domain-qa/
      src/
        runDomainAssertions.ts
        ruleMap.ts
        rules/
          ch01EventRead.rules.ts
          ch02LevelInteraction.rules.ts
          ch03Auction.rules.ts
          ch04Absorption.rules.ts
          ch05Momentum.rules.ts
          ch06Trap.rules.ts
          ch07Session.rules.ts
          ch08Volatility.rules.ts
          ch09Intermarket.rules.ts
          ch10Catalyst.rules.ts
          ch11TradeState.rules.ts
          ch12SetupQuality.rules.ts
          ch13ReadStack.rules.ts
      tests/
        ch04Absorption.rules.test.ts

    export/
      src/
        exportManifest.ts
        exportFigure.ts
        exportAll.ts
      playwright/
        export.spec.ts
        visual-regression.spec.ts
      output/
        svg/
        png/
        html/

  specs/
    CH01/
    CH02/
    CH03/
    CH04/
      CH04_ABSORPTION_001.json
    CH05/
    CH06/
    CH07/
    CH08/
    CH09/
    CH10/
    CH11/
    CH12/
    CH13/

  qa/
    reports/
      latest-validation.json
      latest-domain-qa.json
      latest-export-manifest.json
      latest-coverage.json
```

---

## 5. Figure Spec Schema

The figure spec must encode not only what to draw, but what the visual is supposed to teach.

### Required top-level fields

```ts
FigureSpec = {
  figure_id: string;
  version: string;

  chapter: Chapter;
  tier: Tier;
  status: FigureStatus;

  title: string;
  concept: string;
  source_refs: SourceRef[];

  teaching_objective: string;
  junior_error: string;
  professional_read: string;
  decision_consequence: string;

  required_evidence: EvidenceItem[];
  forbidden_errors: ForbiddenError[];

  figure_type: FigureType;
  learning_mode: LearningMode;
  interaction: InteractionMode;

  semantic_states: SemanticState[];
  domain_objects: DomainObject[];

  panels: PanelSpec[];
  sequence?: SequenceStep[];

  annotations?: AnnotationSpec[];
  callouts?: CalloutSpec[];
  legend?: LegendSpec;

  outputs: OutputMode[];
  export: ExportSpec;

  qa: QASpec;
}
```

### Required enums

```ts
Chapter =
  | "CH01" | "CH02" | "CH03" | "CH04" | "CH05" | "CH06" | "CH07"
  | "CH08" | "CH09" | "CH10" | "CH11" | "CH12" | "CH13";

Tier =
  | "TIER_1_CANONICAL"
  | "TIER_2_CHAPTER_SUPPORT"
  | "TIER_3_ASSESSMENT"
  | "TIER_4_OPTIONAL_DECORATIVE";

FigureStatus =
  | "draft"
  | "validated"
  | "exported"
  | "deprecated";

LearningMode =
  | "static_explanatory"
  | "step_through_sequence"
  | "toggle_comparison"
  | "classification_drill"
  | "gate_checklist";

InteractionMode =
  | "none"
  | "step_through"
  | "toggle"
  | "reveal"
  | "classification"
  | "decision_gate";

OutputMode =
  | "static_svg"
  | "static_png"
  | "static_pdf"
  | "interactive_html";

SemanticState =
  | "NO_INFORMATION"
  | "WATCH"
  | "STALK"
  | "CONFIRMING"
  | "ACCEPTED"
  | "REJECTED"
  | "ABSORBED"
  | "EXHAUSTING"
  | "INTACT"
  | "WEAKENING"
  | "INVALIDATED"
  | "COMPLETE"
  | "NO_TRADE"
  | "STAND_ASIDE"
  | "EXECUTION_PERMITTED";
```

### Figure types

```ts
FigureType =
  | "event_evidence_read_decision_pipeline"
  | "price_path_level_interaction"
  | "acceptance_rejection_comparison"
  | "market_profile_static"
  | "market_profile_sequence"
  | "footprint_dom_delta_sequence"
  | "momentum_participation_comparison"
  | "trap_storyboard"
  | "session_timeline"
  | "volatility_regime_map"
  | "rotation_size_band_chart"
  | "intermarket_matrix"
  | "catalyst_transmission_chain"
  | "setup_quality_gate"
  | "trade_state_lifecycle"
  | "read_stack_flow";
```

---

## 6. Design Token System

The design token system is a governance layer, not styling decoration.

It must standardize:

```txt
- surface colors
- text colors
- typography
- spacing
- radius
- stroke weights
- panel dimensions
- annotation styles
- evidence category colors
- semantic state colors
- risk/permission colors
- chart line weights
- profile/value-area treatments
- DOM/footprint intensity treatments
```

### Token package

```ts
export const tokens = {
  color: {
    surface: {
      canvas: "#0E1116",
      panel: "#151A21",
      panelRaised: "#1B222C",
      panelMuted: "#11161D"
    },

    text: {
      primary: "#E8E1D6",
      secondary: "#B8AEA2",
      muted: "#7F8792",
      inverse: "#0E1116"
    },

    evidence: {
      price: "#D8C7A1",
      volume: "#8BA6C9",
      deltaPositive: "#6FAE8C",
      deltaNegative: "#C97868",
      time: "#B9A37E",
      depth: "#9B8AC9",
      intermarket: "#7FA8A8",
      volatility: "#C9906A"
    },

    state: {
      noInformation: "#6E7580",
      watch: "#8A97A8",
      stalk: "#C4A35A",
      confirming: "#D2B56B",
      accepted: "#6FAE8C",
      rejected: "#C97868",
      absorbed: "#B68CDA",
      exhausting: "#D18A62",
      intact: "#6FAE8C",
      weakening: "#C4A35A",
      invalidated: "#D16262",
      complete: "#8BA6C9",
      noTrade: "#7F8792",
      standAside: "#9A8F85",
      executionPermitted: "#6FAE8C"
    },

    risk: {
      forbidden: "#D16262",
      caution: "#C4A35A",
      allowed: "#6FAE8C"
    }
  },

  typography: {
    body: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, ui-monospace, monospace",
    display: "Inter Tight, Inter, system-ui, sans-serif"
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },

  stroke: {
    hairline: 1,
    normal: 1.5,
    emphasis: 2.5,
    structural: 3
  }
};
```

### Token acceptance criteria

```txt
- No renderer hardcodes semantic colors.
- No figure-specific color drift.
- Every semantic state maps to a token.
- Every evidence type maps to a token.
- Playwright snapshots catch token-driven visual drift.
```

---

## 7. Shared Primitive Library

The shared primitive library prevents 100 visuals from becoming 100 separate implementations.

### Required primitives

| Primitive | Purpose |
|---|---|
| `<FigureFrame>` | Standard title, chapter badge, teaching objective, evidence rail, footer |
| `<PanelGrid>` | Consistent one/two/three/four-panel layout |
| `<EvidenceRail>` | Shows required evidence and whether each item is visible |
| `<ForbiddenMisreadRail>` | Shows what the visual must not imply |
| `<AnnotationLayer>` | Arrows, brackets, callouts, labels |
| `<StateBadge>` | Standard semantic state marker |
| `<StepThrough>` | Reusable sequential instructional interaction |
| `<TogglePanel>` | Reusable A/B comparison pattern |
| `<ClassificationDrill>` | User classifies before reveal |
| `<DecisionGate>` | Checklist/gate logic |
| `<SequenceStepper>` | Step navigation/progress |
| `<LegendBlock>` | Semantic legend |
| `<ExportSafeRoot>` | Stable export dimensions and render-ready marker |

### Framer Motion primitives

Framer Motion should be wrapped inside primitives, not scattered across domain renderers.

```txt
Good:
<StepThrough> uses Framer Motion internally.

Bad:
CH04AbsorptionRenderer manually invents its own transition behavior.
```

Required Framer Motion wrappers:

```txt
- MotionStepContainer
- MotionReveal
- MotionHighlight
- MotionToggleSwap
- MotionStateBadge
```

---

## 8. Registry Architecture

The Registry is the system spine.

### Registry entry

```ts
export type FigureRegistryEntry = {
  figure_id: string;
  chapter: Chapter;
  title: string;
  concept: string;

  tier: Tier;
  status: FigureStatus;

  figure_type: FigureType;
  renderer_key: RendererKey;

  learning_mode: LearningMode;
  interaction: InteractionMode;

  spec_path: string;
  outputs: OutputMode[];

  qa: {
    domain_rule_family: DomainRuleFamily;
    visual_snapshot: boolean;
    static_interactive_parity: boolean;
  };

  export: {
    width: number;
    height: number;
    formats: OutputMode[];
  };
};
```

### Registry functions

```ts
export const figureRegistry = buildFigureRegistry(loadAllFigureSpecs());

export const exportableFigures =
  figureRegistry.filterExportable();

export const domainQaFigures =
  figureRegistry.filterWithDomainRules();

export const visualSnapshotFigures =
  figureRegistry.filterWithVisualSnapshots();

export const tierOneFigures =
  figureRegistry.filterByTier("TIER_1_CANONICAL");

export const figuresByChapter =
  figureRegistry.groupByChapter();
```

### Playwright must read Registry directly

```ts
for (const figure of visualSnapshotFigures) {
  test(`${figure.figure_id} visual snapshot`, async ({ page }) => {
    await page.goto(`/export/${figure.figure_id}`);

    const root = page.locator(`[data-figure-id="${figure.figure_id}"]`);

    await expect(root).toHaveAttribute("data-export-ready", "true");
    await expect(root).toHaveScreenshot(`${figure.figure_id}.png`);
  });
}
```

### Domain QA must read Registry directly

```ts
for (const figure of domainQaFigures) {
  test(`${figure.figure_id} domain QA`, () => {
    const spec = loadSpecById(figure.figure_id);
    const result = runDomainAssertions(spec, figure.qa.domain_rule_family);

    expect(result.status).toBe("pass");
  });
}
```

This eliminates duplicate figure lists.

---

## 9. Domain QA Harness

Domain QA prevents semantic failure.

### Required domain rule families

| Chapter | Rule Family |
|---|---|
| CH01 | `event_read_rules` |
| CH02 | `level_interaction_rules` |
| CH03 | `auction_profile_rules` |
| CH04 | `absorption_tape_rules` |
| CH05 | `momentum_sponsorship_rules` |
| CH06 | `trap_positioning_rules` |
| CH07 | `session_context_rules` |
| CH08 | `volatility_regime_rules` |
| CH09 | `intermarket_confirmation_rules` |
| CH10 | `catalyst_interpretation_rules` |
| CH11 | `trade_state_rules` |
| CH12 | `setup_quality_rules` |
| CH13 | `read_stack_rules` |

### Example: CH04 absorption rules

```txt
Absorption visual must show:
- aggressive traded volume
- delta
- passive reload
- failure to move through the level
- resolution away from absorbed side

Absorption visual must not:
- label low-volume pause as absorption
- show accepted trade through absorbed level unless teaching failed absorption
- omit who is applying effort
- omit who is absorbing effort
```

### Example: CH08 volatility rules

```txt
Volatility-regime visual must show:
- regime changes tactic, stop, target, size, or permission
- compression does not predict direction
- expected rotation bands are contextual, not signals
- same setup may receive different permission under different volatility regimes
```

---

## 10. Core Renderer System

### Main renderer contract

```ts
export type FigureRendererProps = {
  spec: FigureSpec;
  mode: "static" | "interactive" | "export";
  activeStep?: number;
  width?: number;
  height?: number;
};
```

### Renderer map

```ts
export const rendererMap: Record<FigureType, React.ComponentType<FigureRendererProps>> = {
  event_evidence_read_decision_pipeline: PipelineRenderer,
  price_path_level_interaction: PricePathLevelRenderer,
  acceptance_rejection_comparison: AcceptanceRejectionRenderer,
  market_profile_static: MarketProfileRenderer,
  market_profile_sequence: MarketProfileSequenceRenderer,
  footprint_dom_delta_sequence: FootprintDomDeltaRenderer,
  momentum_participation_comparison: MomentumParticipationRenderer,
  trap_storyboard: TrapStoryboardRenderer,
  session_timeline: SessionTimelineRenderer,
  volatility_regime_map: VolatilityRegimeRenderer,
  rotation_size_band_chart: RotationSizeBandRenderer,
  intermarket_matrix: IntermarketMatrixRenderer,
  catalyst_transmission_chain: CatalystTransmissionRenderer,
  setup_quality_gate: SetupQualityGateRenderer,
  trade_state_lifecycle: TradeStateLifecycleRenderer,
  read_stack_flow: ReadStackFlowRenderer
};
```

### Required domain renderers

| Renderer | Used For |
|---|---|
| `PipelineRenderer` | CH01 event/evidence/read/decision |
| `PricePathLevelRenderer` | CH02 level interaction |
| `AcceptanceRejectionRenderer` | CH02/CH03 acceptance/rejection |
| `MarketProfileRenderer` | CH03 profile visuals |
| `FootprintDomDeltaRenderer` | CH04 absorption/tape |
| `MomentumParticipationRenderer` | CH05 sponsorship vs drift |
| `TrapStoryboardRenderer` | CH06 traps |
| `SessionTimelineRenderer` | CH07 session handoff |
| `VolatilityRegimeRenderer` | CH08 compression/expansion |
| `RotationSizeBandRenderer` | CH08 expected rotation-size bands using React + SVG/D3 |
| `IntermarketMatrixRenderer` | CH09 confirmation matrix |
| `CatalystTransmissionRenderer` | CH10 catalyst chain |
| `TradeStateLifecycleRenderer` | CH11 thesis state |
| `SetupQualityGateRenderer` | CH12 setup quality |
| `ReadStackFlowRenderer` | CH13 complete read stack |

---

## 11. Playwright Export Path

Playwright must derive export coverage from the Registry.

### Export route

```txt
/export/:figureId
```

### Export-safe root

```tsx
<ExportSafeRoot
  figureId={spec.figure_id}
  width={spec.export.width}
  height={spec.export.height}
>
  <FigureRenderer spec={spec} mode="export" />
</ExportSafeRoot>
```

The export root must include:

```html
data-figure-id="CH04_ABSORPTION_001"
data-export-ready="true"
```

### Export outputs

Required for foundation:

```txt
- PNG
- visual snapshot
- export manifest
```

Required soon after:

```txt
- SVG
- interactive HTML bundle
- PDF only after PNG/SVG route is stable
```

### Export manifest generated from Registry

```json
{
  "generated_at": "2026-06-12T00:00:00.000Z",
  "source": "figureRegistry",
  "figures": [
    {
      "figure_id": "CH04_ABSORPTION_001",
      "chapter": "CH04",
      "outputs": ["static_png", "static_svg", "interactive_html"],
      "export_status": "pass",
      "snapshot_status": "pass"
    }
  ]
}
```

---

## 12. Tier-1 Canonical Vertical Slice

Start with **CH04_ABSORPTION_001**.

This is the right first proof because it forces the system to handle:

```txt
- price path
- footprint grid
- DOM ladder
- delta curve
- evidence rail
- forbidden misread rail
- sequence steps
- Framer Motion step-through
- domain QA
- static export
- visual regression
```

### CH04 vertical slice

| Item | Requirement |
|---|---|
| Figure ID | `CH04_ABSORPTION_001` |
| Concept | Absorption: effort without result |
| Type | Footprint + DOM + delta sequence |
| Renderer | `FootprintDomDeltaRenderer` |
| Interaction | `StepThrough` using Framer Motion |
| Outputs | PNG, SVG, interactive HTML |
| QA family | `absorption_tape_rules` |
| Fixture | deterministic synthetic sequence |

### Required visible evidence

```txt
- Heavy aggressive buy volume
- Positive delta into the level
- Passive offer reload at the level
- Failure to print above the level
- Resolution away from absorbed side
```

### Forbidden visual misreads

```txt
- Do not label low-volume pause as absorption.
- Do not show accepted break through the absorbed level.
- Do not omit delta.
- Do not omit passive reload.
- Do not imply tape alone authorizes a trade outside context.
```

---

## 13. Tier-1 Figure Roadmap

After CH04 passes, build the rest of Tier-1.

| Chapter | Figure ID | Concept | Type | Renderer |
|---|---|---|---|---|
| CH01 | `CH01_TOUCH_VS_READ_001` | Touch vs Read | Pipeline / reveal | React + SVG + Framer Motion |
| CH02 | `CH02_ACCEPT_REJECT_001` | Acceptance vs Rejection | Toggle comparison | React + SVG/D3 + Framer Motion |
| CH03 | `CH03_BALANCE_IMBALANCE_001` | Balance vs Imbalance | Market profile comparison | React + SVG/D3 |
| CH03 | `CH03_VALUE_MIGRATION_001` | Value Migration | Step-through profile sequence | React + SVG/D3 + Framer Motion |
| CH04 | `CH04_ABSORPTION_001` | Absorption | Footprint + DOM + delta sequence | React + SVG/Canvas + D3 + Framer Motion |
| CH05 | `CH05_MOMENTUM_DRIFT_001` | Momentum vs Drift | Participation comparison | React + SVG/D3 + Framer Motion |
| CH06 | `CH06_TRAP_SEQUENCE_001` | Trap Sequence | Storyboard | React + SVG + Framer Motion |
| CH07 | `CH07_SESSION_HANDOFF_001` | Session Handoff | Timeline | React + SVG |
| CH08 | `CH08_COMPRESSION_EXPANSION_001` | Compression vs Expansion | Regime map | React + SVG/D3 + Framer Motion |
| CH08 | `CH08_ROTATION_BANDS_001` | Expected Rotation-Size Bands | Statistical band chart | React + SVG/D3 |
| CH09 | `CH09_CONFIRMATION_MATRIX_001` | Intermarket Confirmation | Matrix | React + SVG |
| CH11 | `CH11_THESIS_LIFECYCLE_001` | Thesis State Lifecycle | State machine | React + SVG + Framer Motion |
| CH12 | `CH12_SETUP_GATE_001` | Setup Quality Gate | Decision gate | React + SVG + Framer Motion |

CH13 waits until the preceding layers exist.

---

## 14. Updated Chapter Visual Aid List

### CH01 — Read Discipline and Interpretation

| Concept | Type | Key Program |
|---|---|---|
| Event → Evidence → Read → Decision | Pipeline diagram | React + SVG |
| Touch vs Response | Reveal / comparison | React + SVG + Framer Motion |
| Context vs Permission | Split-screen decision diagram | React + SVG |
| Invalidation / Renegotiation Failure | Step-through sequence | React + SVG + Framer Motion |
| Prediction vs Conditional Read | Journal-card visual | React + SVG |
| Conflict Classification Map | Classification map | React + SVG |

### CH02 — Level Interaction and Acceptance

| Concept | Type | Key Program |
|---|---|---|
| Ranked Structural Level Sheet | Level hierarchy diagram | React + SVG |
| Level Ownership Map | Annotated level map | React + SVG/D3 |
| Acceptance vs Rejection at Same Level | Toggle comparison | React + SVG/D3 + Framer Motion |
| Sweep vs Accepted Break | Sequence comparison | React + SVG/D3 + Framer Motion |
| First Touch vs Third Touch | Liquidity depletion visual | React + SVG |
| Dead Level After Accepted-Through Behavior | Before/after level visual | React + SVG |
| Confluence Zone | Zone-weighting diagram | React + SVG |

### CH03 — Auction Market Profile

| Concept | Type | Key Program |
|---|---|---|
| Price Advertises / Volume Responds / Time Judges | Three-part auction diagram | React + SVG |
| Balance Profile vs Trend Profile | Market profile comparison | React + SVG/D3 |
| Failed Break Above Value | Annotated profile + price path | React + SVG/D3 |
| Accepted Break with Value Migration | Step-through profile sequence | React + SVG/D3 + Framer Motion |
| Responsive Activity at Value Edge | Profile interaction visual | React + SVG/D3 |
| Initiative Activity Through Value Edge | Profile interaction visual | React + SVG/D3 |
| Poor High vs Excess High | Profile anatomy diagram | React + SVG/D3 |
| Single Prints and Repair | Market profile repair sequence | React + SVG/D3 + Framer Motion |
| Initial Balance and Range Extension | Session structure visual | React + SVG/D3 |
| Tactic-Family Map by Auction State | Decision map | React + SVG |

### CH04 — Tape Reading and Microstructure

| Concept | Type | Key Program |
|---|---|---|
| Absorption: Effort Without Result | Footprint + DOM + delta sequence | React + SVG/Canvas + D3 + Framer Motion |
| Pause vs Absorption | Toggle comparison | React + SVG/Canvas + Framer Motion |
| Passive Reload vs Passive Pull | DOM ladder comparison | React + SVG/Canvas |
| Sweep Through Liquidity vs Initiative Drive | Tape/price-path comparison | React + SVG/D3 |
| Delta Divergence | Delta + price panel | React + SVG/D3 |
| Tape Speed / Print Size Quality Scale | Quality scale visual | React + SVG |
| Spread/Depth Readable vs Unreadable | Market-quality gate | React + SVG |
| Effort / Result Matrix | 2x2 classification matrix | React + SVG |
| Resolution of Absorption Against Aggressors | Step-through sequence | React + SVG/Canvas + Framer Motion |
| Acceptance Through Absorbed Level | Failed-absorption comparison | React + SVG/D3 |

### CH05 — Momentum, Trend, Day Type

| Concept | Type | Key Program |
|---|---|---|
| Momentum vs Drift | Same-distance comparison | React + SVG/D3 + Framer Motion |
| Impulse Quality Scorecard | Diagnostic card | React + SVG |
| Pullback Quality Comparison | Two-path comparison | React + SVG/D3 |
| One-Timeframing Sequence | Step-through trend structure | React + SVG/D3 + Framer Motion |
| Trend Day Anatomy | Day-structure diagram | React + SVG/D3 |
| Exhaustion After Mature Trend | Annotated sequence | React + SVG/D3 + Framer Motion |
| Day-Type Taxonomy | Classification map | React + SVG |
| Eligible Tactic Families by Day Type | Permission matrix | React + SVG |
| Short Covering vs Real Demand | Participation comparison | React + SVG/D3 |

### CH06 — Traps and Positioning

| Concept | Type | Key Program |
|---|---|---|
| Breakout Entrant Population Map | Positioning map | React + SVG |
| Stop Pool Below Failed Breakout | Liquidity map | React + SVG |
| Trap Sequence Storyboard | Step-through storyboard | React + SVG + Framer Motion |
| Defended Breakout vs Trapped Breakout | Toggle comparison | React + SVG/D3 + Framer Motion |
| Late Entrant Pain Map | Positioning / pain-threshold visual | React + SVG |
| Short Covering vs Demand | Flow comparison | React + SVG/D3 |
| Forced Exit Cascade | Flow-sequence visual | React + SVG + Framer Motion |
| User Stop Inside Crowd Stop Pool | Risk-location diagram | React + SVG |

### CH07 — Session Context and Sequencing

| Concept | Type | Key Program |
|---|---|---|
| Asia → London → NY Handoff | Session timeline | React + SVG |
| Session Range Origin Labels | Session-origin level map | React + SVG/D3 |
| Overnight Inventory Map | Inventory-position visual | React + SVG |
| London Rejection of Asia Value | Session interaction sequence | React + SVG/D3 + Framer Motion |
| NY Acceptance/Rejection of Overnight Structure | Toggle comparison | React + SVG/D3 + Framer Motion |
| Open Drive / Open Test Drive / Open Rejection | Open-type taxonomy | React + SVG |
| Lunch Trough Participation Map | Time-of-day participation visual | React + SVG/D3 |
| Session-Origin Reliability Scale | Reliability scale | React + SVG |

### CH08 — Volatility Regime

| Concept | Type | Key Program |
|---|---|---|
| Compression Coil Across Sessions | Volatility regime map | React + SVG/D3 |
| Expansion Release | Sequence visual | React + SVG/D3 + Framer Motion |
| Stop Cluster Outside Compressed Range | Liquidity/range diagram | React + SVG |
| Long-Gamma Pinning | Regime-behavior diagram | React + SVG |
| Short-Gamma Acceleration | Regime-behavior diagram | React + SVG |
| Same Stop in Low-Vol vs High-Vol | Toggle comparison | React + SVG/D3 + Framer Motion |
| Expected Rotation-Size Bands | Statistical band chart / regime-scaled range visual | React + SVG/D3 |
| Regime Permission Gate | Gate/checklist visual | React + SVG + Framer Motion |

### CH09 — Intermarket Confirmation

| Concept | Type | Key Program |
|---|---|---|
| Correlation Overlay vs Mechanism Chain | Contrast diagram | React + SVG |
| Rates-Led Repricing Chain | Transmission chain | React + SVG |
| Dollar / Rates / Equity / Gold Confirmation Map | Cross-market map | React + SVG |
| Intermarket Conflict Matrix | Matrix visual | React + SVG |
| Leader / Confirmer / Laggard | Role diagram | React + SVG |
| Confirmation Upgrading Size | Permission/size visual | React + SVG |
| Conflict Downgrading Permission | Permission downgrade visual | React + SVG |
| Regime-Dependent Relationship Flip | Toggle comparison | React + SVG/D3 + Framer Motion |

### CH10 — Catalyst Interpretation

| Concept | Type | Key Program |
|---|---|---|
| New Information vs Recycled Context | Classification comparison | React + SVG |
| Headline Sweep with No Second Wave | Price-path sequence | React + SVG/D3 + Framer Motion |
| Genuine Repricing with Cross-Asset Transmission | Catalyst chain | React + SVG |
| Pre-Event Hollow Book | Depth/liquidity visual | React + SVG/Canvas |
| Post-Event Liquidity Rebuild | Step-through sequence | React + SVG/Canvas + Framer Motion |
| Catalyst Transmission Chain | Flow diagram | React + SVG |
| Recycled-Headline Fade Setup | Setup storyboard | React + SVG/D3 |
| Thesis Expiry at Event Boundary | Lifecycle/gate visual | React + SVG |

### CH11 — Trade-State Management

| Concept | Type | Key Program |
|---|---|---|
| Thesis State Lifecycle | State-machine diagram | React + SVG + Framer Motion |
| Green but Invalidated | P&L vs thesis-state contrast | React + SVG |
| Red but Intact | P&L vs thesis-state contrast | React + SVG |
| Stop vs Invalidation | Distinction diagram | React + SVG |
| Weakening Evidence Before Stop Hit | Step-through sequence | React + SVG/D3 + Framer Motion |
| Complete Thesis Before Target Fantasy | Lifecycle visual | React + SVG |
| Add / Reduce / Exit Action Map | Action matrix | React + SVG |
| Re-Entry Permission Gate | Gate/checklist visual | React + SVG + Framer Motion |
| Review Log State Audit | Review-card visual | React + SVG |

### CH12 — Setup Quality and Action Vocabulary

| Concept | Type | Key Program |
|---|---|---|
| Clean vs Dirty Structure | Structure comparison | React + SVG/D3 |
| Valid Trigger vs Late Trigger | Timing comparison | React + SVG/D3 |
| A/B/C Setup Grading Card | Diagnostic grading card | React + SVG |
| Setup Cleanliness Checklist | Checklist/gate visual | React + SVG + Framer Motion |
| Higher-Timeframe Read Right / Setup Wrong | Split-screen failure visual | React + SVG |
| Same Pattern Morning vs Lunch | Context toggle comparison | React + SVG/D3 + Framer Motion |
| Action Vocabulary State Board | State board | React + SVG |
| Execution Permission Gate | Gate/checklist visual | React + SVG + Framer Motion |
| No-Trade Decision Tree | Decision tree | React + SVG |
| Setup Degradation Sequence | Step-through sequence | React + SVG/D3 + Framer Motion |

### CH13 — From Read to Trade

| Concept | Type | Key Program |
|---|---|---|
| Complete 11-Layer Read Stack | Stack-flow diagram | React + SVG + Framer Motion |
| Pre-Market Stack Worksheet | Worksheet visual | React + SVG |
| Broken-Layer Rerun Map | Diagnostic flow map | React + SVG |
| Read → Setup → Permission → Management Pipeline | Operating-system pipeline | React + SVG + Framer Motion |
| Same Tape / Different Context | Toggle comparison | React + SVG/D3 + Framer Motion |
| No-Trade / Stalk / Execute Classifier | Classification module | React + SVG + Framer Motion |
| Full Trade Walkthrough | Capstone step-through | React + SVG/D3 + Framer Motion |
| Review Loop Artifact | Review-loop visual | React + SVG |

---

## 15. Build Phases

### Phase 1 — Foundation and CH04 vertical slice

Deliver:

```txt
- pnpm workspace
- React/Vite studio
- Zod figure spec schema
- design token system
- shared primitive library
- Framer Motion transition wrappers
- Figure Registry
- Registry-driven domain QA
- Registry-driven Playwright export
- Registry-driven visual snapshots
- CH04 absorption spec
- CH04 deterministic fixture
- CH04 renderer
- CH04 interactive step-through
- CH04 PNG export
- CH04 visual snapshot
```

Acceptance:

```txt
CH04_ABSORPTION_001:
- validates
- passes domain QA
- appears in Registry
- renders in Studio
- step-through works
- exports through Registry-driven Playwright
- visual snapshot passes
```

### Phase 2 — Tier-1 canonical set

Deliver all Tier-1 figures listed above.

Acceptance:

```txt
- all Tier-1 specs validate
- all Tier-1 specs appear in Registry
- all Tier-1 figures pass domain QA
- all Tier-1 renderers smoke-test
- all exportable Tier-1 figures export through Playwright
- all snapshot-enabled Tier-1 figures have visual snapshots
- Tier-1 coverage report generated from Registry
```

### Phase 3 — Chapter expansion

Expand to full chapter inventory.

Target:

```txt
- 120–160 static figures
- 35–55 interactive modules
- 12–18 reusable component/rendering types
- 20–30 assessment-style interactions
```

### Phase 4 — Assessment modules

Build classification and decision-gate modules:

```txt
- absorption vs pause vs acceptance
- level acceptance vs rejection
- trap identification
- catalyst classification
- thesis state classification
- setup A/B/C/no-trade grading
```

### Phase 5 — CH13 capstone

Build full integrated read-stack module only after the lower-layer systems exist.

---

## 16. Verification Commands

```bash
pnpm install
```

```bash
pnpm validate:specs
```

```bash
pnpm test:unit
```

```bash
pnpm test:domain
```

```bash
pnpm test:visual
```

```bash
pnpm export:figures
```

```bash
pnpm qa
```

Full gate:

```bash
pnpm validate:specs && pnpm test:unit && pnpm test:domain && pnpm test:visual && pnpm export:figures
```

---

## 17. Completion Criteria

The architecture is not accepted until this is true:

```txt
- Figure specs are canonical.
- Design tokens govern all semantic styling.
- Shared primitives are used for recurring layouts and interactions.
- Framer Motion is used only through shared transition primitives.
- Figure Registry drives domain QA.
- Figure Registry drives Playwright export.
- Figure Registry drives visual regression.
- Figure Registry drives chapter/tier coverage reports.
- No duplicate figure lists exist.
- CH08 Expected Rotation-Size Bands uses React + SVG/D3.
- Vega-Lite is not part of the production renderer route.
- CH04 absorption vertical slice proves schema → registry → QA → renderer → export → snapshot.
```

---

## 18. Immediate Implementation Order

```txt
1. Create pnpm workspace.
2. Create Zod schema and enums.
3. Create design token package.
4. Create shared primitive package.
5. Add Framer Motion transition primitives.
6. Create CH04 absorption spec.
7. Create CH04 deterministic fixture.
8. Build Figure Registry from validated specs.
9. Add Registry filters for export, QA, snapshots, tier, chapter.
10. Add CH04 domain QA rules.
11. Build FigureRenderer and rendererMap.
12. Build FigureFrame, PanelGrid, EvidenceRail, ForbiddenMisreadRail.
13. Build PricePathPanel.
14. Build FootprintGrid.
15. Build DOMLadder.
16. Build DeltaCurve.
17. Build FootprintDomDeltaRenderer.
18. Build Studio gallery/detail/export routes.
19. Add Registry-driven Playwright export.
20. Add Registry-driven visual snapshot.
21. Generate QA/export/coverage reports from Registry.
22. Run full gate.
```
