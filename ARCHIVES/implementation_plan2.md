# Refine Hero Section and "How Your Review Works" Transition

Refine the landing page hero and subsequent workflow section to establish a strong sense of completion, eliminate awkward viewport transitions, relocate the exam schedule strip closer to the selector, add an outcome evidence group, and remove repetitive copy below the fold.

## Changes
- **Hero Height & Viewport Breathing Room**: Flexible min-height (`lg:min-h-[calc(100vh-6.5rem)]`) with centered composition.
- **Relocated Exam Schedule Strip**: Quiet line directly above the selector card aligned with its left edge: `Exam schedule · March 21, 2027 · View dates →`.
- **Outcome Evidence**: Quiet group beneath supporting paragraph: `Your results include: Subject breakdown · Answer explanations · Recommended practice`.
- **Workflow Section**: Renamed to `HOW YOUR REVIEW WORKS` (`A short test. A focused study plan.`) with 3 visual process step cards.

## Verification Plan
- Unit tests: `npm test`
- Architecture: `npm run check:architecture`
- Typecheck: `npm run typecheck`
- Linter: `npm run lint`
- End-to-end: `npx playwright test tests/e2e/exam-flow.spec.ts`
- Full suite: `npm run verify`
