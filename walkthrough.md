# AdSense Audit Walkthrough

## Outcome

The site is **not ready for an AdSense review**. A detailed evidence-based report is available at `.design/review-report.md`. No application code or UI was changed.

## Verified

- Inspected the current source implementation for metadata, robots, sitemap, ads.txt, ad loading, consent, privacy, contact, content, and ad placements.
- Rendered representative local public and exam-start routes.
- Inspected the live homepage plus live robots, sitemap, ads.txt, Privacy, About, Articles, and Guides pages.
- Confirmed the live deployment still uses old branding and points canonical/sitemap signals to `cse-reviewer-ph.vercel.app`.
- Confirmed live ads.txt publishes `pub-0000000000000000`.
- Confirmed the source defaults missing consent to ad permission and uses descriptive labels as AdSense slot IDs.
- Compared the implementation with current official Google AdSense and Search documentation linked in the report.

## Definition of Done

- [x] `npm run verify` passes — exit code 0; 45 test files and 252 tests passed, architecture check passed, and 71 routes built
- [x] New/changed logic has new/updated tests — not applicable; no application logic changed
- [x] Browser check performed for user-facing changes — no user-facing changes; local and live audit checks were performed
- [x] No secrets committed; `.env.example` unchanged
- [x] No exam-question content was copied or paraphrased from an external source
- [x] Engine code has no exam-specific branching introduced
- [x] `implementation_plan.md` and `walkthrough.md` exist for this task
