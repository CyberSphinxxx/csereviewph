# CSEReviewerPH / ReviewTayo — Current Handoff

Full prior status is archived in `ARCHIVES/progress-history.md`.

**Current status: EXAM GATING + DAILY QUESTIONS PASS COMPLETE (VERIFY EXIT 0)**

## Update 11 (Exam gating, Learn scoping, daily quests, render-purity fix)

- **React setState-during-render fixed at the root**: `PreferencesService.getPreferences()` used to seed-and-save when storage was empty, dispatching `PREFERENCES_CHANGED_EVENT` mid-render (the source of "Cannot update a component (ThemeProvider) while rendering a different component (AppShell)"). `getPreferences()` is now a pure read; the seeding moved to a new `ensureSeeded()` called only from `usePreferences`' mount effect. Regression test asserts a render on empty storage performs no write and dispatches no event. AppShell itself was audited line by line: it is clean, all setters are effect/handler based, and the exam gate is pure derived state (no redirects, no router calls).
- **Phantom "CSE-PPT Professional" default removed — "no exam chosen" is a first-class state**: `getTargetExamSummary()` now returns **null** when no workspace exists instead of fabricating a default; `saveTargetExamSummary()` is a no-op until an exam is chosen; the preferences-to-workspace sync no longer writes a fabricated exam name for exam-less visitors; and the storage migration no longer provisions a CSE workspace from *preferences alone* (only real study history grandfathers; prefs still inform the level once provisioning is justified). Three new/updated suites cover all of it.
- **Shell gate + locked nav**: when no exam is chosen, `AppShell` renders the existing `DashboardOnboardingView` (embedded mode) instead of page content — one conditional render gates every dashboard route against direct URL access, with zero redirect round-trips. Sidebar/tab-bar/More-sheet items show a lock icon, muted styling, and "Choose an exam to unlock" labels (Dashboard stays open as the entry point; Settings stays reachable). The sidebar target card offers "Choose your exam" instead of a fake exam, and the gate screen links undecided users to the public owl finder at `/reviewers`.
- **Exam switching is safe by construction**: notes (`cse_guest_notes`), streak, and preferences are global keys; history/mistakes/bookmarks are workspace-scoped. New `exam-switch-safety.test.ts` pins the guarantee: notes survive switching and switching back, per-workspace counters restore exactly. Achievements re-scope with the active workspace and restore on switch-back (nothing deleted).
- **Single source of truth held**: sidebar card, dashboard hero, plan, Learn, and Settings all read through `getTargetExamSummary()`/workspace state; the AppShell refresh effect now re-runs on workspace change so the card, goal mini, and due badge follow the chosen exam instantly (verified live: unlock-in-place without reload).
- **Learn scoped to the chosen exam + restyled**: data model adds `examIds?: ContentExamId[]` to `Article`/`FAQItem` (missing = legacy CSE, backward compatible; `StudyGuide` already had `examId`). Page filters guides/articles/FAQs by the active workspace exam, shows a "More materials coming soon for <exam>" state per empty section (tested with a LET workspace), and gained the family-palette treatment: maroon/gold/blue section icon chips, card rows with subject/category + read-time chips, and category-colored FAQ pills.
- **Daily quests (new feature)**: pure engine `src/lib/daily-quests.ts` (deterministic, no storage of its own) generates 1-3 quests per day keyed by Asia/Manila date — weakest-subject drill from the same measured-accuracy signal the Study plan ranks by, a "clear due reviews" quest only when the SRS pool is non-empty, and a score-target quest on the weakest below-target subject; cold start gets one fixed "Complete a quick drill". Progress derives from today's attempt details and the same daily-goal counters the ring and the Daily-goal badge read, so the three surfaces cannot disagree. Shared `useDailyQuests()` hook feeds both the Dashboard quest card ("N of M quests · X/goal items today") and the Study plan's today card. Fully exam-gated: no workspace, no quests.
- **Flicker/race hardening**: the shell renders nothing for the first tick before workspace load (no content flash before the gate), and an effect re-syncs the workspace state when the migration provisions a legacy workspace after the hook's first read.
- **Verification**: `npm run verify` exit 0 (76 test files, 471 tests, production build, 0 lint errors). Browser pass on a truly fresh profile: gate with 12 locked items in both themes at desktop and phone widths, workspace list stays empty (nothing fabricated), unlock via the embedded picker flips the whole shell to unlocked in place with the CSE-PPT hero and quest card live, direct URL to `/dashboard/plan` while locked shows the gate, and the console carries no React warnings (the old ThemeProvider warning is gone; only dev-only Fast Refresh notices remain).

## Update 10 (Dashboard fix pass: shell regression, theming, study-plan logic)

- **Shell regression fixed**: `achievements` and `learn` pages rendered bare (no sidebar, no page background). Cause: there is no global shell layout; each page wraps itself in `<AppShell>`, and those two never did. Both now wrap like the other seven. New `tests/unit/dashboard/shell-wiring.test.tsx` asserts every sidebar route imports and renders `<AppShell>` plus theme-aware chrome classes, so a new unwrapped page fails CI.
- **Sidebar theming fixed**: sidebar, mobile top bar, and tab bar were hardcoded dark with zero `dark:` variants. Now light theme gets a cream `#fdf8f6` sidebar with hairline border, maroon text/icons, solid-maroon active pill; dark keeps the `#2c0b14 to #1c060c` gradient chrome. Verified live in both themes on dashboard, plan, achievements, learn.
- **Study plan day states fixed**: past days were unconditionally labeled "Completed"/Done by date comparison. Now the generator emits a neutral "No activity" planning label and the view derives Done strictly from `streak.activeDates` for that calendar date. Fresh account can never show Done (unit-tested with pinned clock).
- **Plan templates added**: `planTemplate` preference (smart | balanced | weak-focus | cram, sanitized, local-first). Smart = existing weakest-first algorithm (unchanged); Balanced = one subject per weekday, mixed review closes the cycle; Weak-focus = lowest subject most days plus one mixed review; Cram = timed assessments leading, full mocks + light review in the final week. All four degrade to the cold-start baseline with no data. Picker lives above "This week" (instant) and in Settings > Study (draft Save/Cancel); both write the same preference.
- **Clean-slate badge hardened**: persisted `cse_guest_srs_last_cleared` date written when a completed session leaves zero due items with a non-empty mistake bank; empty-bank guard prevents earning it with no reviews. Old approximation removed.
- **Small polish**: accuracy tile renders no fill below 1% (empty track, matches subject bars); Review nav item now shows the New pill whenever the due-count badge is absent; sidebar gained the mockup's dimmed "Coming soon" entry deep-linking to a new anchor strip on Practice.
- `npm run verify`: **exit 0** (74 test files, 457 tests, production build). Browser: all 9 routes 200; both themes verified at desktop/tablet/phone; template persistence probed in localStorage; More sheet Escape-close re-verified; zero app console errors (only the pre-existing dev-only `<html className="dark">` hydration warning from ThemeProvider).

## Update 9 (Dashboard v2: sidebar shell + new sections)

- **App shell** (`src/features/dashboard/AppShell.tsx`): persistent dark-maroon sidebar (Study / Track / Resources groups, target-exam quick card via `getTargetExamSummary`, daily-goal mini progress, due-review badge, Settings pinned bottom), mobile bottom tab bar (Home/Plan/Practice/Review/More) with a "More" bottom sheet (Escape closes, focus moves to close button, `inert` background). Brand chrome in both themes; content areas use theme tokens so light/dark keep working.
- **New routes** (all wrapped in AppShell): `/dashboard/plan` (weekly plan from `generateWeeklyPlan`, month calendar, milestones), `/dashboard/practice` (mode catalog from `src/config/practice-modes.ts` with feature-flagged "Coming soon" states + setup sheet), `/dashboard/review` (due today / mistake bank / bookmarks wired to the existing Leitner SRS), `/dashboard/achievements` (14 configurable badges from `src/config/achievements.ts` computed by `src/lib/achievement-engine.ts` over real stats), `/dashboard/notes` (new `NotesService` with pin/search/subject tags, included in backup payload v2 + restore + reset sweep), `/dashboard/learn` (aggregates existing guides/articles/FAQ content), `/dashboard/history` (moved into the shell, same data).
- **Single source of truth** for target exam/date: `src/lib/workspace/target-exam.ts` + `daysUntilManila`/`getManilaTodayString` in `src/lib/study-plan.ts` (Asia/Manila throughout). Note: the mockup's daily-reminder toggle/time is intentionally NOT built; the app has no notification system yet, so there is nothing real to wire it to.
- **Study-plan algorithm**: pure, rule-based `generateWeeklyPlan` ranks days by weakest-subject accuracy, distributes toward the daily goal, recomputes only on input changes, degrades to a diagnostic-first plan with no data. Unit-tested in `tests/unit/lib/study-plan-generator.test.ts`.
- **Practice modes**: `src/config/practice-modes.ts` data catalog — real modes (quick, medium, full, diagnostic, topic, spaced review, mistakes, bookmarks) enabled; flashcards/vocab/formula/custom/sprint/daily marked `comingSoon` behind flags, UI shell only.
- Settings: shell restyled to brand palette only (same fields/data flow). `HomePageClient.tsx` deletion and exam-runner theme work unchanged from Update 7/8.
- Tests: +`app-shell`, `new-surfaces` (learn/achievements/history), `study-plan-generator`, `target-exam`, `practice-modes`, `achievement-engine`, `notes-service` suites; storage backup test pinned to v2. `npm run verify`: **exit 0** (71 test files, 440 tests, production build).

## Update 8 (ReviewTayo Header Unification & Multi-Exam Support)

- **Browse Exams Navigation**:
  - Updated all "Browse exams" links across the site (`CountdownCloseSection.tsx`, `HeroSection.tsx`, `LandingFooter.tsx`) to link to `/reviewers`.
- **Reviewers Background Gradient Harmonization**:
  - Replaced plain white background on `/reviewers` with `.exams-page-gradient` (`#fdf8f6` -> `#fcf0f1` -> `#f9e2e7` soft rose blush into maroon gradient).
- **Single Unified Header**:
  - Unified the header across the entire application into a single canonical component (`src/components/layout/Header.tsx`).
  - Canonical `ReviewTayoOwl` + Georgia serif `reviewtayo` wordmark.
  - Active route pill indicators and integrated `UserNav` / `Sign in` auth button.
- **Single-Exam Support & Dynamic Landing Hero CTAs**:
  - Logged out: Displays *"Choose an exam"* (`/reviewers`) and *"Sign in"* (`AuthModal`).
  - Logged in: Displays *"Go to my dashboard &rarr;"* (`/dashboard`) and *"Browse exams"* (`/reviewers`).
- **Velvety Dark Red Theme**:
  - Configured dark mode variables and styling matching brand design tokens.

## Update 7 (old hero panel removed)

- User flagged the old owl + "Choose your exam level" panel still present in the /cse hero. Root cause: the hero reused `HeroExamLevelSelector`, which still had the side-peeking owl, countdown pill, and old copy.
- `HeroExamLevelSelector` rewritten to the mockup panel: cap-wearing `ReviewTayoOwl bob tracked` centered on top (pupils follow cursor), "Start your review" heading, bold radio cards ("2nd-level positions · includes Analytical Ability"), gold CTA, single reassurance line, compare helper. Peeking owl and countdown pill removed from the panel.
- Dead old-UI code deleted: `PeekingOwl.tsx`, `ExamPickerCard.tsx` (unused), `HomePageClient.tsx` (unused — the live homepage is `ReviewTayoHomeView`), and `peeking-owl.test.tsx`. `showCountdown` prop dropped.
- `ExamCountdown` still exported and used by homepage hero. Unit + e2e tests updated (panel copy, no-duplicate-countdown assertion, owl pupil tracking via `g.pupil`).
- `npm run verify`: **exit 0** (61 files). Browser: 0 peeking owls, new panel heading present, pupils track (translate deltas), homepage title intact, zero console errors.

## Update 6 (/cse landing redesign)

- Rebuilt `CSELandingClient.tsx` per approved mockup `reviewtayo-csepage-v2-combined.html`: Command-center hero → Choose-your-battle level cards (tap sets site-wide level) → Guided 5-step track → dark urgency band (single countdown, "Exam day is coming", owl on golden moon) → preparation modes (one set, labeled to the track) → flow guarantees → trust claims → SubtestExplorer → guides. Deduped: hero selector countdown hidden on /cse (`showCountdown={false}`), compare link repointed to `#choose-your-battle`. No design-notes UI. Zero em dashes.
- `HeroExamLevelSelector` gained optional `showCountdown` / `compareHref` props (defaults preserve homepage behavior).
- SEO: keyword title ("CSE Reviewer Philippines: Free Practice Tests and Mock Exams"), OG/Twitter cards, siteName; JSON-LD kept with breadcrumb.
- Owls: `ReviewTayoOwl bob tracked` on battle cards + urgency moon; pupil cursor-follow verified live (transform deltas on pointermove).
- `npm run verify`: **exit 0** (62 files / 369+ tests, build OK). Dev server stopped before verify per .next-corruption lesson; restarted after.

## Update 5 (coach rail widened)

- **Coach rail widened 3→4 of 12 tracks** (288→384px at 1440) — the explanation bubble went from ~8 wrapped lines to 5 at a 1270px viewport. Question column back to 8 tracks (same as exam hall). Panel internals scaled up: owl 180→190px, bubble padding p-4→p-5, body 13→13.5px. Verify: **exit 0** (62 files / 369 tests).

## Update 4 (coach panel redesign)

- **Owl area redesigned (was cramped)**: `CoachPanel` restructured into three zones — an owl stage (larger 180px owl, mood-reactive radial halo, landing-style dashed rings), a speech bubble with real padding and mood-tinted skin (emerald on correct, rose on miss, blush idle — tails and titles re-tint via `moodSkin`), and a structured footer band (divider, streak chip, tabular stats). Panel height ~479px with breathing room; verified no overlap with the map below.
- **Mobile coach bar moved above the question card** — reactions are now visible without scrolling (was below the card, off-screen after answering).

## Update 3 (user feedback pass)

- **Header fixed**: utility tools (kbd hint, Flag, Scratchpad, Map, Display, Report) no longer cram into the subject-chip row — two stacked flex-wrap rows, kbd hint hides below `md`. No overlap, no overflow at 1270px.
- **Owl delivers the rationale**: in coach practice mode the speech bubble carries the quip + full explanation; the separate "Educational Concept & Rationale" card below the question is gone. Mobile compact bar shows the quip only.
- **Review Before Submission now only for timed assessments** (`usesReviewConfirmation`): coach practice submits straight from the last question ("Submit Test" → results); quick/medium/full keep the confirmation modal.
- **Question Map under the owl** in coach mode — question column stretches to 9/12 tracks. Exam Hall unchanged: map as right aside, zero mascots.

## Update 2 (user feedback pass)

- **Coach rail moved to the LEFT of the question** (matches approved mockup): grid order coach → question → map at desktop; compact coach bar still leads on mobile. Coach no longer renders inside the Question Map aside.
- **Exam Hall has zero mascots** — decorative owl removed from the map sidebar; `svg.owl` count is 0 on `/exams/professional/full`. Full mocks are fully distraction-free.
- **Question Map paginated at 50 items/page** (`MAP_PAGE_SIZE`) in both the desktop sidebar and the modal drawer, synced to the current question; pager only renders above 50 items (170-item mock → 4 pages).
- **Coach stats line** `Answered X/Y — Correct Z` added to `CoachPanel` (matches the mockup's counters).

## Done

- **Exam Runner theme split** (from approved mockup `reviewtayo-testpage-v1.html`):
  - `examTheme.ts` — pure `getExamTheme(mode)`: coach for `practice|quick|bookmarks|mistakes`, exam hall for `medium|full`.
  - Exam Hall: paper/blush brand chrome, Bricolage headings, gold flag accents, owl perched on the Question Map. Used for long-form graded exams.
  - Owl Coach: same chrome plus owl companion panel (desktop sidebar + mobile compact bar). In practice mode the owl reacts (happy/oops), explains via speech bubble pointing to the rationale panel, tracks a streak, fires motion-safe confetti on correct answers. In quick mode the coach is present but calm (answers hidden until submit).
  - `CoachPanel.tsx` (new presentational component), `coach.ts` (streak + deterministic Taglish quips), `globals.css` additions (`.exam-hall-bg`, `.exam-coach-bg`, `.exam-card-shadow`, `.timer-warn-pulse`, `.conf-anchor`).
  - `TestModeBar` gained an optional `theme` prop; all texts/ids/testids preserved.
  - All exam-runner modals, Question Map, tool buttons, resume banner re-skinned; engine, timers, scoring, storage untouched.

## Verified

- `npm run verify`: **PASS (exit code 0)** — typecheck 0 errors, lint clean, architecture guard PASS, Vitest passing (61+ files / 356+ tests passing), production build succeeded.
- Playwright E2E Suites passing.

## Blocked

- None.

## Needs Human

- None.

## Next

- Ready for user review.
