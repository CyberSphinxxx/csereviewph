import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { WorkspaceService } from "@/lib/workspace/workspace-service";
import { LocalStorageService } from "@/lib/storage";
import { PreferencesService } from "@/lib/preferences";
import { getTargetExamSummary, saveTargetExamSummary } from "@/lib/workspace/target-exam";
import { getExamRoutesForLevel, getExamMockSpecsForLevel } from "@/config/exams";

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
    usePathname: () => "/dashboard",
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  };
});

function resetStorage() {
  LocalStorageService.clearAllGuestData();
  LocalStorageService.resetMigrationForTesting();
  window.localStorage.clear();
  PreferencesService.resetAllPreferences();
}

describe("workspace is the single authoritative exam store (P2)", () => {
  beforeEach(() => {
    resetStorage();
  });

  it("propagates the subprofessional variant into plan routes and mock specs", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "subprofessional" });

    // The workspace write is the only mutation; routes/specs are derived reads.
    const ws = WorkspaceService.getCurrentWorkspace()!;
    expect(ws.levelId).toBe("subprofessional");

    const routes = getExamRoutesForLevel(ws.examId, ws.levelId);
    expect(routes.quickDrillUrl).toBe("/exams/subprofessional/quick");
    expect(routes.fullMockUrl).toBe("/exams/subprofessional/full");

    const specs = getExamMockSpecsForLevel(ws.examId, ws.levelId)!;
    // Subprofessional: 165 items / 160 minutes (Professional is 170 / 190)
    expect(specs.itemCount).toBe(165);
    expect(specs.timeLimitMinutes).toBe(160);
    expect(specs.passingScorePercentage).toBe(80);
  });

  it("dashboard renders routes and countdown from the workspace, not catalog defaults", () => {
    WorkspaceService.createWorkspace({
      examId: "cse",
      levelId: "subprofessional",
      targetExamDate: "2027-06-20",
    });

    render(<DashboardView />);

    // The due-reviews / drill links must point at the subprofessional runner
    const subLinks = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((h): h is string => Boolean(h));
    expect(subLinks.some((h) => h.startsWith("/exams/subprofessional/"))).toBe(true);
    expect(subLinks.some((h) => h.startsWith("/exams/professional/"))).toBe(false);

    // Workspace date is rendered as the formatted countdown target
    expect(screen.getByText("June 20, 2027")).toBeInTheDocument();
  });

  it("saveTargetExamSummary writes through workspace, target config, and preferences", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    act(() => {
      saveTargetExamSummary({ targetDate: "2027-08-14", dailyGoal: 40 });
    });

    // Workspace metadata
    const ws = WorkspaceService.getCurrentWorkspace()!;
    expect(ws.targetExamDate).toBe("2027-08-14");
    expect(ws.dailyGoal).toBe(40);

    // Legacy target config mirror
    const cfg = LocalStorageService.getTargetExamConfig(ws.id);
    expect(cfg.targetDate).toBe("2027-08-14");
    expect(cfg.dailyGoal).toBe(40);

    // Preferences mirror
    const prefs = PreferencesService.getPreferences();
    expect(prefs.study.targetDate).toBe("2027-08-14");
    expect(prefs.study.dailyGoal).toBe(40);

    // Summary read-back agrees with all three
    const summary = getTargetExamSummary();
    expect(summary?.targetDate).toBe("2027-08-14");
    expect(summary?.dailyGoal).toBe(40);
  });

  it("clearing the target date produces the real no-date state, not a fabricated one", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    act(() => {
      saveTargetExamSummary({ targetDate: "" });
    });

    const ws = WorkspaceService.getCurrentWorkspace()!;
    // Cleared date must never be replaced by a fabricated default (storage
    // normalizes the cleared state to an empty string, falsy everywhere).
    expect(ws.targetExamDate || "").toBe("");
    expect(PreferencesService.getPreferences().study.targetDateType).toBe("none");

    render(<DashboardView />);
    // Explicit empty state instead of a hardcoded default countdown
    expect(screen.getByText("no exam date set")).toBeInTheDocument();
    expect(screen.getByText(/Set one in Settings/)).toBeInTheDocument();
    // No "days until" countdown and no fabricated date may appear
    expect(screen.queryByText(/days until/)).not.toBeInTheDocument();
  });

  it("persists level and date across a simulated reload", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    // The app re-reads from localStorage on reload; simulate by reading a
    // fresh WorkspaceService value after the write (same storage, no cache).
    WorkspaceService.updateWorkspace("workspace_cse", {
      levelId: "subprofessional",
      trackName: "Subprofessional",
    });
    act(() => {
      saveTargetExamSummary({ targetDate: "2027-09-01" });
    });

    const reloaded = WorkspaceService.getCurrentWorkspace()!;
    expect(reloaded.levelId).toBe("subprofessional");
    expect(reloaded.trackName).toBe("Subprofessional");
    expect(reloaded.targetExamDate).toBe("2027-09-01");
    expect(getExamRoutesForLevel(reloaded.examId, reloaded.levelId).quickDrillUrl).toBe(
      "/exams/subprofessional/quick"
    );
  });
});
