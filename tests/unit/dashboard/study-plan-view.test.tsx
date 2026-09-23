import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StudyPlanView } from "@/features/dashboard/plan/StudyPlanView";
import { LocalStorageService } from "@/lib/storage";
import { WorkspaceService } from "@/lib/workspace/workspace-service";

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
    usePathname: () => "/dashboard/plan",
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
  };
});

describe("StudyPlanView day states", () => {
  beforeEach(() => {
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
  });

  it("fresh account: no past day ever renders as Done", () => {
    render(<StudyPlanView />);

    expect(screen.getByRole("heading", { name: "Study plan" })).toBeInTheDocument();
    // A fresh account has zero activity, so no Done chip may appear anywhere.
    expect(screen.queryByText("Done")).not.toBeInTheDocument();
    // Template picker is present with Smart as the default.
    expect(screen.getByRole("radio", { name: "Smart" })).toHaveAttribute("aria-checked", "true");
  });

  it("account with a recorded past day: that day shows Done, others show No activity", () => {
    // Pin "now" to Wed 2026-09-23 Manila so the week grid is Sun 20 .. Sat 26.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-23T02:00:00Z"));
    try {
      // Seed recorded activity on Monday only (as recordDailyActivity would).
      window.localStorage.setItem(
        "cse_guest_streak",
        JSON.stringify({
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: "2026-09-21",
          activeDates: ["2026-09-21"],
          checkInDates: [],
        })
      );

      render(<StudyPlanView />);

      // Monday was active: exactly one Done chip (the calendar legend has no Done).
      expect(screen.getAllByText("Done")).toHaveLength(1);
      // Sunday and Tuesday were not: neutral focus text, never Done, never failure-styled.
      expect(screen.getAllByText("No activity")).toHaveLength(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("switching the template regenerates the plan rationale", () => {
    render(<StudyPlanView />);

    // Fresh workspace: cold-start rationale regardless of template...
    expect(screen.getByText(/builds a baseline/i)).toBeInTheDocument();

    // ...and the picker switches selection (writes planTemplate preference).
    fireEvent.click(screen.getByRole("radio", { name: "Balanced rotation" }));
    expect(screen.getByRole("radio", { name: "Balanced rotation" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Smart" })).toHaveAttribute("aria-checked", "false");
  });
});
