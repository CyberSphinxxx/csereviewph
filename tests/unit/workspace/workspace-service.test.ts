import { describe, it, expect, beforeEach } from "vitest";
import { WorkspaceService } from "@/lib/workspace/workspace-service";
import { LocalStorageService } from "@/lib/storage/local-storage-service";
import type { StoredAttemptDetails } from "@/lib/storage/types";

describe("WorkspaceService & Storage Isolation", () => {
  beforeEach(() => {
    LocalStorageService.clearAllGuestData();
  });

  it("returns empty when no workspaces exist", () => {
    expect(WorkspaceService.getAllWorkspaces()).toEqual([]);
    expect(WorkspaceService.getCurrentWorkspace()).toBeNull();
  });

  it("creates a new CSE workspace and activates it", () => {
    const ws = WorkspaceService.createWorkspace({
      examId: "cse",
      levelId: "professional",
      targetExamDate: "2027-03-14",
    });

    expect(ws.id).toBe("workspace_cse");
    expect(ws.examId).toBe("cse");
    expect(ws.levelId).toBe("professional");
    expect(ws.trackName).toBe("Professional");

    const current = WorkspaceService.getCurrentWorkspace();
    expect(current?.id).toBe(ws.id);
  });

  it("creates a second workspace for LET and switches between them cleanly", () => {
    const cseWs = WorkspaceService.createWorkspace({
      examId: "cse",
      levelId: "professional",
    });

    const letWs = WorkspaceService.createWorkspace({
      examId: "let",
      levelId: "secondary",
      targetExamDate: "2027-09-26",
    });

    expect(letWs.examId).toBe("let");
    expect(letWs.levelId).toBe("secondary");
    expect(letWs.trackName).toBe("Secondary");

    // LET is now current
    expect(WorkspaceService.getCurrentWorkspace()?.id).toBe(letWs.id);

    // Switch back to CSE
    WorkspaceService.setCurrentWorkspace(cseWs.id);
    expect(WorkspaceService.getCurrentWorkspace()?.id).toBe(cseWs.id);
  });

  it("strictly isolates attempt history between different exam workspaces", () => {
    const cseWs = WorkspaceService.createWorkspace({
      examId: "cse",
      levelId: "professional",
    });

    const letWs = WorkspaceService.createWorkspace({
      examId: "let",
      levelId: "secondary",
    });

    // 1. Record attempt in CSE
    const cseAttempt: StoredAttemptDetails = {
      id: "att-cse-1",
      title: "CSE Professional Quick Drill",
      mode: "quick",
      rules: {
        mode: "quick",
        itemCount: 1,
        timeLimitMinutes: 10,
        passingScorePercentage: 80,
        allowsFlagging: true,
        hasContinuousTimer: true,
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
        passingScorePercentage: 80,
        isPassed: true,
        timeSpentSeconds: 20,
        subjectBreakdown: [
          {
            subjectId: "sub-pro-numerical",
            subjectName: "Numerical Ability",
            total: 1,
            correct: 1,
            percentage: 100,
          },
        ],
        topicBreakdown: [],
        strengths: [],
        weakAreas: [],
        recommendedTopics: [],
      },
      completedAt: new Date().toISOString(),
    };

    WorkspaceService.setCurrentWorkspace(cseWs.id);
    LocalStorageService.recordCompletedAttempt(cseAttempt, cseWs.id);

    // CSE history has 1 attempt
    expect(LocalStorageService.getAttemptHistory(cseWs.id).length).toBe(1);
    expect(LocalStorageService.getAttemptHistory(cseWs.id)[0].title).toBe("CSE Professional Quick Drill");

    // LET history is completely empty (0 leak)
    expect(LocalStorageService.getAttemptHistory(letWs.id).length).toBe(0);

    // 2. Record attempt in LET
    const letAttempt: StoredAttemptDetails = {
      ...cseAttempt,
      id: "att-let-1",
      title: "LET General Education Drill",
      scoreResult: {
        ...cseAttempt.scoreResult,
        subjectBreakdown: [
          {
            subjectId: "sub-let-gened",
            subjectName: "General Education",
            total: 1,
            correct: 1,
            percentage: 100,
          },
        ],
      },
    };

    WorkspaceService.setCurrentWorkspace(letWs.id);
    LocalStorageService.recordCompletedAttempt(letAttempt, letWs.id);

    // LET history has 1 attempt
    expect(LocalStorageService.getAttemptHistory(letWs.id).length).toBe(1);
    expect(LocalStorageService.getAttemptHistory(letWs.id)[0].title).toBe("LET General Education Drill");

    // CSE history STILL has 1 attempt (the original CSE one)
    expect(LocalStorageService.getAttemptHistory(cseWs.id).length).toBe(1);
    expect(LocalStorageService.getAttemptHistory(cseWs.id)[0].id).toBe("att-cse-1");
  });

  it("strictly isolates bookmarks and mistakes between workspaces", () => {
    const cseWs = WorkspaceService.createWorkspace({ examId: "cse" });
    const letWs = WorkspaceService.createWorkspace({ examId: "let" });

    // Bookmark in CSE
    WorkspaceService.setCurrentWorkspace(cseWs.id);
    LocalStorageService.toggleBookmark(
      {
        id: "q-cse-1",
        topicId: "top-num-1",
        topicName: "Number Series",
        topicSlug: "number-series",
        subjectId: "sub-pro-numerical",
        subjectName: "Numerical Ability",
        subjectSlug: "numerical-ability",
        questionText: "What comes next in 2, 4, 8, ...?",
        explanation: "Powers of 2",
        difficulty: "easy",
        language: "en",
        choices: [],
      },
      undefined,
      cseWs.id
    );

    expect(LocalStorageService.isBookmarked("q-cse-1", cseWs.id)).toBe(true);
    expect(LocalStorageService.isBookmarked("q-cse-1", letWs.id)).toBe(false);
  });

  it("preserves global study streak across all workspaces", () => {
    const cseWs = WorkspaceService.createWorkspace({ examId: "cse" });
    const letWs = WorkspaceService.createWorkspace({ examId: "let" });

    WorkspaceService.setCurrentWorkspace(cseWs.id);
    LocalStorageService.recordDailyCheckIn();
    const streakAfterCse = LocalStorageService.getStudyStreak();
    expect(streakAfterCse.checkInDates?.length).toBeGreaterThanOrEqual(1);

    // Switch to LET — global streak is retained
    WorkspaceService.setCurrentWorkspace(letWs.id);
    const streakInLet = LocalStorageService.getStudyStreak();
    expect(streakInLet.checkInDates).toEqual(streakAfterCse.checkInDates);
  });

  it("handles workspace removal and switches to remaining workspace", () => {
    const cseWs = WorkspaceService.createWorkspace({ examId: "cse" });
    const letWs = WorkspaceService.createWorkspace({ examId: "let" });

    WorkspaceService.setCurrentWorkspace(letWs.id);

    // Remove active LET workspace
    const { nextWorkspace } = WorkspaceService.removeWorkspace(letWs.id);
    expect(nextWorkspace?.id).toBe(cseWs.id);
    expect(WorkspaceService.getCurrentWorkspace()?.id).toBe(cseWs.id);

    // Remove final CSE workspace
    const finalResult = WorkspaceService.removeWorkspace(cseWs.id);
    expect(finalResult.nextWorkspace).toBeNull();
    expect(WorkspaceService.getCurrentWorkspace()).toBeNull();
  });
});
