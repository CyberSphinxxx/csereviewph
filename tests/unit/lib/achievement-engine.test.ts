import { describe, it, expect } from "vitest";
import {
  computeAchievements,
  closestAchievement,
} from "@/lib/achievement-engine";
import type { UserStatsSnapshot } from "@/lib/achievement-engine";
import { ACHIEVEMENTS } from "@/config/achievements";

const base: UserStatsSnapshot = {
  testsCompleted: 0,
  itemsAnswered: 0,
  currentStreak: 0,
  longestStreak: 0,
  notesCount: 0,
  bestSubjectAccuracy: null,
  dailyGoalMetToday: false,
  fullMocksCompleted: 0,
  dueClearedToday: false,
};

describe("computeAchievements", () => {
  it("returns every definition with zero progress for a brand-new user", () => {
    const progress = computeAchievements(base);
    expect(progress).toHaveLength(ACHIEVEMENTS.length);
    for (const p of progress) {
      expect(p.earned).toBe(false);
      expect(p.progress).toBe(0);
      expect(p.value).toBe(0);
    }
  });

  it("earns the first-test badge after one test", () => {
    const [firstTest] = computeAchievements({ ...base, testsCompleted: 1 });
    expect(firstTest.earned).toBe(true);
  });

  it("scales percent-based badges with real values", () => {
    const p = computeAchievements({ ...base, bestSubjectAccuracy: 72 });
    const mastery = p.find((x) => x.def.id === "on-target");
    expect(mastery!.value).toBe(72);
    expect(mastery!.earned).toBe(false);
    expect(mastery!.progress).toBeCloseTo(0.9, 5);
  });

  it("earns mastery at 80 percent and clamps above 100", () => {
    expect(
      computeAchievements({ ...base, bestSubjectAccuracy: 80 }).find((x) => x.def.id === "on-target")!
        .earned
    ).toBe(true);
    expect(
      computeAchievements({ ...base, bestSubjectAccuracy: 96 }).find((x) => x.def.id === "on-target")!
        .progress
    ).toBeLessThanOrEqual(1);
  });

  it("full-mock badge only counts full mode", () => {
    expect(computeAchievements({ ...base, testsCompleted: 3 }).find((x) => x.def.id === "full-length")!.earned).toBe(false);
    expect(computeAchievements({ ...base, fullMocksCompleted: 1 }).find((x) => x.def.id === "full-length")!.earned).toBe(true);
  });

  it("streak badges use the all-time record, not the current streak", () => {
    const p = computeAchievements({ ...base, currentStreak: 2, longestStreak: 8 });
    expect(p.find((x) => x.def.id === "one-full-week")!.earned).toBe(true);
    expect(p.find((x) => x.def.id === "three-in-a-row")!.earned).toBe(true);
    expect(p.find((x) => x.def.id === "habit")!.earned).toBe(false);
  });

  it("goal badge requires the real daily goal met flag", () => {
    expect(computeAchievements(base).find((x) => x.def.id === "daily-goal")!.earned).toBe(false);
    expect(computeAchievements({ ...base, dailyGoalMetToday: true }).find((x) => x.def.id === "daily-goal")!.earned).toBe(true);
  });

  it("note badges use the real notes count", () => {
    expect(computeAchievements({ ...base, notesCount: 3 }).find((x) => x.def.id === "note-taker")!.earned).toBe(true);
    expect(
      computeAchievements({ ...base, notesCount: 2 }).find((x) => x.def.id === "note-taker")!.earned
    ).toBe(false);
  });
});

describe("closestAchievement", () => {
  it("picks the highest-progress unearned badge", () => {
    const progress = computeAchievements({ ...base, testsCompleted: 2, itemsAnswered: 60 });
    const closest = closestAchievement(progress)!;
    expect(closest.earned).toBe(false);
    expect(closest.progress).toBeGreaterThan(0);
  });

  it("returns null when everything is earned", () => {
    const everything = computeAchievements({
      ...base,
      testsCompleted: 999,
      itemsAnswered: 99999,
      currentStreak: 99,
      longestStreak: 99,
      notesCount: 999,
      bestSubjectAccuracy: 100,
      dailyGoalMetToday: true,
      fullMocksCompleted: 999,
      dueClearedToday: true,
    });
    expect(closestAchievement(everything)).toBeNull();
  });
});
