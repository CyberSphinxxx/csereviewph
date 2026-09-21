# CSEReviewerPH / ReviewTayo — Current Handoff

Full prior status is archived in `ARCHIVES/progress-history.md`.

**Current status: MULTI-EXAM NAVIGATION + COACH BUBBLE RATIONALE + CSE REDESIGN COMPLETE (VERIFY EXIT 0)**

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
