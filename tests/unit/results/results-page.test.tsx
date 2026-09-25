import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultsPage from "@/app/(app)/results/[attemptId]/page";
import { LocalStorageService } from "@/lib/storage";
import { SEED_QUESTIONS } from "@/db/seed-data";
import { calculateScore } from "@/features/exam-engine";
import type { StoredAttemptDetails } from "@/lib/storage";

// Mock next/navigation's useParams to control the attempt id per test.
const paramsMock = vi.hoisted(() => ({ attemptId: "attempt-demo" }));
vi.mock("next/navigation", () => ({
  useParams: () => paramsMock,
}));

function seedStoredAttempt(id: string): StoredAttemptDetails {
  const questions = SEED_QUESTIONS.slice(0, 5);
  const answers = questions.map((q, idx) => ({
    questionId: q.id,
    selectedChoiceId:
      idx < 3 ? q.choices.find((c) => c.isCorrect)?.id || null : "wrong-choice",
    isFlagged: false,
    timeSpentSeconds: 15,
  }));
  return {
    id,
    title: "Career Service Professional — Quick Diagnostic Test",
    mode: "quick",
    rules: {
      mode: "quick",
      itemCount: questions.length,
      timeLimitMinutes: 10,
      passingScorePercentage: 80,
      allowsFlagging: true,
      hasContinuousTimer: true,
      subjectDistribution: {},
      difficultyDistribution: {},
    },
    questions,
    answers,
    scoreResult: calculateScore(questions, answers, 80, 300),
    completedAt: new Date().toISOString(),
  } as unknown as StoredAttemptDetails;
}

describe("Results page — honest missing-attempt state (audit A03)", () => {
  beforeEach(() => {
    localStorage.clear();
    paramsMock.attemptId = "attempt-demo";
  });

  it("shows the real stored attempt when details exist locally", async () => {
    LocalStorageService.recordCompletedAttempt(
      seedStoredAttempt("attempt-demo") as never
    );

    render(<ResultsPage />);

    expect(
      await screen.findByText("Estimated Score", {}, { timeout: 3000 })
    ).toBeInTheDocument();
    // No fabricated-score notice anywhere
    expect(screen.queryByText(/Result not available/i)).not.toBeInTheDocument();
  });

  it("never fabricates a score for an unknown attempt id", async () => {
    paramsMock.attemptId = "audit-nonexistent-attempt";

    render(<ResultsPage />);

    expect(
      await screen.findByText(/Result not available on this device/i)
    ).toBeInTheDocument();
    expect(screen.queryByText("Estimated Score")).not.toBeInTheDocument();
    expect(screen.queryByText(/Estimated score of/i)).not.toBeInTheDocument();
    // Honest-state navigation is present
    expect(screen.getByText(/Open attempt history/i)).toBeInTheDocument();
  });

  it("explains that a missing result is never replaced by an estimate", async () => {
    paramsMock.attemptId = "audit-nonexistent-attempt";

    render(<ResultsPage />);

    expect(
      await screen.findByText(/never show an estimated score/i)
    ).toBeInTheDocument();
  });
});
