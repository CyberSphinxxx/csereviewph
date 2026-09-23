# Walkthrough — Exam Hall & Owl Coach themes for the test page

## Update 8 — Dashboard v2: sidebar shell + five new/changed sections

Implemented from `reviewtayo-dashboard-v2.html` (mockup treated as layout/state spec, not markup):

- **Shell**: `src/features/dashboard/AppShell.tsx` — sticky dark-maroon sidebar (brand chrome, both themes), grouped nav (Study: Dashboard/Plan/Practice/Review; Track: History/Achievements; Resources: Notes/Learn), target-exam quick card, daily-goal mini bar, gold due-count badge on Review, Settings pinned at the bottom. Mobile: top brand bar with streak pill, bottom tab bar (Home/Plan/Practice/Review/More), "More" sheet (role=dialog, aria-modal, Escape to close, focus on open, background inert). Every dashboard route renders inside it.
- **New algorithms** (pure, unit-tested): `src/lib/study-plan-generator.ts` (`generateWeeklyPlan`: weakest-subject ranking from real subject readiness, daily-goal distribution, rest days, diagnostic-first fallback for new users; recomputes only when inputs change) and `src/lib/achievement-engine.ts` (badge progress over a stats snapshot; `closestAchievement` banner). Badge list lives in `src/config/achievements.ts` (data, not inline UI).
- **New storage**: `src/lib/storage/notes-service.ts` (pin/search/subject tags, sanitize + cap) wired into backup payload v2, restore, and the reset sweep; v1 backups still import.
- **New/changed pages**: `/dashboard/plan`, `/dashboard/practice` (setup sheet + feature-flagged coming-soon modes from `src/config/practice-modes.ts`), `/dashboard/review` (due/mistakes/bookmarks on the existing Leitner SRS), `/dashboard/achievements`, `/dashboard/notes`, `/dashboard/learn` (reuses guides/articles/FAQ content), `/dashboard/history` (into shell). Settings shell restyled to the brand palette only — fields, persistence, and tests untouched.
- **Single source of truth**: `src/lib/workspace/target-exam.ts` feeds the sidebar card, dashboard hero, and plan; countdown math in `src/lib/study-plan.ts` is Asia/Manila-fixed (`daysUntilManila`, `getManilaTodayString`).
- Tests: 7 new suites (app-shell, new-surfaces, study-plan-generator, achievement-engine, target-exam, practice-modes, notes-service) plus backup-v2 pin. `npm run verify` exit 0: 71 test files, 440 tests, production build.

## Update 7 — old hero panel replaced

User caught the old owl + panel in the /cse hero. `HeroExamLevelSelector` rewritten to the mockup (owl on top with tracked pupils, "Start your review", radio cards, gold CTA; no peeking owl, no countdown pill). Deleted dead code: `PeekingOwl`, `ExamPickerCard`, `HomePageClient` (unused), `peeking-owl.test.tsx`. Unit + e2e assertions updated. Verify exit 0.

## Update 6 — /cse landing redesign (combined mockup A+B+C)

`CSELandingClient.tsx` rebuilt per `reviewtayo-csepage-v2-combined.html`: Command-center hero → Choose-your-battle gradient level cards (tap = site-wide level) → Guided 5-step track → urgency band (single countdown, moon owl) → mode cards mapped to the track → flow guarantees; trust claims, SubtestExplorer, and guides kept below. `HeroExamLevelSelector` gained `showCountdown`/`compareHref` props so /cse hides its duplicate countdown and repoints the compare link. SEO metadata updated (keyword title, OG/Twitter). Owls use `bob tracked` for cursor-following pupils. Verify exit 0; screenshots in `artifacts/cse-live-*.png`.

## Update 2 — Coach rail moved LEFT, owl removed from Exam Hall, paginated map

User feedback after the first implementation: the coach should sit **left of the question** (like the approved mockup image), the **full mock must have zero mascot distraction**, and the Question Map must **paginate** for 300–500 item banks.

Changes:

- **Coach rail on the left (desktop)** — `ExamRunner` grid is now `lg:grid-cols-12` with explicit ordering: coach rail `lg:col-span-3 order-1` (rendered first in DOM), question `lg:col-span-6 order-2`, map aside `lg:col-span-3 order-3` (explicit `order-3` is required — without it the aside sorts ahead of the ordered columns). Coach never renders inside the map aside anymore. Geometry verified by bounding boxes at 1440px: coach x=112, question x=457, map x=1069.
- **No mascot in the Exam Hall** — the decorative owl that perched on the Question Map sidebar was removed entirely (`ReviewTayoOwl` import dropped from `ExamRunner`). Verified: `svg.owl` count is 0 on `/exams/professional/full`.
- **Coach stats line** — `CoachPanel` gained `answeredCount`/`correctCount`/`total` props rendering `Answered X/Y — Correct Z` under the streak chip (matches the mockup's counters); the idle bubble copy no longer embeds these numbers.
- **Paginated Question Map (`MAP_PAGE_SIZE = 50`, exported for tests)** — both the persistent desktop sidebar and the modal drawer render one page of 50 numbers. A `useEffect` keeps the visible page synced to `session.currentIndex` so Next/Prev/jumps always land on the right page; manual paging via Prev/Next pager buttons (rendered only when `totalQuestions > 50`; 170-item full mock → 4 pages). Small banks (≤50) render exactly as before — no pager, no max-height scroll.
- Tests: +3 runner tests (rail-left DOM order + stats counters, zero owls in `full` + no pager on small banks, 120-item bank paginates 1/3→2/3 and jumps correctly). Suite is now 62 files / 364 tests.

## Original change

## What changed

The exam runner now has two presentations of one flow, chosen by `rules.mode` through a pure view-layer helper (no engine branching):

- **Exam Hall** (`medium`, `full`) — Concept A from the approved mockup: paper/blush canvas, brand-palette card and letter keys, Bricolage display heading, gold flag accents, the owl perched quietly on the Question Map. Calm, graded-assessment chrome; answers stay hidden until submit.
- **Owl Coach** (`quick`, `practice`, `bookmarks`, `mistakes`) — Concept C: the same hall chrome plus the owl companion panel (desktop sidebar; compact bar on mobile). In `practice` (instant feedback) the owl reacts per answer — happy/oops mood, speech bubble pointing to the rationale panel, streak counter with Taglish quips, confetti burst on correct answers. In `quick` the coach is present but stays calm: answers are not revealed before submission, so the owl never reacts — it is still a timed assessment.

Files:

- `src/features/practice/examTheme.ts` (new) — `getExamTheme(mode)` mapping.
- `src/features/practice/coach.ts` (new) — `nextStreak`, deterministic `getCoachQuip`.
- `src/components/practice/CoachPanel.tsx` (new) — presentational owl companion, `panel`/`compact` variants.
- `src/app/globals.css` — appended `.exam-hall-bg`, `.exam-coach-bg`, `.exam-card-shadow`, `.timer-warn-pulse`, `.conf-anchor`; no existing rules modified.
- `src/features/practice/TestModeBar.tsx` — optional `theme` prop; re-skinned to brand palette; all texts, ids (`#exam-timer`) and behavior preserved.
- `src/features/practice/ExamRunner.tsx` — theme wiring, coach state (streak/mood/bubble/confetti), CoachPanel insertion (desktop + mobile), re-skinned card/choices/tools/map/modals with every selector text, testid and id preserved.
- `tests/e2e/exam-flow.spec.ts` — only the four hardcoded screenshot paths pointing at another machine (`C:/Users/USER-PC/.gemini/...`) were repointed to `artifacts/`; no assertions changed.
- `implementation_plan.md`, `PROGRESS.md` — updated.

Deliberately untouched: `ResultsView.tsx` (already on brand tokens; every e2e-pinned text preserved), the exam engine, timers, scoring, storage, and all question content.

## Verification (actual results)

1. `npm run verify`: **PASS, exit code 0** — typecheck 0 errors; lint clean; architecture guard PASS (no exam-specific engine branches); Vitest 62 files / 361 tests all passing (was 60/354; +2 files, +7 tests); production build succeeded.
2. New/updated tests:
   - `tests/unit/practice/examTheme.test.ts` — coach modes vs hall modes mapping.
   - `tests/unit/practice/coach.test.ts` — streak increment/reset, deterministic quips.
   - `tests/unit/practice/ExamRunner.test.tsx` — added: coach panel + streak reactions in practice mode; coach chrome present but calm in quick mode; no coach panel in medium mode; instant-feedback/rationale and "Selected" behaviors unchanged.
3. `npx playwright test tests/e2e/exam-flow.spec.ts`: **10 passed / 2 failed**. The 2 failures are pre-existing homepage copy assertions (`/Philippine exam preparation/i`, old hero expectations in `page.tsx`), unrelated to this change — `git status` confirms `src/app/page.tsx` untouched; they fail identically before this change.
4. Browser check (dev server, logged above in this thread):
   - `/exams/professional/quick` — coach chrome (compact owl bar, streak chip), no answer reveal on selection, timer live, cookie-consent gate intact.
   - `/practice/top-pro-vocab` — wrong answer: owl `oops`, rationale panel shown, streak reset; correct answer: owl `happy`, streak "Streak ×1 🔥". (Confetti suppressed only because the check environment has OS reduced-motion on — the guard is intentional.)
   - `/exams/professional/full` — Exam Hall: no coach panels, no owl mascots at all, continuous 3:10:00 timer for 170 items (single-timer constraint intact), paginated map drawer.
5. Accessibility preserved: font size / high contrast / reduce motion toggles, keyboard shortcuts (A–E, F, arrows), haptics, `prefers-reduced-motion` guard on confetti.

## Update 3 (coach UX pass: bubble rationale, single-column header, review-gate split)

- **Header utility bar fixed**: the kbd hint + Flag/Scratchpad/Map/Display/Report row previously sat beside the subtest chips in one cramped flex row — in the coach layout's narrower card the tools wrapped badly and the kbd hint text overlapped the subject chip. The bar is now two stacked rows (chips row, tools row, both `flex-wrap`), and the kbd hint is a bordered inline-flex badge that hides below `md`. Verified at 1270px: all four tool buttons on one row, no horizontal overflow.
- **Owl speaks the full rationale**: the separate "Educational Concept & Rationale" card below the question is removed in coach practice mode. `coachFeedback` now carries the complete explanation in the owl's speech bubble (quip title + explanation body), exactly like the reference mockup. The compact mobile bar shows only the quip (title) to stay scannable. No duplicated rationale text in the DOM.
- **Review Before Submission is now assessment-only**: new `usesReviewConfirmation` flag (`!isCoach || rules.mode === "quick"`). Revealed-answer coach practice skips the confirmation entirely — the final-question CTA becomes "Submit Test" and submits directly; timed assessments (quick, medium, full) keep the modal. All three submit entry points (keyboard Next, drawer/last-question button, map-card Submit) respect the gate; timer-expiry auto-submit bypasses it by design.
- **Question Map moved under the owl** (coach mode): the map card is shared via `mapCard` and renders inside the left rail below the CoachPanel, so the question column stretches to 9 of 12 grid tracks. Exam Hall keeps the map as its own right aside (`lg:col-span-4` against an 8-track question).
- Tests updated: review-modal test pinned to `full` mode; practice instant-feedback test asserts the rationale lives in the bubble and no card renders; new tests: straight-submit from last practice question (navigates to results, no modal) and review gate kept for full mock. Suite: 42 practice tests passing.
- Verified in browser (production build, port 3000): coach bubble shows quip + full explanation after answering ("Oops — okay lang 'yan!" + Filipino rationale), no rationale card; full mock keeps zero mascots, map right at x=944, review modal on Submit; practice last-question CTA "Submit Test" → straight to `/results/`; header single-row at 1270px with 0px overflow.

## Notes / follow-ups

- Coach quips are stored in `coach.ts` (single bank) — easy to hand-tune later without touching components.
- Concept E (results re-skin) was intentionally deferred: ResultsView already uses brand tokens, and its texts are heavily pinned by e2e; a dedicated pass can add the giant-score hero without touching logic.
