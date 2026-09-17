"use client";

import { useState } from "react";
import { Sparkles, Layers } from "lucide-react";
import {
  EXAM_CATALOG,
  type ExamCategory,
} from "@/config/exams";
import { ReviewerCard } from "@/components/reviewers/ReviewerCard";

interface ReviewerCatalogProps {
  initialCategory?: ExamCategory | "all";
  showCategoryTabs?: boolean;
}

export function ReviewerCatalog({
  initialCategory = "all",
  showCategoryTabs = true,
}: ReviewerCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | "all">(
    initialCategory
  );

  const categories: Array<{ id: ExamCategory | "all"; label: string }> = [
    { id: "all", label: "All Reviewers" },
    { id: "civil-service", label: "Civil Service" },
    { id: "licensure", label: "Professional Licensure" },
    { id: "public-safety", label: "Public Safety" },
  ];

  const filteredExams = EXAM_CATALOG.filter((exam) => {
    if (selectedCategory === "all") return true;
    return exam.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      {showCategoryTabs && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                selectedCategory === cat.id
                  ? "bg-brand-700 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Reviewer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {filteredExams.map((exam) => (
          <ReviewerCard
            key={exam.id}
            exam={exam}
            featured={exam.availability === "available"}
          />
        ))}

        {/* Designated Research & Backlog Card (Not a fake product page) */}
        {selectedCategory === "all" && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  ReviewTayo Roadmap
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                  In Research
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                More Philippine Exams
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We are actively evaluating candidate examinations based on syllabus clarity, official regulatory guidelines, and examinee demand.
              </p>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Strict Content Quality Gates</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Every reviewer undergoes comprehensive syllabus scoping, 100% original question authoring, multi-stage editorial review, and timed pacing calibration before launch.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Zero copied or scraped content &bull; Purely original items
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
