# 🇵🇭 ReviewTayo / CSEReviewerPH — Philippine Civil Service & Licensure Exam Prep Platform

> A modern, high-fidelity exam preparation platform built specifically for Filipino civil service aspirants and professionals. Architected with a modular, **zero-branching exam engine** designed to power the Civil Service Examination (CSE-PPT) today and seamlessly expand to all major Philippine licensure and entrance exams (LET, Nursing, NAPOLCOM, BFP, UPCAT).

[![Verification Suite](https://img.shields.io/badge/verify-passing-emerald.svg)](#-verification--quality-gates)
[![Next.js 15](https://img.shields.io/badge/Next.js-15_(App_Router)-black.svg)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)](https://www.typescriptlang.org/)
[![PostgreSQL 16+](https://img.shields.io/badge/PostgreSQL-16+-336791.svg)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-C5F74F.svg)](https://orm.drizzle.team/)
[![PGlite WASM](https://img.shields.io/badge/PGlite-In--Memory_Postgres-FF6B6B.svg)](https://pglite.electric-sql.com/)
[![Tailwind CSS v3](https://img.shields.io/badge/TailwindCSS-v3-38B2AC.svg)](https://tailwindcss.com/)
[![RA 10173 Compliant](https://img.shields.io/badge/Data_Privacy-RA_10173-success.svg)](#-data-privacy-compliance-ra-10173)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📑 Table of Contents

- [📌 Overview & Vision](#-overview--vision)
- [🗺️ Documentation Map](#️-documentation-map)
- [✨ Core Features](#-core-features)
- [🏛️ Architectural Design & Philosophy](#️-architectural-design--philosophy)
- [📚 Civil Service Exam (CSE-PPT) Specification](#-civil-service-exam-cse-ppt-specification)
- [🎨 Design System & Aesthetics](#-design-system--aesthetics)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [🧪 Verification & Quality Gates](#-verification--quality-gates)
- [📱 Progressive Web App (PWA) & Offline Mode](#-progressive-web-app-pwa--offline-mode)
- [🔒 Data Privacy Compliance (RA 10173)](#-data-privacy-compliance-ra-10173)
- [⚖️ Legal Disclaimer & Content Ethics](#️-legal-disclaimer--content-ethics)

---

## 📌 Overview & Vision

**ReviewTayo** (formerly CSEReviewerPH) is an independent, next-generation web application created to democratize high-quality, realistic review materials for Filipino civil service and licensure examinees. 

Many existing reviewers rely on outdated PDFs, scanned questionnaires, or generic quiz platforms with artificial per-question timers. ReviewTayo is engineered around **authentic Philippine testing conditions**:
- **Continuous Single-Timer Simulation:** Just like the pen-and-paper test administered by the Civil Service Commission (CSC), the Full Mock Exam runs on a single uninterrupted timer (3 hours 10 minutes for Professional, 2 hours 40 minutes for Subprofessional).
- **Subtest Exclusivity:** Faithfully separates examination content—**Analytical Ability** is exclusive to the Professional level, while **Clerical Ability** is exclusive to Subprofessional.
- **Bilingual Assessment:** Official English and Filipino language items reflecting actual test proportions.
- **Smart Remediation:** Automated mistake tracking, Leitner-style spaced repetition, and diagnostic topic radars so examinees practice what they actually need to improve.
- **Extensible Multi-Exam Framework:** Built from day one so that onboarding the Licensure Examination for Teachers (LET), Nursing Licensure Exam (NLE), or NAPOLCOM Entrance Exam requires only configuration and vetted question banks—never engine refactoring.

---

## 🗺️ Documentation Map

This repository maintains comprehensive, living documentation across all product, architectural, and operational dimensions:

| File / Folder | Purpose | Highlights |
| :--- | :--- | :--- |
| [`PROGRESS.md`](PROGRESS.md) | **Current Rolling Handoff** | High-level status of the latest sprint, completed deliverables, verification test metrics, active blockers, and immediate next steps (<120 lines, zero-bloat). |
| [`ARCHIVES/progress-history.md`](ARCHIVES/progress-history.md) | **Milestone History Archive** | Comprehensive historical log recording every completed development phase, architectural milestone, and sprint transition. |
| [`AGENTS.md`](AGENTS.md) | **Agent System & Coding Rules** | The non-negotiable engineering laws: zero-branching engine constraints, zero-secrets policy, build order hierarchy, and mandatory `npm run verify` passing gates. |
| [`SETUP_GUIDE.md`](SETUP_GUIDE.md) | **Autonomous Agent Workflows** | Operational handbook for running autonomous build workflows (`/autopilot`, `/verify`, `/new-questions`, `/new-feature`, `/add-exam`). |
| [`docs/product-plan.md`](docs/product-plan.md) | **Master Product Blueprint** | Original 46-section specification detailing user personas, exam specifications, scoring formulas, dashboard UX, and feature phases. |
| [`docs/product-plan-addendum.md`](docs/product-plan-addendum.md) | **Legal & Content Addendum** | Sections 47–58: Original content authoring guidelines, copyright safeguards, monetization roadmap, and Republic Act 10173 compliance. |
| [`docs/vercel-deployment.md`](docs/vercel-deployment.md) | **Production Deployment Guide** | Step-by-step instructions for hosting on Vercel, provisioning Postgres (Neon/Supabase), setting environment variables, and zero-downtime migrations. |
| [`skills/`](skills/) | **Domain Skills** | Granular guides for content authoring (`content-authoring`), database migrations (`database`), exam engine mechanics (`exam-engine`), testing (`testing`), and atomic git commits (`commit-one-by-one`). |

---

## ✨ Core Features

### 1. Interactive Exam Runner & Realistic Modes
- ⚡ **Quick Test:** 10 questions / 10 minutes — ideal for commutes and fast daily reviews. Immediate answer feedback and rationale.
- 🎯 **Medium Test:** 30 questions / 30 minutes — balanced diagnostic sample across all subtests.
- 🏆 **Full Mock Exam:** 170 items (Pro) or 165 items (Subpro) with a single continuous countdown timer, auto-submission on expiration, question flagging, and an interactive jump palette.
- 📖 **Topic Drills:** Focused practice by subject or subtopic (e.g., *Philippine Constitution*, *Data Interpretation*, *Spelling & Idiomatic Expressions*).

### 2. Intelligent Reviewers Directory (`/reviewers`)
- 🦉 **Interactive Goal Questionnaire:** "What are you aiming for?" interactive matcher filtering exams by aspiration (Government Job, Law Enforcement/Public Safety, Professional License, College/Scholarship, Skills Certification).
- 🔍 **Instant Search & Keyboard Shortcuts:** Press `/` anywhere on the page to focus the search bar with instant substring matching and keyword highlighting.
- 🎫 **Ticket Cards & Badges:** Distinctive boarding-pass styled cards showing exam dates, requirements, time limits, subtests, and live vs. coming-soon status.
- 💡 **Community Suggestion Box:** Real-time feedback box allowing examinees to request upcoming Philippine exams.

### 3. Study Resources & Civil Service Hub (`/study-resources`)
- 📜 **1987 Philippine Constitution:** Structured summaries of the Preamble, Bill of Rights, and Government Branches.
- ⚖️ **Republic Act 6713:** Code of Conduct and Ethical Standards for Public Officials and Employees.
- 🌿 **General Information Modules:** Peace and Human Rights concepts, environmental laws, and current Philippine administrative framework.

### 4. Learner Dashboard & Remediation (`/dashboard`)
- 🧠 **Mistake Bank:** Automatically captures incorrect responses from mock exams and practice sessions into a dedicated review queue.
- 📈 **Topic Readiness Radar:** Visual percentage breakdown across subjects, highlighting weak subtests before exam day.
- 🔖 **Question Bookmarks:** Flag complex questions during mock exams for later analysis.
- ⚡ **Daily Streaks & Targets:** Configurable daily question goals and consecutive study day tracking.

---

## 🏛️ Architectural Design & Philosophy

ReviewTayo adheres to **domain-driven modular architecture** with strict boundary separation:

```text
src/
├── app/                      # Next.js 15 App Router
│   ├── (public)/             # High-speed static & SEO pages (landing, /reviewers, /study-resources, /privacy)
│   ├── (app)/                # Authenticated application (practice runner, /dashboard, /results, /settings)
│   └── api/                  # Edge and Node.js route handlers (auth, inquiries, user sync, health)
├── features/
│   ├── exam-engine/          # Pure, generic exam logic: selection, scoring, timer, state machine
│   ├── question-bank/        # Question definitions, taxonomy, lifecycle management
│   ├── practice/             # Exam runner UI, test state controller, answer palette, scratchpad
│   ├── results/              # Score computation, detailed breakdown, CSC passing benchmark analysis
│   └── dashboard/            # Progress charts, readiness score, mistake queue, recommendation engine
├── components/               # UI design system (brand mascot, headers, dialogs, cards, form inputs)
├── config/                   # Multi-exam registry, categories, goals, and directory definitions
├── db/
│   ├── schema/               # Drizzle ORM schemas (PostgreSQL)
│   └── migrations/           # Version-controlled, reproducible SQL migration files
└── lib/                      # Better Auth client/server, telemetry, rate limiting, and sanitizers
```

### 🔒 The Zero-Branching Engine Principle
Engine code inside `src/features/exam-engine/` has **strictly zero hardcoded exam slugs** (e.g. `if (exam === 'CSE')`). 

Instead, all examination logic:
- Subject and topic weight distribution
- Time allotments and warning thresholds
- Question pool selection criteria
- Passing mark formulas (e.g., CSC 80.00% benchmark)

are supplied dynamically through typed configuration objects (`ExamConfig`, `ExamLevelConfig`). This invariant is verified automatically on every pull request and build via `npm run check:architecture`.

---

## 📚 Civil Service Exam (CSE-PPT) Specification

ReviewTayo faithfully mirrors the official CSC examination guidelines:

| Metric | Professional Level | Subprofessional Level |
| :--- | :---: | :---: |
| **Total Test Items** | **170 items** | **165 items** |
| **Time Allotment** | **3 hours 10 minutes** (190 mins) | **2 hours 40 minutes** (160 mins) |
| **Passing Benchmark** | **80.00%** overall diagnostic score | **80.00%** overall diagnostic score |
| **Subtest 1** | Verbal Ability (English & Filipino) | Verbal Ability (English & Filipino) |
| **Subtest 2** | Numerical Ability (Arithmetic & Word Problems) | Numerical Ability (Arithmetic & Word Problems) |
| **Subtest 3** | **Analytical Ability** *(Exclusive)* | **Clerical Ability** *(Exclusive)* |
| **Subtest 4** | General Information (RA 6713, Constitution, etc.) | General Information (RA 6713, Constitution, etc.) |

---

## 🎨 Design System & Aesthetics

ReviewTayo uses a bespoke, high-contrast visual design built on Philippine academic and civic motifs:

- **Primary Colors:** Velvet Maroon (`#8a1630`), Warm Rose Blush (`#fdf8f6` &rarr; `#fcf0f1` &rarr; `#f9e2e7`), Deep Red Wine (`#5c0d1e`), and Gold Accents (`#d4af37`).
- **Dark Mode ("Velvety Dark Red"):** Deep obsidian background (`#1a0c11`), plum-tinted card surfaces (`#2b1620`), glowing maroon borders (`#8a1630`), and crisp high-legibility text (`#f8ecee`).
- **ReviewTayo Owl Mascot (`ReviewTayoOwl`):** Custom SVG study companion with graduation cap, multiple expressive states (`idle`, `happy`, `oops`, `thinking`), and **real-time pointer tracking pupils** that follow cursor movements across the viewport.
- **Typography:** Modern clean sans-serif paired with classic Georgia serif wordmarks for authoritative editorial presence.

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) | High-performance server rendering, streaming, static generation, API routes |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) | Strict type-safety, zero `any` policy |
| **Database & ORM** | [PostgreSQL 16+](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) | Relational data persistence with fully typed schema migrations |
| **Test Database Engine** | [`@electric-sql/pglite`](https://pglite.electric-sql.com/) | Real C-compiled PostgreSQL compiled to WebAssembly for instant, zero-mock integration tests |
| **Authentication** | [Better Auth](https://www.better-auth.com/) | Secure user session management, credentials auth, workspace isolation |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Bespoke civic color system, dark red theme, and accessible primitives |
| **Unit & Component Testing**| [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) | Sub-second unit test execution and DOM assertion |
| **E2E Testing** | [Playwright](https://playwright.dev/) | Cross-browser automated user flows (countdown timer, auto-submit, jump palette) |
| **Icons & Micro-Interactions** | [Lucide React](https://lucide.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Scalable vector icons and delightful completion micro-animations |
| **Code Quality** | ESLint 9 + Prettier + Husky | Strict linting, formatting, and pre-commit verification hooks |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: 20.x or higher (LTS recommended)
- **npm**: 10.x or higher
- **PostgreSQL**: Local Postgres 16 instance or remote URL (e.g. Neon, Supabase). *Note: Integration tests run in-memory via PGlite WASM and do not require a live Postgres daemon.*

### 1. Clone the Repository
```bash
git clone https://github.com/CyberSphinxxx/CSEReviewerPH.git
cd CSEReviewerPH
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to create your local `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the development values:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/csereviewer"
BETTER_AUTH_SECRET="development-secret-at-least-32-characters-long"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run Migrations & Seed Database
```bash
# Execute Drizzle SQL migrations
npm run db:migrate

# Seed exam subjects, topics, and initial diagnostic question bank
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Verification & Quality Gates

This repository enforces **The Non-Negotiable Rule**: No task, branch, or feature is complete until `npm run verify` exits with code 0.

```bash
npm run verify
```

`npm run verify` executes the following quality checks sequentially:
1. `npm run typecheck` — Static TypeScript verification (`tsc --noEmit`).
2. `npm run lint` — ESLint validation with zero tolerance for syntax or style errors.
3. `npm run check:architecture` — Automated scanner ensuring `src/features/exam-engine/` contains zero hardcoded exam branches.
4. `npm run test` — Vitest test runner executing all unit, component, and PostgreSQL integration tests (backed by PGlite WASM).
5. `npm run build` — Next.js production build compiler verifying all static pages and route handlers.

### Running End-to-End Tests
```bash
npm run test:e2e
```
Playwright verifies core user scenarios:
- Seamless exam runner navigation (Next, Prev, Question Palette jump).
- Question bookmarking and review flags.
- **Continuous Timer Auto-Submit:** Simulates countdown expiry to ensure exams finalize, compute scores, and redirect to `/results` without data loss.

### Continuous Integration (GitHub Actions)
Every push to `main` and all pull requests run `.github/workflows/ci.yml` on clean Ubuntu runners with a live PostgreSQL container, executing:
- Automated DB migration verification
- Unit and integration tests with timer cleanup protection
- Playwright browser test verification
- Next.js production bundle compilation

---

## 📱 Progressive Web App (PWA) & Offline Mode

ReviewTayo is built with offline-first capabilities to support reviewees with unstable mobile data connections across the Philippines:
- **Service Worker (`sw.js`):** Caches critical assets, question prompts, and offline review pages.
- **PWA Manifest (`manifest.json`):** Allows users to install ReviewTayo as a standalone mobile application on iOS and Android.
- **Local Progress Sync:** Offline question answers and bookmark updates persist in localStorage and sync smoothly to the backend database upon network reconnection.

---

## 🔒 Data Privacy Compliance (RA 10173)

In accordance with the **Philippine Data Privacy Act of 2012 (RA 10173)**:
- **Zero Surreptitious Tracking:** Analytics and telemetry scripts are strictly gated behind user consent.
- **90-Day Retention on Inquiries:** Contact and feedback submissions are automatically purged after 90 days.
- **Data Export & Erasure:** Users retain the absolute right to export their complete question history and permanently delete their accounts and test data.
- **No Resale of Personal Data:** User information is never monetized, traded, or shared with third-party advertisers.

---

## ⚖️ Legal Disclaimer & Content Ethics

### Official Government Disclaimer
**ReviewTayo / CSEReviewerPH is an independent, private educational platform.** It is **not** affiliated with, endorsed by, accredited by, or associated with the **Civil Service Commission (CSC)**, the **Professional Regulation Commission (PRC)**, the **National Police Commission (NAPOLCOM)**, or any agency of the Philippine Government.

Practice tests, diagnostic scoring, and study materials are original educational resources designed solely for self-study and preparation. Diagnostic scores do not guarantee or represent an official CSC rating or Certificate of Eligibility.

### Original Content Policy
All questions, rationales, and explanations hosted on ReviewTayo are original works authored from primary legal sources, standard academic curricula, and public syllabi. We maintain a zero-tolerance policy against scraping, copying, or distributing copyrighted materials from external review centers, commercial reviewer books, or social media groups.

---

## 📄 License

This repository is distributed under the [MIT License](LICENSE).
