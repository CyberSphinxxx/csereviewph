import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardView } from "@/features/dashboard/DashboardView";

import { LocalStorageService } from "@/lib/storage";

vi.mock("@/lib/auth/auth-client", () => ({
  useSession: () => ({
    data: null,
    isPending: false,
    refetch: vi.fn(),
  }),
  signOut: vi.fn(),
  signIn: { email: vi.fn() },
  signUp: { email: vi.fn() },
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    usePathname: () => "/dashboard",
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
  };
});

import { WorkspaceService } from "@/lib/workspace/workspace-service";

describe("DashboardView Component", () => {
  it("renders intentional onboarding state when user has no active workspace", () => {
    LocalStorageService.clearAllGuestData();

    render(<DashboardView />);

    // Greeting & invitation
    expect(screen.getByText("Choose one exam to build your workspace")).toBeInTheDocument();
    expect(screen.getByText(/Your selected track, target date, practice history, and recommendations/i)).toBeInTheDocument();
    expect(screen.getByText("Available now")).toBeInTheDocument();
    expect(screen.getByText(/Civil Service Exam \(CSE\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Start preparing/i)).toBeInTheDocument();

    // Must NOT show meaningless empty stat tiles with 0%
    expect(screen.queryByText("Practice accuracy")).not.toBeInTheDocument();
    expect(screen.queryByText("Take a 10-Question Diagnostic Benchmark")).not.toBeInTheDocument();
  });

  it("renders truthful unmeasured baseline for new guests preparing for an exam (D01)", () => {
    LocalStorageService.clearAllGuestData();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    render(<DashboardView />);

    // Greeting: neutral welcome for guests
    expect(screen.getByText("Welcome back")).toBeInTheDocument();

    // Truthful empty metric: em dash placeholder, no fake 0% (D01)
    expect(screen.getByText("Practice accuracy")).toBeInTheDocument();
    expect(screen.getByText("Take a diagnostic first")).toBeInTheDocument();

    // Terminology preserved (D08)
    expect(screen.getByText("Study streak")).toBeInTheDocument();
    expect(screen.getByText("Items answered")).toBeInTheDocument();

    // Recommendation card (D04: single dominant action from the rule engine)
    expect(screen.getByText(/Diagnostic Benchmark/i)).toBeInTheDocument();
    expect(screen.getByText("Start Diagnostic Drill (10 min)")).toBeInTheDocument();

    // Subject progress panel
    expect(screen.getByText("Your subject progress")).toBeInTheDocument();
  });

  it("dynamically reflects completed attempts from LocalStorageService", () => {
    LocalStorageService.clearAllGuestData();
    const cseWs = WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    LocalStorageService.recordCompletedAttempt(
      {
        id: "att-dash-test",
        title: "Quick Test Pro",
        mode: "quick",
        rules: {
          mode: "quick",
          itemCount: 1,
          timeLimitMinutes: 10,
          passingScorePercentage: 80,
          allowsFlagging: true,
          hasContinuousTimer: true,
          subjectDistribution: {},
          difficultyDistribution: {},
        },
        questions: [],
        answers: [],
        scoreResult: {
          totalQuestions: 1,
          answeredCount: 1,
          unansweredCount: 0,
          correctCount: 1,
          incorrectCount: 0,
          rawScore: 1,
          percentageScore: 100,
          isPassed: true,
          passingScorePercentage: 80,
          timeSpentSeconds: 15,
          subjectBreakdown: [],
          topicBreakdown: [],
          strengths: [],
          weakAreas: [],
          recommendedTopics: [],
        },
        completedAt: new Date().toISOString(),
      },
      cseWs.id
    );

    render(<DashboardView />);

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getAllByText(/Quick Test Pro/).length).toBeGreaterThanOrEqual(1);
    // Streak advanced to 1 day after recording the attempt
    expect(screen.getAllByText(/^1 day$/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Quick Test Pro/)).toBeInTheDocument();
  });

  it("renders inside the app shell without public Header/Footer chrome", async () => {
    LocalStorageService.clearAllGuestData();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    const { default: DashboardPage } = await import("@/app/(app)/dashboard/page");
    render(<DashboardPage />);

    // The public marketing footer is replaced by the app shell; the mobile
    // top bar is an expected banner inside the shell
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    expect(screen.queryByText("Exams")).not.toBeInTheDocument();
    expect(screen.getAllByLabelText(/reviewtayo home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Welcome back").length).toBeGreaterThanOrEqual(1);
  });

  it("points data management to Settings instead of an inline section", () => {
    LocalStorageService.clearAllGuestData();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    render(<DashboardView />);

    // Export/restore/reset moved to /settings/data
    expect(screen.queryByText("Export Backup (JSON)")).not.toBeInTheDocument();
  });
});
