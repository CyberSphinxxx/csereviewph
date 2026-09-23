"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";
import { getExamConfig } from "@/config/exams";

export interface HeroExamLevelSelectorProps {
  selectedLevel: "professional" | "subprofessional";
  onSelectLevel: (level: "professional" | "subprofessional") => void;
  /** Anchor target for the compare-levels helper link. */
  compareHref?: string;
}

/**
 * Start panel for the hero: owl on top, radio level chooser, gold diagnostic CTA.
 * The owl's pupils track the visitor's cursor.
 */
export function HeroExamLevelSelector({
  selectedLevel,
  onSelectLevel,
  compareHref = "#compare-levels",
}: HeroExamLevelSelectorProps) {
  const cseConfig = getExamConfig("cse");
  const diagnosticLabel = cseConfig?.diagnostic?.label || "10 questions · 10 minutes";

  const options = [
    {
      id: "professional" as const,
      name: "Professional",
      desc: "2nd-level positions · includes Analytical Ability",
    },
    {
      id: "subprofessional" as const,
      name: "Subprofessional",
      desc: "1st-level positions · includes Clerical Ability",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Owl mascot: centered, pupils follow the cursor */}
      <div className="w-28 sm:w-32 mx-auto -mb-3 relative z-10" aria-hidden="true">
        <ReviewTayoOwl className="w-full h-auto drop-shadow-[0_12px_20px_rgba(90,15,35,0.28)]" bob tracked />
      </div>

      {/* Panel */}
      <div className="relative rounded-3xl bg-white dark:bg-[#1E191C] p-6 shadow-[0_30px_60px_-34px_rgba(60,10,25,0.5)] ring-1 ring-brand-100 dark:ring-slate-800 text-slate-800 dark:text-slate-100 space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-center">
          Start your review
        </h2>

        {/* Level radio options */}
        <div className="space-y-2.5" role="radiogroup" aria-label="Civil Service Exam Level">
          {options.map((opt) => {
            const active = selectedLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSelectLevel(opt.id)}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition active:scale-[0.99] duration-75 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                  active
                    ? "border-brand-700 bg-[#fbeff0] dark:bg-brand-950"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E191C] hover:border-brand-300 dark:hover:border-slate-600"
                }`}
              >
                {/* Radio dot */}
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    active
                      ? "border-brand-700 dark:border-brand-400"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-brand-700 dark:bg-brand-400" />}
                </span>

                <span className="block min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    {opt.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                    {opt.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Primary CTA */}
        <Link
          href={`/exams/${selectedLevel}/quick`}
          prefetch={true}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-[#2a0a12] font-black text-sm sm:text-base shadow-sm transition transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          <span>Start free diagnostic</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>

        {/* Reassurance line */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          {diagnosticLabel} &middot; instant results
        </p>

        {/* Compare helper */}
        <div className="pt-3 text-center border-t border-slate-100 dark:border-slate-800">
          <a
            href={compareHref}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition underline underline-offset-4"
          >
            <span>Not sure which level? Compare the two levels</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
