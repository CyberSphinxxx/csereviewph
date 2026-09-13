# Live website design and flow review

## Scope and evidence
Reviewed https://cse-reviewer-ph.vercel.app in the browser: guest homepage, level-comparison anchor, Practice directory, Exam Guide, immediate diagnostic launch, unanswered-test exit, and the mobile header/menu at a requested 390×844 viewport. Screenshots and accessibility/DOM observations informed the review. No answers were submitted, account created, or user settings changed. Essential-only cookie choice dismissed the consent banner. Temporary viewport override was reset.

This report supersedes older screenshot assumptions only where current evidence exists. Returning-user, authenticated, result, completed-test, and Study Guides destination flows were not verified. A later browser interaction timed out; no success is inferred from it. Proposed journeys below are recommendations, not shipped behavior. Local verification is separate from the deployed site.

## Executive read
The visual identity is coherent and the primary diagnostic card is understandable. The main weakness is information architecture: study actions, learning resources, exam logistics, help, and preferences compete at the same level, while the homepage repeats these choices farther down.

## Preserve
- Navy/blue identity, pale surfaces, clear headline, and the two-column hero.
- Exam-level choice, free/no-account reassurance, and one dominant diagnostic action.
- Focused exam header replacing marketing navigation after launch.
- Existing mobile menu and quiet active navigation treatment.

## Scorecard
Design judgments on observed states, not a usability-study score: visual consistency 3/4; hierarchy 2/4; navigation clarity 2/4; guest entry flow 2/4; mobile header/hero readability 2/4. Overall accessibility, authenticated resilience, and results are unscored because coverage was insufficient.

## Findings

| ID | Severity | Evidence | Impact | Correction |
|---|---|---|---|---|
| L01 | HIGH | Homepage displays March 21, 2027; Exam Guide displays March 14, 2027 for the first 2027 session | Users cannot trust which date to plan around | Verify the official source and use one maintained schedule record across homepage, guide and presets; neither date independently verified here |
| L02 | MEDIUM | Desktop header exposes Practice, Study Guides, Exam Guide, How It Works, FAQ, Settings and Sign In; returning state may add Dashboard | Multiple navigation categories lack hierarchy | Keep three task destinations, group help and utilities separately, add Dashboard only for returning learners |
| L03 | MEDIUM | Mobile screenshot shows standalone settings icon plus menu; expanded menu repeats Settings; Sign In wraps; level descriptions truncate important distinctions | Header and decision content become harder to scan | Move utilities into menu, keep sign-in label on one line if retained, allow level descriptions to wrap |
| L04 | MEDIUM | Compare the two levels scrolls to Choose Your Preparation Mode with Quick/Medium/Full cards | Level uncertainty becomes a second mode decision | Show a concise level comparison beside the selector or in an accessible disclosure, then return to the selected diagnostic action |
| L05 | MEDIUM | Hero promise, What happens next headline, benefit cards and mode cards repeat the start/diagnose/practice message | Long page without corresponding decision progress | Make each section answer a different question; relocate detailed modes/syllabus/timing articles to appropriate hubs |
| L06 | MEDIUM | Start Free Diagnostic immediately opens Career Service Professional — Quick Test and starts timer | Name changes and timing commitment are not fully signaled | Keep diagnostic naming consistent and state 10 questions / 10-minute timer / starts immediately at the CTA; no compulsory extra setup screen |
| L07 | MEDIUM | Leaving the unanswered diagnostic returns to Practice topic directory | Learner loses the original diagnostic context | Return to originating context or a concise resume/start view; do not label an empty discarded session resumable |
| L08 | MEDIUM | Practice directory shows Reading Comprehension with 0 items and Start Practice | An apparently usable choice offers no visible content availability | Show availability honestly and offer a related available topic or guide; downstream empty-topic behavior was not tested |
| L09 | MEDIUM | Homepage timing section uses alarmist failure framing and specific official-looking cutoff claims | Copy can undermine calm study positioning and trust | Remove unsupported causal claims and validate official claims before publication; keep evidence-based timing guidance in an article |
| L10 | LOW | Hero and following section have competing large headlines within desktop screenshot; date strip creates a second horizontal header band | Hero lacks a clear visual endpoint | Use adaptive desktop hero minimum height/padding, quieter date placement and smaller downstream heading |

## Recommended header

New visitors: Logo | Practice | Study Guides | Exam Info | Sign in | More.
Returning learners: Logo | Dashboard | Practice | Study Guides | Exam Info | Account.

These are structural sketches, not a requirement to squeeze everything into one row at intermediate widths. Collapse early when needed. Dashboard should appear for local guest progress as well as authenticated users; sign-in is not the definition of returning.

- Practice becomes a proper practice hub: topic practice, quick practice, longer practice and full mock. The current topic directory alone is narrower than that label suggests. Until the hub exists, label its destination Practice by topic and keep mock access discoverable.
- Study Guides holds subject guides and strategy articles; a simple hub avoids a large dropdown.
- Rename Exam Guide to Exam Info (or Exam dates & requirements if space permits). It handles schedules, application requirements, centers and assignment links. This distinguishes logistics from learning content.
- How It Works stays as a contextual homepage link, not a global navigation item.
- FAQ/Help, Settings and About move to More for guests, with Settings/Help also in the account menu for signed-in users. Settings remains accessible without login.
- Keep ordinary navigation visually quiet with a clear active state. Do not add another dominant start button beside the hero's CTA by default.

Mobile: logo and menu; a short Dashboard shortcut is optional for returning learners if it fits. Put Sign In, Help and Settings inside the menu when the header would otherwise crowd. Avoid icon-only settings duplicated in two places. Use clear groups, visible focus, Escape/close behavior, sensible focus restoration, and touch-friendly rows. This report has not verified all keyboard behaviors.

## Recommended hero

Retain the headline and exam-level card. Simplify its jobs to: promise, short explanation, choose level, begin.

Left: existing headline; short explanation; optional quiet outcomes line (subject breakdown, explanations, recommended practice) only if these outcomes are actually delivered. Keep the explanatory anchor secondary.

Right: level options with fully readable descriptions; one action; one reassurance line. Use consistent diagnostic naming. Present timed behavior explicitly before activation.

The current full-width next-exam strip is disconnected from the card. Move a compact verified schedule link just above the card or use an Exam Info link there. A calendar icon is clearer than a green live-status dot. Personalized days remaining belongs primarily on the dashboard after a target is chosen.

Desktop: increase breathing room below the composition and use a content-aware minimum height, so the next section is a hint on taller screens instead of a competing headline. Do not impose a universal fold or clip content on short laptops. Mobile: prioritize bringing the selector/CTA into reach; no viewport-height stretching and no added decorative proof cards before it.

Avoid adding stock exam imagery, a large illustration, counters, or multiple badges to fill empty space. Stronger decision hierarchy is the missing element.

## Homepage section order

1. Hero: what this helps with, level choice, diagnostic start.
2. What your results show: one honest example or compact explanation of score breakdown and next action. Clearly mark any example data; do not present invented learner results.
3. How review works: three short steps only if not redundant with the preceding example; otherwise combine them.
4. Other ways to study: quiet links to topic practice, mock tests, guides.
5. Brief trust/independence statement, selected FAQ, final start action and compact footer.

Detailed timing analysis, all subtest tabs, complete guide listings and extended mode descriptions belong in Practice/Study Guides/Exam Info. Keep access through contextual links; do not delete useful content merely to shorten the homepage.

## Three recommended journeys

| Visitor | Recommended path |
|---|---|
| New learner ready to practise | Home → choose level → diagnostic → results with one recommended next action → relevant topic/review → optional account for portability |
| Returning learner | Dashboard → resume an actual saved session, due review, or next practice → results → dashboard |
| Visitor seeking exam logistics | Exam Info → choose date/region as relevant → concise schedule/requirements/center status → clearly labeled official link; optional diagnostic invitation |

The completed diagnostic/results/recommendation path is a future verification target, not an observed end-to-end success. Do not impose a signup step between results and useful next practice. Preserve the chosen level across intended related journeys and let users change it visibly.

For Exam Info, lead with the user's chosen task. The currently prominent historical urgent advisory should be filtered or labeled by applicable session/region, with past notices in a historical area. Keep a short independence/source explanation; repeated large disclaimers and badges should not displace the requested information. This audit did not verify the site's legal/official advisory claims.

## Priorities

Now: reconcile date inconsistency; repair level-comparison destination; declutter header/mobile utilities; reveal full level descriptions; stop offering empty content as ready to practise.

Next: hero rhythm and date placement; consistent diagnostic naming and timer notice; intentional exit/return destinations; a real Practice hub and clear Exam Info naming.

Later: shorten/resequence homepage, validate outcome examples, test returning and completed-results journeys with learners.

Rejected: hide every navigation destination behind one desktop hamburger (reduces study discoverability); add a second large hero visual (competes with selector); force a fixed full-screen hero on phones (pushes action away); add a mandatory setup page before every quick diagnostic (unnecessary friction).

## Verification and verdict
Live browser observations support the findings above. Both how-it-works and what-happens-next anchor targets exist; no broken-anchor finding is claimed. No full WCAG, performance, official-schedule, question-content, or cross-browser certification is implied.

Local npm run verify failed: 232 tests passed and one account-deletion test failed because database access was denied (EACCES), returning 500 where the test expected 200. Build did not run. This is a local verification limitation, not proof of a live-site deletion failure. No application fix was made as part of this report-only task, and no network-enabled deletion retry was attempted against the hosted database.

Verdict: Needs changes to navigation/hero flow; the conflicting published dates should be resolved before relying on the schedule UI. Repository Definition of Done remains incomplete because npm run verify did not pass. The recommendation report is available; implementation and full journey validation remain outstanding.
