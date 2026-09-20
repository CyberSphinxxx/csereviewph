"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Target,
  Check,
} from "lucide-react";
import { LocalStorageService, type TargetExamConfig } from "@/lib/storage";

interface ExamCalendarCardProps {
  config: TargetExamConfig;
  dailyAnswered: number;
  onConfigChange: (newConfig: TargetExamConfig) => void;
  examId?: string;
  examShortName?: string;
  trackName?: string;
  workspaceId?: string;
}

export function ExamCalendarCard({
  config,
  dailyAnswered,
  onConfigChange,
  examId = "cse",
  examShortName,
  workspaceId,
}: ExamCalendarCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPreset, setEditPreset] = useState<string>("2027-03-14");
  const [editDate, setEditDate] = useState<string>(config.targetDate || "2027-03-14");
  const [editName, setEditName] = useState<string>(config.examName || "March 2027 CSE-PPT");
  const [editGoal, setEditGoal] = useState<number>(config.dailyGoal || 25);
  const [formError, setFormError] = useState<string | null>(null);

  // Focus management for accessible toggle
  const changeDateButtonRef = useRef<HTMLButtonElement>(null);
  const presetSelectRef = useRef<HTMLSelectElement>(null);

  // Mini Calendar Navigation Month state (default to target exam month or current month)
  const targetDateObj = new Date(config.targetDate);
  const initialCalendarDate = isNaN(targetDateObj.getTime()) ? new Date() : targetDateObj;
  const [viewYear, setViewYear] = useState(initialCalendarDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialCalendarDate.getMonth()); // 0-indexed

  // Sync edit state when config prop changes
  useEffect(() => {
    setEditDate(config.targetDate);
    setEditName(config.examName);
    setEditGoal(config.dailyGoal);
    if (config.targetDate === "2027-03-14" || config.targetDate === "2027-08-08") {
      setEditPreset(config.targetDate);
    } else {
      setEditPreset("custom");
    }
  }, [config]);

  // When edit mode opens, focus the first form control
  useEffect(() => {
    if (isEditing) {
      presetSelectRef.current?.focus();
    }
  }, [isEditing]);

  // Date math in Asia/Manila context
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedTarget = config.targetDate ? new Date(`${config.targetDate}T00:00:00`) : new Date(NaN);
  const isTargetValid = !isNaN(parsedTarget.getTime());
  const diffTimeMs = isTargetValid ? parsedTarget.getTime() - today.getTime() : 0;
  const daysUntilExam = Math.ceil(diffTimeMs / (1000 * 60 * 60 * 24));
  const weeksUntilExam = Math.floor(Math.abs(daysUntilExam) / 7);

  const handleOpenEdit = () => {
    setIsEditing(true);
    setFormError(null);
  };

  const handleCancelEdit = () => {
    // Revert edits to current config
    setEditDate(config.targetDate);
    setEditName(config.examName);
    setEditGoal(config.dailyGoal);
    setIsEditing(false);
    setFormError(null);
    changeDateButtonRef.current?.focus();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDate) {
      setFormError("Please enter a valid target date.");
      return;
    }

    const testDate = new Date(`${editDate}T00:00:00`);
    if (isNaN(testDate.getTime())) {
      setFormError("Invalid date format. Please select a valid calendar date.");
      return;
    }

    let finalName = editName.trim();
    if (editPreset === "2027-03-14") {
      finalName = "March 2027 CSE-PPT";
    } else if (editPreset === "2027-08-08") {
      finalName = "August 2027 CSE-PPT";
    } else if (!finalName || finalName === "March 2027 CSE-PPT" || finalName === "August 2027 CSE-PPT") {
      finalName = examShortName ? `${examShortName} Exam` : "Target Exam";
    }

    const validatedGoal = Math.max(5, Math.min(200, Number(editGoal) || 25));
    const newConfig: TargetExamConfig = {
      targetDate: editDate,
      examName: finalName,
      dailyGoal: validatedGoal,
    };

    LocalStorageService.saveTargetExamConfig(newConfig, workspaceId);
    onConfigChange(newConfig);
    setIsEditing(false);
    setFormError(null);

    // Update mini calendar to view the target exam month
    setViewYear(testDate.getFullYear());
    setViewMonth(testDate.getMonth());

    changeDateButtonRef.current?.focus();
  };

  // Mini calendar navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const jumpToToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  // Generate calendar days for viewYear, viewMonth
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const dailyProgressPercent = Math.min(
    100,
    Math.round((dailyAnswered / (config.dailyGoal || 25)) * 100)
  );

  return (
    <section
      aria-labelledby="exam-target-heading"
      className="rounded-[22px] bg-white p-5 sm:p-6 shadow-[0_0_0_1px_rgba(138,22,48,0.12),0_14px_30px_-22px_rgba(90,15,35,0.35)] space-y-5"
    >
      {/* Top Header: Exam Title & Change Date Action */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span id="exam-target-heading">Your Exam</span>
          </div>
          <h3 className="font-display text-lg font-extrabold tracking-[-0.02em] text-slate-900 leading-tight">
            {config.examName || "Target Exam"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTargetValid
              ? parsedTarget.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Set your target exam date"}
          </p>
        </div>

        <button
          ref={changeDateButtonRef}
          type="button"
          onClick={handleOpenEdit}
          className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-800 text-xs font-semibold hover:bg-slate-50 transition"
        >
          {isTargetValid ? "Change date" : "Set date"}
        </button>
      </div>

      {/* Days Remaining / Status Banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-[#f3e6e9] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Target Exam Pacing
          </span>
          {!isTargetValid ? (
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              Choose your scheduled examination date to begin daily pacing.
            </div>
          ) : daysUntilExam > 0 ? (
            <div className="text-base font-bold text-slate-900 mt-0.5">
              <span className="text-brand-700 font-extrabold">{daysUntilExam} days</span> remaining
              {weeksUntilExam > 0 && (
                <span className="text-xs font-normal text-slate-500 ml-1.5">
                  ({weeksUntilExam} {weeksUntilExam === 1 ? "week" : "weeks"})
                </span>
              )}
            </div>
          ) : daysUntilExam === 0 ? (
            <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
              Your exam is today! Good luck!
            </div>
          ) : (
            <div className="text-xs font-semibold text-amber-700 mt-0.5">
              Past scheduled target ({Math.abs(daysUntilExam)} days ago)
            </div>
          )}
        </div>
        <Target className="w-5 h-5 text-brand-700 shrink-0" />
      </div>

      {/* Mini Calendar View */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-1">
          <span>{monthName}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={jumpToToday}
              className="text-[11px] font-semibold text-brand-700 hover:text-brand-800 px-1.5 py-0.5 rounded hover:bg-brand-50"
              title="Jump to current month"
            >
              Today
            </button>
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-1 rounded hover:bg-slate-100 text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1 rounded hover:bg-slate-100 text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 text-center text-xs gap-y-1">
          {/* Leading Empty Cells */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const cellDate = new Date(viewYear, viewMonth, dayNum);
            cellDate.setHours(0, 0, 0, 0);

            const isCellTarget =
              isTargetValid &&
              cellDate.getFullYear() === parsedTarget.getFullYear() &&
              cellDate.getMonth() === parsedTarget.getMonth() &&
              cellDate.getDate() === parsedTarget.getDate();

            const isCellToday =
              cellDate.getFullYear() === today.getFullYear() &&
              cellDate.getMonth() === today.getMonth() &&
              cellDate.getDate() === today.getDate();

            return (
              <div
                key={`day-${dayNum}`}
                className="h-7 flex items-center justify-center relative"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    isCellTarget
                      ? "bg-brand-700 text-white font-extrabold ring-2 ring-brand-300 shadow-xs"
                      : isCellToday
                      ? "border border-brand-400 text-brand-800 font-bold bg-brand-50"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-700" />
            <span>Target Exam</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-brand-400 bg-brand-50" />
            <span>Today</span>
          </span>
        </div>
      </div>

      {/* Daily Goal Gauge */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600">Daily Goal</span>
          <span className="text-slate-900 font-bold">
            {dailyAnswered} / {config.dailyGoal || 25} items
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              dailyAnswered >= (config.dailyGoal || 25) ? "bg-emerald-500" : "bg-brand-600"
            }`}
            style={{ width: `${dailyProgressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          {dailyAnswered >= (config.dailyGoal || 25)
            ? "✓ Daily goal completed for today!"
            : `${(config.dailyGoal || 25) - dailyAnswered} more items to meet your daily target`}
        </p>
      </div>

      {/* Accessible Inline Target Editor (D03 & D05) */}
      {isEditing && (
        <div
          role="dialog"
          aria-labelledby="edit-target-modal-title"
          className="pt-4 border-t border-slate-200 animate-fade-in"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleCancelEdit();
            }
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 id="edit-target-modal-title" className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Edit Target Date &amp; Goal
            </h4>
            <span className="text-[10px] text-slate-400">Press Esc to cancel</span>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
            <div>
              <label
                htmlFor="target-exam-preset"
                className="block text-[11px] font-bold text-slate-700 mb-1"
              >
                Target Exam Schedule
              </label>
              <select
                ref={presetSelectRef}
                id="target-exam-preset"
                value={editPreset}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditPreset(val);
                  if (val === "2027-03-14") {
                    setEditDate("2027-03-14");
                    setEditName("March 2027 CSE-PPT");
                  } else if (val === "2027-08-08") {
                    setEditDate("2027-08-08");
                    setEditName("August 2027 CSE-PPT");
                  } else {
                    setEditName(examShortName ? `${examShortName} Preparation` : "Target Exam");
                  }
                }}
                className="w-full text-xs rounded-lg p-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {examId === "cse" ? (
                  <>
                    <option value="2027-03-14">March 14, 2027 (CSE-PPT Cycle 1)</option>
                    <option value="2027-08-08">August 8, 2027 (CSE-PPT Cycle 2)</option>
                  </>
                ) : (
                  <option value={config.targetDate || "2027-09-26"}>
                    {config.examName || `${examShortName || "Target"} Official Schedule`}
                  </option>
                )}
                <option value="custom">Custom Date / Personal Schedule</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="target-exam-date"
                className="block text-[11px] font-bold text-slate-700 mb-1"
              >
                Target Date
              </label>
              <input
                id="target-exam-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full text-xs rounded-lg p-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="target-exam-name"
                className="block text-[11px] font-bold text-slate-700 mb-1"
              >
                Exam Description / Cycle Name
              </label>
              <input
                id="target-exam-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., March 2027 CSE-PPT"
                className="w-full text-xs rounded-lg p-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="daily-question-goal"
                className="block text-[11px] font-bold text-slate-700 mb-1"
              >
                Daily Question Goal (5-200)
              </label>
              <input
                id="daily-question-goal"
                type="number"
                min="5"
                max="200"
                value={editGoal}
                onChange={(e) => setEditGoal(Number(e.target.value))}
                className="w-full text-xs rounded-lg p-2 bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <span className="text-[10px] text-slate-400">
                Recommended: 15 to 40 questions per day
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f3e6e9]">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Target</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
