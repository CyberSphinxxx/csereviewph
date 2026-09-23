"use client";

import React, { useState } from "react";
import { getAvailableExams, getAllExams } from "@/config/exams";
import { useExamWorkspace } from "@/lib/workspace/useExamWorkspace";
import { ArrowRight, ShieldCheck, Layers } from "lucide-react";

export function DashboardOnboardingView({ embedded = false }: { embedded?: boolean } = {}) {
  // No router dependency: creating a workspace fires RT_WORKSPACE_CHANGED_EVENT,
  // which every useExamWorkspace consumer reacts to — no refresh() needed.
  const { createWorkspace } = useExamWorkspace();
  const availableExams = getAvailableExams();
  const allExams = getAllExams();
  const upcomingExams = allExams.filter((e) => e.availability !== "available");

  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      availableExams
        .filter((exam) => exam.levels[0])
        .map((exam) => [exam.id, exam.levels[0].id]),
    ),
  );

  const handleLevelChange = (examId: string, levelId: string) => {
    setSelectedLevels((prev) => ({ ...prev, [examId]: levelId }));
  };

  const handleStartPreparing = (examId: string) => {
    const exam = availableExams.find((candidate) => candidate.id === examId);
    const levelId = selectedLevels[examId] || exam?.levels[0]?.id;
    createWorkspace({
      examId,
      levelId,
    });
  };

  return (
    <div
      className={
        embedded
          ? "mt-8 space-y-10"
          : "py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 animate-page-enter"
      }
    >
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Exam workspace setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Choose one exam to build your workspace
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Your selected track, target date, practice history, and recommendations stay organized inside that exam. You can begin as a guest and sign in later to sync progress.
        </p>
      </div>

      {/* Available Live Reviewers (Immediate Preparation) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Available now
          </h2>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Ready to study
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {availableExams.map((exam) => {
            const currentLevelId = selectedLevels[exam.id] || exam.levels[0]?.id;
            const currentLevel = exam.levels.find((l) => l.id === currentLevelId) || exam.levels[0];

            return (
              <div
                key={exam.id}
                className="bg-white dark:bg-[#1E191C] rounded-2xl border border-brand-200 dark:border-brand-800/80 p-6 sm:p-8 shadow-xs relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wide">
                        Live Reviewer
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {exam.agency}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {exam.fullName}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {exam.description}
                    </p>

                    {/* Level / Track Selection */}
                    {exam.levels.length > 1 && (
                      <div className="pt-2 space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Select Examination Level:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {exam.levels.map((lvl) => {
                            const isSelected = currentLevelId === lvl.id;
                            return (
                              <button
                                key={lvl.id}
                                type="button"
                                onClick={() => handleLevelChange(exam.id, lvl.id)}
                                className={`text-left p-3 rounded-xl border text-xs transition ${
                                  isSelected
                                    ? "border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold shadow-2xs"
                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                <div className="font-extrabold text-sm">{lvl.name}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {lvl.description}
                                </div>
                                <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                  {lvl.items && <span>{lvl.items} items</span>}
                                  {lvl.timeLimitMinutes && <span>&bull; {Math.floor(lvl.timeLimitMinutes / 60)}h {lvl.timeLimitMinutes % 60}m</span>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-start lg:items-end gap-3 pt-2 lg:pt-0">
                    <button
                      type="button"
                      onClick={() => handleStartPreparing(exam.id)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-brand-700 hover:bg-brand-800 shadow-sm transition active:scale-[0.98] w-full sm:w-auto cursor-pointer"
                    >
                      <span>Start preparing ({currentLevel?.shortName || "Standard"})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Privacy-first &bull; Guest local progress enabled</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming & Research Reviewers (No dead start buttons) */}
      <div className="space-y-4 pt-4">
        <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Upcoming Philippine Examinations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Syllabus research and subject authoring in progress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcomingExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-[#1E191C] rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-2.5 opacity-90"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
                  {exam.badgeText}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {exam.agency}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {exam.fullName}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {exam.description}
              </p>

              <div className="pt-2 text-[11px] font-semibold text-slate-500">
                <span>Coverage: </span>
                {exam.levels.map((lvl) => lvl.shortName).join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
