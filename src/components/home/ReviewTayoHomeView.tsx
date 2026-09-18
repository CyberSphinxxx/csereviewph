"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Clock,
  FileCheck2,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { ExamIndexTable } from "@/components/home/ExamIndexTable";

export function ReviewTayoHomeView() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-[#f8edef] selection:text-[#86152d]">
      <Header />

      <main className="flex-1 animate-page-enter">
        {/* ========================================================================= */}
        {/* HERO SECTION: The Philippine Examination Index (Editorial Masthead)       */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-7 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-border bg-gradient-to-b from-white via-brand-50/15 to-background dark:from-[#1E191C] dark:via-[#1E191C]/50 dark:to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-7 sm:space-y-8">
            {/* Masthead Label & Metadata Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-2.5 text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <span className="font-bold text-brand-700 dark:text-brand-400">
                Philippine Exam Preparation
              </span>
              <span className="hidden sm:inline-block text-slate-400 dark:text-slate-500">
                ReviewTayo &bull; Examination Index
              </span>
            </div>

            {/* Platform Positioning & H1 Headline */}
            <div className="max-w-3xl space-y-4 text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.14]">
                Your review home for
                <span className="block text-slate-900 dark:text-white">Philippine examinations.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                A growing review library for Philippine civil service, licensure, professional, and public-safety examinations. Practice with original questions, mock exams, and focused study resources.
              </p>

              {/* Action Affordance: Contextual CSE Link */}
              <div className="pt-1">
                <Link
                  href="/cse"
                  prefetch={true}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 hover:underline underline-offset-4 decoration-brand-300 dark:decoration-brand-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded"
                >
                  <span>Civil Service reviewer is live now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* The Philippine Examination Index Signature Component */}
            <div id="exam-index" className="pt-1 scroll-mt-20">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                    The Philippine Examination Index
                  </h2>
                </div>
              </div>

              <div id="reviewers">
                <ExamIndexTable />
              </div>
            </div>

            {/* Quality & Integrity Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-border/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% Free &amp; Open Access
              </span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />
                Original Question Authoring Policy
              </span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Data Privacy Act Compliant (RA 10173)
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURED LIVE REVIEWER: CIVIL SERVICE EXAM SPOTLIGHT                      */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-slate-50/80 dark:bg-slate-950/60 border-y border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Featured Reviewer &bull; Fully Live Today
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Civil Service Exam (CSE-PPT) Reviewer
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  Engineered specifically for the Philippine Civil Service Examination. Includes both Career Service Professional and Subprofessional tracks with authentic continuous countdown timers.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/cse"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs transition"
                >
                  <span>Open CSE Reviewer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/practice"
                  prefetch={true}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-800 transition"
                >
                  <span>Practice Drills</span>
                </Link>
              </div>
            </div>

            {/* Feature Highlights 3-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
                  <Target className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Dual Levels</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Professional &amp; Subprofessional
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Practice with full item sets (170 items for Professional with Analytical Ability; 165 items for Subprofessional with Clerical Ability).
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-gold-600 dark:text-gold-400">
                  <Clock className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Exact Simulation</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Continuous Single Timer
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Train with the authentic 3h 10m or 2h 40m uninterrupted clock to build the 67-second pacing discipline required on exam day.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Award className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Diagnosis &amp; Rationales</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Subject Breakdown &amp; Explanations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Get immediate accuracy scores by subtest, detailed step-by-step rationales, and targeted recommendations to strengthen weak areas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW REVIEWTAYO WORKS SECTION (#how-it-works)                              */}
        {/* ========================================================================= */}
        <section
          id="how-it-works"
          className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 border-b border-border scroll-mt-14"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                THE REVIEWTAYO METHOD
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                How ReviewTayo Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                A disciplined four-stage cycle built to transform preparation into confident exam mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                    01
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Choose Your Exam
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Select your target exam and specific eligibility category from our verified Philippine exam catalog.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-brand-700 dark:text-brand-400">
                  Tailored to official syllabi
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                    02
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Practice &amp; Simulate
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Take rapid 10-item diagnostic drills, 30-item subtest practices, or full-length timed mock exams.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-brand-700 dark:text-brand-400">
                  Exact exam time limits
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                    03
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Review Rationales
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Understand why an answer is correct with step-by-step solutions and review flagged items in your mistake bank.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Concept clarity, zero rote memorization
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                    04
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Track Readiness
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Monitor your accuracy trends over time, identify lingering knowledge gaps, and follow personalized practice priorities.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-brand-700 dark:text-brand-400">
                  Data-backed study focus
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* EDUCATIONAL STUDY GUIDES & STRATEGY SHOWCASE                              */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-slate-50/70 dark:bg-slate-950/70 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  FREE STUDY RESOURCES
                </span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  High-Yield Study Guides &amp; Articles
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
                  <span>FAQ &amp; Help</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: RA 6713 */}
              <div className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline"
                >
                  Read Study Guide &rarr;
                </Link>
              </div>

              {/* Card 2: 67-Second Rule */}
              <div className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-100 dark:border-brand-800">
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline"
                >
                  Read Article &rarr;
                </Link>
              </div>

              {/* Card 3: 1987 Constitution */}
              <div className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline"
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
