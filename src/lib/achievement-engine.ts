import { ACHIEVEMENTS, type AchievementDef, type AchievementMetric } from "@/config/achievements";

/**
 * Pure achievement computation. Given a real user stats snapshot, returns
 * every badge with earned state and progress. O(n) over badges; callers
 * memoize on the stats snapshot identity.
 */

export interface UserStatsSnapshot {
  testsCompleted: number;
  itemsAnswered: number;
  currentStreak: number;
  longestStreak: number;
  notesCount: number;
  bestSubjectAccuracy: number | null;
  dailyGoalMetToday: boolean;
  fullMocksCompleted: number;
  dueClearedToday: boolean;
}

export interface AchievementProgress {
  def: AchievementDef;
  earned: boolean;
  /** Current metric value, clamped to the goal once earned. */
  value: number;
  goal: number;
  /** 0-1 progress fraction toward the goal. */
  progress: number;
}

function metricValue(snapshot: UserStatsSnapshot, metric: AchievementMetric): number {
  switch (metric) {
    case "testsCompleted":
      return snapshot.testsCompleted;
    case "itemsAnswered":
      return snapshot.itemsAnswered;
    case "currentStreak":
      return snapshot.currentStreak;
    case "longestStreak":
      return snapshot.longestStreak;
    case "notesCount":
      return snapshot.notesCount;
    case "bestSubjectAccuracy":
      return snapshot.bestSubjectAccuracy ?? 0;
    case "dailyGoalMet":
      return snapshot.dailyGoalMetToday ? 1 : 0;
    case "fullMocksCompleted":
      return snapshot.fullMocksCompleted;
    case "dueClearedToday":
      return snapshot.dueClearedToday ? 1 : 0;
  }
}

export function computeAchievements(snapshot: UserStatsSnapshot): AchievementProgress[] {
  return ACHIEVEMENTS.map((def) => {
    const raw = metricValue(snapshot, def.metric);
    const earned = raw >= def.goal;
    return {
      def,
      earned,
      value: Math.min(raw, def.goal),
      goal: def.goal,
      progress: Math.min(1, def.goal > 0 ? raw / def.goal : 0),
    };
  });
}

/** The unearned badge closest to completion, for the "closest to earning" banner. */
export function closestAchievement(progress: AchievementProgress[]): AchievementProgress | null {
  const unearned = progress.filter((p) => !p.earned);
  if (unearned.length === 0) return null;
  return unearned.reduce((best, p) => (p.progress > best.progress ? p : best));
}
