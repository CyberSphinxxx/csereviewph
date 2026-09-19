# Design Arc Review — ReviewTayo Library to Exam Workspace

## Setup

- Evidence: Guidelines + Mobbin benchmarks; source: explicit current request, saved to project preference.
- Approval: Fully automatic; source: explicit current request, saved to project preference.
- Graph assistance: on; source: Design Arc 0.3.0 default.
- Renderer: Codex static board. This is the default local route and avoids an unrequested Stitch connection.

## Objective

Make visitors understand ReviewTayo as a growing library of Philippine examination reviewers, choose an exam naturally, and then work inside a focused exam-specific dashboard and navigation context. Success means the public and exam layers remain distinguishable at a glance, the path is truthful for live versus planned exams, and no shared engine behavior branches on exam identity.

Objective Confirmation: passed automatically because the current request states the outcome and evaluation criteria explicitly.

## Current Journey Audit

- Platform: responsive web, desktop reference at approximately 1867×945; Philippine market.
- Entry: `/` → editorial hero → dense examination table → CSE landing or direct practice/dashboard links.
- Observed friction: the header displays a CSE Professional selector on the public homepage; platform and CSE links share one navigation row; Dashboard has no visible scope; the hero says library while the primary contextual link and later spotlight make the page feel CSE-owned; the table optimizes registry scanning rather than selection.
- Material states inspected in source: public homepage, mobile/desktop header states, exam switcher, no-workspace dashboard, active-workspace dashboard, planned exam rows.
- Inferred risk: each additional exam adds more ambiguity because the same broad navigation labels have different meanings at platform and exam scope.

## Evidence

- Mobbin, Coursera Web onboarding and learning flows: inspected the complete 17-screen onboarding sequence plus the distinct Home, goal-setting, and My Learning flow inventory. Useful precedent: contextual authentication preserves public-page orientation, while learning work moves to a separately named personal destination. Limitation: this supports structure, not ReviewTayo styling, and no motion timings were observable.
- W3C WCAG 2.2 Understanding: consistent navigation, descriptive headings and labels, focus order/visibility, and 24×24 CSS-pixel target sizing constrain the web implementation.
- Product contract: guests must be able to practice immediately; the dashboard emphasizes actionable progress; public/SEO and interactive application pages are distinct; new exams are configuration/content additions.

## Directions

### Recommended — Library → Exam workspace

Public navigation stays stable and platform-level. The homepage leads with a visible exam chooser. A live exam opens an orientation page or creates a workspace; the exam header then shows active exam/track, an All exams return path, and scoped navigation. Benefits: strongest mental model, scalable, truthful status handling. Trade-off: one extra orientation step for first-time visitors. Motion: only a short selector disclosure and page fade; reduced motion removes displacement.

### Alternative — Library → Universal dashboard

Every live selection creates a workspace and lands on one shared dashboard. Benefit: fastest path to practice. Risk: skips official context and makes planned exams awkward; dashboard scope still needs strong labeling.

### Alternative — Single global shell with exam tabs

Keep one navigation shell and add exam tabs/filters. Benefit: least structural change. Risk: horizontal complexity grows with the library and continues to mix platform and exam meaning.

Direction Gate: passed automatically; the recommended direction best satisfies the explicit objective and repository architecture.

## Motion Contracts

### M1 — Exam selector disclosure

- Purpose: reveal available workspaces without losing orientation.
- Trigger: activate current-exam control.
- Start/end: closed button → anchored menu with current item and library action.
- Spatial behavior: opacity plus 4px vertical offset; no scaling.
- Timing/easing: 140ms, cubic-bezier(0.2, 0, 0, 1); Design Arc judgment.
- Interruption: reversible; Escape closes and restores focus.
- Reduced motion: immediate visibility change, no translation.
- Target/source/proof: Web React/CSS, project styles, implementation owner authorized by this task; Playwright keyboard test confirms Escape dismissal and focus restoration.

### M2 — Route/context transition

- Purpose: signal the shift from library to exam workspace without spectacle.
- Trigger: navigate into or out of an exam context.
- Start/end: prior route → new route with persistent brand position and changed context strip.
- Spatial behavior: content opacity only; persistent header does not slide.
- Timing/easing: 160ms, ease-out; Design Arc judgment.
- Interruption: browser navigation resolves to the destination; no queued animation.
- Reduced motion: immediate render.
- Target/source/proof: Web React/CSS, existing page-enter token; Playwright reduced-motion, navigation, and reflow checks passed.

## Visual Proposal

- Board: `proposal-board.svg`
- Viewports represented: desktop 1440×900 and mobile 390×844.
- States: public library, exam selector open, exam overview, active exam dashboard, new-user empty state, planned-exam state, loading, and recoverable error.
- Assets: no raster assets required. Brand mark remains the existing semantic SVG logo; controls and navigation remain HTML.

## Render Validation

Initial render `proposal-board.svg@initial` was inspected at 1600×1300.

| State | Requirement | Observation | Classification | Action |
|---|---|---|---|---|
| Public library | Library identity and one dominant exam choice | Clear hierarchy; live and planned exams remain distinct | match | none |
| Selector open | Current exam, return path, focus recovery note | All elements present and contained | match | runtime proof remains for keyboard behavior |
| Exam dashboard | Strong exam/track scope and actionable next step | Correct structure; greeting approached right edge | repairable drift | reduced heading size |
| New learner | One live exam selection with explanatory copy | Explanatory copy overflowed card | repairable drift | wrapped copy and shifted card/CTA |
| Mobile | Library identity before CSE | Correct order and containment | match | runtime reflow proof remains |
| Supporting states | loading, planned, error/recovery, contextual sign-in | All four represented with truthful actions | match | runtime proof remains |

Correction round 1 changed only the two repairable typography/containment mismatches. The corrected full proposal `proposal-board.svg@correction-1` was reinspected at 1600×1300; all renderer-expressible requirements match and no new drift was introduced.

Motion evaluation: both motions have a concrete orientation/feedback purpose, use the least motion required, define interruptibility and reduced-motion equivalents, and make no benchmark-derived timing claim. Static render cannot prove timing, focus restoration, interruption, performance, or reduced-motion runtime behavior; those remain implementation checks.

Visual verdict: **meets direction**.

Visual Proposal Gate: passed automatically because the corrected proposal meets direction.

## Asset Manifest

| Asset ID | Provenance | Use | Format | Implementation reference | Desktop proof | Mobile proof |
|---|---|---|---|---|---|---|
| platform-logo-existing | existing ReviewTayo repository asset | persistent brand identity | semantic SVG/component | `src/components/ui/Logo.tsx` | proposal inspected | proposal inspected |

Selected design: `platform`. No raster assets, Stitch assets, hybrid assets, or decorative imagery are required.

## Authority

The Design Arc gates authorize this platform proposal. The current task separately authorizes implementation in the repository. Deployment and production release are not authorized by the design review.

## Implementation Verification

- `npm run verify`: passed with 58 test files, 340 tests, architecture guard, and a 79-route production build.
- `npm run test:e2e`: passed 68/68 Chromium scenarios.
- Manual browser proof: homepage and dashboard rendered with no error overlay or console errors; `Open reviewer` navigated to `/cse` and exposed the exam-scoped navigation; mobile reflow had no horizontal overflow.
- Implementation verdict: **conforms to selected direction**.
