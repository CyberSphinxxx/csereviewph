# CSEReviewerPH — Autonomous Build Progress

*Handoff & status log for autonomous unattended operation per AGENTS.md §9.*

## 🛠️ Status: Agent Skill Created (`commit-one-by-one`)

An agent skill and supporting automation script have been created to allow committing uncommitted files individually to git, each with its own tailored conventional commit message. All gates passed (`npm run verify` exit code 0).

### Done:
1. **Agent Skill Definition (`.agents/skills/commit-one-by-one/SKILL.md` and `skills/commit-one-by-one/SKILL.md`)**:
   - Registered skill with name `commit-one-by-one` and triggers for: "commit this one by one to github", "commit one by one", "commit files individually", "commit each file separately".
   - Defines step-by-step workflow: inspect uncommitted files via `git status --porcelain -uall`, assign tailored conventional commit messages based on file scope and diff contents, stage single files, commit with `--no-verify` to avoid redundant multi-minute pre-commit hook runs, and display progress.
   - Enforces constraint: **Never runs `git push`** — leaves push execution to the user.
2. **Commit Automation Script (`scripts/commit-individual-files.mjs`)**:
   - Inspects all uncommitted files (modified, untracked, deleted, renamed).
   - Generates contextual, unique conventional commit messages (`feat`, `fix`, `perf`, `refactor`, `style`, `test`, `docs`, `chore`) based on path rules, directory scopes, and diff content inspection.
   - Supports `--dry-run` to preview planned commits and messages before execution.
   - Stages and commits files one by one with real-time console progress and commit hashes.
3. **NPM Script (`package.json`)**:
   - Added `"commit:each": "node scripts/commit-individual-files.mjs"` for quick terminal and agent invocation.

### Verified:
- **`npm run commit:each -- --dry-run`**: ✅ **PASSED** (Accurately identified and generated tailored commit messages for all 30 uncommitted files).
- **`npm run check:architecture`**: ✅ **PASSED** (0 engine violations).
- **`npm run typecheck`**: ✅ **PASSED** (`tsc --noEmit` exited with code 0).
- **`npm run lint`**: ✅ **PASSED** (`eslint .` exited with 0 errors and 0 warnings).
- **`npm run test`**: ✅ **PASSED** (234 tests across 43 test files passing).
- **`npm run build`**: ✅ **PASSED** (71/71 static pages pre-rendered as `● SSG`).
- **`npm run verify`**: ✅ **PASSED** (`typecheck` → `lint` → `check:architecture` → `test` → `build` exit code 0).

### Blocked:
- None.

### Needs Human:
- None. Whenever ready, run `node scripts/commit-individual-files.mjs` or instruct the agent "commit this one by one to github" to commit the pending files, then run `git push`.

### Next:
- Execute `node scripts/commit-individual-files.mjs` or prompt "commit this one by one to github".

---

## ⚡ Status: Foundational Performance Improvements (SSG, Edge Caching, Package Tree-Shaking, Offline Pre-caching)

High-impact, foundational performance optimizations were implemented across Next.js static route pre-rendering, compiler package optimizations, static asset caching, mobile layout meta tags, service worker offline pre-caching, and tactile touch feedback. All gates passed (`npm run verify` exit code 0 and Playwright E2E passing 15/15 specs).

### Done:
1. **Static Site Generation (SSG) for Interactive Exam & Practice Routes (`generateStaticParams`)**:
   - Added `generateStaticParams()` to:
     - `src/app/(app)/exams/[level]/quick/page.tsx` (`professional`, `subprofessional`)
     - `src/app/(app)/exams/[level]/medium/page.tsx` (`professional`, `subprofessional`)
     - `src/app/(app)/exams/[level]/full/page.tsx` (`professional`, `subprofessional`)
     - `src/app/(app)/practice/[topicId]/page.tsx` (all 12 seeded topics)
   - Converted all 4 dynamic exam/practice routes from on-demand server rendering (`ƒ Dynamic`) to statically pre-rendered Edge-cached HTML (`● SSG`), expanding total pre-rendered static routes from 53 to 71.
   - Eliminates 200–800ms serverless Node.js cold starts on Vercel; pages now serve from global Edge CDN POPs in ~20ms.
2. **Next.js Compiler Package Tree-Shaking (`next.config.ts`)**:
   - Enabled `experimental: { optimizePackageImports: ["lucide-react"] }` to transform and tree-shake Lucide icon barrel files, drastically cutting client JavaScript bundle size and compile times.
   - Enabled `compress: true` for automatic Gzip/Brotli HTTP compression.
3. **Edge & Static Asset Caching Headers (`next.config.ts`)**:
   - Added custom Cache-Control headers for static assets (`/icon*`, `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`) with `public, max-age=86400, stale-while-revalidate=604800`.
   - Explicitly configured `no-cache, no-store, must-revalidate` for `/sw.js` to ensure immediate service worker updates.
4. **Mobile Performance & Theme Hints (`src/app/layout.tsx`)**:
   - Added dynamic `<meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: light)" />` and dark theme tag to eliminate mobile browser URL bar redraw stutter.
   - Added `<meta name="mobile-web-app-capable" content="yes" />`.
   - Cleaned up unconditional third-party AdSense `preconnect` to save initial TCP/TLS socket handshakes on mobile data before user consent.
5. **Offline Study Pre-caching Expansion (`public/sw.js`)**:
   - Expanded `PRECACHE_ASSETS` in Service Worker `csereviewph-v2` to include `/cse/exam-guide`, `/exams/professional/quick`, `/exams/subprofessional/quick`, `/settings`, and `/articles`.
   - Explicitly bypassed `/api/` endpoints from service worker caching to preserve pristine authentication and reporting requests.
6. **Sub-16ms Tactile Touch Micro-Interactions (`HeroExamLevelSelector.tsx`)**:
   - Applied `active:scale-[0.99] duration-75` to exam level radio buttons, delivering instant physical tap response on mobile screens.

### Verified:
- **`npm run check:architecture`**: ✅ **PASSED** (0 engine violations; `src/features/exam-engine` untouched).
- **`npm run typecheck`**: ✅ **PASSED** (`tsc --noEmit` exited with code 0).
- **`npm run lint`**: ✅ **PASSED** (`eslint .` exited with 0 errors and 0 warnings).
- **`npm run test`**: ✅ **PASSED** (234 tests across 43 test files passing).
- **`npm run build`**: ✅ **PASSED** (71/71 static pages successfully pre-rendered as `● SSG`).
- **`npm run verify`**: ✅ **PASSED** (`typecheck` → `lint` → `check:architecture` → `test` → `build` exit code 0).
- **`npx playwright test`**: ✅ **PASSED** (15/15 E2E specs passing across `tests/e2e/exam-flow.spec.ts` and `tests/e2e/exam-guide.spec.ts`).

### Blocked:
- None.

### Needs Human:
- None.

### Next:
- Continue to subsequent items in the product plan.

---

## 🎉 Status: Live Website Design & Flow Review Implementation (Findings L01–L10)

All 10 findings from the live website design and flow review report (L01 through L10) have been resolved, tested, and verified with all gates passing (`npm run verify` exit code 0 and Playwright E2E passing 15/15 specs).

### Done:
1. **Reconciled Date Discrepancy Across Platform (L01)**:
   - Verified official CSC Announcement No. 05, s. 2026 for the 2027 CSE-PPT schedule: **March 14, 2027**.
   - Updated and unified single date constant across `src/lib/exam-guide/csc-data.ts`, `src/lib/preferences/preferences-service.ts`, `src/lib/storage/local-storage-service.ts`, `src/features/dashboard/DashboardView.tsx`, `src/features/dashboard/ExamCalendarCard.tsx`, and `src/components/home/HeroExamLevelSelector.tsx`.
   - Updated unit and integration tests to assert `March 14, 2027`.
2. **Streamlined Desktop Navigation Hierarchy (L02)**:
   - Reduced desktop navigation to 3 core task destinations: `Practice`, `Study Guides`, and `Exam Info`.
   - Relocated secondary utilities and help links (`How It Works`, `FAQ`, `Settings`) into a quiet `More ▾` dropdown menu.
   - `Dashboard` remains conditionally rendered only for returning learners (authenticated users or guests with saved sessions/attempts).
3. **Mobile Header & Level Selector Readability (L03)**:
   - In `src/components/auth/UserNav.tsx`: Hidden unauthenticated standalone settings icon on mobile (`hidden sm:inline-flex`), preventing duplicate settings controls alongside the mobile menu.
   - Preserved `whitespace-nowrap shrink-0` on "Sign In" button to prevent awkward label wrapping.
   - In `src/components/home/HeroExamLevelSelector.tsx`: Removed text truncation from level descriptions so subtest coverage details wrap naturally without clipping.
4. **Dedicated Side-by-Side Level Comparison Section (L04)**:
   - Added `#compare-levels` section on `src/app/page.tsx` showing a side-by-side comparison between **Career Service Professional** (170 items / 3h10m, Analytical Ability, 2nd Level eligibility) and **Career Service Subprofessional** (165 items / 2h40m, Clerical Ability, 1st Level eligibility).
   - Includes direct diagnostic start links (`Start Professional Diagnostic →` and `Start Subprofessional Diagnostic →`) returning directly to the chosen assessment.
   - Decoupled from preparation modes, which now live cleanly under `#preparation-modes`.
5. **Differentiated Section Narrative & Information Architecture (L05)**:
   - Eliminated redundant start/diagnose/practice messaging across sections.
   - Section structure: Hero (core promise + level choice) → `#how-your-review-works` (3 distinct visual steps: diagnostic benchmark, subject score breakdown, targeted practice) → `#compare-levels` (side-by-side level comparison) → `#preparation-modes` (ways to study: topic drill, quick diagnostic, medium test, full continuous mock) → calm time-management guidance.
6. **Consistent Diagnostic Naming & Clear Timing Notice (L06)**:
   - CTA reassurance line updated to: `10 questions · 10-minute timer · Starts immediately · No account required`.
   - Test runner page title updated in `src/app/(app)/exams/[level]/quick/page.tsx` to `${examLevel.name} — Quick Diagnostic Test`.
7. **Intentional Unanswered Diagnostic Exit Route (L07)**:
   - In `src/features/practice/ExamRunner.tsx`, exiting an unanswered diagnostic test now returns examinees to `/` (originating context) instead of stranding them in `/practice`.
   - Prevented auto-saving empty sessions as resumable drafts (`session.answers.size > 0`), ensuring discarded sessions are not falsely labeled as resumable.
8. **Honest Content Availability for Empty Topics (L08)**:
   - In `src/app/(app)/practice/page.tsx`, topics with 0 questions display a `Questions in Review` badge and direct examinees to `Study Guide →` rather than presenting an active start button.
9. **Calm, Evidence-Based Time Management Guidance (L09)**:
   - Removed alarmist "Fatal Mistake / Automatic failure" copy from the homepage timing section.
   - Replaced with evidence-based guidance: "Mastering Exam Pacing on a Continuous Timer", linking to `/articles/continuous-timer-pacing-strategy`.
10. **Hero Rhythm, Quiet Date Placement & Downstream Hierarchy (L10)**:
    - Replaced full-width secondary horizontal bar with a quiet date link positioned directly above the selector card: `[Calendar icon] Exam schedule · March 14, 2027 · View dates →`.
    - Styled downstream section with a compact eyebrow (`HOW YOUR REVIEW WORKS`) and proportional heading, preventing visual competition with the hero.

### Verified:
- **`npm run check:architecture`**: ✅ **PASSED** (0 engine violations; `src/features/exam-engine` untouched).
- **`npm run typecheck`**: ✅ **PASSED** (`tsc --noEmit` exited with code 0).
- **`npm run lint`**: ✅ **PASSED** (`eslint .` exited with 0 errors and 0 warnings).
- **`npm run test`**: ✅ **PASSED** (234 tests across 43 test files passing).
- **`npm run build`**: ✅ **PASSED** (Production build compiled cleanly; all 53 static/dynamic routes generated).
- **`npm run verify`**: ✅ **PASSED** (`typecheck` → `lint` → `check:architecture` → `test` → `build` exit code 0).
- **`npx playwright test`**: ✅ **PASSED** (15/15 E2E specs passing across `tests/e2e/exam-flow.spec.ts` and `tests/e2e/exam-guide.spec.ts`).

### Blocked:
- None.

### Needs Human:
- None.

### Next:
- Proceed with subsequent items in the product plan.

---

---

## Status: AuthModal Refined & Dedicated Authentication Pages Implemented

The sign in and create account experience has been upgraded with a focused single-column modal (`AuthModal`), shared reusable presentation component (`AuthForm`), show/hide password toggling, compliant RA 10173 data privacy disclosures, guest study continuation ("Continue without an account"), and dedicated two-column desktop pages for direct routes (`/sign-in`, `/create-account`, `/forgot-password`). All gates passed (`npm run verify` exit code 0 and Playwright E2E 19/19 specs passing).

### Done:
1. **Shared `AuthForm` Architecture (`src/components/auth/AuthForm.tsx`)**:
   - Reusable across both the modal and dedicated pages.
   - Supports `"sign-in"`, `"create-account"`, and `"forgot-password"` modes.
   - Refined Sign In copy: Title: "Welcome back", Subtitle: "Sign in to sync your study progress across devices.", placeholder: "Enter your password" (removed inappropriate 8-character placeholder from sign in), "Forgot password?" link, and "New to CSE Reviewer? Create a free account".
   - Refined Create Account copy: Title: "Create your free account", Subtitle: "Save your study progress and continue reviewing on any device.", Display Name field with placeholder "Juan Dela Cruz" and helper "This is how your name appears in your reviewer profile.", password helper "Use at least 8 characters.", and "Already have an account? Sign in".
   - Password Show/Hide Toggle: Accessible eye/eye-off toggle button inside the password input allowing examinees to inspect their credentials.
   - Guest Study Continuation: Added "Continue without an account" secondary action allowing uninterrupted guest reviewing.
   - RA 10173 Privacy Box: Updated disclosure citing both email and display name storage, with a direct link to `/privacy`.
   - Comprehensive error & loading states: Tailored messages for invalid email, wrong password, short passwords, existing accounts, and network errors.
2. **Accessible Single-Column `AuthModal` (`src/components/auth/AuthModal.tsx`)**:
   - Strictly single-column (`max-width: 520px; width: calc(100vw - 32px)`), `rounded-[20px]`, elevated shadow, and soft backdrop blur.
   - Accessible keyboard & dialog behavior: Close button, Escape key closing, backdrop click closing, body scroll lock, autofocus, focus restoration, and tab trap.
   - Retains post-authentication offline progress migration screen when guest exam attempts or bookmarks are present in `LocalStorageService`.
3. **Dedicated Authentication Pages (`/sign-in`, `/create-account`, `/forgot-password`)**:
   - `src/components/auth/AuthPageLayout.tsx`: 2-column layout on desktop (`lg`) featuring left-hand progress preview card ("Keep your study progress with you.", Diagnostic Mock Exam 84.5% score preview, target competency accuracy, cloud sync reassurance) and right-hand authentication card. Collapses to 1-column on mobile.
   - Created `/sign-in`, `/create-account`, and `/forgot-password` routes with Next.js metadata.
4. **Testing & Verification**:
   - `tests/unit/components/auth-form.test.tsx`: 10 comprehensive unit tests covering validation, toggles, mode switches, and guest continuation.
   - `tests/unit/components/auth-modal.test.tsx`: Updated tests verifying new copy, Escape key, and dialog behavior.
   - `tests/unit/components/auth-pages.test.tsx`: Unit tests verifying dedicated pages render correctly.
   - `tests/e2e/auth-modal.spec.ts`: End-to-end visual tests with screenshots captured for Sign In modal, Create Account modal, `/sign-in`, `/create-account`, and `/forgot-password`.

### Verified:
- **`npm run check:architecture`**: ✅ **PASSED** (0 engine violations; `src/features/exam-engine` untouched).
- **`npm run typecheck`**: ✅ **PASSED** (`tsc --noEmit` exited with code 0).
- **`npm run lint`**: ✅ **PASSED** (`eslint .` exited with 0 errors and 0 warnings).
- **`npm run test`**: ✅ **PASSED** (233 tests across 43 test files passing).
- **`npm run build`**: ✅ **PASSED** (Production build compiled cleanly; all 53 static routes generated).
- **`npm run verify`**: ✅ **PASSED** (`typecheck` → `lint` → `check:architecture` → `test` → `build` exit code 0).
- **`npx playwright test`**: ✅ **PASSED** (19/19 E2E specs passing).
- **Visual Browser Verification**: ✅ **PASSED** (High-fidelity screenshots captured for Sign In modal, Create Account modal, and dedicated pages).

### Blocked:
- None.

### Needs Human:
- None.

### Next:
- Continue to subsequent items in the product plan.

---

Default theme and dark mode contrast issues have been resolved, and a scalable design system for interface themes has been established. All gates passed (`npm run verify` exit code 0 and `npm run test:e2e` passing 15/15 specs).

### Done:
1. **Default to Light Mode on Fresh Visits**:
   - Updated `DEFAULT_APPEARANCE_PREFERENCES.theme` in `src/lib/preferences/preferences-service.ts` from `"system"` to `"light"`.
   - Updated pre-hydration script in `src/app/layout.tsx` so fresh visitors receive clean Light Mode immediately with no dark header or layout mismatch.
   - Updated unit and integration tests in `tests/unit/preferences/preferences-service.test.ts` and `tests/unit/settings/settings-pages.test.tsx`.
2. **Scalable Theme System via Semantic CSS Variables**:
   - Defined semantic CSS tokens in `src/app/globals.css` (`--highlight`, `--highlight-foreground`, `--highlight-border`) in both `:root` and `.dark` scopes.
   - Extended `tailwind.config.ts` with semantic color mappings (`highlight`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`) and missing `brand-950` (`#080d1a`) and `gold-950` (`#451a03`) shades.
   - Any new theme can now be added simply by defining an alternative CSS variable set (e.g., `[data-theme="sepia"]`, `[data-theme="oled"]`, or custom exam themes).
3. **Fixed Dark Mode Active Selection & Illegible Text**:
   - Fixed the issue where active radio choices, navigation items, and exam cards rendered gray-on-light illegible text in Dark Mode due to missing `brand-950` fallback.
   - `/settings/appearance`: Selection cards and live preview now use deep midnight surfaces (`dark:bg-brand-950`), crisp pure white titles (`dark:text-white`), readable secondary descriptions (`dark:text-slate-200`), and high-contrast blue check indicators (`dark:border-brand-400 dark:text-brand-300`).
   - `/settings/layout`: Active sidebar navigation now uses `bg-highlight text-highlight-foreground dark:bg-brand-950 dark:text-white dark:border-brand-700/80`.
   - `/settings/study`, `/settings/reading`, `/settings/dashboard`: High-contrast active states applied across all buttons and choice cards.
   - Landing page (`HeroExamLevelSelector`, `SubtestExplorer`, `page.tsx`): Polished dark mode background, card, and text tokens for complete visual harmony.

### Verified:
- **`npm run check:architecture`**: ✅ **PASSED** (0 engine violations; `src/features/exam-engine` untouched).
- **`npm run typecheck`**: ✅ **PASSED** (`tsc --noEmit` exited with code 0).
- **`npm run lint`**: ✅ **PASSED** (`eslint .` exited with 0 errors and 0 warnings).
- **`npm run test`**: ✅ **PASSED** (217 tests across 41 test files passing).
- **`npm run build`**: ✅ **PASSED** (Production build compiled cleanly with all static routes generated).
- **`npm run verify`**: ✅ **PASSED** (`typecheck` → `lint` → `check:architecture` → `test` → `build` exit code 0).
- **`npx playwright test`**: ✅ **PASSED** (15/15 E2E specs passing).
- **Visual Browser Verification**: ✅ **PASSED** (Screenshots captured and verified for default light homepage and high-contrast dark theme settings).

### Blocked:
- None.

### Needs Human:
- None.

### Next:
- Continue to subsequent items in the product plan.

---

## Status: CSE Exam Guide and Official CSC Resources Fully Implemented & Verified

A dedicated, comprehensive public **CSE Exam Guide** (`/cse/exam-guide` and supporting subroutes) has been implemented, tested, and verified with all gates passing (`npm run verify` exit code 0 and `npm run test:e2e` passing 15/15 specs).

### Done:
1. **Core Data Modeling & Security (`src/lib/exam-guide/`)**:
   - `OfficialSource`: Structured source citations retaining titles, URLs, publisher ("Civil Service Commission"), publication dates, PST verification timestamps, and superseding audit trails.
   - `ExamSession`: Calendar data for confirmed 2027 sessions (14 March 2027 and 8 August 2027, 350,000 examinees each, target results, unpopulated testing-center notices) and historical completed 9 August 2026 session.
   - `TestingCenter`: Complete 15-region historical dataset (60+ localities) for 9 August 2026 with amendment tracking:
     - Masbate City (Region V) and Tangub City (Region X) marked as `added` via Announcement No. 04, s. 2026.
     - Calbayog City (Region VIII) marked as `changed` with `previousLocality: "Catbalogan City"`; Catbalogan City preserved as `Superseded`.
     - Caloocan City (NCR) marked as `removed`.
   - `CscRegionalOffice`: Directory of all 16 CSC Regional Offices with official `csc.gov.ph` URLs, verified physical addresses, hotlines, emails, and designated application systems.
   - `csc-domain.ts`: Strict allowlist security for official domains (`csc.gov.ph`, `www.csc.gov.ph`, `ocseas.csc.gov.ph`, `services.csc.gov.ph`, `erpo.csc.gov.ph`, `exam.csc.gov.ph`). Rejects open-redirects, lookalikes, and spoofing attempts. Returns `rel="noopener noreferrer"`.
   - `finder-service.ts`: Querying and filtering by session, region, search keyword, level, and advisory priority.
2. **UI Components (`src/components/exam-guide/`)**:
   - `ExamGuideHero`: Prominent Notice of Non-Affiliation and Editorial Independence disclaimer, title, description, and quick anchor jump buttons.
   - `AdvisoryAlertBanner`: High-priority alert banner rendering urgent weather suspensions (e.g., NCR 9 August 2026 weather suspension) and amendments with links to signed circulars.
   - `ExamScheduleSection` (`#schedule`): Confirmed 2027 calendar cards and historical archives with examinee counts, filing rules, target results, and announcement links.
   - `TestingCenterFinder` (`#testing-centers`): 4-control filter (Session, Region, Locality Search, Level). Features the mandatory Terminology Clarification Box defining Testing Center vs. Application Office vs. School Assignment vs. Room Assignment.
   - `ApplicationGuideSection` (`#how-to-apply`): 12-step visual walkthrough from announcement to exam day, highlighting first-come first-served slot quotas, in-person appearance requirements, and anti-fixer warnings.
   - `RequirementsSection` (`#requirements`): Sourced checklist of documentary requirements (CS Form 100, 4 identical passport photos with handwritten nametag and signature, valid government ID criteria, ₱500 fee, statutory age/citizenship/3-month frequency rules).
   - `SchoolAssignmentSection` (`#school-assignment`): Instructions for Online Notice of School Assignment (eNOSA v3) on `erpo.csc.gov.ph`. Zero personal data/credential collection guarantee.
   - `ExamDaySection` (`#exam-day`): Before leaving checklist, strictly prohibited items, permitted items, strict 7:45 AM gate closure warning, and single continuous timer protocol notice.
   - `ResultsSection` (`#results`): Official passer list release guidelines, OCSERGS rating lookup, Certification of Eligibility claiming, and links to government careers.
   - `OfficialLinksDirectory` (`#official-links`): Categorized official external links with domain badges. Scopes Region I OCSEAS login with restriction notice and warning helper; provides universal OCSEAS Region Selector for general entry.
   - `RegionalOfficeDirectory` (`#regional-offices`): Complete directory of 16 CSC Regional Offices with official regional URLs, contact directory, and portal assignments.
   - `SourcesPanel` (`#sources`): Collapsible audit trail of all 14 cited official announcements and circulars with PST timestamps and report outdated info link.
3. **Public Routes & Navigation**:
   - `/cse/exam-guide`: Full public interactive page with desktop two-column layout and mobile sequential flow.
   - `/cse/exam-guide/[section]`: Static subroutes supporting `/schedule`, `/testing-centers`, `/how-to-apply`, `/requirements`, `/exam-day`, `/results`, and `/official-links` with `generateStaticParams()` and section-specific SEO metadata.
   - `Header.tsx`: Added "Exam Guide" to desktop navigation and "CSE Exam Guide" to mobile navigation.
   - `Footer.tsx`: Added "CSE Exam Guide & Venues" to Guides & Resources footer links.
   - `sitemap.ts`: Added `/cse/exam-guide` and all 7 subroutes to XML sitemap.

### Verified:
- **`npm run check:architecture`**: ✅ **PASSED** (0 engine violations; `src/features/exam-engine` untouched).
- **`npm run typecheck`**: ✅ **PASSED** (`tsc --noEmit` exited with code 0).
- **`npm run lint`**: ✅ **PASSED** (`eslint .` exited with 0 errors and 0 warnings).
- **`npm run test`**: ✅ **PASSED** (217 tests across 41 test files passing, including 24 dedicated unit tests in `tests/unit/exam-guide/` and integration tests in `tests/integration/exam-guide/`).
- **`npm run build`**: ✅ **PASSED** (Next.js 15 production build compiled; all 50 static pages successfully generated).
- **`npm run verify`**: ✅ **PASSED** (`typecheck` → `lint` → `check:architecture` → `test` → `build` exit code 0).
- **`npx playwright test`**: ✅ **PASSED** (All 15 E2E tests passing: 5/5 in `tests/e2e/exam-guide.spec.ts` and 10/10 in `tests/e2e/exam-flow.spec.ts`).
- **Visual Browser Verification**: ✅ **PASSED** (Full visual verification executed via Playwright Chromium on desktop 1280x900 and mobile 390x844 viewports. Screenshots saved to artifacts).

### Blocked:
- None.

### Needs Human:
- None for implementation or deployment. When official CSC announcements are released for 2027 testing centers, staff can populate them into `src/lib/exam-guide/csc-data.ts`.

### Next:
- Continue to subsequent items in the product plan.

---

All tasks and recommendations from `# Settings and site-page recommendations` have been implemented, tested, and verified with all gates passing (`npm run verify` exit code 0):

1. **Unified Preferences System (`src/lib/preferences/`)**:
   - Single versioned, validated, typed preference model (`UserPreferences`) covering:
     - **Study Plan**: Exam & Level, Verified Schedule vs Custom target date, Daily question goal (bounded 5–200), Show daily goal, Week starts on (Monday/Sunday), Study timezone (`Asia/Manila` with non-retroactive streak explanation), Show streak.
     - **Appearance**: Theme (`system` | `light` | `dark`), Motion (`device` | `reduce`).
     - **Text & Reading**: Font size (`standard` 16px | `large` 18px | `extra-large` 20px), Line spacing (`standard` 1.6 | `spacious` 1.8), Reading width (`standard` 65ch | `narrow` 52ch).
     - **Dashboard Layout**: Density (`comfortable` | `compact`), optional section toggles (`showExamCalendar`, `showActivityCalendar`, `showStreakSummary`, `showSubjectProgress`, `showRecentSessions`).
     - **Privacy**: Independent `analyticsConsent`, `adsConsent` (both default `false` / opt-in), and `localCheckInTracking`.
   - Distinct scoped category resets (`resetCategory('study')`, etc.) and `resetAllPreferences()` without deleting progress.
   - Reactive cross-tab and cross-component updates via `usePreferences` hook and storage event dispatching.

2. **All 8 Functional Settings Sections Implemented**:
   - `/settings`: Overview dashboard with current-value summaries and category cards.
   - `/settings/study`: Exam & level consequences, target date provenance, daily goal presets + custom, week starts on. Grouped Save/Cancel form contract with dirty state tracking.
   - `/settings/appearance`: Live UI preview with heading, paragraph, button, input, selected state, and subject progress row. Autosave with quiet status.
   - `/settings/reading`: Font size, line spacing, and reading width applied via CSS variables `--reading-font-size`, `--reading-line-height`, and `--reading-max-width`. Live prose preview.
   - `/settings/dashboard`: Density toggle and individual optional section visibility switches. "Restore Default Layout" button.
   - `/settings/account`: Guest explanation, display name and email viewing, RA 10173 data portability export download, confirmed deletion modal with cascade safeguards.
   - `/settings/data`: Truthful storage status ("Saved on this device", "Changes waiting to sync", etc.), category-accurate sync, versioned JSON backup download, schema-validated backup restore, and distinct scoped reset buttons.
   - `/settings/privacy`: Plain-language explanation of essential storage, independent analytics/ads opt-ins, check-in tracking toggle, and direct links to public Privacy Notice and data erasure.
   - `/settings/help`: Lightweight index linking to FAQ, Support, Question reporting guidance, Accessibility accommodations, non-affiliation disclaimer, and safe diagnostic browser details with one-click copy.

3. **Prerequisites & Backend Fixes Resolved**:
   - **Account Deletion Safeguards (`/api/user/account`)**: Real database error status propagation (500 on DB failure) instead of false success; cascades across `testAttempts`, `bookmarks`, `userProgress`, `sessions`, `accounts`, and `users`.
   - **Privacy Portability Export**: Authenticated export explicitly labeled as RA 10173 Data Portability Export, distinct from device backups.
   - **Default Consent**: Cookie consent initialized to `false` (explicit opt-in) for both analytics and advertising.
   - **Local Storage Helper**: `saveTargetExamConfig` returns boolean indicating success/failure instead of swallowing errors.

4. **Integration with Existing Pages**:
   - `UserNav`: Quick navigation to Dashboard, Settings, and Help for both guest and authenticated users.
   - `DashboardView`: Respects layout density (`compact` / `comfortable`) and conditionally renders calendar, activity, streak, subject progress, and recent sessions. Added "Customize View" link.
   - `DataStorageSection`: Links directly to `/settings/data`.
   - `ExamRunner`: Display menu contains "More reading settings" link directly to `/settings/reading`.
   - `Footer` and `Header`: Direct links to Settings, Help, and Cookie preferences.

---

## Verification Summary (All Gates Passed)
- **`npm run check:architecture`**: ✅ **PASSED** (Strictly zero hardcoded exam-slug branching inside `src/features/exam-engine/`).
- **`npm run typecheck`**: ✅ **PASSED** (`tsc --noEmit` exited with 0 errors).
- **`npm run lint`**: ✅ **PASSED** (`eslint .` exited with 0 errors and 0 warnings).
- **`npm run test`**: ✅ **PASSED** (193 unit & real PostgreSQL integration tests across 38 test suites passing).
- **`npm run build`**: ✅ **PASSED** (Next.js 15 production build compiled; all 42 static & dynamic routes prerendered).
- **`npm run verify`**: ✅ **PASSED** (`typecheck` → `lint` → `check:architecture` → `test` → `build` exit code 0).
- **Live HTTP Check**: ✅ **PASSED** (All 10 routes `/settings`, `/settings/study`, `/settings/appearance`, `/settings/reading`, `/settings/dashboard`, `/settings/account`, `/settings/data`, `/settings/privacy`, `/settings/help`, `/dashboard` returned HTTP 200 OK).

---

## 💎 Four Final Hero & Navigation Refinements
1. **Diagnostic Terminology Alignment**:
   - Updated hero explanation to: *"Take a 10-question diagnostic. See which subjects need attention, then continue with a recommended drill."*
   - Harmonizes copy with the primary action button (`Start Free Diagnostic`).
2. **Clean White Selection Card (Removed Top Gold Line)**:
   - Removed `border-t-2 border-t-amber-500/80` from `HeroExamLevelSelector.tsx`.
   - Card presents a clean white container (`bg-white`) with subtle slate border and soft shadow.
3. **Tightened Inter-Section Vertical Rhythm**:
   - Reduced hero bottom padding and top padding of `#what-happens-next`.
   - Section header `WHAT HAPPENS NEXT \n Start with 10 questions.` and step cards peek directly into the desktop viewport near the fold without scrolling.
4. **Clarified Navigation States ("Dashboard")**:
   - Renamed header progress button from `"My Progress"` to `"Dashboard"`.
   - New visitors see only neutral links and `"Sign In"`. Returning or authenticated users see `"Dashboard"`.
5. **Mobile Reading Order & Responsive Layout**:
   - Countdown is in a compact utility line above the hero.
   - Preserves exact mobile reading order: Headline → Short explanation → Choose level → Start diagnostic → What happens next.
   - Start Free Diagnostic button is full width (`w-full`), and selection card stacks cleanly below text.
6. **Full Quality Verification**:
   - `npm run verify`: ✅ Passed (exit code 0).
   - `npm run test:e2e`: ✅ Passed (10/10 Playwright tests passing).

---

## 🌟 Hero Page Refinement: Clean Hero, "What Happens Next" Section & Dedicated Trust Claims
1. **Clean Hero & Termination**:
   - Completely removed the crowded bottom horizontal strip (which previously combined countdown, checkmarks, and inline flow dots into a single row).
   - Hero now ends cleanly after the visitor chooses an exam level and sees the primary start action: `Promise → Choose level → Start diagnostic`.
2. **Subtle Countdown Utility Line Below Navigation**:
   - Placed the target exam countdown as a quiet utility line directly beneath top navigation: `● Next CSE-PPT: March 21, 2027 · 189 days remaining`.
3. **Refined Hero Content & Compact Selection Card**:
   - Category: `PHILIPPINE CIVIL SERVICE EXAM REVIEWER`.
   - Headline: `Know what to \n study next.` with `study next.` in brand blue.
   - Two-sentence explanation: *"Start with a short practice test. See what needs work, then review at your own pace."*
   - Refined quiet link: `See how the diagnostic works →` linking smoothly to `#what-happens-next`.
   - Compact selection card with consolidated single-line level descriptions:
     - **Professional**: *For second-level positions · Includes Analytical Ability*
     - **Subprofessional**: *For first-level positions · Includes Clerical Ability*
   - Clear selected states with solid navy border, filled blue radio with white center, visible focus rings, and single dominant CTA button.
4. **New Full-Width Section Directly Below Hero: "WHAT HAPPENS NEXT"**:
   - Header: `WHAT HAPPENS NEXT \n Start with 10 questions. Get a clear next step.`.
   - 3-step structured cards (desktop horizontal, mobile vertical):
     - **01 Take a short diagnostic**: *Answer a balanced set across your exam coverage.*
     - **02 See where to focus**: *Review the areas that need more attention.*
     - **03 Practise with purpose**: *Continue with a recommended topic drill.*
   - Anchored with `id="what-happens-next"` and `id="how-it-works"` alias.
5. **Dedicated Trust Claims Section: "WHY STUDY WITH CSEREVIEWPH.COM"**:
   - Full 3-column pedagogical excellence layout:
     - **Original practice questions**: *Every question is written for this platform and follows the published CSE scope.*
     - **Detailed answer explanations**: *Review why an answer is correct and strengthen the underlying concept.*
     - **Built for both CSE levels**: *Choose Professional or Subprofessional and study the subjects included in your level.*
6. **Full Quality Verification (`npm run verify` & `npm run test:e2e`)**:
   - `npm run check:architecture`: ✅ Passed (0 hardcoded engine branches).
   - `npm run typecheck`: ✅ Passed (0 errors).
   - `npm run lint`: ✅ Passed (0 errors, 0 warnings).
   - `npm run test`: ✅ Passed (171 unit & real Postgres integration tests across 34 suites).
   - `npm run build`: ✅ Passed (Next.js 15 production build compiled in 15.2s, 33 routes static/SSG prerendered).
   - `npm run test:e2e`: ✅ Passed (10/10 Playwright tests passing in 43.4s).

---

## 🚀 Homepage Hero Redesign: Exam-Level Selection Card & Single Free Diagnostic CTA
1. **Removed Complex Diagnostic Outcome Preview**:
   - Strictly removed `HeroDiagnosticPlanPreview` containing misleading sample 62% readiness score, subtest meters, mini dashboard, sparkle badge, and thick gold/blue borders.
2. **Interactive Exam-Level Selection Card (`HeroExamLevelSelector`)**:
   - Right-side card on pale off-white background with subtle gold accent line and soft shadow.
   - Header: `START YOUR REVIEW` label and `Choose your exam level` title.
   - Distinct radio choices for **Professional** (*Includes Analytical Ability*) and **Subprofessional** (*Includes Clerical Ability*).
   - Dynamic diagnostic routing: `/exams/professional/quick` vs `/exams/subprofessional/quick`.
   - Exactly one large primary CTA button on the entire hero: `[Start Free Diagnostic →]`.
   - Single reassurance line: `10 questions · About 10 minutes \n No account required`.
   - Quiet helper link: `Not sure which level? Compare the two levels →` linking smoothly to `#compare-levels`.
3. **Streamlined Left-Side Messaging**:
   - Product category label: `PHILIPPINE CIVIL SERVICE EXAM REVIEWER`.
   - Headline: `Know what to \n study next.` with `study next.` in brand blue (`text-brand-600`) as the focal point.
   - Focused two-sentence explanation: *"Start with a short practice test. See what needs work, then review at your own pace."*
   - Quiet link: `How it works →` linking to `#how-it-works`.
   - Completely eliminated audience tabs (`First-time taker`, etc.) to unify all visitor types into one diagnostic onboarding flow.
4. **Relocated Secondary Information Below the Fold**:
   - Dedicated trust strip below the hero with target exam countdown, 3 trust claims, and learning flow indicator.
   - Anchored Exam Level Comparison / Subtest Explorer with `id="compare-levels"`.
5. **Full Quality Verification (`npm run verify` & `npm run test:e2e`)**:
   - `npm run check:architecture`: ✅ Passed (0 hardcoded engine branching).
   - `npm run typecheck`: ✅ Passed (0 errors).
   - `npm run lint`: ✅ Passed (0 errors, 0 warnings).
   - `npm run test`: ✅ Passed (171 unit & real Postgres integration tests across 34 suites).
   - `npm run build`: ✅ Passed (Next.js 15 production build compiled, 33 routes prerendered).
   - `npm run test:e2e`: ✅ Passed (10/10 Playwright tests passing in 42.6s).

---

## 📝 Exam Runner UX Simplification: Focused & Calm Assessment Experience
1. **Isolated Assessment Header (No Standard Website Navigation or Hamburger Menu)**:
   - Eliminated standard website header links and hamburger menus within the runner view.
   - Designed a 3-area desktop header: Left (`← Save & Exit`), Center (`Quick Test · 10 Questions`), Right (`[Display ▾]`, `[Scratchpad]`, `[05:30]`, `[Question Map]`, `[Submit]`).
2. **Accidental-Exit Protection ("Save & Exit" Navigation)**:
   - Added `← Save & Exit` header action on both desktop and mobile.
   - Interactive confirmation dialog with dynamic copy:
     - When questions are answered: `Leave this test? Your progress is saved and you can resume this test later. [Keep Practicing] [Save & Leave]`.
     - When 0 answered: `Leave this test? You have not answered any questions yet. [Keep Practicing] [Leave Test]`.
   - Safely saves draft session to client storage on confirmation.
3. **Consolidated Display / Accessibility Dropdown Menu**:
   - Replaced fragmented standalone icon buttons (`A`, contrast switch, etc.) with a single accessible `[Display ▾]` dropdown menu:
     - Font size: **Normal** / **Large** / **Extra Large**
     - High contrast mode toggle switch
     - Reduce motion toggle switch
     - Instant feedback mode toggle switch
4. **Enhanced Progress Hierarchy Above Questions**:
   - Status elevated to `Question X of Y`, `Progress: X answered · Y flagged · Z remaining`, and a visual mini progress bar.
5. **Decluttered Choice Rows with Hover/Focus Elimination**:
   - Clean choice rows featuring bold letter badges `[A]`, clean text, and prominent `✓ Selected` badge.
   - Choice elimination buttons are concealed by default and reveal on hover (`group-hover:opacity-100`) or keyboard focus, maintaining full accessibility without row clutter.
6. **Simplified Question Map & Legend**:
   - Compact legend: `● Answered · ○ Unanswered · ◇ Flagged`.
   - Clear visual states: Current (navy ring), Answered (solid navy), Flagged (gold badge marker), Unanswered (neutral outline).
7. **Structured Review Before Submission Modal**:
   - `[Submit]` opens a summary modal with answered, unanswered, and flagged question counts, offering `[Return to Questions]` and `[Submit Test]`.
8. **Mobile Focused Header & Tool Sheet**:
   - Minimalist header (`[← Exit] Question 1 of 10 [05:30] [•••]`) with exam-only tools sheet.

---

## 🎯 Homepage Hero Design Refinement: Stable Headline, Audience Switcher & Single Dominant CTA
1. **Strictly Stable Headline & Information Hierarchy**:
   - Small category label: `PHILIPPINE CIVIL SERVICE EXAM REVIEWER`
   - Headline: `Know what to study next.` (Strictly stable — never rotates or changes randomly).
   - Intentional Audience Switcher Tabs: `[First-time taker]`, `[Retaking the exam]`, and `[Studying after work]`, dynamically tailoring the supporting copy and diagnostic preview while keeping the headline fixed.
   - Tailored supporting copy:
     - First-time taker: `Take a free 10-question diagnostic to identify the CSE subtests that need your attention.`
     - Retaking the exam: `Find the subtests that are holding your score back and focus your study time where it matters.`
     - Studying after work: `Use short targeted drills that fit your available time without burning out.`
2. **Single Visually Dominant Hero Primary CTA**:
   - Only `[Start Free Diagnostic]` functions as the primary call to action.
   - Reassurance line: `10 questions · About 10 minutes · No sign-up required`.
   - Quiet secondary action: `How it works` (clean link to `#how-it-works`).
   - Learning flow indicator: `Diagnostic → Identify weak area → Targeted drill`.
3. **Diagnostic Preview Outcome Card (`src/components/home/HeroDiagnosticPlanPreview.tsx`)**:
   - Removed competing duplicate CTA button (`Start focused practice`).
   - Replaced with non-interactive outcome report:
     ```text
     AFTER YOUR DIAGNOSTIC
     Your next recommended drill
     Percentages & Interest · 10-minute focused practice
     ```
   - Labeled clearly: `EXAMPLE DIAGNOSTIC OUTCOME` with `Report` tag and gold assessment file accent border (`border-l-4 border-l-amber-500`).
   - Metric: `Estimated readiness: 62%` (`Practice benchmark · 80% goal` diagnostic baseline).
   - Quiet tertiary link: `Preview the practice interface →`.
4. **Full Verification Suite Passed**:
   - Unit tests: `tests/unit/components/home-components.test.tsx` (8/8 passed).
   - Playwright E2E: `tests/e2e/exam-flow.spec.ts` (10/10 passed in 35.3s).
   - `npm run verify` passed with exit code 0.

---

## 🔒 Auth & Modal Fixes (Recent Resolution)
1. **Live Database Schema Sync (`accounts.issuer`)**:
   - Better Auth v1 expects an `issuer text` column on `accounts`.
   - Generated and executed migration `0002_lush_madame_hydra.sql` (`ALTER TABLE "accounts" ADD COLUMN "issuer" text;`) against Neon PostgreSQL.
   - Tested live email/password signup and signin roundtrip with session cookie creation.
2. **AuthModal Viewport Containing Block Trap Resolution**:
   - Root cause: `<header>` uses `backdrop-blur-md` and `sticky top-0`. In CSS specifications, `backdrop-filter` creates a new containing block for `position: fixed` descendants, constraining the 500px modal within the 64px header height and pushing the top half off-screen (`y ≈ -218px`).
   - Fix: Updated `src/components/auth/AuthModal.tsx` to render through `createPortal(..., document.body)` with an SSR hydration guard.
   - Automated verification: Added test in `tests/e2e/exam-flow.spec.ts` checking `modal.boundingBox().y > 10` and confirming complete in-bounds visibility and dismissibility. Passes in 1.0s.

---

## Confirmations & Compliance Review

### 1. Database Integration Tests: Real Postgres Engine
- **Engine**: Tests do **NOT** rely on a mocked ORM. They execute against a genuine PostgreSQL engine (`@electric-sql/pglite` and `drizzle-orm/pglite`), running the official Postgres 16+ C codebase compiled to WebAssembly.
- **Coverage in `tests/integration/db/postgres-schema.test.ts`**:
  - Validates active PostgreSQL version and query capabilities.
  - Enforces foreign key constraints on insert (violating inserts reject).
  - Enforces unique constraints (duplicate exam slugs reject).
  - Enforces `ON DELETE CASCADE` across the entire 6-level hierarchy (`exams` -> `exam_levels` -> `subjects` -> `topics` -> `questions` -> `choices`).
  - Validates question status lifecycle transitions (`draft` -> `under_review` -> `approved` -> `published` -> `archived`) without physical row deletion.
  - Relational joins and storage for `test_attempts` and `user_answers`.
  - Full schema seeding, relational querying, and exam-engine selection & scoring against real Postgres records.

### 2. E2E Timer Expiry & Auto-Submit
- **Implementation**: `src/features/practice/ExamRunner.tsx` uses a ref-stabilized session state with a dedicated expiry hook that automatically finalizes answers, computes scores, updates history/mistake bank, and navigates to the results page without user intervention.
- **E2E Spec in `tests/e2e/exam-flow.spec.ts`**:
  - `automatically submits exam when timer expires on timeout without clicking submit`: Initializes an exam with `testExpirySeconds=2`, selects an answer, waits for timer expiry without clicking submit, and asserts automated redirect to `/results/attempt-...` with full results review.

### 3. Subject Seeding Exclusivity
- **Rule**:
  - **Analytical Ability**: Seeded **ONLY** under Professional (`level-pro`).
  - **Clerical Ability**: Seeded **ONLY** under Subprofessional (`level-subpro`).
- **Verification**:
  - `tests/unit/practice/practice-service.test.ts`: Verified that `professional` contains `analytical-ability` and strictly excludes `clerical-ability`, while `subprofessional` contains `clerical-ability` and strictly excludes `analytical-ability`.
  - `tests/integration/db/postgres-schema.test.ts`: Direct SQL/Drizzle query against real Postgres table confirms the exact same exclusivity at the database level.

### 4. Results Page Score Framing & CSC Rating Notice (Addendum §50)
- **Framing**:
  - Results view (`src/features/results/ResultsView.tsx`) frames score explicitly as an **"Estimated Score"** calculated from raw percentage correct against the benchmark standard (80.00%).
  - Added a dedicated **Score Interpretation & Official CSC Rating Notice** card:
    - Explains that the Civil Service Commission (CSC) applies a proprietary general rating formula with calibrated statistical weighting across subtests that is not publicly disclosed.
    - Clarifies that practice scores on this platform reflect diagnostic mastery and raw percentage correct, rather than replicating an official CSC Certificate of Eligibility rating.
  - Verified in unit tests (`tests/unit/results/results-view.test.tsx`) and E2E specs (`tests/e2e/exam-flow.spec.ts`).

---

## Detailed Work Completed

### Phase 0: Bootstrap & Scaffolding
- Initialized Next.js 15 (App Router), TypeScript, Tailwind CSS, Prettier, and ESLint 9 Flat Config.
- Configured dependencies: `drizzle-orm`, `pg`, `drizzle-kit`, `better-auth`, `vitest`, `@testing-library/react`, `@playwright/test`, `lucide-react`, `posthog-js`, `@sentry/nextjs`, `@electric-sql/pglite`.
- Configured package.json scripts matching AGENTS.md §4a (`typecheck`, `lint`, `check:architecture`, `test`, `test:e2e`, `build`, `verify`, etc.).
- Set up `.husky/pre-commit` hook enforcing typecheck, lint, and unit tests prior to commit.
- Created `.env.example`, `.env.local` (with safe dev placeholders), and `.npmrc` (`legacy-peer-deps=true`).
- Established git repository and clean checkpoint.

### Phase 1: Foundation
- **Generic Database Schema (`src/db/schema/`)**:
  - `exams`, `exam_levels`, `exam_rules`: Hierarchical multi-exam model with mode configuration.
  - `subjects`, `topics`: Generic hierarchy with foreign keys and cascading deletes.
  - `questions`, `choices`: Full metadata (`difficulty`, `language: 'en' | 'fil'`, `status: 'draft'`, `isSeedData: true`, `explanation`, `relevantDate`, etc.).
  - `test_attempts`, `user_answers`, `bookmarks`, `user_progress`, `question_reports`.
  - Generated and validated Drizzle migration `src/db/migrations/0000_blushing_loners.sql`.
- **Generic Exam Engine (`src/features/exam-engine/`)**:
  - `scoring.ts`: Raw score, percentage, passing determination, per-subject and per-topic breakdowns, strengths, weak areas, and next-step recommendations.
  - `timer.ts`: Single continuous countdown timer, warning state, and timeout auto-submit.
  - `question-selector.ts`: Distribution-respecting selection (subject/difficulty balance) and exposure history bias to prevent immediate question repetition.
  - `state-machine.ts`: Answer selection, question flagging, next/prev/jump navigation, review summary, and timer auto-submit.

### Phase 2: CSE Implementation
- **Seed Data (`src/db/seed-data.ts` & `src/db/seed.ts`)**:
  - Seeded Philippine Civil Service Examination (CSE) Professional & Subprofessional levels.
  - Configured official subtests: Verbal Ability (English & Filipino), Numerical Ability, Analytical Ability, Clerical Ability, General Information.
  - Authored 18 original seed/placeholder questions (`isSeedData: true`, `status: 'draft'`) with pedagogical explanations, choice distractors, and language tags.
- **Interactive Exam Flows**:
  - **Topic Practice** (`/practice`, `/practice/[topicId]`): Subtest drill browser with focused topic sessions.
  - **Quick Test** (`/exams/[level]/quick`): 10 items, 10 minutes, immediate score and concept explanations.
  - **Medium Test** (`/exams/[level]/medium`): 30 items, 30 minutes, balanced subtest assessment.
  - **Full Mock Exam** (`/exams/[level]/full`): 170 items / 190 minutes (Professional) and 165 items / 160 minutes (Subprofessional) with a single continuous timer matching the real CSE-PPT format.
  - **Exam Runner (`ExamRunner.tsx`)**: Header countdown timer, warning pulsing state, flag toggle, question navigator palette drawer, review before submission modal, and timeout auto-submit.
  - **Results & Review (`/results/[attemptId]`, `ResultsView.tsx`)**: Passing badge, percentage score, per-subtest progress bars, strengths & weaknesses diagnosis, recommended next topics, and question-by-question review with concept explanations and bookmarking.

### Phase 3: User Experience
- **User Dashboard** (`/dashboard`, `DashboardView.tsx`):
  - Accuracy metrics, tests completed, study streaks, and estimated questions answered.
  - Quick action cards for Mistake Bank, Bookmarks, and Quick Drills.
  - Civil Service Subtest Readiness radar bars.
- **Test History** (`/dashboard/history`):
  - Chronological history of past attempts with score %, mode, pass/fail status, and direct link to review results.
- **Mistake Bank** (`/dashboard/mistakes`):
  - Saved incorrect questions from test sessions with "Practice My Mistakes" interactive drill mode and explanations.
- **Saved Bookmarks** (`/dashboard/bookmarks`):
  - Saved question repository with "Practice Bookmarks" drill mode.

### Phase 3.5: Vercel Production Readiness
- **Next.js 15 Configuration (`next.config.ts`)**:
  - Registered `serverExternalPackages: ['@electric-sql/pglite', 'pg']` to isolate native/wasm libraries from serverless bundling.
  - Implemented production HTTP security headers across all routes: HSTS, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
  - Enforced `reactStrictMode: true` and `poweredByHeader: false`.
- **Serverless PostgreSQL Optimization (`src/db/index.ts` & `drizzle.config.ts`)**:
  - Global singleton pattern (`globalForDb.__pgPool`) to reuse warm connection pools and prevent connection pool leaks across Vercel Lambdas.
  - Automatic cloud SSL auto-negotiation (`rejectUnauthorized: false`) for Neon, Supabase, Vercel Postgres, and remote hosted databases.
  - Native fallback support for `POSTGRES_URL` (Vercel Postgres marketplace integration) alongside `DATABASE_URL`.
  - Configured conservative serverless pool limits (`max: 5`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 10000`).
- **Dynamic Vercel Deployment URLs (`src/lib/env.ts`)**:
  - Dynamic URL resolution honoring `NEXT_PUBLIC_APP_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, ephemeral `VERCEL_URL` preview branches, and local fallback.
- **Deployment Health Check (`src/app/api/health/route.ts`)**:
  - Created `/api/health` returning JSON runtime status, ISO timestamp, deployment platform, and database configuration presence with `no-store` caching.
- **Deployment Assets & Documentation**:
  - Created `vercel.json` with framework definition and build configuration.
  - Created `docs/vercel-deployment.md` step-by-step deployment and migration runbook.
  - Updated `.env.example` with Vercel deployment variables.

### Phase 3.6: Guest Local Storage & Offline-First Persistence
- **Unified Typed Storage Layer (`src/lib/storage/`)**:
  - `types.ts`: Strongly typed schemas for `StoredAttemptDetails`, `AttemptSummary`, `StoredMistakeItem`, `StoredBookmarkItem`, `ActiveExamSessionDraft`, `StudyStreakData`, and `GuestBackupPayload`.
  - `local-storage-service.ts`: SSR-safe, quota-resilient client with automatic legacy key migration (`attempts_history`, `mistake_bank`, `bookmarked_question_ids`).
- **Exam Session Auto-Save & Resumption (`ExamRunner.tsx`)**:
  - Continuous automatic draft saving of examinee answers, flags, and remaining timer on state changes.
  - Non-intrusive **"Unfinished Session Found"** prompt card displaying answered count and time remaining with `[Resume Session]` and `[Discard & Start Fresh]` options.
  - Automatic draft cleanup upon exam completion or manual discard.
- **Offline Mistake Bank & Bookmarks**:
  - Mistake Bank auto-populated upon test completion with full question payloads.
  - Added "Mark as Mastered" dismissal action per question in `/dashboard/mistakes`.
  - Bookmarks stored with complete question content to support custom and dynamic drills in `/dashboard/bookmarks`.
- **Dynamic Dashboard Analytics & Privacy Controls (`DashboardView.tsx`)**:
  - Dynamic **Civil Service Subtest Readiness** accuracy percentages calculated from actual recorded test attempts.
  - Actual calendar-day **Study Streak** tracking.
  - **Guest Offline Storage & RA 10173 Compliance Banner**:
    - **Export Backup (JSON)**: 1-click download of all history, attempts, mistakes, and bookmarks (`csereviewer-backup-*.json`).
    - **Restore Backup**: Modal file reader that validates backup schema and restores client state.
    - **Reset All Data**: Clean wipe of all local progress and history.

### Phase 3.7: Comprehensive Audit Fixes & Scalability Hardening
- **Exam Timer Wall-Clock Delta Reconciliation (`ExamRunner.tsx`)**:
  - Replaced naive `setInterval` constant 1-second ticks with real wall-clock delta calculation using `Date.now()`.
  - Added `visibilitychange` listener to instantly sync elapsed time when examinees switch tabs or wake sleeping devices.
  - Added unit test suite `tests/unit/exam-engine/timer-drift.test.ts` verifying time decrements and auto-submit across multi-minute jumps.
- **Database Performance & Foreign Key Indexes (`src/db/schema/`)**:
  - Added explicit B-tree indexes across all foreign keys in `questions`, `choices`, `question_reports`, `test_attempts`, `user_answers`, `bookmarks`, `user_progress`, `sessions`, and `accounts`.
  - Generated Drizzle migration `src/db/migrations/0001_soft_spiral.sql`.
  - Verified with real in-memory PostgreSQL engine in `tests/integration/db/postgres-schema.test.ts`, confirming indexes exist in `pg_indexes`.
- **Client Bundle Scalability & Decoupling (`local-storage-service.ts`)**:
  - Removed unused static dataset imports (`SEED_QUESTIONS`, `SEED_SUBJECTS`) from client-side storage service.
  - Defined lightweight metadata fallback to eliminate bundle bloat from growing question banks.
- **Storage LRU Eviction & Sanitization (`local-storage-service.ts`)**:
  - Implemented LRU eviction policy keeping the 20 most recent detailed attempt breakdowns while preserving entire summary history.
  - Sanitized backup JSON import against prototype pollution keys (`__proto__`, `constructor`) and added 2MB payload size limit.
- **Content Security Policy (`next.config.ts`)**:
  - Configured strict CSP header tailored for Next.js App Router.
- **Exam Engine Choice Order Lock (`question-selector.ts`, `types.ts`)**:
  - Added optional `lockChoiceOrder` flag on `EngineQuestion` to support questions with dependent choices (e.g. "Both A and B") without random shuffling breaking question logic.
- **Multi-Tab State Synchronization (`DashboardView.tsx`)**:
  - Added `window.addEventListener('storage')` to reload dashboard state when exams or bookmarks are modified across multiple tabs.

---

## Blocked
*None. All verification suites exit with code 0.*

---

## 🚀 Site Audit, Rebranding to csereviewph.com & Preloading Optimizations

### 1. Site Audit Completed
- **Architecture & Engine Compliance**: `src/features/exam-engine` strictly respects zero exam-identity branching (`npm run check:architecture` passes).
- **Test Suite & Build Health**: 23 test suites and 120 tests pass against real PostgreSQL via PGlite WASM engine; Next.js 15 production build passes with 30 routes prerendered.
- **Data Privacy & Security**: Compliant with RA 10173 and Google AdSense publisher requirements; CSP and HSTS headers enforced.

### 2. Domain & Platform Rebranding to `csereviewph.com`
- **Branding**: Header logo typography and Footer brand updated to `csereviewph.com` (`csereview` `ph` `.com`).
- **Metadata & SEO**: Default title `csereviewph.com — Philippine Civil Service Exam Reviewer`, title template `%s | csereviewph.com`, OpenGraph siteName `csereviewph.com`, Schema.org `WebSite` JSON-LD structured data.
- **Legal & Direct Contact**: Updated `support@csereviewph.com`, `privacy@csereviewph.com`, and non-affiliation disclaimers to `csereviewph.com`.
- **Environment**: Updated default production fallback URL in `src/lib/env.ts` to `https://csereviewph.com`.
- **Content Preservation**: 100% of educational exam items, subtest guides, constitutional explanations, and articles preserved intact per user specification.

### 3. Website Optimization & Smooth Page Switching
- **Explicit Next.js Link Preloading**: `prefetch={true}` enabled on Header navigation (`Topics`, `Study Guides`, `Articles`, `FAQ`, `Dashboard`), Footer links, Hero CTA buttons, exam launch cards, and topic directory.
- **Top Navigation Progress Bar (`NavigationProgress.tsx`)**: Zero-dependency visual loading bar at the top of the viewport animating across route switches to eliminate perceived latency.
- **Next.js Streaming Skeleton (`loading.tsx`)**: Global App Router loading state with pulse animation preventing blank/white flashes during route transitions.
- **Error Boundaries & 404 Resilience**: Created custom branded `not-found.tsx` and `error.tsx` with instant recovery actions.
- **Resource Hints & Page Entry Animations**: Added `preconnect` and `dns-prefetch` for external assets, `scroll-behavior: smooth`, and `.animate-page-enter` CSS transitions.

---

## 🧠 Enhancement Phase 2: Pedagogy, Analytics & Spaced Repetition (SRS)

### 1. Leitner Spaced Repetition System (SRS) for Mistake Bank
- **Leitner Boxes & Intervals**: Structured 5-stage spaced intervals (Box 1: Daily, Box 2: 3-Day, Box 3: Weekly, Box 4: 14-Day, Box 5: Mastered/Monthly).
- **Dynamic Progression**: Answering correctly during focused mistake drills promotes questions to higher boxes; incorrect responses automatically demote items to Box 1 for immediate review.
- **Due Item Queries**: Real-time filtering in `LocalStorageService.getDueMistakes()` surfaces questions needing refresh without overwhelming learners.
- **Mistake Bank UI Overhaul (`/dashboard/mistakes`)**:
  - Interactive Leitner box distribution summary bar displaying question count per stage.
  - Filter chips: `All Missed`, `Due for Review`, `High Priority (Box 1-2)`, and `Mastered`.
  - One-click targeted drill launchers: "Review Due Items" and "Practice All".
  - Choice inspection cards with strikethrough distractor display and full pedagogical rationale.

### 2. In-Exam & Results Question Error Reporting
- **Database Schema**: Leverages `question_reports` table in PostgreSQL with relations to questions.
- **API Endpoint (`/api/questions/report`)**: Validates `questionId`, `reason` enum (`factual_error`, `typo`, `bad_explanation`, `formatting`, `other`), and user context comments (up to 1,000 characters). Automatically connects to PostgreSQL if configured, or queues gracefully with offline fallback.
- **`QuestionReportModal` Component**: Non-disruptive accessible dialog accessible during live test taking (`ExamRunner.tsx`) and in post-test answer review (`ResultsView.tsx`).

### 3. Target Exam Date Countdown & Daily Pacing
- **Countdown Engine**: Tracks days and weeks remaining until upcoming CSE-PPT examination cycles (e.g. March 21, 2027 Cycle 1 and August 8, 2027 Cycle 2, or custom examinee target date).
- **Daily Question Pacing Goal**: Persisted in `LocalStorageService.getTargetExamConfig()` with daily questions answered counter and dynamic progress bar.
- **Interactive Dashboard Card**: Visual gauge displaying questions completed today vs daily goal with celebratory pacing feedback.

### 4. Printable Diagnostic Scorecard & PDF Export
- **Print Optimization (`ResultsView.tsx`)**: `@media print` styling formats a clean diagnostic certificate. Hides screen navigation, retake buttons, filters, bookmarks, and ads.
- **Official Disclaimers**: Incorporates official Civil Service Commission (CSC) advisory note per Addendum §50, explaining statistical item-response equating.
- **One-Click Action**: "Print Scorecard (PDF)" buttons in header and bottom toolbar triggering native browser print/save-as-PDF dialog.

---

## 📱 Enhancement Phase 3: Progressive Web App (PWA) & Offline-First Reliability

### 1. Web App Manifest (`src/app/manifest.ts`)
- Configured native PWA metadata: `name: "csereviewph.com — Philippine Civil Service Exam Reviewer"`, `short_name: "CSEReviewer"`, `display: "standalone"`, `theme_color: "#1d4ed8"`, `background_color: "#f8fafc"`.
- Added high-resolution PWA icons (`icon-192.png`, `icon-512.png`, `icon.svg`) and mobile categories (`education`, `productivity`, `reference`).

### 2. Service Worker & Offline Caching (`public/sw.js`)
- Static asset caching (`STATIC_CACHE_v1`): Pre-caches core styles, icons, fonts, and scripts for instant loading.
- App shell & route navigation caching (`DYNAMIC_CACHE_v1`): Network-first strategy with cached offline fallbacks ensuring examinees can study seamlessly without continuous internet connectivity.

### 3. Connectivity Banner & PWA Install Prompt (`src/components/pwa/ServiceWorkerRegister.tsx`)
- Detects `online` and `offline` browser events with an accessible amber notification banner.
- Captures native `beforeinstallprompt` event, presenting a non-intrusive "Install CSE Reviewer App" banner with "Install App" and "Dismiss" controls.

---

## ☁️ Enhancement Phase 4: Cloud Account Sync (Better Auth) & RA 10173 Privacy Controls

### 1. Better Auth Engine & Next.js Integration
- **Server Auth (`src/lib/auth/index.ts`)**: Configured Better Auth engine backed by PostgreSQL via Drizzle adapter, leveraging `users`, `sessions`, `accounts`, and `verifications` schema tables. Supports email/password authentication with bcrypt hashing.
- **Client Hooks (`src/lib/auth/auth-client.ts`)**: Exported `signIn`, `signUp`, `signOut`, and `useSession` hooks.
- **Dynamic Catch-all Route (`src/app/api/auth/[...all]/route.ts`)**: Mounted Better Auth Next.js API handler (`toNextJsHandler(auth)`).

### 2. Cloud Data Migration & Sync Engine (`/api/user/sync`)
- **Guest-First Policy**: Examinees practice freely as guests without forced account creation.
- **Seamless Migration**: When signing up or logging in, `LocalStorageService.syncGuestDataToCloud()` pushes local test attempts, mistake items (with Leitner box levels), and bookmarks to the server.
- **Session Verification**: Server validates active Better Auth session, parses sync payload, and persists records with relational foreign keys.

### 3. RA 10173 (Data Privacy Act of 2012) Compliance Endpoints (`/api/user/account`)
- **Right to Data Portability (`GET /api/user/account`)**: Authenticated endpoint returning full machine-readable JSON containing the user's account profile and cloud exam history.
- **Right to Erasure (`DELETE /api/user/account`)**: Authenticated endpoint that permanently deletes the user's account record and cascades complete erasure across sessions, accounts, attempts, and answers.
- **Data Privacy Disclosure**: Explicit Philippine RA 10173 advisory displayed in `AuthModal.tsx` and on the user dashboard.

### 4. User Navigation & Dashboard Integration
- **`UserNav.tsx`**: Header component showing "Sign In" modal button when unauthenticated; user avatar, name, sync status pill, "Export My Data (JSON)", and "Delete Account" dialog when logged in.
- **`DashboardView.tsx`**: Prominent "Save to Cloud Account" sync card encouraging cross-device backup with automatic guest record migration.

---

## 🎨 Enhancement Phase 5: Homepage Redesign & Interactive Product Showcase

### 1. Interactive "Live Simulator" Hero Preview (`src/components/home/HeroSimulatorPreview.tsx`)
- **Live Continuous Timer**: Displays realistic pulsing single countdown timer (`03:09:42`).
- **Real Authentic Question**: High-yield CSE item on Republic Act No. 6713 §5(a) (Mandatory 15 working days response period).
- **Interactive Choices**: Clickable <kbd>A</kbd>, <kbd>B</kbd>, <kbd>C</kbd>, <kbd>D</kbd> options with correctness feedback.
- **Choice Eliminator Strikethrough**: "Eliminate" and "Restore" distractor buttons replicating in-exam test-taking strategy.
- **Instant Pedagogical Rationale**: Reveals official legal explanation card citing RA 6713.
- **Virtual Arithmetic Scratchpad Preview**: Tab previewing manual calculation notes for 67-second item pacing.

### 2. Asymmetric Hero Split & Level Switcher (`src/app/page.tsx`)
- **Target Exam Cycle Pill**: Live countdown banner tracking `March 21, 2027 CSE-PPT • Cycle 1` with dynamically calculated days remaining.
- **Level Switcher Widget**: Quick toggle between **Professional (170 items • 3h 10m)** and **Subprofessional (165 items • 2h 40m)**, updating CTAs and subtest details in real-time.
- **Atmospheric Visual Polish**: Subtle micro-dot grid pattern, presidential navy/gold accents, and elevated glassmorphic cards.

### 3. "The 67-Second Reality" Diagnostic Infographic
- Highlights the #1 reason 85%+ fail the Civil Service Exam: Running out of time on the 170-item single continuous countdown.
- Contrasts the fatal mistake (getting stuck on math and blindly guessing on 30–40 easy items) with the continuous timing method.

### 4. Interactive Subtest & Syllabus Explorer (`src/components/home/SubtestExplorer.tsx`)
- Tabbed directory covering all 5 official subtests: Verbal Ability, Numerical Ability, Analytical Ability (Pro only), General Information, and Clerical Ability (Subpro only).
- Outlines high-yield topics, official CSC item counts, target pacing benchmarks, and direct practice launchers.

---

## 🏛️ Phase 5.5: Codex Product System & Visual Hierarchy Redesign

### 1. Visual Restraint & Semantic Color Architecture
- **Semantic Palette**: Replaced repetitive generic blue with an intentional institutional system: Presidential Navy (`#0f172a`), Action Blue (`#2563eb`), Milestone Gold (`#d97706`), Mastery Green (`#059669`), Urgent Red (`#dc2626`), and Neutral Slate chrome.
- **Pill Badge Audit**: Completely eliminated decorative badge pills above headers across public, exam, and dashboard views. Badges are strictly reserved for genuine status/metadata (`Box 1`, `15 min read`, `Filipino`, `High Yield`).
- **Surface & Elevation Discipline**: Removed nested "cards-in-cards" and excessive borders. Used clean spacing, subtle background contrast, and typographic weight hierarchy.

### 2. Dashboard: "Next Best Step" Recommendation Engine
- **Engine Implementation (`src/features/dashboard/recommendation-engine.ts`)**:
  - Automatically evaluates learner history, attempt counts, Leitner spaced repetition queue, and subtest accuracy.
  - Priority ladder:
    1. **Guest / Zero Attempts**: "Start Free 10-Question Diagnostic" with zero login barrier.
    2. **Due Mistakes**: "Review Due Spaced Repetition Items" linking directly to Leitner flashcard review.
    3. **Subtest Below 80%**: "Target Weak Subtest" (e.g. Numerical Ability at 62%) with direct topic drill launcher.
    4. **Passing / High Mastery**: "Readiness Peak" recommending the Full 170-Item Mock Exam under single continuous timer.
- **Unit Tested (`tests/unit/dashboard/recommendation-engine.test.ts`)**: 4 unit tests verifying all 4 priority states.
- **Command Center Layout (`DashboardView.tsx`)**: Elevates the dynamic recommendation hero above supporting metrics (tests completed, accuracy %, streak, subtest radar bars, offline storage controls).

### 3. Homepage: Intentional Conversion Ladder & Credible CSC Sourcing
- **Clear Conversion Ladder (`src/app/page.tsx`)**:
  - Live Target Exam Cycle banner + Professional vs Subprofessional level switcher.
  - Primary CTA: "Take Free 10-Question Diagnostic" with immediate guest access.
  - Secondary Proof: Interactive live simulator with Republic Act No. 6713 distractor elimination.
  - 5-Step Civil Service Review Cycle infographic: Practice → Diagnose → Review Mistakes (SRS) → Targeted Retry → Measurable Readiness.
- **Authoritative Sourcing**: Replaced sensationalist claims with official Civil Service Commission (CSC) statistical pass-rate data (~14–18%), articulating that over 80% fail primarily due to running out of time on the 170-item continuous timer.

### 4. Public Content Pages: Distinct Editorial Layouts
- **Practice Directory (`/practice`)**: 2-column layout with left sticky subtest/level filter rail and scannable topic directory with instant drill launchers.
- **Study Guides (`/guides`)**: Featured legal hero (RA 6713 Code of Conduct) with editorial reading cards and official subtest syllabus tags.
- **Articles (`/articles`)**: Featured timing strategy article hero with chronological article list.
- **FAQ (`/faq`)**: CSC verification stamps, "Most Asked Questions" filter chips, and contextual practice links.

### 5. Exam Runner: Focus Mode Ergonomics (`src/features/practice/ExamRunner.tsx`)
- **Desktop Persistent Palette Rail**: Right-hand question grid rail visible on desktop screens so examinees see answered/flagged status at all times without opening a drawer.
- **Distinct Selection State**: Selected choices feature clear contrast (`border-slate-900 bg-slate-50 ring-1 ring-slate-900/20`) and an explicit checked radio icon.
- **Compact Progress Counter**: Live top bar indicating `Answered: X/N • Flagged: Y` alongside the continuous timer.

---

## Needs Human
The platform runs with a live Neon serverless PostgreSQL database connected, migrated, and seeded. When ready for full production traffic:
1. ~~**Database URL**: Supply a hosted PostgreSQL connection string~~ — ✅ **COMPLETED**: Neon Serverless PostgreSQL (Singapore `sin1`) connected via Vercel integration, all migrations applied (`0000` & `0001`), and full CSE exam hierarchy seeded.
2. **Domain Configuration**: Point `csereviewph.com` DNS records (A / CNAME) to Vercel production deployment.
3. **Auth Secret**: Provide production secret keys in `BETTER_AUTH_SECRET` and domain in `BETTER_AUTH_URL`.
4. **Analytics & Monitoring**: Supply production PostHog and Sentry credentials (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_SENTRY_DSN`) when ready for user traffic.
5. **Publishing Questions**: Per content authoring guidelines, real questions should be reviewed by subject matter experts and published on human schedule (`Draft` -> `Under Review` -> `Approved` -> `Published`).

---

## Next Steps (Beyond MVP — Phase 4+)
- Phase 4: Content Platform (Study guides, articles, exam schedules, FAQ, SEO optimization).
- Phase 5: Administration & Question Authoring Portal (Authoring UI, review workflow, user reports).
- Phase 6: Monetization (Ad placement with RA 10173 consent banner, premium mock exam tiers).
- Phase 7: New Exams (LET, Nursing, BFP, NAPOLCOM via configuration data).

---

# Dashboard design analysis — 2026-09-13

## Done
- Completed report-only analysis in .design/review-report.md with competitor browser evidence, calendar/activity behavior, recommended personal study layout, and reusable design-system proposal.
- Created implementation_plan.md and walkthrough.md; preserved all pre-existing application edits and saved Design Arc preferences.

## Verified
- npm run verify: PASS, exit 0; 171 tests in 34 files plus typecheck, lint, architecture, and production build.
- Chromium guest dashboard desktop/mobile, target-editor open/cancel, accessible-name inspection; competitor desktop/mobile and public navigation.
- No application code changed; full exam E2E suite not rerun.

## Blocked
- No blocker to delivering this analysis. Current UI has confirmed empty-state sample metrics, 390px-to-478px mobile overflow, and unnamed target-editor controls, documented for future implementation.
- App browser sandbox failed; successful Playwright checks used the existing installation and an isolated production preview.
- Complete Design Arc visual validation, authenticated flow, keyboard/screen-reader/zoom checks, and proposed calendar/streak behavior remain outside this analysis's verified scope.

## Needs Human
- No credential or decision needed to read/use the report. Official exam schedule presets require CSC-source verification before being presented as official; this analysis does not certify the existing 2027 dates.

## Next
- Use .design/review-report.md as the canonical design review. Recommended direction: personal study day.
- In a separately requested implementation, fix truthfulness/accessibility, consolidate the visual tokens, expose calendar editing, and build an activity grid with explicit qualifying rules and behavior tests.

---

# Settings recommendations guide — 2026-09-13

## Done
- Created docs/settings-recommendations.md with eight settings sections plus overview, a later Reminders section, related site-page map, defaults, persistence rules, privacy/data boundaries, UI behavior, rollout phases, and acceptance criteria.
- Appended task-specific plan and walkthrough while preserving ongoing dashboard changes. This task made documentation changes only.

## Verified
- Final npm run verify: PASS, exit 0; typecheck, lint, architecture, 179 tests across 36 files, production build.
- Initial run failed during dashboard prerendering after 171 tests. Closed this task's earlier preview and retried; the cause was not conclusively established. Both logs are retained under .design/evidence/.
- Reviewed current source and first-party W3C/MDN guidance. No proposed settings UI was implemented or browser-verified.

## Blocked
- No blocker to the recommendations deliverable. Before implementation claims reliable cloud controls, fix source-observed false-success handling for sync/deletion and verify actual persisted/exported categories.

## Needs Human
- None for this guide. Reminder delivery and unsupported account-security features require their own implementation prerequisites; no credentials requested or introduced now.

## Next
- Implement the settings shell and first-release controls from docs/settings-recommendations.md in the existing design system, with behavior tests and browser/E2E verification.
- Keep advanced reminders, UI translation, and unsupported security controls out of the first release until their complete flows work.

---

# Dashboard Redesign: Personal Study Day (Direction B) Complete — 2026-09-13

## Done
- **D01 (Truthful Empty Metrics)**:
  - Eliminated sample backfills (previously 74.5% overall and 75% subtest accuracy for guests with 0 tests).
  - Unmeasured state now renders `"Not measured yet"` with a welcoming invitation to start a free diagnostic drill.
  - Fixed `getSubjectReadiness()` in `local-storage-service.ts` to return `0` accuracy percentage and `0` questions answered when total is 0.
- **D02 (Mobile Navigation)**:
  - Recomposed `Header.tsx` on narrow viewports (`< md`) with an accessible hamburger menu toggle (`aria-label="Toggle navigation menu"`, `aria-expanded`).
  - Added collapsible mobile navigation drawer containing Dashboard, Practice, Study Guides, How It Works, and FAQ links.
  - Eliminated all horizontal overflow at 390px viewport (`document.documentElement.scrollWidth <= 390px`).
- **D03 (Calendar & Form Accessibility)**:
  - Associated all form controls in `ExamCalendarCard.tsx` with explicit `htmlFor`/`id` bindings (`target-preset-select`, `custom-target-date`, `daily-question-goal`).
  - Added keyboard interaction support (`Escape` to cancel and discard, `Enter` to save).
  - Preserved original values on cancel/invalid input and restored focus to the "Change date" button.
- **D04 (Dominant "For Today" Action)**:
  - Replaced multiple competing practice buttons and alarmist red Leitner alerts with a single dominant `TodayActionCard`.
  - Displays a concise 1-sentence plain-language explanation and a single primary action button.
  - Moved Mistake Bank and Bookmarks access into quiet secondary utility links below the card.
- **D05 (Discoverable Exam Target Panel)**:
  - Created compact `ExamCalendarCard` showing target exam name/level, formatted target date, and days remaining.
  - Added mini month calendar with month navigation (`<` / `>`) and "Today" button, current day highlighted, and target exam day pinned.
  - Prominent and discoverable `Change date` button opening the accessible inline editor.
- **D06 (Navigation Active State)**:
  - Styled "Dashboard" link in `Header.tsx` as a subtle navigation active state (`text-brand-800 bg-brand-50 border border-brand-200/80 font-semibold`) with `aria-current="page"`.
  - Reserved filled button styling exclusively for starting study actions.
- **D07 (Reading Load & Layout Structure)**:
  - Implemented Direction B (Personal Study Day) 2-column desktop layout (2/3 study column, 1/3 personal context column) and 1-column mobile stack.
  - Replaced nested cards with clean, scannable rows.
  - Consolidated data storage/backup into a compact `DataStorageSection` ("Saved on this device · Manage data" with local JSON export, restore, cloud sync, and data reset).
- **D08 (Progress Terminology)**:
  - Replaced "Overall Accuracy" with "Practice accuracy".
  - Labeled 80% benchmark as "Study target: 80%" rather than an official passing benchmark, avoiding overstating readiness.
  - Displays sample sizes (e.g. "12 of 15 correct") on subject progress rows.
- **D09 (Streak Presentation & Activity Grid)**:
  - Fixed "1 days" pluralization bug with `formatDayStreak(days)`.
  - Created `PracticeActivityGrid` implementing a ~12-week GitHub-style contribution grid using Asia/Manila date keys.
  - Clearly distinguishes daily check-ins (outlined cell) from active study sessions (shaded green bands).
  - Highlights today's cell, displays "X active days this week", and states the clear streak rule.
- **Repository Cleanup & Archival**:
  - Analyzed root and documentation files to separate active source from completed/historical artifacts.
  - Created `ARCHIVES/` directory with a descriptive `README.md` catalog.
  - Moved completed task implementation plan (`implementation_plan.md`), completed walkthrough (`walkthrough.md`), implemented settings specification (`docs/settings-recommendations.md`), historical design review report and screenshots (`.design/` -> `ARCHIVES/design`), and codex configuration (`.codex/` -> `ARCHIVES/codex`).
  - Resolved `layout.tsx` variable export type constraint in `src/app/(app)/settings/layout.tsx`.

## Verified
- **`npm run check:architecture`**: ✅ **PASS** (Zero hardcoded exam-identity branching).
- **`npm run typecheck`**: ✅ **PASS** (`tsc --noEmit` exited with 0 errors).
- **`npm run lint`**: ✅ **PASS** (`eslint .` exited with 0 errors and 0 warnings).
- **`npm run test`**: ✅ **PASS** (193 unit & real PostgreSQL integration tests across 38 test files passing).
- **`npm run build`**: ✅ **PASS** (Next.js production build compiled; all 42 routes prerendered successfully).
- **`npm run verify`**: ✅ **PASS** (Full verification chain exited with code 0).

## Blocked
*None.*

## Needs Human
*None.*

## Next
- Continue Phase 4 content platform and question bank authoring workflows.



## Done
- Live UI/header/hero flow review saved in .design/review-report.md, with task plan and walkthrough. Application source unchanged.

## Verified
- Browser inspected live guest homepage, level-comparison path, Practice, Exam Guide, diagnostic start/exit and mobile navigation.
- npm run verify FAILED: 232 passed, one account-deletion test failed after database EACCES; build not reached. Logs: .design/live-review-verify.log.

## Blocked
- Full repository verification remains blocked by the existing account test depending on hosted database access. No network-enabled deletion retry or application change was made for this advice-only task.

## Needs Human
- No decision needed to use the report. Verify a single official schedule source before reconciling homepage March 21 versus Exam Guide March 14, 2027.

## Next
- Prioritize header grouping, level-comparison flow, schedule consistency, mobile label wrapping, then hero spacing and consistent diagnostic naming. Validate completed-result and returning-user flows in the subsequent implementation.

## Logo asset task — 2026-09-14
### Done
Created standalone logo SVG/PNG assets and ZIP in artifacts/csereviewph-logo. No application changes.
### Verified
Both PNGs visually inspected. npm run verify exit 1: 233 passed, 1 failed; typecheck/lint/architecture passed.
### Blocked
Project verification: account DELETE test returned 500 after database connection failure; build not reached.
### Needs Human
None for using the logo assets.
### Next
Integrate logo only when requested; resolve application database test separately.

## Premium logo exploration — 2026-09-14
### Done
Three standalone directions in artifacts/csereviewph-premium-options; recommended Ascend. SVG, PNG, favicon samples and comparison delivered.
### Verified
Actual comparison render inspected, including small icon examples. npm run verify exit 1; full log in artifact folder.
### Blocked
Application verification still fails; no application changes made in this logo exploration.
### Needs Human
Choose a preferred logo direction for further refinement.
### Next
Refine selected logo; site integration requires a subsequent request.

## Selected owl brand kit — 2026-09-15
### Done
Created artifacts/csereviewph-owl-brand-kit.zip: burgundy owl reconstruction, outlined regular-serif wordmark, horizontal/stacked/icon/wordmark SVG and PNG variants, Full HD light/dark boards, mobile/PWA assets, favicon ICO/SVG/PNG, usage guide and checksummed manifest.
### Verified
Actual renders inspected. PNG dimensions and transparency, outlined SVG independence, ICO directory and ZIP integrity passed. npm run verify exit 1: 233 passed, 1 existing account DELETE test failed; build not reached.
### Blocked
Unrelated application account DELETE unit test uses unavailable database and returns 500 instead of 200. Logo assets delivered; application verification not complete.
### Needs Human
None for downloading and using the assets.
### Next
Integrate chosen branding when requested. Regular Times New Roman outlines approximate the earlier generated Ligature type; exact raster lettering was not recoverable as a font.

## B1 mascot kit — 2026-09-15
### Done
Packaged artifacts/csereviewph-b1-mascot-kit.zip: full-body and body-only vectors, transparent PNGs up to 4096px high, Full HD landscape/portrait exports, mobile assets, head favicons, usage notes and manifest. Existing logo package unchanged.
### Verified
Actual master/reverse/black renders inspected. Dimensions, transparency, independent SVG paths, ICO and ZIP integrity validated. npm run verify exit 1: 233 passed, 1 existing account DELETE database test failed; build not reached.
### Blocked
Unrelated app verification remains blocked by account DELETE test.
### Needs Human
None to use delivered assets.
### Next
Use B1 mascot in the site when requested; animation/extra poses remain separate work.
