"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { ExamPickerCard } from "@/components/home/ExamPickerCard";
import { ComingSoonExams } from "@/components/home/ComingSoonExams";
import { EXAM_CATALOG } from "@/config/exams";

export function ReviewTayoHomeView() {
  const liveExam = EXAM_CATALOG.find((e) => e.id === "cse")!;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-[#f8edef] selection:text-[#86152d]">
      <Header />

      <main id="main-content" className="flex-1 animate-page-enter">
        {/* ========================================================================= */}
        {/* HERO SECTION: 2-Column Redesign with ExamPickerCard                      */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-border bg-gradient-to-b from-white via-brand-50/20 to-background dark:from-[#1E191C] dark:via-[#1E191C]/60 dark:to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* LEFT COLUMN: Benefit-Driven Headline, Subcopy, Trust Line (7 cols) */}
              <div className="lg:col-span-7 text-left space-y-6">
                {/* Eyebrow Label */}
                <div className="inline-flex items-center gap-2 border-b border-border/80 pb-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-brand-700 dark:text-brand-400">
                    PHILIPPINE EXAM PREPARATION
                  </span>
                  <span>&bull;</span>
                  <span className="text-slate-400 dark:text-slate-500">
                    ReviewTayo Library
                  </span>
                </div>

                {/* H1 Benefit Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.12]">
                  Free practice exams for Philippine government and licensure tests.
                </h1>

                {/* Short Subcopy */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  Practice with full-length continuous timers, step-by-step rationales, and official subtest breakdowns engineered for examinees.
                </p>

                {/* Trust Line */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    No account needed
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    Free diagnostic
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                    Explanations included
                  </span>
                </div>

                {/* Secondary Explore Anchor */}
                <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <a
                    href="#available-now"
                    className="inline-flex items-center gap-1 text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 hover:underline"
                  >
                    <span>Browse available exams below</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <span>&bull;</span>
                  <a
                    href="#how-it-works"
                    className="hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
                  >
                    How ReviewTayo works
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Exam Picker Card (Direct 2-Click Path to Diagnostic) (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <ExamPickerCard initialLevel="professional" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 1: AVAILABLE NOW (Featured Live Exam)                            */}
        {/* ========================================================================= */}
        <section
          id="available-now"
          className="py-14 sm:py-18 bg-white dark:bg-[#161315] border-b border-border scroll-mt-14"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available Now</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  Available Now: Start With a Live Reviewer
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Full question bank, continuous timer simulations, and instant performance analysis.
                </p>
              </div>

              <span className="text-xs text-slate-500 font-medium">Guest practice is 100% free</span>
            </div>

            {/* Live Exam Feature Card */}
            <article className="rounded-2xl border-2 border-brand-200 dark:border-brand-900/80 bg-slate-50/60 dark:bg-[#1E191C]/70 p-6 sm:p-8 shadow-xs hover:border-brand-300 dark:hover:border-brand-800 transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950 text-xs font-black text-brand-800 dark:text-brand-300">
                      {liveExam.shortName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live &bull; 2027 Schedule
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {liveExam.fullName}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {liveExam.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {liveExam.agency}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {liveExam.levels.map((l) => `${l.shortName} (${l.items} items)`).join(" · ")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Continuous 3h 10m / 2h 40m timer
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <Link
                    href={liveExam.href}
                    prefetch={true}
                    className="inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs transition"
                  >
                    <span>Open exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/exams/professional/quick"
                    prefetch={true}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
                  >
                    <span>Free diagnostic</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: COMING SOON EXAMS (Planned Reviewers + Notify Me)             */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-18 bg-slate-50/80 dark:bg-slate-950/60 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ComingSoonExams />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: HOW IT WORKS (3 Concrete Steps)                               */}
        {/* ========================================================================= */}
        <section
          id="how-it-works"
          className="py-16 sm:py-20 bg-white dark:bg-[#1E191C] border-b border-border scroll-mt-14"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                THE REVIEWTAYO METHOD
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                How ReviewTayo Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Three focused stages designed to build confidence, speed, and concept mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Step 1 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                    01
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Pick an exam
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Select your target exam and eligibility level. Your workspace configures the official syllabus rules and authentic item counts.
                  </p>
                </div>
                <div className="text-xs font-bold text-brand-700 dark:text-brand-400 pt-2 border-t border-border/60">
                  Career Service Professional or Subprofessional
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                    02
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Take a free diagnostic
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Test your baseline knowledge with a rapid 10-item diagnostic drill or simulate full 170-item pacing under the exact 3h 10m countdown.
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-2 border-t border-border/60">
                  Continuous single timer &bull; 67s per question
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block">
                    03
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Follow recommended practice
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Read step-by-step rationales, track subject accuracy, and drill weak competencies with targeted subtest practice.
                  </p>
                </div>
                <div className="text-xs font-bold text-brand-700 dark:text-brand-400 pt-2 border-t border-border/60">
                  Detailed explanations for every question
                </div>
              </div>
            </div>

            {/* Link to Full Details */}
            <div className="text-center pt-2">
              <Link
                href="/cse#how-your-review-works"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 underline underline-offset-4 decoration-brand-200 dark:decoration-brand-800"
              >
                <span>Learn more about the ReviewTayo study methodology</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STUDY GUIDES SHOWCASE                                                    */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-18 bg-slate-50/70 dark:bg-slate-950/70 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  FREE STUDY RESOURCES
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  High-Yield Study Guides &amp; Strategy
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                  Master official syllabus rules, constitutional provisions, and timer pacing.
                </p>
              </div>

              <Link
                href="/guides"
                prefetch={true}
                className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 transition flex items-center gap-1"
              >
                <span>All study guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Guide 1: RA 6713 */}
              <div className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
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

              {/* Guide 2: 67-Second Rule */}
              <div className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-100 dark:border-brand-800">
                    Exam Strategy
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    <Link href="/articles/continuous-timer-pacing-strategy" prefetch={true} className="hover:text-brand-700 dark:hover:text-brand-400 transition">
                      The 67-Second Rule: Continuous Timer Pacing Strategy
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    How to allocate your 190 minutes across four phases so you never run out of time on the 170-item CSE.
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

              {/* Guide 3: 1987 Constitution */}
              <div className="p-6 rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
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
