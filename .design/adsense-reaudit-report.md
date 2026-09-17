# ReviewTayo AdSense Re-audit

Audit date: 2026-09-16  
Scope: updated working tree and the submitted AdSense-resolution walkthrough  
Mode: report-only; no application code was changed

## Verdict

**Still blocked.** The earlier SEO, canonical, ads.txt-safety, ad-slot, placement, and visible author-identity work is materially improved, and `npm run verify` passes. However, the updated walkthrough overstates the contact, retention, rate-limit, CMP, Auto Ads, and source-trust resolutions.

## Open findings

| Severity | Finding | Evidence | Required resolution |
|---|---|---|---|
| Critical | The contact table cannot be created by a deployed migration. | `src/db/schema/contact.ts` defines `contact_inquiries`, but `src/db/migrations/` ends at `0002_lush_madame_hydra.sql` and contains no contact table. | Generate and commit the Drizzle migration, then test it against a clean database. |
| Critical | The API reports success when nothing was persisted. | `src/app/api/contact/route.ts:88-127` skips the insert when no DB variable exists, catches insert failures, and still returns `success: true` with “recorded.” The tests exercise and accept this fallback. | Fail with a retryable 5xx response unless the record is durably stored (or actually delivered through a verified provider). Test the failure path. |
| High | The stated 90-day deletion is not implemented. | The schema stores `expiresAt`, but no cleanup query, scheduled task, or database TTL mechanism deletes expired rows. Privacy copy says records “are deleted.” | Add and monitor a scheduled deletion process, or change the disclosure until deletion is genuinely enforced. Add an `expires_at` index. |
| High | The rate limit is not dependable on Vercel. | `src/lib/rate-limit.ts` uses a process-local `Map`. Serverless instances do not share it and cold starts reset it. | Use a shared durable limiter or Vercel Firewall rate limiting. Keep the honeypot as an additional control. |
| High | CMP language is outdated and consent ownership is unresolved. | `src/app/(public)/privacy/page.tsx:91` says TCF v2.2; TCF v2.3 is mandatory for new strings from 2026-03-01. The custom banner and Google Privacy & Messaging can also create two consent authorities. | Update to TCF v2.3 and define one authoritative consent flow. Test EEA/UK/Switzerland behavior after publishing the Google-certified CMP. |
| High | Auto Ads protection is incomplete and dashboard-only. | `.env.example:47` mentions only `/exams/*`. The global AdSense tag can permit Auto Ads on results, account/auth, contact, legal, and privacy pages unless dashboard exclusions or Auto Ads-off are verified. | Prefer Auto Ads off for the manual-placement strategy, or explicitly exclude every private, interactive, legal, and low-value route and verify the live result. |
| Medium | Contact handling has no operator workflow or notification. | Submissions may reach PostgreSQL, but no admin queue, mailbox notification, or status-processing path was found. | Add a secure review/notification workflow and test that a real inquiry reaches the responsible person. |
| Medium | “Specific official sources” remains overstated. | Several articles/guides link to the generic CSC announcements directory. `articles.ts:33-34` makes statistical and causal claims, including “diagnostic telemetry,” without an exact supporting report or disclosed dataset. | Cite exact releases beside claims, remove unsupported causal/telemetry assertions, and distinguish editorial advice from sourced facts. |
| Medium | CMP live compatibility still needs testing. | The CSP lists AdSense domains but no explicit Google Privacy & Messaging/Funding Choices endpoints. | Publish/test the CMP in production and adjust CSP only from observed blocked requests and official domain requirements. |

## Confirmed improvements

- Missing or dummy AdSense IDs do not produce fake seller lines or production ad units.
- Ad loading defaults to denied until affirmative local consent.
- Canonical metadata, sitemap scope, private-route `noindex`, structured data, branded social image, and ad placement strategy are materially improved in source.
- Named fictional authors/reviewers were removed in favor of a team byline.
- `npm run verify` exited 0: typecheck, lint, architecture check, 46 test files / 270 tests, and the production build all passed; 72 routes were generated.

## Submission gate

Do not request AdSense review until the critical/high findings are resolved, the current build and database migration are deployed, Google Privacy & Messaging is published and verified, the complete Auto Ads policy is confirmed, and live checks pass for canonical URLs, robots, sitemap, ads.txt, contact persistence/delivery, mobile layout, and ad-free exam/private/legal routes.
