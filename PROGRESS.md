# CSEReviewerPH / ReviewTayo — Current Handoff
Full prior status is archived in ARCHIVES/progress-history.md.

**Current Status: REVIEWTAYO MULTI-EXAM REPOSITIONING PLANNED**
*The umbrella-platform product, route, SEO, data-context, rollout, and verification plan is documented. No application code changed in this planning unit.*

## Done
- **ReviewTayo multi-exam platform plan**:
  - Defined ReviewTayo as the master brand and CSE as its first live reviewer.
  - Planned a new root hero, reviewer catalog, `/reviewers`, and `/cse` entry page.
  - Defined honest `Available`/`Beta`/`Coming soon` states for future exams.
  - Planned phased route migration that preserves existing CSE SEO URLs initially.
  - Defined shared exam catalog, explicit `examId` context, launch gates, acceptance criteria, and verification coverage.
- **CI / GitHub Actions E2E Failures Resolved**:
  - `src/components/layout/Header.tsx`:
    - Fixed mobile navigation drawer accessibility contract: added `aria-controls="mobile-navigation"`, wrapped mobile drawer inside `<nav id="mobile-navigation" aria-label="Mobile navigation">`.
    - Added dedicated `<button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">` inside the mobile drawer.
    - Preserved constant `aria-label="Open navigation menu"` with dynamic `aria-expanded` on the hamburger toggle button.
  - `tests/e2e/seo-browser-verification.spec.ts`:
    - Seeded `csereviewer_cookie_consent` in `test.beforeEach` to eliminate overlay interference.
    - Updated mobile navigation test to use accessible role locators: `page.getByRole("button", { name: "Open navigation menu" })`, `page.getByRole("navigation", { name: "Mobile navigation" })`, and `mobileNav.getByRole("button", { name: "Close navigation menu" })`.
    - Added `page.waitForLoadState("networkidle")` to ensure client-side React hydration finishes before user interactions.
  - `tests/e2e/exam-guide.spec.ts`:
    - Aligned page title regex with canonical title: `/CSE Exam Schedule, Requirements & Testing Centers/i`.
    - Resolved heading query ambiguity by scoping to `sourcesSection.locator("#official-sources-list")` and awaiting `networkidle` before clicking `expandBtn`.
- **Preview Deployments Noindex Shielding**:
  - `src/lib/seo/schema.ts`: Added typed `getRootRobots(previewMode: boolean)` builder.
  - In preview mode (`VERCEL_ENV === "preview"`), explicitly sets `index: false, follow: false` on both root `robots` and `googleBot`.
  - In production mode, sets `index: true, follow: true` with Googlebot image preview permissions.
  - `src/app/layout.tsx`: Removed duplicate `robots` declaration that previously overwrote the preview conditional.
  - `tests/unit/seo/metadata.test.ts`: Added automated unit test verifying both preview and production branches.
- **Content Claim Refinement & Factual Accuracy**:
  - `src/lib/content/articles.ts`:
    - Softened scoring mechanism claims: *"CSC does not publicly disclose whether or how raw correct answers are converted, weighted, or calibrated when calculating the official General Rating."*
    - Softened negative marking assertions to reflect that official CSC guidelines direct examinees to answer all items and do not prescribe point deductions for incorrect answers.
    - Softened SG-10 eligibility statements to reflect that qualification depends on the position level and approved agency Qualification Standards manuals rather than salary grade alone.
- **SERP Title Length Lower & Upper Bounds**:
  - Updated `tests/unit/seo/metadata.test.ts` to assert that every article and guide `${title} | ReviewTayo` is strictly between 45 and 60 characters (enforcing both `>= 45` and `<= 60`).
- **Harmonized Googlebot Robots.txt & Universal Canonical Normalization**:
  - `src/app/robots.ts`: Repeated all protected route disallows under `Googlebot`.
  - `src/lib/env.ts`: Centralized canonical generation via `CANONICAL_ORIGIN = "https://www.reviewtayo.online"`.

## Verified
- Latest `npm run verify` passed with **Exit Code 0** after the multi-exam planning update: typecheck, lint, architecture check, **50 test files / 303 tests**, and production build (**77 routes**).
- `npm run verify` passed: **Exit Code 0**
  - Typecheck (`tsc --noEmit`): 0 errors
  - Lint (`eslint .`): 0 errors, 0 warnings
  - Architecture check (`node scripts/check-architecture.mjs`): Passed (zero hardcoded exam branching in engine)
  - Unit & Integration tests (`vitest run`): **50 test files passed, 303 passed tests**
  - Production build (`next build`): Compiled successfully; **77 static & dynamic routes generated**
- Playwright E2E browser verification: **32 passed tests** across `tests/e2e/seo-browser-verification.spec.ts` (27 passed) and `tests/e2e/exam-guide.spec.ts` (5 passed). Mobile navigation drawer, accessibility contracts, titles, and sources audit panels all pass cleanly with Exit Code 0.

## Blocked
- Production deployment and Search Console configuration remain blocked pending human action with production credentials.

## Needs Human
1. Apply database migration `0003_flaky_weapon_omega.sql` to production PostgreSQL.
2. Set `NEXT_PUBLIC_APP_URL=https://www.reviewtayo.online` and required secrets (`CONTACT_IP_HASH_SALT`, `CRON_SECRET`, `ADMIN_API_KEY`) in Vercel.
3. Deploy changes to production and verify apex-to-www 308 redirect.
4. Add domain and URL-prefix Search Console properties for `https://www.reviewtayo.online/` and submit `https://www.reviewtayo.online/sitemap.xml`.

## Next
- Implement Phase 1 from `implementation_plan.md`: exam catalog, ReviewTayo homepage, reviewer directory, CSE landing page, navigation, SEO, tests, and browser verification.
- Production deployment and Search Console work still require the credentials/actions listed above.
