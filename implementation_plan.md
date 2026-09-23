# Implementation Plan — Exam Hall & Owl Coach themes for the test page

## Interpretation

Following the approved mockup (`reviewtayo-testpage-v1.html`), the user picked:

- **Concept A "Exam Hall"** — the landing-page themed, graded assessment chrome — for **long-form exams** (`full`, `medium`: the 170-item / 3h10m Professional mock, 30-item medium test). Calm, formal, no mascot reactions; the owl only watches from the Question Map panel.
- **Concept C "Owl Coach"** — for **quick practice** (`quick`, `practice`): the owl reacts to each answer (happy / oops), the rationale appears in an owl speech-bubble, a streak counter counts consecutive correct answers, with light Taglish encouragement.

`bookmarks`/`mistakes` modes reuse the Coach presentation (low-stakes drill context).

The mode→theme mapping lives in one pure helper so the engine itself never branches on exam type (AGENTS.md §3.2): the engine consumes `rules.mode`; only the *view layer* asks "which chrome?".

## Design Arc Direction

- One exam runner, two presentations, driven by `rules.mode`:
  - **exam-hall**: paper background, maroon primary, blush chips, Bricolage display headings (`.font-display`), gold flags, owl-on-map, `--shadow-card` card elevation. Coach features hidden; instant feedback rationale keeps its neutral "Educational Concept & Rationale" presentation.
  - **exam-coach**: everything above plus: persistent owl companion panel (desktop sidebar above the Question Map; mobile: compact bar between toolbar and card), owl mood reaction per answer (`ReviewTayoOwl mood="happy"|"oops"`), speech bubble with the explanation, streak counter, confetti burst on correct (`globals.css` `.conf-particle` already exists).
- Existing UX is untouched: fonts sizing, high contrast, reduce motion, eliminate/cross-out, flags, scratchpad, report, resume draft, auto-save, continuous timer, auto-submit, keyboard shortcuts, Question Map, review modal.
- All existing unit/e2e selector texts stay byte-identical ("Question 1 of 2", "Educational Concept & Rationale", "Scratchpad & Arithmetic Canvas", `#exam-timer`, `#flag-question-button`, `#next-question-btn`, `#prev-question-btn`, `#confirm-submit-btn`, `data-testid="choice-card-A"`, `span.rounded-lg`, etc.).
- `TestModeBar` and `ExamRunner` are shared; theme arrives as a prop so neither imports the mode mapping itself.

## Implementation

1. `src/features/practice/examTheme.ts` — `ExamTheme = "exam-hall" | "exam-coach"`; `getExamTheme(mode: ExamMode): ExamTheme` (coach for `practice|quick|bookmarks|mistakes`, hall otherwise). Pure, unit-tested.
2. `src/features/practice/coach.ts` — `nextStreak(prev, isCorrect)`, `getCoachQuip(kind, seed)` (deterministic via seed so tests don't flake), Taglish quip banks (correct/oops/idle). Pure, unit-tested.
3. `src/components/practice/CoachPanel.tsx` — presentational owl companion (owl with mood, speech bubble, streak chip). Variant `panel` (desktop) and `compact` (mobile). No state of its own.
4. `globals.css` — append `.exam-hall-bg` / `.exam-coach-bg` gradient/backdrop utilities + `@keyframes` reuse of existing `bob/blink/pop/burst`. No existing rule modified.
5. `TestModeBar.tsx` — add optional `theme?: ExamTheme` prop (default `exam-hall`); keep every text, id and testid; re-skin chrome (blush/paper palette, `.font-display` title, warning pulse kept, exit dialog re-skinned, coach variant adds a compact owl beside the title).
6. `ExamRunner.tsx` — compute `theme = getExamTheme(rules.mode)`; pass to `TestModeBar`; add `coach` derived state (streak, mood, last feedback) updated inside the existing practice-instant-feedback block (and only there); render `CoachPanel` (desktop) + compact (mobile) when theme is coach; owl-mood rationale panel for coach; confetti particles on correct answers; re-skin card/choices/tools/map/modals to the exam-hall palette with zero behavior or selector changes.
7. `ResultsView.tsx` — chrome only: replace slate chrome with paper/blush + brand; keep the emerald-pass / dark-fail banner gradient and **every text and id exactly** ("Estimated Score", "Subtest Performance Breakdown", "Detailed Answer Review", "Educational Concept & Rationale", `#print-scorecard-btn`, etc.).
8. Tests:
   - New `tests/unit/practice/examTheme.test.ts`, `tests/unit/practice/coach.test.ts`.
   - Extend `tests/unit/practice/ExamRunner.test.tsx`: coach-mode renders owl panel; streak increments on correct, resets on wrong; rationale still shown; quick mode stays exam-hall (no coach panel).
9. Docs: `implementation_plan.md` (this file), `walkthrough.md`, `PROGRESS.md`.

## Verification Plan

### Automated
- New unit tests for `examTheme` + `coach` (pure logic, deterministic quips).
- Extended `ExamRunner.test.tsx`: coach/hall rendering, streak behavior, rationale preserved.
- Full `npm run verify` (typecheck → lint → architecture guard → all vitest → build) must exit 0.
- `npm run test:e2e -- tests/e2e/exam-flow.spec.ts` (AGENTS.md requires e2e for exam-flow changes).

### Manual / Browser
- Dev server: `/exams/professional/quick` shows Exam Hall chrome (no owl panel), `/practice/[topic]` shows Owl Coach (owl panel, streak, mood reactions, confetti), `/exams/professional/full` shows Exam Hall with 170-item header.
- Answer correctly → owl happy + confetti; answer wrongly → oops; streak text matches; flag/cross-out/scratchpad/map/submit all still work.

## Constraints

- No engine branching on exam identity; only `rules.mode` → view theme (view-layer helper, unit-tested).
- No new deps; reuse `ReviewTayoOwl`, existing tokens/keyframes, `conf-particle`.
- No question content authored; seed data only.
- No schema changes, no new env vars, no analytics changes.
