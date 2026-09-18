import { getExamConfig, getExamTrack } from "@/config/exams";
import {
  type ExamWorkspace,
  WORKSPACE_STORAGE_KEYS,
  RT_WORKSPACE_CHANGED_EVENT,
} from "./types";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeGet<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[WorkspaceService] Failed to write key "${key}":`, err);
  }
}

function notifyWorkspaceChange(currentWorkspace: ExamWorkspace | null): void {
  if (!isBrowser()) return;
  window.dispatchEvent(
    new CustomEvent(RT_WORKSPACE_CHANGED_EVENT, {
      detail: { workspace: currentWorkspace },
    })
  );
}

export class WorkspaceService {
  /**
   * Retrieves all user workspaces, sorted with most recently accessed first.
   */
  public static getAllWorkspaces(): ExamWorkspace[] {
    return safeGet<ExamWorkspace[]>(WORKSPACE_STORAGE_KEYS.WORKSPACES, []);
  }

  /**
   * Retrieves the currently active workspace, or null if no workspace is active.
   */
  public static getCurrentWorkspace(): ExamWorkspace | null {
    const workspaces = this.getAllWorkspaces();
    if (workspaces.length === 0) return null;

    const currentId = safeGet<string | null>(WORKSPACE_STORAGE_KEYS.CURRENT_WORKSPACE_ID, null);
    if (currentId) {
      const match = workspaces.find((w) => w.id === currentId);
      if (match) return match;
    }

    // Fallback to first workspace if ID not found
    return workspaces[0] || null;
  }

  /**
   * Sets the active workspace by ID.
   */
  public static setCurrentWorkspace(id: string): ExamWorkspace | null {
    const workspaces = this.getAllWorkspaces();
    const target = workspaces.find((w) => w.id === id);
    if (!target) return null;

    const now = new Date().toISOString();
    const updated = workspaces.map((w) => (w.id === id ? { ...w, lastAccessedAt: now } : w));

    safeSet(WORKSPACE_STORAGE_KEYS.WORKSPACES, updated);
    safeSet(WORKSPACE_STORAGE_KEYS.CURRENT_WORKSPACE_ID, id);

    const active = { ...target, lastAccessedAt: now };
    notifyWorkspaceChange(active);
    return active;
  }

  /**
   * Creates and activates a new workspace for an exam.
   * If a workspace for this exam & level already exists, activates and updates it instead.
   */
  public static createWorkspace(input: {
    examId: string;
    levelId?: string;
    trackName?: string;
    targetExamDate?: string;
    targetExamName?: string;
    dailyGoal?: number;
  }): ExamWorkspace {
    const workspaces = this.getAllWorkspaces();
    const exam = getExamConfig(input.examId);
    const track = getExamTrack(input.examId, input.levelId);

    const levelId = input.levelId || track?.id || (input.examId === "cse" ? "professional" : undefined);
    const trackName = input.trackName || track?.shortName || track?.name || (levelId ? levelId.charAt(0).toUpperCase() + levelId.slice(1) : undefined);

    // If an existing workspace for this examId already exists, reuse or update it
    const existingIndex = workspaces.findIndex((w) => w.examId === input.examId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = workspaces[existingIndex];
      const updated: ExamWorkspace = {
        ...existing,
        levelId: levelId ?? existing.levelId,
        trackName: trackName ?? existing.trackName,
        targetExamDate: input.targetExamDate ?? existing.targetExamDate,
        targetExamName: input.targetExamName ?? existing.targetExamName,
        dailyGoal: input.dailyGoal ?? existing.dailyGoal,
        lastAccessedAt: now,
      };

      workspaces[existingIndex] = updated;
      safeSet(WORKSPACE_STORAGE_KEYS.WORKSPACES, workspaces);
      safeSet(WORKSPACE_STORAGE_KEYS.CURRENT_WORKSPACE_ID, updated.id);

      notifyWorkspaceChange(updated);
      return updated;
    }

    // Otherwise create brand new workspace
    const id = input.examId === "cse" ? "workspace_cse" : `ws_${input.examId}_${Date.now()}`;
    const newWs: ExamWorkspace = {
      id,
      examId: input.examId,
      levelId,
      trackName,
      targetExamDate: input.targetExamDate || exam?.defaultTargetDate || "2027-03-14",
      targetExamName: input.targetExamName || exam?.defaultTargetName || `${exam?.shortName || "Exam"} Preparation`,
      dailyGoal: input.dailyGoal || 25,
      createdAt: now,
      lastAccessedAt: now,
    };

    const nextWorkspaces = [newWs, ...workspaces];
    safeSet(WORKSPACE_STORAGE_KEYS.WORKSPACES, nextWorkspaces);
    safeSet(WORKSPACE_STORAGE_KEYS.CURRENT_WORKSPACE_ID, newWs.id);

    notifyWorkspaceChange(newWs);
    return newWs;
  }

  /**
   * Updates fields on an existing workspace.
   */
  public static updateWorkspace(id: string, updates: Partial<ExamWorkspace>): ExamWorkspace | null {
    const workspaces = this.getAllWorkspaces();
    const idx = workspaces.findIndex((w) => w.id === id);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    const updated: ExamWorkspace = {
      ...workspaces[idx],
      ...updates,
      lastAccessedAt: now,
    };

    workspaces[idx] = updated;
    safeSet(WORKSPACE_STORAGE_KEYS.WORKSPACES, workspaces);

    const currentId = safeGet<string | null>(WORKSPACE_STORAGE_KEYS.CURRENT_WORKSPACE_ID, null);
    if (currentId === id) {
      notifyWorkspaceChange(updated);
    }

    return updated;
  }

  /**
   * Removes a workspace by ID.
   * Returns the new current workspace (or null if all workspaces removed).
   */
  public static removeWorkspace(id: string): { nextWorkspace: ExamWorkspace | null } {
    const workspaces = this.getAllWorkspaces();
    const remaining = workspaces.filter((w) => w.id !== id);
    safeSet(WORKSPACE_STORAGE_KEYS.WORKSPACES, remaining);

    const currentId = safeGet<string | null>(WORKSPACE_STORAGE_KEYS.CURRENT_WORKSPACE_ID, null);
    let nextWorkspace: ExamWorkspace | null = null;

    if (currentId === id) {
      nextWorkspace = remaining[0] || null;
      safeSet(
        WORKSPACE_STORAGE_KEYS.CURRENT_WORKSPACE_ID,
        nextWorkspace ? nextWorkspace.id : null
      );
      notifyWorkspaceChange(nextWorkspace);
    } else {
      nextWorkspace = this.getCurrentWorkspace();
    }

    return { nextWorkspace };
  }
}
