"use client";

import { useEffect, useMemo, useState } from "react";
import { LocalStorageService } from "@/lib/storage";
import { getManilaTodayString } from "@/lib/study-plan";
import { generateDailyQuests, type DailyQuest } from "@/lib/daily-quests";
import { useExamWorkspace } from "@/lib/workspace/useExamWorkspace";
import { usePreferences } from "@/lib/preferences";

/**
 * Single client-side wiring for daily quests. Both the Dashboard and the Study
 * plan use this hook, so both surfaces always show the same quests. All reads
 * are the same real counters the daily-goal ring and Achievements use; the
 * pure engine does the rest. Exam-gated: returns [] when no exam is chosen.
 */
export function useDailyQuests(): DailyQuest[] {
  const { currentWorkspace, isLoaded } = useExamWorkspace();
  const { preferences } = usePreferences();

  const [, setTick] = useState(0);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("cse_guest_") || e.key.startsWith("attempt_")) {
        setTick((t) => t + 1);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const wsId = currentWorkspace?.id;
  const today = getManilaTodayString();

  const quests = useMemo(() => {
    if (!isLoaded || !currentWorkspace) return [];

    const readiness = LocalStorageService.getSubjectReadiness(wsId);
    const dueNow = LocalStorageService.getDueMistakes(wsId).length;
    const dailyGoal = currentWorkspace.dailyGoal || preferences.study.dailyGoal || 25;
    const history = LocalStorageService.getAttemptHistory(wsId);
    const todays = history.filter((h) => typeof h.date === "string" && h.date.startsWith(today));

    const subjectItems: Record<string, number> = {};
    const bestScore: Record<string, number> = {};
    let reviewItems = 0;
    for (const summary of todays) {
      const details = LocalStorageService.getAttemptDetails(summary.id, wsId);
      if (details?.scoreResult?.subjectBreakdown) {
        for (const s of details.scoreResult.subjectBreakdown) {
          subjectItems[s.subjectId] = (subjectItems[s.subjectId] ?? 0) + (s.total ?? 0);
          bestScore[s.subjectId] = Math.max(
            bestScore[s.subjectId] ?? 0,
            s.total ? Math.round(((s.correct ?? 0) / s.total) * 100) : 0
          );
        }
      }
      if (summary.mode === "review" || summary.mode === "mistakes" || summary.mode === "bookmarks") {
        reviewItems += summary.totalQuestions || 0;
      }
    }

    return generateDailyQuests({
      todayIso: today,
      dailyGoal,
      readiness,
      todaySubjectItems: subjectItems,
      todayBestSubjectScore: bestScore,
      reviewItemsToday: reviewItems,
      dueNow,
      anyAttemptToday: todays.length > 0,
      practiceHref: "/dashboard/practice",
    });
    // Recomputed only when the workspace, the day, or the storage tick changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsId, isLoaded, today, preferences.study.dailyGoal]);

  return quests;
}
