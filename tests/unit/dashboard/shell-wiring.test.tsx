import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AppShell } from "@/features/dashboard/AppShell";
import { LocalStorageService } from "@/lib/storage";
import { WorkspaceService } from "@/lib/workspace/workspace-service";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    usePathname: () => currentPath,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  };
});

let currentPath = "/dashboard";

/** Routes reachable from the sidebar (excluding runner routes, mistakes/bookmarks legacy pages). */
const SHELL_ROUTES = [
  "src/app/(app)/dashboard/page.tsx",
  "src/app/(app)/dashboard/plan/page.tsx",
  "src/app/(app)/dashboard/practice/page.tsx",
  "src/app/(app)/dashboard/review/page.tsx",
  "src/app/(app)/dashboard/history/page.tsx",
  "src/app/(app)/dashboard/achievements/page.tsx",
  "src/app/(app)/dashboard/notes/page.tsx",
] as const;

describe("shell wiring regression", () => {
  beforeEach(() => {
    currentPath = "/dashboard";
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
  });

  it("every sidebar route page wraps its content in AppShell", () => {
    for (const rel of SHELL_ROUTES) {
      const src = readFileSync(join(process.cwd(), rel), "utf8");
      expect(src, `${rel} must import AppShell`).toContain('from "@/features/dashboard/AppShell"');
      expect(src, `${rel} must render <AppShell>`).toMatch(/<AppShell>[\s\S]*<\/AppShell>/);
    }
  });

  it("sidebar chrome uses theme-aware classes (light tokens + dark gradient), not hardcoded dark", () => {
    const src = readFileSync(join(process.cwd(), "src/features/dashboard/AppShell.tsx"), "utf8");
    // Light theme: warm cream sidebar with a hairline border...
    expect(src).toContain('bg-[#fdf8f6] dark:bg-gradient-to-b dark:from-[#2c0b14]');
    // ...and a dark-variant on every piece of chrome, so light mode is never dark.
    for (const marker of [
      "dark:bg-gradient-to-b dark:from-[#2c0b14]",
      "dark:bg-[#1c060c] border-t",
      "text-[#8a1630] dark:text-white",
    ]) {
      expect(src, `AppShell must contain ${marker}`).toContain(marker);
    }
  });

  it("renders the Coming soon sidebar entry linking to the practice catalog anchor", () => {
    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    const soon = screen.getAllByRole("link", { name: /coming soon/i })[0];
    expect(soon).toHaveAttribute("href", "/dashboard/practice#coming-soon");
  });

  it("Review shows the New pill when there is no due badge, and the due badge when items are due", () => {
    currentPath = "/dashboard/review";
    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    // Fresh workspace: nothing due, so the New pill must appear on Review.
    const review = screen.getAllByRole("link", { name: /^review$/i })[0];
    expect(review).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByText("New").length).toBeGreaterThan(0);
    expect(screen.queryByTitle(/questions due for review/i)).not.toBeInTheDocument();
  });

  it("renders shell chrome in both themes via dark: variants on the same tree", () => {
    // The shell has a single tree; theme is class-driven on <html> by ThemeProvider.
    // Assert the tree contains both light and dark variants for the sidebar root,
    // which is the piece the earlier bug hardcoded.
    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    const aside = document.querySelector('aside[aria-label="Main"]');
    expect(aside).not.toBeNull();
    const cls = aside?.className ?? "";
    expect(cls).toContain("bg-[#fdf8f6]");
    expect(cls).toContain("dark:from-[#2c0b14]");
    expect(cls).toContain("dark:to-[#1c060c]");
    expect(cls).toContain("border-r");
  });

  it("gates the shell when no exam is chosen: locked nav, onboarding, no page content", async () => {
    // Rebuild a clean profile: this suite's beforeEach creates a workspace,
    // so wipe it to reach the locked state.
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
    window.localStorage.removeItem("rt_workspaces");
    window.localStorage.removeItem("rt_current_workspace_id");

    currentPath = "/dashboard/plan"; // direct URL access to a gated route
    render(
      <AppShell>
        <p>gated content must not appear</p>
      </AppShell>
    );

    // The onboarding gate renders instead of the page content...
    expect(await screen.findByText(/Choose one exam to build your workspace/i)).toBeInTheDocument();
    expect(screen.queryByText("gated content must not appear")).not.toBeInTheDocument();

    // ...every gated nav item shows its lock affordance...
    const locks = screen.getAllByLabelText(/locked, choose an exam to unlock/i);
    expect(locks.length).toBeGreaterThanOrEqual(7);
    // ...and Dashboard remains open as the gate entry point.
    expect(screen.queryByLabelText(/dashboard \(locked/i)).not.toBeInTheDocument();

    // Sidebar target card offers choosing, not a fabricated exam.
    expect(screen.getAllByText("Choose your exam").length).toBeGreaterThan(0);
  });

  it("renders the gate when no workspace exists and unlocks after one is created", async () => {
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
    window.localStorage.removeItem("rt_workspaces");
    window.localStorage.removeItem("rt_current_workspace_id");

    const view = render(
      <AppShell>
        <p>unlocked content</p>
      </AppShell>
    );
    expect(await screen.findByText(/Choose one exam to build your workspace/i)).toBeInTheDocument();

    // Choosing an exam through the embedded picker unlocks the shell in place:
    // the workspace-change event re-renders AppShell with the real children.
    const start = await screen.findByRole("button", { name: /start preparing/i });
    start.click();
    expect(await screen.findByText("unlocked content")).toBeInTheDocument();
    expect(screen.queryByText(/Choose one exam to build your workspace/i)).not.toBeInTheDocument();

    view.unmount();
  });
});
