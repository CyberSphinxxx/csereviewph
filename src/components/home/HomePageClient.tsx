"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Award,
  FileCheck2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { HeroExamLevelSelector } from "@/components/home/HeroExamLevelSelector";
import { SubtestExplorer } from "@/components/home/SubtestExplorer";

export function HomePageClient() {
  const [selectedLevel, setSelectedLevel] = useState<"professional" | "subprofessional">("professional");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-[#f8edef] selection:text-[#86152d]">
      <Header />

      <main className="flex-1 animate-page-enter">
        {/* ========================================================================= */}
        {/* HERO SECTION: Stable Promise, Exam-Level Selection Card, Focused Action   */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden lg:min-h-[calc(100vh-6.5rem)] flex flex-col justify-center pt-8 pb-14 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20 xl:pb-28 border-b border-border bg-gradient-to-b from-white via-brand-50/20 to-background dark:from-[#1E191C] dark:via-[#1E191C]/60 dark:to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Product Promise, Two-Sentence Explanation, Outcome Evidence, How It Works Link (7 cols) */}
              <div className="lg:col-span-7 text-left space-y-6">
                {/* Small Category Label */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400 block">
                    PHILIPPINE CIVIL SERVICE EXAM REVIEWER
                  </span>
                </div>

                {/* Main Headline with brand highlight */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  Philippine Civil Service Exam<br />
                  <span className="text-brand-600 dark:text-brand-400">Reviewer &amp; Online Mock Tests</span>
                </h1>

                {/* Two-Sentence Explanation */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                  Prepare for the CSE-PPT Professional and Subprofessional exams with free subtest drills, full-length continuous-timer mock exams, and clear explanations.
                </p>

                {/* Outcome Cue: Evidence of the promised outcome */}
                <div className="space-y-1 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Your results include
                  </span>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Subject breakdown &middot; Answer explanations &middot; Recommended practice
                  </p>
                </div>

                {/* See how the review works Link */}
                <div className="pt-2">
                  <a
                    href="#how-your-review-works"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition underline underline-offset-4 decoration-brand-200 dark:decoration-brand-800 hover:decoration-brand-500"
                  >
                    <span>See how the review works</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Exam-Level Selection Card (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <HeroExamLevelSelector
                  selectedLevel={selectedLevel}
                  onSelectLevel={setSelectedLevel}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW YOUR REVIEW WORKS SECTION (Directly Below Hero)                       */}
        {/* ========================================================================= */}
        <section
          id="how-your-review-works"
          className="pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 scroll-mt-14 relative"
        >
          {/* Invisible targets for compatibility with legacy IDs */}
          <div id="what-happens-next" className="absolute -top-14 left-0" />
          <div id="how-it-works" className="absolute -top-14 left-0" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                HOW YOUR REVIEW WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                A short test. A focused study plan.
              </h2>
            </div>

            {/* 3 Steps: Visually Explaining the Process */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Step 01: Take the diagnostic */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                      01
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                      Diagnostic
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Take the diagnostic
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Answer a representative sample of questions covering every subtest required for your level.
                  </p>
                </div>

                {/* Visual Cue: Subtests representation */}
                <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Verbal</span>
                    <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Numerical</span>
                    <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">Analytical / Clerical</span>
                    <span className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">General Info</span>
                  </div>
                </div>
              </div>

              {/* Step 02: Review your results */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                      02
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      Breakdown
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Review your results
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Review your subject-by-subject accuracy score and read step-by-step rationales for every item.
                  </p>
                </div>

                {/* Visual Cue: Breakdown & explanations representation */}
                <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    <span>Subject breakdown</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Strengths &amp; gaps</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-[65%]" />
                    <div className="bg-amber-400 h-full w-[35%]" />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Answer explanations included</span>
                  </div>
                </div>
              </div>

              {/* Step 03: Practice the recommended area */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                      03
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                      Targeted Practice
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Practice the recommended area
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Focus directly on your highest-yield improvement areas with topic drills and timed mock tests.
                  </p>
                </div>

                {/* Visual Cue: Recommended practice drill simulation */}
                <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Next recommended action</span>
                    <span className="text-brand-600 dark:text-brand-400 font-semibold">Priority</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-medium flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="truncate">Focused subtest practice</span>
                    <ArrowRight className="w-3 h-3 text-brand-600 dark:text-brand-400 shrink-0 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHY STUDY WITH REVIEWTAYO SECTION                                         */}
        {/* ========================================================================= */}
        <section className="py-16 md:py-20 bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                WHY STUDY WITH REVIEWTAYO
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Built For Purposeful Civil Service Review
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Exam preparation designed around accuracy, clear explanations, and exact CSC scope.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Trust Claim 1 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
                  <FileCheck2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">Exam Scope</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Original practice questions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every question is written for this platform and follows the published CSE scope.
                </p>
              </div>

              {/* Trust Claim 2 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Concept Mastery</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Detailed answer explanations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Review why an answer is correct and strengthen the underlying concept.
                </p>
              </div>

              {/* Trust Claim 3 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1E191C] border border-border shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
                  <Target className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">Level Coverage</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Built for both CSE levels
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Choose Professional or Subprofessional and study the subjects included in your level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SIDE-BY-SIDE LEVEL COMPARISON SECTION (#compare-levels)                   */}
        {/* ========================================================================= */}
        <section id="compare-levels" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-14">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              Examination Categories
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Compare Professional vs. Subprofessional
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl mx-auto">
              Both levels confer Civil Service eligibility, but they qualify you for different government positions and test distinct subtest competencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Professional Card */}
            <div className="rounded-2xl border-2 border-brand-600/70 dark:border-brand-500 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    2nd Level Eligibility
                  </span>
                  <span className="text-xs font-semibold text-slate-500">170 Items &bull; 3h 10m</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Career Service Professional</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Qualifies you for technical, scientific, executive, and managerial roles, as well as first-level positions.
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Analytical Ability:</strong> Logic, Syllogisms, Data Sufficiency &amp; Number Analogy</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Verbal Ability:</strong> Grammar, Vocabulary, Paragraph Organization, Reading Comprehension</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Numerical Ability:</strong> Basic Operations, Word Problems</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">General Information:</strong> Philippine Constitution, Code of Conduct (RA 6713), Peace &amp; Human Rights, Environment</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/exams/professional/quick"
                  prefetch={true}
                  className="w-full sm:w-auto flex-1 text-center py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs transition"
                >
                  Start Professional Diagnostic &rarr;
                </Link>
                <Link
                  href="/cse/exam-guide#requirements"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-700 dark:hover:text-white underline py-1"
                >
                  Qualifications &rarr;
                </Link>
              </div>
            </div>

            {/* Subprofessional Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    1st Level Eligibility
                  </span>
                  <span className="text-xs font-semibold text-slate-500">165 Items &bull; 2h 40m</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Career Service Subprofessional</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Qualifies you strictly for first-level clerical, trades, crafts, and custodial positions in government.
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Clerical Ability:</strong> Alphabetizing, Office Filing Procedures &amp; Spelling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Verbal Ability:</strong> Grammar, Vocabulary, Paragraph Organization, Reading Comprehension</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">Numerical Ability:</strong> Basic Operations, Word Problems</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 dark:text-white">General Information:</strong> Philippine Constitution, Code of Conduct (RA 6713), Peace &amp; Human Rights, Environment</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/exams/subprofessional/quick"
                  prefetch={true}
                  className="w-full sm:w-auto flex-1 text-center py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs transition"
                >
                  Start Subprofessional Diagnostic &rarr;
                </Link>
                <Link
                  href="/cse/exam-guide#requirements"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-700 dark:hover:text-white underline py-1"
                >
                  Qualifications &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PREPARATION MODES & LEVEL SWITCHER SECTION                                */}
        {/* ========================================================================= */}
        <section id="preparation-modes" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-14">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Exam Formats &bull; Select Your Level
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Choose Your Preparation Mode
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
              Select your Civil Service Examination category to configure official item counts and timer allotments.
            </p>

            {/* Level Switcher Widget */}
            <div className="pt-3 inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 gap-1 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => setSelectedLevel("professional")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLevel === "professional"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Professional (170 items &bull; 3h 10m)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLevel("subprofessional")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLevel === "subprofessional"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Subprofessional (165 items &bull; 2h 40m)
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {selectedLevel === "professional"
                ? "Includes Analytical Ability (Logic, Syllogisms, Data Sufficiency). Required for 2nd Level government positions."
                : "Includes Clerical Ability (Alphabetizing, Office Filing Procedures). Required for 1st Level clerical positions."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Test */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Daily Pacing Drill
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Test</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  10 randomized questions with immediate diagnostic score and concept explanations. Ideal for daily lunch breaks or commutes.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-slate-400" /> 10 Minutes &bull; 10 Items
                </div>
              </div>
              <Link
                href={`/exams/${selectedLevel}/quick`}
                prefetch={true}
                className="mt-6 block text-center py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-bold text-sm transition shadow-xs"
              >
                Launch Quick Test &rarr;
              </Link>
            </div>

            {/* Medium Test */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 block mb-2">
                  Targeted Subtest Review
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Medium Test</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  30 items across all subjects or a single chosen subtest. Perfect for weekend study sessions and targeted topic assessments.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-slate-400" /> 30 Minutes &bull; 30 Items
                </div>
              </div>
              <Link
                href={`/exams/${selectedLevel}/medium`}
                prefetch={true}
                className="mt-6 block text-center py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition shadow-xs"
              >
                Launch Medium Test &rarr;
              </Link>
            </div>

            {/* Full Mock Test */}
            <div className="rounded-2xl border-2 border-slate-900 dark:border-brand-500 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-gold-400/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 block mb-2">
                  Real Exam Simulation
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Full Mock Exam</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  170 items (Professional) or 165 items (Subprofessional) with continuous single timer, question navigator, and review screen.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                  {selectedLevel === "professional" ? "3 Hours 10 Mins • 170 Items" : "2 Hours 40 Mins • 165 Items"}
                </div>
              </div>
              <Link
                href={`/exams/${selectedLevel}/full`}
                prefetch={true}
                className="mt-6 block text-center py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-bold text-sm transition shadow-xs"
              >
                Start Real Simulation &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DIAGNOSTIC PACING INSIGHT: Pacing & Single Continuous Timer               */}
        {/* ========================================================================= */}
        <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 p-6 sm:p-10 shadow-xs">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  CSC Time Management &amp; Pacing Strategy
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Mastering the Single Continuous Timer: 67-Second Rhythm
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  The Civil Service Examination uses a single unhindered timer for all items (190 minutes for Professional, 160 minutes for Subprofessional)—giving examinees an average of approximately <strong>67 seconds per question</strong>. Developing pacing discipline early is key to completing every section with confidence.
                </p>
              </div>

              {/* Pacing Advice Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pacing Strategy 1 */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold text-sm">
                    <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span>Subtest Pacing Distribution</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Fast recall items in Vocabulary and General Information can often be completed in 30–40 seconds, generating valuable time reserves for complex Numerical word problems and multi-step Logic puzzles that require 90–120 seconds.
                  </p>
                  <div className="pt-2 text-[11px] font-semibold text-brand-700 dark:text-brand-400">
                    &bull; Aim for steady momentum rather than lingering on a single item
                  </div>
                </div>

                {/* Pacing Strategy 2 */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>The Flag &amp; Return Discipline</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    If an item takes longer than 90 seconds, flag it and proceed. Our full mock exam simulator features an exact digital question palette so you can return to flagged items once all confident questions are locked in.
                  </p>
                  <div className="pt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    &bull; Ensures 100% question coverage with zero missed easy items
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Want the complete mathematical pacing breakdown for the CSE-PPT?
                </span>
                <Link
                  href="/articles/continuous-timer-pacing-strategy"
                  className="font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 inline-flex items-center gap-1 group"
                >
                  <span>Read the continuous timer pacing guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE SUBTEST & SYLLABUS EXPLORER                                  */}
        {/* ========================================================================= */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Official Civil Service Commission Scope
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Explore Subtests &amp; High-Yield Syllabi
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Select a subtest below to inspect its item distribution, passing pacing rules, and high-yield topics.
              </p>
            </div>

            <SubtestExplorer />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STUDY GUIDES & STRATEGY ARTICLES SHOWCASE                                */}
        {/* ========================================================================= */}
        <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Educational Syllabus
                </span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  High-Yield Study Guides &amp; Strategy
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                  Master the official syllabus rules, constitutional articles, and pacing formulas.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/guides"
                  prefetch={true}
                  className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition flex items-center gap-1"
                >
                  <span>All Study Guides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Link
                  href="/articles"
                  prefetch={true}
                  className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition flex items-center gap-1"
                >
                  <span>Strategy Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Link
                  href="/faq"
                  prefetch={true}
                  className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition flex items-center gap-1"
                >
                  <span>Exam FAQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Guides & Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: RA 6713 */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-100 dark:border-brand-800">
                    General Information
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    <Link href="/guides/ra-6713-code-of-conduct" prefetch={true} className="hover:text-brand-700 dark:hover:text-brand-400 transition">
                      RA 6713: The 8 Norms of Conduct &amp; Ethical Standards
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Essential public servant obligations, prohibited gifts, conflict of interest rules, and annual SALN filing deadlines.
                  </p>
                </div>
                <Link
                  href="/guides/ra-6713-code-of-conduct"
                  prefetch={true}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline"
                >
                  Read Study Guide &rarr;
                </Link>
              </div>

              {/* Card 2: 67-Second Rule */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
                    Exam Strategy
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    <Link href="/articles/continuous-timer-pacing-strategy" prefetch={true} className="hover:text-brand-700 dark:hover:text-brand-400 transition">
                      The 67-Second Rule: Continuous Timer Pacing Strategy
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    How to allocate your 190 minutes across four phases so you never run out of time on the 170-item CSE-PPT.
                  </p>
                </div>
                <Link
                  href="/articles/continuous-timer-pacing-strategy"
                  prefetch={true}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline"
                >
                  Read Article &rarr;
                </Link>
              </div>

              {/* Card 3: 1987 Constitution */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800">
                    Constitutional Law
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    <Link href="/guides/philippine-constitution-essentials" prefetch={true} className="hover:text-brand-700 dark:hover:text-brand-400 transition">
                      1987 Philippine Constitution: High-Yield Provisions
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Article III Bill of Rights, Citizenship, and the mandates of the 3 Independent Constitutional Commissions.
                  </p>
                </div>
                <Link
                  href="/guides/philippine-constitution-essentials"
                  prefetch={true}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline"
                >
                  Read Study Guide &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AdSenseBanner slotId="homepage-bottom" />

      <Footer />
    </div>
  );
}
