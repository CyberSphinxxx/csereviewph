"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ReviewTayoOwl, OwlMood } from "@/components/brand/ReviewTayoOwl";

interface SampleQuestion {
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    subject: "Numerical ability",
    question: "What is 15% of 240?",
    options: ["24", "36", "48", "32"],
    correctIndex: 1,
    explanation: "10% of 240 is 24 and 5% is 12. Add them to get 36.",
  },
  {
    subject: "Verbal ability",
    question: "Choose the word closest in meaning to “prudent”.",
    options: ["Reckless", "Hasty", "Careful", "Generous"],
    correctIndex: 2,
    explanation: "Prudent means acting with care and good judgment.",
  },
  {
    subject: "General information",
    question: "How many norms of conduct does RA 6713 list?",
    options: ["12", "8", "10", "5"],
    correctIndex: 1,
    explanation: "RA 6713 lists eight norms, from commitment to public interest to simple living.",
  },
];

export function TryQuestionSection() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [owlMood, setOwlMood] = useState<OwlMood>("idle");
  const [confettiActive, setConfettiActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(598);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentQ = SAMPLE_QUESTIONS[questionIndex];

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((s) => (s > 0 ? s - 1 : 598));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSelectOption = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setOwlMood("happy");
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 1200);
    } else {
      setOwlMood("oops");
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setOwlMood("idle");
    setConfettiActive(false);
    setQuestionIndex((prev) => (prev + 1) % SAMPLE_QUESTIONS.length);
  };

  const progressPercent = ((questionIndex + 1) / 10) * 100;

  return (
    <section id="sec-b" className="py-16 md:py-24 relative">

      <div className="max-w-[1200px] mx-auto px-5 sm:px-11 grid grid-cols-1 lg:grid-cols-[1.02fr_1fr] gap-10 lg:gap-16 items-center">
        {/* Left Column: Heading & 3 Steps */}
        <div className="text-left">
          <h2 className="font-display font-extrabold text-[clamp(44px,6.2vw,86px)] leading-[0.98] tracking-[-0.035em] text-[#1b1216] m-0">
            Try a real question. Right now.
          </h2>

          <ol className="list-none my-[26px] p-0 grid gap-3">
            <li className="flex items-center gap-3 font-semibold text-[18px] text-[#3a2c32]">
              <span className="w-8 h-8 rounded-[10px] bg-[#8a1630] text-white grid place-items-center font-extrabold text-[14px] shrink-0">
                1
              </span>
              Answer a sample item
            </li>
            <li className="flex items-center gap-3 font-semibold text-[18px] text-[#3a2c32]">
              <span className="w-8 h-8 rounded-[10px] bg-[#8a1630] text-white grid place-items-center font-extrabold text-[14px] shrink-0">
                2
              </span>
              Read the step-by-step reason
            </li>
            <li className="flex items-center gap-3 font-semibold text-[18px] text-[#3a2c32]">
              <span className="w-8 h-8 rounded-[10px] bg-[#8a1630] text-white grid place-items-center font-extrabold text-[14px] shrink-0">
                3
              </span>
              Get a plan from your weak subjects
            </li>
          </ol>

          <Link
            href="/exams/professional/quick"
            className="inline-flex items-center justify-center gap-2 px-6 py-[15px] rounded-[14px] font-bold text-[16px] text-white bg-[#8a1630] shadow-[0_10px_24px_-10px_rgba(138,22,48,0.75)] hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-10px_rgba(138,22,48,0.8)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
          >
            Take the 10-question diagnostic
          </Link>
          <p className="mt-4 text-[14px] text-[#6d5d63] font-medium">10 questions · 10 minutes</p>
        </div>

        {/* Right Column: Tilted Stacked Card */}
        <div className="relative pt-[110px] sm:pt-[76px] pb-6 px-2 sm:pl-[30px] sm:pr-3">
          {/* Tilted Gold Back Card */}
          <div className="absolute inset-[96px_14px_0_66px] bg-[#f6b93b] rounded-[28px] -rotate-4 pointer-events-none" />

          {/* Tilted Maroon Back Card */}
          <div className="absolute inset-[88px_0_4px_44px] bg-[#8a1630] rounded-[28px] rotate-[3.2deg] pointer-events-none" />

          {/* Foreground Interactive Card */}
          <div
            ref={cardRef}
            className="relative bg-white rounded-[26px] p-6 sm:p-7 shadow-[0_30px_60px_-30px_rgba(60,10,25,0.55)] -rotate-[1.6deg] hover:rotate-0 focus-within:rotate-0 transition-transform duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)] text-left"
          >
            {/* Peeking Owl Mascot perched on top right */}
            <div className="absolute right-[30px] -top-[95px] w-[100px] animate-owl-bob pointer-events-none">
              <ReviewTayoOwl size={100} withCap mood={owlMood} alt="Interactive test owl" />
            </div>

            {/* Confetti Particles on Correct Answer */}
            {confettiActive && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[26px]">
                {Array.from({ length: 18 }).map((_, i) => {
                  const colors = ["#8a1630", "#f6b93b", "#12a150", "#a81b3b"];
                  const angle = (Math.PI * 2 * i) / 18;
                  const distance = 90 + (i % 4) * 30;
                  const dx = Math.cos(angle) * distance;
                  const dy = Math.sin(angle) * distance - 40;
                  const rot = (i * 45) % 360;

                  return (
                    <span
                      key={i}
                      className="conf-particle"
                      style={
                        {
                          backgroundColor: colors[i % 4],
                          "--dx": `${dx}px`,
                          "--dy": `${dy}px`,
                          "--rot": `${rot}deg`,
                        } as React.CSSProperties
                      }
                    />
                  );
                })}
              </div>
            )}

            {/* Card Header: Question Counter & Timer */}
            <div className="flex justify-between items-center font-bold text-[14px] text-[#6d5d63]">
              <span>
                Question <b className="text-[#1b1216]">{questionIndex + 1}</b> of 10
              </span>
              <span className="bg-[#fbeff0] text-[#8a1630] py-1 px-3 rounded-full font-mono text-[13px] tabular-nums">
                {formatTimer(timerSeconds)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-[6px] rounded-[9px] bg-[#f3e6e8] my-3 sm:my-4 overflow-hidden">
              <i
                className="block h-full bg-[#8a1630] rounded-[9px] transition-[width] duration-500 not-italic"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Metadata Chips */}
            <div className="flex justify-between items-center text-[13px] text-[#7a6a70] font-semibold mb-2">
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#fbeff0] text-[#8a1630] text-[12px] font-bold">
                {currentQ.subject}
              </span>
              <span>Sample · Civil Service Exam</span>
            </div>

            {/* Question Text */}
            <h3 className="font-display font-extrabold text-[26px] sm:text-[30px] leading-[1.05] tracking-[-0.025em] text-[#1b1216] my-2">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5 mt-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === currentQ.correctIndex;
                const showResult = selectedAnswer !== null;

                let optClass = "border-[#efe3e5] bg-white hover:border-[#8a1630] hover:translate-x-1";
                let keyClass = "bg-[#fbeff0] text-[#8a1630]";

                if (showResult) {
                  if (isCorrect) {
                    optClass = "border-[#12a150] bg-[#e9f8ef]";
                    keyClass = "bg-[#12a150] text-white";
                  } else if (isSelected) {
                    optClass = "border-[#d1344b] bg-[#fdecef]";
                    keyClass = "bg-[#d1344b] text-white";
                  } else {
                    optClass = "border-[#efe3e5] bg-white opacity-60";
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={showResult}
                    onClick={() => handleSelectOption(i)}
                    className={`w-full flex items-center gap-3.5 text-left py-3 px-4 rounded-[14px] border-2 font-semibold text-[17px] text-[#1b1216] transition-all cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${optClass}`}
                  >
                    <span
                      className={`w-[30px] h-[30px] rounded-[9px] grid place-items-center font-extrabold text-[14px] shrink-0 ${keyClass}`}
                    >
                      {"ABCD"[i]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Step-by-Step Explanation Banner */}
            {selectedAnswer !== null && (
              <div className="mt-3.5 p-3.5 sm:p-4 rounded-[14px] bg-[#fbeff0] flex gap-3 items-start animate-[pop_0.35s_ease-out]">
                <div className="w-[36px] shrink-0">
                  <ReviewTayoOwl size={36} withCap mood={owlMood} aria-hidden="true" />
                </div>
                <div className="text-[14px] text-[#1b1216] leading-relaxed">
                  <b className="block font-bold">
                    {selectedAnswer === currentQ.correctIndex ? "Correct." : "Not quite."}
                  </b>
                  <span>{currentQ.explanation}</span>
                </div>
              </div>
            )}

            {/* Next Question Button */}
            {selectedAnswer !== null && (
              <button
                type="button"
                onClick={handleNext}
                className="mt-3.5 w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-[14px] font-bold text-[16px] text-white bg-[#8a1630] hover:bg-[#701126] transition shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
              >
                Next question
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
