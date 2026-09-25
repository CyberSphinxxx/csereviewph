# CSEReviewerPH / ReviewTayo — Current Handoff

Full prior status is archived in `ARCHIVES/progress-history.md`.

**Current status: STAGE-1 AUDIT-PLAN FIXES COMPLETE (VERIFY EXIT 0 — 519 TESTS, 0 LINT PROBLEMS)**

## External-audit plan round (latest)

Triage + implementation of Stage 0/1 items from the external "Audit and Data-Efficiency Plan" (2026-09-26). All findings were re-verified against this checkout before acting; several were confirmed, one was disproven for this checkout, and the rest are tracked below as open work.

**Fixed this round**
- **A01 — duplicated filler + cross-level mixing**: `prepareExamSession` now scopes the candidate pool to the requested exam level (subject→topic→question join), and the clone-filling loop that repeated questions to fake 170/165/30-item exams is removed. Insufficient banks yield an honest shorter session; the full-exam page shows a clearly labeled "Honest practice: N of TARGET items" subtitle. Professional exams can no longer include clerical items or Subprofessional IDs, and vice versa (pinned by leak tests both directions).
- **A07 — empty-topic unusable exam**: the topic-practice page now shows a friendly "No questions here yet" empty state instead of opening a timed runner at "Item 1 of 0". A `hasStartableQuestions` helper documents the invariant.
- **A03 — fabricated results**: `/results/[attemptId]` no longer manufactures a 70% score from seed data for unknown/evicted attempts. There is an explicit honest "Result not available on this device" state (with history/practice links and a statement that estimates are never substituted). Pinned by new unit tests (`tests/unit/results/results-page.test.tsx`).
- **A08 — fake-successful question reports**: `/api/questions/report` no longer returns 201 after a failed DB write (503 now), no longer accepts a client-supplied `userId` (identity comes only from the Better Auth session), and the modal already renders the error path. Covered by expanded unit tests including a write-failure and a spoofed-userId case.
- **A02/A14 (partial, safe seam)**: `ExamRunner` autosave no longer overwrites an unconfirmed draft (the resume banner gates saving), and timer ticks no longer serialize ~190 KB drafts every second — a save-signature check persists only on genuine answer/flag/navigation changes. Deeper deadline-based recovery remains open work.

**Disproven for this checkout**
- **A05 as stated**: seed questions have no `status` field at all, so enforcing a publication gate today would blank the entire catalog. The real gap is that the schema lacks the publication lifecycle; adding it (and then gating practice on it) is a content-ops feature, not a one-line fix. Tracked under "Next".

**Open from the plan (not started, by design)**
- A02 full fix: single persisted deadline + elapsed-time recovery across reloads/deployments; draft question-set versioning.
- A04: transactional/idempotent cloud sync, canonical score validation, paginated pull.
- A06: full offline journey verification and SW navigation handling.
- A09: per-attempt selection vs static build-time selection; difficulty distribution in the selector.
- A10/A11/A12: export/import round-trip, unsynced eviction guard, per-account storage isolation.
- A13: production auth secret fail-closed + real reset-email delivery (requires owner credentials/provider access).
- A15: `npm audit` shows 3 production advisories (drizzle-orm SQL-injection class, next/postcss via Next) — all need major-version upgrades (drizzle-orm 0.39→0.45, next 15→16), deliberately not bundled into this correctness round.
- Stage 2+ storage/sync feature, Google provider (Better Auth + Neon), monitoring.

**Verification**: `npm run verify` exit 0 — 80 files / 519 tests (8 new tests: honest selection, leak guards, honest results, report honesty), ESLint 0 problems, production build clean.

## Done

Rebuilt the auth modal (`signinmodal.html` Concept A) as a polished split-panel dialog covering Sign in, Create account, and Forgot password, reusing all existing auth logic end to end.

- **Structure & reuse (no duplicated auth logic)**:
  - New `src/components/auth/auth-fields.ts`: single source of truth for field specs (labels, icons, placeholders, `autocomplete` attributes), per-field validation rules, state meta copy (title/sub/CTA), generic API-error copy, and the brand benefits list. Shared by the modal form and the standalone pages so validation and copy can never drift.
  - `AuthForm.tsx` rewritten in place with the **same props contract** (`mode`/`onModeChange`/`onSuccess`/`onGuestContinue`, `AuthMode` type) and the same real calls (`signIn.email`, `signUp.email`, `requestPasswordReset`). It now renders from the shared specs and adds per-field inline errors (`aria-invalid` + `aria-describedby`), an inline "Check your inbox" confirmation state, and the top **Sign in | Create account** tab switcher.
  - `AuthStandaloneForm.tsx` now consumes the shared field specs (its five states and behavior are unchanged; tests still pass untouched).
  - `AuthModal.tsx` is the split-panel shell: maroon brand panel + form panel, plus the preserved post-auth guest-data sync screen verbatim.
- **Brand panel (fixed maroon — shell choice, both themes)**: gold "Live · Civil Service Exam" pill, the app's own `ReviewTayoOwl` (cap, bob, tracked pupils — the broken owl art in signinmodal.html was NOT used), "Review smarter. Pass sooner." headline, subcopy, gold-check benefits list (Sync / Track / Your data), and the ReviewTayo · reviewtayo.online footer line.
- **Form panel (theme-aware tokens)**: tab switcher, "Welcome back" heading + subcopy, Email (mail icon, `juan@example.ph`), Password (lock icon, eye toggle with accessible name), inline "Forgot password?" link, maroon Sign In button, "Continue without an account" ghost button, "New to CSE Reviewer? Create a free account" footer. The RA 10173 Data Privacy box now shows on Create account only (it's a decision, not a login concern — matches the reference note).
- **States in every flow**: inline per-field validation (focus jumps to first invalid), API failure banners (`role="alert"`), duplicate-email signup mapped to the email field, loading spinners with disabled buttons (duplicate-submission prevention), success states, and the reset confirmation that never confirms whether an email exists.
- **Accessibility**: semantic labeled forms; Escape closes; Tab is trapped in the dialog (wrap both directions); focus moves to the dialog on open and returns to the trigger on close (fixed a real bug where the effect re-ran on parent re-render and clobbered the saved trigger); visible focus rings; accessible names on the eye and × icon buttons; decorative SVGs hidden.
- **Responsive**: single-column stack below `md` with the brand panel hidden; no horizontal scroll at 390px; every action visible in-viewport.

## Verified

- `npm run verify`: **PASS (exit 0)** — TypeScript 0 errors, ESLint 0 errors (26 warnings, all pre-existing — this round's FieldMetaKey unused-import warning was removed), Architecture Guard PASS, Vitest **79 files / 510 tests** (auth suites extended: modal 10, form 11, pages 14), Next.js production build clean.
- **Correctness round (this session)**: added a real **in-flight submit guard** (`inFlightRef`) to both `AuthForm.tsx` and `AuthStandaloneForm.tsx` — Enter inside an input fires the form submit event even while the submit button is disabled, so `disabled={loading}` alone allowed a fast Enter to double-fire auth requests. The ref early-returns a second submit across all flows (sign-in/create/reset, plus newpass on the standalone form). Pinned by two new unit tests that submit while a deferred promise is pending and assert exactly one API call (auth-form + auth-pages suites).
- **e2e spec refreshed & run**: `tests/e2e/auth-modal.spec.ts` was rewritten for the split-panel surface (brand panel, tab switcher with `aria-pressed` scoped to the switcher group, eye toggle, inline-validation boundary of the forgot-password flow, Escape → focus returns to trigger) while keeping the five standalone-page tests. **All 7 pass** against the production build (`PORT=3457 npx playwright test tests/e2e/auth-modal.spec.ts`).
- **playwright.config.ts**: `baseURL`/`webServer.url` now read `PORT` from the env instead of hardcoding 3000 — Windows `next start` can silently bind a random port, which made the old config's webServer check time out. `PORT=3457 npx playwright test ...` runs the stack reliably; default stays 3000.
- **Audit round (prior session)**: re-ran `npm run verify` green, redid the browser pass on port 51090 (desktop light flows, all three modes, tab trap, Escape→focus-return, trusted eye-toggle click), completed the interrupted **dark-theme recheck** live (theme-aware form panel on dark tokens, fixed-maroon brand panel, hydration-warning overlay confirmed pre-existing), and removed the round's one new lint warning (`FieldMetaKey` unused import in `AuthStandaloneForm.tsx`; tsc + eslint re-verified after).
- Browser pass (real Chromium, dev server):
  - Desktop 1280×800 light + dark: split panel matches the reference (badge, owl, headline, checklist, tabs, fields with icons, eye toggle, CTA, ghost button, footer).
  - Tab switch Sign in ↔ Create account (aria-pressed, name/email/password + meter + privacy box).
  - Forgot password: form → real API call → "Check your inbox" confirmation with happy owl → Back to sign in.
  - Inline validation on empty submit (three errors at once, focus on first invalid); wrong-credentials submit shows the form-level alert and re-enables the button.
  - Eye toggle (trusted click), Escape close, Tab wrap-around trap, focus returns to the trigger after close.
  - Mobile 390×844: brand panel hidden, no horizontal scroll, submit/guest/footer all visible without scrolling.
- Dev-env note (pre-existing, not from this change): server-side better-auth resolves `baseURL` to `http://localhost:3000` via the `getBaseUrl()` fallback, so auth API calls 403 ("Invalid origin") on any other local port. Run `npm run dev` with `BETTER_AUTH_URL`/`NEXT_PUBLIC_APP_URL` set to the actual port for local auth testing; production (single canonical origin) is unaffected.

## Project audit round (latest)

A full-project audit found and fixed the following. All fixed items verified: `npm run verify` exit 0, **ESLint 0 errors / 0 warnings** (was 26 pre-existing warnings), Vitest **79 files / 511 tests**, production build clean.

**Bugs fixed**
- **Hydration mismatch warning on every page** (`app/layout.tsx`): the anti-FOUC inline script mutates `<html>` before React hydrates, so React logged a `className="dark"` mismatch on every load. Fixed with `suppressHydrationWarning` on `<html>` (correct scope — the mutation is intentional and limited to the class attribute). Verified live: a clean page load now produces a zero-error console.
- **Server-side auth base URL ignored the actual dev port** (`lib/env.ts` step 8): local fallback was hardcoded to `http://localhost:3000`, so `better-auth`'s origin check returned 403 "Invalid origin" on any other port (root cause of the dev-env quirk documented below). Now honors `process.env.PORT` (falls back to 3000); covered by a new unit test (`honors PORT in the local development fallback`). Production paths unchanged.

**Inefficiencies / dead code fixed (26 → 0 lint warnings)**
- `ReviewView.tsx`: the `stats` memo called `LocalStorageService.getMistakeStats()` while declaring `[mistakes]` as its dependency — a hidden storage read inside `useMemo` that only worked by accident. Extracted a pure `computeMistakeStats(items)` helper in ReviewView and derive stats from the `mistakes` state (which `reload()` refreshes after every mutation). Dep warning gone; behavior identical.
- Removed all dead imports/vars flagged by lint: `HelpCircle` (guides page), `createPortal` (AppShell), `Flame/Target/TrendingUp/BookMarked/RotateCcw/ListChecks` + `startOfWeekIso/addDaysIso` + unused `weekDates` (DashboardView), `Bookmark/Layers` + `ReviewTayoOwl` (AchievementsView), `canPrev` (StudyPlanView), `GraduationCap` + `ReviewTayoOwl` + unused `currentExamConfig`/`levelShort`/`enabled` + unused `index` param (PracticeHubView), `StoredNote` (local-storage-service), `vi`/`beforeEach` (dashboard.test), `NotesService` (new-surfaces.test), `StoredNote` (notes-service.test), unused `FieldMetaKey` (AuthStandaloneForm, prior round).

**Drift-risk dedupe**
- `AuthStandaloneLayout.tsx` carried its own inline copy of the three-item benefits list (the drift the shared `auth-fields.ts` module was created to prevent). Now imports `BENEFITS` from `auth-fields`; one source of truth for modal + standalone pages.

**Ops note**
- During verification the 51090 dev server began returning 500s (`Cannot find module './5873.js'`) — a stale `.next` chunk cache after heavy file edits, not an app bug. Fixed by killing the server, deleting `.next`, and restarting; page loads cleanly (200) with a zero-error console.

## Blocked

- None.

## Needs Human

- None.

## Next

- Ready for user review.
- Optional: a second e2e test covering the forgot-password confirmation state against a mocked/staged reset endpoint (current spec deliberately stops at the inline-validation boundary to keep e2e deterministic against the real API).
