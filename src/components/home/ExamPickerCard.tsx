"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PeekingOwl } from "@/components/home/PeekingOwl";
import { ExamCountdown } from "@/components/common/ExamCountdown";
import { useExamLevel } from "@/lib/hooks/useExamLevel";
import { getExamConfig } from "@/config/exams";

export interface ExamPickerCardProps {
  initialLevel?: "professional" | "subprofessional";
}

export function ExamPickerCard({ initialLevel }: ExamPickerCardProps = {}) {
  const [selectedLevel, setSelectedLevel] = useExamLevel<"professional" | "subprofessional">("cse");
  const cardRef = useRef<HTMLDivElement>(null);
  void initialLevel;

  const cseConfig = getExamConfig("cse");
  const levels = cseConfig?.levels || [];
  const proLevel = levels.find((l) => l.id === "professional");
  const subproLevel = levels.find((l) => l.id === "subprofessional");

  const isPro = selectedLevel === "professional";
  const activeLevel = isPro ? proLevel : subproLevel;
  const diagnostic = cseConfig?.diagnostic || {
    label: "10 questions · 10 minutes",
  };

  return (
    <div className="relative mx-auto w-full max-w-md space-y-2.5">
      {/* Exam Countdown Banner aligned above card */}
      <ExamCountdown
        examDate={cseConfig?.examDate || "2027-03-14"}
        scheduleHref="/cse/exam-guide#schedule"
      />

      {/* Card Stacking Context Wrapper with Peeking Mascot */}
      <div className="relative z-0">
        {/* Subtle decorative peeking mascot (hidden on mobile, playful on XL) */}
        <PeekingOwl
          cardRef={cardRef}
          className="hidden xl:block absolute -left-[72px] bottom-2 z-0 w-[150px] h-[310px] -rotate-[10deg] origin-[80%_95%] pointer-events-none select-none opacity-90"
        />

        {/* The Exam Picker Card */}
        <div
          ref={cardRef}
          className="relative z-10 rounded-2xl border border-border bg-white dark:bg-[#1E191C] p-5 sm:p-6 shadow-xl shadow-brand-950/5 ring-1 ring-border text-slate-800 dark:text-slate-100 space-y-4"
        >
          {/* Eyebrow & Live Exam Heading */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 block font-semibold">
              Choose the exam you’re preparing for
            </span>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white tracking-tight">
                {cseConfig?.fullName || "Civil Service Exam (CSE)"}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official CSC scope with authentic single continuous timer.
            </p>
          </div>

          {/* Level Radio Options (Accessible Radiogroup) */}
          <div className="space-y-2" role="radiogroup" aria-label="Choose exam level">
            {/* Professional Option */}
            <button
              type="button"
              role="radio"
              aria-checked={isPro}
              onClick={() => setSelectedLevel("professional")}
              className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                isPro
                  ? "border-brand-600 dark:border-brand-400 bg-brand-50/70 dark:bg-brand-950/50 shadow-2xs ring-1 ring-brand-600 dark:ring-brand-400"
                  : "border-border bg-white dark:bg-[#1E191C] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
                  isPro
                    ? "border-brand-600 dark:border-brand-400 bg-brand-600 dark:bg-brand-500"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                {isPro && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {proLevel?.shortName || "Professional"}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {proLevel?.items || 170} items &bull; 3h 10m
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {proLevel?.description || "For second-level positions"} &bull;{" "}
                  <strong className="text-brand-800 dark:text-brand-300 font-semibold">
                    Includes Analytical Ability
                  </strong>
                </p>
              </div>
            </button>

            {/* Subprofessional Option */}
            <button
              type="button"
              role="radio"
              aria-checked={!isPro}
              onClick={() => setSelectedLevel("subprofessional")}
              className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                !isPro
                  ? "border-brand-600 dark:border-brand-400 bg-brand-50/70 dark:bg-brand-950/50 shadow-2xs ring-1 ring-brand-600 dark:ring-brand-400"
                  : "border-border bg-white dark:bg-[#1E191C] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
                  !isPro
                    ? "border-brand-600 dark:border-brand-400 bg-brand-600 dark:bg-brand-500"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                {!isPro && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {subproLevel?.shortName || "Subprofessional"}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {subproLevel?.items || 165} items &bull; 2h 40m
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {subproLevel?.description || "For first-level positions"} &bull;{" "}
                  <strong className="text-brand-800 dark:text-brand-300 font-semibold">
                    Includes Clerical Ability
                  </strong>
                </p>
              </div>
            </button>
          </div>

          {/* Primary Action Button: Straight into Free Diagnostic */}
          <div className="space-y-2 pt-1">
            <Link
              href={`/exams/${selectedLevel}/quick`}
              prefetch={true}
              className="w-full inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm sm:text-base shadow-sm transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              <span>Start free diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {diagnostic.label}
              </span>
              <span>&bull;</span>
              <span>Starts immediately</span>
              <span>&bull;</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">No account needed</span>
            </div>
          </div>

          {/* Secondary Action Link: View Exam Overview */}
          <div className="pt-2 text-center border-t border-border">
            <Link
              href={`/cse?level=${selectedLevel}`}
              prefetch={true}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition hover:underline"
            >
              <span>View exam overview &amp; full syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Real Data Stats Row - Verified numbers only */}
          <div className="pt-2 border-t border-border/70 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/60">
              <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">5</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Subtests</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/60">
              <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                {activeLevel?.items || (isPro ? 170 : 165)}
              </div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Full mock items</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/60">
              <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                {isPro ? "3h 10m" : "2h 40m"}
              </div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Continuous timer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

