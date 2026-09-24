# CSEReviewerPH / ReviewTayo — Current Handoff

Full prior status is archived in `ARCHIVES/progress-history.md`.

**Current status: FIX & IMPROVE ROUND + ACADEMIC SPECIFICATION README OVERHAUL COMPLETE (VERIFY EXIT 0, BROWSER MATRIX PASS)**

## Done

- **Academic README Overhaul (`README.md`)**:
  - Rewrote documentation in rigorous, formal academic publication style with comprehensive theoretical, architectural, psychometric, and operational specifications.
  - Zero emojis across all headings, badges, text, tables, and diagrams.
  - Zero em-dashes (all punctuation formatted with standard hyphens, colons, parentheses, semicolons, and periods).
  - Incorporated 5 native GitHub-flavored Markdown Mermaid diagrams and charts:
    - Multi-Tier System Architecture (Presentation, Edge, App, Engine, and Persistence layers).
    - Examination Finite State Automaton ($M = (S, \Sigma, \delta, s_0, F)$ lifecycle).
    - Entity-Relationship Diagram (Relational PostgreSQL schema with Drizzle ORM).
    - Stratified Question Sampling & Selection Pipeline (Fisher-Yates partition distribution).
    - Offline Resilience & Data Synchronization Sequence (Service Worker, CacheStorage, localStorage optimistic persistence, replay sync).
  - Documented psychometric formulation under Classical Test Theory (CTT), 80.00% benchmark, and absence of formula scoring penalty.
  - Documented statutory frameworks: Republic Act No. 10173 (Data Privacy Act of 2012) and Republic Act No. 6713 (Code of Conduct and Ethical Standards).

- **Phase 1 — Sheet, calendar, scrollbar, owl**:
  - Practice setup sheet + backdrop now render through `createPortal(document.body)`, escaping the `animate-page-enter` containing-block trap that pinned them to the content column. This fixes both the hidden CTA (bottom clipped by the content column) and the black strip left of the backdrop (page background exposed where the backdrop stopped).
  - Sheet gained a real focus trap (Tab cycling among focusable elements), Escape-to-close, inert background, and body scroll lock while open.
  - Study plan calendar now opens on **today's month** (not the exam month) with an outlined **Today** button; prev-navigation still clamps at the current month and manual navigation is not overridden.
  - Main scrollbar: `scrollbar-gutter: stable` on `html` (no layout jump when pages toggle overflow) plus tokened `::-webkit-scrollbar` styling and `scrollbar-color` fallbacks for both themes (light thumb `#d8c6cb`, dark thumb `#4a2a35`).
  - Dashboard hero: owl moved to the hero's **right slot** as a flex item (hidden on small screens), wrapped in a pointer-tilt container (rAF-eased translate + few-degree tilt toward pointer, neutral on leave, reduced-motion respected, single existing `ReviewTayoOwl` reused — no second asset).

- **Phase 2 — One authoritative exam store (workspace)**:
  - `ExamWorkspace` is now the single source of truth for level, track name, target date, and study start. Settings/study writes go through `saveTargetExamSummary`; ExamSubNav reads workspace first (with the demoted `useExamLevel` kept only as a public-page *view hint* — no URL rewriting, no workspace coupling, no third store).
  - HeaderExamSwitcher no longer fabricates a fallback workspace for `/cse` + `/practice` paths.
  - All practice hrefs (`practice-modes.ts`, `exams.ts` routes, DashboardView, StudyPlanView) derive from the active level — no hardcoded `/exams/professional/*` left in feature code. Level switching now actually routes the correct question pool through the runner.
  - Countdown hero shows an explicit "no date set" empty state instead of fabricated defaults; `saveTargetExamSummary` supports clearing the date as a real state; the preferences mirror can no longer resurrect or re-empty a cleared date (ordering: workspace write before mirror; stale `targetExamName` cleared when the track changes).
  - Storage layer no longer fabricates `2027-03-14` when the workspace date is empty.
  - Settings/study verified-date option now uses the canonical `NEXT_UPCOMING_EXAM_DATE` (`2027-03-14`) instead of a stale literal.
  - Dashboard recommendation engine consumes real due mistakes instead of a synthetic sentinel array.

- **Phase 3 — Meaningful strategies**:
  - `generateWeeklyPlan` accepts `studyStartDate` (window start; default today) and `dueReviewCount` drives due-review blocks in balanced/cram templates; weekly plan signature includes hrefs + study window so level/date changes regenerate.
  - Weak-focus with zero history now shows an explicit "not enough data — take a diagnostic" rationale instead of pretending to know a weakest subject.
  - New **"Why this plan"** block in Study Plan states the facts derivable from the generated plan (template, window, daily goal, due reviews, subject focus).
  - **"Plan adjusted"** factual note fires when a regeneration actually changes the plan (signature comparison — no false positives when nothing changed).
  - Study period row: editable **study start date** persisted on the workspace, validated (start ≤ exam date, error shown and stored date unchanged on invalid), threaded into the generator.

- **Regression tests added (all required cases)**:
  - `tests/unit/lib/study-plan-strategies.test.ts` — strategy divergence (different plans per template), zero-history weak-focus fallback, due-review priority, signature sensitivity (href/date/window changes recompute).
  - `tests/unit/dashboard/exam-state-regression.test.tsx` — level propagation (workspace ↔ subnav), date propagation + persistence across reload, cleared-date stays cleared, track-derived name regeneration.
  - `tests/unit/dashboard/practice-sheet.test.tsx` — sheet CTA visibility (portal geometry), dynamic CTA labels ("Start {mode.name}"), focus trap + Escape close.
  - Calendar-initial-month regression pinned in the dashboard suite.

## Verified

- `npm run verify`: **PASS (exit code 0)** — TypeScript 0 errors, ESLint 0 errors, Architecture Guard PASS, Vitest **79 files / 506 tests passing** (was 76/471), Next.js production build clean.
- Browser matrix (dev server, real Chromium): both themes × 1366×768, 1440×900, 1920×1080, 1024×768, 768×1024, 430×932, 390×844.
  - Practice sheet: full-viewport pin, backdrop covers sidebar (black strip gone), CTA fully visible at **every** viewport/height incl. 390×844 and 1366×768 (the original bug scenario).
  - Dark + light dashboard heroes correct; owl in right slot on desktop, hidden on mobile; sidebar target card shows consistent level name + canonical date.
  - Study plan: calendar opens on today's month; weak-focus zero-history message; "Plan adjusted" note fires on real changes; study start date validation rejects start > exam date and persists valid changes.
  - Level switch to Subprofessional: workspace authoritative, dashboard badge + name consistent, plan/runner routes carry subpro pool, no stale "Professional" name after save (verified against all three stores).
  - Scrollbar gutter stable in both themes; themed thumb tokens resolve correctly.
- Custom regex assertion script: 0 emojis and 0 em-dashes detected in `README.md`.

## Blocked

- None.

## Needs Human

- None.

## Next

- Ready for user review.
- Optional future hardening: e2e Playwright pass over the same matrix; extract the target-exam "no date" empty state into a shared component if a third usage appears.
