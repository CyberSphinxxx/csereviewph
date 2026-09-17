# AdSense Re-Audit Remediation Plan

## Interpretation

Complete and harden the nine remediation areas in `.design/adsense-reaudit-report.md`: durable contact persistence, enforced retention, production-safe abuse controls, truthful operator notifications, authoritative consent handling, route-level ad protection, verifiable editorial citations, and production-compatible CSP configuration.

The working tree already contains a partial implementation. Preserve valid existing work, correct security or accuracy defects, and do not claim production readiness until deployment-dependent checks are completed.

## Work

1. Verify and test the generated contact-inquiry migration and indexes.
2. Require durable PostgreSQL persistence before returning a successful contact receipt.
3. Authenticate the daily retention endpoint with `CRON_SECRET` and physically delete expired inquiries.
4. Hash IP addresses with a dedicated non-default secret and use PostgreSQL for cross-instance rate checks.
5. Require a dedicated admin key for the inquiry API; validate filters, statuses, and pagination.
6. Send minimal, non-PII webhook notifications and never imply notification delivery when none occurred.
7. Treat a certified TCF CMP as authoritative without converting a single TCF purpose into blanket advertising consent.
8. Keep the AdSense loader off private, interactive, legal, and contact routes; document Auto Ads as disabled by default.
9. Replace generic citations with exact official CSC pages/documents and remove unsupported causal claims.
10. Update the privacy notice, environment template, progress handoff, and walkthrough to match actual behavior.

## Verification Plan

- Add or update unit tests for missing secrets, database failures, durable rate limiting, cron authentication, admin authentication/filter validation, certified-CMP behavior, and route exclusions.
- Run the PGlite migration and retention integration tests against a clean in-memory PostgreSQL database.
- Run `npm run verify` and require exit code 0.
- Start the application and use a browser to verify the contact form states, consent controls, and protected routes.
- Recheck `/ads.txt`, `/robots.txt`, and `/sitemap.xml` locally. Production AdSense, Search Console, CMP publication, DNS, mailbox, and deployment checks remain human/deployment gates.
