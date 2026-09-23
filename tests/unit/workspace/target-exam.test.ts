import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocalStorageService } from "@/lib/storage";
import { WorkspaceService } from "@/lib/workspace/workspace-service";
import {
  getTargetExamSummary,
  saveTargetExamSummary,
} from "@/lib/workspace/target-exam";

describe("target exam single source of truth", () => {
  beforeEach(() => {
    window.localStorage.clear();
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("returns null for a brand-new visitor with no exam chosen", () => {
    // "No exam chosen" is a first-class state: nothing is fabricated.
    expect(getTargetExamSummary()).toBeNull();
  });

  it("saveTargetExamSummary is a no-op when no exam is chosen", () => {
    expect(saveTargetExamSummary({ targetDate: "2027-08-08" })).toBeNull();
    expect(getTargetExamSummary()).toBeNull();
  });

  it("writes through both preferences and workspace storage after an exam is chosen", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    saveTargetExamSummary({
      targetDate: "2027-08-08",
      examName: "August 2027 CSE-PPT",
      dailyGoal: 40,
    });

    const summary = getTargetExamSummary();
    expect(summary).not.toBeNull();
    expect(summary!.targetDate).toBe("2027-08-08");
    expect(summary!.examName).toBe("August 2027 CSE-PPT");
    expect(summary!.dailyGoal).toBe(40);
    expect(summary!.examId).toBe("cse");

    const rawPrefs = JSON.parse(window.localStorage.getItem("csereviewph_user_preferences_v1")!);
    expect(rawPrefs.study.targetDate).toBe("2027-08-08");
    expect(rawPrefs.study.targetExamName).toBe("August 2027 CSE-PPT");
    expect(rawPrefs.study.dailyGoal).toBe(40);

    const wsConfig = LocalStorageService.getTargetExamConfig();
    expect(wsConfig.targetDate).toBe("2027-08-08");
    expect(wsConfig.dailyGoal).toBe(40);
  });

  it("reads back the same values it wrote", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    saveTargetExamSummary({ targetDate: "2027-08-08", dailyGoal: 30 });

    const summary = getTargetExamSummary();
    expect(summary).not.toBeNull();
    expect(summary!.targetDate).toBe("2027-08-08");
    expect(summary!.dailyGoal).toBe(30);
    expect(summary!.examName).toBeTruthy();
  });

  it("clamps daily goal into the 5-200 range", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    const saved = saveTargetExamSummary({ dailyGoal: 9999 });
    expect(saved).not.toBeNull();
    expect(saved!.dailyGoal).toBe(200);
    const saved2 = saveTargetExamSummary({ dailyGoal: 0 });
    expect(saved2!.dailyGoal).toBe(5);
  });

  it("does not resurrect removed workspaces", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    expect(getTargetExamSummary()!.workspaceId).toBe("workspace_cse");
  });
});
