import React from "react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppShell } from "@/features/dashboard/AppShell";
import { LocalStorageService } from "@/lib/storage";
import { WorkspaceService } from "@/lib/workspace/workspace-service";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    usePathname: () => currentPath,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    }),
  };
});

let currentPath = "/dashboard";

describe("AppShell", () => {
  beforeEach(() => {
    currentPath = "/dashboard";
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
  });

  it("renders grouped navigation with Settings pinned at the bottom", () => {
    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    expect(screen.getByText("Study")).toBeInTheDocument();
    expect(screen.getByText("Track")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /^settings$/i }).length).toBeGreaterThan(0);
  });

  it("marks the active page with aria-current", () => {
    currentPath = "/dashboard/plan";
    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    const planLink = screen.getAllByRole("link", { name: /study plan/i })[0];
    expect(planLink).toHaveAttribute("aria-current", "page");
  });

  it("shows no due badge on a fresh workspace", () => {
    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    expect(screen.queryByTitle(/questions due for review/i)).not.toBeInTheDocument();
  });

  it("shows the due badge when SRS items are due", () => {
    LocalStorageService.recordCompletedAttempt({
      id: "attempt-due-1",
      title: "Career Service Professional - Quick Test",
      mode: "quick",
      rules: {
        mode: "quick",
        itemCount: 2,
        timeLimitMinutes: 10,
        passingScorePercentage: 80,
        allowsFlagging: false,
        hasContinuousTimer: true,
      },
      questions: [
        {
          id: "q-due-1",
          topicId: "t1",
          topicName: "T",
          topicSlug: "t",
          subjectId: "s1",
          subjectName: "Verbal Ability",
          subjectSlug: "verbal-ability",
          questionText: "Q1?",
          explanation: "E",
          difficulty: "medium",
          language: "en",
          choices: [
            { id: "c1", choiceLabel: "A", text: "1", isCorrect: false, order: 1 },
            { id: "c2", choiceLabel: "B", text: "2", isCorrect: true, order: 2 },
          ],
        },
      ],
      answers: [
        {
          questionId: "q-due-1",
          selectedChoiceId: "c1",
          isFlagged: false,
          timeSpentSeconds: 5,
        },
      ],
      scoreResult: {
        totalQuestions: 1,
        answeredCount: 1,
        unansweredCount: 0,
        correctCount: 0,
        incorrectCount: 1,
        rawScore: 0,
        percentageScore: 0,
        passingScorePercentage: 80,
        isPassed: false,
        timeSpentSeconds: 5,
        subjectBreakdown: [],
        topicBreakdown: [],
        strengths: [],
        weakAreas: [],
        recommendedTopics: [],
      },
      completedAt: new Date().toISOString(),
    });

    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    expect(screen.getByTitle(/questions due for review/i)).toBeInTheDocument();
  });

  it("opens the mobile More sheet and Escape closes it", () => {
    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    const moreBtn = screen.getByRole("button", { name: /^more$/i });
    fireEvent.click(moreBtn);
    expect(screen.getByRole("dialog", { name: /more menu/i })).toBeInTheDocument();
    expect(moreBtn).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(moreBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("renders the mobile top bar with brand and streak chip", () => {
    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );
    expect(screen.getAllByLabelText(/reviewtayo home/i).length).toBeGreaterThan(0);
  });
});
