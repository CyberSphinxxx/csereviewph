# AGENTS.md — Philippine Exam Reviewer Platform

You are working on a Philippine exam-preparation platform. **Civil Service Exam (CSE) is the first exam**, but the architecture must stay generic enough to add other Philippine exams (LET, Nursing, BFP, NAPOLCOM) later by adding content/configuration, not by rewriting the engine.

Full context lives in:
- `/docs/product-plan.md` — original product plan (sections 1–46)
- `/docs/product-plan-addendum.md` — legal, content, business, and technical gap-fill (sections 47–58)

**Read relevant sections before planning any non-trivial task** (use grep or targeted line ranges rather than loading entire doc files to conserve tokens). If a prompt conflicts with something in those docs, follow the docs and flag the conflict rather than silently picking one.

---

## 0. The Non-Negotiable Rule

**A task is not complete until `npm run verify` exits with code 0.**

This applies regardless of how the request was phrased, how small the change looks, or how confident you are. If you cannot get `npm run verify` to pass, say so explicitly in the walkthrough — do not report success anyway. This is the single rule that prevents silent regressions; treat it as absolute.

`npm run verify` runs, in order: typecheck → lint → unit/integration tests → build. End-to-end tests (`npm run test:e2e`) run separately because they're slower — run them for any change touching the exam-taking flow, timer, scoring, or navigation, even if not explicitly requested.

---

## 1. Tech Stack (decided — do not re-litigate per task)

```text
Framework       Next.js (App Router) + React + TypeScript
Styling         Tailwind CSS + shadcn/ui
Database        PostgreSQL
ORM             Drizzle
Auth            Better Auth
Hosting         Vercel
Unit/Integration  Vitest + React Testing Library
E2E             Playwright
Lint/Format     ESLint + Prettier
Analytics       PostHog (self-hostable — matters for Data Privacy Act compliance, see §7)
Error tracking  Sentry
Package manager npm
```

Do not introduce a competing library for something this list already covers (e.g., don't add Jest alongside Vitest, don't add a second ORM) without being explicitly asked to migrate.

---

## 2. Required Process for Every Task

**PLANNING**
- Produce `implementation_plan.md` before touching code for anything beyond a trivial one-line fix.
- The plan must include an explicit **Verification Plan** section listing: which automated tests will be written/run, and what manual/browser check (if any) proves the feature works.
- If the request is ambiguous, state your interpretation and proceed with the most reasonable default consistent with `/docs/product-plan.md` — don't stop to ask unless proceeding would clearly go in the wrong direction.

**EXECUTION**
- Never write application logic without a corresponding test in the same change. If you touch scoring, question selection, timer logic, or auth, the test must cover the actual behavior, not just "it renders."
- Follow the folder structure in §5 and the data model in `skills/exam-engine/SKILL.md`.
- If you hit a blocker, go back to PLANNING and revise rather than pushing through with a workaround that violates §0.

**VERIFICATION**
- Run `npm run verify`. If it fails, fix it — do not proceed to the walkthrough with a failing suite.
- For any user-facing change, use the browser tool to actually load the page and click through the flow before writing the walkthrough. A walkthrough claiming a UI works without having opened it is not acceptable.
- The walkthrough must state clearly: what was verified, how, and the actual pass/fail result of `npm run verify`.

---

## 3. Hard Constraints

These override convenience or speed in every case:

1. **Never author or copy exam question content from external sources** — no reviewer PDFs, blog posts, Scribd docs, or Facebook-group material, even "for reference." Question content is written fresh per `skills/content-authoring/SKILL.md`. If a task seems to require populating questions, generate clearly-marked placeholder/seed data and flag that real content needs human subject-matter authorship — do not fill gaps with scraped-feeling text.
2. **Never hard-code CSE-specific logic into the exam engine.** Engine code (scoring, question selection, timer, navigation) must consume an exam configuration, not branch on `if (exam === 'CSE')`. See `skills/exam-engine/SKILL.md`. This is enforced automatically by `npm run check:architecture` (part of `npm run verify`) — if it flags something, fix the actual violation rather than reworking the string to slip past the check.
3. **Never commit secrets.** All keys/credentials go in `.env.local` (gitignored) and are referenced via environment variables. If a task needs a new secret, add it to `.env.example` with a placeholder and tell the user to fill in the real value — never invent or hardcode one.
4. **Never write schema changes by hand-editing the database.** All schema changes go through Drizzle migrations, committed to the repo.
5. **The Full Test exam mode uses ONE continuous timer for the whole exam**, matching the real CSE-PPT (170 items / 3h10m Professional, 165 items / 2h40m Subprofessional — single overall allotment, not per-section). Do not implement or "improve" this into per-section timers.
6. **Respect the build order** in `/docs/product-plan.md` §42: Foundation → CSE Implementation → UX → Content Platform → Admin → Monetization → New Exams. Don't build Phase 4+ features while Phase 1 is incomplete unless explicitly asked to jump ahead.

---

## 4. Definition of Done (checklist — include this status in every walkthrough)

```text
[ ] npm run verify passes (typecheck, lint, unit/integration tests, build)
[ ] New/changed logic has new/updated tests
[ ] e2e/browser check performed for user-facing changes, with evidence in the walkthrough
[ ] No secrets committed; .env.example updated if new env vars were added
[ ] No exam-question content was copied or paraphrased from an external source
[ ] Engine code has no exam-specific branching
[ ] implementation_plan.md and walkthrough.md exist for this task
```

---

## 4a. Bootstrap (run this yourself — do not ask the human to edit config files)

If `package.json` doesn't yet define these scripts, create them as the first task of any session, without asking:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "check:architecture": "node scripts/check-architecture.mjs",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "build": "next build",
    "verify": "npm run typecheck && npm run lint && npm run check:architecture && npm run test && npm run build",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx src/db/seed.ts",
    "prepare": "husky"
  }
}
```

Also set up, yourself, without asking:
- `npx husky init`, with `.husky/pre-commit` running `npm run typecheck && npm run lint && npm run test`
- `.env.example` with placeholder keys for `DATABASE_URL`, auth secrets, PostHog/Sentry — real values are never invented, just placeholders with a comment saying what's needed
- `scripts/check-architecture.mjs` (provided in this repo — copy as-is if not already present)
- Git initialized with an initial commit, if not already a repo
- `PROGRESS.md` at the repo root (see §9) if it doesn't already exist

---

## 5. Codebase Structure

```text
src/
├── app/                     # Next.js App Router routes
│   ├── (public)/            # SEO pages: homepage, exam info, study guides, FAQ
│   ├── (app)/                # Interactive app: practice, exams, dashboard, results
│   └── api/                  # Route handlers
├── db/
│   ├── schema/               # Drizzle schema files — one per core entity
│   └── migrations/           # Generated migrations — never hand-edited
├── features/
│   ├── exam-engine/          # Generic: selection, scoring, timer, navigation
│   ├── question-bank/        # Question CRUD, lifecycle, metadata
│   ├── practice/              # Topic practice, quick/medium/full test flows
│   ├── results/                # Results, mistake bank, bookmarks
│   └── dashboard/
├── components/                # Shared UI (shadcn/ui-based)
└── lib/                        # Auth, analytics, utilities

tests/
├── unit/            # Mirrors src/ structure
├── integration/
└── e2e/             # Playwright specs

docs/
├── product-plan.md
├── product-plan-addendum.md
└── content-style-guide.md      # Referenced by content-authoring skill
```

Core entities (do not flatten or duplicate): `Exam, ExamLevel, Subject, Topic, Question, Choice, Test, TestAttempt, UserAnswer, UserProgress, Bookmark, QuestionReport, StudyMaterial, Article`. Question schema includes a `language` field (`en` / `fil`) per exam-fidelity requirements.

---

## 6. Content & Question Lifecycle

Questions move `Draft → Under Review → Approved → Published → Archived`. Never delete a question; archive it. No question reaches `Approved` without being reviewed by someone/something other than its author (see `skills/content-authoring/SKILL.md` for the full workflow) — if asked to "approve" your own generated question, flag that this violates the review-separation rule instead of doing it silently.

---

## 7. Data Privacy (RA 10173)

Any feature touching user accounts, quiz history, or analytics must:
- Only collect what's declared in the privacy notice (don't add tracking fields "just in case")
- Gate analytics/ad scripts behind consent, not load unconditionally
- Support account/data deletion, not just deactivation

If a task would add new personal-data collection, flag it explicitly in the implementation plan rather than adding it silently.

---

## 8. Communication Style

- Plain English prompts from the user should be translated into a concrete plan before any code is written — restate your interpretation briefly in the implementation plan.
- Use GitHub-flavored markdown in artifacts. Keep walkthroughs factual: what changed, what was tested, what passed/failed — not marketing language about the work.
- See §9 for when to ask vs. proceed — the default is to proceed.

---

## 9. Autonomous / Unattended Operation

This project runs with minimal human interaction by design. The user expects to kick off a session and come back later to a finished, verified result. Default to continuing, not stopping.

- **Never pause to ask for approval** on implementation choices, phrasing, library minutiae, or which reasonable default to pick. Choose the option most consistent with `/docs/product-plan.md`, `/docs/product-plan-addendum.md`, and this file, note the choice in the implementation plan, and keep going.
- **When `npm run verify` fails**: fix and retry, up to 3 attempts on the same failure. If still failing after 3 attempts, log it in `PROGRESS.md` under `## Blocked`, move to the next task that doesn't depend on it, and continue. Never let one stuck task stop the whole run.
- **Work continuously** through the full task list across phases without stopping between tasks or phases for confirmation.
- **Only these should actually stop the run and require a human:**
  - A missing external credential or account you cannot generate yourself (a real `DATABASE_URL` for a hosted DB, a paid API key, a domain/hosting account signup)
  - A genuine contradiction between the product plan and the addendum that changes architecture, not just an implementation detail
  - Everything else: proceed on your best judgment and log it in `PROGRESS.md` rather than stopping.
- **Maintain `PROGRESS.md`** at the repo root as a concise rolling handoff (< 120 lines / ~4KB), updated after every completed unit of work with sections `## Done`, `## Verified` (with the actual `npm run verify` result), `## Blocked` (what and why), `## Needs Human` (what credential/decision is needed), and `## Next`. This is the primary handoff artifact — write it so that reading it alone tells the user current status without bloating LLM context. When milestones complete, archive superseded retrospective details to `ARCHIVES/progress-history.md` rather than accumulating infinite log lines in `PROGRESS.md`.
- **Resuming after an interruption**: if `PROGRESS.md` already exists with completed items, read it first and continue from the first incomplete item. Do not redo completed, verified work.
- **Content stays in `Draft` status** per `skills/content-authoring/SKILL.md` during autonomous runs. This is not a stopping point — it's just the correct default status. Continue past it without waiting for review; the human reviews and publishes on their own schedule, separately from the build run.
- **Database migrations** may be generated and applied automatically against local/dev databases during autonomous runs without asking. Never apply a migration to an environment you have reason to believe is production.
