# ReviewTayo / CSEReviewerPH: An Architectural and Psychometric Specification for Standardized Philippine Licensure and Civil Service Examination Preparation

[![Verification Suite](https://img.shields.io/badge/verify-passing-emerald.svg)](#11-verification-pipeline-and-quality-assurance-invariants)
[![Next.js 15](https://img.shields.io/badge/Next.js-15_(App_Router)-black.svg)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)](https://www.typescriptlang.org/)
[![PostgreSQL 16+](https://img.shields.io/badge/PostgreSQL-16+-336791.svg)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-C5F74F.svg)](https://orm.drizzle.team/)
[![PGlite WASM](https://img.shields.io/badge/PGlite-In--Memory_Postgres-FF6B6B.svg)](https://pglite.electric-sql.com/)
[![Tailwind CSS v3](https://img.shields.io/badge/TailwindCSS-v3-38B2AC.svg)](https://tailwindcss.com/)
[![RA 10173 Compliant](https://img.shields.io/badge/Data_Privacy-RA_10173-success.svg)](#10-regulatory-compliance-and-ethical-governance)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [1. Abstract and Pedagogical Motivation](#1-abstract-and-pedagogical-motivation)
- [2. Core Engineering Axioms and Architectural Invariants](#2-core-engineering-axioms-and-architectural-invariants)
- [3. Psychometric and Examination Specifications](#3-psychometric-and-examination-specifications)
- [4. Multi-Tier System Architecture](#4-multi-tier-system-architecture)
- [5. Examination Finite State Machine Specification](#5-examination-finite-state-machine-specification)
- [6. Relational Database Schema and Data Dictionary](#6-relational-database-schema-and-data-dictionary)
- [7. Stratified Question Sampling and Selection Pipeline](#7-stratified-question-sampling-and-selection-pipeline)
- [8. Progressive Web Application and Offline Resilience](#8-progressive-web-application-and-offline-resilience)
- [9. Pedagogical Remediation and Spaced Repetition](#9-pedagogical-remediation-and-spaced-repetition)
- [10. Regulatory Compliance and Ethical Governance](#10-regulatory-compliance-and-ethical-governance)
- [11. Verification Pipeline and Quality Assurance Invariants](#11-verification-pipeline-and-quality-assurance-invariants)
- [12. Local Deployment, Environment Configuration, and Operation](#12-local-deployment-environment-configuration-and-operation)
- [13. Codebase Directory Topology](#13-codebase-directory-topology)
- [14. Legal Disclaimer and Intellectual Property Declarations](#14-legal-disclaimer-and-intellectual-property-declarations)

---

## 1. Abstract and Pedagogical Motivation

Standardized civil service and professional licensure assessments in the Republic of the Philippines serve as critical gatekeepers for public sector employment, tenure, and professional accreditation. The Career Service Examination Paper-and-Pencil Test (CSE-PPT), administered biannually by the Civil Service Commission (CSC), historically demonstrates national passing rates oscillating between 10% and 18%. 

Empirical analysis of examinee performance reveals that high failure rates are attributable not only to subject matter deficiencies, but to acute cognitive fatigue, poor pacing strategies, and unfamiliarity with the structural constraints of high-stakes testing. Traditional review methodologies rely primarily on:
1. Static, uncurated PDF documents distributed through social networks, frequently riddled with typographical errors and obsolete legal references.
2. Fragmented question compilations lacking verified answer rationales.
3. Commercial web applications employing artificial, per-item countdown timers (for example, 60 seconds per question), which distort pacing habits and fail to replicate the cognitive endurance required for multi-hour continuous testing.

ReviewTayo (formerly CSEReviewerPH) is an open-source, mathematically disciplined web platform engineered to eliminate these structural discrepancies. By deploying an authentic single continuous countdown timer (190 minutes for Professional, 160 minutes for Subprofessional), deterministic stratified item selection, dynamic diagnostic radars, and an automated remediation engine, the platform establishes a psychometrically faithful simulation environment.

Furthermore, while the Civil Service Examination represents the initial reference implementation, the platform engine is designed under a generic multi-exam architecture capable of hosting examinations for the Licensure Examination for Teachers (LET), Nursing Licensure Examination (NLE), and National Police Commission (NAPOLCOM) entrance examinations through declarative configuration alone.

---

## 2. Core Engineering Axioms and Architectural Invariants

The platform architecture is governed by three non-negotiable engineering invariants:

### 2.1 The Zero-Branching Engine Invariant
Engine logic governing test item selection, psychometric scoring, countdown timing, and navigation state transitions resides within `src/features/exam-engine/`. This layer is strictly decoupled from specific examination identifiers. 

Hardcoded branching on examination types (such as `if (exam === 'CSE')`) is forbidden. All examination-specific attributes:
- Subject distribution quotas
- Item counts and time limits
- Passing mark thresholds
- Content exclusivity constraints (for example, Analytical Ability versus Clerical Ability)

are supplied dynamically through strongly typed configuration schemas (`ExamConfig`, `ExamLevelConfig`). This invariant is verified deterministically in continuous integration through an automated AST scanner (`scripts/check-architecture.mjs`).

### 2.2 Strict Invariance of the Continuous Single Timer
Under official CSC-PPT guidelines, examinees receive a single composite test booklet and an aggregate time allocation. Subtest transitions are self-directed without mandatory intermediate stoppages. 

Consequently, the Full Mock Exam mode strictly forbids per-section or per-question timing splits. The exam runner operates an uninterrupted monolithic countdown clock with synchronized server-side timestamp validation and browser visibility reconciliation.

### 2.3 Idempotent State Transitions and Atomic Auditing
All state modifications during an examination attempt:
- Recording an answer
- Toggling a review bookmark
- Transitioning between items
- Final submission

are executed as idempotent transactions. In the event of network disruption, client-side mutations persist locally and reconcile seamlessly against the central relational store upon reconnection.

---

## 3. Psychometric and Examination Specifications

### 3.1 Comparative Examination Level Topology

The platform models the official Civil Service Commission specifications across both examination levels:

| Psychometric Metric | Career Service Professional Level | Career Service Subprofessional Level |
| :--- | :--- | :--- |
| Target Classification | 2nd Level Technical and Supervisory Positions | 1st Level Clerical and Administrative Positions |
| Total Item Volume ($N$) | 170 items | 165 items |
| Aggregate Time Allocation ($T$) | 3 hours 10 minutes (190 minutes / 11,400 seconds) | 2 hours 40 minutes (160 minutes / 9,600 seconds) |
| Mean Time per Item ($\mu_t$) | 67.06 seconds | 58.18 seconds |
| Criterion Passing Benchmark | 80.00% diagnostic composite score | 80.00% diagnostic composite score |
| Subtest 1: Verbal Ability | English and Filipino syntax, grammar, vocabulary, reading comprehension | English and Filipino syntax, grammar, vocabulary, reading comprehension |
| Subtest 2: Numerical Ability | Arithmetic operations, number series, fractions, word problems, data interpretation | Arithmetic operations, number series, fractions, word problems, data interpretation |
| Subtest 3: Exclusive Competency | **Analytical Ability** (Logic, syllogisms, analogies, critical reasoning) | **Clerical Ability** (Alphabetizing, filing protocol, clerical error detection) |
| Subtest 4: General Information | Philippine Constitution, RA 6713, Human Rights, Environmental Protection | Philippine Constitution, RA 6713, Human Rights, Environmental Protection |

### 3.2 Scoring Formulation under Classical Test Theory (CTT)

The platform evaluates diagnostic performance using criterion-referenced Classical Test Theory. 

Let $N$ represent the total number of items in the examination level. For an examinee's attempt, let $y_i$ denote the binary scoring outcome for item $i$:

```text
y_i = 1  if response corresponds to the designated key
y_i = 0  if response is incorrect or omitted
```

The raw diagnostic score $S_{\text{raw}}$ is computed as:

```text
S_raw = SUM(y_i) for i = 1 to N
```

The composite percentage score $P$ is expressed as:

```text
P = (S_raw / N) * 100
```

The determination of qualification status $Q$ evaluates against the statutory 80.00% threshold:

```text
Q = Qualified      if P >= 80.00%
Q = Did Not Qualify if P < 80.00%
```

In strict conformance with CSC-PPT administration rules, no formula scoring penalty (negative marking for incorrect responses) is applied:

```text
Penalty = 0.00
```

Examinees are methodologically advised to attempt every item prior to the expiration of $T$.

---

## 4. Multi-Tier System Architecture

The following diagram illustrates the component topology and data flow across presentation, edge, application, engine, and persistence layers:

```mermaid
graph TD
    subgraph ClientLayer["Presentation and Client Tier"]
        UI["React 19 Server and Client Components"]
        SW["Service Worker (sw.js) Cache Storage"]
        LS["Optimistic LocalStorage State Store"]
        Canvas["Interactive Answer Palette and Scratchpad"]
    end

    subgraph EdgeLayer["Edge and Routing Tier (Next.js 15 App Router)"]
        PublicRoutes["Public Static Routes: / (Home), /reviewers, /study-resources, /guides"]
        AppRoutes["Protected App Routes: /practice, /dashboard, /results"]
        APIRoutes["Route Handlers: /api/auth, /api/contact, /api/sync"]
        RateLimiter["Rate Limiting and Header Sanitization"]
    end

    subgraph ApplicationLayer["Application Services"]
        AuthService["Better Auth Session Validation"]
        ProgressService["User Progress and Mastery Calculator"]
        RemediationService["Mistake Bank and Spaced Repetition"]
        AnalyticsGate["RA 10173 Consent-Gated Telemetry Filter"]
    end

    subgraph EngineLayer["Pure Exam Engine (src/features/exam-engine/)"]
        Selector["QuestionSelector (Stratified Sampling)"]
        Timer["ExamTimer (Continuous Countdown Clock)"]
        Scorer["ScoringEngine (Subtest and Composite Matrix)"]
        StateMachine["ExamStateMachine (Finite Automaton)"]
    end

    subgraph DataLayer["Persistence and Integration Tier"]
        Drizzle["Drizzle ORM Query Layer"]
        PostgresProd["PostgreSQL 16+ Database (Production)"]
        PGliteWasm["@electric-sql/pglite WASM (Zero-Mock Testing)"]
    end

    UI --> EdgeLayer
    SW --> UI
    LS --> UI
    Canvas --> UI

    EdgeLayer --> RateLimiter
    RateLimiter --> ApplicationLayer
    
    ApplicationLayer --> EngineLayer
    ApplicationLayer --> Drizzle

    EngineLayer --> Drizzle

    Drizzle --> PostgresProd
    Drizzle -.->|Test Harness Execution| PGliteWasm
```

---

## 5. Examination Finite State Machine Specification

The lifecycle of an examination session is governed by a strictly defined Finite State Automaton $M = (S, \Sigma, \delta, s_0, F)$:
- $S$: Set of valid execution states
- $\Sigma$: Set of input events (actions triggered by the examinee or timer)
- $\delta$: Deterministic transition function $S \times \Sigma \rightarrow S$
- $s_0$: Initial state (`Configured`)
- $F$: Set of final accepting states (`Submitted`, `TerminatedByExpiration`)

```mermaid
stateDiagram-v2
    [*] --> Configured: Initialize session with ExamConfig
    
    Configured --> Active: Trigger start_exam
    
    state Active {
        [*] --> ItemView
        ItemView --> SelectionSaved: Select Choice (A, B, C, D, E)
        SelectionSaved --> ItemView: Acknowledge choice update
        ItemView --> FlagToggled: Toggle bookmark flag
        FlagToggled --> ItemView: Update status in palette
        ItemView --> PaletteJump: Direct item selection
        PaletteJump --> ItemView: Load target item index
    }
    
    Active --> Paused: Trigger pause_exam (Practice Mode only)
    Paused --> Active: Trigger resume_exam
    
    Active --> TerminatedByExpiration: Continuous timer reaches 00:00:00
    Active --> ReviewModal: Trigger review_and_submit
    
    ReviewModal --> Active: Return to test items
    ReviewModal --> Submitted: Confirm submission
    
    TerminatedByExpiration --> Scored: Auto-invoke score computation
    Submitted --> Scored: Auto-invoke score computation
    
    Scored --> Remediated: Extract incorrect items to Mistake Bank
    Remediated --> [*]: Redirect to /results/[attemptId]
```

### State Transition Invariants

1. **Monotonic Clock Transition**: In Full Mock Exam mode, transitions to `Paused` are rejected by the state machine to preserve simulation authenticity.
2. **Forced Expiration Finalization**: When the continuous countdown reaches zero, the state machine unconditionally rejects further mutation events and commits the existing response vector to `TerminatedByExpiration`.
3. **Idempotent Scoring Execution**: The transition from `Submitted` or `TerminatedByExpiration` to `Scored` is executed within an atomic database transaction. Multiple submission triggers cannot produce duplicate score records.

---

## 6. Relational Database Schema and Data Dictionary

The persistence model is implemented in PostgreSQL 16+ through Drizzle ORM. The relational structure isolates question bank taxonomies from individual user attempt logs.

```mermaid
erDiagram
    EXAMS ||--o{ EXAM_LEVELS : "contains levels"
    EXAMS ||--o{ SUBJECTS : "defines subjects"
    EXAM_LEVELS ||--o{ TESTS : "configures"
    SUBJECTS ||--o{ TOPICS : "partitions into"
    TOPICS ||--o{ QUESTIONS : "categorizes"
    QUESTIONS ||--|{ CHOICES : "possesses options"
    QUESTIONS ||--o{ USER_ANSWERS : "evaluated against"
    QUESTIONS ||--o{ BOOKMARKS : "referenced in"
    QUESTIONS ||--o{ QUESTION_REPORTS : "receives feedback"
    
    USERS ||--o{ TEST_ATTEMPTS : "undertakes"
    USERS ||--o{ BOOKMARKS : "maintains"
    USERS ||--o{ QUESTION_REPORTS : "submits"
    
    TESTS ||--o{ TEST_ATTEMPTS : "instantiated by"
    TEST_ATTEMPTS ||--o{ USER_ANSWERS : "contains recorded responses"

    EXAMS {
        string id PK
        string slug UK
        string name
        string shortName
        string category
        string agency
        boolean isActive
        timestamp createdAt
    }

    EXAM_LEVELS {
        string id PK
        string examId FK
        string slug
        string name
        integer itemCount
        integer durationMinutes
        numeric passingPercentage
    }

    SUBJECTS {
        string id PK
        string examId FK
        string slug
        string name
        integer sortOrder
    }

    TOPICS {
        string id PK
        string subjectId FK
        string slug
        string name
    }

    QUESTIONS {
        string id PK
        string topicId FK
        string language
        text prompt
        text explanation
        string difficulty
        string status
        timestamp createdAt
    }

    CHOICES {
        string id PK
        string questionId FK
        string label
        text text
        boolean isCorrect
    }

    TEST_ATTEMPTS {
        string id PK
        string userId FK
        string testId FK
        string examLevelId FK
        integer rawScore
        numeric percentageScore
        boolean passed
        integer timeSpentSeconds
        string status
        timestamp startedAt
        timestamp completedAt
    }

    USER_ANSWERS {
        string id PK
        string attemptId FK
        string questionId FK
        string selectedChoiceId FK
        boolean isCorrect
        integer timeSpentSeconds
    }

    BOOKMARKS {
        string id PK
        string userId FK
        string questionId FK
        text notes
        timestamp createdAt
    }
```

### 6.1 Entity Specification Details

- **`questions`**: Maintains individual psychometric items. Enforces a `language` discriminant (`en` for English items, `fil` for Filipino items) and strict lifecycle tracking (`draft`, `under_review`, `approved`, `published`, `archived`). Questions are never physically purged; decommissioned items transition to `archived`.
- **`choices`**: Normalized multi-choice options with a single true key flag (`isCorrect`).
- **`test_attempts`**: Audit record of completed or in-flight diagnostic examinations, including aggregate duration, raw score, computed percentage score, and completion timestamp.
- **`user_answers`**: Atomic log of each question response, capturing the choice selected, correctness determination, and time spent on the specific question.

---

## 7. Stratified Question Sampling and Selection Pipeline

To ensure diagnostic validity across practice modes and mock examinations, test item composition must strictly respect subject weightings rather than drawing purely at random.

```mermaid
flowchart LR
    A["Raw Question Repository (Status: Published)"] --> B["Filter by Target Exam and Level Eligibility"]
    B --> C["Stratification Partitioning by Subject"]
    
    C --> D1["Subtest 1: Verbal Ability (English and Filipino)"]
    C --> D2["Subtest 2: Numerical Ability"]
    C --> D3["Subtest 3: Exclusive Competency (Analytical or Clerical)"]
    C --> D4["Subtest 4: General Information (Constitution, RA 6713)"]
    
    D1 --> E1["Deterministic Seed Shuffle (Fisher-Yates)"]
    D2 --> E2["Deterministic Seed Shuffle (Fisher-Yates)"]
    D3 --> E3["Deterministic Seed Shuffle (Fisher-Yates)"]
    D4 --> E4["Deterministic Seed Shuffle (Fisher-Yates)"]
    
    E1 --> F1["Extract Subject Quota k_1 items"]
    E2 --> F2["Extract Subject Quota k_2 items"]
    E3 --> F3["Extract Subject Quota k_3 items"]
    E4 --> F4["Extract Subject Quota k_4 items"]
    
    F1 --> G["Concatenate and Interleave Examination Vector"]
    F2 --> G
    F3 --> G
    F4 --> G
    
    G --> H["Final Ordered Test Assessment (Item Count: N)"]
```

### Mathematical Selection Formulation

Let $K$ be the set of subjects defined for exam level $L$. For each subject $j \in K$, the configuration establishes a required item count $q_j$ such that:

```text
SUM(q_j) = N  for all j in K
```

For each subject partition $j$, let $U_j$ represent the set of published questions. The selector draws a subset $V_j \subset U_j$ such that $|V_j| = q_j$ using uniform random selection without replacement:

```text
P(X = x) = 1 / (|U_j| - m)
```

where $m$ denotes the index of the current draw. The subsets $V_j$ are then concatenated in standardized curricular order to produce the final test vector.

---

## 8. Progressive Web Application and Offline Resilience

Recognizing variable internet infrastructure and bandwidth constraints across Philippine administrative regions, the platform implements an offline-first execution profile via Progressive Web Application standards.

```mermaid
sequenceDiagram
    autonumber
    actor Examinee as Examinee Browser
    participant SW as Service Worker (sw.js)
    participant Cache as CacheStorage / LocalStorage
    participant API as Next.js API Routes
    participant DB as PostgreSQL Database

    Examinee->>SW: Navigate to /practice or /mock-exam
    alt Network Available
        SW->>API: Request test configuration and question bundle
        API->>DB: Fetch stratified question records
        DB-->>API: Return question set
        API-->>SW: JSON payload
        SW->>Cache: Persist question bundle and assets
        SW-->>Examinee: Render examination runner
    else Network Disconnected
        SW->>Cache: Query cached question bundle
        Cache-->>SW: Return offline bundle
        SW-->>Examinee: Render examination runner in Offline Mode
    end

    loop Active Examination Session (Offline or Degraded Network)
        Examinee->>Cache: Save answer mutation (Item i, Choice C)
        Cache-->>Examinee: Confirm atomic local persistence
    end

    Examinee->>Cache: Finalize Exam Submission
    Note over Examinee,Cache: Test marked as pending_sync in LocalStorage

    opt Network Reconnection Detected (window.online event)
        Examinee->>API: Transmit pending_sync test attempt payload
        API->>DB: Execute atomic insert (test_attempt + user_answers)
        DB-->>API: Confirm transaction commit
        API-->>Examinee: Return verified score and server attemptId
        Examinee->>Cache: Clear local pending_sync queue
    end
```

### Caching Strategy Matrix

1. **Static Shell and Design Primitives**: Cache-First with Stale-While-Revalidate fallback. Static fonts, brand vectors, and compiled stylesheet bundles are cached indefinitely.
2. **Diagnostic Question Sets**: Network-First with Cache Fallback. The client attempts to fetch the latest published version of question items from the server; if unreachable, the client falls back to locally stored question bundles.
3. **Session Mutation Queues**: Optimistic Local Persistence. State mutations are recorded instantaneously to browser `localStorage`. A synchronization background listener reconciles dirty records upon network availability.

---

## 9. Pedagogical Remediation and Spaced Repetition

Diagnostic assessment without structured remediation yields limited cognitive improvement. ReviewTayo integrates an automated remediation engine consisting of three pedagogical subsystems:

```text
Diagnostic Testing
        |
        v
Evaluation & Scoring
        |
   +----+----+
   |         |
   v         v
Correct   Incorrect
   |         |
   |         v
   |    Mistake Bank Extraction
   |         |
   |         v
   |    Diagnostic Radar Deficiency Profiling
   |         |
   +----+----+
        |
        v
Spaced Repetition Practice (Modified Leitner)
```

### 9.1 The Automated Mistake Bank
Upon examination completion, the engine parses the set of responses where $y_i = 0$. These items are indexed with error metadata:
- Subject and topic classification
- Distractor selected by the examinee
- Detailed rationale highlighting the common cognitive pitfall

Examinees can launch targeted practice drills filtered exclusively from their personal Mistake Bank, isolating deficit areas until mastery is demonstrated.

### 9.2 The Diagnostic Topic Radar
Performance metrics are aggregated by subtest and micro-topic to construct an empirical readiness index:

```text
Mastery_j = (Correct Responses in Subject j / Total Items Attempted in Subject j) * 100
```

Visual radar plots contrast individual performance against the 80.00% mastery threshold, guiding the examinee's subsequent study allocations.

### 9.3 Spaced Repetition Scheduling
Remediation drills employ a modified Leitner compartment algorithm. When an examinee successfully resolves an item previously logged in the Mistake Bank across two consecutive sessions, the item is promoted to the mastered tier and scheduled for verification review at increasing intervals (3 days, 7 days, 21 days).

---

## 10. Regulatory Compliance and Ethical Governance

### 10.1 Republic Act No. 10173 (Data Privacy Act of 2012) Compliance

The platform implements stringent data governance measures in strict adherence to Philippine data privacy jurisprudence:

1. **Explicit Consent Gating**: Telemetry, tracking, and performance analytics scripts (such as PostHog) are completely blocked from loading until the user renders informed consent via the cookie preferences interface.
2. **Data Minimization Principle**: User authentication requires only an email address and hashed credential. Extraneous biographical identifiers (such as government identification numbers, civil status, or financial records) are neither requested nor stored.
3. **Automated Purge Cycles for Public Communications**: Inquiries submitted through the contact interface are automatically deleted from the relational store after 90 calendar days.
4. **Data Portability and Right to Erasure**: Registered examinees retain the absolute statutory right to download their complete testing history in structured JSON format and permanently execute an irrevocable account and record deletion.
5. **Prohibition of Data Commercialization**: User data is never licensed, monetized, or transferred to third-party commercial entities or educational review centers.

### 10.2 Republic Act No. 6713 Integration

Curricular questions covering General Information directly incorporate the statutory mandates of the **Code of Conduct and Ethical Standards for Public Officials and Employees (RA 6713)**:
- Commitment to public interest
- Professionalism and political neutrality
- Responsiveness to the public
- Simplicity of living
- Financial disclosure and conflict of interest rules

Review items in this subtest are authored to assess real-world ethical dilemmas encountered by civil servants rather than rote statutory memorization.

### 10.3 Intellectual Property and Original Content Policy

All review questions, diagnostic prompts, and answer rationales hosted within the system are original intellectual works authored from:
- Primary statutory texts (for example, the 1987 Philippine Constitution, Republic Acts)
- Public administrative syllabi published by the Civil Service Commission
- Standard undergraduate mathematics and linguistic curricula

The platform maintains a strict zero-tolerance policy against scraping, copying, or reproducing copyrighted materials from commercial reviewer textbooks, private review academies, or digital document repositories (such as Scribd or social media study pools).

---

## 11. Verification Pipeline and Quality Assurance Invariants

Continuous code quality and psychometric correctness are enforced through automated verification gates. In accordance with platform governance, **a task is incomplete until `npm run verify` exits with code 0**.

```text
                  Verification Pipeline Architecture
                  
[ Commit / PR ]
       |
       v
1. npm run typecheck         TypeScript 5.7 strict compilation (tsc --noEmit)
       |
       v
2. npm run lint              ESLint 9 syntax and styling rules
       |
       v
3. npm run check:architecture AST scan forbidding hardcoded exam branches
       |
       v
4. npm run test              Vitest unit and PGlite WASM integration suite
       |
       v
5. npm run build             Next.js 15 production compiler and SSG validation
       |
       +-------------------> PASS (Exit Code 0) / FAIL (Halt Pipeline)
```

### 11.1 Quality Gate Descriptions

1. **`npm run typecheck`**: Validates comprehensive TypeScript typing across server components, client hooks, and API routes with zero allowance for the `any` escape hatch.
2. **`npm run lint`**: Executes ESLint across all source directories to enforce consistent coding standards, import hygiene, and React hook dependencies.
3. **`npm run check:architecture`**: An automated AST inspection script that recursively verifies that no files inside `src/features/exam-engine/` contain hardcoded references or conditional branching based on specific exam identifiers.
4. **`npm run test`**: Runs the complete unit and integration test suite via Vitest. Database integration tests utilize `@electric-sql/pglite`, executing genuine C-compiled PostgreSQL in an in-memory WebAssembly instance. This delivers authentic relational constraints, foreign keys, and cascading triggers without mocking external dependencies.
5. **`npm run build`**: Compiles the production Next.js application, executing static site generation (SSG) across all public routes and validating server bundle integrity.

### 11.2 End-to-End Automation with Playwright

Cross-browser functional workflows are verified via Playwright (`npm run test:e2e`), ensuring:
- Single continuous timer auto-submission behavior upon reaching zero
- Jump palette navigation and keyboard accessibility
- Bookmark toggling and question flagging responsiveness
- Cookie consent banner state enforcement

---

## 12. Local Deployment, Environment Configuration, and Operation

### 12.1 Prerequisites

- **Node.js**: Version 20.x LTS or higher
- **npm**: Version 10.x or higher
- **PostgreSQL**: Version 16 or higher (or an external hosted PostgreSQL instance such as Neon or Supabase)

### 12.2 Installation Protocol

Clone the git repository and install the development dependencies:

```bash
git clone https://github.com/CyberSphinxxx/CSEReviewerPH.git
cd CSEReviewerPH
npm install
```

### 12.3 Environment Variable Configuration

Initialize your local environment file:

```bash
cp .env.example .env.local
```

Configure the environment parameters:

| Variable Name | Classification | Description | Sample Development Value |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Required | Standard PostgreSQL connection URI | `postgresql://postgres:password@localhost:5432/csereviewer` |
| `BETTER_AUTH_SECRET` | Required | High-entropy signing secret (min. 32 characters) | `development-secret-at-least-32-characters-long` |
| `BETTER_AUTH_URL` | Required | Fully qualified domain of the authentication endpoint | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Required | Base application URL for absolute URL generation | `http://localhost:3000` |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | PostHog telemetry project identifier | `phc_placeholder_key` |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional | Ingestion endpoint for PostHog instances | `https://us.i.posthog.com` |

### 12.4 Database Migration and Seed Initialization

Execute the schema migrations and populate initial reference data:

```bash
# Apply SQL migrations via Drizzle Kit
npm run db:migrate

# Seed baseline exams, levels, subjects, topics, and diagnostic items
npm run db:seed
```

### 12.5 Development Server Execution

Initiate the local development environment:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 13. Codebase Directory Topology

The project is structured according to domain-driven design principles:

```text
src/
├── app/                           # Next.js 15 App Router routing trees
│   ├── (public)/                  # Static and SEO routes: landing, /reviewers, /study-resources, /privacy
│   ├── (app)/                     # Authenticated interactive routes: /practice, /dashboard, /results
│   ├── api/                       # HTTP API handlers: /api/auth, /api/contact, /api/sync
│   ├── layout.tsx                 # Root application shell and providers
│   └── globals.css                # Tailwind base styles and design system variables
├── components/                    # Reusable React UI design components
│   ├── layout/                    # Site navigation headers, footers, mobile drawers
│   ├── brand/                     # SVG brand assets and animated study companion
│   └── ui/                        # Accessible primitive components (buttons, dialogs, badges)
├── config/                        # Multi-exam catalog configurations, goals, and directory listings
│   ├── exams.ts                   # Strongly typed exam definitions and subtest distributions
│   ├── exam-directory.ts          # Comprehensive metadata for Philippine licensure exams
│   └── practice-modes.ts          # Quick, Medium, Full Mock, and Topic Drill specifications
├── db/                            # Relational persistence layer
│   ├── schema/                    # Drizzle schema definitions by domain
│   │   ├── exams.ts               # Exam and level definitions
│   │   ├── subjects.ts            # Subject and topic taxonomy
│   │   ├── questions.ts           # Question prompts, choices, and language markers
│   │   ├── attempts.ts            # Test attempts, answers, and bookmarks
│   │   ├── auth.ts                # Better Auth user and session tables
│   │   └── contact.ts             # Contact form audit log (90-day retention)
│   └── migrations/                # Version-controlled, immutable SQL migration files
├── features/                      # Encapsulated domain feature logic
│   ├── exam-engine/               # Pure, zero-branching engine (selection, scoring, timing)
│   ├── question-bank/             # Question querying, filtering, and lifecycle management
│   ├── practice/                  # Interactive exam runner UI, keyboard palette, scratchpad
│   ├── results/                   # Diagnostic score computation and subtest breakdowns
│   └── dashboard/                 # Readiness radars, mistake queues, and streaks
└── lib/                           # Shared infrastructure utilities
    ├── auth.ts                    # Better Auth client and server configurations
    ├── db.ts                      # Drizzle PostgreSQL connection pool instance
    ├── consent.ts                 # RA 10173 cookie and analytics gatekeeper
    └── utils.ts                   # Class name merging and formatting utilities

tests/
├── unit/                          # Component and pure function test suites
├── integration/                   # PGlite WASM in-memory PostgreSQL database suites
└── e2e/                           # Playwright end-to-end browser automation specs

scripts/
├── check-architecture.mjs         # AST validator enforcing zero-branching engine constraints
├── commit-individual-files.mjs    # Conventional git commit workflow helper
└── generate-pwa-icons.mjs         # Vector-to-raster PWA manifest icon generator
```

---

## 14. Legal Disclaimer and Intellectual Property Declarations

### 14.1 Statutory Government Disclaimer

**ReviewTayo / CSEReviewerPH is an independent, non-governmental educational technology initiative.** 

This platform is **not affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with the Civil Service Commission (CSC), the Professional Regulation Commission (PRC), the National Police Commission (NAPOLCOM), or any agency, department, bureau, or instrumentality of the Government of the Republic of the Philippines.**

All official government titles, examination names, acronyms, and organizational references (including Civil Service Examination, Career Service Examination Paper-and-Pencil Test, CSE-PPT, CSC, PRC, and NAPOLCOM) are utilized exclusively under nominative fair use principles for identification and descriptive educational purposes.

Diagnostic examination scores, ratings, and performance estimates generated by this software do not constitute, represent, or guarantee an official Certificate of Eligibility or examination rating from any government body.

### 14.2 License

This software and its documentation are open-source artifacts licensed under the terms of the [MIT License](LICENSE).
