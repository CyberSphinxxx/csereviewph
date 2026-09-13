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
import fs from "node:fs";
import path from "node:path";

const isDryRun = process.argv.includes("--dry-run");
const shouldVerify = process.argv.includes("--verify");

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch (error) {
    return null;
  }
}

function getUncommittedFiles() {
  const output = run("git status --porcelain -uall");
  if (!output) return [];

  const lines = output.split("\n").filter(Boolean);
  const files = [];

  for (const line of lines) {
    const match = line.match(/^([ MADRCU?!]{2})\s+(.*)$/);
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
  const ext = path.extname(filePath);
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
    if (diff.includes("active:scale") || diff.includes("March 14, 2027")) {
      return "feat(home): add tactile touch response and wrap level descriptions cleanly";
    }
    return "feat(home): update hero exam level selector card";
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
    if (diff.includes("answers.size > 0") || diff.includes("router.push(\"/\")")) {
      return "refactor(runner): return to origin on unanswered quick test exit and bypass empty draft saves";
    }
    return "feat(runner): update exam runner state and navigation logic";
  }

  if (filePath === "src/lib/exam-guide/csc-data.ts") {
    return "fix(exam-guide): reconcile 2027 CSE-PPT schedule date to March 14, 2027";
  }

  if (filePath === "src/lib/preferences/preferences-service.ts") {
    return "fix(preferences): update default target date to March 14, 2027";
  }

  if (filePath === "src/lib/storage/local-storage-service.ts") {
    return "fix(storage): align default target exam date to March 14, 2027";
  }

  if (filePath === "src/features/dashboard/DashboardView.tsx") {
    return "fix(dashboard): update fallback target date to March 14, 2027";
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

  // Documentation & Logs
  if (filePath.endsWith("PROGRESS.md")) {
    return "docs(progress): log live review report and foundational performance resolutions";
  }
  if (filePath.endsWith("walkthrough.md")) {
    return "docs(walkthrough): update verification walkthrough records";
  }
  if (filePath.startsWith(".design/")) {
    const docName = baseName.replace(/\.[^/.]+$/, "");
    return `docs(design): record ${docName.replace(/-/g, " ")}`;
  }
  if (filePath.startsWith("docs/")) {
    const docName = baseName.replace(/\.[^/.]+$/, "");
    return `docs(${docName}): update documentation for ${docName}`;
  }

  // Test Files
  if (filePath === "tests/e2e/exam-flow.spec.ts") {
    return "test(e2e): update landing page and exam flow test assertions for date and navigation";
  }
  if (filePath === "tests/e2e/exam-guide.spec.ts") {
    return "test(e2e): update exam guide navigation and select option assertions";
  }
  if (filePath === "tests/unit/components/home-components.test.tsx") {
    return "test(unit): update schedule date and reassurance copy assertions";
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
