"use client";

import { LocalStorageService, type TargetExamConfig } from "@/lib/storage";
import { PreferencesService } from "@/lib/preferences/preferences-service";
import { WorkspaceService } from "@/lib/workspace/workspace-service";
import { getExamConfig } from "@/config/exams";

/**
 * Single source of truth for the visitor's target exam (name, date, daily
 * goal). PreferencesService already mirrors its study target into workspace
 * storage on every save; this helper makes that path the only write path so
 * the sidebar card, dashboard countdown hero, and Settings can never drift.
 *
 * "No exam chosen" is a real state: when the visitor has no workspace yet,
 * getTargetExamSummary() returns null instead of fabricating a default. Every
 * consumer (sidebar card, countdown hero, plan, Learn) must handle null.
 */

export interface TargetExamSummary extends TargetExamConfig {
  levelId?: string;
  trackName?: string;
  examId: string;
  workspaceId: string;
}

/** Reads the effective target-exam config, or null when no exam is chosen. */
export function getTargetExamSummary(): TargetExamSummary | null {
  // The workspace list IS the choice record. Empty list = nothing chosen.
  const workspace = WorkspaceService.getCurrentWorkspace();
  if (!workspace) return null;

  const workspaceId = workspace.id;
  const stored = LocalStorageService.getTargetExamConfig(workspaceId);
  const prefs = PreferencesService.isClient()
    ? PreferencesService.getPreferences().study
    : null;

  // Preferences win when they carry a fresher non-empty date; storage is the fallback.
  const targetDate =
    prefs?.targetDate && prefs.targetDate.length === 10 ? prefs.targetDate : stored.targetDate;
  const dailyGoal = prefs?.dailyGoal ?? stored.dailyGoal;

  return {
    targetDate,
    examName:
      prefs?.targetExamName ||
      stored.examName ||
      workspace.targetExamName ||
      getExamConfig(workspace.examId)?.shortName ||
      "My exam",
    dailyGoal,
    examId: workspace.examId,
    levelId: workspace.levelId,
    trackName: workspace.trackName,
    workspaceId,
  };
}

/**
 * Persists a target-exam change through both stores in one transaction so
 * every reader sees the same values immediately. Returns null (and changes
 * nothing) when no exam has been chosen yet — target settings only exist
 * inside a workspace.
 *
 * An EXPLICIT empty-string targetDate clears the date: "no exam date set" is
 * a real state, distinct from leaving the stored value untouched. The empty
 * state also clears the date in preferences and workspace metadata so no
 * reader can resurrect a stale countdown.
 */
export function saveTargetExamSummary(update: {
  targetDate?: string;
  examName?: string;
  dailyGoal?: number;
}): TargetExamSummary | null {
  const current = getTargetExamSummary();
  if (!current) return null;

  const clearsDate = update.targetDate === "";
  const next: TargetExamConfig = {
    targetDate: clearsDate ? "" : update.targetDate ?? current.targetDate,
    examName: update.examName ?? current.examName,
    dailyGoal: Math.min(200, Math.max(5, update.dailyGoal ?? current.dailyGoal)),
  };

  LocalStorageService.saveTargetExamConfig(next, current.workspaceId);

  // Workspace metadata mirrors the target BEFORE the preferences save, so the
  // preferences mirror block (which re-reads the active workspace) observes
  // the already-updated workspace and cannot resurrect a cleared date.
  WorkspaceService.updateWorkspace(current.workspaceId, {
    targetExamDate: next.targetDate || undefined,
    targetExamName: next.examName,
    dailyGoal: next.dailyGoal,
  });

  if (PreferencesService.isClient()) {
    PreferencesService.savePreferences((prev) => ({
      ...prev,
      study: {
        ...prev.study,
        targetDate: next.targetDate,
        targetDateType: clearsDate ? "none" : prev.study.targetDateType,
        targetExamName: next.examName,
        dailyGoal: next.dailyGoal,
      },
    }));
  }

  return { ...current, ...next };
}
