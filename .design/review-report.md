# ReviewTayo Multi-Exam Phase 1 Remediation Audit

Date: 2026-09-18

## Verdict

**Needs changes.** RT-01, RT-02, and the intended navigation behavior in RT-03 are implemented. RT-04 is not adequately verified, Escape does not dismiss the desktop `More` disclosure, and the required complete Playwright suite currently fails 5 of 65 tests.

## Remediation status

| Original finding | Status | Evidence |
|---|---|---|
| RT-01 — Truthful roadmap messaging | Resolved | `src/config/exams.ts:37`, `src/components/home/ReviewTayoHomeView.tsx:48`, `src/components/reviewers/ReviewerCard.tsx:121-124`, and `src/components/reviewers/ReviewerCatalog.tsx:87` now use independent/planned/research language. |
| RT-02 — Catalog-driven routing | Resolved for Phase 1 | `src/app/(public)/cse/page.tsx:7-38` resolves CSE through `getExamBySlug`, gates availability, and derives canonical/JSON-LD fields from the entry. This is a catalog-backed CSE wrapper, not yet a generic multi-slug route, which is acceptable while CSE is the only launched reviewer. |
| RT-03 — Navigation hierarchy | Functionally resolved; regression suite stale | `src/components/layout/Header.tsx:112-164` separates umbrella navigation from CSE navigation. Five existing mobile E2E cases were not updated for the new contract and now fail. |
| RT-04 — Accessibility verification | Not resolved | The new suite passes, but its assertions do not establish several behaviors claimed by its names and walkthrough. Escape dismissal is also absent from the implementation. |

## Findings

| ID | Severity | Area | Location / evidence | Current behavior | Proposed correction | User impact |
|---|---|---|---|---|---|---|
| RR-01 | MEDIUM | Required regression suite | `tests/e2e/seo-browser-verification.spec.ts:176-183`; full `npm run test:e2e` result: 60 passed, 5 failed | The test always requires a mobile `Practice` link. Umbrella routes `/`, `/reviewers`, `/faq`, `/about`, and `/privacy` now correctly omit that CSE-specific link, so all five cases fail. The remediation walkthrough reports only two selected suites, not the required complete suite. | Make the assertion route-context-aware: require `CSE Reviewer`/`Civil Service Exam (Live)` on umbrella routes and `Practice` on CSE-context routes. Then rerun all 65 tests. | The intended navigation works, but the repository no longer has a green end-to-end regression gate and the completion claim is inaccurate. |
| RR-02 | MEDIUM | Keyboard dismissal | `src/components/layout/Header.tsx:39-47,167-213`; `tests/e2e/reviewtayo-accessibility.spec.ts:64-73` | Pressing Escape does not close the desktop `More` disclosure because no keyboard handler exists. The test presses Escape, then closes the menu with a mouse click, and never asserts `aria-expanded=false` or menu removal. | Add Escape handling with focus restoration to the trigger and assert the closed state immediately after the keypress without pointer input. | Keyboard users lack the conventional dismissal path, despite the walkthrough explicitly claiming it works. |
| RR-03 | MEDIUM | Accessibility evidence | `tests/e2e/reviewtayo-accessibility.spec.ts:86-97,118-183` | “Focus visibility” only checks that a result object exists; “200% zoom” merely uses a 640px viewport; reduced motion only checks the media query; “contrast measurements” neither calculate ratios nor enforce 4.5:1. | Assert a non-none outline or visible box shadow; use actual browser zoom/CDP or document the 640px check as viewport reflow; inspect computed animation/transition durations; calculate luminance/contrast for each named foreground/background pair. | Passing test names currently create false confidence about accessibility acceptance criteria. |
| RR-04 | LOW | Test/implementation claims | `tests/unit/config/exams.test.ts:83-112`; attached remediation walkthrough RT-02 section | The added tests validate catalog data only. They do not test CSE page metadata generation, the page guard, or `notFound()` behavior as claimed. | Add page-level metadata and unavailable-state tests, or narrow the walkthrough wording to match what is tested. | Reviewers cannot rely on the walkthrough to identify actual route-level coverage. |

## Verification executed

- `npm run verify`: **PASS**, exit code 0 — typecheck, lint, architecture check, 54 test files / 322 tests, and 79-route build.
- Clean production rebuild after removing generated `.next`: **PASS**. This cleared a stale generated-chunk error and was not treated as a source defect.
- `npm run test:e2e`: **FAIL**, exit code 1 — 60 passed, 5 failed. All failures are stale umbrella-route mobile navigation expectations in `seo-browser-verification.spec.ts`.
- The new `reviewtayo-accessibility.spec.ts` cases themselves passed, but their coverage limitations are documented above.

## Verification gaps

- No screen-reader or forced-colors test was performed.
- Actual browser zoom at 200% was not verified by the new suite.
- Contrast ratios were not calculated by the new suite.
- Production deployment and Search Console state were not inspected.

## Conclusion

The remediation is materially improved, but the statement “all four findings resolved and fully verified” is not yet supported. Resolve RR-01 through RR-03 and rerun the complete E2E suite before marking the audit closed.
