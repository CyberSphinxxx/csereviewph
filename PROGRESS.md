# CSEReviewerPH / ReviewTayo — Current Handoff
Full prior status is archived in ARCHIVES/progress-history.md.

**Current SEO & AdSense Readiness Status: REMEDIATED, IMPLEMENTED & VERIFIED**
*All remaining preview-mode robots overwrites, content claim softenings, and title length bounds are fully resolved. `npm run verify` passes with Exit Code 0 across typecheck, lint, architecture check, 50 test files (303 passed tests), and production Next.js build (77 routes).*

## Done
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
- `npm run verify` passed: **Exit Code 0**
  - Typecheck (`tsc --noEmit`): 0 errors
  - Lint (`eslint .`): 0 errors, 0 warnings
  - Architecture check (`node scripts/check-architecture.mjs`): Passed (zero hardcoded exam branching in engine)
  - Unit & Integration tests (`vitest run`): **50 test files passed, 303 passed tests**
  - Production build (`next build`): Compiled successfully; **77 static & dynamic routes generated**
- Unit SEO test suite (`tests/unit/seo/`): **5 test files, 37 passed tests**
- Playwright E2E browser verification: **27 passed tests** (exact H1 checks, mobile navigation drawer interactivity, canonicals, schema markup, robots/sitemap/ads.txt).

## Blocked
- Production deployment and Search Console configuration remain blocked pending human action with production credentials.

## Needs Human
1. Apply database migration `0003_flaky_weapon_omega.sql` to production PostgreSQL.
2. Set `NEXT_PUBLIC_APP_URL=https://www.reviewtayo.online` and required secrets (`CONTACT_IP_HASH_SALT`, `CRON_SECRET`, `ADMIN_API_KEY`) in Vercel.
3. Deploy changes to production and verify apex-to-www 308 redirect.
4. Add domain and URL-prefix Search Console properties for `https://www.reviewtayo.online/` and submit `https://www.reviewtayo.online/sitemap.xml`.

## Next
- Await human authorization for production deployment and Search Console submission.
