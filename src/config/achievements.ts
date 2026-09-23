/**
 * Achievement badge definitions.
 *
 * Kept as data (not inline UI) so badges can be added, reordered, or retired
 * without touching the compute or rendering code. `metric` refers to a key
 * on the user stats snapshot; `goal` is the value that earns the badge.
 */

export type AchievementMetric =
  | "testsCompleted"
  | "itemsAnswered"
  | "currentStreak"
  | "longestStreak"
  | "notesCount"
  | "bestSubjectAccuracy"
  | "dailyGoalMet"
  | "fullMocksCompleted"
  | "dueClearedToday";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  metric: AchievementMetric;
  goal: number;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first-test", title: "First test", description: "Complete your first test", metric: "testsCompleted", goal: 1, icon: "check" },
  { id: "warmup", title: "Warm-up", description: "Answer 50 items", metric: "itemsAnswered", goal: 50, icon: "zap" },
  { id: "getting-serious", title: "Getting serious", description: "Answer 500 items", metric: "itemsAnswered", goal: 500, icon: "zap" },
  { id: "marathon", title: "Marathoner", description: "Answer 2,000 items", metric: "itemsAnswered", goal: 2000, icon: "zap" },
  { id: "first-step", title: "First step", description: "Study on 1 day", metric: "longestStreak", goal: 1, icon: "flame" },
  { id: "three-in-a-row", title: "Three in a row", description: "Reach a 3-day streak", metric: "longestStreak", goal: 3, icon: "flame" },
  { id: "one-full-week", title: "One full week", description: "Reach a 7-day streak", metric: "longestStreak", goal: 7, icon: "flame" },
  { id: "habit", title: "Habit", description: "Reach a 30-day streak", metric: "longestStreak", goal: 30, icon: "flame" },
  { id: "note-taker", title: "Note taker", description: "Write 3 notes", metric: "notesCount", goal: 3, icon: "notes" },
  { id: "archivist", title: "Archivist", description: "Write 10 notes", metric: "notesCount", goal: 10, icon: "notes" },
  { id: "on-target", title: "On target", description: "Reach 80% in any subject", metric: "bestSubjectAccuracy", goal: 80, icon: "target" },
  { id: "daily-goal", title: "Daily goal", description: "Hit your daily goal today", metric: "dailyGoalMet", goal: 1, icon: "award" },
  { id: "full-length", title: "Full-length", description: "Finish a full mock exam", metric: "fullMocksCompleted", goal: 1, icon: "timer" },
  { id: "clean-slate", title: "Clean slate", description: "Clear all due reviews in one day", metric: "dueClearedToday", goal: 1, icon: "repeat" },
];

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
