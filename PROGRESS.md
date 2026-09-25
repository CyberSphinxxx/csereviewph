# CSEReviewerPH / ReviewTayo — Current Handoff

Full prior status is archived in `ARCHIVES/progress-history.md`.

**Current status: SPLIT-PANEL AUTH MODAL COMPLETE (VERIFY EXIT 0, BROWSER PASS)**

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

## Blocked

- None.

## Needs Human

- None.

## Next

- Ready for user review.
- Optional: a second e2e test covering the forgot-password confirmation state against a mocked/staged reset endpoint (current spec deliberately stops at the inline-validation boundary to keep e2e deterministic against the real API).
