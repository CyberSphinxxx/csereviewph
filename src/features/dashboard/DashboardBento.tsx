"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Bookmark, CheckCircle2 } from "lucide-react";
import type {
  AttemptSummary,
  DailyActivityCell,
  SubjectReadinessMetric,
} from "@/lib/storage";
import type { NextBestStepRecommendation } from "./recommendation-engine";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

export interface WeakestSubject {
  name: string;
  accuracy: number;
}

export interface DashboardBentoProps {
  recommendation: NextBestStepRecommendation;
  mistakeCount: number;
  dueMistakeCount: number;
  bookmarkCount: number;
  dailyAnswered: number;
  dailyGoal: number;
  daysRemaining: number;
  examName: string;
  examDateLabel: string;
  streakDays: number;
  weekCells: DailyActivityCell[];
  avgAccuracy: number | null;
  totalTests: number;
  passedTests: number;
  itemsAnswered: number;
  subjects: SubjectReadinessMetric[];
  history: AttemptSummary[];
  weakest: WeakestSubject | null;
  practiceHref: string;
  diagnosticHref: string;
  showExamTile: boolean;
  showStreakTile: boolean;
  showSubjectTile: boolean;
  showSessionsTile: boolean;
}

const RING_CIRCUMFERENCE = 2 * Math.PI * 34;
const BAR_COLORS = ["#8a1630", "#a81b3b", "#f6b93b", "#8a1630", "#a81b3b", "#f6b93b"];

const TILE =
  "relative overflow-hidden rounded-[22px] p-5 transition-transform duration-300 ease-out hover:-translate-y-1.5";
const LABEL = "block text-[11px] font-extrabold uppercase tracking-[0.08em]";
const WHITE_TILE =
  "bg-white dark:bg-[#1e191c] text-[#1b1216] dark:text-[#f5eff1] shadow-[0_0_0_1px_rgba(138,22,48,0.12),0_14px_30px_-22px_rgba(90,15,35,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]";
const LNK = "text-xs font-extrabold text-[#8a1630] dark:text-[#de5572] hover:underline";

export function DashboardBento({
  recommendation,
  mistakeCount,
  dueMistakeCount,
  bookmarkCount,
  dailyAnswered,
  dailyGoal,
  daysRemaining,
  examName,
  examDateLabel,
  streakDays,
  weekCells,
  avgAccuracy,
  totalTests,
  passedTests,
  itemsAnswered,
  subjects,
  history,
  weakest,
  practiceHref,
  diagnosticHref,
  showExamTile,
  showStreakTile,
  showSubjectTile,
  showSessionsTile,
}: DashboardBentoProps) {
  const [barsIn, setBarsIn] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setBarsIn(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  const goalMet = dailyGoal > 0 && dailyAnswered >= dailyGoal;
  const ringProgress = dailyGoal > 0 ? Math.min(1, dailyAnswered / dailyGoal) : 0;
  const remainingToGoal = Math.max(0, dailyGoal - dailyAnswered);

  const mistakesLabel =
    dueMistakeCount > 0
      ? `${dueMistakeCount} due mistakes`
      : `${mistakeCount} ${mistakeCount === 1 ? "mistake" : "mistakes"}`;
  const bookmarksLabel = `${bookmarkCount} ${bookmarkCount === 1 ? "bookmark" : "bookmarks"}`;

  const tip =
    dueMistakeCount > 0
      ? {
          title: "Review tayo!",
          body: `${dueMistakeCount} ${dueMistakeCount === 1 ? "mistake is" : "mistakes are"} due today — clear them to keep your recall sharp.`,
          cta: "Open mistake bank",
          href: "/dashboard/mistakes",
        }
      : streakDays === 0
        ? {
            title: "Isang tanong lang!",
            body: "Answer one question today to start your study streak — small reps win.",
            cta: "Answer a question",
            href: diagnosticHref,
          }
        : {
            title: "Tuloy-tuloy lang!",
            body: `You're on a ${streakDays}-day streak. Keep the momentum going.`,
            cta: "Practice drills",
            href: practiceHref,
          };

  return (
    <section
      aria-label="Dashboard overview"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 sm:grid-flow-dense md:grid-flow-dense gap-3.5 sm:gap-4"
    >
      {/* For today — dominant wine tile */}
      <div
        className={`${TILE} col-span-1 sm:col-span-2 md:col-span-4 bg-[#2a0a12] text-white shadow-[0_18px_36px_-24px_rgba(42,10,18,0.8)]`}
      >
        <span className="inline-block px-2.5 py-1 rounded-full bg-[#fdeec6] text-[#6b4300] text-[11px] font-extrabold">
          For today &bull; {recommendation.tag}
        </span>
        <h3 className="font-display font-extrabold tracking-[-0.02em] text-2xl sm:text-[27px] leading-tight mt-3 pr-16 sm:pr-28">
          {recommendation.title}
        </h3>
        <p className="text-[#ecc9d0] text-sm leading-relaxed mt-1.5 max-w-[52ch]">
          {recommendation.description}
        </p>
        <Link
          href={recommendation.actionHref}
          prefetch={true}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f6b93b] text-[#2a0a12] text-sm font-extrabold shadow-[0_10px_24px_-12px_rgba(246,185,59,0.8)] hover:-translate-y-0.5 transition-transform mt-4"
        >
          {recommendation.actionLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-5 pt-3.5 border-t border-white/10 text-xs font-semibold text-[#d8b3bc]">
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle
              className={`w-3.5 h-3.5 ${dueMistakeCount > 0 ? "text-[#f6b93b]" : "text-[#8a5a66]"}`}
            />
            {mistakesLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-[#8a5a66]" />
            {bookmarksLabel}
          </span>
          {goalMet ? (
            <span className="inline-flex items-center gap-1.5 text-[#7ee2a8]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Daily goal met ({dailyAnswered}/{dailyGoal} items)
            </span>
          ) : (
            <span>
              Pacing: <b className="text-white">{dailyAnswered}</b> / {dailyGoal} items today
            </span>
          )}
        </div>
        <span className="absolute -bottom-3 right-4 hidden sm:block" aria-hidden="true">
          <ReviewTayoOwl size={88} withCap bob />
        </span>
      </div>

      {/* Target exam countdown — maroon tile */}
      {showExamTile && (
        <div
          className={`${TILE} col-span-1 sm:col-span-1 md:col-span-2 bg-[#8a1630] text-white shadow-[0_18px_36px_-24px_rgba(138,22,48,0.7)] flex flex-col`}
        >
          <span className={`${LABEL} text-[#f3cbd3]`}>Target exam</span>
          <b className="block font-display font-extrabold tracking-[-0.04em] text-6xl sm:text-7xl leading-[0.9] mt-2">
            {daysRemaining}
          </b>
          <em className="not-italic text-[13px] font-bold text-[#f3cbd3] mt-2">
            {daysRemaining === 1 ? "day" : "days"} &middot; {examName}
          </em>
          <em className="not-italic text-xs font-semibold text-[#d8a2ae] mt-0.5">{examDateLabel}</em>
          <Link href="#exam-details" className={`${LNK} !text-[#f6b93b] mt-auto pt-3 self-start`}>
            Manage exam &darr;
          </Link>
        </div>
      )}

      {/* Session stats — white tile */}
      <div className={`${TILE} col-span-1 sm:col-span-1 md:col-span-2 ${WHITE_TILE}`}>
        <span className={`${LABEL} text-[#8a7a80] dark:text-[#a89ba1]`}>Session stats</span>
        <dl className="mt-1.5 divide-y divide-[#f3e6e9] dark:divide-white/10">
          <div className="flex items-center justify-between gap-3 py-2">
            <dt className="text-xs font-bold text-[#5a4a50] dark:text-[#a89ba1]">
              Practice accuracy
            </dt>
            <dd className="font-display font-extrabold tracking-[-0.02em] text-lg">
              {avgAccuracy !== null ? (
                `${avgAccuracy}%`
              ) : (
                <span className="text-sm font-bold">Not measured yet</span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2">
            <dt className="text-xs font-bold text-[#5a4a50] dark:text-[#a89ba1]">
              Tests completed
            </dt>
            <dd className="font-display font-extrabold tracking-[-0.02em] text-lg">{totalTests}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2">
            <dt className="text-xs font-bold text-[#5a4a50] dark:text-[#a89ba1]">
              Items answered
            </dt>
            <dd className="font-display font-extrabold tracking-[-0.02em] text-lg">
              {itemsAnswered}
            </dd>
          </div>
        </dl>
        <p className="text-[11px] font-semibold text-[#8a7a80] dark:text-[#a89ba1] mt-1.5">
          {avgAccuracy !== null
            ? `Study target 80% \u00b7 ${passedTests} met target`
            : "Take a diagnostic to establish baseline"}
        </p>
      </div>

      {/* Study streak — gold tile */}
      {showStreakTile && (
        <div className={`${TILE} col-span-1 sm:col-span-1 md:col-span-2 bg-[#f6b93b] text-[#2a0a12]`}>
          <span className={`${LABEL} text-[#6b4300]`}>Study streak</span>
          <b className="block font-display font-extrabold tracking-[-0.03em] text-4xl mt-2">
            {streakDays} {streakDays === 1 ? "day" : "days"}
          </b>
          <em className="not-italic block text-xs font-bold text-[#6b4300] mt-0.5">
            {streakDays > 0 ? "Daily streak active" : "Answer 1 question today"}
          </em>
          <div className="flex gap-1.5 mt-4" aria-hidden="true">
            {weekCells.map((c) => (
              <i
                key={c.date}
                title={c.formattedDate}
                className={`w-4 h-4 rounded-full ${
                  c.questionCount > 0 || c.hasCheckIn ? "bg-[#2a0a12]" : "bg-black/15"
                } ${c.isToday ? "ring-2 ring-[#2a0a12] ring-offset-2 ring-offset-[#f6b93b]" : ""}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Daily goal — blush tile with ring */}
      <div
        className={`${TILE} col-span-1 sm:col-span-1 md:col-span-2 bg-[#fbeff0] text-[#1b1216] dark:bg-[#351a22] dark:text-[#f5eff1]`}
      >
        <span className={`${LABEL} text-[#8a1630] dark:text-[#fad1da]`}>Daily goal</span>
        <div className="flex items-center gap-4 mt-3">
          <svg viewBox="0 0 84 84" className="w-[88px] flex-none" aria-hidden="true">
            <circle cx="42" cy="42" r="34" fill="none" stroke="#f3dfe3" strokeWidth="9" className="dark:opacity-20" />
            <circle
              cx="42"
              cy="42"
              r="34"
              fill="none"
              stroke={goalMet ? "#12a150" : "#8a1630"}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${(ringProgress * RING_CIRCUMFERENCE).toFixed(1)} ${RING_CIRCUMFERENCE.toFixed(1)}`}
              transform="rotate(-90 42 42)"
              className="transition-all duration-700"
            />
          </svg>
          <div className="min-w-0">
            <b className="block font-display font-extrabold tracking-[-0.02em] text-2xl text-[#8a1630] dark:text-[#fad1da]">
              {dailyAnswered} / {dailyGoal}
            </b>
            <span className="block text-xs font-semibold text-[#7a6a70] dark:text-[#a89ba1] mt-0.5">
              {goalMet
                ? "Daily goal met!"
                : `${remainingToGoal} more ${remainingToGoal === 1 ? "item" : "items"} to go`}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended next — white tile with maroon ring */}
      <Link
        href={weakest ? practiceHref : diagnosticHref}
        prefetch={true}
        className={`${TILE} group col-span-1 sm:col-span-2 md:col-span-2 ${WHITE_TILE} !shadow-[0_0_0_1.5px_rgba(138,22,48,0.4)] dark:!shadow-[0_0_0_1.5px_rgba(222,85,114,0.5)] flex items-center gap-4`}
      >
        <div className="flex-1 min-w-0">
          <span className={`${LABEL} text-[#8a7a80] dark:text-[#a89ba1]`}>Recommended next</span>
          <h4 className="font-display font-extrabold tracking-[-0.02em] text-xl mt-1.5 truncate">
            {weakest ? weakest.name : "Build your baseline"}
          </h4>
          <p className="text-xs font-semibold text-[#7a6a70] dark:text-[#a89ba1] mt-1">
            {weakest
              ? `Weakest at ${weakest.accuracy}% — a topic drill is ready.`
              : "Take a 10-question diagnostic to map your subjects."}
          </p>
        </div>
        <span className="w-11 h-11 rounded-full bg-[#2a0a12] grid place-items-center flex-none transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="w-[18px] h-[18px] text-white" />
        </span>
      </Link>

      {/* Subject progress — white tile with animated bars */}
      {showSubjectTile && (
        <div
          className={`${TILE} col-span-1 sm:col-span-2 md:col-span-4 ${WHITE_TILE}`}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h4 className="font-display font-extrabold tracking-[-0.02em] text-lg">
              Your subject progress
            </h4>
            <Link href={practiceHref} prefetch={true} className={`${LNK} inline-flex items-center gap-1`}>
              All topics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs font-semibold text-[#8a7a80] dark:text-[#a89ba1] mt-0.5">
            Practice accuracy from your recorded sessions &middot; target 80%
          </p>
          <div className="mt-3">
            {subjects.map((s, i) => (
              <div
                key={s.subjectId}
                className="grid grid-cols-[130px_1fr_38px] sm:grid-cols-[160px_1fr_42px] gap-3 items-center mt-2.5"
              >
                <span className="text-[13px] font-bold truncate">{s.subjectName}</span>
                <div className="h-3 rounded-full bg-[#f4e7e9] dark:bg-white/10 overflow-hidden">
                  <i
                    className="block h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: barsIn ? `${s.accuracyPercentage}%` : "0%",
                      backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                    }}
                  />
                </div>
                <span className="text-xs font-extrabold tabular-nums text-right">
                  {s.accuracyPercentage}%
                </span>
              </div>
            ))}
            {subjects.length === 0 && (
              <p className="text-xs font-semibold text-[#8a7a80] dark:text-[#a89ba1] py-2">
                No subjects configured for this exam yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recent sessions — white tile */}
      {showSessionsTile && (
        <div
          className={`${TILE} col-span-1 sm:col-span-2 md:col-span-3 ${WHITE_TILE}`}
        >
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-display font-extrabold tracking-[-0.02em] text-lg">
              Recent sessions
            </h4>
            {history.length > 0 && (
              <Link href="/dashboard/history" prefetch={true} className={LNK}>
                View full history &rarr;
              </Link>
            )}
          </div>
          <div className="mt-3 grid gap-2">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#f0e2e5] dark:border-white/10 px-3.5 py-2.5 transition-colors hover:border-[#8a1630]/50 dark:hover:border-[#de5572]/60"
              >
                <div className="min-w-0">
                  <b className="block text-[13px] leading-snug truncate">{item.title}</b>
                  <span className="text-[11px] font-semibold text-[#8a7a80] dark:text-[#a89ba1]">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    &bull; <span className="capitalize">{item.mode}</span> drill
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-none">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                      item.passed
                        ? "bg-[#e9f8ef] text-[#0e7d3d]"
                        : "bg-[#fdeec6] text-[#6b4300]"
                    }`}
                  >
                    {item.percentage}% &bull; {item.passed ? "Target Met" : "Needs Review"}
                  </span>
                  <Link
                    href={`/results/${item.id}`}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-[#8a1630] dark:text-[#de5572] bg-[#fbeff0] dark:bg-white/10 hover:bg-[#f8edef] dark:hover:bg-white/20 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-4">
                <p className="text-xs font-semibold text-[#8a7a80] dark:text-[#a89ba1]">
                  No test sessions recorded yet.
                </p>
                <Link
                  href={diagnosticHref}
                  prefetch={true}
                  className={`${LNK} inline-flex items-center gap-1 mt-1.5`}
                >
                  Take your first 10-question diagnostic <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Owl tip — blush tile */}
      <div
        className={`${TILE} col-span-1 sm:col-span-2 md:col-span-3 bg-[#fbeff0] dark:bg-[#351a22] text-[#1b1216] dark:text-[#f5eff1] flex items-start gap-4`}
      >
        <span
          className="flex-none transition-transform duration-300 hover:-rotate-6 hover:-translate-y-1"
          aria-hidden="true"
        >
          <ReviewTayoOwl size={64} withCap />
        </span>
        <div className="min-w-0">
          <h4 className="font-display font-extrabold tracking-[-0.02em] text-xl">{tip.title}</h4>
          <p className="text-[13px] font-semibold text-[#5a4a50] dark:text-[#c9b3b9] mt-1">
            {tip.body}
          </p>
          <Link href={tip.href} prefetch={true} className={`${LNK} inline-flex items-center gap-1 mt-2`}>
            {tip.cta} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
