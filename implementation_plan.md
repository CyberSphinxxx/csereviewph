# ReviewTayo Library-to-Exam Journey Redesign

## Interpretation

ReviewTayo should first read as a library of Philippine examination reviewers. Visitors browse and choose an exam at the platform level, then enter a clearly named exam workspace whose navigation, dashboard, progress, and calls to action are scoped to that exam. Civil Service remains the only live reviewer today, but neither the information architecture nor the shared components should treat it as the platform itself.

## Design Arc Direction

Adopt **Library → Exam workspace**.

- Public layer: ReviewTayo brand, Exams, How it works, Study resources, and Sign in.
- Selection layer: a concise exam library with availability, authority, tracks, and one truthful action per exam.
- Exam layer: visible “All exams” return, active exam/track identity, and scoped Overview, Practice, Mock exams, Guides, and Exam info navigation.
- Dashboard: always titled for the active exam and track; new visitors first choose a live exam and track.
- Authentication: secondary on public pages, available in context, and never required before guest practice.

Alternatives considered but not selected:

1. Send every exam selection directly to a universal dashboard. Faster, but hides exam-specific orientation and makes unavailable exams harder to explain truthfully.
2. Keep one global header and add more exam tabs. Familiar in the short term, but scales poorly and preserves the current ambiguity between platform and exam context.

## Implementation

1. Recompose the homepage hero around immediate library comprehension and exam selection.
2. Replace the dense examination index with a responsive library component that emphasizes availability and next action without making planned exams feel interactive.
3. Simplify platform navigation and create a distinct exam-workspace navigation state with a clear route back to all exams.
4. Make workspace context and dashboard destination generic and visible, including exam name and track.
5. Keep all exam names, tracks, capabilities, routes, and status driven by `EXAM_CATALOG`; do not add exam-specific engine branches.
6. Update unit and browser tests for the revised labels, routes, keyboard behavior, responsive hierarchy, and library/workspace transition.
7. Update `walkthrough.md` and `PROGRESS.md` with actual verification evidence.

## Verification Plan

### Automated

- Update and run targeted Vitest component tests for the homepage library, header context, selector, and dashboard onboarding.
- Run `npm run verify` and require exit code 0.
- Run the relevant Playwright suites for homepage/navigation/accessibility and the full `npm run test:e2e` because the change affects navigation.

### Manual / Browser

- Load the homepage at wide and 320px-equivalent viewports.
- Follow the live CSE path into its exam context and confirm the header changes from platform navigation to exam-scoped navigation.
- Open the exam switcher and confirm labels, focus, Escape dismissal, and the return-to-library path.
- Open `/dashboard` with and without a workspace and confirm the destination is unambiguous.
- Exercise keyboard-only navigation, visible focus, reduced-motion mode, 200% zoom/reflow, and inspect console errors.

## Constraints

- No external exam questions or copied reviewer content.
- No new personal-data collection, analytics behavior, or secrets.
- No CSE-specific branching in the generic exam engine.
- Planned exams remain truthful, non-actionable roadmap entries.
- Full-test timing and scoring behavior are unchanged.
