import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import LearnPage from "@/app/(app)/dashboard/learn/page";
import AchievementsPage from "@/app/(app)/dashboard/achievements/page";
import { HistoryView } from "@/features/dashboard/history/HistoryView";
import { LocalStorageService } from "@/lib/storage";
import { PreferencesService } from "@/lib/preferences";
import { WorkspaceService } from "@/lib/workspace/workspace-service";
import type { StoredAttemptDetails } from "@/lib/storage";

/** Minimal valid StoredAttemptDetails factory for storage tests. */
function makeAttempt(
  id: string,
  title: string,
  mode: string,
  percentage: number
): StoredAttemptDetails {
  return {
    id,
    title,
    mode,
    rules: {
      mode: mode as never,
      itemCount: 10,
      timeLimitMinutes: 10,
      passingScorePercentage: 80,
      allowsFlagging: true,
      hasContinuousTimer: true,
    },
    questions: [],
    answers: [],
    scoreResult: {
      totalQuestions: 10,
      answeredCount: 10,
      unansweredCount: 0,
      correctCount: Math.round((percentage / 100) * 10),
      incorrectCount: 10 - Math.round((percentage / 100) * 10),
      rawScore: Math.round((percentage / 100) * 10),
      percentageScore: percentage,
      passingScorePercentage: 80,
      isPassed: percentage >= 80,
      timeSpentSeconds: 300,
      subjectBreakdown: [],
      topicBreakdown: [],
      strengths: [],
      weakAreas: [],
      recommendedTopics: [],
    },
    completedAt: new Date().toISOString(),
  };
}

describe("LearnPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    LocalStorageService.clearAllGuestData();
    // The dashboard is exam-gated: content renders only once an exam is chosen.
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
  });

  it("aggregates real guides, articles, and FAQ categories", async () => {
    render(<LearnPage />);

    expect(await screen.findByRole("heading", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByText("Study guides")).toBeInTheDocument();
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByText("Common questions")).toBeInTheDocument();

    // FAQ categories come from real data
    expect(screen.getAllByText("Preparation & Review").length).toBeGreaterThan(0);

    // Links point at the existing public content routes
    const guideLinks = screen.getAllByRole("link", { name: /All study guides/i });
    expect(guideLinks[0]).toHaveAttribute("href", "/guides");
    const articleLinks = screen.getAllByRole("link", { name: /All articles/i });
    expect(articleLinks[0]).toHaveAttribute("href", "/articles");
    const faqLinks = screen.getAllByRole("link", { name: /Browse the FAQ/i });
    expect(faqLinks[0]).toHaveAttribute("href", "/faq");
  });

  it("shows an explicit coming-soon state for an exam with no materials yet", async () => {
    // Every legacy content item is CSE-scoped, so a LET workspace has none yet.
    WorkspaceService.createWorkspace({ examId: "let", levelId: "let-secondary" });
    render(<LearnPage />);

    expect(await screen.findByRole("heading", { name: "Learn" })).toBeInTheDocument();
    const soonStates = screen.getAllByText(/More materials coming soon for LET/i);
    expect(soonStates.length).toBe(3); // guides, articles, FAQ
    expect(screen.queryByText("Study guides".concat(" list"))).not.toBeInTheDocument();
  });
});

describe("AchievementsPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    PreferencesService.resetAllPreferences();
    // The dashboard is exam-gated: pick the exam, keep the stats empty.
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
  });

  it("shows every badge with zero progress for a brand-new user", async () => {
    render(<AchievementsPage />);

    expect(await screen.findByText(/0 of 14 earned/)).toBeInTheDocument();
    expect(screen.getAllByText("First test").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Earned")).toHaveLength(0);
  });

  it("marks badges earned from real stored stats", async () => {
    LocalStorageService.clearAllGuestData();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    LocalStorageService.recordCompletedAttempt(makeAttempt("attempt-a1", "Quick Diagnostic Test", "quick", 80));

    render(<AchievementsPage />);

    // first-test + first-step (a 1-day streak is recorded with the attempt)
    expect(await screen.findByText(/2 of 14 earned/)).toBeInTheDocument();
    expect(screen.getAllByText("Earned").length).toBeGreaterThan(0);
  });
});

describe("HistoryView (inside AppShell)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the empty state before any attempts exist", async () => {
    render(<HistoryView />);
    expect(await screen.findByText(/No test attempts recorded yet/i)).toBeInTheDocument();
  });

  it("lists completed attempts from real storage with links and delete", async () => {
    LocalStorageService.clearAllGuestData();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    LocalStorageService.recordCompletedAttempt(makeAttempt("attempt-h1", "Quick Diagnostic Test", "quick", 90));

    render(<HistoryView />);

    expect(await screen.findByText("Quick Diagnostic Test")).toBeInTheDocument();
    const breakdown = screen.getByRole("link", { name: /View breakdown/i });
    expect(breakdown).toHaveAttribute("href", "/results/attempt-h1");
  });

  it("renders inside the dashboard shell landmarks", async () => {
    LocalStorageService.clearAllGuestData();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    const { AppShell } = await import("@/features/dashboard/AppShell");
    const { default: MockedRouter } = await import("next/link");
    render(
      <AppShell>
        <HistoryView />
      </AppShell>
    );
    void MockedRouter;
    const nav = screen.getAllByRole("navigation", { name: "Main" });
    expect(nav.length).toBeGreaterThan(0);
    const aside = screen.getByRole("complementary", { name: "Main" });
    expect(within(aside).getByText("Target exam")).toBeInTheDocument();
    expect(within(aside).getByText("Daily goal")).toBeInTheDocument();
  });
});
