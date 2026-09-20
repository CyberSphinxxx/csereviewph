"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getExamConfig } from "@/config/exams";

const RT_LEVEL_EVENT = "rt:exam-level-change";

export interface ExamLevelChangeEventDetail {
  examSlug: string;
  level: string;
}

/**
 * Single source of truth for exam level selection.
 * Priority:
 * 1. URL search param `?level=...`
 * 2. Client-side localStorage `rt_level_${examSlug}` (safely wrapped in try/catch)
 * 3. Exam catalog default level (e.g. "professional")
 *
 * Changes update state, localStorage, and update the URL query using window.history.replaceState
 * (without page reload or history push spam), syncing all mounted subscribers immediately.
 */
export function useExamLevel<T extends string = "professional" | "subprofessional">(
  examSlug: string = "cse"
): [T, (newLevel: T) => void] {
  let searchParams: ReturnType<typeof useSearchParams> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    searchParams = useSearchParams?.() || null;
  } catch {
    searchParams = null;
  }

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

    // 1. URL query param
    const paramLevel = searchParams?.get("level")?.toLowerCase();
    if (paramLevel && valid.includes(paramLevel)) {
      return paramLevel as T;
    }

    // 2. LocalStorage
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

    // 3. Fallback default
    return getDefaultLevel();
  }, [searchParams, examSlug, getValidLevels, getDefaultLevel]);

  const [level, setLevelState] = useState<T>(resolveCurrentLevel);

  // Keep state in sync with URL searchParams if URL changes externally
  useEffect(() => {
    const nextLevel = resolveCurrentLevel();
    setLevelState(nextLevel);
  }, [resolveCurrentLevel]);

  // Listen for broadcasted changes across components on the same page
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

      // Persist to localStorage safely
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(`rt_level_${examSlug}`, newLevel);
        } catch {
          // Ignore private mode or blocked storage exceptions
        }

        // Update URL search query using replaceState (never history push)
        try {
          const url = new URL(window.location.href);
          url.searchParams.set("level", newLevel);
          window.history.replaceState(null, "", url.toString());
        } catch {
          // Ignore URL construction errors in non-browser environments
        }

        // Broadcast to all mounted components (e.g. pill & card)
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
