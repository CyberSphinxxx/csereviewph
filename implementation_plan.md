# ReviewTayo Multi-Exam Platform Plan

## Interpretation

Reposition `https://www.reviewtayo.online` as the umbrella brand for Philippine exam preparation. The root homepage should help learners discover the right reviewer, while Civil Service Exam (CSE) remains the only fully launched reviewer for now. LET, Nursing, BFP, NAPOLCOM, and future exams may be shown as planned offerings, but must not expose empty practice flows or imply that their content is already available.

This follows the product plan's core principle: one reusable examination platform populated with CSE first. It does **not** move the project prematurely into building five shallow reviewer products.

## Product Structure

### Brand hierarchy

- **ReviewTayo** — the platform and main domain.
- **CSE Reviewer by ReviewTayo** — the first live reviewer.
- **LET, Nursing, BFP, and NAPOLCOM reviewers** — catalog entries marked `Coming soon` until each passes a launch-readiness checklist.
- **Exam engine, accounts, dashboard, progress, results, and settings** — shared platform capabilities, driven by the selected exam rather than duplicated per reviewer.

### Recommended information architecture

```text
/
├── /reviewers
├── /cse
├── /let                 (coming-soon landing page only)
├── /nursing             (coming-soon landing page only)
├── /bfp                 (coming-soon landing page only)
├── /napolcom            (coming-soon landing page only)
├── /cse/practice
├── /cse/exams/[level]/[mode]
├── /cse/guides
├── /cse/articles
├── /cse/exam-guide
├── /dashboard
├── /settings
└── shared legal, about, contact, and support pages
```

Use short top-level exam slugs because they are easy to understand, share, and extend. Keep account-level pages global. Store the active/target exam as user preference and include `examId` in progress records.

During migration, preserve the established CSE URLs (`/practice`, `/exams/...`, `/guides`, `/articles`, and `/exam-info`) until redirects, canonicals, sitemap changes, and analytics confirm a safe transition. Do not change all URLs in the first homepage release.

## Homepage Experience

### Global header

- ReviewTayo logo links to `/`.
- Primary navigation: `Reviewers`, `How it works`, `Study resources`, and the existing account/dashboard entry.
- Add an exam switcher only after at least two reviewers are live. Before then, a simple `Explore reviewers` link is clearer.
- On CSE pages, show contextual CSE navigation without changing the global ReviewTayo identity.

### Main hero

- Eyebrow: `Philippine exam preparation, all in one place`.
- Heading direction: `Choose your exam. Build your confidence.`
- Supporting copy should say CSE is available today and more Philippine reviewers are being developed.
- Primary CTA: `Start CSE review` → `/cse`.
- Secondary CTA: `Explore all reviewers` → `#reviewers` or `/reviewers`.
- Avoid a generic “Start exam” CTA before the learner has chosen an exam.

### Reviewer catalog

Render cards from a central exam catalog rather than hard-coded homepage markup. Each card includes:

- Exam name and short label.
- Issuing body/category.
- Availability: `Available`, `Coming soon`, or later `Beta`.
- Supported levels or tracks when relevant.
- One truthful action: `Open CSE reviewer` for available exams; `View planned reviewer` or a disabled `Coming soon` state for unavailable exams.

Initial order:

1. Civil Service Exam — available and visually featured.
2. Licensure Examination for Teachers — coming soon.
3. Nursing Licensure Examination — coming soon.
4. BFP qualifying/recruitment examinations — coming soon; exact product scope must be verified before content work.
5. NAPOLCOM examinations — coming soon; distinguish entrance and promotional tracks during discovery.
6. `More Philippine exams` — research/backlog card, not a fake product page.

### Supporting sections

- A CSE feature section covering Professional and Subprofessional preparation, topic practice, timed mock exams, results, explanations, and progress tools.
- `How ReviewTayo works`: choose an exam → practice → review mistakes → track progress.
- Original-content and independence statement.
- Current CSE resources and guides.
- Footer grouped into Reviewers, Resources, Platform, and Legal.

## Technical Design

### Central exam catalog

Introduce a typed, presentation-safe registry such as `src/config/exams.ts` (or a database-backed equivalent once admin publishing exists):

```ts
type ExamAvailability = "available" | "beta" | "coming-soon";

interface ExamCatalogEntry {
  id: string;
  slug: string;
  shortName: string;
  fullName: string;
  description: string;
  availability: ExamAvailability;
  category: "civil-service" | "licensure" | "public-safety" | "other";
  levels: Array<{ id: string; name: string }>;
  accent: string;
  href: string;
}
```

This registry is for discovery and routing. Exam rules, timers, scoring, subject distributions, and question content remain in their proper configuration/data layers. UI components must not branch on `if (exam === "cse")`.

### Route and user context

- Resolve reviewer pages by exam slug/configuration.
- Pass `examId` explicitly into practice, attempt, results, bookmark, and progress flows.
- Keep a safe default for legacy CSE records during migration, then migrate stored data/version it rather than silently mixing exams.
- Make the target-exam preference select from launched exams; do not let users select unavailable exams as an active study target.

### Future-exam readiness

Each future exam needs verified official rules and sources; exam/level/subject/topic configuration; original questions following Draft → Review → Approved → Published; study materials and disclaimers; test distribution and timer configuration; and independent content QA.

No external reviewer questions should be copied or paraphrased. Coming-soon pages should collect no personal data unless a privacy-reviewed waitlist feature is separately approved and implemented.

## SEO and Domain Migration

- Treat `https://www.reviewtayo.online` as the only canonical origin.
- Change homepage metadata from CSE-only keywords to the ReviewTayo platform proposition while retaining CSE relevance in featured content.
- Give `/cse` its own focused CSE title, description, structured data, and canonical.
- Add useful published reviewer pages to the sitemap; omit thin placeholder-only pages.
- If CSE routes move, use permanent redirects from every old URL to its exact replacement; never redirect all old pages to `/cse`.
- Update internal links, breadcrumbs, JSON-LD, Open Graph data, robots rules, ads exclusions, analytics reporting, and Search Console after route changes.
- Keep existing CSE articles and guides indexed under their current URLs in the first release to avoid an unnecessary simultaneous SEO migration.

## Delivery Phases

### Phase 1 — Rebrand the entry experience

1. Add the typed exam catalog with CSE available and future exams marked coming soon.
2. Redesign `/` as the ReviewTayo umbrella homepage.
3. Add `/reviewers` and a focused `/cse` landing page.
4. Update header/footer navigation and platform-level metadata/structured data.
5. Keep current CSE practice and content URLs working unchanged.

**Outcome:** ReviewTayo clearly looks multi-exam, while every functional CTA still leads to the mature CSE experience.

### Phase 2 — Make CSE route context explicit

1. Audit every CSE-specific route, label, preference, local-storage record, API, and analytics event.
2. Add exam context to practice, attempts, results, dashboard, bookmarks, mistakes, and recommendations.
3. Introduce `/cse/...` canonical routes and exact legacy redirects only after tests cover record migration and navigation.
4. Update sitemap, breadcrumbs, navigation, and SEO metadata.

**Outcome:** the live product behaves as one reviewer within a reusable platform, not as a CSE site wearing a generic logo.

### Phase 3 — Prepare the second exam properly

1. Choose one next exam using demand, content-author availability, official-rule clarity, and maintenance cost.
2. Perform official-source and data-model discovery before changing the engine.
3. Add only the configuration capabilities that the second real exam proves are needed.
4. Author and review original content; keep it Draft until independent approval.
5. Launch as Beta first, measure completion and quality signals, then mark Available.

**Recommended next exam:** LET is the strongest candidate because it is already first in the product roadmap, but this is a product prioritization hypothesis—not authorization to build LET content now.

### Phase 4 — Scale the catalog

- Repeat the launch checklist for Nursing, BFP, NAPOLCOM, and later exams.
- Add cross-exam dashboard filters and an exam switcher once at least two reviewers are genuinely live.
- Add admin catalog controls only when manual configuration becomes a bottleneck.

## Scope for the First Implementation Pull Request

Include:

- Exam catalog/configuration and tests.
- New ReviewTayo homepage and reviewer cards.
- `/reviewers` catalog page.
- `/cse` landing page reusing existing CSE entry points.
- Header/footer navigation changes.
- Homepage/CSE metadata, sitemap, and structured-data updates.
- Responsive and accessibility coverage.

Do not include:

- New LET/Nursing/BFP/NAPOLCOM questions or mock exams.
- A waitlist, notifications, or new personal-data collection.
- A full admin CMS for exam creation.
- Destructive route replacement or removal of indexed CSE URLs.
- A speculative rewrite of the exam engine.

## Acceptance Criteria

- The root page identifies ReviewTayo as a Philippine exam-review platform, not solely a CSE website.
- A visitor can understand which reviewer is available within one screen and reach CSE in one action.
- Future exams are discoverable and unmistakably labeled as unavailable/coming soon.
- No CTA leads to an empty or fake exam flow.
- CSE practice, exam, guide, article, account, and dashboard flows continue to work.
- Reviewer cards and routes are generated from a shared exam catalog.
- No exam-specific branching is introduced into the generic exam engine.
- Canonicals use `https://www.reviewtayo.online`, and existing indexed routes are preserved or exactly redirected.
- Mobile navigation, keyboard access, headings, focus states, and contrast pass browser checks.

## Verification Plan

### Automated tests to add/update

- Unit tests for exam catalog uniqueness, valid slugs, valid availability states, and the rule that only available exams expose start/practice actions.
- Component tests for hero CTAs, reviewer statuses, accessible card labels, and contextual navigation.
- Metadata/structured-data/sitemap tests for `/`, `/reviewers`, and `/cse`.
- Integration tests proving CSE entry links still resolve to valid existing flows.
- Storage/preferences tests when `examId` becomes explicit, including legacy CSE data migration.
- Architecture check proving the exam engine contains no exam-specific branching.

### Manual/browser checks

- Desktop and 375px mobile walkthrough of `/`, `/reviewers`, `/cse`, and the existing CSE practice/exam flow.
- Keyboard-only navigation through header, reviewer catalog, and CTAs.
- Confirm every future-exam card is visibly `Coming soon` and cannot start an exam.
- Confirm no horizontal overflow, broken links, console errors, duplicate H1s, or inaccessible controls.
- Validate canonical tags, page titles, structured data, sitemap entries, and exact redirects if Phase 2 is included.

### Required project verification

- Run `npm run verify` and require exit code 0.
- Run `npm run test:e2e` because homepage/navigation changes affect the route into the exam-taking flow.

## Decisions Recorded

- ReviewTayo is the master brand; CSE is a reviewer/product inside it.
- The platform may advertise its roadmap now, but only CSE is labeled available.
- The first implementation changes discovery and branding without immediately moving all indexed CSE URLs.
- New reviewer engines/content are deferred until CSE remains stable and a second exam is formally selected.
- No waitlist is included initially, avoiding premature personal-data collection and notification infrastructure.

## Post-Implementation Audit Plan (2026-09-18)

### Interpretation

Review the completed Phase 1 implementation against this plan and its acceptance criteria. This is a report-only audit: application behavior will not be changed unless a separate fix request is made.

### Verification Plan

- Inspect the exam catalog, homepage, reviewer directory, CSE landing page, global navigation, metadata, structured data, sitemap, and their tests.
- Run `npm run verify` and the complete Playwright suite.
- Inspect the rendered desktop and 375px screenshots for `/`, `/reviewers`, and `/cse`.
- Distinguish Phase 1 requirements from deferred Phase 2–4 work and record confirmed gaps in `.design/review-report.md`.
