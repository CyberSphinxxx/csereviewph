import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { ExamCatalogEntry } from "@/config/exams";

interface ReviewerCardProps {
  exam: ExamCatalogEntry;
  featured?: boolean;
}

export function ReviewerCard({ exam, featured = false }: ReviewerCardProps) {
  const isAvailable = exam.availability === "available";

  const categoryLabels: Record<ExamCatalogEntry["category"], string> = {
    "civil-service": "Civil Service",
    licensure: "Licensure",
    "public-safety": "Public Safety",
  };

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        featured
          ? "border-brand-600/80 dark:border-brand-500 bg-white dark:bg-slate-900 shadow-md ring-1 ring-brand-600/20"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
      }`}
    >
      {/* Top Banner & Status */}
      <div className="p-6 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {exam.agency}
          </span>
          <div className="flex items-center gap-1.5">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {exam.badgeText}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <Clock className="w-3 h-3 text-slate-400" />
                {exam.badgeText}
              </span>
            )}
          </div>
        </div>

        {/* Title & Category */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {categoryLabels[exam.category]}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {exam.fullName}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {exam.description}
          </p>
        </div>

        {/* Supported Levels / Tracks */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Covered Levels &amp; Tracks
          </span>
          <div className="space-y-1.5">
            {exam.levels.map((level) => (
              <div
                key={level.id}
                className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    isAvailable ? "text-brand-600 dark:text-brand-400" : "text-slate-400"
                  }`}
                />
                <div>
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    {level.name}
                  </strong>
                  {level.items && level.timeLimitMinutes && (
                    <span className="text-slate-500 dark:text-slate-400 ml-1">
                      ({level.items} items &bull; {Math.floor(level.timeLimitMinutes / 60)}h{" "}
                      {level.timeLimitMinutes % 60 ? `${level.timeLimitMinutes % 60}m` : ""})
                    </span>
                  )}
                  {level.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {level.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-6 sm:p-7 pt-0">
        {isAvailable ? (
          <Link
            href={exam.href}
            prefetch={true}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <span>{exam.actionLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-semibold text-xs border border-slate-200/80 dark:border-slate-800 cursor-not-allowed text-center"
            >
              {exam.actionLabel} &bull; Planned
            </button>
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
              Syllabus research and scope evaluation in progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
