import type { PlanTemplateId } from "@/config/study-plan-templates";

export interface StudyPreferences {
  examId: string; // e.g., "cse"
  levelId: string; // e.g., "cse-professional" | "cse-subprofessional"
  targetDate: string; // YYYY-MM-DD or empty
  /** Display name of the target exam cycle, e.g. "March 2027 CSE-PPT". */
  targetExamName?: string;
  targetDateType: "verified" | "custom" | "none";
  /** Weekly plan template: smart (adaptive), balanced, weak-focus, cram. */
  planTemplate: PlanTemplateId;
  dailyGoal: number; // bounded between 5 and 200
  showDailyGoal: boolean;
  weekStartsOn: "monday" | "sunday";
  studyTimeZone: string; // "Asia/Manila"
  showStreak: boolean;
}

export interface AppearancePreferences {
  theme: "system" | "light" | "dark";
  reduceMotion: "device" | "reduce";
}

export interface ReadingPreferences {
  readingTextSize: "standard" | "large" | "extra-large"; // 16px | 18px | 20px
  lineSpacing: "standard" | "spacious"; // 1.6 | 1.8
  readingWidth: "standard" | "narrow"; // 65ch | 52ch
}

export interface DashboardPreferences {
  spacing: "comfortable" | "compact";
  showExamCalendar: boolean;
  showActivityCalendar: boolean;
  showStreakSummary: boolean;
  showSubjectProgress: boolean;
  showRecentSessions: boolean;
}

export interface PrivacyPreferences {
  analyticsConsent: boolean;
  adsConsent: boolean;
  localCheckInTracking: boolean;
}

export interface UserPreferences {
  version: 1;
  updatedAt: string;
  study: StudyPreferences;
  appearance: AppearancePreferences;
  reading: ReadingPreferences;
  dashboard: DashboardPreferences;
  privacy: PrivacyPreferences;
}

export type PreferenceCategory = "study" | "appearance" | "reading" | "dashboard" | "privacy";
