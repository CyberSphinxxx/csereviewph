"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { ExamCountdown } from "@/components/common/ExamCountdown";
import type { ExamCatalogEntry } from "@/config/exams";

export interface ExamCardProps {
  exam: ExamCatalogEntry;
  variant: "live" | "coming_soon";
  isWideFeatured?: boolean;
  onVote?: (exam: ExamCatalogEntry) => void;
}

/**
 * Reusable ExamCard component supporting both 'live' and 'coming_soon' variants.
 * - Live variant: shows badges, countdown, level & subtest counts, 'Open exam' button,
 *   and 2-click diagnostic shortcuts.
 * - Coming soon variant: muted card, clear badge, and a vote/notify action.
 */
export function ExamCard({
  exam,
  variant,
  isWideFeatured = false,
  onVote,
}: ExamCardProps) {
  const isLive = variant === "live";

  if (isLive) {
    const levels = exam.levels || [];
    const subtests = exam.subtests || [];
    const subtestCount = subtests.length > 0 ? subtests.length : (exam.subjects?.length || 5);
    const levelCount = levels.length > 0 ? levels.length : 2;

    return (
      <article
        className={`rounded-2xl border-2 border-brand-200 dark:border-brand-900/80 bg-white dark:bg-[#1E191C] shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-800 transition-all p-6 sm:p-7 ${
          isWideFeatured ? "w-full" : "flex flex-col justify-between"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            {/* Badges & Header Line */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950 text-xs font-black text-brand-800 dark:text-brand-300">
                  {exam.shortName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {exam.examDate && (
                <ExamCountdown
                  examDate={exam.examDate}
                  scheduleHref={`${exam.href}/exam-guide#schedule`}
                  className="text-xs"
                />
              )}
            </div>

            {/* Exam Title */}
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {exam.fullName}
            </h3>

            {/* Agency, Level count & Subtest count */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <span>{exam.agency}</span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span>{levelCount} {levelCount === 1 ? "level" : "levels"}</span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span>{subtestCount} subtests</span>
            </div>

            {/* Diagnostic Shortcut Line: 2 clicks into diagnostic */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Diagnostic:
              </span>
              <div className="inline-flex items-center gap-2">
                {levels.map((lvl, idx) => (
                  <React.Fragment key={lvl.id}>
                    {idx > 0 && <span className="text-slate-300 dark:text-slate-700">&bull;</span>}
                    <Link
                      href={`/exams/${lvl.id}/quick`}
                      prefetch={true}
                      className="font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 underline underline-offset-2 py-1 px-1.5 rounded hover:bg-brand-50/60 dark:hover:bg-brand-950/40 transition min-h-[36px] sm:min-h-0 inline-flex items-center"
                    >
                      {lvl.shortName}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 flex flex-col justify-center">
            <Link
              href={exam.href}
              prefetch={true}
              className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-sm transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <span>Open exam</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Coming Soon Variant
  return (
    <article className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur-xs transition hover:border-slate-300 dark:hover:border-slate-700 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
            {exam.shortName}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-300/60 dark:border-slate-700/60">
            Coming soon
          </span>
        </div>

        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {exam.fullName}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {exam.description}
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="truncate block font-medium">{exam.agency}</span>
        </div>
      </div>

      {/* Vote / Notify Interest Button (Stub behind feature flag, disabled UI-only by default) */}
      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          type="button"
          onClick={() => onVote?.(exam)}
          aria-label={`Vote for this exam (${exam.shortName})`}
          className="w-full inline-flex min-h-[44px] items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        >
          <Bell className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Vote for this exam</span>
        </button>
      </div>
    </article>
  );
}
