import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PracticeHubView } from "@/features/dashboard/practice/PracticeHubView";
import { StudyPlanView } from "@/features/dashboard/plan/StudyPlanView";
import { WorkspaceService } from "@/lib/workspace/workspace-service";
import { LocalStorageService } from "@/lib/storage";
import { PreferencesService } from "@/lib/preferences";

vi.mock("@/lib/auth/auth-client", () => ({
  useSession: () => ({ data: null, isPending: false, refetch: vi.fn() }),
  signOut: vi.fn(),
  signIn: { email: vi.fn() },
  signUp: { email: vi.fn() },
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    usePathname: () => "/dashboard/practice",
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  };
});

describe("practice setup sheet (P1)", () => {
  beforeEach(() => {
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
    window.localStorage.clear();
    PreferencesService.resetAllPreferences();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    // jsdom does not implement scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  function openSheet(label: RegExp | string) {
    // The recommended action card and the catalog card share names; both open
    // the same setup sheet for their mode.
    const matches = screen.getAllByRole("button", { name: label });
    fireEvent.click(matches[0]);
  }

  it("portals the sheet outside the hub root so the CTA is a full-width fixed element", () => {
    render(<PracticeHubView />);
    openSheet(/spaced review/i);

    const dialog = screen.getByRole("dialog", { name: /spaced review/i });
    // Portal target: direct child of <body>, NOT inside the animated wrapper.
    expect(dialog.parentElement).toBe(document.body);
    // Viewport-fixed geometry resolves against the real viewport, not the
    // content column (the Chromium containing-block bug this regression pins).
    expect(dialog.className).toContain("fixed");
    // The primary CTA is present and enabled inside the sheet footer.
    const cta = screen.getByRole("button", { name: /start spaced review/i });
    expect(cta).toBeEnabled();
  });

  it("renders the sheet for every setup-enabled mode and keeps its dynamic CTA", () => {
    render(<PracticeHubView />);
    const cases: [RegExp, RegExp][] = [
      [/quick drill/i, /start quick drill/i],
      [/medium assessment/i, /start medium assessment/i],
      [/diagnostic test/i, /start diagnostic test/i],
      [/spaced review/i, /start spaced review/i],
    ];
    for (const [cardLabel, ctaLabel] of cases) {
      openSheet(cardLabel);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: ctaLabel })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /close setup/i }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    }
  });

  it("marks the page behind the sheet inert and restores it on close", () => {
    render(<PracticeHubView />);
    openSheet(/spaced review/i);
    const dialog = screen.getByRole("dialog");
    const behind = Array.from(document.body.children).filter(
      (c) => !c.contains(dialog) && c !== dialog
    );
    expect(behind.length).toBeGreaterThan(0);
    expect(behind.every((c) => (c as HTMLElement).inert)).toBe(true);
    // The dialog itself (and its portal container) is never inert.
    expect(dialog.closest("[inert='true']")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /close setup/i }));
    expect(Array.from(document.body.children).every((c) => !(c as HTMLElement).inert)).toBe(true);
  });

  it("traps Tab focus inside the sheet", () => {
    render(<PracticeHubView />);
    openSheet(/spaced review/i);

    const dialog = screen.getByRole("dialog");
    const focusables = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    expect(focusables.length).toBeGreaterThan(1);

    // Focus the last element and press Tab: focus must wrap to the first.
    const last = focusables[focusables.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(focusables[0]);
  });

  it("closes on Escape and returns focus to the card that opened it", () => {
    render(<PracticeHubView />);
    const card = screen.getAllByRole("button", { name: /spaced review/i })[0];
    card.focus(); // jsdom does not focus on programmatic click
    fireEvent.click(card);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Focus restoration target is the opening card.
    expect(document.activeElement).toBe(card);
  });
});

describe("study plan calendar (P1)", () => {
  beforeEach(() => {
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
    window.localStorage.clear();
    PreferencesService.resetAllPreferences();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("opens on today's month even when the exam is months away", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-23T02:00:00Z"));
    try {
      render(<StudyPlanView />);
      // September 2026 — NOT the exam month (March 2027).
      expect(screen.getByRole("heading", { name: /September 2026/ })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: /March 2027/ })).not.toBeInTheDocument();
      // No Today button needed while already on today's month.
      expect(screen.queryByRole("button", { name: /back to today's month/i })).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows a Today button after navigating away and returns to today's month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-23T02:00:00Z"));
    try {
      render(<StudyPlanView />);
      fireEvent.click(screen.getByRole("button", { name: /next month/i }));
      expect(screen.getByRole("heading", { name: /October 2026/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /back to today's month/i })).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /back to today's month/i }));
      expect(screen.getByRole("heading", { name: /September 2026/ })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /back to today's month/i })).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
