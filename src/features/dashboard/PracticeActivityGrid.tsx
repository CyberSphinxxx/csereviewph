"use client";

import React, { useState, useEffect } from "react";
import { Flame, Calendar, Info } from "lucide-react";
import {
  LocalStorageService,
  type DailyActivityCell,
} from "@/lib/storage";

interface PracticeActivityGridProps {
  streakDays: number;
}

export function PracticeActivityGrid({ streakDays }: PracticeActivityGridProps) {
  const [cells, setCells] = useState<DailyActivityCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<DailyActivityCell | null>(null);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    // Record today's check-in
    LocalStorageService.recordDailyCheckIn();

    const streakData = LocalStorageService.getStudyStreak();
    setLongestStreak(streakData.longestStreak);

    // 12 weeks = 84 days
    const gridData = LocalStorageService.getActivityGridData(12);
    setCells(gridData);

    // Default selected cell to today
    const todayCell = gridData.find((c) => c.isToday) || gridData[gridData.length - 1];
    if (todayCell) {
      setSelectedCell(todayCell);
    }
  }, [streakDays]);

  // Calculate active days this current calendar week (Sunday to Saturday)
  const currentDayOfWeek = new Date().getDay(); // 0 = Sun ... 6 = Sat
  const recentWeekCells = cells.slice(- (currentDayOfWeek + 1));
  const activeDaysThisWeek = recentWeekCells.filter(
    (c) => c.questionCount > 0 || c.hasCheckIn
  ).length;

  const streakText = LocalStorageService.formatDayStreak(streakDays);

  return (
    <section
      aria-labelledby="activity-grid-heading"
      className="rounded-[22px] bg-white p-5 sm:p-6 shadow-[0_0_0_1px_rgba(138,22,48,0.12),0_14px_30px_-22px_rgba(90,15,35,0.35)] space-y-4"
    >
      {/* Header: Streak & Weekly Active Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f3e6e9]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Consistency Tracker
            </span>
          </div>
          <h3 id="activity-grid-heading" className="font-display text-xl font-extrabold tracking-[-0.02em] text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>{streakText} study streak</span>
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-slate-600">
            <strong className="font-bold text-slate-900">{activeDaysThisWeek}</strong> active {activeDaysThisWeek === 1 ? "day" : "days"} this week
          </div>
          <div className="text-slate-400 hidden sm:inline">&bull;</div>
          <div className="text-slate-500">
            Longest streak: <strong className="font-semibold text-slate-700">{LocalStorageService.formatDayStreak(longestStreak)}</strong>
          </div>
        </div>
      </div>

      {/* GitHub-style Contribution Grid */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="min-w-[560px]">
          {/* Day of Week Labels + Grid Columns */}
          <div className="flex gap-2">
            {/* Day of week abbreviations */}
            <div className="grid grid-rows-7 text-[9px] font-semibold text-slate-400 py-0.5 w-6 select-none leading-3">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Grid of 12 columns (each column is 7 days) */}
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1">
              {cells.map((cell) => {
                const isSelected = selectedCell?.date === cell.date;

                // Color styling based on activity
                let cellClass = "bg-slate-100 border border-transparent text-transparent";
                if (cell.activityLevel === 3) {
                  cellClass = "bg-emerald-600 border border-emerald-700 text-white";
                } else if (cell.activityLevel === 2) {
                  cellClass = "bg-emerald-400 border border-emerald-500 text-slate-900";
                } else if (cell.activityLevel === 1) {
                  cellClass = "bg-emerald-200 border border-emerald-300 text-slate-900";
                } else if (cell.hasCheckIn) {
                  // Check-in only: outlined
                  cellClass = "bg-brand-50/60 border border-brand-400 text-brand-800";
                }

                if (cell.isToday) {
                  cellClass += " ring-2 ring-brand-600 ring-offset-1";
                }

                return (
                  <button
                    key={cell.date}
                    type="button"
                    onClick={() => setSelectedCell(cell)}
                    onMouseEnter={() => setSelectedCell(cell)}
                    onFocus={() => setSelectedCell(cell)}
                    aria-label={`${cell.formattedDate}: ${
                      cell.questionCount > 0
                        ? `${cell.questionCount} questions answered`
                        : cell.hasCheckIn
                        ? "Check-in visited"
                        : "No study activity"
                    }`}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] transition transform hover:scale-125 focus:scale-125 focus:outline-none cursor-pointer ${cellClass} ${
                      isSelected ? "ring-2 ring-slate-900 ring-offset-1 z-10" : ""
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Focused Cell Details & Text Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[#f3e6e9]">
        {/* Selected Date Summary */}
        <div className="text-slate-700 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {selectedCell ? (
            <span>
              <strong className="font-semibold text-slate-900">{selectedCell.formattedDate}</strong>:{" "}
              {selectedCell.questionCount > 0 ? (
                <>
                  <strong className="text-emerald-700 font-bold">{selectedCell.questionCount}</strong>{" "}
                  {selectedCell.questionCount === 1 ? "question answered" : "questions answered"}
                  {selectedCell.sessionsCount > 0 && ` (${selectedCell.sessionsCount} test sessions)`}
                </>
              ) : selectedCell.hasCheckIn ? (
                <span className="text-brand-700 font-medium">Daily check-in (no questions)</span>
              ) : (
                <span className="text-slate-400">No activity recorded</span>
              )}
            </span>
          ) : (
            <span className="text-slate-400">Hover or click a cell to view daily activity</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="text-slate-400">Less</span>
          <span className="w-3 h-3 rounded-[2px] bg-slate-100 border border-slate-200" title="No activity" />
          <span className="w-3 h-3 rounded-[2px] bg-brand-50 border border-brand-400" title="Check-in only" />
          <span className="w-3 h-3 rounded-[2px] bg-emerald-200 border border-emerald-300" title="1-10 questions" />
          <span className="w-3 h-3 rounded-[2px] bg-emerald-400 border border-emerald-500" title="11-25 questions" />
          <span className="w-3 h-3 rounded-[2px] bg-emerald-600 border border-emerald-700" title="26+ questions" />
          <span className="text-slate-400">More</span>
        </div>
      </div>

      {/* Explanatory Rule */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-[#f3e6e9] text-[11px] text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Streak rule:</strong> Answer at least 1 question per day to advance your study streak. Visiting the dashboard records a daily check-in.
        </span>
      </div>
    </section>
  );
}
