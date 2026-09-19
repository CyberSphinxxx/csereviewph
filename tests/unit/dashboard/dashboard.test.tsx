import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
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

    // Greeting: guest neutral greeting
    expect(screen.getByText("What will you improve today?")).toBeInTheDocument();

    // Truthful empty metric: Not measured yet (D01)
    expect(screen.getAllByText("Not measured yet").length).toBeGreaterThanOrEqual(1);

    // Terminology: Practice accuracy instead of Overall Accuracy (D08)
    expect(screen.getByText("Practice accuracy")).toBeInTheDocument();
    expect(screen.getByText("Tests completed")).toBeInTheDocument();
    expect(screen.getByText("Study streak")).toBeInTheDocument();
    expect(screen.getByText("Items answered")).toBeInTheDocument();

    // Recommendation card (D04: For Today single dominant action)
    expect(screen.getByText(/Take a 10-Question Diagnostic Benchmark/i)).toBeInTheDocument();
    expect(screen.getByText("Start Diagnostic Drill (10 min)")).toBeInTheDocument();

    // Subject Progress: "Your subject progress" instead of "Civil Service Subtest Readiness"
    expect(screen.getByText("Your subject progress")).toBeInTheDocument();

    // "Your exam" calendar panel (D05)
    expect(screen.getByText("Your Exam")).toBeInTheDocument();
    expect(screen.getByText("Change date")).toBeInTheDocument();

    // Data Storage (D07)
    expect(screen.getByText(/Saved on this device/i)).toBeInTheDocument();
  });

  it("dynamically reflects completed attempts from LocalStorageService", async () => {
    LocalStorageService.clearAllGuestData();
    const cseWs = WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    LocalStorageService.recordCompletedAttempt({
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
    }, cseWs.id);

    render(<DashboardView />);

    // Test count and 100% accuracy should be rendered
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText(/1 day study streak/i)).toBeInTheDocument();
  });

  it("renders DashboardPage with Header, Footer, and DashboardView", async () => {
    LocalStorageService.clearAllGuestData();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    const { default: DashboardPage } = await import("@/app/(app)/dashboard/page");
    render(<DashboardPage />);

    // Header brand and navigation should be present
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getAllByText("Exams").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Study resources").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("My dashboard").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sign In").length).toBeGreaterThanOrEqual(1);

    // Footer should be present
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    // DashboardView content should be present
    expect(screen.getByText("What will you improve today?")).toBeInTheDocument();
  });

  it("renders data storage section and shows export/restore buttons", () => {
    LocalStorageService.clearAllGuestData();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    render(<DashboardView />);

    expect(screen.getByText("Export Backup (JSON)")).toBeInTheDocument();
    expect(screen.getByText("Restore Backup")).toBeInTheDocument();
    expect(screen.getByText("Reset All Data")).toBeInTheDocument();
  });
});

