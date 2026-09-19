# ReviewTayo Library-to-Exam Journey Walkthrough

## Result

ReviewTayo now presents itself as a library of Philippine exam reviewers before asking a learner to enter an exam-specific workspace. The homepage leads with exam selection, clearly separates the live CSE reviewer from planned exams, and keeps sign-in optional. Once a learner enters CSE, the header changes to an exam-scoped navigation model with the active exam/track, an `All exams` return path, and focused Overview, Practice, Mock exams, Guides, and Exam info destinations.

The dashboard now uses generic exam configuration for its default track and either guides a new learner through workspace creation or states the active workspace context. Shared exam-engine behavior remains unchanged and exam-neutral.

## Design evidence

- Completed the Design Arc workflow in fully automatic mode with Guidelines + Mobbin benchmarks.
- Inspected Coursera's web onboarding and learning-area separation as a structural benchmark: public context remains legible while personal learning work has a distinct destination.
- Applied current W3C guidance for consistent navigation, descriptive headings/labels, visible focus, and touch-target sizing.
- Created and visually validated the proposal board at `.codex/design-arc/reviews/reviewtayo-library-journey-2026-09-20/proposal-board.svg`.
- The first proposal render had two text-containment issues; one correction round resolved both. Final Design Arc verdict: **meets direction**.

## What changed

- Reworked the public header around `Exams`, `How it works`, and `Study resources`.
- Added a distinct exam-workspace header with active exam/track context and scoped navigation.
- Added a skip link and verified Escape closes the desktop More menu and restores focus.
- Reframed the homepage hero around choosing an exam and replaced the dense index with live/planned library cards.
- Kept planned reviewers truthful and non-actionable while exposing the one live reviewer clearly.
- Generalized dashboard onboarding and guest dashboard copy so the shared experience does not imply CSE is the whole platform.
- Updated unit and browser tests to cover the revised labels, routing, onboarding, keyboard flow, mobile menu, and responsive hierarchy.

## Verification

- `npm run verify`: **PASS, exit code 0**
  - Typecheck: passed.
  - ESLint: passed.
  - Architecture guard: passed; no exam-identity branching in engine code.
  - Vitest: **58 files / 340 tests passed**.
  - Next.js production build: passed; **79 routes generated**.
- `npm run test:e2e`: **PASS, 68/68 Chromium tests**.
- Manual browser walkthrough: **PASS**.
  - Homepage rendered meaningful content with no framework error overlay or console errors.
  - `Open reviewer` navigated from the library to `/cse` and replaced platform navigation with the six-item exam context.
  - Dashboard rendered an active exam workspace and actionable next step without errors.
  - Mobile homepage at a 390×844 override reported `scrollWidth === clientWidth` (375 CSS px in the embedded browser), showed the library before the CSE card, and exposed the platform mobile menu.
  - Temporary viewport override was reset after inspection.

## Definition of Done

- [x] `npm run verify` passes (typecheck, lint, architecture, unit/integration tests, build)
- [x] New/changed logic has new/updated tests
- [x] E2E/browser checks performed for the user-facing navigation and exam flow
- [x] No secrets committed; no new environment variables added
- [x] No exam-question content copied or paraphrased from an external source
- [x] Engine code has no exam-specific branching
- [x] `implementation_plan.md` and `walkthrough.md` exist for this task
