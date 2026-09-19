import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { LocalStorageService } from "@/lib/storage";
import { WorkspaceService } from "@/lib/workspace/workspace-service";

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

describe("Multi-Exam Workspace Dashboard Scalability", () => {
  it("renders distinct metadata, subjects, and isolated metrics when switching between CSE and LET", () => {
    LocalStorageService.clearAllGuestData();

    // 1. Setup CSE Workspace
    const cseWs = WorkspaceService.createWorkspace({
      examId: "cse",
      levelId: "professional",
      targetExamDate: "2027-03-14",
      targetExamName: "March 2027 CSE-PPT",
    });

    // Record a completed attempt in CSE
    LocalStorageService.recordCompletedAttempt({
      id: "att-cse-1",
      title: "Diagnostic Verbal Drill",
      mode: "quick",
      rules: {
        mode: "quick",
        itemCount: 10,
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
        totalQuestions: 10,
        answeredCount: 10,
        unansweredCount: 0,
        correctCount: 9,
        incorrectCount: 1,
        rawScore: 9,
        percentageScore: 90,
        isPassed: true,
        passingScorePercentage: 80,
        timeSpentSeconds: 150,
        subjectBreakdown: [],
        topicBreakdown: [],
        strengths: [],
        weakAreas: [],
        recommendedTopics: [],
      },
      completedAt: new Date().toISOString(),
    }, cseWs.id);

    // Render CSE Dashboard
    const { unmount } = render(<DashboardView />);

    // Verification: CSE Title Badge
    expect(screen.getByText(/Civil Service Exam.*Professional/i)).toBeInTheDocument();
    expect(screen.getByText("What will you improve today?")).toBeInTheDocument();

    // Verification: CSE Subjects
    expect(screen.getByText("Verbal Ability")).toBeInTheDocument();
    expect(screen.getByText("Numerical Ability")).toBeInTheDocument();
    expect(screen.getByText("Analytical Ability")).toBeInTheDocument();
    expect(screen.getByText("General Information")).toBeInTheDocument();

    // Verification: CSE Metrics reflect the attempt
    expect(screen.getByText("90%")).toBeInTheDocument(); // Practice accuracy
    expect(screen.getAllByText("10").length).toBeGreaterThanOrEqual(1); // Items answered
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1); // Tests completed

    unmount();
    cleanup();

    // 2. Setup LET Workspace
    const letWs = WorkspaceService.createWorkspace({
      examId: "let",
      levelId: "secondary",
      targetExamDate: "2027-09-26",
      targetExamName: "September 2027 LET",
    });
    // Set current workspace to LET
    WorkspaceService.setCurrentWorkspace(letWs.id);

    // Render LET Dashboard
    render(<DashboardView />);

    // Verification: LET Title Badge
    expect(screen.getByText(/Licensure Examination for Teachers.*Secondary/i)).toBeInTheDocument();

    // Verification: LET Subjects (from catalog)
    expect(screen.getByText("General Education")).toBeInTheDocument();
    expect(screen.getByText("Professional Education")).toBeInTheDocument();
    expect(screen.getByText("Major / Specialization")).toBeInTheDocument();

    // Verification: CSE subjects must NOT appear in LET dashboard
    expect(screen.queryByText("Verbal Ability")).not.toBeInTheDocument();
    expect(screen.queryByText("Clerical Operations")).not.toBeInTheDocument();

    // Verification: Metrics Isolation! LET has no attempts yet
    expect(screen.getAllByText("Not measured yet").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("90%")).not.toBeInTheDocument();

    // Verification: LET Calendar Card
    expect(screen.getByText("September 2027 LET")).toBeInTheDocument();

    cleanup();

    // 3. Switch back to CSE Workspace
    WorkspaceService.setCurrentWorkspace(cseWs.id);
    render(<DashboardView />);

    // Verification: CSE state restored with previous metrics
    expect(screen.getByText(/Civil Service Exam.*Professional/i)).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
    expect(screen.getAllByText("10").length).toBeGreaterThanOrEqual(1);
  });
});
