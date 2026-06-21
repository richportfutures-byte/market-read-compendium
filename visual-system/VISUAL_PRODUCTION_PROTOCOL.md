# Visual Production Protocol

Market-Read Compendium visual-aid corpus. Governing standard for premium textbook-plate instructional figures.

Status: governing and authoritative. This file is the single source of truth for figure production. It supersedes and replaces all prior visual-aid production guidance, prior chat-authored protocols, prior art-direction drafts, prior renderer-review practices, and any prior informal figure approvals.

Version: 2.1.0 clean-slate adoption

Amendment rule: complete in scope, not frozen. Changes are versioned amendments with a dated changelog entry, never silent edits, never wholesale rewrites. Any change to the Visual Language Specification, the figure-class grammars, the definition of done, or the role sign-off model requires recorded Design Authority approval.

Writing convention: no em dashes. Use commas, periods, colons, semicolons, parentheses, or bullets.

## 1. Prime directive

Produce premium textbook-plate instructional figures that can be inserted into the finished Market-Read Compendium as-is and serve as calibration exemplars for future figures of the same class.

The objective is not to generate attractive diagrams. The objective is to produce a durable visual judgment-training system that teaches junior traders to see market-read distinctions through evidence, sequence, participant behavior, and decision consequence.

The defining quality law:

A figure is successful only when the main visual teaches the intended professional distinction before the rail, caption, checklist, or prose is read.

The body carries the read. Rails verify. Rails never substitute.

## 2. Clean-slate state of record

This protocol starts visual production from a clean slate.

No previously rendered plate, prior review outcome, prior approval label, prior checklist result, or prior coding-agent report is recognized as an approved premium plate under this protocol.

Existing specs, renderers, assets, review packets, and generated images may be inspected as legacy inputs, but they do not carry approval authority. They may be reused only if they pass the full production sequence defined here.

As of this protocol:

- Approved premium plates: zero.

- Approved class grammars: zero.

- Approved master plates: zero.

- Approved figure-class precedents: zero.

- Prior renderer outputs: legacy candidates only.

- Prior visual approvals: void for governing purposes.

- Semantic specs: valid only to the extent confirmed by the current repository gate and human review.

- Renderer code: valid only to the extent it conforms to this protocol after adoption.

A spec authored to gold, a renderer-backed PNG, a checklist with no failures, a gate-green run, a candidate image, a prior approval phrase, and a premium plate approved under this protocol are different states.

Only the last state counts as approved visual production.

## 3. Governing principles

- A figure exists to change what a reader does. Every figure is justified by a teaching objective and a decision consequence, or it does not exist.

- Conceptual truth is non-negotiable and outranks aesthetics. A beautiful figure that teaches the wrong lesson is the highest-severity defect.

- Encoding integrity outranks style. How data maps to ink is governed before how the ink looks.

- The body carries the teaching burden. If the main visual does not teach the distinction before the rail is read, the figure fails.

- Corpus consistency is a first-class requirement. One visual language across all figures, enforced, not hoped for.

- Art direction precedes renderer code. Composition is approved before deterministic rendering is written.

- Renderer agents implement approved targets. They do not invent the target.

- Checklists block approval. They do not grant approval.

- Automated gates validate known constraints. They do not judge premium instructional quality.

- Human authority is final. Agents and models are subordinate executors. No automated step ships a figure alone.

- Approval is asset-specific, version-specific, and review-specific. No approval transfers silently to another figure, variant, renderer, or regenerated asset.

- If the figure requires explanation to excuse a weak visual, the figure fails.

## 4. Governing production order

The governing sequence is:

- Domain teaching objective, the semantic spec.

- Figure-class art direction, the class grammar.

- Human-approved composition target, the sketch or master plate.

- Renderer implementation, deterministic SVG.

- Automated semantic and integrity QA, the gate.

- Rasterized PNG review.

- Human premium-exemplar approval.

- Commit and lock as precedent.

Any process that skips figure-class art direction and human-approved composition, then asks a coding agent to invent final composition from prose, is lower quality and slower.

Coding agents discover design through failure: label collisions, weak hierarchy, rail dependence, generic scaffolds, inconsistent grammar, and merely serviceable layouts. They are implementation agents, not art directors.

## 5. Roles and decision rights

### 5.1 Domain Owner

The Domain Owner owns:

- market-read correctness

- professional interpretation

- teaching objective

- junior-error diagnosis

- decision consequence

- forbidden misread enforcement

- final conceptual truth

- precedent decisions

The Domain Owner has sole sign-off on conceptual truth.

This role cannot be delegated to a model.

### 5.2 Visual Art Director

The Visual Art Director owns:

- composition quality

- layout hierarchy

- figure-class grammar

- label architecture

- visual consistency

- textbook-plate polish

- density control

- visual-language conformance

- master-plate approval

The Visual Art Director may be a human designer, a Figma or Illustrator workflow, a hand-authored SVG workflow, or a tightly constrained visual-design model operating under human review.

The Visual Art Director is never a blind coding agent.

The Visual Art Director has sole sign-off on composition quality and visual-language conformance.

### 5.3 Renderer Engineer or Coding Agent

The Renderer Engineer owns:

- deterministic SVG implementation

- evidence-id stamping

- design-token usage

- fixture mapping

- export readiness

- gate compliance

- PNG generation

- targeted renderer-only correction

- source-control hygiene within assigned scope

The Renderer Engineer does not own:

- spec authoring

- spec promotion

- class grammar

- composition invention

- visual approval

- domain approval

- QA weakening

- architecture changes

- qa.visual_snapshot

- generated artifact commitment unless explicitly instructed

### 5.4 QA System

The QA System owns:

- spec validation

- domain-rule validation

- render-evidence validation

- integrity checks

- deterministic artifact generation

- repeatable failure detection

The QA System is advisory to the human sign-offs. It is never a substitute.

### 5.5 Required sign-offs

A figure ships only when both sign-offs are recorded against a specific spec version and asset version:

- Domain Owner sign-off.

- Visual Art Director sign-off.

The two sign-offs are distinct gates, even when one person holds both roles.

## 6. Layer architecture

### 6.1 Layer 1, Semantic Figure Spec

Purpose: define what the figure must teach.

The semantic spec owns:

- figure id

- chapter

- concept

- teaching objective

- junior error

- professional read

- decision consequence

- required evidence with stable ids

- forbidden misreads

- figure type

- panels

- sequence

- fixture

- outputs

- placement

- export dimensions

- QA rule family

- acceptance criteria

The spec does not own composition.

Specs are human-authored. No agent creates, edits, or promotes a spec unless explicitly authorized for that exact task.

### 6.2 Layer 2, Figure-Class Design Grammar

Purpose: define how a class of figures looks and teaches.

The class grammar inherits the Visual Language Specification and adds class-specific composition rules.

A class grammar owns:

- canonical composition

- allowed panel count

- layout regions

- mark vocabulary for the class

- callout placement

- label-lane strategy

- evidence encoding

- density ceiling

- typography roles

- color roles

- rail behavior

- acceptable layout examples

- unacceptable layout examples

No broad implementation begins for a figure class until its grammar exists.

### 6.3 Layer 3, Renderer Implementation

Purpose: convert an approved spec plus an approved class grammar plus an approved composition target into deterministic SVG.

The renderer implements a target. It does not invent the target.

The renderer may choose exact coordinates only inside the approved grammar and approved composition.

### 6.4 Layer 4, Human Review and Approval

Purpose: decide whether the rendered PNG is a premium textbook-plate exemplar.

Human review is figure-specific. No batch approvals.

Human review evaluates:

- conceptual truth

- main-body teaching power

- evidence visibility

- encoding integrity

- composition hierarchy

- label clarity

- density control

- visual-language consistency

- accessibility

- print and screen fidelity

- finished-book readiness

- precedent quality for future figures

## 7. Visual Language Specification

This section is locked as the shared spine. Every class grammar inherits it. Producers conform. They do not reinterpret.

Rules marked [ENFORCED] are either currently enforced by automation or must be added to the gate before full-scale production. Until automation exists, the rule remains binding and must be human-reviewed, but it must not be falsely reported as machine-enforced.

### 7.1 Canvas, grid, and output

Textbook plates are print artifacts first and screen artifacts second. Print fidelity is mandatory.

Targets:

- Screen: SVG with fixed viewBox.

- Print: vector PDF primary.

- Fallback: 300 dpi PNG.

Standard widths:

- Full-column: 1280 px viewBox.

- Half-column: 640 px viewBox.

- Hero figures may exceed standard width only with Design Authority approval.

Grid:

- 8 px spacing unit governs all internal spacing. [ENFORCED]

- Spacing must be a multiple of 8 except hairline strokes. [ENFORCED]

- Figures fill named layout regions defined by the class grammar.

- Producers do not invent layout regions locally.

### 7.2 Typography

Type families:

- Humanist sans for labels and prose. Default: Inter.

- Monospace for prices, deltas, quantities, and tabular numerals. Default: JetBrains Mono.

Rules:

- Numeric data uses the mono family. [ENFORCED]

- Type roles and sizes are maintained in the token file. [ENFORCED]

- Producers reference roles, never raw sizes. [ENFORCED]

- No font size outside the approved scale. [ENFORCED]

- Direct labeling is preferred over legends wherever a mark can carry its own label.

Required type roles:

- figure title

- figure subtitle

- panel title

- axis label

- tick label

- data label

- annotation label

- callout label

- evidence rail heading

- evidence rail item

- caption

- footer metadata

### 7.3 Color and semantics

Color is semantic, never decorative.

Required token roles:

- bullish or up

- bearish or down

- neutral

- evidence accent

- forbidden or error

- structural line

- session region

- surface tier 1

- surface tier 2

- surface tier 3

- muted text

- primary text

- secondary text

- grid line

- rail background

- callout background

Rules:

- Token-only color. No hardcoded hex in renderers. [ENFORCED]

- Color is never the sole carrier of meaning.

- State distinctions must also encode by position, shape, icon, pattern, or label.

- Up/down, accept/reject, valid/invalid, allowed/forbidden, and primary/alternate distinctions must survive grayscale.

- Palette must pass WCAG AA contrast for text and essential marks. [ENFORCED]

- Palette must pass colorblind-safe checks for deuteranopia and protanopia. [ENFORCED]

- Default direction: cool versus warm, such as teal versus rust, not pure red versus green.

- Forbidden or error red requires redundant icon, label, or shape.

### 7.4 Canonical mark vocabulary

One canonical encoding per data family. Producers apply it. They do not choose per figure.

#### Price path

- Step or line path.

- Time moves left to right.

- Price up is up.

- Session gaps or discontinuities must be visually marked.

#### Market profile

- Horizontal histogram at price.

- POC explicitly marked.

- Value area explicitly marked.

- Single prints visually distinct.

- Balanced and trending profiles must share scale when compared.

#### Volume profile

- Horizontal volume-at-price histogram.

- HVN and LVN regions labeled directly.

- POC and value area must not be implied by color alone.

#### Footprint

- Bid x ask grid.

- Cell shows traded volume.

- Imbalance shown by diverging emphasis plus label.

- Absorption requires a visible failure to progress, not just high volume.

#### DOM

- Resting size by price level.

- Refresh, pull, and stack are shown as explicit state changes.

- DOM visuals must not imply execution automation.

#### Delta

- Signed series aligned beneath price on shared x-axis.

- Positive and negative states use redundant shape or baseline position.

- Divergence must show both price and delta references.

#### Statistical band

- Shaded interval around a stated central reference.

- Band definition must be named.

- The central reference must be visible.

#### Matrix

- 2D grid.

- Both axes labeled.

- Each cell carries a stated read or decision.

- Color is secondary to label or icon.

#### Timeline

- Horizontal time track.

- Session boundaries explicit.

- Labeled events.

- Handoff, transition, or overlap regions shown as spans, not just points.

#### Pipeline, lifecycle, or gate

- Directed node-and-edge flow.

- One reading direction only.

- No ambiguous branching unless the branch logic is labeled.

### 7.5 Shared-scale rule

Compared panels must share identical scales unless the figure explicitly marks the scale difference and the spec permits it. [ENFORCED where automatable]

A comparison figure that uses different scales without explicit marking fails.

### 7.6 Annotation grammar

Fixed annotation types:

- Arrow: points to a specific object or transition.

- Bracket: spans a range or zone.

- Callout: labeled box with leader.

- Label: inline name attached to a mark.

- Zone: shaded region with semantic meaning.

- Rail: structured evidence or forbidden-misread list.

Rules:

- Each annotation type has one styling system.

- Every figure carries an evidence rail.

- Figures with forbidden misreads carry a forbidden rail.

- Rail placement is fixed by the class grammar.

- Annotations state observation and consequence.

- Annotations do not introduce unstated assumptions.

- Callouts must not crowd, overlap, stack, or fight for a lane.

- Leaders must point clearly and must not cross unnecessarily.

### 7.7 Encoding integrity

Rules:

- Lie factor near 1.

- Effect size in the figure equals effect size in the data.

- Axes are honest.

- A truncated or non-zero baseline is allowed only with an explicit axis-break mark and a spec flag. [ENFORCED]

- Quantitative comparison uses position and length first.

- Area, angle, and color intensity are secondary or qualitative.

- No chartjunk.

- No redundant gridlines.

- No ornament that competes with evidence.

- Every synthetic renderer output is reproducible from its declared deterministic fixture.

- No synthetic figure shows data not in its fixture.

#### Source-evidence integrity

Real-market evidence is allowed and should be preferred for canonical instructional visuals when it materially improves instructional fidelity and can be properly sourced.

Real-market evidence may include market data, screenshots, platform captures, historical market artifacts, exported data, replay captures, and manually logged market evidence. It may be captured, cropped, normalized, redrawn, tokenized, restyled, annotated, and incorporated into the visual system, but the underlying market mechanics must not be falsified.

The visual source model separates:

- source class, where the evidence or reference came from

- production method, how the figure is produced

- value status, the truth status and transformation state of rendered market values

Source classes:

- REAL_MARKET_CAPTURE: platform-derived visual artifacts such as screenshots, replay captures, chart captures, heatmaps, DOM captures, footprint captures, TPO/profile captures, or screen-recording frames.

- REAL_DATA_EXPORT: exported real market data such as tick data, footprint data, TPO/profile exports, DOM/depth exports, CSV files, vendor files, broker exports, or historical market data files.

- MANUAL_MARKET_LOG: manually recorded observations of real market events. These must be labeled as manually logged and must not be presented as raw feed data.

- MANUSCRIPT_REFERENCE: prose or source-text references from the handbook, chapter manuscript, or internal visual plan. These are not claims of historical market data.

- SYNTHETIC_TEACHING_MODEL: invented, deterministic, manually constructed, or fixture-based data used for renderer development, tests, prototyping, QA edge cases, controlled concept drills, failure examples, or explicitly labeled conceptual teaching.

Production methods:

- RAW_CAPTURE

- ANNOTATED_CAPTURE

- DATA_DERIVED_RECONSTRUCTION

- SYNTHETIC_RENDERER_OUTPUT

Value status values:

- raw

- aggregated

- redrawn

- normalized

- anonymized

- synthetic

Legacy string source_refs are manuscript/source-text references by default. They remain valid as MANUSCRIPT_REFERENCE records and are not synthetic market evidence or real-market provenance. Structured real-market source records belong in source_evidence and require provenance.

When a figure is represented as real-market-derived, the underlying market mechanics must remain faithful to the source event. Price sequence, time order, traded volume, bid/ask volume, delta, TPO count, profile distribution, volume-at-price distribution, DOM state, passive reloads, passive pulls, liquidity pockets, liquidity sweeps, session context, intermarket context, and event outcome must not be invented, cosmetically changed, rearranged, exaggerated, smoothed, deleted, or cleaned up in a way that changes the event.

Allowed transformations:

- crop the event window

- redact account, broker, user-identifying, or private information

- remove platform clutter, redundant UI, grid noise, irrelevant panels, and watermarks where practically appropriate

- normalize typography, color, spacing, stroke weight, panel structure, and hierarchy into the design-token system

- rescale or reframe charts for readability

- convert exported data into tokenized renderings only through rendering paths allowed by this repository

- annotate with evidence rails, forbidden-misread rails, labels, callouts, arrows, state badges, highlights, and decision gates

- simplify non-essential visual noise when simplification does not alter market-mechanical truth

- use screenshots and platform captures as source evidence when provenance is recorded

Forbidden transformations:

- inventing or changing price action, traded volume, bid/ask volume, delta, TPO/profile structure, DOM liquidity, or event outcome

- inventing passive reloads, passive pulls, iceberg behavior, liquidity pockets, stop pools, or forced-exit cascades without evidence or explicit conceptual labeling

- presenting synthetic, reconstructed, or manually drawn data as historical fact

- using screenshots as decorative proof without source metadata

- weakening domain QA to make cleaner-looking visuals pass

No runtime live-market fetching is allowed inside renderers, export, QA, visual snapshots, or handbook figure generation. Curated historical real-market evidence may be referenced, transformed, reconstructed, or rendered only through declared specs, provenance, and controlled source artifacts.

Deterministic synthetic fixtures remain valid for tests, renderer development, layout prototyping, domain-QA edge cases, visual regression, and explicitly labeled conceptual teaching. They are not automatically the preferred canonical publication source when real-market-derived evidence would materially improve instructional fidelity and can be properly sourced. Synthetic fixtures must not be represented as historical market evidence.

### 7.8 Density and clutter

Each class grammar sets a density ceiling.

Exceeding the density ceiling is a stop condition, not a layout problem to crowd through.

Rules:

- No overlapping labels.

- No stacked badges.

- No crowded badges.

- No labels fighting for the same visual lane.

- No rail text clipping.

- No callout knots.

- No leader-line tangles.

- No visual region where the reader must untangle sequence by effort rather than read it by design.

Label and badge clarity is human-judged, with automated overlap detection added where feasible.

## 8. Figure-class grammars and required artifacts

Each major figure type must have an approved grammar before broad implementation.

Producing a figure means filling the grammar, not designing from scratch.

Bespoke layout is allowed only for Hero figures and requires Design Authority approval.

### 8.1 Required figure-class grammars

The twelve required figure classes are:

- Market profile comparison.

- Trap storyboard or branching sequence.

- Session handoff timeline.

- Absorption, footprint, DOM, and delta microstructure.

- Acceptance versus rejection comparison.

- Momentum versus drift comparison.

- Volatility regime map.

- Intermarket confirmation matrix.

- Catalyst transmission chain.

- Trade-state lifecycle.

- Setup quality gate.

- Read-stack flow.

### 8.2 Required class grammar contents

Each grammar defines:

- teaching purpose

- canonical composition

- allowed panel count

- layout regions

- evidence zones

- callout placement rules

- label-lane strategy

- evidence-encoding rules

- density ceiling

- semantic color roles

- typography roles

- side-rail structure

- footer and caption structure

- acceptable layout examples

- unacceptable layout examples

- renderer implementation notes

- stop conditions specific to the class

### 8.3 Committed artifacts per class

These artifacts are governing source-of-truth infrastructure, not bookkeeping.

Path pattern:

design-system/figure-classes/<figure_type>/design-brief.md
design-system/figure-classes/<figure_type>/approved-master-plate.svg
design-system/figure-classes/<figure_type>/layout-rules.md
design-system/figure-classes/<figure_type>/failure-examples.md

### 8.4 Temporary review packet per figure

These artifacts are temporary and must not be committed unless explicitly re-chartered.

Path pattern:

out/phase-b-review/<figure_id>/premium-exemplar-checklist.md
out/phase-b-review/<figure_id>/review-notes.md
out/png/<figure_id>.png

## 9. Art-direction workflow

This workflow occurs per figure class before renderer code.

### Step 1, Design brief

The design brief answers:

- What market-read distinction does this figure class teach?

- What must the reader see first?

- What evidence must the body encode?

- What participant behavior must be visible?

- What decision consequence must be visible?

- What junior misread must be prevented?

- What belongs in the rail only?

- What is the density ceiling?

- What label architecture prevents clutter?

- What output format must the plate support?

### Step 2, Low-fidelity composition sketch

Acceptable formats:

- Figma frame

- Illustrator frame

- hand-authored SVG

- rough PNG markup

- structured layout diagram

The sketch must resolve:

- panel placement

- main path or shape placement

- evidence zone placement

- label lanes

- branch separation

- session or sequence region placement

- rail placement

- caption placement

- footer placement

- approximate density

### Step 3, Human composition approval

Composition approval must occur before code.

Approval means:

- the teaching sequence is clear

- the body carries the read

- label architecture is viable

- density is acceptable

- branch or comparison logic is visible

- evidence zones are not hidden in rails

- the plate can plausibly become premium after rendering

### Step 4, Renderer implementation

Only after composition approval does the Renderer Engineer implement the deterministic renderer.

### Step 5, PNG review

Generate and inspect the actual PNG.

The renderer is not done until:

- gate is green

- PNG is generated

- PNG is opened

- checklist has no failures

- human review finds no premium-exemplar blockers

- both required sign-offs are recorded

## 10. Exemplar sprint before expansion

Before broad figure-by-figure production, produce approved master plates for the hardest and most reusable classes.

Do not scale to dozens of figures until the first sprint set is strong.

### 10.1 First sprint set

The first sprint set is:

- Comparison grammar, calibrated on acceptance versus rejection and balance versus trend profile.

- Trap storyboard grammar, calibrated on a branching trap sequence.

- Session timeline grammar, calibrated on an Asia, London, and New York handoff.

- Microstructure grammar, calibrated on absorption through footprint, DOM, and delta.

These cover the core grammar most of the corpus reuses:

- comparison plates

- branching storyboards

- session and time handoffs

- dense microstructure panels

### 10.2 Sprint deliverables

For each class in the first sprint set:

- design brief

- approved master plate

- layout rules

- failure examples

- renderer implementation notes

- density ceiling

- class-specific review checklist

- accessibility notes

- output fidelity notes

### 10.3 Sprint exit criteria

The sprint is complete only when:

- all four class grammars exist

- all four master plates are human-approved

- all four grammars inherit the Visual Language Specification

- failure examples are explicit enough to block weak future work

- renderer agents have implementation briefs for each class

- broad figure production can proceed without local layout invention

## 11. Definition of done and premium approval gate

A figure is done only when all five layers pass and both human sign-offs are recorded.

No layer is waived for schedule.

### 11.1 Layer 1, Conceptual truth

Owner: Domain Owner.

Checks:

- every required evidence item is present and correct

- no forbidden misread is implied

- professional read matches the chapter

- decision consequence matches the chapter

- participant behavior is not distorted

- teaching objective is visually fulfilled

- primary check is vision review of the rendered image against the spec

- attribute presence is secondary

### 11.2 Layer 2, Encoding integrity

Checks:

- correct canonical encoding

- honest scale

- lie factor near 1

- shared scales across compared panels

- direct labeling where possible

- no hidden data invention

- data-ink discipline

- no decorative mark competing with meaning

### 11.3 Layer 3, Visual-language and grammar conformance

Owner: Visual Art Director.

Checks:

- token-only color

- approved type scale

- grid conformance

- spacing rhythm

- annotation grammar

- density ceiling

- class-grammar layout

- label lanes

- rail behavior

- visual hierarchy

- finished-plate composition

Automated where possible:

- palette usage

- contrast

- spacing multiples

- font sizes in scale

- token-only color

- label overlap

- viewport dimensions

- export metadata

### 11.4 Layer 4, Accessibility

Checks:

- WCAG AA contrast

- colorblind-safe under deuteranopia

- colorblind-safe under protanopia

- grayscale survivability

- no color-only encoding

- authored alt text

- reduced-motion equivalent for any animated or interactive variant

- static export remains complete without motion

### 11.5 Layer 5, Output fidelity

Checks:

- screen target renders correctly

- print target renders correctly

- vector integrity preserved

- correct dimensions

- safe areas respected

- file naming correct

- asset version metadata present

- spec version recorded

- generator identity recorded if applicable

### 11.6 Premium acceptance checklist

All items must be true:

- Semantic spec valid.

- Domain QA passes.

- Render QA passes.

- Gate green.

- PNG generated.

- PNG opened and reviewed.

- Main body teaches the concept before the rail is read.

- Required evidence materially encoded in the primary visual.

- Rail verifies and does not substitute.

- Labels and badges do not overlap, stack, crowd, or fight for a lane.

- No raw schema ids.

- No debug terms.

- No TODOs.

- No placeholder labels.

- No scaffold language.

- Composition feels intentionally designed.

- Figure is insertable into the finished handbook as-is.

- Figure can calibrate future figures of its class.

- Domain Owner approval explicitly recorded.

- Visual Art Director approval explicitly recorded.

Failure of any item means the figure is not approved.

## 12. Accessibility

Accessibility is part of quality, not a downstream compliance pass.

Rules:

- WCAG AA contrast for all text and essential marks.

- Every state distinction survives deuteranopia.

- Every state distinction survives protanopia.

- Every state distinction survives grayscale.

- Shape, position, label, or pattern must reinforce color.

- Every published figure has authored alt text stating its teaching point.

- Animated or interactive variants require a static reduced-motion equivalent.

- Export is always static and motion-free.

Alt text must state:

- the teaching concept

- the key visual comparison or sequence

- the professional read

- the decision consequence

- the forbidden misread if relevant

## 13. Asset governance and source control

### 13.1 Single source of truth

A registry binds each figure_id to:

- current asset version

- spec version

- class grammar version

- renderer version

- fixture version

- production method

- approval state

- sign-off records

- output paths

- export status

### 13.2 Versioning

Use semantic versions.

A spec change that affects the figure forces:

- new asset version

- re-render

- re-run of the definition of done

- new approval review

A class grammar change that affects the figure forces:

- revalidation against the updated grammar

- possible renderer update

- possible asset version bump

### 13.3 Immutability and provenance

Frozen assets are not edited in place.

Each frozen asset records:

- spec version

- class grammar version

- production method

- renderer identity

- generator identity if generative

- Domain Owner sign-off

- Visual Art Director sign-off

- approval date

- source commit

- export hash if available

No silent regeneration.

Automation proposes. It never overwrites approved assets without explicit human authorization.

### 13.4 Source-control hygiene

Rules:

- one focused commit per approved figure

- one focused commit per approved class grammar

- stage only intended source files

- never stage out/

- never stage generated PNGs unless explicitly required

- never mix figure commits

- never carry approved but uncommitted work into the next figure

- never edit qa.visual_snapshot unless separately authorized as a human metadata update

- run git status --short before and after every commit

- report changed files explicitly

- do not edit generated or stitched files directly when they declare a generated-file header

- treat doctrine-like files with unclear source status as authority-unknown/protected and report them instead of patching them

- do not mass-add generated-file headers during unrelated work

Generated or stitched files created by repository automation must start with this header:

```html
<!-- GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- Source: <relative path to the source file(s)> -->
<!-- Regenerate with: <exact command to rebuild this file> -->
```

Source-of-truth files must not contain the generated-file header. If one does, stop and report the conflict.

## 14. Tooling and agent policy

### 14.1 Model-agnostic policy

Roles and gates are named, not vendors.

Any tool may be used if its output clears the gates.

No tool receives approval authority.

### 14.2 Coding agents

Coding agents may perform:

- renderer implementation

- deterministic SVG generation

- fixture wiring

- evidence stamping

- gate execution

- targeted fixes

- source-control preparation when explicitly instructed

Coding agents may not perform:

- art direction

- spec authoring

- spec promotion

- composition invention

- class grammar invention without human review

- QA weakening

- approval

- architecture changes outside scope

- generated-asset commitment without instruction

### 14.3 Design tools

Use Figma, Illustrator, hand-authored SVG, or structured design diagrams for:

- class art direction

- layout grammar

- label architecture

- composition exploration

- master plates

- failure examples

### 14.4 Vision-in-the-loop requirement

Vision-in-the-loop is mandatory for any generative production.

A generator that cannot see its own rendered output is not the final producer of a figure.

### 14.5 Raster image-generation policy

Raster image-generation models are prohibited for any figure carrying:

- precise text

- prices

- ladders

- axes

- footprints

- DOM levels

- matrices

- data values

- evidence ids

- small labels

- instructional callouts requiring accuracy

Raster image generation is permitted only for purely conceptual illustration with no data or precise text, and only with Design Authority approval.

### 14.6 Safety boundary

No visual production tool may include:

- live broker integration

- order placement

- account access

- fill simulation presented as real

- margin display

- P&L automation

- secret inspection

- secret printing

- secret committing

Manual-only operator authority is preserved unless explicitly re-chartered.

## 15. Required decisions before full production

The following decisions must be fixed before full production. Defaults are provisional until recorded.

### 15.1 Semantic palette

Default:

- up or constructive: teal

- down or aggressive selling: rust

- neutral: slate

- evidence accent: sand

- forbidden or error: red with icon or label

- structural lines: muted blue-gray

- background: dark surface set

Requirements:

- exact hex values recorded in tokens

- WCAG AA contrast

- CVD-safe under deuteranopia and protanopia

- grayscale survivability

- no pure red versus green dependency

### 15.2 Type families and licensing

Default:

- Inter for prose and labels

- JetBrains Mono for prices, deltas, quantities, and tabular numerals

Requirements:

- open licenses confirmed

- font fallbacks defined

- print embedding tested

### 15.3 Print specification and color space

Default:

- vector PDF primary

- 300 dpi PNG fallback

- full-column width

- dark-surface design unless print legibility requires a light variant

Requirements:

- safe area defined

- export dimensions defined

- color profile policy recorded

- handbook insertion test completed

### 15.4 Visual Art Director assignment

Default:

- the trader holds Design Authority unless a dedicated designer is assigned

Required decision:

- confirm whether a dedicated designer handles Hero figures and class master plates

### 15.5 Hero figure set

Default:

- Tier-1 canonical figures

Required decision:

- record the exact list of Hero figures

- identify which may exceed standard width

- identify which require bespoke layout

### 15.6 Generative versus crafted boundary

Default:

- Hero figures are crafted

- template figures are generated from approved class grammar and deterministic renderer

- any generative production requires vision review

Required decision:

- record which figure classes may use generative layout assistance

- record which must remain hand-authored or template-driven

## 16. Stop conditions

Stop and escalate when:

- a figure cannot be made premium without changing the spec

- the canvas is too dense for the required evidence

- the class grammar does not support the figure

- a coding agent starts inventing a new layout system locally

- approval depends on “close enough” language

- approval depends on explaining away the image

- source-control isolation breaks

- generated artifacts are staged

- required evidence is moved into the rail because the body cannot carry it

- a rail becomes the teaching surface

- labels overlap, stack, crowd, or fight for a lane

- visual polish conflicts with conceptual truth

- a renderer needs architecture changes outside the assigned scope

- a checklist says pass but the PNG visually fails

- a spec is insufficient to produce a truthful figure

- the figure cannot survive print export

A stop condition is not a failure of the project. It is a protection against producing weak visual law.

## 17. Immediate plan

### Phase 0, Reset visual approval state

Adopt this protocol as the governing authority.

Reset visual approval state to zero under this protocol.

Prior rendered assets and prior review outcomes are legacy inputs only.

No figure is approved until it passes this protocol.

### Phase 1, Confirm semantic foundation

Run the current repository validation to confirm which semantic specs are valid.

Do not treat this protocol as the live spec count source.

Required outputs:

- valid spec list

- draft spec list

- failing spec list

- figure-type distribution

- required class grammar mapping

- missing fixture or renderer mapping

### Phase 2, Build first sprint class grammars

Create class grammar folders for:

- comparison grammar

- trap storyboard grammar

- session timeline grammar

- microstructure grammar

Each folder must contain:

- design brief

- approved master plate

- layout rules

- failure examples

- renderer implementation notes

- class-specific checklist

### Phase 3, Approve master plates

Human review approves or rejects each master plate.

Approval is class-level visual law.

This is separate from figure-specific approval.

### Phase 4, Align renderers to approved grammar

Renderer agents update deterministic SVG renderers to match approved grammars.

No renderer invents local layout systems.

### Phase 5, Produce first figures under the new protocol

For each figure:

- Confirm spec.

- Confirm class grammar.

- Confirm composition target.

- Implement renderer.

- Run gate.

- Generate PNG.

- Open PNG.

- Complete checklist.

- Record Domain Owner sign-off.

- Record Visual Art Director sign-off.

- Commit focused source files.

- Lock as precedent.

### Phase 6, Scale only after first sprint passes

Do not scale beyond the first sprint until:

- four class grammars are approved

- four master plates are approved

- at least one figure per first sprint class passes the full definition of done

- source-control protocol has been followed without bleed

- approval records are clean

## 18. Non-negotiable standard

This system is not successful because it renders many figures.

It is successful only if the figures form one coherent visual language that makes market-read judgment visible, repeatable, and teachable.

Every plate must be:

- conceptually truthful

- visually intentional

- encoding-honest

- accessible

- print-ready

- corpus-consistent

- strong enough to teach before its rail is read

The production law is:

Art direction first.

Renderer second.

Automated semantic and integrity QA third.

Human PNG approval last.

Anything else is a slower path to weaker figures.
