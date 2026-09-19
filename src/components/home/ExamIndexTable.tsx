"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Building2 } from "lucide-react";
import { EXAM_CATALOG } from "@/config/exams";

export function ExamIndexTable() {
  const available = EXAM_CATALOG.filter((exam) => exam.availability === "available");
  const planned = EXAM_CATALOG.filter((exam) => exam.availability !== "available");

  return (
    <div className="space-y-8">
      <section aria-labelledby="available-exams-heading" className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Available now</p>
            <h3 id="available-exams-heading" className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">Start with a live reviewer</h3>
          </div>
          <p className="hidden text-xs text-slate-500 sm:block">Guest practice is available before sign-in.</p>
        </div>

        {available.map((exam) => (
          <article key={exam.id} className="group grid gap-5 rounded-2xl border border-brand-200 bg-white p-5 shadow-2xs transition hover:border-brand-300 hover:shadow-sm sm:grid-cols-[1fr_auto] sm:items-center sm:p-6 dark:border-brand-900 dark:bg-slate-900">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-black text-brand-800 dark:bg-brand-950 dark:text-brand-300">{exam.shortName}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-950 dark:text-white">{exam.fullName}</h4>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{exam.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" aria-hidden="true" />{exam.agency}</span>
                <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" />{exam.levels.map((level) => level.shortName).join(" · ")}</span>
              </div>
            </div>
            <Link href={exam.href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2">
              Open reviewer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>

      <section aria-labelledby="planned-exams-heading" className="space-y-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">In development</p>
          <h3 id="planned-exams-heading" className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">More Philippine exam reviewers are being built</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">These entries show scope and status only. Practice opens after content review is complete.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {planned.map((exam) => (
            <article key={exam.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-black text-slate-900 dark:text-white">{exam.shortName}</span>
                <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">Planned</span>
              </div>
              <h4 className="mt-3 text-sm font-bold leading-snug text-slate-800 dark:text-slate-200">{exam.fullName}</h4>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{exam.levels.map((level) => level.shortName).join(" · ")}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-2 border-t border-border pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
        <p>Official scope references; independently authored practice content.</p>
        <Link href="/reviewers" className="inline-flex min-h-8 items-center gap-1 font-bold text-brand-700 hover:underline dark:text-brand-400">View the full exam library <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
      </div>
    </div>
  );
}
