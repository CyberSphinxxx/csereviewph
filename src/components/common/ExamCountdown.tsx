import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { getExamCountdown } from "@/lib/date-utils";

export interface ExamCountdownProps {
  examDate?: string;
  scheduleHref?: string;
  variant?: "pill" | "subtle";
  className?: string;
}

/**
 * Reusable ExamCountdown component driven by registry examDate.
 * Renders countdown ("175 days until the exam", "1 day until the exam",
 * "Exam is today", "Exam date passed, check the new schedule"),
 * formatted target date, and a "View dates" link.
 */
export function ExamCountdown({
  examDate = "2027-03-14",
  scheduleHref = "/cse/exam-guide#schedule",
  variant = "subtle",
  className = "",
}: ExamCountdownProps) {
  const countdown = getExamCountdown(examDate);

  if (variant === "pill") {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 text-xs text-slate-700 dark:text-slate-300 shadow-2xs ${className}`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 font-medium">
          <Calendar className="w-4 h-4 text-brand-700 dark:text-brand-400 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-slate-600 dark:text-slate-400">Exam schedule</span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span className="font-bold text-slate-900 dark:text-white">{countdown.formattedDate}</span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span className="text-brand-700 dark:text-brand-400 font-bold">{countdown.label}</span>
        </div>
        {scheduleHref && (
          <Link
            href={scheduleHref}
            className="inline-flex items-center gap-0.5 font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 underline underline-offset-2 shrink-0"
          >
            <span>View dates</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-1 ${className}`}
    >
      <div className="flex items-center gap-1.5 font-medium">
        <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" aria-hidden="true" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{countdown.formattedDate}</span>
        <span className="text-slate-300 dark:text-slate-600">&bull;</span>
        <span className="text-brand-700 dark:text-brand-400 font-bold">{countdown.label}</span>
      </div>
      {scheduleHref && (
        <Link
          href={scheduleHref}
          className="inline-flex items-center gap-0.5 font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 underline underline-offset-2 decoration-brand-200 dark:decoration-brand-800"
        >
          <span>View dates</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
