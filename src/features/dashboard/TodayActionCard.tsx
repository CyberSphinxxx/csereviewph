"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Bookmark, CheckCircle2 } from "lucide-react";
import type { NextBestStepRecommendation } from "./recommendation-engine";

interface TodayActionCardProps {
  recommendation: NextBestStepRecommendation;
  mistakeCount: number;
  dueMistakeCount: number;
  bookmarkCount: number;
  dailyAnswered: number;
  dailyGoal: number;
}

export function TodayActionCard({
  recommendation,
  mistakeCount,
  dueMistakeCount,
  bookmarkCount,
  dailyAnswered,
  dailyGoal,
}: TodayActionCardProps) {
  const goalMet = dailyAnswered >= dailyGoal;

  return (
    <section
      aria-labelledby="today-action-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200/60">
              For Today
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {recommendation.tag}
            </span>
          </div>

          <h2
            id="today-action-heading"
            className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-snug"
          >
            {recommendation.title}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            {recommendation.description}
          </p>
        </div>

        <div className="shrink-0 pt-1">
          <Link
            href={recommendation.actionHref}
            prefetch={true}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-brand-700 hover:bg-brand-800 shadow-sm transition active:scale-[0.98] w-full sm:w-auto"
          >
            <span>{recommendation.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quiet Utility Links Row */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            href="/dashboard/mistakes"
            prefetch={true}
            className="inline-flex items-center gap-1.5 hover:text-brand-700 transition"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${dueMistakeCount > 0 ? "text-amber-600" : "text-slate-400"}`} />
            <span>
              <strong className="font-semibold text-slate-800">
                {dueMistakeCount > 0 ? `${dueMistakeCount} due` : `${mistakeCount}`}
              </strong>{" "}
              {mistakeCount === 1 ? "mistake" : "mistakes"}
            </span>
          </Link>

          <Link
            href="/dashboard/bookmarks"
            prefetch={true}
            className="inline-flex items-center gap-1.5 hover:text-brand-700 transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong className="font-semibold text-slate-800">{bookmarkCount}</strong>{" "}
              {bookmarkCount === 1 ? "bookmark" : "bookmarks"}
            </span>
          </Link>
        </div>

        <div className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
          {goalMet ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">
                Daily goal met ({dailyAnswered}/{dailyGoal} items)
              </span>
            </>
          ) : (
            <span>
              Pacing: <strong className="font-semibold text-slate-700">{dailyAnswered}</strong> / {dailyGoal} items today
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
