# ReviewTayo SEO Audit Report & Search Intent Architecture

**Document Version:** 1.0.0  
**Audit Date:** 2026-09-17  
**Platform:** ReviewTayo (`reviewtayo.online`)  
**Scope:** Architecture, canonical configuration, metadata, robots/sitemap, structured data, content depth, internal linking, mobile readiness, and keyword mapping.

---

## 1. Executive Summary & Baseline SEO Findings

This audit establishes the baseline technical and content SEO state of ReviewTayo prior to optimization. The platform has a high-quality foundation (clean App Router architecture, zero copied exam questions, mobile-first layouts, strict data privacy per RA 10173, and single continuous timer fidelity matching the CSC-PPT). However, several key technical and content gaps hindered organic search discovery:

### Key Technical Findings
1. **Canonical Hostname Drift Risk**: While `next.config.ts` enforces a 308 redirect from `reviewtayo.online` to `https://www.reviewtayo.online`, `src/lib/env.ts` (`getBaseUrl()`) permitted bare apex URLs if `VERCEL_PROJECT_PRODUCTION_URL` was configured without the `www.` subdomain.
2. **Duplicate Title Tag Brand Suffixes**: The root layout in `src/app/layout.tsx` declared `template: "%s | ReviewTayo"`. Several child pages (including `/guides`, `/articles`, `/articles/[slug]`, and `/guides/[slug]`) manually appended `— ReviewTayo` or `— ReviewTayo`, causing rendered titles in production HTML to duplicate the brand name (e.g. `... — ReviewTayo | ReviewTayo`), wasting character limits and diluting keyword relevance.
3. **Obsolete Meta Keywords**: `<meta name="keywords">` tags were declared in `src/app/layout.tsx`, `src/app/(public)/cse/exam-guide/page.tsx`, and `src/app/(public)/guides/[slug]/page.tsx`. Google Search officially confirmed in 2009 that meta keywords are completely ignored for ranking and indexing.
4. **Missing Noindex on Interactive Session Runners & Settings**: While active exam mocks (`/exams/[level]/[mode]`) were excluded via layout `noindex`, topic runners (`/practice/[topicId]`) inherited `canonical: "/practice"` without `noindex`, and `/settings/*` lacked server-side `noindex` directives, creating crawl budget inefficiencies.
5. **Homepage Search-Intent Alignment**: The homepage `<h1>` was "Know what to study next." While user-friendly, it lacked the primary target query ("Free Philippine Civil Service Exam Reviewer & Online Mock Tests") in the primary heading, missing the strongest on-page topical relevance signal.
6. **Underdeveloped Schema.org Structured Data**: Root structured data declared only a bare `WebSite` object without `Organization` publisher details, logo references, or `BreadcrumbList` navigation paths for deep articles and study guides.
7. **Orphaned Search Intent Gaps**: High-volume queries specifically targeting "CSE Professional Reviewer", "CSE Subprofessional Reviewer", and "Civil Service Exam Passing Score / Rating Computation" had no dedicated search-intent landing articles, forcing search engines to match general hub pages.

---

## 2. Keyword-to-Page Search Intent Map

| Keyword Cluster | Primary Query & Natural Variants | Search Intent | Target Route | Current Coverage | Content Gap / Action | Recommended `<title>` | Recommended `<h1>` | Recommended Meta Description | Primary Internal Link Sources |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **General CSE Reviewer** | `cse reviewer`, `free cse reviewer`, `cse reviewer online`, `civil service exam reviewer Philippines` | Navigational / Commercial | `/` | Strong platform overview, but H1 lacked core query | Align H1 and intro copy to primary intent; de-duplicate title | Free Philippine Civil Service Exam Reviewer & Mock Tests | Free Philippine Civil Service Exam Reviewer & Online Mock Tests | 100% free Philippine Civil Service Exam (CSE-PPT) reviewer and mock tests. Practice Professional & Subprofessional exams with real continuous countdown timers. | Header logo, footer brand link, all internal breadcrumb roots |
| **Topic Practice & Drills** | `civil service practice test`, `free civil service exam practice test`, `cse topic practice` | Informational / Practice | `/practice` | Directory exists; runner states leaked into index | Noindex runner states; align H1 and title with practice test intent | Free Civil Service Exam Practice Tests by Subtest | Civil Service Exam Practice Tests & Topic Drills | Target your weak areas with free Philippine Civil Service Exam practice tests. Focused question drills by subtest with step-by-step pedagogical explanations. | Homepage hero, footer "Topic Practice", guide CTAs |
| **Exam Overview & Scope** | `civil service exam reviewer`, `cse exam format`, `civil service exam coverage` | Informational | `/exam-info` | Complete text overview of CSE-PPT | Ensure unique title and clear links to exam guide and mock tests | Civil Service Exam Guide & Syllabus (CSE-PPT Coverage) | Philippine Civil Service Exam (CSE-PPT) Scope & Overview | Official Philippine Civil Service Examination syllabus: Professional & Subprofessional levels, subtest breakdowns, passing mark criteria, and exam day rules. | Footer "CSE-PPT Overview", FAQ answers, homepage |
| **Professional Reviewer** | `cse professional reviewer`, `civil service professional reviewer`, `cse pro reviewer` | Commercial / Informational | `/articles/cse-professional-exam-reviewer-guide` | Only touched in comparison article | **NEW PAGE**: Comprehensive Professional guide (170 items, 3h10m, Analytical Ability, SG-10+) | CSE Professional Reviewer: Complete Exam Scope, Syllabus & Tips | Civil Service Exam Professional Reviewer: Complete Syllabus & Practice Guide | Comprehensive CSE Professional reviewer: 170-item test format, 3h 10m continuous timer, Analytical Ability breakdown, and passing strategies for SG-10+ positions. | Homepage, `/practice`, `/exam-info`, `/exams/professional/full` |
| **Subprofessional Reviewer** | `cse subprofessional reviewer`, `civil service subprofessional reviewer`, `cse subpro reviewer` | Commercial / Informational | `/articles/cse-subprofessional-exam-reviewer-guide` | Only touched in comparison article | **NEW PAGE**: Comprehensive Subprofessional guide (165 items, 2h40m, Clerical Ability, first-level) | CSE Subprofessional Reviewer: Complete Exam Scope & Clerical Guide | Civil Service Exam Subprofessional Reviewer: Clerical Scope & Study Guide | Complete CSE Subprofessional reviewer: 165-item format, 2h 40m continuous timer, Clerical Ability subtest rules (filing, spelling), and first-level eligibility guide. | Homepage, `/practice`, `/exam-info`, `/exams/subprofessional/full` |
| **Passing Score & Rating** | `civil service exam passing score`, `how cse score is calculated`, `cse 80 percent passing` | Informational | `/articles/how-civil-service-exam-scoring-works` | Mentioned in FAQs and results page | **NEW PAGE**: Dedicated article on CSC 80.00% rating vs percentage and ReviewTayo scoring model | How Civil Service Exam Scoring Works: CSC Rating vs Percentage | How Civil Service Exam Scoring Works: Official Rating vs Raw Percentage | Learn how the Civil Service Commission calculates the 80.00% general rating, how subtests are weighted, and how ReviewTayo estimates your exam readiness. | Results scorecard, FAQ answer, `/exam-info`, `/articles` |
| **Continuous Timer Simulation** | `cse mock exam`, `cse mock exam online`, `civil service mock exam`, `timed cse reviewer` | Commercial / Practice | `/articles/continuous-timer-pacing-strategy` | Article exists; title had duplicated brand | De-duplicate title; add breadcrumbs and CTA to full mock exams | Continuous-Timer Pacing Strategy for Civil Service Exam | Continuous-Timer Pacing Strategy: Surviving the 67-Second Limit | Learn how to pace the 170-item Civil Service Exam with a single continuous countdown timer. Subtest time allocation and endurance strategies. | Full mock exam runner intro, homepage outcome section |
| **Numerical Ability** | `numerical ability reviewer`, `civil service math reviewer`, `math shortcuts cse` | Informational / Study | `/guides/numerical-ability-formulas-shortcuts` | Guide exists; title had duplicated brand | De-duplicate title; add breadcrumb schema; link to numerical drills | Numerical Ability Study Guide: Math Formulas & Shortcuts | Numerical Ability: High-Yield Formulas & Mental Math Shortcuts | Essential algebraic formulas, ratio and proportion, percentages, and work rate equations for the Civil Service Exam without a calculator. | `/guides`, `/practice`, `/articles/cse-professional-exam-reviewer-guide` |
| **Verbal Ability** | `verbal ability reviewer`, `civil service english reviewer`, `filipino grammar cse` | Informational / Study | `/guides/verbal-ability-grammar-paragraph-org` | Guide exists; title had duplicated brand | De-duplicate title; add breadcrumb schema; link to verbal drills | Verbal Ability Study Guide: Grammar & Paragraph Organization | Verbal Ability: Grammar, Vocabulary & Paragraph Organization | Master English and Filipino subject-verb agreement, pronoun cases, idiom traps, and chronological clue techniques for the Civil Service Exam. | `/guides`, `/practice`, `/articles/cse-subprofessional-exam-reviewer-guide` |
| **Analytical Ability** | `analytical ability reviewer`, `civil service logic reviewer`, `syllogisms cse` | Informational / Study | `/guides/analytical-ability-logic-syllogisms` | Guide exists; title had duplicated brand | De-duplicate title; add breadcrumb schema; link to logic drills | Analytical Ability Study Guide: Logic & Syllogisms | Analytical Ability: Logic, Assumptions & Categorical Syllogisms | Master single-word analogies, Venn diagram mapping for syllogisms, and valid deductive logic conclusions for the CSE Professional Exam. | `/guides`, `/practice`, `/articles/cse-professional-exam-reviewer-guide` |
| **Clerical Ability** | `clerical ability reviewer`, `filing rules cse`, `clerical operations civil service` | Informational / Study | `/guides/clerical-ability-filing-spelling-office-rules` | Guide exists; title had duplicated brand | De-duplicate title; add breadcrumb schema; link to clerical drills | Clerical Ability Study Guide: Filing Rules & Office Procedures | Clerical Ability: Alphabetical Filing, Proofreading & Office Rules | Standard alphabetical filing indexing rules, government office procedures, and proofreading essentials for the CSE Subprofessional Exam. | `/guides`, `/practice`, `/articles/cse-subprofessional-exam-reviewer-guide` |
| **RA 6713 (Code of Conduct)** | `ra 6713 reviewer`, `code of conduct and ethical standards`, `saln filing rules cse` | Informational / Study | `/guides/ra-6713-code-of-conduct` | Guide exists; title had duplicated brand | De-duplicate title; add breadcrumb schema; cite Official Gazette | RA 6713 Code of Conduct & Ethical Standards Study Guide | RA 6713: Code of Conduct & Ethical Standards for Public Servants | Complete breakdown of the 8 Norms of Conduct, prohibited transactions, SALN filing deadlines, and penalties under Republic Act No. 6713. | `/guides`, `/practice`, `/cse/exam-guide` |
| **Philippine Constitution** | `philippine constitution reviewer`, `1987 constitution cse`, `bill of rights reviewer` | Informational / Study | `/guides/philippine-constitution-essentials` | Guide exists; title had duplicated brand | De-duplicate title; add breadcrumb schema; cite Official Gazette | Philippine Constitution Study Guide: Bill of Rights & Article IX | Philippine Constitution: Bill of Rights & Constitutional Commissions | Core constitutional provisions for the Civil Service Exam: Article III Bill of Rights, the 3 Independent Constitutional Commissions, and public accountability. | `/guides`, `/practice`, `/cse/exam-guide` |
| **Exam Schedule & Calendar** | `civil service exam schedule`, `cse exam schedule 2026`, `cse schedule 2027` | Informational / Search | `/cse/exam-guide/schedule` | Section page exists | Add breadcrumbs; link to CSC OCSEAS application section | CSE Exam Schedule & Calendar (2026–2027 Verified) | Civil Service Examination Schedule & Application Calendar | Verified examination dates, application filing windows, and target passer release dates for the Philippine Civil Service Examination (CSE-PPT). | `/cse/exam-guide`, footer, FAQ answers |
| **Testing Centers & eNOSA** | `cse testing centers`, `civil service school assignment`, `enosa csc` | Informational / Search | `/cse/exam-guide/testing-centers` | Interactive regional finder exists | Add breadcrumbs; link to ONSA/eNOSA guidelines | Civil Service Exam Testing Centers & School Assignment (eNOSA) | Civil Service Exam Testing Centers by Region & School Assignment | Search and filter CSE-PPT testing center localities across all 16 CSC regional offices. Instructions for finding your testing venue on eNOSA. | `/cse/exam-guide`, homepage, FAQ answers |
| **Exam Day Protocols & Rules** | `what to bring civil service exam`, `cse prohibited items`, `black ballpen cse` | Informational | `/cse/exam-guide/exam-day` | Section page exists | Add breadcrumbs; link to requirements and FAQ | CSE Exam-Day Protocols: What to Bring & Prohibited Items | Civil Service Exam Day Protocols: Dress Code & What to Bring | Essential rules for exam day: strict 7:45 AM gate closure, valid government IDs, black ballpens, permitted snacks, and strictly prohibited gadgets. | `/cse/exam-guide`, FAQ answers, mock test start |

---

## 3. Implemented Technical SEO Improvements

### 3.1 Canonical Hostname Normalization (`src/lib/env.ts`)
- Configured `getBaseUrl()` to normalize production hostnames. If any environment or Vercel variable specifies `reviewtayo.online` (apex), it automatically prepends `www.` to guarantee that all canonical URLs, sitemaps, Open Graph tags, and structured data point exclusively to `https://www.reviewtayo.online`.

### 3.2 Elimination of Duplicate Brand Suffixes & Title Optimization
- Updated all public pages across `src/app/(public)/` and dynamic route handlers (`[slug]` and `[section]`). Removed redundant `— ReviewTayo` strings so that the root layout's template (`%s | ReviewTayo`) creates crisp, professional, non-repeating title tags within the optimal 45–60 character display window.

### 3.3 Removal of Deprecated `<meta name="keywords">`
- Removed non-standard and ignored `keywords` arrays from `src/app/layout.tsx`, `src/app/(public)/cse/exam-guide/page.tsx`, and `src/app/(public)/guides/[slug]/page.tsx`.

### 3.4 Strict `noindex, nofollow` for Private, Account, and Runner States
- Added server-side metadata with `robots: { index: false, follow: false }` to `/settings/*` and active topic practice runners (`/practice/[topicId]`), protecting crawl budget and preventing duplicate thin application states from indexing.
- Added `/settings/` to `disallow` in `src/app/robots.ts`.

### 3.5 Schema.org Structured Data Enhancements
- **Organization & WebSite**: Added comprehensive Schema.org `Organization` metadata to `src/app/layout.tsx` (name: `ReviewTayo`, logo: `https://www.reviewtayo.online/icon-512.png`, url: `https://www.reviewtayo.online`).
- **Article & TechArticle**: Updated author representation in `src/app/(public)/articles/[slug]/page.tsx` and `src/app/(public)/guides/[slug]/page.tsx` to `@type: "Organization"` with URL `https://www.reviewtayo.online/about`, and included high-resolution 1200x630 `image` attributes.
- **BreadcrumbList**: Added Schema.org `BreadcrumbList` structured data to all individual article, guide, and exam-guide section pages alongside accessible visual breadcrumbs.
- **Zero Fake Schema**: Maintained strict compliance with Google guidelines by omitting fake `SearchAction`, fake review counts, or unearned aggregate ratings.

### 3.6 Internal Topical Clustering & Contextual Linking
- Connected the FAQ accordion cards in `src/app/(public)/faq/page.tsx` directly to supporting subtest study guides, strategy articles, and exam guide sections.
- Linked Professional and Subprofessional overview articles to their respective mock examination runners (`/exams/professional/full` and `/exams/subprofessional/full`).

---

## 4. Content Expansion (Original High-Value Strategy Guides)

To satisfy critical search intents identified in the keyword map, three comprehensive, 100% original articles were authored and added to `src/lib/content/articles.ts`:

1. **`cse-professional-exam-reviewer-guide`**:
   - **Title**: Civil Service Exam Professional Reviewer: Complete Syllabus & Practice Guide
   - **Focus**: Detailed 170-item breakdown, 3-hour-10-minute continuous countdown strategy, Analytical Ability subtest (logic, syllogisms, analogies), General Information (RA 6713, Constitution), and career implications for Salary Grade 10+ positions.
   - **Citations**: CSC Examination Announcement No. 06, s. 2024; Republic Act No. 6713; 1987 Constitution.

2. **`cse-subprofessional-exam-reviewer-guide`**:
   - **Title**: Civil Service Exam Subprofessional Reviewer: Clerical Scope & Study Guide
   - **Focus**: Detailed 165-item breakdown, 2-hour-40-minute continuous timer pacing, Clerical Ability subtest (alphabetical filing rules, spelling, office procedures), and first-level clerical eligibility qualifications.
   - **Citations**: CSC Examination Announcement No. 06, s. 2024; Civil Service Commission Memorandum Circulars.

3. **`how-civil-service-exam-scoring-works`**:
   - **Title**: How Civil Service Exam Scoring Works: Official Rating vs Raw Percentage
   - **Focus**: Clarifies the distinction between CSC's official proprietary 80.00% general rating formula (calibrated statistical weighting across subtests) versus raw percentage correct, explaining why balanced subtest performance is mandatory.
   - **Citations**: CSC Examination Announcements; Addendum §50 scoring disclosure principles.

---

## 5. Search Console & Deployment Checklist

Before production search engine submission, the operator must execute the following sequential checklist:

1. **Deploy Working Tree to Production**: Push verified changes to Vercel production deployment.
2. **Apply Database Migration**: Run `npm run db:migrate` against production PostgreSQL to ensure `contact_inquiries` exists.
3. **Verify Environment Configuration in Vercel**:
   - `NEXT_PUBLIC_APP_URL=https://www.reviewtayo.online`
   - `CONTACT_IP_HASH_SALT` ($\ge 32$ chars)
   - `CRON_SECRET`
   - `ADMIN_API_KEY`
4. **Live DNS & Redirect Verification**:
   - Test `curl -I https://reviewtayo.online` → confirm HTTP 308 redirect to `https://www.reviewtayo.online/`.
   - Test `curl -I https://www.reviewtayo.online/robots.txt` → confirm status 200 and canonical sitemap reference.
   - Test `curl -I https://www.reviewtayo.online/sitemap.xml` → confirm status 200, valid XML, and canonical URLs.
5. **Google Search Console Setup**:
   - Add **Domain Property** (`reviewtayo.online`) using DNS TXT record verification.
   - Add **URL-Prefix Property** (`https://www.reviewtayo.online/`) to monitor specific indexing and page experience reports.
   - Submit sitemap: `https://www.reviewtayo.online/sitemap.xml`.
   - Inspect Homepage (`https://www.reviewtayo.online/`) using URL Inspection Tool:
     - Verify Googlebot renders the page with correct H1 and no JavaScript console errors.
     - Confirm canonical URL resolves to `https://www.reviewtayo.online/`.
   - Request indexing on the homepage and priority hubs (`/practice`, `/exam-info`, `/cse/exam-guide`, `/guides`, `/articles`).
6. **Core Web Vitals & Mobile Usability Monitoring**:
   - Monitor Search Console "Page Indexing", "Core Web Vitals", and "HTTPS" dashboards weekly.
   - Allow 2–4 weeks for Google Search indexers to crawl and re-evaluate updated page titles and topical clusters.

---

## 6. Prioritized 30 / 60 / 90-Day SEO Roadmap

### Phase 1: Days 1–30 (Technical Stability & Indexation)
- Verify that Google Search Console indexes all 27 canonical sitemap URLs without crawler errors or duplicate canonical flags.
- Monitor server logs and Vercel analytics for crawler frequency and 308 redirect compliance.
- Validate that Google recognizes `Organization`, `WebSite`, `Article`, `TechArticle`, and `BreadcrumbList` rich structures in Search Console Enhancements.
- Track initial impressions and keyword queries in Search Console Performance tab.

### Phase 2: Days 31–60 (Content Expansion & Topical Authority)
- Expand topical study guides to cover additional high-yield CSE syllabus subjects (e.g. Philippine Environmental Laws, Human Rights & Peace Concepts per CSC General Info scope).
- Author original practice questions adhering to the Question Authoring & Independent Review separation rule (`skills/content-authoring/SKILL.md`).
- Monitor organic CTR on primary SERP keywords; refine meta descriptions based on real searcher query impressions.

### Phase 3: Days 61–90 (Authority Building & Performance Optimization)
- Conduct outreach to Philippine educational portals, civil service review communities, and university career centers for organic editorial backlinks.
- Audit real-user Core Web Vitals (INP, LCP, CLS) using Chrome User Experience Report (CrUX) data in Search Console.
- Evaluate search performance during peak civil service examination registration periods (typically leading into March and August test dates).
