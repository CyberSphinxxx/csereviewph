"use client";

import React, { useState } from "react";
import { Clock, LogOut } from "lucide-react";
import { formatTimeRemaining } from "@/features/exam-engine";

interface TestModeBarProps {
  examName?: string;
  levelName?: string;
  currentIndex: number;
  totalQuestions: number;
  remainingSeconds: number;
  isWarning?: boolean;
  hasAnswers?: boolean;
  onExit: () => void;
}

export function TestModeBar({
  examName = "Civil Service Exam (CSE)",
  levelName = "Professional",
  currentIndex,
  totalQuestions,
  remainingSeconds,
  isWarning = false,
  hasAnswers = false,
  onExit,
}: TestModeBarProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    onExit();
  };

  return (
    <>
      <header
        role="banner"
        aria-label="Exam in progress"
        className="sticky top-0 z-40 w-full border-b border-border bg-white dark:bg-[#1E191C] px-3 sm:px-6 lg:px-8 py-2.5 shadow-2xs transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 min-h-11">
          {/* Left: Exit Action with Dialog */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 shadow-2xs group"
              aria-label="Save and Exit exam"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600 transition-colors" />
              <span>Exit</span>
            </button>
          </div>

          {/* Center: Exam Name + Level & Question Progress */}
          <div className="flex flex-col items-center justify-center text-center min-w-0 px-1 sm:px-2">
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              <span className="truncate">{examName}</span>
              <span className="text-slate-300 dark:text-slate-600 font-normal">&bull;</span>
              <span className="text-brand-700 dark:text-brand-400 font-semibold truncate">{levelName}</span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Item {currentIndex + 1} of {totalQuestions}
            </div>
          </div>

          {/* Right: Continuous Countdown Timer (Always Visible) */}
          <div className="flex items-center shrink-0">
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold tracking-wider shadow-2xs transition-colors ${
                isWarning
                  ? "bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              <Clock
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  isWarning ? "text-rose-600 dark:text-rose-400" : "text-brand-600 dark:text-brand-400"
                }`}
              />
              <span id="exam-timer">{formatTimeRemaining(remainingSeconds)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-dialog-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
        >
          <div className="bg-white dark:bg-[#1E191C] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border">
            <h3 id="exit-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Leave this test?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {hasAnswers
                ? "Your progress is saved and you can resume this test later."
                : "You have not answered any questions yet."}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Keep Practicing
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-sm transition"
              >
                {hasAnswers ? "Save & Leave" : "Leave Test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
