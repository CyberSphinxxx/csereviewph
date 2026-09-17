"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { PeekingOwl } from "@/components/home/PeekingOwl";

export interface HeroExamLevelSelectorProps {
  selectedLevel: "professional" | "subprofessional";
  onSelectLevel: (level: "professional" | "subprofessional") => void;
}

export function HeroExamLevelSelector({
  selectedLevel,
  onSelectLevel,
}: HeroExamLevelSelectorProps) {
  const isPro = selectedLevel === "professional";
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mx-auto w-full max-w-md space-y-2.5">
      {/* Quiet Exam Schedule Line aligned with card's left edge */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-0.5">
        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />
        <span className="font-medium text-slate-700 dark:text-slate-300">Exam schedule</span>
        <span className="text-slate-300 dark:text-slate-700">&middot;</span>
        <span>March 14, 2027</span>
        <span className="text-slate-300 dark:text-slate-700">&middot;</span>
        <Link
          href="/cse/exam-guide#schedule"
          className="inline-flex items-center gap-0.5 font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition underline underline-offset-2 decoration-brand-200 dark:decoration-brand-800 hover:decoration-brand-500"
        >
          <span>View dates</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Card Stacking Context Wrapper */}
      <div className="relative z-0">
        {/* Subtle Full-Body Peeking Owl Mascot (hidden below 1280px, peeking sideways with playful tilt) */}
        <PeekingOwl
          cardRef={cardRef}
          className="hidden xl:block absolute -left-[76px] bottom-1 z-0 w-[160px] h-[334px] -rotate-[11deg] origin-[80%_95%] pointer-events-none select-none"
        />

        {/* Selection Card: Clean white card, thin border, gentle shadow */}
        <div
          ref={cardRef}
          className="relative z-10 rounded-2xl border border-border bg-white dark:bg-[#1E191C] p-5 sm:p-6 shadow-lg shadow-black/5 ring-1 ring-border text-slate-800 dark:text-slate-100 space-y-4"
        >
          {/* Header: Label & Heading */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
              START YOUR REVIEW
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Choose your exam level
            </h2>
          </div>

        {/* Level Radio Options */}
        <div className="space-y-2.5" role="radiogroup" aria-label="Civil Service Exam Level">
          {/* Option: Professional */}
          <button
            type="button"
            role="radio"
            aria-checked={isPro}
            onClick={() => onSelectLevel("professional")}
            className={`w-full text-left p-3.5 rounded-xl border transition active:scale-[0.99] duration-75 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
              isPro
                ? "border-brand-600 dark:border-brand-400 bg-highlight dark:bg-brand-950 shadow-xs ring-1 ring-brand-600 dark:ring-brand-400"
                : "border-border bg-white dark:bg-[#1E191C] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-800/40"
            }`}
          >
            {/* Custom Radio Circle */}
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
                isPro
                  ? "border-brand-600 dark:border-brand-400 bg-brand-600 dark:bg-brand-500"
                  : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >
              {isPro && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>

            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">Professional</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                For second-level positions &middot; <span className="font-medium text-brand-700 dark:text-brand-400">Includes Analytical Ability</span>
              </p>
            </div>
          </button>

          {/* Option: Subprofessional */}
          <button
            type="button"
            role="radio"
            aria-checked={!isPro}
            onClick={() => onSelectLevel("subprofessional")}
            className={`w-full text-left p-3.5 rounded-xl border transition active:scale-[0.99] duration-75 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
              !isPro
                ? "border-brand-600 dark:border-brand-400 bg-highlight dark:bg-brand-950 shadow-xs ring-1 ring-brand-600 dark:ring-brand-400"
                : "border-border bg-white dark:bg-[#1E191C] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-800/40"
            }`}
          >
            {/* Custom Radio Circle */}
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
                !isPro
                  ? "border-brand-600 dark:border-brand-400 bg-brand-600 dark:bg-brand-500"
                  : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >
              {!isPro && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>

            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">Subprofessional</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                For first-level positions &middot; <span className="font-medium text-brand-700 dark:text-brand-400">Includes Clerical Ability</span>
              </p>
            </div>
          </button>
        </div>

        {/* Primary CTA Button */}
        <div className="pt-0.5 space-y-2.5">
          <Link
            href={`/exams/${selectedLevel}/quick`}
            prefetch={true}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm sm:text-base shadow-sm transition transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <span>Start Free Diagnostic</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Reassurance Copy with clear timing signal */}
          <div className="text-center text-xs text-slate-500 space-y-0.5">
            <p>10 questions &middot; 10-minute timer &middot; Starts immediately</p>
            <p className="font-medium text-slate-600 dark:text-slate-400">No account required</p>
          </div>
        </div>

        {/* Comparison Helper Link */}
        <div className="pt-2 text-center border-t border-border">
          <a
            href="#compare-levels"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition underline underline-offset-4 decoration-brand-200 dark:decoration-brand-800 hover:decoration-brand-500"
          >
            <span>Not sure which level? Compare the two levels</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          </a>
        </div>
      </div>
    </div>
  </div>
);
}
