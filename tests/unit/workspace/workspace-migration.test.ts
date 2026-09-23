import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageService, STORAGE_KEYS } from "@/lib/storage/local-storage-service";
import { WorkspaceService } from "@/lib/workspace/workspace-service";

describe("Workspace Idempotent Migration", () => {
  beforeEach(() => {
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
  });

  it("automatically creates a CSE workspace for users with existing CSE attempts history", () => {
    // Simulate pre-existing CSE history
    window.localStorage.setItem(
      STORAGE_KEYS.HISTORY,
      JSON.stringify([
        {
          id: "att-legacy-1",
          title: "Career Service Professional Quick Drill",
          mode: "quick",
          percentage: 90,
          rawScore: 9,
          totalQuestions: 10,
          passed: true,
          date: "2026-09-10T12:00:00.000Z",
        },
      ])
    );

    // Simulate pre-existing CSE target date
    window.localStorage.setItem(
      STORAGE_KEYS.TARGET_EXAM,
      JSON.stringify({
        targetDate: "2027-03-14",
        examName: "March 2027 CSE-PPT",
        dailyGoal: 30,
      })
    );

    // Run migration
    LocalStorageService.runMigration();

    const workspaces = WorkspaceService.getAllWorkspaces();
    expect(workspaces.length).toBe(1);

    const cseWs = workspaces[0];
    expect(cseWs.id).toBe("workspace_cse");
    expect(cseWs.examId).toBe("cse");
    expect(cseWs.levelId).toBe("professional");
    expect(cseWs.trackName).toBe("Professional");
    expect(cseWs.targetExamDate).toBe("2027-03-14");
    expect(cseWs.dailyGoal).toBe(30);

    // Current workspace is active
    expect(WorkspaceService.getCurrentWorkspace()?.id).toBe("workspace_cse");
  });

  it("does NOT provision from preferences alone (an exam must be chosen)", () => {
    // A visitor who only ever touched Settings (theme, level, goal) never
    // chose an exam through the picker. Default-valued prefs are
    // indistinguishable from no choice, so prefs alone must not fabricate one.
    window.localStorage.setItem(
      "csereviewph_user_preferences_v1",
      JSON.stringify({
        version: 1,
        study: {
          levelId: "cse-professional",
          dailyGoal: 40,
        },
      })
    );

    LocalStorageService.runMigration();

    expect(WorkspaceService.getAllWorkspaces()).toEqual([]);
    expect(WorkspaceService.getCurrentWorkspace()).toBeNull();
  });

  it("infers subprofessional level from prefs when real study history justifies provisioning", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.HISTORY,
      JSON.stringify([
        {
          id: "att-legacy-sub",
          title: "Subprofessional Quick Drill",
          mode: "quick",
          percentage: 85,
          rawScore: 8,
          totalQuestions: 10,
          passed: true,
          date: "2026-09-10T12:00:00.000Z",
        },
      ])
    );
    window.localStorage.setItem(
      "csereviewph_user_preferences_v1",
      JSON.stringify({
        version: 1,
        study: {
          levelId: "cse-subprofessional",
        },
      })
    );

    LocalStorageService.runMigration();

    const current = WorkspaceService.getCurrentWorkspace();
    expect(current?.levelId).toBe("subprofessional");
    expect(current?.trackName).toBe("Subprofessional");
  });

  it("is idempotent and never duplicates the workspace on multiple migration calls", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.HISTORY,
      JSON.stringify([
        {
          id: "att-1",
          title: "Test",
          mode: "quick",
          percentage: 80,
          rawScore: 8,
          totalQuestions: 10,
          passed: true,
          date: new Date().toISOString(),
        },
      ])
    );

    LocalStorageService.runMigration();
    LocalStorageService.resetMigrationForTesting();
    LocalStorageService.runMigration();
    LocalStorageService.resetMigrationForTesting();
    LocalStorageService.runMigration();

    const workspaces = WorkspaceService.getAllWorkspaces();
    expect(workspaces.length).toBe(1);
    expect(workspaces[0].id).toBe("workspace_cse");
  });

  it("does not create workspaces for brand new visitors with zero history or data", () => {
    LocalStorageService.runMigration();

    expect(WorkspaceService.getAllWorkspaces()).toEqual([]);
    expect(WorkspaceService.getCurrentWorkspace()).toBeNull();
  });

  it("imports Version 1 legacy backups and auto-provisions a CSE workspace", () => {
    const legacyBackup = JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      history: [
        {
          id: "imported-1",
          title: "Imported Diagnostic",
          mode: "quick",
          percentage: 85,
          rawScore: 8,
          totalQuestions: 10,
          passed: true,
          date: "2026-08-01T00:00:00.000Z",
        },
      ],
      attempts: {},
      mistakeBank: [],
      bookmarks: [],
      streak: {
        currentStreak: 2,
        longestStreak: 5,
        lastActiveDate: "2026-08-01",
        activeDates: ["2026-08-01"],
      },
      targetExam: {
        targetDate: "2027-03-14",
        examName: "March 2027 CSE-PPT",
        dailyGoal: 20,
      },
    });

    const res = LocalStorageService.importDataFromJson(legacyBackup);
    expect(res.success).toBe(true);

    const workspaces = WorkspaceService.getAllWorkspaces();
    expect(workspaces.length).toBe(1);
    expect(workspaces[0].id).toBe("workspace_cse");
    expect(workspaces[0].dailyGoal).toBe(20);

    const history = LocalStorageService.getAttemptHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe("imported-1");
  });
});
