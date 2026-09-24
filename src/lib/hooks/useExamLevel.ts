"use client";

import { useState, useEffect, useCallback } from "react";
import { getExamConfig } from "@/config/exams";

const RT_LEVEL_EVENT = "rt:exam-level-change";

export interface ExamLevelChangeEventDetail {
  examSlug: string;
  level: string;
}

/**
 * PUBLIC-PAGE VIEW HINT — not the app's exam state.
 *
 * The workspace is the single authoritative store for which exam level a
 * learner is preparing for (see useExamWorkspace / WorkspaceService). This
 * hook only remembers which level a visitor is *previewing* on public pages
 * (CSE landing, exam picker cards) so their cards agree while browsing. It:
 * - never writes to workspace storage,
 * - no longer rewrites the URL query string (that leaked state into every
 *   subsequent route and fought with workspace-derived links),
 * - is ignored everywhere except the public components that opt into it.
 *
 * Priority: broadcast event on the page → localStorage preview hint →
 * catalog default level.
 */
export function useExamLevel<T extends string = "professional" | "subprofessional">(
  examSlug: string = "cse"
): [T, (newLevel: T) => void] {
  const getValidLevels = useCallback((): string[] => {
    const config = getExamConfig(examSlug);
    if (config?.levels && config.levels.length > 0) {
      return config.levels.map((lvl) => lvl.id);
    }
    return ["professional", "subprofessional"];
  }, [examSlug]);

  const getDefaultLevel = useCallback((): T => {
    const valid = getValidLevels();
    return (valid[0] || "professional") as T;
  }, [getValidLevels]);

  const resolveCurrentLevel = useCallback((): T => {
    const valid = getValidLevels();

    // 1. LocalStorage preview hint (scoped to public-page browsing)
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(`rt_level_${examSlug}`)?.toLowerCase();
        if (stored && valid.includes(stored)) {
          return stored as T;
        }
      } catch {
        // Storage might be restricted or blocked; continue to default
      }
    }

    // 2. Catalog default
    return getDefaultLevel();
  }, [examSlug, getValidLevels, getDefaultLevel]);

  const [level, setLevelState] = useState<T>(resolveCurrentLevel);

  // Keep state in sync when another component on the page changes the hint
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<ExamLevelChangeEventDetail>;
      if (
        customEvent.detail &&
        customEvent.detail.examSlug === examSlug &&
        customEvent.detail.level
      ) {
        const newLevel = customEvent.detail.level as T;
        setLevelState((prev) => (prev !== newLevel ? newLevel : prev));
      }
    };

    window.addEventListener(RT_LEVEL_EVENT, handleCustomEvent);
    return () => {
      window.removeEventListener(RT_LEVEL_EVENT, handleCustomEvent);
    };
  }, [examSlug]);

  const setLevel = useCallback(
    (newLevel: T) => {
      const valid = getValidLevels();
      if (!valid.includes(newLevel)) return;

      setLevelState(newLevel);

      // Persist the public-page preview hint only
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(`rt_level_${examSlug}`, newLevel);
        } catch {
          // Ignore private mode or blocked storage exceptions
        }

        // Broadcast to all mounted components on this page (e.g. pill & card)
        try {
          const evt = new CustomEvent<ExamLevelChangeEventDetail>(RT_LEVEL_EVENT, {
            detail: { examSlug, level: newLevel },
          });
          window.dispatchEvent(evt);
        } catch {
          // CustomEvent dispatch fallback
        }
      }
    },
    [examSlug, getValidLevels]
  );

  return [level, setLevel];
}
