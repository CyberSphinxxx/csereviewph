"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { ExamCard } from "@/components/home/ExamCard";
import {
  EXAM_CATALOG,
  type ExamCatalogEntry,
  type ExamCategory,
  CATEGORY_LABELS,
} from "@/config/exams";

// Search threshold: render search bar only when registry has 8 or more exams
export const SHOW_SEARCH_THRESHOLD = 8;

const CATEGORIES: { id: ExamCategory; label: string }[] = [
  { id: "civil-service", label: "Civil Service" },
  { id: "licensure", label: "Licensure" },
  { id: "public-safety", label: "Public Safety" },
];

export function ExamChooserSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [votedExam, setVotedExam] = useState<string | null>(null);

  // Read active category from URL (?category=civil-service|licensure|public-safety)
  const currentCategoryParam = searchParams?.get("category")?.toLowerCase() as ExamCategory | undefined;
  const activeCategory = (currentCategoryParam && ["civil-service", "licensure", "public-safety"].includes(currentCategoryParam))
    ? currentCategoryParam
    : null;

  // Toggle category filter
  const handleToggleCategory = (catId: ExamCategory) => {
    const nextCategory = activeCategory === catId ? null : catId;
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (nextCategory) {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    startTransition(() => {
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  };

  // Live and Coming Soon exams filtered by category and search
  const { liveExams, comingSoonExams, categoryCounts } = useMemo(() => {
    const counts: Record<ExamCategory, number> = {
      "civil-service": 0,
      licensure: 0,
      "public-safety": 0,
    };

    EXAM_CATALOG.forEach((exam) => {
      if (exam.availability === "available") {
        counts[exam.category] = (counts[exam.category] || 0) + 1;
      }
    });

    const filtered = EXAM_CATALOG.filter((exam) => {
      // Category filter
      if (activeCategory && exam.category !== activeCategory) {
        return false;
      }

      // Search query filter (if active)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = exam.fullName.toLowerCase().includes(q) || exam.shortName.toLowerCase().includes(q);
        const matchesAgency = exam.agency.toLowerCase().includes(q);
        const matchesCat = CATEGORY_LABELS[exam.category]?.toLowerCase().includes(q);
        return matchesName || matchesAgency || matchesCat;
      }

      return true;
    });

    const live = filtered.filter((e) => e.availability === "available");
    const comingSoon = filtered.filter((e) => e.availability !== "available");

    return {
      liveExams: live,
      comingSoonExams: comingSoon,
      categoryCounts: counts,
    };
  }, [activeCategory, searchQuery]);

  // Handler for interest vote (UI-only stub with feedback, ready for backend hookup)
  const handleVote = (exam: ExamCatalogEntry) => {
    // TODO: Connect storage service (Supabase table, Drizzle postgres inquiries, or external form)
    setVotedExam(exam.shortName);
    setTimeout(() => setVotedExam(null), 3000);
  };

  const hasSearch = EXAM_CATALOG.length >= SHOW_SEARCH_THRESHOLD;

  return (
    <section aria-labelledby="exam-chooser-heading" className="w-full space-y-8">
      <h2 id="exam-chooser-heading" className="sr-only">
        Choose your Philippine exam
      </h2>

      {/* Optional Search input (rendered ONLY when threshold >= 8) */}
      {hasSearch && (
        <div className="relative max-w-md mx-auto">
          <label htmlFor="exam-search-input" className="sr-only">
            Search Philippine exams
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="exam-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams, agency, or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-[#1E191C] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* Category Tiles Group */}
      <div
        role="group"
        aria-label="Filter exams by category"
        className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          const countText = count > 0 ? `${count} ${count === 1 ? "exam live" : "exams live"}` : "Coming soon";

          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleToggleCategory(cat.id)}
              className={`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer min-h-[76px] sm:min-h-[88px] flex flex-col justify-center items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 select-none ${
                isSelected
                  ? "border-brand-600 dark:border-brand-500 bg-brand-50/90 dark:bg-brand-950/80 text-brand-900 dark:text-brand-100 shadow-sm ring-1 ring-brand-600 dark:ring-brand-500"
                  : "border-border bg-white dark:bg-[#1E191C] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200"
              }`}
            >
              <span className="text-xs sm:text-sm font-bold block leading-tight">
                {cat.label}
              </span>
              <span
                className={`text-[10px] sm:text-xs font-semibold ${
                  count > 0
                    ? isSelected
                      ? "text-brand-700 dark:text-brand-300 font-bold"
                      : "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {countText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Screen-reader Live Region for announcements */}
      <div aria-live="polite" className="sr-only">
        {activeCategory ? `Filtered by ${CATEGORY_LABELS[activeCategory]}` : "Showing all categories"}
      </div>

      {/* Feedback Banner for Vote Action */}
      {votedExam && (
        <div
          role="status"
          className="max-w-md mx-auto p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 text-center animate-in fade-in zoom-in-95 duration-150"
        >
          Thank you! We registered your interest for {votedExam}.
        </div>
      )}

      {/* SECTION: LIVE EXAMS */}
      {liveExams.length > 0 ? (
        <div className="space-y-3">
          {/* Header line */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            <span>Available now</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              {liveExams.length} {liveExams.length === 1 ? "live reviewer" : "live reviewers"}
            </span>
          </div>

          {/* If exactly 1 live exam: Wide Featured Card. If 2+: Responsive Grid. */}
          {liveExams.length === 1 ? (
            <ExamCard exam={liveExams[0]} variant="live" isWideFeatured={true} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} variant="live" />
              ))}
            </div>
          )}
        </div>
      ) : activeCategory ? (
        /* Honest empty state when selected category has no live exams */
        <div className="p-6 sm:p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No exams live in {CATEGORY_LABELS[activeCategory]} yet.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vote for the next one below to help us prioritize our roadmap.
          </p>
        </div>
      ) : null}

      {/* SECTION: COMING SOON EXAMS */}
      {comingSoonExams.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coming soon: help us choose what&apos;s next</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Regulatory syllabus-aligned reviewers in active development
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comingSoonExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                variant="coming_soon"
                onVote={handleVote}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
