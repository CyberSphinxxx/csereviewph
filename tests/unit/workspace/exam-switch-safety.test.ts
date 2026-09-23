import { beforeEach, describe, expect, it } from "vitest";
import { LocalStorageService, NotesService } from "@/lib/storage";
import { WorkspaceService } from "@/lib/workspace/workspace-service";

/**
 * Exam-switching guarantee: switching the active workspace must never delete
 * unrelated progress. Global data (notes, streak) survives; per-workspace data
 * (history, mistakes, bookmarks) stays with its own workspace.
 */
describe("exam switching preserves unrelated progress", () => {
  beforeEach(() => {
    window.localStorage.clear();
    LocalStorageService.clearAllGuestData();
    LocalStorageService.resetMigrationForTesting();
  });

  it("keeps notes when a second exam is chosen and activated", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    NotesService.create({ title: "Modal verbs", body: "Must vs. have to.", subject: "Grammar" });
    expect(NotesService.getAll()).toHaveLength(1);

    // Pick a different exam; it becomes the active workspace.
    WorkspaceService.createWorkspace({ examId: "let", levelId: "let-secondary" });
    expect(WorkspaceService.getCurrentWorkspace()?.examId).toBe("let");

    // Notes are global and untouched.
    expect(NotesService.getAll()).toHaveLength(1);

    // Switching back to CSE keeps both workspaces intact.
    const cseWs = WorkspaceService.getAllWorkspaces().find((w) => w.examId === "cse")!;
    WorkspaceService.setCurrentWorkspace(cseWs.id);
    expect(WorkspaceService.getCurrentWorkspace()?.examId).toBe("cse");
    expect(NotesService.getAll()).toHaveLength(1);
  });

  it("keeps per-workspace history separate without deleting it on switch", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    const cseWsId = WorkspaceService.getCurrentWorkspace()!.id;
    LocalStorageService.addDailyQuestionsAnswered(10);
    expect(LocalStorageService.getDailyQuestionsAnswered()).toBe(10);

    WorkspaceService.createWorkspace({ examId: "let", levelId: "let-secondary" });
    expect(WorkspaceService.getCurrentWorkspace()?.examId).toBe("let");

    // Switch back: the CSE workspace's counter is exactly as left, not wiped.
    WorkspaceService.setCurrentWorkspace(cseWsId);
    expect(LocalStorageService.getDailyQuestionsAnswered()).toBe(10);
  });
});
