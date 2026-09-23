"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Briefcase,
  Shield,
  BadgeCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import {
  EXAM_GOALS,
  type ExamGoal,
  EXAM_GROUPS_BY_ID,
  EXAM_FAMILIES,
  DIRECTORY_EXAMS,
  type DirectoryExam,
  isExamInGroup,
  sortExamsByPriority,
} from "@/config/exam-directory";
import { ReviewTayoOwl, type OwlMood } from "@/components/brand/ReviewTayoOwl";

export interface OwlFinderSectionProps {
  onSelectGoalForCatalog: (groupIds: string[], label: string) => void;
  onGoToSearch: () => void;
}

function getGoalIcon(iconName: string, className = "w-6 h-6") {
  switch (iconName) {
    case "briefcase":
      return <Briefcase className={className} />;
    case "shield":
      return <Shield className={className} />;
    case "badge-check":
      return <BadgeCheck className={className} />;
    case "graduation-cap":
      return <GraduationCap className={className} />;
    case "book-open":
      return <BookOpen className={className} />;
    default:
      return <Briefcase className={className} />;
  }
}

export function OwlFinderSection({
  onSelectGoalForCatalog,
  onGoToSearch,
}: OwlFinderSectionProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string>("all");
  const [owlMood, setOwlMood] = useState<OwlMood>("idle");
  const moodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (moodTimerRef.current) {
        clearTimeout(moodTimerRef.current);
      }
    };
  }, []);

  const selectedGoal = EXAM_GOALS.find((g) => g.id === selectedGoalId) || null;

  // Filter exams for the selected goal and field
  const targetGroupIds = selectedGoal
    ? activeField === "all"
      ? selectedGoal.groupIds
      : [activeField]
    : [];

  const matchedExams: DirectoryExam[] = selectedGoal
    ? sortExamsByPriority(
        DIRECTORY_EXAMS.filter((x) =>
          targetGroupIds.some((gid) => isExamInGroup(x, gid))
        )
      )
    : [];

  const liveMatches = matchedExams.filter((x) => x.live).length;
  const totalMatches = matchedExams.length;

  const handlePickGoal = (goal: ExamGoal) => {
    setSelectedGoalId(goal.id);
    setActiveField("all");
    setOwlMood("happy");
    if (moodTimerRef.current) {
      clearTimeout(moodTimerRef.current);
    }
    moodTimerRef.current = setTimeout(() => {
      setOwlMood("idle");
    }, 1400);
  };

  // Dynamic speech bubble copy
  let bubbleCopy = "Hi! Tell me what you're aiming for and I'll show you the exams.";
  if (selectedGoal) {
    const fieldLabel =
      activeField === "all"
        ? selectedGoal.say
        : `Here's ${EXAM_GROUPS_BY_ID[activeField]?.name || ""}.`;
    const examPlural = totalMatches === 1 ? "1 exam" : `${totalMatches} exams`;
    const liveStatus = liveMatches > 0 ? `, ${liveMatches} live now.` : ", all coming soon.";
    bubbleCopy = `${fieldLabel} ${examPlural}${liveStatus}`;
  }

  const displayedMinis = matchedExams.slice(0, 4);
  const remainingCount = totalMatches - displayedMinis.length;

  return (
    <section id="finder" className="py-12 sm:py-16 bg-transparent border-b border-[#8a1630]/10 dark:border-white/10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-11">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-8 sm:gap-12 items-start min-w-0 w-full">
          {/* Left Column: Questionnaire Title & Goals Radiogroup */}
          <div className="text-left min-w-0 w-full">
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1b1216] dark:text-[#f8ecee] leading-[1.02] tracking-tight mb-3">
              What are you aiming for?
            </h1>
            <p className="text-base sm:text-lg text-[#5a4a50] dark:text-[#d6bcc3] max-w-[36ch] mb-6 font-normal">
              Pick one and I&apos;ll show you the exams that fit.
            </p>

            <div
              role="radiogroup"
              aria-label="Your exam goal"
              className="grid gap-2.5 min-w-0 w-full"
            >
              {EXAM_GOALS.map((goal) => {
                const isChecked = selectedGoalId === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    role="radio"
                    aria-checked={isChecked}
                    onClick={() => handlePickGoal(goal)}
                    className={`flex items-center gap-3 sm:gap-4 text-left w-full p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none min-w-0 ${
                      isChecked
                        ? "bg-[#8a1630] text-white border-[#8a1630] translate-x-1.5 shadow-md"
                        : "bg-white/90 dark:bg-[#2b1620] text-[#1b1216] dark:text-[#f8ecee] border-[#8a1630]/15 dark:border-white/15 hover:translate-x-1.5 hover:border-[#8a1630] shadow-xs"
                    }`}
                  >
                    <span
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl grid place-items-center shrink-0 transition-colors ${
                        isChecked
                          ? "bg-white/20 text-white"
                          : "bg-[#fbeff0] dark:bg-[#3b1a25] text-[#8a1630] dark:text-[#ff9fb5]"
                      }`}
                    >
                      {getGoalIcon(goal.iconName, "w-5 h-5 sm:w-6 sm:h-6")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block font-display font-extrabold text-base sm:text-lg leading-tight tracking-tight">
                        {goal.title}
                      </b>
                      <small
                        className={`block text-xs sm:text-sm mt-0.5 ${
                          isChecked ? "text-[#f3cbd3]" : "text-[#5a4a50] dark:text-[#d6bcc3]"
                        }`}
                      >
                        {goal.subtitle}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-sm sm:text-base text-[#5a4a50] dark:text-[#d6bcc3]">
              Already know the name?{" "}
              <button
                type="button"
                onClick={onGoToSearch}
                className="font-bold text-[#8a1630] dark:text-[#ff9fb5] underline underline-offset-4 hover:text-[#a81b3b] cursor-pointer"
              >
                Search all {DIRECTORY_EXAMS.length} exams
              </button>
            </p>
          </div>

          {/* Right Column: Owl Mascot & Matches Panel */}
          <div
            className="panel bg-white/95 dark:bg-[#2b1620] border border-[#8a1630]/15 dark:border-white/15 rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 shadow-[0_20px_50px_-30px_rgba(90,15,35,0.2)] dark:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] min-h-[480px] sm:min-h-[500px] flex flex-col justify-between min-w-0 w-full max-w-full backdrop-blur-xs"
            aria-live="polite"
          >
            <div className="min-w-0 w-full">
              {/* Mascot & Speech Bubble */}
              <div className="flex items-end gap-3 sm:gap-4 mb-4 min-w-0 w-full">
                <div className="w-[64px] sm:w-[84px] md:w-[92px] shrink-0">
                  <ReviewTayoOwl
                    mood={owlMood}
                    withCap
                    tracked
                    bob
                    size="100%"
                    alt="ReviewTayo Owl guide"
                  />
                </div>
                <div className="say-bubble relative bg-[#fbeff0] dark:bg-[#3b1a25] text-[#1b1216] dark:text-[#f8ecee] rounded-[20px_20px_20px_6px] p-3 sm:p-4 font-semibold text-xs sm:text-base leading-relaxed min-h-[56px] sm:min-h-[64px] flex items-center min-w-0 flex-1 max-w-[44ch]">
                  <p className="m-0 break-words">{bubbleCopy}</p>
                </div>
              </div>

              {/* Sub-Field Filter Chips (shown when goal maps to multiple categories) */}
              {selectedGoal && selectedGoal.groupIds.length > 1 && (
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  <button
                    type="button"
                    onClick={() => setActiveField("all")}
                    aria-pressed={activeField === "all"}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      activeField === "all"
                        ? "bg-[#8a1630] text-white"
                        : "bg-white/80 dark:bg-[#1a0c11] text-[#1b1216] dark:text-[#f8ecee] border border-[#8a1630]/15 dark:border-white/15 hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25]"
                    }`}
                  >
                    All fields{" "}
                    <small className="opacity-80 font-bold ml-1">
                      {
                        DIRECTORY_EXAMS.filter((x) =>
                          selectedGoal.groupIds.some((gid) => isExamInGroup(x, gid))
                        ).length
                      }
                    </small>
                  </button>

                  {selectedGoal.groupIds.map((gid) => {
                    const grp = EXAM_GROUPS_BY_ID[gid];
                    if (!grp) return null;
                    const count = DIRECTORY_EXAMS.filter((x) => isExamInGroup(x, gid)).length;
                    const isActive = activeField === gid;
                    return (
                      <button
                        key={gid}
                        type="button"
                        onClick={() => setActiveField(gid)}
                        aria-pressed={isActive}
                        className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                          isActive
                            ? "bg-[#8a1630] text-white"
                            : "bg-white/80 dark:bg-[#1a0c11] text-[#1b1216] dark:text-[#f8ecee] border border-[#8a1630]/15 dark:border-white/15 hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25]"
                        }`}
                      >
                        {grp.name}{" "}
                        <small className="opacity-80 font-bold ml-1">{count}</small>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Mini Cards Grid / Ghost Empty State */}
              <div className="grid gap-2 relative min-w-0 w-full">
                {!selectedGoal ? (
                  <div className="space-y-2 py-4 select-none min-w-0 w-full">
                    <div className="ghost-exam-card opacity-90" />
                    <div className="ghost-exam-card opacity-60" />
                    <div className="ghost-exam-card opacity-30" />
                    <div className="absolute inset-0 grid place-items-center text-center font-display font-bold text-lg sm:text-xl text-[#5a4a50] dark:text-[#d6bcc3] p-6 pointer-events-none">
                      Your matches show up here.
                    </div>
                  </div>
                ) : (
                  displayedMinis.map((exam, i) => {
                    const grp = EXAM_GROUPS_BY_ID[exam.groupId];
                    const familyConfig = EXAM_FAMILIES[exam.family];
                    const innerContent = (
                      <>
                        <span
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl shrink-0 grid place-items-center font-display font-extrabold text-xs sm:text-base select-none ${familyConfig.bgClass}`}
                        >
                          {exam.code ? exam.code.slice(0, 4) : grp?.name.slice(0, 2)}
                        </span>
                        <span className="min-w-0 flex-1 overflow-hidden">
                          <b className="block text-xs sm:text-base font-bold text-[#1b1216] dark:text-[#f8ecee] leading-tight truncate">
                            {exam.name}
                          </b>
                          <small className="block text-[11px] sm:text-xs text-[#5a4a50] dark:text-[#d6bcc3] mt-0.5 truncate">
                            {exam.agency || grp?.name}
                          </small>
                        </span>
                        {exam.live ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#e4f7ec] dark:bg-[#133a22] text-[#0a6b35] dark:text-[#8ff0b8] shrink-0">
                            <span className="w-2 h-2 rounded-full bg-[#12a150]" />
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f6ecee] dark:bg-[#3a1f29] text-[#5a4a50] dark:text-[#d6bcc3] shrink-0">
                            <Clock className="w-3 h-3 text-[#5a4a50] dark:text-[#d6bcc3]" />
                            Soon
                          </span>
                        )}
                      </>
                    );

                    return exam.live ? (
                      <Link
                        key={exam.id}
                        href={exam.route}
                        prefetch={true}
                        style={{ "--i": i } as React.CSSProperties}
                        className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#fbeff0] dark:bg-[#3b1a25] hover:bg-[#f6e1e5] dark:hover:bg-[#4a2130] hover:translate-x-1.5 transition-all text-[#1b1216] dark:text-[#f8ecee] animate-[pop_0.35s_both] border border-transparent hover:border-[#8a1630] dark:hover:border-[#ff9fb5] min-w-0 w-full"
                      >
                        {innerContent}
                      </Link>
                    ) : (
                      <div
                        key={exam.id}
                        style={{ "--i": i } as React.CSSProperties}
                        className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#fbeff0]/70 dark:bg-[#3b1a25]/70 text-[#1b1216] dark:text-[#f8ecee] animate-[pop_0.35s_both] border border-transparent min-w-0 w-full"
                      >
                        {innerContent}
                      </div>
                    );
                  })
                )}

                {selectedGoal && remainingCount > 0 && (
                  <p className="text-xs sm:text-sm font-semibold text-[#5a4a50] dark:text-[#d6bcc3] px-2 pt-1">
                    + {remainingCount} more
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions CTA */}
            <div className="mt-6 pt-4 border-t border-[#8a1630]/10 dark:border-white/10 flex items-center gap-4 flex-wrap">
              {!selectedGoal ? (
                <button
                  type="button"
                  onClick={onGoToSearch}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white dark:bg-[#1a0c11] text-[#1b1216] dark:text-[#f8ecee] border border-[#8a1630]/20 dark:border-white/20 hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25] transition-colors cursor-pointer"
                >
                  <span>Browse all {DIRECTORY_EXAMS.length} exams</span>
                  <ArrowRight className="w-4 h-4 text-[#8a1630] dark:text-[#ff9fb5]" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const label =
                        activeField === "all"
                          ? selectedGoal.title
                          : EXAM_GROUPS_BY_ID[activeField]?.name || selectedGoal.title;
                      onSelectGoalForCatalog(targetGroupIds, label);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-[#8a1630] text-white hover:bg-[#a81b3b] shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>
                      See all {totalMatches} {totalMatches === 1 ? "exam" : "exams"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onGoToSearch}
                    className="font-bold text-sm text-[#8a1630] dark:text-[#ff9fb5] underline underline-offset-4 hover:text-[#a81b3b] cursor-pointer"
                  >
                    Or search by name
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
