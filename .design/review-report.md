# ReviewTayo AdSense Readiness Review

Audit date: 2026-09-16  
Scope: current working tree and public deployment at `https://www.reviewtayo.online/`  
Mode: report-only; no application files were changed

## Executive read

**Verdict: Block — do not request AdSense review yet.** The repository has a useful foundation (public content, navigation, legal pages, robots, sitemap, ads.txt route, and deliberately excluded in-exam ads), but the live deployment sends canonical and sitemap signals to the Vercel hostname, publishes a fake placeholder publisher ID, and still serves the old brand. The current source also loads AdSense before an unchosen visitor grants consent, uses non-production ad-slot labels, and presents a contact form success state without sending the message.

There is no official minimum number of posts for AdSense, but Google explicitly evaluates original value, usable navigation, and policy compliance. With only three articles and six study guides, generic editorial attribution, unsupported statistical claims, and several misleading trust/compliance claims, the content layer should be strengthened before submission.

## What works and should be preserved

- `robots.txt`, `sitemap.xml`, and `/ads.txt` exist and return the correct basic content types.
- The navigation exposes practice, guides, articles, exam information, FAQ, About, Privacy, Terms, Disclaimer, and Contact pages.
- Timed exam pages do not render ad placements; this follows the product rule against distracting or accidental-click placements during exams.
- Content pages have a clear H1 and readable hierarchy. The sampled article and guide rendered approximately 602 and 758 words respectively, excluding any hidden content.
- The privacy page includes Google's advertising-cookie purpose and opt-out links required by Google's publisher disclosure guidance.
- The footer provides a persistent control to reopen cookie/ad preferences.
- Local rendering showed one clear H1 per sampled route and no broken primary navigation during the inspected paths.

## Scorecard

| Dimension | Score (0–4) | Evidence summary |
|---|---:|---|
| Product clarity and navigation | 3 | Clear education purpose and comprehensive header/footer navigation. |
| Crawlability and index signals | 1 | Endpoints exist, but live canonical, robots, and sitemap all promote the wrong host. |
| AdSense technical integration | 1 | Loader and ads.txt generator exist; live configuration is absent/placeholder and slot IDs are invalid labels. |
| Consent and privacy | 1 | Granular UI exists, but source treats no prior choice as ad consent and is not a certified TCF CMP. |
| Content value and credibility | 2 | Useful original-looking pages, but a small corpus, generic author identity, unsourced claims, and guarantee language weaken trust. |
| Trust and operational completeness | 1 | Legal pages exist, but the contact form does not transmit and compliance claims exceed the evidence. |
| Responsive/accessibility baseline | 3 | Sampled desktop UI is structured and navigable; full keyboard, zoom, and screen-reader coverage was not performed. |
| Performance feel | 3 | Sampled local and live routes loaded promptly with no observed blocking UI error; Core Web Vitals were not measured. |

The two dimensions that most affect approval are crawl/index consistency and trust/compliance. Google cannot confidently evaluate `reviewtayo.online` while the site declares another host as canonical, and several visible claims contradict the live technical state.

## Findings

| ID | Severity | Area | Location / evidence | Current behavior | Proposed correction | User / approval impact |
|---|---|---|---|---|---|---|
| ADS-01 | HIGH | Production domain and deployment | Live `https://www.reviewtayo.online/`, `/robots.txt`, `/sitemap.xml`; `src/lib/env.ts:13-34` | The public site redirects to `www`, still displays `csereviewph.com`, declares `https://cse-reviewer-ph.vercel.app` canonical, and lists only that Vercel host in robots/sitemap. | Deploy the current ReviewTayo build; set `NEXT_PUBLIC_APP_URL=https://www.reviewtayo.online` (or deliberately choose the apex), align `BETTER_AUTH_URL`, permanently redirect every alternate host to the chosen host, and regenerate all absolute URLs. | Splits ownership and indexing signals and can make the submitted AdSense site look inconsistent or unowned. |
| ADS-02 | HIGH | Canonical metadata | `src/app/layout.tsx:45-47`; every sampled non-home route rendered the homepage canonical | The root layout sets `canonical: "/"`, inherited by articles, guides, legal pages, FAQ, practice, and exam pages. | Remove the global root canonical and add self-referential canonicals per static and dynamic route; ensure sitemap URLs use the exact same preferred host. | Tells Google that valuable pages are duplicates of the homepage, suppressing indexation and undermining content evaluation. |
| ADS-03 | HIGH | Publisher verification / ads.txt | Live `/ads.txt`; `src/lib/ads.ts:1-33`; `.env.example:38-43` | Live ads.txt authorizes `pub-0000000000000000`; no live `google-adsense-account` meta or AdSense script was present. | Obtain the real AdSense publisher ID, configure it in production, serve the exact AdSense-provided ads.txt line, confirm the meta/script verification method, and recheck the endpoint before review. Never publish a placeholder seller record. | AdSense cannot verify an authorized seller, and the placeholder makes the current “compliant” claim false. |
| ADS-04 | HIGH | Consent before ad loading | `src/components/ads/AdSenseScript.tsx:17-30`; `src/components/ads/AdSenseBanner.tsx:29-41`; product addendum §48 | Both components interpret missing consent as permission (`!consent` and default `adsAllowed=true`), so a new visitor can load the ad tag before choosing. | Default advertising consent to denied/unknown; do not request the Google ad tag until an affirmative choice or an implemented limited-ads/Consent Mode path permits it. Keep decline as easy as accept. | Conflicts with the project's explicit consent-before-AdSense requirement and creates regulatory/policy exposure. |
| ADS-05 | HIGH | EEA/UK/Switzerland consent | Custom `CookieConsentBanner`; no TCF/CMP integration found | The custom localStorage banner is not evidence of a Google-certified CMP or IAB TCF signal. The globally accessible site does not geo-limit these visitors. | Configure Google's Privacy & Messaging CMP or another Google-certified CMP with the current IAB TCF version; retain a separate Philippines-specific notice only if the implementations interoperate correctly. | Google requires a certified TCF CMP when serving personalized ads in the EEA, UK, and Switzerland. |
| ADS-06 | HIGH | Ad-unit configuration | All `AdSenseBanner` call sites; `src/components/ads/AdSenseBanner.tsx:112-120` | Call sites pass labels such as `homepage-bottom` and `article-in-article` directly into `data-ad-slot`; real AdSense slot IDs are account-issued numeric identifiers. | Add environment/config mappings for real ad-unit slot IDs and render nothing when a valid client/slot pair is unavailable. Do not show configuration placeholders in production. | Even after account approval, these units will not be valid production placements. |
| ADS-07 | HIGH | Trust / contact | `src/app/(public)/contact/page.tsx:18-23,185-203` | Submitting the form only flips local state to “Message Received!”; no request or email is sent. | Connect a real backend or replace the form with verified mail links. Only show success after confirmed delivery; add failure and retry states. | Misleads users and reviewers and prevents corrections/privacy requests from reaching the operator. |
| ADS-08 | HIGH | Misleading compliance claims | `src/components/layout/Footer.tsx:28-31,175-183`; `src/app/(public)/privacy/page.tsx:26,158-179` | The UI claims “RA 10173 Data Privacy Compliant” and “Authorized Digital Sellers compliant” while ads.txt is a placeholder, consent defaults to load, and the DPO/support addresses remain on the old domain. It also asserts TLS 1.3 across all routes without audit evidence. | Replace absolutes with factual, supportable disclosures until legal/technical validation is complete; verify that mailboxes and the named privacy contact work; document retention and hosted-account deletion precisely. | Overclaiming compliance is a significant credibility and legal risk during manual review. |
| ADS-09 | MEDIUM | Content depth and editorial trust | `src/lib/content/articles.ts:3-74`; `src/lib/content/guides.ts:3-270`; article bylines | The catalog contains 3 articles and 6 guides. All articles use “ReviewTayo Editorial Team”; there are no author bios, editorial method, citations for numerical claims, or visible update/review history on articles. | Expand the original content corpus around user needs before applying; add real author/reviewer attribution, editorial policy, source citations for factual claims, and reviewed/updated dates. | Google states that unique, interesting, high-quality content is paramount; the current corpus can look thin and weakly accountable. |
| ADS-10 | MEDIUM | Unsupported or risky copy | `src/lib/content/articles.ts:6-20`; `src/app/(public)/about/page.tsx:48-51` | Copy promises “actionable changes ... to guarantee a passing score,” claims analysis of thousands of diagnostics, and gives registration/pass-rate figures without visible sources. | Remove guarantees, substantiate first-party-analysis claims, and cite current official CSC releases beside statistical assertions. | Reduces credibility and can make educational content appear sensational or fabricated. |
| ADS-11 | MEDIUM | Page metadata | Rendered `/contact`, `/faq`, `/practice`, and `/exams/professional/quick`; metadata search | These routes inherit the homepage title/description. Other pages produce duplicated brand suffixes such as `... ReviewTayo | ReviewTayo`. | Add route-specific metadata, correct the title-template inputs, and `noindex` private/account/result/settings pages and any thin exam-start states not intended for search. | Duplicate or irrelevant snippets weaken search quality and make the site look unfinished. |
| ADS-12 | MEDIUM | Sitemap quality | `src/app/sitemap.ts:6-154` | Every URL receives `new Date()` as `lastModified`, including unchanged articles and legal pages; thin 63-word exam-start pages and topic runner URLs are included. | Use actual content update dates, omit `lastmod` when unknown, and include only canonical URLs intended to appear in Search. Consider excluding interactive exam/session routes. | Google says `lastmod` should be accurate and verifiable; noisy dates and thin URLs waste crawl/evaluation attention. |
| ADS-13 | MEDIUM | Structured data | `src/app/layout.tsx:95-107` | Sitewide `SearchAction` points to `/practice?q=...`, but no functioning site-search interface was observed. Only generic `WebSite` JSON-LD appears on articles/guides. | Remove the nonfunctional search action or build actual search; add truthful `Article`/`TechArticle` or learning-resource schema with dates and accountable authors where eligible. | Misrepresents a nonexistent feature and misses useful content context. |
| ADS-14 | MEDIUM | Placement strategy | Ad banners on About, Privacy, Terms, Disclaimer, and Contact; two units on individual articles/guides | Ads are planned on trust/legal/contact pages, and content detail pages contain an early in-content plus bottom unit despite modest content length. | For initial review, limit ads to substantial content pages, keep generous separation from navigation and calls to action, and remove ads from legal/contact/trust pages. Reassess density after real units render. | Reduces accidental-click and low-value-inventory risk and keeps trust pages credible. |
| ADS-15 | LOW | Social presentation | `src/app/layout.tsx:57-71` | Open Graph and Twitter metadata have no image; dynamic content pages do not expose article-specific social metadata. | Add a real branded default image and page-specific metadata for guides/articles. | Does not block AdSense, but weakens distribution and perceived completeness. |

## Prioritized action plan

### Now — before any AdSense submission

1. Choose one production hostname, deploy the current build, and align redirects, canonical tags, robots, sitemap, Open Graph URLs, authentication URLs, and structured data.
2. Remove the fake ads.txt seller record until the real publisher ID is available; then publish the exact Google-provided record and verification tag.
3. Make ad consent opt-in by default and integrate a Google-certified CMP for regions where Google requires it.
4. Replace symbolic ad-slot labels with actual account-issued slot IDs and ensure ad code is absent when configuration is incomplete.
5. Make Contact genuinely deliver messages and remove unsupported compliance/commercial-readiness claims.

### Next — improve approval confidence

1. Fix route-specific canonicals, titles, descriptions, schema, index/noindex decisions, and sitemap update dates.
2. Expand the content library with original, substantial, reviewer-attributed guides; cite CSC sources for factual claims and remove guarantees.
3. Restrict initial ad placements to substantial public content; do not monetize legal, contact, account, result, or active exam pages.
4. Verify every public email address and update remaining `csereviewph.com` references.

### Later — after technical readiness

1. Connect Search Console, submit the canonical sitemap, inspect indexing/coverage, and resolve any manual/security issues.
2. Measure Core Web Vitals and ad layout shift with real ad units on mobile and desktop.
3. Request AdSense review only after the live checks below pass.

## Pre-submission acceptance checklist

- [ ] One host permanently redirects all alternatives and every page has the correct self-canonical.
- [ ] Live robots and sitemap reference only that host.
- [ ] Live ads.txt contains the real publisher ID and AdSense reports it authorized.
- [ ] The AdSense ownership verification meta/script is visible in production.
- [ ] No ad request occurs before the applicable consent signal.
- [ ] A Google-certified CMP is active for EEA/UK/Switzerland traffic.
- [ ] Real numeric ad-unit slots render only on approved, substantial content pages.
- [ ] Active exams, results, auth, legal, contact, and other low-value/private pages contain no ads.
- [ ] Contact and privacy/DPO channels actually deliver.
- [ ] Unsupported guarantees and uncited statistics are removed or sourced.
- [ ] Search Console shows the preferred domain and canonical sitemap without systemic errors.
- [ ] Mobile and desktop checks show no ad overlap, accidental-click proximity, or major layout shift.

## Verification performed

- Reviewed the repository's SEO, ad, consent, content, trust, metadata, and navigation source.
- Rendered representative local routes: homepage, article catalog/detail, guide catalog/detail, About, Privacy, Terms, Contact, Disclaimer, FAQ, Practice, and a quick-exam start page.
- Read local `/robots.txt`, `/sitemap.xml`, and `/ads.txt` responses.
- Opened the live homepage, `/robots.txt`, `/sitemap.xml`, `/ads.txt`, Privacy, About, Articles, and Guides in a browser.
- Searched for the live domain in Google-oriented web search; no result for ReviewTayo was returned. This is an observation, not proof of non-indexation; Search Console URL Inspection is required.
- Compared findings with current official guidance: [AdSense page readiness](https://support.google.com/adsense/answer/7299563), [AdSense eligibility](https://support.google.com/adsense/answer/9724), [AdSense program policies](https://support.google.com/adsense/answer/48182), [required privacy content](https://support.google.com/adsense/answer/1348695), [ads.txt guide](https://support.google.com/adsense/answer/12171612), [Google-certified CMP requirement](https://support.google.com/adsense/answer/13554020), [canonical best practices](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Verification gaps and assumptions

- No access was available to the site's AdSense account, Search Console, Vercel project settings, DNS redirect configuration, mailbox delivery, or analytics dashboards.
- No real ad unit could be rendered because production has no real publisher ID/slot configuration.
- Core Web Vitals, Lighthouse, ad layout shift, keyboard-only navigation, 200% zoom, and assistive-technology behavior were not fully measured in this AdSense-focused pass.
- Originality and legal accuracy of all educational content were not independently certified; the audit only identified visible provenance and credibility signals.

## Candidates considered but rejected

- **“A privacy policy is missing.”** Rejected: a substantial privacy page exists and includes Google's core cookie/opt-out disclosures.
- **“Robots or sitemap are absent.”** Rejected: both exist and are crawlable; the defect is their wrong production host and sitemap quality.
- **“A specific article count is mandatory.”** Rejected: Google publishes no fixed minimum. The finding is about overall value, depth, originality, and accountability—not a fabricated threshold.
- **“Ads are present inside active exams.”** Rejected: no ad component was found on the active exam runner route sampled.

## Scoped verdict

**Block.** ADS-01 through ADS-08 are confirmed high-severity readiness failures. Resolve them on the live deployment and rerun this audit before requesting AdSense review.

