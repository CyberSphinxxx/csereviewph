"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { StudyGuide } from "@/lib/content/types";

const SUBJECT_BADGES: Record<string, string> = {
  "General Information": "bg-[#fbeff0] text-[#8a1630] dark:bg-[#3b1a25] dark:text-[#ff9fb5]",
  "Verbal Ability": "bg-[#fdeec6] text-[#6b4300] dark:bg-[#4a3410] dark:text-[#fdeec6]",
  "Numerical Ability": "bg-[#dce6f8] text-[#1f3a6e] dark:bg-[#1f304f] dark:text-[#cce0ff]",
  "Analytical Ability": "bg-[#e6dcf7] text-[#45276f] dark:bg-[#352152] dark:text-[#e1d3f7]",
  "Clerical Ability": "bg-[#d7efe0] text-[#14532d] dark:bg-[#133a22] dark:text-[#c2ebd0]",
};

const LEVEL_FILTERS = [
  { id: "all", label: "All levels" },
  { id: "Professional", label: "Professional" },
  { id: "Subprofessional", label: "Subprofessional" },
] as const;

export function GuideCardsGrid({ guides }: { guides: StudyGuide[] }) {
  const [level, setLevel] = useState<(typeof LEVEL_FILTERS)[number]["id"]>("all");

  const hasLevels = guides.some((g) => g.level !== "All");
  const visible =
    level === "all"
      ? guides
      : guides.filter((g) => g.level === level || g.level === "All");

  return (
    <div>
      {hasLevels && (
        <div
          role="group"
          aria-label="Filter guides by exam level"
          className="inline-flex gap-1 p-1 rounded-full bg-[#f6ecee] dark:bg-[#1f1017]"
        >
          {LEVEL_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={level === f.id}
              onClick={() => setLevel(f.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
                level === f.id
                  ? "bg-[#8a1630] text-white shadow-[0_6px_16px_-8px_rgba(138,22,48,0.7)]"
                  : "text-[#7a6a70] dark:text-[#d8c2c9] hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${hasLevels ? "mt-4" : ""}`}>
        {visible.map((guide) => {
          const badge = SUBJECT_BADGES[guide.subject] ?? "bg-[#fbeff0] text-[#8a1630] dark:bg-[#3b1a25] dark:text-[#ff9fb5]";
          return (
            <article
              key={guide.slug}
              className="group bg-white dark:bg-[#2b1620] rounded-2xl p-6 flex flex-col shadow-[0_0_0_1px_rgba(138,22,48,0.08),0_14px_30px_-22px_rgba(90,15,35,0.45)] hover:bg-[#fdf1f2] dark:hover:bg-[#3b1a25] hover:shadow-[0_22px_40px_-24px_rgba(90,15,35,0.55)] transition-[background-color,box-shadow] duration-300"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg ${badge}`}>
                  {guide.subject}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#9a8a90] dark:text-[#a89ba1]">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {guide.readTimeMinutes} min
                </span>
              </div>

              <h3 className="font-display font-extrabold tracking-[-0.015em] text-[17px] leading-snug mt-3 text-[#1b1216] dark:text-[#f8ecee]">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="hover:text-[#8a1630] dark:hover:text-[#ff9fb5] transition-colors"
                >
                  {guide.title}
                </Link>
              </h3>

              <p className="text-[13px] text-[#5a4a50] dark:text-[#d8c2c9] leading-relaxed mt-2">
                {guide.description}
              </p>

              {guide.sources && guide.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {guide.sources.slice(0, 2).map((src, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a7a80] dark:text-[#a89ba1] bg-[#f9f1f3] dark:bg-[#1f1017] rounded-lg px-2 py-0.5"
                    >
                      ◈ {src.publisher || src.title}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[#f6ecee] dark:border-white/10 mt-auto pt-3">
                <span className="text-xs font-semibold text-[#9a8a90] dark:text-[#a89ba1]">
                  Scope: <strong className="text-[#3a2c32] dark:text-[#f8ecee]">{guide.level}</strong>
                </span>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#8a1630] dark:text-[#ff9fb5]"
                >
                  Read guide
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
