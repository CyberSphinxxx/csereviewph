"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LocalStorageService,
  type AttemptSummary,
  type SubjectReadinessMetric,
  type TargetExamConfig,
  type StoredMistakeItem,
} from "@/lib/storage";
import { usePreferences } from "@/lib/preferences";
import { getNextBestStepRecommendation } from "./recommendation-engine";
import { TodayActionCard } from "./TodayActionCard";
import { ExamCalendarCard } from "./ExamCalendarCard";
import { PracticeActivityGrid } from "./PracticeActivityGrid";
import { SubjectProgressList } from "./SubjectProgressList";
import { RecentSessionsList } from "./RecentSessionsList";
import { DataStorageSection } from "./DataStorageSection";
import {
  Target,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";

export function DashboardView() {
  const { data: session } = useSession();
  const { preferences } = usePreferences();
  const [history, setHistory] = useState<AttemptSummary[]>([]);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [dueMistakes, setDueMistakes] = useState<StoredMistakeItem[]>([]);
  const [allMistakes, setAllMistakes] = useState<StoredMistakeItem[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [subjectReadiness, setSubjectReadiness] = useState<SubjectReadinessMetric[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Target Exam Countdown & Daily Goal State
  const [targetConfig, setTargetConfig] = useState<TargetExamConfig>({
    targetDate: "2027-03-14",
    examName: "March 2027 CSE-PPT",
    dailyGoal: 25,
  });
  const [dailyAnswered, setDailyAnswered] = useState(0);

  const loadDashboardData = () => {
    const savedHistory = LocalStorageService.getAttemptHistory();
    setHistory(savedHistory);

    const savedMistakes = LocalStorageService.getMistakeBank();
    setMistakeCount(savedMistakes.length);
    setAllMistakes(savedMistakes);
    setDueMistakes(LocalStorageService.getDueMistakes());

    const savedBookmarks = LocalStorageService.getBookmarks();
    setBookmarkCount(savedBookmarks.length);

    const streak = LocalStorageService.getStudyStreak();
    setStreakDays(streak.currentStreak);

    const readiness = LocalStorageService.getSubjectReadiness();
    setSubjectReadiness(readiness);

    const config = LocalStorageService.getTargetExamConfig();
    setTargetConfig(config);
    setDailyAnswered(LocalStorageService.getDailyQuestionsAnswered());
  };

  useEffect(() => {
    loadDashboardData();

    // Re-sync dashboard state if user completes an exam or modifies data in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("cse_guest_") || e.key.startsWith("attempt_")) {
        loadDashboardData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Compute aggregate statistics truthfully (D01: No invented numbers!)
  const totalTests = history.length;
  const avgAccuracy =
    totalTests > 0
      ? Number((history.reduce((acc, h) => acc + h.percentage, 0) / totalTests).toFixed(1))
      : null;

  const passedTests = history.filter((h) => h.passed).length;
  const estimatedQuestionsAnswered =
    totalTests > 0
      ? history.reduce((acc, h) => acc + (h.totalQuestions || 10), 0)
      : 0;

  const subtestAccuracies = subjectReadiness
    .filter((s) => s.questionsAnswered > 0)
    .map((s) => ({
      name: s.subjectName,
      accuracy: s.accuracyPercentage,
    }));

  const recommendation = getNextBestStepRecommendation(
    history,
    dueMistakes,
    allMistakes,
    subtestAccuracies
  );

  const greetingName = session?.user?.name
    ? `Welcome back, ${session.user.name}`
    : "Your study space";

  const streakText = LocalStorageService.formatDayStreak(streakDays);

  const isCompact = preferences.dashboard.spacing === "compact";
  const { showExamCalendar, showActivityCalendar, showStreakSummary, showSubjectProgress, showRecentSessions } =
    preferences.dashboard;
  const allOptionalHidden =
    !showExamCalendar && !showActivityCalendar && !showStreakSummary && !showSubjectProgress && !showRecentSessions;

  return (
    <div className={`animate-page-enter ${isCompact ? "py-4 px-4 sm:px-6 lg:px-8" : "py-7 px-4 sm:px-6 lg:px-8"}`}>
      <div className={`max-w-7xl mx-auto ${isCompact ? "space-y-4" : "space-y-7"}`}>
        {/* Top Header: Greeting, Pacing Context, and Quick Launch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-semibold">
                Civil Service Exam &bull; Professional &amp; Subprofessional
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {greetingName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Personalized daily study pacing and practice accuracy based on your sessions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/settings/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold shadow-2xs transition"
              title="Customize dashboard layout"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Customize View</span>
            </Link>

            <Link
              href="/exams/professional/quick"
              prefetch={true}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-sm transition"
            >
              <Clock className="w-4 h-4" />
              <span>Start Quick Drill</span>
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs text-emerald-700 dark:text-emerald-300 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* All Optional Sections Hidden Banner */}
        {allOptionalHidden && (
          <div className="p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 text-xs text-brand-900 dark:text-brand-200 flex items-center justify-between">
            <span>Optional sections are hidden. Your daily study action and progress recording remain active.</span>
            <Link href="/settings/dashboard" className="font-bold underline ml-2 shrink-0 hover:opacity-80">
              Restore sections in Settings &rarr;
            </Link>
          </div>
        )}

        {/* Truthful Stat Tiles */}
        <div className={`grid ${showStreakSummary ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"} gap-3.5 sm:gap-4`}>
          {/* Practice Accuracy */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">
                Practice accuracy
              </span>
              <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {avgAccuracy !== null ? `${avgAccuracy}%` : "Not measured yet"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {avgAccuracy !== null
                ? `Study target: 80% (${totalTests} ${totalTests === 1 ? "test" : "tests"})`
                : "Take a diagnostic to establish baseline"}
            </div>
          </div>

          {/* Tests Completed */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">
                Tests completed
              </span>
              <Award className="w-4 h-4 text-gold-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{totalTests}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {totalTests > 0
                ? `${passedTests} met target (${Math.round((passedTests / totalTests) * 100)}%)`
                : "No tests completed yet"}
            </div>
          </div>

          {/* Study Streak (Optional) */}
          {showStreakSummary && (
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Study streak
                </span>
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{streakText}</div>
              <div className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-1">
                {streakDays > 0 ? "Daily streak active" : "Answer 1 question today"}
              </div>
            </div>
          )}

          {/* Items Answered */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">
                Items answered
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {estimatedQuestionsAnswered}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Across all practice sessions
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout (2/3 Study, 1/3 Personal Context) */}
        <div className={`grid grid-cols-1 ${showExamCalendar ? "lg:grid-cols-3" : "lg:grid-cols-1"} ${isCompact ? "gap-4 sm:gap-5" : "gap-6 sm:gap-7"} items-start`}>
          {/* Main Study Column */}
          <div className={`${showExamCalendar ? "lg:col-span-2" : "lg:col-span-1"} ${isCompact ? "space-y-4" : "space-y-6 sm:space-y-7"}`}>
            {/* Priority 1: Dominant "For today" Action (Permanent anchor) */}
            <TodayActionCard
              recommendation={recommendation}
              mistakeCount={mistakeCount}
              dueMistakeCount={dueMistakes.length}
              bookmarkCount={bookmarkCount}
              dailyAnswered={dailyAnswered}
              dailyGoal={targetConfig.dailyGoal || 25}
            />

            {/* Optional Activity Grid */}
            {showActivityCalendar && (
              <PracticeActivityGrid streakDays={streakDays} />
            )}

            {/* Optional Subject Progress */}
            {showSubjectProgress && (
              <SubjectProgressList subjects={subjectReadiness} />
            )}

            {/* Optional Recent Sessions */}
            {showRecentSessions && (
              <RecentSessionsList history={history} />
            )}
          </div>

          {/* Personal Context Column */}
          {showExamCalendar && (
            <div className={`${isCompact ? "space-y-4" : "space-y-6"}`}>
              {/* "Your Exam" Card */}
              <ExamCalendarCard
                config={targetConfig}
                dailyAnswered={dailyAnswered}
                onConfigChange={(newConfig) => {
                  setTargetConfig(newConfig);
                  setFeedbackMessage("Target exam date & daily pacing goal updated!");
                  setTimeout(() => setFeedbackMessage(null), 4000);
                }}
              />

              {/* Compact Local Storage & Data Controls */}
              <DataStorageSection
                onDataChanged={loadDashboardData}
                onShowMessage={(msg) => {
                  setFeedbackMessage(msg);
                  setTimeout(() => setFeedbackMessage(null), 4000);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
