"use client";

import React from "react";
import { Search, X } from "lucide-react";
import {
  EXAM_GROUPS,
  EXAM_FAMILIES,
  DIRECTORY_EXAMS,
  isExamInGroup,
  matchesSearchQuery,
  getLiveExamsCount,
} from "@/config/exam-directory";
import { ExamTicketCard } from "@/components/reviewers/ExamTicketCard";
import { ExamSuggestionBar } from "@/components/reviewers/ExamSuggestionBar";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

export interface ExamCatalogSectionProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedGroupIds: string[] | null;
  selectedLabel: string;
  onSelectGroup: (gid: string | null) => void;
  onClearFilterPill: () => void;
  liveOnly: boolean;
  onToggleLiveOnly: (live: boolean) => void;
  shownCount: number;
  onShowMore: () => void;
  catalogRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const POPULAR_QUERIES = [
  "civil service",
  "teacher",
  "nurse",
  "engineer",
  "police",
  "scholarship",
];

export function ExamCatalogSection({
  query,
  onQueryChange,
  selectedGroupIds,
  selectedLabel,
  onSelectGroup,
  onClearFilterPill,
  liveOnly,
  onToggleLiveOnly,
  shownCount,
  onShowMore,
  catalogRef,
  searchInputRef,
}: ExamCatalogSectionProps) {
  const liveCount = getLiveExamsCount();

  // Base list of exams matching current text search and live toggle
  const baseExams = DIRECTORY_EXAMS.filter((exam) => {
    if (liveOnly && !exam.live) return false;
    if (!matchesSearchQuery(exam, query)) return false;
    return true;
  });

  // Filtered by selected category group(s)
  const filteredExams = baseExams.filter((exam) => {
    if (!selectedGroupIds || selectedGroupIds.length === 0) return true;
    return selectedGroupIds.some((gid) => isExamInGroup(exam, gid));
  });

  const displayedExams = filteredExams.slice(0, shownCount);
  const remainingCount = filteredExams.length - displayedExams.length;

  const isMultiFilter = Boolean(selectedGroupIds && selectedGroupIds.length > 1);
  const singleSelectedGroup =
    selectedGroupIds && selectedGroupIds.length === 1 ? selectedGroupIds[0] : null;

  const handlePopularClick = (popularQ: string) => {
    onQueryChange(popularQ);
    searchInputRef.current?.focus({ preventScroll: true });
  };

  const handleClearSearch = () => {
    onQueryChange("");
    searchInputRef.current?.focus();
  };

  return (
    <section
      ref={catalogRef}
      id="catalog"
      className="py-16 sm:py-24 bg-transparent text-[#1b1216] dark:text-[#f8ecee] scroll-mt-20 border-b border-[#8a1630]/10 dark:border-white/10"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-11">
        {/* Catalog Header & Search */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1b1216] dark:text-[#f8ecee] leading-tight tracking-tight">
            Search every exam.
          </h2>
          <p className="text-sm sm:text-base font-semibold text-[#5a4a50] dark:text-[#d6bcc3] mt-3">
            {DIRECTORY_EXAMS.length} exams on the list · {liveCount} live today
          </p>

          {/* Search Box */}
          <div className="mt-7 relative flex items-center gap-3 bg-white/95 dark:bg-[#2b1620] rounded-2xl sm:rounded-[22px] p-2.5 sm:p-3 pl-4 sm:pl-5 border-2 border-[#8a1630]/15 dark:border-white/15 shadow-[0_16px_36px_-24px_rgba(90,15,35,0.2)] dark:shadow-[0_16px_36px_-24px_rgba(0,0,0,0.6)] focus-within:border-[#8a1630] dark:focus-within:border-[#ff9fb5] focus-within:ring-2 focus-within:ring-[#8a1630]/20 transition-all">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#8a1630] dark:text-[#ff9fb5] shrink-0" />
            <input
              ref={searchInputRef}
              id="eq"
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Try “nurse”, “CPA” or “UPCAT”"
              autoComplete="off"
              aria-label="Search exams"
              className="flex-1 min-w-0 border-0 outline-none bg-transparent text-lg sm:text-2xl font-semibold text-[#1b1216] dark:text-[#f8ecee] placeholder:text-[#5a4a50]/70 dark:placeholder:text-[#d6bcc3]/70 py-2 sm:py-3"
            />

            {query ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="w-8 h-8 rounded-full bg-[#f6ecee] dark:bg-[#3a1f29] hover:bg-[#fbeff0] dark:hover:bg-[#4a2130] grid place-items-center cursor-pointer transition-colors text-[#5a4a50] dark:text-[#d6bcc3] shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-2.5 py-1 text-xs font-bold rounded-lg bg-[#f6ecee] dark:bg-[#3a1f29] text-[#5a4a50] dark:text-[#d6bcc3] shadow-[inset_0_-2px_0_rgba(138,22,48,0.14)] dark:shadow-[inset_0_-2px_0_rgba(255,255,255,0.1)] select-none">
                /
              </kbd>
            )}
          </div>

          {/* Popular Search Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs sm:text-sm font-semibold text-[#5a4a50] dark:text-[#d6bcc3]">
            <span>Popular:</span>
            {POPULAR_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handlePopularClick(q)}
                className="px-3 py-1 rounded-full bg-white/80 dark:bg-[#2b1620] border border-[#8a1630]/15 dark:border-white/15 hover:bg-[#8a1630] hover:text-white dark:hover:bg-[#8a1630] dark:hover:text-white transition-colors cursor-pointer text-xs sm:text-sm font-semibold text-[#1b1216] dark:text-[#f8ecee]"
              >
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Catalog Grid: Category Sidebar + Results Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] gap-8 sm:gap-10 items-start">
          {/* Category Sidebar */}
          <nav
            aria-label="Exam categories"
            className="lg:sticky lg:top-[90px] flex lg:grid overflow-x-auto lg:overflow-visible gap-1.5 p-1 pb-3 lg:pb-0 c-rail min-w-0 w-full max-w-full"
          >
            <h3 className="hidden lg:block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#5a4a50] dark:text-[#d6bcc3] mb-2 px-3">
              Categories
            </h3>

            {/* All Exams Button */}
            <button
              type="button"
              onClick={() => onSelectGroup(null)}
              aria-current={!selectedGroupIds ? "true" : undefined}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap lg:whitespace-normal ${
                !selectedGroupIds
                  ? "bg-white dark:bg-[#2b1620] border-[#8a1630] dark:border-[#ff9fb5] shadow-xs text-[#1b1216] dark:text-[#f8ecee] font-bold ring-1 ring-[#8a1630] dark:ring-[#ff9fb5]"
                  : "bg-transparent border-transparent hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25] text-[#5a4a50] dark:text-[#d6bcc3]"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8a1630] shrink-0" />
              <span className="flex-1">All exams</span>
              <em className="not-italic font-bold text-xs text-[#5a4a50] dark:text-[#d6bcc3] tabular-nums">
                {baseExams.length}
              </em>
            </button>

            {/* 16 Category Groups */}
            {EXAM_GROUPS.map((grp) => {
              const groupCount = baseExams.filter((x) => isExamInGroup(x, grp.id)).length;
              const isSelected = singleSelectedGroup === grp.id;
              const familyConfig = EXAM_FAMILIES[grp.family];

              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => onSelectGroup(grp.id)}
                  aria-current={isSelected ? "true" : undefined}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap lg:whitespace-normal ${
                    isSelected
                      ? "bg-white dark:bg-[#2b1620] border-[#8a1630] dark:border-[#ff9fb5] shadow-xs text-[#1b1216] dark:text-[#f8ecee] font-bold ring-1 ring-[#8a1630] dark:ring-[#ff9fb5]"
                      : "bg-transparent border-transparent hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25] text-[#5a4a50] dark:text-[#d6bcc3]"
                  } ${groupCount === 0 ? "opacity-40" : ""}`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: familyConfig.style.bg }}
                  />
                  <span className="flex-1">{grp.name}</span>
                  <em className="not-italic font-bold text-xs text-[#5a4a50] dark:text-[#d6bcc3] tabular-nums">
                    {groupCount}
                  </em>
                </button>
              );
            })}
          </nav>

          {/* Tickets Column */}
          <div className="min-w-0">
            {/* Multi-Category Filter Pill */}
            {isMultiFilter && (
              <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-[#fbeff0] dark:bg-[#3b1a25] text-[#8a1630] dark:text-[#ff9fb5] font-bold text-xs sm:text-sm mb-4">
                <span>Showing: {selectedLabel}</span>
                <button
                  type="button"
                  onClick={onClearFilterPill}
                  className="px-3 py-1 rounded-full bg-white dark:bg-[#2b1620] text-[#1b1216] dark:text-[#f8ecee] font-bold text-xs hover:bg-[#f6ecee] dark:hover:bg-[#4a2130] transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Results Counter & Live Only Switch Bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <span className="font-bold text-xs sm:text-sm text-[#1b1216] dark:text-[#f8ecee]" aria-live="polite">
                {filteredExams.length
                  ? `Showing ${displayedExams.length} of ${filteredExams.length} ${
                      filteredExams.length === 1 ? "exam" : "exams"
                    }`
                  : "No exams found"}
              </span>

              {/* Live Only Switch Toggle */}
              <label className="inline-flex items-center gap-2.5 font-bold text-xs sm:text-sm cursor-pointer select-none text-[#1b1216] dark:text-[#f8ecee]">
                <input
                  type="checkbox"
                  checked={liveOnly}
                  onChange={(e) => onToggleLiveOnly(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0 ${
                    liveOnly ? "bg-[#8a1630]" : "bg-[#f6ecee] dark:bg-[#3a1f29] border border-[#8a1630]/20 dark:border-white/20"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 left-0.5 transition-transform duration-200 ${
                      liveOnly ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
                <span>Live only</span>
              </label>
            </div>

            {/* Tickets List */}
            {filteredExams.length > 0 ? (
              <div className="grid gap-3.5">
                {displayedExams.map((exam, i) => (
                  <ExamTicketCard
                    key={exam.id}
                    exam={exam}
                    index={i}
                    query={query}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="text-center py-10 px-4 bg-white dark:bg-[#2b1620] rounded-2xl border border-dashed border-[#8a1630]/20 dark:border-white/20">
                <div className="w-20 mx-auto mb-3">
                  <ReviewTayoOwl mood="oops" withCap size={80} alt="ReviewTayo Mascot Oops" />
                </div>
                <h3 className="font-display font-bold text-2xl text-[#1b1216] dark:text-[#f8ecee]">
                  {query ? (
                    <>
                      No exam matches “<span className="text-[#8a1630] dark:text-[#ff9fb5]">{query}</span>” yet.
                    </>
                  ) : (
                    "Nothing live here yet."
                  )}
                </h3>
                <p className="text-sm sm:text-base text-[#5a4a50] dark:text-[#d6bcc3] mt-2 max-w-md mx-auto">
                  {query
                    ? "Tell us which one you need using the box below."
                    : "Turn off “Live only” to see the coming-soon exams."}
                </p>
              </div>
            )}

            {/* Pagination: Load More Button */}
            {remainingCount > 0 && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={onShowMore}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-white dark:bg-[#2b1620] text-[#1b1216] dark:text-[#f8ecee] border border-[#8a1630]/20 dark:border-white/20 hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25] transition-colors cursor-pointer"
                >
                  Show {Math.min(10, remainingCount)} more
                </button>
              </div>
            )}

            {/* "Can't find your exam?" Suggestion Bar */}
            <ExamSuggestionBar initialExamName={filteredExams.length === 0 ? query : ""} />
          </div>
        </div>
      </div>
    </section>
  );
}
