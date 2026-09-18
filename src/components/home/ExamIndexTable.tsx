"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EXAM_CATALOG, type ExamCatalogEntry } from "@/config/exams";

function getAgencyAcronym(agency: string): { acronym: string; full: string } {
  if (agency.includes("CSC") && !agency.includes("BFP")) {
    return { acronym: "CSC", full: "Civil Service Commission" };
  }
  if (agency.includes("PRC")) {
    return { acronym: "PRC", full: "Professional Regulation Commission" };
  }
  if (agency.includes("BFP")) {
    return { acronym: "BFP & CSC", full: "Bureau of Fire Protection & CSC" };
  }
  if (agency.includes("NAPOLCOM")) {
    return { acronym: "NAPOLCOM", full: "National Police Commission" };
  }
  return { acronym: agency, full: agency };
}

function getLevelsSummary(exam: ExamCatalogEntry): string {
  if (!exam.levels || exam.levels.length === 0) return "";
  return exam.levels.map((l) => l.shortName || l.name).join(" · ");
}

export function ExamIndexTable() {
  return (
    <div className="w-full">
      {/* Editorial Table Header (Desktop Only) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-3 border-b-2 border-slate-900/10 dark:border-white/10 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        <div className="lg:col-span-1">No.</div>
        <div className="lg:col-span-5">Philippine Examination / Tracks</div>
        <div className="lg:col-span-3">Regulating Authority</div>
        <div className="lg:col-span-1 text-center">Status</div>
        <div className="lg:col-span-2 text-right">Access</div>
      </div>

      {/* Horizontal Editorial Rows */}
      <div className="divide-y divide-border">
        {EXAM_CATALOG.map((exam, index) => {
          const isAvailable = exam.availability === "available";
          const formattedIndex = String(index + 1).padStart(2, "0");
          const agencyInfo = getAgencyAcronym(exam.agency);
          const levelsText = getLevelsSummary(exam);

          return (
            <div
              key={exam.id}
              className={`group relative transition-colors duration-150 py-5 sm:py-6 lg:py-5 ${
                isAvailable
                  ? "hover:bg-brand-50/50 dark:hover:bg-brand-950/20"
                  : "hover:bg-slate-50/60 dark:hover:bg-slate-900/30"
              }`}
            >
              {/* DESKTOP ROW (lg+) */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                {/* Index Number */}
                <div className="lg:col-span-1">
                  <span
                    className={`font-mono text-xs font-bold tracking-wider transition-colors ${
                      isAvailable
                        ? "text-brand-700 dark:text-brand-400 group-hover:text-brand-800 dark:group-hover:text-brand-300"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {formattedIndex}
                  </span>
                </div>

                {/* Examination Title & Sub-tracks */}
                <div className="lg:col-span-5 space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    {isAvailable ? (
                      <Link
                        href={exam.href}
                        prefetch={true}
                        className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors focus-visible:outline-none focus-visible:underline decoration-brand-600 underline-offset-4"
                      >
                        {exam.fullName}
                      </Link>
                    ) : (
                      <span className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        {exam.fullName}
                      </span>
                    )}
                  </div>
                  {levelsText && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {levelsText}
                    </p>
                  )}
                </div>

                {/* Regulating Authority */}
                <div className="lg:col-span-3 space-y-0.5">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {agencyInfo.acronym}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {agencyInfo.full}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="lg:col-span-1 text-center">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      IN RESEARCH
                    </span>
                  )}
                </div>

                {/* Action CTA */}
                <div className="lg:col-span-2 text-right">
                  {isAvailable ? (
                    <Link
                      href={exam.href}
                      prefetch={true}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 group/link transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded px-2 py-1"
                      aria-label={`Open ${exam.shortName} Reviewer`}
                    >
                      <span>Open reviewer</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transform-none" />
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Planned reviewer
                    </span>
                  )}
                </div>
              </div>

              {/* MOBILE / TABLET ROW (< lg) */}
              <div className="lg:hidden flex flex-col space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`font-mono text-xs font-bold ${
                        isAvailable
                          ? "text-brand-700 dark:text-brand-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {formattedIndex}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {agencyInfo.acronym}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      IN RESEARCH
                    </span>
                  )}
                </div>

                {/* Exam Title */}
                <div>
                  {isAvailable ? (
                    <Link
                      href={exam.href}
                      prefetch={true}
                      className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-brand-700 dark:hover:text-brand-300 transition-colors block leading-snug"
                    >
                      {exam.fullName}
                    </Link>
                  ) : (
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {exam.fullName}
                    </h3>
                  )}
                </div>

                {/* Sub-tracks and Agency Description */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {levelsText && <span className="font-medium text-slate-600 dark:text-slate-300">{levelsText}</span>}
                  {levelsText && <span>&bull;</span>}
                  <span>{agencyInfo.full}</span>
                </div>

                {/* Action on Mobile */}
                <div className="pt-1">
                  {isAvailable ? (
                    <Link
                      href={exam.href}
                      prefetch={true}
                      className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 py-1"
                    >
                      <span>Open reviewer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Planned reviewer &bull; Syllabus research
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editorial Registry Footer Note */}
      <div className="pt-6 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-border">
        <p className="leading-relaxed">
          Official syllabi guidelines referenced. Content independently authored per ReviewTayo original question policy.
        </p>
        <Link
          href="/reviewers"
          prefetch={true}
          className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white transition shrink-0"
        >
          <span>View full repository directory</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
