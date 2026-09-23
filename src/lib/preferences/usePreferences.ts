"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserPreferences, PreferenceCategory } from "./types";
import {
  PreferencesService,
  getDefaultPreferences,
  PREFERENCES_CHANGED_EVENT,
} from "./preferences-service";

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === "undefined") {
      return getDefaultPreferences();
    }
    return PreferencesService.getPreferences();
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // One-time legacy seeding. Runs in an effect only: getPreferences() is a
    // pure read now, and seeding writes + dispatches events, so doing it here
    // (not during render) is what fixes the "setState during render" warning.
    PreferencesService.ensureSeeded();
    setPreferences(PreferencesService.getPreferences());

    const handlePreferencesChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserPreferences>;
      if (customEvent.detail) {
        setPreferences(customEvent.detail);
      } else {
        setPreferences(PreferencesService.getPreferences());
      }
    };

    window.addEventListener(PREFERENCES_CHANGED_EVENT, handlePreferencesChange);
    return () => {
      window.removeEventListener(PREFERENCES_CHANGED_EVENT, handlePreferencesChange);
    };
  }, []);

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences> | ((prev: UserPreferences) => UserPreferences)) => {
      const result = PreferencesService.savePreferences(updates);
      if (result.success) {
        setPreferences(result.preferences);
      }
      return result;
    },
    []
  );

  const updateCategory = useCallback(
    <K extends PreferenceCategory>(category: K, categoryUpdates: Partial<UserPreferences[K]>) => {
      return updatePreferences((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          ...categoryUpdates,
        },
      }));
    },
    [updatePreferences]
  );

  const resetCategory = useCallback(
    (category: PreferenceCategory) => {
      const result = PreferencesService.resetCategory(category);
      if (result.success) {
        setPreferences(result.preferences);
      }
      return result;
    },
    []
  );

  const resetAllPreferences = useCallback(() => {
    const result = PreferencesService.resetAllPreferences();
    if (result.success) {
      setPreferences(result.preferences);
    }
    return result;
  }, []);

  return {
    preferences,
    mounted,
    updatePreferences,
    updateCategory,
    resetCategory,
    resetAllPreferences,
  };
}
