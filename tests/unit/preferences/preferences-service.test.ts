import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  PreferencesService,
  DEFAULT_APPEARANCE_PREFERENCES,
} from "@/lib/preferences";

describe("PreferencesService Unit Tests", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns defaults on clean storage", () => {
    const prefs = PreferencesService.getPreferences();
    expect(prefs.version).toBe(1);
    expect(prefs.study.examId).toBe("cse");
    expect(prefs.study.levelId).toBe("cse-professional");
    expect(prefs.study.dailyGoal).toBe(25);
    expect(prefs.appearance.theme).toBe("light");
    expect(prefs.appearance.reduceMotion).toBe("device");
    expect(prefs.reading.readingTextSize).toBe("standard");
    expect(prefs.dashboard.spacing).toBe("comfortable");
    expect(prefs.privacy.analyticsConsent).toBe(false);
    expect(prefs.privacy.adsConsent).toBe(false);
  });

  it("getPreferences is a pure read: no writes, no events on clean storage", () => {
    // Regression guard: getPreferences() used to seed-and-save when storage was
    // empty, dispatching PREFERENCES_CHANGED_EVENT during render (the source of
    // the "Cannot update ThemeProvider while rendering AppShell" warning).
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    PreferencesService.getPreferences();
    PreferencesService.getPreferences();

    expect(setItemSpy).not.toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();

    setItemSpy.mockRestore();
    dispatchSpy.mockRestore();
  });

  it("ensureSeeded persists once and is a no-op afterwards", () => {
    PreferencesService.ensureSeeded();
    expect(window.localStorage.getItem("csereviewph_user_preferences_v1")).toBeTruthy();

    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    PreferencesService.ensureSeeded();
    expect(dispatchSpy).not.toHaveBeenCalled();
    dispatchSpy.mockRestore();
  });

  it("persists updates and validates bounds for dailyGoal", () => {
    const resLow = PreferencesService.savePreferences((prev) => ({
      ...prev,
      study: { ...prev.study, dailyGoal: 1 }, // below min of 5
    }));
    expect(resLow.success).toBe(true);
    expect(resLow.preferences.study.dailyGoal).toBe(5);

    const resHigh = PreferencesService.savePreferences((prev) => ({
      ...prev,
      study: { ...prev.study, dailyGoal: 500 }, // above max of 200
    }));
    expect(resHigh.success).toBe(true);
    expect(resHigh.preferences.study.dailyGoal).toBe(200);

    const resValid = PreferencesService.savePreferences((prev) => ({
      ...prev,
      study: { ...prev.study, dailyGoal: 50 },
    }));
    expect(resValid.preferences.study.dailyGoal).toBe(50);
  });

  it("resets an individual category without resetting others", () => {
    PreferencesService.savePreferences((prev) => ({
      ...prev,
      appearance: { theme: "dark", reduceMotion: "reduce" },
      study: { ...prev.study, dailyGoal: 50 },
    }));

    const resetAppRes = PreferencesService.resetCategory("appearance");
    expect(resetAppRes.success).toBe(true);
    expect(resetAppRes.preferences.appearance.theme).toBe(DEFAULT_APPEARANCE_PREFERENCES.theme);
    expect(resetAppRes.preferences.appearance.reduceMotion).toBe(DEFAULT_APPEARANCE_PREFERENCES.reduceMotion);
    // Study preference should still be 50
    expect(resetAppRes.preferences.study.dailyGoal).toBe(50);
  });

  it("resets all preferences to defaults", () => {
    PreferencesService.savePreferences((prev) => ({
      ...prev,
      appearance: { theme: "dark", reduceMotion: "reduce" },
      reading: { readingTextSize: "extra-large", lineSpacing: "spacious", readingWidth: "narrow" },
      dashboard: { ...prev.dashboard, spacing: "compact", showExamCalendar: false },
    }));

    const resetAll = PreferencesService.resetAllPreferences();
    expect(resetAll.success).toBe(true);
    expect(resetAll.preferences.appearance.theme).toBe("light");
    expect(resetAll.preferences.reading.readingTextSize).toBe("standard");
    expect(resetAll.preferences.dashboard.spacing).toBe("comfortable");
    expect(resetAll.preferences.dashboard.showExamCalendar).toBe(true);
  });

  it("handles storage write failures gracefully and returns error message", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError: localStorage limit exceeded");
    });

    const res = PreferencesService.savePreferences((prev) => ({
      ...prev,
      study: { ...prev.study, dailyGoal: 10 },
    }));

    expect(res.success).toBe(false);
    expect(res.error).toMatch(/QuotaExceededError/);

    setItemSpy.mockRestore();
  });
});
