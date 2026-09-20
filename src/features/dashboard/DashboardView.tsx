"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LocalStorageService,
  type AttemptSummary,
  type SubjectReadinessMetric,
  type TargetExamConfig,
  type StoredMistakeItem,
  type DailyActivityCell,
} from "@/lib/storage";
import { usePreferences } from "@/lib/preferences";
import { useExamWorkspace } from "@/lib/workspace/useExamWorkspace";
import { getNextBestStepRecommendation } from "./recommendation-engine";
import { DashboardBento } from "./DashboardBento";
import { ExamCalendarCard } from "./ExamCalendarCard";
import { PracticeActivityGrid } from "./PracticeActivityGrid";
import { DataStorageSection } from "./DataStorageSection";
import { DashboardOnboardingView } from "./DashboardOnboardingView";
import { SlidersHorizontal, Clock, BookOpen, Check } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";

function computeDaysRemaining(dateStr: string): number {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return 0;
  const target = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 864e5));
}

export function DashboardView() {
  const { data: session } = useSession();
  const { preferences } = usePreferences();
  const { currentWorkspace, currentExamConfig, isLoaded } = useExamWorkspace();

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
  const [weekCells, setWeekCells] = useState<DailyActivityCell[]>([]);

  const loadDashboardData = useCallback(() => {
    const wsId = currentWorkspace?.id;
    const savedHistory = LocalStorageService.getAttemptHistory(wsId);
    setHistory(savedHistory);

    const savedMistakes = LocalStorageService.getMistakeBank(wsId);
    setMistakeCount(savedMistakes.length);
    setAllMistakes(savedMistakes);
    setDueMistakes(LocalStorageService.getDueMistakes(wsId));

    const savedBookmarks = LocalStorageService.getBookmarks(wsId);
    setBookmarkCount(savedBookmarks.length);

    const streak = LocalStorageService.getStudyStreak();
    setStreakDays(streak.currentStreak);

    const readiness = LocalStorageService.getSubjectReadiness(wsId);
    setSubjectReadiness(readiness);

    const config = LocalStorageService.getTargetExamConfig(wsId);
    setTargetConfig(config);
    setDailyAnswered(LocalStorageService.getDailyQuestionsAnswered());
    setWeekCells(LocalStorageService.getActivityGridData(1));
  }, [currentWorkspace?.id]);

  useEffect(() => {
    loadDashboardData();

    // Re-sync dashboard state if user completes an exam or modifies data in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key.startsWith("cse_guest_") ||
        e.key.startsWith("attempt_") ||
        e.key.startsWith("rt_ws_")
      ) {
        loadDashboardData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadDashboardData]);

  // If workspaces are loaded and no active workspace exists, render intentional onboarding state
  if (isLoaded && !currentWorkspace) {
    return <DashboardOnboardingView />;
  }

  // Weakest measured subject feeds the "Recommended next" tile
  const measuredSubjects = subjectReadiness.filter((s) => s.questionsAnswered > 0);
  const weakest =
    measuredSubjects.length > 0
      ? measuredSubjects.reduce((m, s) =>
          s.accuracyPercentage < m.accuracyPercentage ? s : m
        )
      : null;

  const examDateLabel = (() => {
    const d = new Date(`${targetConfig.targetDate}T00:00:00`);
    return Number.isNaN(d.getTime())
      ? targetConfig.targetDate
      : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  })();

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
    subtestAccuracies,
    {
      examShortName: currentExamConfig?.shortName || "Civil Service",
      trackName: currentWorkspace?.trackName || "Standard",
      quickDrillHref: currentExamConfig?.routes?.quickDrillUrl || "/exams/professional/quick",
      fullMockHref: currentExamConfig?.routes?.fullMockUrl || "/exams/professional/full",
      practiceHref: currentExamConfig?.routes?.practiceUrl || "/practice",
      fullMockItems: currentExamConfig?.mockSpecs?.itemCount || 170,
      fullMockMinutes: currentExamConfig?.mockSpecs?.timeLimitMinutes || 190,
      passingTarget: currentExamConfig?.mockSpecs?.passingScorePercentage || 80,
    }
  );

  const greetingName = session?.user?.name
    ? `Welcome back, ${session.user.name}`
    : "What will you improve today?";

  const isCompact = preferences.dashboard.spacing === "compact";
  const { showExamCalendar, showActivityCalendar, showStreakSummary, showSubjectProgress, showRecentSessions } =
    preferences.dashboard;
  const allOptionalHidden =
    !showExamCalendar && !showActivityCalendar && !showStreakSummary && !showSubjectProgress && !showRecentSessions;

  const badgeExamTitle = currentExamConfig?.fullName || currentExamConfig?.shortName || currentWorkspace?.examId?.toUpperCase() || "Current examination";
  const badgeTrackTitle = currentWorkspace?.trackName || "Standard";

  const ghostBtn =
    "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-[13px] text-[#1b1216] dark:text-[#f5eff1] shadow-[inset_0_0_0_1.5px_rgba(27,18,22,0.24)] dark:shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.28)] hover:bg-[rgba(27,18,22,0.05)] dark:hover:bg-white/10 transition-colors";
  const primaryBtn =
    "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8a1630] hover:bg-[#701126] text-white text-[13px] font-extrabold shadow-[0_10px_24px_-10px_rgba(138,22,48,0.75)] hover:-translate-y-0.5 transition-all";

  return (
    <div className={`animate-page-enter ${isCompact ? "py-4 px-4 sm:px-6 lg:px-8" : "py-7 px-4 sm:px-6 lg:px-8"}`}>
      <div className={`max-w-7xl mx-auto ${isCompact ? "space-y-4" : "space-y-6"}`}>
        {/* Top Header: Greeting, Exam Context, and Quick Launch */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#fbeff0] dark:bg-[#351a22] text-[#8a1630] dark:text-[#fad1da] text-xs font-extrabold">
              {badgeExamTitle} &bull; {badgeTrackTitle}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#1b1216] dark:text-[#f5eff1] mt-2.5">
              {greetingName}
            </h1>
            <p className="text-[#5a4a50] dark:text-[#a89ba1] text-sm mt-1">
              Personalized daily study pacing and practice accuracy based on your sessions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/settings/dashboard"
              className={ghostBtn}
              title="Customize dashboard layout"
            >
              <SlidersHorizontal className="w-4 h-4 opacity-60" />
              <span className="hidden sm:inline">Customize View</span>
            </Link>

            {currentExamConfig?.capabilities?.hasQuickDrill && currentExamConfig.routes?.quickDrillUrl ? (
              <Link
                href={currentExamConfig.routes.quickDrillUrl}
                prefetch={true}
                className={primaryBtn}
              >
                <Clock className="w-4 h-4" />
                <span>Start Quick Drill</span>
              </Link>
            ) : (
              <Link
                href={currentExamConfig?.routes?.practiceUrl || "/practice"}
                prefetch={true}
                className={primaryBtn}
              >
                <BookOpen className="w-4 h-4" />
                <span>Practice Drills</span>
              </Link>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-[#e9f8ef] border border-[#12a150]/30 text-[#0e5c2f] dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#12a150] dark:text-emerald-400" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs text-[#0e7d3d] dark:text-emerald-300 font-extrabold px-1 hover:opacity-70"
            >
              ✕
            </button>
          </div>
        )}

        {/* All Optional Sections Hidden Banner */}
        {allOptionalHidden && (
          <div className="p-3.5 rounded-2xl bg-[#fbeff0] border border-[#8a1630]/20 text-[#6b1226] dark:bg-brand-950/30 dark:border-brand-800 dark:text-brand-200 text-xs font-semibold flex items-center justify-between gap-3">
            <span>Optional sections are hidden. Your daily study action and progress recording remain active.</span>
            <Link href="/settings/dashboard" className="font-extrabold underline shrink-0 hover:opacity-80">
              Restore sections in Settings &rarr;
            </Link>
          </div>
        )}

        {/* Bento workspace grid */}
        <DashboardBento
          recommendation={recommendation}
          mistakeCount={mistakeCount}
          dueMistakeCount={dueMistakes.length}
          bookmarkCount={bookmarkCount}
          dailyAnswered={dailyAnswered}
          dailyGoal={targetConfig.dailyGoal || 25}
          daysRemaining={computeDaysRemaining(targetConfig.targetDate)}
          examName={targetConfig.examName}
          examDateLabel={examDateLabel}
          streakDays={streakDays}
          weekCells={weekCells}
          avgAccuracy={avgAccuracy}
          totalTests={totalTests}
          passedTests={passedTests}
          itemsAnswered={estimatedQuestionsAnswered}
          subjects={subjectReadiness}
          history={history}
          weakest={
            weakest
              ? { name: weakest.subjectName, accuracy: weakest.accuracyPercentage }
              : null
          }
          practiceHref={currentExamConfig?.routes?.practiceUrl || "/practice"}
          diagnosticHref={currentExamConfig?.routes?.quickDrillUrl || "/exams/professional/quick"}
          showExamTile={showExamCalendar}
          showStreakTile={showStreakSummary}
          showSubjectTile={showSubjectProgress}
          showSessionsTile={showRecentSessions}
        />

        {/* Below the bento: consistency tracker + exam details, then data controls */}
        <div
          className={`grid grid-cols-1 ${
            showActivityCalendar && showExamCalendar ? "lg:grid-cols-2" : ""
          } ${isCompact ? "gap-4" : "gap-6"} items-start`}
        >
          {showActivityCalendar && <PracticeActivityGrid streakDays={streakDays} />}

          {showExamCalendar && (
            <div id="exam-details" className="min-w-0">
              <ExamCalendarCard
                config={targetConfig}
                dailyAnswered={dailyAnswered}
                examId={currentWorkspace?.examId}
                examShortName={currentExamConfig?.shortName}
                trackName={currentWorkspace?.trackName}
                workspaceId={currentWorkspace?.id}
                onConfigChange={(newConfig) => {
                  setTargetConfig(newConfig);
                  setFeedbackMessage("Target exam date & daily pacing goal updated!");
                  setTimeout(() => setFeedbackMessage(null), 4000);
                }}
              />
            </div>
          )}
        </div>

        {showExamCalendar && (
          <DataStorageSection
            onDataChanged={loadDashboardData}
            onShowMessage={(msg) => {
              setFeedbackMessage(msg);
              setTimeout(() => setFeedbackMessage(null), 4000);
            }}
          />
        )}
      </div>
    </div>
  );
}
