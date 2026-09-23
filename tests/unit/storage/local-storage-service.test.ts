// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageService, STORAGE_KEYS } from "@/lib/storage";
import type { ActiveExamSessionDraft, StoredAttemptDetails } from "@/lib/storage";
import type { EngineQuestion } from "@/features/exam-engine";

const mockQuestion: EngineQuestion = {
  id: "q-test-1",
  topicId: "top-1",
  topicName: "Vocabulary",
  topicSlug: "vocabulary",
  subjectId: "sub-verbal",
  subjectName: "Verbal Ability",
  subjectSlug: "verbal-ability",
  questionText: "What is the synonym of Benevolent?",
  explanation: "Benevolent means kind and helpful.",
  difficulty: "easy",
  language: "en",
  choices: [
    { id: "c1", choiceLabel: "A", text: "Kind", isCorrect: true, order: 0 },
    { id: "c2", choiceLabel: "B", text: "Cruel", isCorrect: false, order: 1 },
  ],
};

const mockQuestion2: EngineQuestion = {
  id: "q-test-2",
  topicId: "top-2",
  topicName: "Arithmetic",
  topicSlug: "arithmetic",
  subjectId: "sub-numerical",
  subjectName: "Numerical Ability",
  subjectSlug: "numerical-ability",
  questionText: "What is 15% of 200?",
  explanation: "0.15 * 200 = 30.",
  difficulty: "medium",
  language: "en",
  choices: [
    { id: "c3", choiceLabel: "A", text: "30", isCorrect: true, order: 0 },
    { id: "c4", choiceLabel: "B", text: "25", isCorrect: false, order: 1 },
  ],
};

describe("LocalStorageService — Guest Offline Storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    LocalStorageService.resetMigrationForTesting();
  });

  describe("Active Exam Session Drafts (Auto-Save & Resumption)", () => {
    it("saves, retrieves, and clears an active exam draft", () => {
      const draft: ActiveExamSessionDraft = {
        id: "draft-1",
        levelSlug: "professional",
        mode: "quick",
        title: "CSE Professional — Quick Test",
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
        questions: [mockQuestion],
        answers: {
          "q-test-1": {
            questionId: "q-test-1",
            selectedChoiceId: "c1",
            isFlagged: true,
            timeSpentSeconds: 15,
          },
        },
        flaggedQuestionIds: ["q-test-1"],
        currentQuestionIndex: 0,
        remainingSeconds: 585,
        startedAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
      };

      expect(LocalStorageService.getActiveDraft("professional", "quick")).toBeNull();

      const saved = LocalStorageService.saveActiveDraft(draft);
      expect(saved).toBe(true);

      const retrieved = LocalStorageService.getActiveDraft("professional", "quick");
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe("draft-1");
      expect(retrieved?.answers["q-test-1"].selectedChoiceId).toBe("c1");
      expect(retrieved?.remainingSeconds).toBe(585);

      LocalStorageService.clearActiveDraft("professional", "quick");
      expect(LocalStorageService.getActiveDraft("professional", "quick")).toBeNull();
    });
  });

  describe("Completed Attempts, History & Mistake Bank", () => {
    it("records a completed attempt, updates history, and auto-populates mistake bank", () => {
      const attempt: StoredAttemptDetails = {
        id: "att-100",
        title: "Quick Test",
        mode: "quick",
        rules: {
          mode: "quick",
          itemCount: 2,
          timeLimitMinutes: 10,
          passingScorePercentage: 80,
          allowsFlagging: true,
          hasContinuousTimer: true,
          subjectDistribution: {},
          difficultyDistribution: {},
        },
        questions: [mockQuestion, mockQuestion2],
        answers: [
          { questionId: "q-test-1", selectedChoiceId: "c1", isFlagged: false, timeSpentSeconds: 10 },
          { questionId: "q-test-2", selectedChoiceId: "c4", isFlagged: false, timeSpentSeconds: 20 }, // INCORRECT!
        ],
        scoreResult: {
          totalQuestions: 2,
          answeredCount: 2,
          unansweredCount: 0,
          correctCount: 1,
          incorrectCount: 1,
          rawScore: 1,
          percentageScore: 50,
          isPassed: false,
          passingScorePercentage: 80,
          timeSpentSeconds: 30,
          subjectBreakdown: [
            {
              subjectId: "sub-verbal",
              subjectName: "Verbal Ability",
              total: 1,
              correct: 1,
              percentage: 100,
            },
            {
              subjectId: "sub-numerical",
              subjectName: "Numerical Ability",
              total: 1,
              correct: 0,
              percentage: 0,
            },
          ],
          topicBreakdown: [],
          strengths: ["top-1"],
          weakAreas: ["top-2"],
          recommendedTopics: [],
        },
        completedAt: new Date().toISOString(),
      };

      LocalStorageService.recordCompletedAttempt(attempt);

      // Verify History
      const history = LocalStorageService.getAttemptHistory();
      expect(history.length).toBe(1);
      expect(history[0].id).toBe("att-100");
      expect(history[0].percentage).toBe(50);
      expect(history[0].passed).toBe(false);

      // Verify Attempt Details
      const details = LocalStorageService.getAttemptDetails("att-100");
      expect(details?.id).toBe("att-100");
      expect(details?.scoreResult.rawScore).toBe(1);

      // Verify Mistake Bank: question 2 was answered incorrectly (c4 instead of c3)
      const mistakes = LocalStorageService.getMistakeBank();
      expect(mistakes.length).toBe(1);
      expect(mistakes[0].id).toBe("q-test-2");
      expect(mistakes[0].selectedChoiceId).toBe("c4");
      expect(mistakes[0].correctChoiceId).toBe("c3");

      // Verify Mistake triage
      LocalStorageService.removeMistake("q-test-2");
      expect(LocalStorageService.getMistakeBank().length).toBe(0);
    });

    it("calculates dynamic subject readiness from recorded attempts", () => {
      const attempt: StoredAttemptDetails = {
        id: "att-200",
        title: "Test",
        mode: "quick",
        rules: {
          mode: "quick",
          itemCount: 2,
          timeLimitMinutes: 10,
          passingScorePercentage: 80,
          allowsFlagging: true,
          hasContinuousTimer: true,
          subjectDistribution: {},
          difficultyDistribution: {},
        },
        questions: [mockQuestion, mockQuestion2],
        answers: [],
        scoreResult: {
          totalQuestions: 2,
          answeredCount: 2,
          unansweredCount: 0,
          correctCount: 1,
          incorrectCount: 1,
          rawScore: 1,
          percentageScore: 50,
          isPassed: false,
          passingScorePercentage: 80,
          timeSpentSeconds: 40,
          subjectBreakdown: [
            {
              subjectId: "sub-verbal",
              subjectName: "Verbal Ability",
              total: 1,
              correct: 1,
              percentage: 100,
            },
            {
              subjectId: "sub-numerical",
              subjectName: "Numerical Ability",
              total: 1,
              correct: 0,
              percentage: 0,
            },
          ],
          topicBreakdown: [],
          strengths: [],
          weakAreas: [],
          recommendedTopics: [],
        },
        completedAt: new Date().toISOString(),
      };

      LocalStorageService.recordCompletedAttempt(attempt);

      const readiness = LocalStorageService.getSubjectReadiness();
      const verbal = readiness.find((r) => r.subjectSlug === "verbal-ability");
      const numerical = readiness.find((r) => r.subjectSlug === "numerical-ability");

      expect(verbal).toBeDefined();
      expect(verbal?.questionsAnswered).toBe(1);
      expect(verbal?.accuracyPercentage).toBe(100);

      expect(numerical).toBeDefined();
      expect(numerical?.questionsAnswered).toBe(1);
      expect(numerical?.accuracyPercentage).toBe(0);
    });
  });

  describe("Bookmarks Management", () => {
    it("toggles bookmarks and preserves full question payloads", () => {
      expect(LocalStorageService.isBookmarked("q-test-1")).toBe(false);

      // Add bookmark
      const status1 = LocalStorageService.toggleBookmark(mockQuestion);
      expect(status1).toBe(true);
      expect(LocalStorageService.isBookmarked("q-test-1")).toBe(true);

      const bookmarks = LocalStorageService.getBookmarks();
      expect(bookmarks.length).toBe(1);
      expect(bookmarks[0].question.questionText).toContain("Benevolent");

      // Toggle off
      const status2 = LocalStorageService.toggleBookmark(mockQuestion);
      expect(status2).toBe(false);
      expect(LocalStorageService.isBookmarked("q-test-1")).toBe(false);
      expect(LocalStorageService.getBookmarks().length).toBe(0);
    });
  });

  describe("Study Streak Tracking", () => {
    it("records daily activity and advances streak appropriately", () => {
      const streak = LocalStorageService.recordDailyActivity();
      expect(streak.currentStreak).toBe(1);
      expect(streak.activeDates.length).toBe(1);

      // Recording again on the same day does not duplicate
      const sameDayStreak = LocalStorageService.recordDailyActivity();
      expect(sameDayStreak.currentStreak).toBe(1);
      expect(sameDayStreak.activeDates.length).toBe(1);
    });
  });

  describe("Backup, Restore & Privacy Reset", () => {
    it("exports all guest progress into valid JSON and restores it", () => {
      LocalStorageService.toggleBookmark(mockQuestion);
      const json = LocalStorageService.exportAllDataAsJson();
      expect(typeof json).toBe("string");

      const parsed = JSON.parse(json);
      expect(parsed.version).toBe(2);
      expect(parsed.bookmarks.length).toBe(1);

      // Clear local storage
      LocalStorageService.clearAllGuestData();
      expect(LocalStorageService.getBookmarks().length).toBe(0);

      // Restore from backup
      const res = LocalStorageService.importDataFromJson(json);
      expect(res.success).toBe(true);
      expect(LocalStorageService.getBookmarks().length).toBe(1);
    });

    it("handles malformed backup JSON safely", () => {
      const res1 = LocalStorageService.importDataFromJson("invalid-json");
      expect(res1.success).toBe(false);

      const res2 = LocalStorageService.importDataFromJson(JSON.stringify({ version: 99 }));
      expect(res2.success).toBe(false);
    });
  });

  describe("Legacy Keys Backward Compatibility Migration", () => {
    it("automatically migrates legacy keys into modern namespaced storage", () => {
      // Setup legacy storage entries
      window.localStorage.setItem(
        STORAGE_KEYS.LEGACY_HISTORY,
        JSON.stringify([
          {
            id: "legacy-att-1",
            title: "Legacy Exam",
            mode: "quick",
            percentage: 90,
            passed: true,
            date: "2026-09-01T00:00:00.000Z",
          },
        ])
      );

      window.localStorage.setItem(
        STORAGE_KEYS.LEGACY_MISTAKES,
        JSON.stringify([mockQuestion2])
      );

      // Trigger migration by reading history
      const history = LocalStorageService.getAttemptHistory();
      expect(history.length).toBe(1);
      expect(history[0].id).toBe("legacy-att-1");
      expect(history[0].percentage).toBe(90);

      const mistakes = LocalStorageService.getMistakeBank();
      expect(mistakes.length).toBe(1);
      expect(mistakes[0].id).toBe("q-test-2");
    });
  });

  describe("LRU Eviction & Sanitized Backup Import", () => {
    it("evicts detailed records beyond MAX_DETAILED_ATTEMPTS (20) while preserving history summaries", () => {
      // Record 25 attempts
      for (let i = 1; i <= 25; i++) {
        const attempt: StoredAttemptDetails = {
          id: `att-lru-${i}`,
          title: `Exam #${i}`,
          mode: "quick",
          rules: {
            mode: "quick",
            itemCount: 1,
            timeLimitMinutes: 10,
            passingScorePercentage: 80,
            allowsFlagging: true,
            hasContinuousTimer: true,
          },
          questions: [mockQuestion],
          answers: [{ questionId: "q-test-1", selectedChoiceId: "c1", isFlagged: false, timeSpentSeconds: 10 }],
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
            timeSpentSeconds: 10,
            subjectBreakdown: [],
            topicBreakdown: [],
            strengths: [],
            weakAreas: [],
            recommendedTopics: [],
          },
          completedAt: new Date(Date.now() + i * 1000).toISOString(),
        };
        LocalStorageService.recordCompletedAttempt(attempt);
      }

      // History summaries should have all 25
      const history = LocalStorageService.getAttemptHistory();
      expect(history.length).toBe(25);

      // The most recent 20 (att-lru-25 down to att-lru-6) should have full details
      expect(LocalStorageService.getAttemptDetails("att-lru-25")).not.toBeNull();
      expect(LocalStorageService.getAttemptDetails("att-lru-6")).not.toBeNull();

      // The older 5 (att-lru-1 to att-lru-5) should be evicted from detailed storage
      expect(LocalStorageService.getAttemptDetails("att-lru-1")).toBeNull();
      expect(LocalStorageService.getAttemptDetails("att-lru-5")).toBeNull();
    });

    it("sanitizes imported backup payloads against prototype pollution keys", () => {
      const maliciousJson = JSON.stringify({
        version: 1,
        history: [{ id: "safe-1", title: "Safe", mode: "quick", percentage: 80, passed: true, date: "2026-09-09" }],
        attempts: {
          "__proto__": { malicious: true },
          "safe-1": { id: "safe-1", title: "Safe" },
        },
      });

      const res = LocalStorageService.importDataFromJson(maliciousJson);
      expect(res.success).toBe(true);

      // Verify __proto__ was not written to storage keys
      expect(window.localStorage.getItem("cse_guest_attempt___proto__")).toBeNull();
      expect(LocalStorageService.getAttemptDetails("safe-1")).not.toBeNull();
    });
  });

  describe("Leitner Spaced Repetition (SRS) & Target Exam Countdown", () => {
    it("initializes mistake items with Leitner Box 1 and immediately due status", () => {
      const attempt: StoredAttemptDetails = {
        id: "att-srs-1",
        title: "CSE Professional — Diagnostic",
        mode: "quick",
        rules: {
          mode: "quick",
          itemCount: 1,
          timeLimitMinutes: 10,
          passingScorePercentage: 80,
          allowsFlagging: true,
          hasContinuousTimer: true,
        },
        questions: [mockQuestion],
        answers: [
          { questionId: mockQuestion.id, selectedChoiceId: "c2", isFlagged: false, timeSpentSeconds: 20 },
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
          timeSpentSeconds: 20,
          subjectBreakdown: [],
          topicBreakdown: [],
          strengths: [],
          weakAreas: ["Verbal Ability"],
          recommendedTopics: [],
        },
        completedAt: new Date().toISOString(),
      };

      LocalStorageService.recordCompletedAttempt(attempt);

      const mistakes = LocalStorageService.getMistakeBank();
      expect(mistakes.length).toBe(1);
      expect(mistakes[0].box).toBe(1);
      expect(mistakes[0].consecutiveCorrect).toBe(0);
      expect(mistakes[0].nextReviewDue).toBeDefined();

      const due = LocalStorageService.getDueMistakes();
      expect(due.length).toBe(1);
      expect(due[0].id).toBe(mockQuestion.id);
    });

    it("progresses Leitner boxes when answered correctly and resets to Box 1 on error", () => {
      // Seed a mistake
      window.localStorage.setItem(
        STORAGE_KEYS.MISTAKES,
        JSON.stringify([
          {
            id: mockQuestion.id,
            question: mockQuestion,
            attemptId: "att-1",
            addedAt: new Date().toISOString(),
            reviewCount: 1,
            box: 1,
            consecutiveCorrect: 0,
          },
        ])
      );

      // 1. Correct answer promotes to Box 2
      const step1 = LocalStorageService.updateMistakeSRS(mockQuestion.id, true);
      expect(step1?.box).toBe(2);
      expect(step1?.consecutiveCorrect).toBe(1);

      // 2. Another correct answer promotes to Box 3
      const step2 = LocalStorageService.updateMistakeSRS(mockQuestion.id, true);
      expect(step2?.box).toBe(3);
      expect(step2?.consecutiveCorrect).toBe(2);

      // 3. An incorrect answer demotes back to Box 1
      const step3 = LocalStorageService.updateMistakeSRS(mockQuestion.id, false);
      expect(step3?.box).toBe(1);
      expect(step3?.consecutiveCorrect).toBe(0);

      // 4. Mark mastered directly sets Box 5
      LocalStorageService.markMistakeMastered(mockQuestion.id);
      const stats = LocalStorageService.getMistakeStats();
      expect(stats.byBox[5]).toBe(1);
      expect(stats.masteredCount).toBe(1);
      expect(stats.dueCount).toBe(0);
    });

    it("saves and retrieves Target Exam configuration and tracks daily questions answered", () => {
      const initialConfig = LocalStorageService.getTargetExamConfig();
      expect(initialConfig.targetDate).toBeDefined();
      expect(initialConfig.dailyGoal).toBe(25);

      LocalStorageService.saveTargetExamConfig({
        targetDate: "2027-03-21",
        examName: "March 2027 CSE-PPT",
        dailyGoal: 30,
      });

      const updated = LocalStorageService.getTargetExamConfig();
      expect(updated.targetDate).toBe("2027-03-21");
      expect(updated.examName).toBe("March 2027 CSE-PPT");
      expect(updated.dailyGoal).toBe(30);

      expect(LocalStorageService.getDailyQuestionsAnswered()).toBe(0);
      LocalStorageService.addDailyQuestionsAnswered(10);
      expect(LocalStorageService.getDailyQuestionsAnswered()).toBe(10);
      LocalStorageService.addDailyQuestionsAnswered(15);
      expect(LocalStorageService.getDailyQuestionsAnswered()).toBe(25);
    });
  });
});


