import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalStorageService } from "@/lib/storage";
import { WorkspaceService } from "@/lib/workspace/workspace-service";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return { ...actual, usePathname: () => "/dashboard" };
});

function makeQuestion(id: string, correctChoiceId: string) {
  return {
    id,
    topicId: "t1",
    topicName: "T",
    topicSlug: "t",
    subjectId: "s1",
    subjectName: "Verbal Ability",
    subjectSlug: "verbal-ability",
    questionText: "Q?",
    explanation: "E",
    difficulty: "medium" as const,
    language: "en" as const,
    choices: [
      { id: correctChoiceId, choiceLabel: "A", text: "1", isCorrect: true, order: 1 },
      { id: `${correctChoiceId}-x`, choiceLabel: "B", text: "2", isCorrect: false, order: 2 },
    ],
  };
}

function makeMistakesAttempt(attemptId: string, qIds: string[]) {
  const questions = qIds.map((id) => makeQuestion(id, `${id}-correct`));
  return {
    id: attemptId,
    title: "Career Service Professional - Mistake Drill",
    mode: "mistakes" as const,
    rules: {
      mode: "mistakes" as const,
      itemCount: questions.length,
      timeLimitMinutes: 10,
      passingScorePercentage: 80,
      allowsFlagging: false,
      hasContinuousTimer: true,
    },
    questions,
    answers: questions.map((q) => ({
      questionId: q.id,
      selectedChoiceId: `${q.id}-correct`,
      isFlagged: false,
      timeSpentSeconds: 5,
    })),
    scoreResult: {
      totalQuestions: questions.length,
      answeredCount: questions.length,
      unansweredCount: 0,
      correctCount: questions.length,
      incorrectCount: 0,
      rawScore: questions.length,
      percentageScore: 100,
      passingScorePercentage: 80,
      isPassed: true,
      timeSpentSeconds: questions.length * 5,
      subjectBreakdown: [],
      topicBreakdown: [],
      strengths: [],
      weakAreas: [],
      recommendedTopics: [],
    },
    completedAt: new Date().toISOString(),
  };
}

describe("SRS clean-slate marker", () => {
  beforeEach(() => {
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
  });

  it("starts unset on a fresh account", () => {
    expect(LocalStorageService.getSrsLastClearedDate()).toBeNull();
    expect(LocalStorageService.isSrsClearedToday()).toBe(false);
  });

  it("does not fire for a user who never had reviews (empty bank)", () => {
    // A perfect quick test with an empty mistake bank must not grant Clean slate.
    const attempt = makeMistakesAttempt("a-empty", []);
    LocalStorageService.recordCompletedAttempt(attempt);
    expect(LocalStorageService.getMistakeBank().length).toBe(0);
    expect(LocalStorageService.isSrsClearedToday()).toBe(false);
  });

  it("marks today after clearing every due review in a mistakes drill", () => {
    // Seed two mistakes by failing a quick attempt first.
    const seedQ = makeQuestion("m-1", "m-1-c");
    const seedQ2 = makeQuestion("m-2", "m-2-c");
    LocalStorageService.recordCompletedAttempt({
      id: "seed-fail",
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
      questions: [seedQ, seedQ2],
      answers: [
        { questionId: "m-1", selectedChoiceId: "m-1-x", isFlagged: false, timeSpentSeconds: 3 },
        { questionId: "m-2", selectedChoiceId: "m-2-x", isFlagged: false, timeSpentSeconds: 3 },
      ],
      scoreResult: {
        totalQuestions: 2,
        answeredCount: 2,
        unansweredCount: 0,
        correctCount: 0,
        incorrectCount: 2,
        rawScore: 0,
        percentageScore: 0,
        passingScorePercentage: 80,
        isPassed: false,
        timeSpentSeconds: 6,
        subjectBreakdown: [],
        topicBreakdown: [],
        strengths: [],
        weakAreas: [],
        recommendedTopics: [],
      },
      completedAt: new Date().toISOString(),
    });
    expect(LocalStorageService.getDueMistakes().length).toBe(2);

    // Now ace the mistakes drill: every item promotes and nothing stays due.
    LocalStorageService.recordCompletedAttempt(makeMistakesAttempt("drill-clear", ["m-1", "m-2"]));
    expect(LocalStorageService.getDueMistakes().length).toBe(0);
    expect(LocalStorageService.isSrsClearedToday()).toBe(true);
  });
});

describe("recordDailyActivity streak guard", () => {
  beforeEach(() => {
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
  });

  it("does not extend a streak when the day was already recorded", () => {
    const first = LocalStorageService.recordDailyActivity();
    const second = LocalStorageService.recordDailyActivity();
    expect(second.currentStreak).toBe(first.currentStreak);
    expect(second.activeDates.filter((d) => d === first.lastActiveDate).length).toBe(1);
  });
});
