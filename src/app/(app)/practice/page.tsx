"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllExamLevels } from "@/features/practice/practice-service";
import { ArrowRight, Filter, BookOpen, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ExamSubNav } from "@/components/layout/ExamSubNav";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { useExamWorkspace } from "@/lib/workspace";
import { getExamSubjects } from "@/config/exams";

export default function PracticeTopicsPage() {
  const { currentWorkspace, currentExamConfig } = useExamWorkspace();
  const levels = getAllExamLevels();
  
  // Default to user's active track if available
  const initialLevelId =
    currentWorkspace?.levelId === "track-subpro" || currentWorkspace?.levelId === "subprofessional"
      ? "level-subpro"
      : levels[0]?.id || "level-pro";

  const [selectedLevelId, setSelectedLevelId] = useState<string>(initialLevelId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");

  useEffect(() => {
    if (currentWorkspace?.levelId) {
      if (
        currentWorkspace.levelId === "track-subpro" ||
        currentWorkspace.levelId === "subprofessional"
      ) {
        setSelectedLevelId("level-subpro");
      } else if (
        currentWorkspace.levelId === "track-pro" ||
        currentWorkspace.levelId === "professional"
      ) {
        setSelectedLevelId("level-pro");
      }
    }
  }, [currentWorkspace?.levelId]);

  const hasLivePractice = currentExamConfig?.capabilities?.hasTopicPractice ?? true;
  const currentExamSubjects = currentWorkspace ? getExamSubjects(currentWorkspace.examId) : [];

  const currentLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];
  const subjects = currentLevel?.subjects || [];

  const displayedTopics = subjects.flatMap((sub) => {
    if (selectedSubjectId !== "all" && sub.id !== selectedSubjectId) {
      return [];
    }
    return sub.topics.map((t) => ({
      ...t,
      subjectName: sub.name,
      subjectId: sub.id,
    }));
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <ExamSubNav examId="cse" />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 animate-page-enter">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-200/80 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Topic Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Practice by Subtest &amp; Topic
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Target specific skill gaps with untimed or focused 10-question practice drills. All questions include detailed pedagogical explanations.
            </p>

            {/* Level Selector Tabs */}
            {hasLivePractice && (
              <div className="pt-4 flex flex-wrap items-center gap-2">
                {levels.map((lvl) => {
                  const isActiveWorkspaceLevel =
                    ((currentWorkspace?.levelId === "track-subpro" ||
                      currentWorkspace?.levelId === "subprofessional") &&
                      lvl.id === "level-subpro") ||
                    ((currentWorkspace?.levelId === "track-pro" ||
                      currentWorkspace?.levelId === "professional") &&
                      lvl.id === "level-pro");

                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        setSelectedLevelId(lvl.id);
                        setSelectedSubjectId("all");
                      }}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition inline-flex items-center gap-2 ${
                        selectedLevelId === lvl.id
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{lvl.name}</span>
                      {isActiveWorkspaceLevel && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          selectedLevelId === lvl.id
                            ? "bg-emerald-500/30 text-emerald-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          Your Track
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {!hasLivePractice ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Editorial Review in Progress</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    {currentExamConfig?.fullName || "Examination"} Subject Breakdown
                  </h2>
                  <p className="text-sm text-slate-600 max-w-xl">
                    Our subject matter experts are authoring and verifying pedagogical rationales for {currentExamConfig?.shortName}. Below is the official examination syllabus structure.
                  </p>
                </div>
                <Link
                  href="/cse"
                  className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs transition shrink-0"
                >
                  Practice Live CSE Questions
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentExamSubjects.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Domain 0{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        In Review
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        PRC / Regulatory standardized assessment syllabus.
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="/guides"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>View Study Notes</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Main 2-Column Scannable Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Sidebar: Subtest Filter */}
              <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs lg:sticky lg:top-24 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter by Subtest</span>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectId("all")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      selectedSubjectId === "all"
                        ? "bg-brand-50 text-brand-800 font-black"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>All Subtests</span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {subjects.reduce((sum, s) => sum + s.topics.length, 0)} topics
                    </span>
                  </button>

                  {subjects.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition flex items-center justify-between ${
                        selectedSubjectId === sub.id
                          ? "bg-brand-50 text-brand-800 font-bold"
                          : "text-slate-600 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <span className="truncate pr-2">{sub.name}</span>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {sub.topics.length}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* Right Content: Scannable Topic List with Direct Drill Launchers */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1 pb-1">
                  <span>Showing {displayedTopics.length} high-yield topics</span>
                  <span>Immediate answer rationales enabled</span>
                </div>

                <div className="space-y-2.5">
                  {displayedTopics.map((top) => (
                    <div
                      key={top.id}
                      className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                            {top.subjectName}
                          </span>
                          <span className="text-xs text-slate-400">&bull;</span>
                          <span className={`text-xs font-medium ${top.questionCount > 0 ? "text-slate-500" : "text-amber-600 font-semibold"}`}>
                            {top.questionCount > 0
                              ? `${top.questionCount} ${top.questionCount === 1 ? "item" : "items"}`
                              : "In editorial review"}
                          </span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition">
                          {top.name}
                        </h2>
                      </div>

                      {top.questionCount > 0 ? (
                        <Link
                          href={`/practice/${top.id}`}
                          prefetch={true}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition shrink-0 self-start sm:self-center"
                        >
                          <span>Start Practice</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                            Questions in Review
                          </span>
                          <Link
                            href="/guides"
                            prefetch={true}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline py-1"
                          >
                            <span>Study Guide</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AdSenseBanner slotId="practice-directory-bottom" />

      <Footer />
    </div>
  );
}
