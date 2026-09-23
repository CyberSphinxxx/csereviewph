"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  Target,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ExamSubNav } from "@/components/layout/ExamSubNav";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { HeroExamLevelSelector } from "@/components/home/HeroExamLevelSelector";
import { SubtestExplorer } from "@/components/home/SubtestExplorer";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";
import { useExamLevel } from "@/lib/hooks/useExamLevel";
import { getExamConfig } from "@/config/exams";
import { getExamCountdown } from "@/lib/date-utils";

type CseLevel = "professional" | "subprofessional";

const LEVEL_FACTS: Record<
  CseLevel,
  { name: string; items: number; time: string; exclusive: string; eligibility: string }
> = {
  professional: {
    name: "Professional",
    items: 170,
    time: "3h 10m",
    exclusive: "Analytical Ability",
    eligibility: "2nd Level Eligibility",
  },
  subprofessional: {
    name: "Subprofessional",
    items: 165,
    time: "2h 40m",
    exclusive: "Clerical Ability",
    eligibility: "1st Level Eligibility",
  },
};

const SUBTESTS: Array<{
  name: string;
  desc: string;
  questions: string;
  level?: CseLevel;
}> = [
  {
    name: "Verbal Ability",
    desc: "Grammar, vocabulary, paragraph organization, and reading comprehension.",
    questions: "50Q",
  },
  {
    name: "Numerical Ability",
    desc: "Basic operations and word problems.",
    questions: "40Q",
  },
  {
    name: "Analytical Ability",
    desc: "Logic, syllogisms, data sufficiency, and number analogy. Professional only.",
    questions: "30Q",
    level: "professional",
  },
  {
    name: "Clerical Operations",
    desc: "Alphabetizing, office filing procedures, and spelling. Subprofessional only.",
    questions: "30Q",
    level: "subprofessional",
  },
  {
    name: "General Information",
    desc: "Constitution, Code of Conduct (RA 6713), peace and human rights, environment.",
    questions: "20Q",
  },
];

const FLOW_STEPS = [
  {
    title: "Choose before you practice",
    desc: "First visit to Practice or Mock exams with no level chosen shows a lightweight chooser, not a modal trap.",
  },
  {
    title: "Everything inherits it",
    desc: "Item counts, timers, subtests, and dashboard stats all read one stored level.",
  },
  {
    title: "Switch is always one tap",
    desc: "The pill sits in the subnav on every exam page. Switching mid-session asks once.",
  },
  {
    title: "Other exams live in Exams",
    desc: "The pill only lists CSE levels. Other exams route to the /reviewers catalog.",
  },
];

export function CSELandingClient() {
  const [selectedLevel, setSelectedLevel] = useExamLevel<CseLevel>("cse");
  const [guidedStep, setGuidedStep] = useState(2);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const facts = LEVEL_FACTS[selectedLevel];
  const cseConfig = getExamConfig("cse");
  const examDate = cseConfig?.examDate ?? "2027-03-14";
  const countdown = useMemo(() => getExamCountdown(examDate), [examDate]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-[#f8edef] selection:text-[#86152d]">
      <Header />
      <ExamSubNav
        examId="cse"
        currentLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
      />

      <main className="flex-1 animate-page-enter">
        {/* ===================================================================== */}
        {/* 1 - COMMAND CENTER HERO                                               */}
        {/* ===================================================================== */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-brand-50/20 to-background dark:from-[#1E191C] dark:via-[#1E191C]/60 dark:to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-10 sm:py-14 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left: promise */}
              <div className="lg:col-span-7 text-left space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400 block">
                  PHILIPPINE CIVIL SERVICE EXAM REVIEWER
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] max-w-lg">
                  Pass the{" "}
                  <span className="text-brand-600 dark:text-brand-400">CSE</span>{" "}
                  on your first take.
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
                  Free subtest drills, full-length continuous-timer mock exams,
                  and explanations for every single item, all matched to the
                  level you choose.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {["No account needed", `${facts.items}-item mock`, "Rationales included"].map(
                    (label) => (
                      <span key={label} className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                        {label}
                      </span>
                    )
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="#choose-your-battle"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs transition"
                  >
                    Choose your level
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="#guided-track"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    See the 5-step plan
                  </Link>
                </div>
              </div>

              {/* Right: start panel (reuses the existing level selector) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <HeroExamLevelSelector
                  selectedLevel={selectedLevel}
                  onSelectLevel={setSelectedLevel}
                  compareHref="#choose-your-battle"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2 - CHOOSE YOUR BATTLE (level chooser + subtest grid)                 */}
        {/* ===================================================================== */}
        <section
          id="choose-your-battle"
          className="py-14 sm:py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 scroll-mt-14"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                STEP 1 OF YOUR PLAN &bull; CHOOSE ONCE, EVERYTHING FOLLOWS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Which CSE are you taking?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Your choice sets every item count, timer, and subtest below, and
                everywhere else on ReviewTayo. You can switch anytime from the
                pill in the nav.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(LEVEL_FACTS) as CseLevel[]).map((key) => {
                const lv = LEVEL_FACTS[key];
                const isChosen = selectedLevel === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedLevel(key)}
                    aria-pressed={isChosen}
                    className={`group relative text-left rounded-3xl p-6 sm:p-8 overflow-hidden transition-all flex flex-col gap-5 ${
                      key === "professional"
                        ? "bg-gradient-to-br from-brand-700 to-[#5d0e22] text-white"
                        : "bg-gradient-to-br from-[#3c1020] to-[#2a0a12] text-white"
                    } ${
                      isChosen
                        ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                        : "hover:-translate-y-1 hover:shadow-lg"
                    }`}
                  >
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold uppercase tracking-wider">
                        {lv.eligibility}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">
                        Career Service {lv.name}
                      </h3>
                      <p className="text-sm text-brand-100/90 mt-1.5">
                        {key === "professional"
                          ? "For technical, scientific, executive, and managerial roles. The harder track, and the more common goal."
                          : "For first-level clerical, trades, crafts, and custodial positions in government."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[13px] font-bold">
                      <span className="px-3 py-1 rounded-full bg-white/15">{lv.items} items</span>
                      <span className="px-3 py-1 rounded-full bg-white/15">{lv.time}</span>
                      <span className="px-3 py-1 rounded-full bg-white/15">
                        {lv.exclusive} included
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="inline-flex items-center gap-2 bg-gold-400 text-[#2a0a12] font-bold px-4 py-2.5 rounded-xl text-sm">
                        {isChosen ? "Chosen" : `Review as ${lv.name}`}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <span className="hidden sm:block w-20 opacity-90 -mb-8 pointer-events-none" aria-hidden="true">
                        <ReviewTayoOwl className="w-full h-auto" bob tracked />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-5">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
                What&rsquo;s inside your level:{" "}
                <span className="text-brand-700 dark:text-brand-400">{facts.name}</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SUBTESTS.map((s) => {
                  const visible = !s.level || s.level === selectedLevel;
                  if (!visible) return null;
                  return (
                    <div
                      key={s.name}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 space-y-1.5"
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {s.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {s.desc}
                      </p>
                      <span className="text-xs font-black text-brand-700 dark:text-brand-400">
                        {s.questions}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3 - GUIDED TRACK (five steps to eligibility)                          */}
        {/* ===================================================================== */}
        <section
          id="guided-track"
          className="py-14 sm:py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 scroll-mt-14"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                YOUR REVIEW, IN ORDER
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Five steps to eligibility.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Every step unlocks the next. The level you picked flows through
                all of them: items, timers, subtests, results.
              </p>
            </div>

            <ol className="space-y-4">
              {[
                {
                  n: 1,
                  title: "Choose your exam level",
                  body: (
                    <>
                      Currently: CSE &middot;{" "}
                      <strong className="text-slate-900 dark:text-white">{facts.name}</strong>
                      . Saved on this device and applied across the whole site.
                    </>
                  ),
                  done: true,
                },
                { n: 2, title: "Take the 10-minute diagnostic", body: <>A representative sample across every subtest in your level, with results in ten minutes.</> },
                { n: 3, title: "Read your breakdown", body: <>Subject-by-subject accuracy with the rationale behind every item, not just right or wrong.</> },
                { n: 4, title: "Drill your weakest subtest", body: <>Topic practice targets your lowest-accuracy area first. The owl coaches you through each answer.</> },
                { n: 5, title: "Simulate exam day", body: <>The full {facts.items}-item, {facts.time} continuous-timer mock, taken when your drills say you&rsquo;re ready.</> },
              ].map((step) => {
                const isDone = step.done || step.n < guidedStep;
                const isCurrent = !isDone && step.n === guidedStep;
                return (
                  <li
                    key={step.n}
                    className={`flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900 transition-shadow ${
                      isCurrent
                        ? "ring-2 ring-brand-700 shadow-md dark:ring-brand-400"
                        : "border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <span
                      className={`w-12 h-12 rounded-2xl grid place-items-center font-black text-xl shrink-0 ${
                        isDone
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : isCurrent
                            ? "bg-brand-700 text-white"
                            : "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400"
                      }`}
                      aria-hidden="true"
                    >
                      {isDone ? <CheckCircle2 className="w-6 h-6" /> : step.n}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.body}
                      </p>
                      {isCurrent && step.n === 2 && (
                        <div className="pt-2">
                          <Link
                            href={`/exams/${selectedLevel}/quick`}
                            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition"
                          >
                            Start diagnostic
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                          </Link>
                        </div>
                      )}
                      {isCurrent && step.n === 4 && (
                        <div className="pt-2">
                          <Link
                            href="/practice"
                            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-950 transition"
                          >
                            See recommended practice
                          </Link>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Demo affordance: preview a later step as current (no backend yet) */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Preview your progress:</span>
              {[2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setGuidedStep(n)}
                  aria-pressed={guidedStep === n}
                  className={`px-3 py-1.5 rounded-full border font-bold transition ${
                    guidedStep === n
                      ? "bg-brand-700 text-white border-brand-700"
                      : "border-slate-300 dark:border-slate-700 hover:border-brand-400"
                  }`}
                >
                  Step {n}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 4 - URGENCY BAND (single countdown on the page)                       */}
        {/* ===================================================================== */}
        <section className="py-14 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#4a0f1f] to-[#2a0a12] text-white p-8 sm:p-12">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(560px circle at 80% 25%, rgba(150,26,58,0.55), transparent 60%)",
                }}
                aria-hidden="true"
              />
              <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block">
                    Civil Service Exam &bull; {facts.name} track
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05]">
                    Exam day is <span className="text-gold-400">coming.</span>
                    <br />
                    Be ready for it.
                  </h2>
                  <p className="text-brand-100/90 max-w-xl text-sm sm:text-base">
                    Every drill and mock you take from now on is pace training
                    for this date. The mock exam replicates the exact{" "}
                    {facts.items}-item, single-timer format, so nothing
                    surprises you on the day.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <span className="inline-flex items-center gap-2 bg-white/10 ring-1 ring-white/25 rounded-xl px-4 py-2.5 text-sm font-bold">
                      <Calendar className="w-4 h-4 text-gold-400 shrink-0" aria-hidden="true" />
                      <span className="text-gold-400">{countdown.formattedDate}</span>
                      <span className="inline-flex items-center rounded-full bg-gold-400 text-[#2a0a12] px-2.5 py-0.5 font-black text-xs tabular-nums">
                        {countdown.days} days left
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setScheduleOpen((o) => !o)}
                      aria-expanded={scheduleOpen}
                      className="inline-flex items-center gap-1 text-sm font-bold text-gold-400 hover:text-gold-300 underline underline-offset-4"
                    >
                      View dates
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    {scheduleOpen && (
                      <span className="text-xs text-brand-100/80">
                        Full schedule lives in{" "}
                        <Link href="/cse/exam-guide#schedule" className="underline font-semibold text-white">
                          Exam info
                        </Link>
                        .
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative shrink-0 mx-auto lg:mx-0" aria-hidden="true">
                  <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full grid place-items-center bg-[radial-gradient(circle_at_34%_28%,#ffe28f,#f6b93b_58%,#d78d14)] shadow-[0_0_90px_18px_rgba(246,185,59,0.3)]">
                    <ReviewTayoOwl className="w-24 h-auto" bob tracked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 5 - PREPARATION MODES (single set, mapped to the guided track)        */}
        {/* ===================================================================== */}
        <section
          id="preparation-modes"
          className="py-14 sm:py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800 scroll-mt-14"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Choose your preparation mode
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Three formats, ordered to match your plan. Every count and timer
                follows your chosen level.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Test */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 hover:shadow-md transition flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                  Step 2 &bull; Daily pacing drill
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Quick Test</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                  10 randomized questions with instant diagnostic score and
                  concept explanations.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" aria-hidden="true" /> 10 minutes &bull; 10 items
                </div>
                <Link
                  href={`/exams/${selectedLevel}/quick`}
                  prefetch={true}
                  className="block text-center py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-bold text-sm transition shadow-xs"
                >
                  Launch Quick Test &rarr;
                </Link>
              </div>

              {/* Medium Test */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 hover:shadow-md transition flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                  Steps 3 and 4 &bull; Targeted review
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Medium Test</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                  30 items across all subtests or one chosen subject. Weekend
                  study sessions and targeted assessments.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" aria-hidden="true" /> 30 minutes &bull; 30 items
                </div>
                <Link
                  href={`/exams/${selectedLevel}/medium`}
                  prefetch={true}
                  className="block text-center py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm transition shadow-xs"
                >
                  Launch Medium Test &rarr;
                </Link>
              </div>

              {/* Full Mock */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#4a0f1f] to-[#2a0a12] text-white p-6 sm:p-7 hover:shadow-md transition flex flex-col gap-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400">
                  Step 5 &bull; Real exam simulation
                </span>
                <h3 className="text-2xl font-black tracking-tight">Full Mock Exam</h3>
                <p className="text-sm text-brand-100/90 leading-relaxed flex-1">
                  {facts.items} items with a continuous single timer, question
                  navigator, and review screen. Coach-free, just like the real
                  exam.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-brand-100/80">
                  <Clock className="w-4 h-4" aria-hidden="true" /> {facts.time} &bull; {facts.items} items
                </div>
                <Link
                  href={`/exams/${selectedLevel}/full`}
                  prefetch={true}
                  className="block text-center py-2.5 px-4 rounded-xl bg-gold-400 hover:bg-gold-300 text-[#2a0a12] font-bold text-sm transition"
                >
                  Start Real Simulation &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 6 - FLOW GUARANTEES FOOTER                                            */}
        {/* ===================================================================== */}
        <section className="py-14 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                THE UX FIX UNDERNEATH
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                One level, chosen once, everywhere.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                One stored level powers the whole site. These guarantees apply
                everywhere.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FLOW_STEPS.map((f, i) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-5 space-y-2"
                >
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-brand-700 text-white grid place-items-center text-[11px] font-black shrink-0">
                      {i + 1}
                    </span>
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 7 - WHY STUDY WITH REVIEWTAYO (trust claims)                          */}
        {/* ===================================================================== */}
        <section className="py-14 sm:py-16 bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                WHY STUDY WITH REVIEWTAYO
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Built for purposeful Civil Service review
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Exam preparation designed around accuracy, clear explanations, and exact CSC scope.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
                  <FileCheck2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">Exam scope</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Original practice questions</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every question is written for this platform and follows the published CSE scope.
                </p>
              </div>
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <BookOpenCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Concept mastery</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Detailed answer explanations</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Review why an answer is correct and strengthen the underlying concept.
                </p>
              </div>
              <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
                  <Target className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">Level coverage</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Built for both CSE levels</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Choose Professional or Subprofessional and study the subjects included in your level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 8 - SUBTEST & SYLLABUS EXPLORER                                       */}
        {/* ===================================================================== */}
        <section className="py-14 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Official Civil Service Commission scope
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Explore subtests &amp; high-yield syllabi
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Select a subtest below to inspect its item distribution, passing pacing rules, and high-yield topics.
              </p>
            </div>
            <SubtestExplorer />
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 9 - STUDY GUIDES & STRATEGY ARTICLES                                  */}
        {/* ===================================================================== */}
        <section className="py-14 sm:py-16 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Educational syllabus
                </span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  High-yield study guides &amp; strategy
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                  Master the official syllabus rules, constitutional articles, and pacing formulas.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/guides" prefetch={true} className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition flex items-center gap-1">
                  <span>All Study Guides</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Link href="/articles" prefetch={true} className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition flex items-center gap-1">
                  <span>Strategy Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Link href="/faq" prefetch={true} className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition flex items-center gap-1">
                  <span>Exam FAQ</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Link href="/guides/ra-6713-code-of-conduct" prefetch={true} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline">
                  Read Study Guide &rarr;
                </Link>
              </div>

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
                <Link href="/articles/continuous-timer-pacing-strategy" prefetch={true} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline">
                  Read Article &rarr;
                </Link>
              </div>

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
                <Link href="/guides/philippine-constitution-essentials" prefetch={true} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline">
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
