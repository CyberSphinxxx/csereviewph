#!/usr/bin/env node

/**
 * commit-individual-files.mjs
 *
 * Inspects all uncommitted git files (modified, staged, untracked, deleted)
 * and commits them one by one with unique, tailored conventional commit messages.
 *
 * Usage:
 *   node scripts/commit-individual-files.mjs [--dry-run] [--verify]
 *   npm run commit:each
 */

import { execSync } from "node:child_process";
import path from "node:path";

const isDryRun = process.argv.includes("--dry-run");
const shouldVerify = process.argv.includes("--verify");

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
  } catch {
    return null;
  }
}

function getUncommittedFiles() {
  const output = run("git status --porcelain -uall");
  if (!output || !output.trim()) return [];

  const lines = output.split(/\r?\n/).filter((l) => l.length > 0);
  const files = [];

  for (const line of lines) {
    const match = line.match(/^([ MADRCU?!]{1,2})\s+(.*)$/);
    if (!match) continue;

    const status = match[1].trim();
    let filePath = match[2].trim();

    // Handle quoted filenames (e.g., if containing spaces)
    if (filePath.startsWith('"') && filePath.endsWith('"')) {
      filePath = filePath.slice(1, -1);
    }

    // Handle renames (R  old -> new)
    if (filePath.includes(" -> ")) {
      filePath = filePath.split(" -> ")[1].trim();
    }

    files.push({ status, path: filePath });
  }

  return files;
}

function getDiff(filePath) {
  // Check working directory diff or staged diff
  const unstaged = run(`git diff -- "${filePath}"`) || "";
  const staged = run(`git diff --cached -- "${filePath}"`) || "";
  return unstaged + "\n" + staged;
}

function generateCommitMessage(file) {
  const filePath = file.path.replace(/\\/g, "/");
  const baseName = path.basename(filePath);
  const diff = getDiff(file.path);

  // 1. Explicit / Known File Handlers with Content Inspection
  if (filePath === ".gitignore") {
    return "chore(git): update gitignore patterns for project and archive directories";
  }

  if (filePath === "package.json") {
    if (diff.includes("commit:each")) {
      return "chore(scripts): add commit:each script to package.json";
    }
    return "chore(deps): update package.json scripts and dependencies";
  }

  if (filePath === "next.config.ts") {
    if (diff.includes("optimizePackageImports") || diff.includes("Cache-Control")) {
      return "perf(config): configure static asset caching and lucide package import optimization";
    }
    return "chore(config): update Next.js runtime and compiler configuration";
  }

  if (filePath === "public/sw.js") {
    if (diff.includes("PRECACHE_ASSETS") || diff.includes("csereviewph-v2")) {
      return "perf(pwa): expand offline pre-caching to core study routes and bypass api endpoints";
    }
    return "feat(pwa): update service worker offline caching strategy";
  }

  if (filePath === "src/app/layout.tsx") {
    if (diff.includes("theme-color") || diff.includes("mobile-web-app-capable")) {
      return "style(layout): configure mobile theme color meta tags and optimize preconnects";
    }
    return "feat(layout): update root layout metadata and providers";
  }

  if (filePath === "src/app/page.tsx") {
    if (diff.includes("compare-levels")) {
      return "feat(home): add side-by-side level comparison and calm pacing guidance";
    }
    return "feat(home): update landing page layout and section flow";
  }

  if (filePath === "src/components/home/HeroExamLevelSelector.tsx") {
    if (diff.includes("ReviewTayoOwl") || diff.includes("pupil")) {
      return "feat(home): redesign HeroExamLevelSelector with tracking ReviewTayoOwl and clean cards";
    }
    if (diff.includes("active:scale") || diff.includes("March 14, 2027")) {
      return "feat(home): add tactile touch response and wrap level descriptions cleanly";
    }
    return "feat(home): update hero exam level selector card";
  }

  if (filePath === "src/components/home/ExamPickerCard.tsx" && file.status.includes("D")) {
    return "refactor(home): remove obsolete ExamPickerCard component";
  }

  if (filePath === "src/components/home/HomePageClient.tsx" && file.status.includes("D")) {
    return "refactor(home): remove unused HomePageClient component";
  }

  if (filePath === "src/components/home/PeekingOwl.tsx" && file.status.includes("D")) {
    return "refactor(home): remove legacy PeekingOwl component in favor of ReviewTayoOwl";
  }

  if (filePath === "src/app/(public)/cse/page.tsx") {
    return "feat(cse): update /cse page metadata and canonical structure for redesign";
  }

  if (filePath === "src/components/cse/CSELandingClient.tsx") {
    return "feat(cse): rebuild CSE landing page with command center hero, track, and urgency band";
  }

  if (filePath === "src/components/practice/CoachPanel.tsx") {
    return "feat(practice): implement CoachPanel with reactive owl mascot, speech bubbles, and stats";
  }

  if (filePath === "src/features/practice/coach.ts") {
    return "feat(practice): add streak tracking and deterministic Taglish coach reactions";
  }

  if (filePath === "src/features/practice/examTheme.ts") {
    return "feat(practice): add examTheme module for coach and exam hall layout styling";
  }

  if (filePath === "src/features/practice/TestModeBar.tsx") {
    return "feat(practice): add theme support to TestModeBar for coach and exam hall modes";
  }

  if (filePath === "src/components/layout/Header.tsx") {
    if (diff.includes("Exam Info") || diff.includes("More")) {
      return "refactor(header): streamline desktop navigation and group utilities into More menu";
    }
    return "feat(header): update navigation header layout";
  }

  if (filePath === "src/components/auth/UserNav.tsx") {
    return "refactor(auth): hide standalone settings icon on mobile to prevent clutter";
  }

  if (filePath === "src/features/practice/ExamRunner.tsx") {
    if (diff.includes("CoachPanel") || diff.includes("examTheme") || diff.includes("usesReviewConfirmation")) {
      return "feat(runner): integrate CoachPanel rationale bubble, clean header, and examTheme layout";
    }
    if (diff.includes("answers.size > 0") || diff.includes("router.push(\"/\")")) {
      return "refactor(runner): return to origin on unanswered quick test exit and bypass empty draft saves";
    }
    return "feat(runner): update exam runner state and navigation logic";
  }

  if (filePath === "src/lib/exam-guide/csc-data.ts") {
    return "fix(exam-guide): reconcile 2027 CSE-PPT schedule date to March 14, 2027";
  }

  // Auth Standalone Pages & Components
  if (filePath === "src/components/auth/AuthPageLayout.tsx" && file.status.includes("D")) {
    return "refactor(auth): remove deprecated AuthPageLayout in favor of AuthStandaloneLayout";
  }
  if (filePath === "src/components/auth/AuthStandaloneForm.tsx") {
    return "feat(auth): implement AuthStandaloneForm component for standalone auth pages";
  }
  if (filePath === "src/components/auth/AuthStandaloneLayout.tsx") {
    return "feat(auth): implement AuthStandaloneLayout with brand illustration and responsive container";
  }
  if (filePath === "src/app/(public)/create-account/page.tsx") {
    return "refactor(auth): switch create-account page to AuthStandaloneLayout";
  }
  if (filePath === "src/app/(public)/forgot-password/page.tsx") {
    return "refactor(auth): switch forgot-password page to AuthStandaloneLayout";
  }
  if (filePath === "src/app/(public)/sign-in/page.tsx") {
    return "refactor(auth): switch sign-in page to AuthStandaloneLayout";
  }
  if (filePath === "src/app/(public)/reset-password/page.tsx") {
    return "feat(auth): add standalone reset-password page with AuthStandaloneLayout";
  }
  if (filePath === "src/lib/auth/auth-client.ts") {
    return "feat(auth): export resetPassword method on authClient";
  }

  // Navigation & Workspace Level Sync
  if (filePath === "src/components/layout/ExamSubNav.tsx") {
    return "feat(layout): use workspace as authoritative level store in ExamSubNav";
  }
  if (filePath === "src/components/layout/HeaderExamSwitcher.tsx") {
    return "refactor(header): remove fabricated workspace fallback in HeaderExamSwitcher";
  }
  if (filePath === "src/config/exams.ts") {
    return "feat(config): add getExamRoutesForLevel and getExamMockSpecsForLevel helpers";
  }
  if (filePath === "src/config/practice-modes.ts") {
    return "feat(config): parameterize practice modes hrefs with active level template";
  }
  if (filePath === "src/lib/hooks/useExamLevel.ts") {
    return "refactor(hooks): demote useExamLevel to public-page view hint without URL query rewriting";
  }
  if (filePath === "src/lib/workspace/target-exam.ts") {
    return "feat(workspace): support clearing target exam date in saveTargetExamSummary";
  }
  if (filePath === "src/lib/workspace/types.ts") {
    return "feat(workspace): add optional studyStartDate field to ExamWorkspace type";
  }
  if (filePath === "src/lib/workspace/workspace-service.ts") {
    return "feat(workspace): add studyStartDate getters and persistence in WorkspaceService";
  }
  if (filePath === "src/app/(app)/settings/study/page.tsx") {
    return "feat(settings): write authoritative level and target date to workspace in study settings";
  }

  if (filePath === "src/lib/preferences/preferences-service.ts") {
    if (diff.includes("hasChosenExam") || diff.includes("fallbackName") || diff.includes("targetExamName")) {
      return "fix(preferences): preserve workspace target date and avoid resurrecting cleared dates";
    }
    return "fix(preferences): update default target date to March 14, 2027";
  }

  if (filePath === "src/lib/storage/local-storage-service.ts") {
    if (diff.includes("defaultDate = workspace?.targetExamDate || \"\"")) {
      return "fix(storage): stop fabricating default target date when workspace date is empty";
    }
    return "fix(storage): align default target exam date to March 14, 2027";
  }

  if (filePath === "src/features/dashboard/DashboardView.tsx") {
    if (diff.includes("TiltOwl") || diff.includes("levelRoutes")) {
      return "feat(dashboard): integrate interactive tilt owl, level-aware routes, and real due mistakes";
    }
    return "fix(dashboard): update fallback target date to March 14, 2027";
  }

  if (filePath === "src/features/dashboard/plan/StudyPlanView.tsx") {
    if (diff.includes("studyStartDate") || diff.includes("Why this plan")) {
      return "feat(dashboard): add strategy explanation, study start period, and calendar today reset in StudyPlanView";
    }
    return "feat(dashboard): add StudyPlanView with weekly schedule and milestone checklist";
  }

  if (filePath === "src/features/dashboard/practice/PracticeHubView.tsx") {
    if (diff.includes("createPortal") || diff.includes("lockBackground")) {
      return "feat(dashboard): portal practice setup sheet to body with focus trap and background lock";
    }
    return "feat(dashboard): add PracticeHubView with test mode selection cards";
  }

  if (filePath === "src/lib/study-plan-generator.ts") {
    if (diff.includes("studyStartDate") || diff.includes("dueReviewCount")) {
      return "feat(study-plan): add studyStartDate support, due review blocks, and why-this-plan rationale";
    }
    return "feat(study-plan): implement auto-generated study plan schedule generator";
  }

  if (filePath === "src/features/dashboard/ExamCalendarCard.tsx") {
    return "fix(dashboard): update calendar dropdown preset to March 14, 2027";
  }

  if (filePath === "src/app/(app)/practice/page.tsx") {
    return "feat(practice): show questions in review badge for empty topics";
  }

  // Dynamic route pages with SSG generateStaticParams
  if (filePath === "src/app/(app)/exams/[level]/quick/page.tsx") {
    return "perf(exams): prerender quick diagnostic test route with generateStaticParams";
  }
  if (filePath === "src/app/(app)/exams/[level]/medium/page.tsx") {
    return "perf(exams): prerender medium test route with generateStaticParams";
  }
  if (filePath === "src/app/(app)/exams/[level]/full/page.tsx") {
    return "perf(exams): prerender full mock exam route with generateStaticParams";
  }
  if (filePath === "src/app/(app)/practice/[topicId]/page.tsx") {
    return "perf(practice): prerender topic practice route with generateStaticParams";
  }

  // Archives & Design Mockups
  if (filePath.startsWith("ARCHIVES/reviewtayo-") && filePath.endsWith(".html")) {
    const pageName = baseName.replace(/\.html$/, "");
    return `docs(design): archive ${pageName} HTML mockup`;
  }
  if (filePath.startsWith("reviewtayo-") && filePath.endsWith(".html")) {
    const pageName = baseName.replace(/\.html$/, "");
    if (file.status.includes("D")) {
      return `docs(design): remove unarchived ${pageName} root mockup`;
    }
    return `docs(design): add ${pageName} mockup`;
  }

  // Dashboard Unified Shell & Views
  if (filePath === "src/features/dashboard/AppShell.tsx") {
    return "feat(dashboard): create responsive AppShell layout with sidebar and exam switcher";
  }
  if (filePath === "src/features/dashboard/DashboardView.tsx") {
    return "feat(dashboard): connect daily quests, quick actions, and study plan widgets";
  }
  if (filePath === "src/features/dashboard/DashboardOnboardingView.tsx") {
    return "feat(dashboard): adapt onboarding to current workspace exam and target dates";
  }
  if (filePath === "src/features/dashboard/useDailyQuests.ts") {
    return "feat(dashboard): add daily quests hook with progress tracking";
  }
  if (filePath === "src/features/dashboard/achievements/AchievementsView.tsx") {
    return "feat(dashboard): add AchievementsView with milestone badges and progress tracking";
  }
  if (filePath === "src/features/dashboard/history/HistoryView.tsx") {
    return "feat(dashboard): add HistoryView with test filtering and exam switcher";
  }
  if (filePath === "src/features/dashboard/notes/NotesView.tsx") {
    return "feat(dashboard): add NotesView for exam-scoped notes and search";
  }
  if (filePath === "src/features/dashboard/plan/StudyPlanView.tsx") {
    return "feat(dashboard): add StudyPlanView with weekly schedule and milestone checklist";
  }
  if (filePath === "src/features/dashboard/practice/PracticeHubView.tsx") {
    return "feat(dashboard): add PracticeHubView with test mode selection cards";
  }
  if (filePath === "src/features/dashboard/review/ReviewView.tsx") {
    return "feat(dashboard): add ReviewView for SRS flashcard review and mistake bank";
  }

  // Dashboard Routes
  if (filePath === "src/app/(app)/dashboard/page.tsx") {
    return "feat(dashboard): integrate AppShell with primary dashboard landing page";
  }
  if (filePath === "src/app/(app)/dashboard/achievements/page.tsx") {
    return "feat(dashboard): add achievements page route";
  }
  if (filePath === "src/app/(app)/dashboard/history/page.tsx") {
    return "feat(dashboard): integrate HistoryView into dashboard history route";
  }
  if (filePath === "src/app/(app)/dashboard/learn/page.tsx") {
    return "feat(dashboard): add study guides/learn redirect route";
  }
  if (filePath === "src/app/(app)/dashboard/notes/page.tsx") {
    return "feat(dashboard): add exam-scoped personal notes route";
  }
  if (filePath === "src/app/(app)/dashboard/plan/page.tsx") {
    return "feat(dashboard): add study plan route";
  }
  if (filePath === "src/app/(app)/dashboard/practice/page.tsx") {
    return "feat(dashboard): add practice hub route";
  }
  if (filePath === "src/app/(app)/dashboard/review/page.tsx") {
    return "feat(dashboard): add SRS review hub route";
  }
  if (filePath === "src/app/(app)/settings/SettingsShell.tsx") {
    return "feat(settings): support dashboard workspace context in SettingsShell";
  }
  if (filePath === "src/app/(app)/settings/study/page.tsx") {
    return "feat(settings): add target exam and study schedule controls";
  }

  // Config Files
  if (filePath === "src/config/achievements.ts") {
    return "feat(config): define achievement badges and milestone definitions";
  }
  if (filePath === "src/config/practice-modes.ts") {
    return "feat(config): add practice modes catalog and routing configurations";
  }
  if (filePath === "src/config/study-plan-templates.ts") {
    return "feat(config): define study plan milestone templates for CSE, LET, and Nursing";
  }

  // Libraries & Utilities
  if (filePath === "src/lib/achievement-engine.ts") {
    return "feat(achievements): implement achievement evaluation engine";
  }
  if (filePath === "src/lib/daily-quests.ts") {
    return "feat(quests): implement daily quest generation and completion tracker";
  }
  if (filePath === "src/lib/study-plan-generator.ts") {
    return "feat(study-plan): implement auto-generated study plan schedule generator";
  }
  if (filePath === "src/lib/study-plan.ts") {
    return "feat(study-plan): add study plan validation and progress calculation";
  }
  if (filePath === "src/lib/workspace/target-exam.ts") {
    return "feat(workspace): add target exam resolution and active exam helper";
  }
  if (filePath === "src/lib/storage/notes-service.ts") {
    return "feat(storage): implement exam-scoped personal notes service";
  }
  if (filePath === "src/lib/storage/safe-storage.ts") {
    return "feat(storage): add SSR-safe storage abstraction with fallback";
  }
  if (filePath === "src/lib/storage/local-storage-service.ts") {
    return "feat(storage): add multi-exam isolation and safe migration logic";
  }
  if (filePath === "src/lib/storage/types.ts") {
    return "feat(storage): add notes, quests, and study plan storage interfaces";
  }
  if (filePath === "src/lib/storage/index.ts") {
    return "feat(storage): export safeStorage, notesService, and clean slate utilities";
  }
  if (filePath === "src/lib/content/types.ts") {
    return "feat(content): export exam identifiers and subject types";
  }
  if (filePath === "src/lib/preferences/types.ts") {
    return "feat(preferences): add target exam preferences schema";
  }
  if (filePath === "src/lib/preferences/preferences-service.ts") {
    return "feat(preferences): add target exam and schedule preference persistence";
  }
  if (filePath === "src/lib/preferences/usePreferences.ts") {
    return "feat(preferences): expose exam preference hooks and state mutations";
  }

  // Documentation & Logs
  if (filePath === "AGENTS.md") {
    return "docs(agents): update guidelines for token efficiency and rolling progress handoffs";
  }
  if (filePath === "ARCHIVES/progress-history.md") {
    return "docs(archives): update progress history archive with fix and improve round details";
  }
  if (filePath === "ARCHIVES/README.md") {
    return "docs(archives): update archives directory documentation";
  }
  if (filePath === "ARCHIVES/implementation_plan2.md") {
    return "docs(archives): record archived implementation plan 2";
  }
  if (filePath === "implementation_plan.md") {
    return "docs(plan): update implementation plan for coach bubble, clean header, and cse redesign";
  }
  if (filePath.endsWith("PROGRESS.md")) {
    return "docs(progress): record fix and improve round completion across sheet, workspace, and study strategies";
  }
  if (filePath.endsWith("walkthrough.md")) {
    return "docs(walkthrough): update verification walkthrough for unified app shell and dashboard suite";
  }
  if (filePath.startsWith(".design/")) {
    const docName = baseName.replace(/\.[^/.]+$/, "");
    if (file.status.includes("D")) {
      return `docs(design): remove legacy ${docName.replace(/-/g, " ")}`;
    }
    return `docs(design): record ${docName.replace(/-/g, " ")}`;
  }
  if (filePath.startsWith("docs/")) {
    const docName = baseName.replace(/\.[^/.]+$/, "");
    return `docs(${docName}): update documentation for ${docName}`;
  }

  // Brand & PWA Assets
  if (filePath === "src/app/(app)/settings/appearance/page.tsx") {
    return "feat(settings): update appearance settings theme styling";
  }
  if (filePath === "src/app/(public)/about/page.tsx") {
    return "feat(about): update about page brand layout";
  }
  if (filePath === "src/app/(public)/articles/[slug]/page.tsx") {
    return "feat(articles): update article template styling";
  }
  if (filePath === "tailwind.config.ts") {
    return "style(tailwind): refine brand color palette tokens";
  }
  if (filePath === "src/app/globals.css") {
    if (diff.includes("scrollbar-gutter") || diff.includes("::-webkit-scrollbar")) {
      return "style(theme): add scrollbar-gutter stable and themed scrollbar styling";
    }
    return "style(theme): add exam hall and coach background tokens and card shadows";
  }
  if (filePath === "src/app/manifest.ts") {
    return "feat(pwa): register new maskable and brand icons in web app manifest";
  }
  if (filePath === "src/components/ui/Logo.tsx") {
    return "feat(ui): add brand Logo component with responsive mascot icon";
  }
  if (filePath.startsWith("public/icon") || filePath.startsWith("public/favicon") || filePath.startsWith("public/apple-touch-icon") || filePath.startsWith("public/maskable")) {
    return `feat(assets): update ${baseName} brand asset`;
  }

  // Test Files
  if (filePath === "tests/e2e/auth-modal.spec.ts") {
    return "test(e2e): update auth modal specifications for standalone layout integration";
  }
  if (filePath === "tests/unit/components/auth-pages.test.tsx") {
    return "test(unit): update auth pages tests for AuthStandaloneLayout and reset password";
  }
  if (filePath === "tests/unit/lib/study-plan-generator.test.ts") {
    return "test(unit): update study plan generator tests for study window and due reviews";
  }
  if (filePath === "tests/unit/dashboard/exam-state-regression.test.tsx") {
    return "test(unit): add exam state regression tests for level, target date, and name propagation";
  }
  if (filePath === "tests/unit/dashboard/practice-sheet.test.tsx") {
    return "test(unit): add unit tests for practice setup sheet portal geometry and a11y focus trap";
  }
  if (filePath === "tests/unit/lib/study-plan-strategies.test.ts") {
    return "test(unit): add unit tests for study plan strategy divergence and signature recomputation";
  }
  if (filePath === "tests/e2e/exam-flow.spec.ts") {
    return "test(e2e): update exam flow tests for coach panel and redesigned hero selector";
  }
  if (filePath === "tests/e2e/exam-guide.spec.ts") {
    return "test(e2e): update exam guide navigation and select option assertions";
  }
  if (filePath === "tests/unit/components/home-components.test.tsx") {
    return "test(unit): update home component tests for redesigned hero selector and pupil tracking";
  }
  if (filePath === "tests/unit/components/peeking-owl.test.tsx" && file.status.includes("D")) {
    return "test(unit): remove tests for deprecated PeekingOwl";
  }
  if (filePath === "tests/unit/practice/coach.test.ts") {
    return "test(unit): add unit tests for coach reactions and streak counter";
  }
  if (filePath === "tests/unit/practice/examTheme.test.ts") {
    return "test(unit): add unit tests for examTheme mode resolution";
  }
  if (filePath === "tests/unit/practice/ExamRunner.test.tsx") {
    return "test(unit): update ExamRunner tests for coach panel and exam theme layout";
  }
  if (filePath === "tests/unit/dashboard/ExamCalendarCard.test.tsx") {
    return "test(unit): update calendar card date assertion to March 14, 2027";
  }

  // 2. Heuristic Pattern Generators by Directory Structure
  if (filePath.startsWith("tests/e2e/")) {
    const specName = baseName.replace(/\.spec\.(ts|js)$/, "");
    return `test(e2e): update ${specName} end-to-end specifications`;
  }
  if (filePath.startsWith("tests/unit/")) {
    const unitName = baseName.replace(/\.test\.(ts|tsx|js|jsx)$/, "");
    return `test(unit): update unit tests for ${unitName}`;
  }
  if (filePath.startsWith("tests/integration/")) {
    const intName = baseName.replace(/\.test\.(ts|tsx|js|jsx)$/, "");
    return `test(integration): update integration tests for ${intName}`;
  }

  if (filePath.startsWith("src/features/exam-engine/")) {
    const modName = baseName.replace(/\.(ts|tsx)$/, "");
    return `refactor(exam-engine): update ${modName} engine logic`;
  }
  if (filePath.startsWith("src/features/practice/")) {
    const modName = baseName.replace(/\.(ts|tsx)$/, "");
    return `feat(practice): update ${modName} practice flow`;
  }
  if (filePath.startsWith("src/features/dashboard/")) {
    const modName = baseName.replace(/\.(ts|tsx)$/, "");
    return `feat(dashboard): update ${modName} card`;
  }
  if (filePath.startsWith("src/features/results/")) {
    const modName = baseName.replace(/\.(ts|tsx)$/, "");
    return `feat(results): update ${modName} results review`;
  }

  if (filePath.startsWith("src/lib/")) {
    const parts = filePath.split("/");
    const scope = parts[2] || "lib";
    const modName = baseName.replace(/\.(ts|tsx)$/, "");
    return `feat(${scope}): update ${modName} utility`;
  }

  if (filePath.startsWith("src/components/")) {
    const parts = filePath.split("/");
    const scope = parts[2] || "ui";
    const compName = baseName.replace(/\.(ts|tsx)$/, "");
    return `feat(${scope}): update ${compName} component`;
  }

  if (filePath.startsWith("src/app/")) {
    const routeParts = filePath.replace(/^src\/app\//, "").split("/");
    const routeName = routeParts.slice(0, -1).join("/") || "root";
    return `feat(${routeName.replace(/[^a-zA-Z0-9-]/g, "")}): update ${baseName}`;
  }

  if (filePath.startsWith("scripts/")) {
    return `chore(scripts): update ${baseName} script`;
  }

  if (filePath.startsWith(".agents/") || filePath.startsWith("skills/")) {
    return `chore(skills): update ${baseName} agent skill`;
  }

  // 3. Fallback Conventional Commit
  const type = file.status.includes("D") ? "refactor" : file.status.includes("??") ? "feat" : "fix";
  const nameClean = baseName.replace(/\.[^/.]+$/, "");
  return `${type}(${nameClean}): update ${baseName}`;
}

async function main() {
  console.log("\n🔍 Inspecting uncommitted git files...");

  const files = getUncommittedFiles();
  if (files.length === 0) {
    console.log("✨ Working tree is clean. Nothing to commit!\n");
    return;
  }

  console.log(`📦 Found ${files.length} uncommitted file(s).\n`);

  if (isDryRun) {
    console.log("📋 [DRY RUN] Planned commits (no changes will be made):\n");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const msg = generateCommitMessage(file);
      console.log(`  [${i + 1}/${files.length}] [${file.status}] ${file.path}`);
      console.log(`    ➔  "${msg}"\n`);
    }
    console.log("💡 Run without --dry-run to commit these files individually.\n");
    return;
  }

  let successCount = 0;
  const committedList = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const msg = generateCommitMessage(file);
    const progress = `[${i + 1}/${files.length}]`;

    try {
      // Stage single file
      run(`git add "${file.path}"`);

      // Commit single file
      const verifyFlag = shouldVerify ? "" : "--no-verify";
      // Escape double quotes in message
      const escapedMsg = msg.replace(/"/g, '\\"');
      run(`git commit -m "${escapedMsg}" ${verifyFlag}`);

      const hash = run("git rev-parse --short HEAD") || "done";
      committedList.push({ file: file.path, msg, hash });
      successCount++;

      console.log(`${progress} ✅ (${hash}) ${file.path}`);
      console.log(`    ↳ "${msg}"`);
    } catch (err) {
      console.error(`${progress} ❌ Failed to commit ${file.path}:`, err.message);
    }
  }

  console.log(`\n🎉 Successfully created ${successCount} individual commit(s)!\n`);
  console.log("🚀 You can now push your commits whenever you are ready:");
  console.log("   git push\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
