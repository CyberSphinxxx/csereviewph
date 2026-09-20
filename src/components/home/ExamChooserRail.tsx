"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

export type ExamCategory = "all" | "civil" | "licensure" | "safety";

export interface ExamItem {
  code: string;
  name: string;
  agency: string;
  category: "civil" | "licensure" | "safety";
  isLive?: boolean;
}

const EXAMS: ExamItem[] = [
  {
    code: "CSE",
    name: "Civil Service Exam",
    agency: "Civil Service Commission",
    category: "civil",
    isLive: true,
  },
  {
    code: "LET",
    name: "Licensure Examination for Teachers",
    agency: "Professional Regulation Commission",
    category: "licensure",
  },
  {
    code: "CLE",
    name: "Criminologist Licensure Examination",
    agency: "Professional Regulation Commission",
    category: "licensure",
  },
  {
    code: "NLE",
    name: "Philippine Nursing Licensure Examination",
    agency: "Professional Regulation Commission",
    category: "licensure",
  },
  {
    code: "PNP",
    name: "NAPOLCOM Police Examinations",
    agency: "National Police Commission",
    category: "safety",
  },
  {
    code: "BFP",
    name: "Bureau of Fire Protection Exams",
    agency: "Bureau of Fire Protection",
    category: "safety",
  },
];

export function ExamChooserRail() {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>("all");
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const railRef = useRef<HTMLDivElement>(null);

  const filteredExams = EXAMS.filter(
    (x) => selectedCategory === "all" || x.category === selectedCategory
  );

  const liveCount = filteredExams.filter((x) => x.isLive).length;

  const handleVote = (code: string) => {
    setVotedMap((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const scrollRail = (direction: "left" | "right") => {
    if (!railRef.current) return;
    const offset = direction === "left" ? -300 : 300;
    railRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section id="sec-c" className="pt-16 sm:pt-20 pb-6 text-center relative">
      <span id="exams" className="absolute -top-16" />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-11">
        {/* Section Owl Mascot */}
        <div className="w-[92px] mx-auto mb-1 animate-owl-bob">
          <ReviewTayoOwl size={92} withCap alt="Exam selection owl" />
        </div>

        {/* Section Heading */}
        <h2 className="font-display font-extrabold text-[clamp(42px,6.4vw,88px)] leading-[0.98] tracking-[-0.035em] text-[#1b1216] m-0">
          Which exam are you taking?
        </h2>

        {/* Category Filter Tabs */}
        <div
          role="group"
          aria-label="Exam category"
          className="inline-flex flex-wrap justify-center gap-1.5 mt-6 mb-2.5 p-1.5 bg-white rounded-full shadow-[0_0_0_1px_rgba(138,22,48,0.12)]"
        >
          <button
            type="button"
            aria-pressed={selectedCategory === "all"}
            onClick={() => {
              setSelectedCategory("all");
              railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
            }}
            className={`border-0 py-2.5 px-4 sm:px-5 rounded-full font-bold text-[15px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
              selectedCategory === "all"
                ? "bg-[#8a1630] text-white"
                : "bg-transparent text-[#5a4a50] hover:bg-[#fbeff0]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === "civil"}
            onClick={() => {
              setSelectedCategory("civil");
              railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
            }}
            className={`border-0 py-2.5 px-4 sm:px-5 rounded-full font-bold text-[15px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
              selectedCategory === "civil"
                ? "bg-[#8a1630] text-white"
                : "bg-transparent text-[#5a4a50] hover:bg-[#fbeff0]"
            }`}
          >
            Civil Service
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === "licensure"}
            onClick={() => {
              setSelectedCategory("licensure");
              railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
            }}
            className={`border-0 py-2.5 px-4 sm:px-5 rounded-full font-bold text-[15px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
              selectedCategory === "licensure"
                ? "bg-[#8a1630] text-white"
                : "bg-transparent text-[#5a4a50] hover:bg-[#fbeff0]"
            }`}
          >
            Licensure
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === "safety"}
            onClick={() => {
              setSelectedCategory("safety");
              railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
            }}
            className={`border-0 py-2.5 px-4 sm:px-5 rounded-full font-bold text-[15px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
              selectedCategory === "safety"
                ? "bg-[#8a1630] text-white"
                : "bg-transparent text-[#5a4a50] hover:bg-[#fbeff0]"
            }`}
          >
            Public Safety
          </button>
        </div>

        {/* Dynamic Counter text */}
        <p className="text-[14px] font-semibold text-[#5a4a50] min-h-[22px]" aria-live="polite">
          {filteredExams.length} {filteredExams.length === 1 ? "exam" : "exams"} ·{" "}
          {liveCount ? `${liveCount} live` : "coming soon"}
        </p>
      </div>

      {/* Horizontally Scrollable Rail */}
      <div className="relative pb-16">
        <div
          ref={railRef}
          tabIndex={0}
          aria-label="Exams carousel"
          className="c-rail flex gap-[18px] overflow-x-auto snap-x snap-mandatory scroll-p-6 sm:scroll-p-11 py-6 px-6 sm:px-11 text-left [mask-image:linear-gradient(90deg,transparent_0,#000_40px,#000_calc(100%-90px),transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
        >
          {filteredExams.map((exam) => {
            const isVoted = Boolean(votedMap[exam.code]);

            if (exam.isLive) {
              return (
                <article
                  key={exam.code}
                  data-cat={exam.category}
                  className="shrink-0 basis-[340px] h-[396px] rounded-[28px] p-[22px] relative overflow-hidden snap-start flex flex-col justify-between transition-all duration-300 bg-[#8a1630] text-white hover:-translate-y-2 hover:-rotate-[1.2deg] hover:shadow-[0_30px_40px_-26px_rgba(60,10,25,0.6)] group"
                >
                  {/* Top Bar */}
                  <div className="flex justify-between items-center text-[13px] font-bold">
                    <span className="py-1 px-3 rounded-full bg-white/20 inline-flex items-center gap-1.5">
                      <i className="inline-block w-[7px] h-[7px] rounded-full bg-[#4be08c] not-italic" />
                      Live
                    </span>
                    <span>2 levels · 5 subtests</span>
                  </div>

                  {/* Giant Exam Acronym */}
                  <div className="font-display font-extrabold text-[96px] leading-[0.8] tracking-[-0.055em] my-1.5 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-[1.04]">
                    {exam.code}
                  </div>

                  {/* Bottom Content & Shortcuts */}
                  <div>
                    <h4 className="font-display font-bold text-[21px] leading-[1.05] tracking-[-0.02em] text-white m-0">
                      {exam.name}
                    </h4>
                    <p className="text-[13px] opacity-80 mt-1 mb-2.5">{exam.agency}</p>

                    <div className="grid grid-cols-2 gap-2 mb-2.5 text-[12.5px] font-bold">
                      <span className="col-span-2 opacity-85">Start a free diagnostic</span>
                      <Link
                        href="/exams/professional/quick"
                        className="rounded-[10px] py-2 px-1.5 bg-white/15 text-white font-bold text-[13px] text-center shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-colors"
                      >
                        Professional
                      </Link>
                      <Link
                        href="/exams/subprofessional/quick"
                        className="rounded-[10px] py-2 px-1.5 bg-white/15 text-white font-bold text-[13px] text-center shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.4)] hover:bg-white/30 transition-colors"
                      >
                        Subprofessional
                      </Link>
                    </div>

                    <Link
                      href="/cse"
                      className="block w-full rounded-[12px] py-3 text-center font-extrabold text-[15px] bg-[#f6b93b] text-[#2a0a12] hover:scale-[1.02] transition-transform shadow-md"
                    >
                      Open exam
                    </Link>
                  </div>
                </article>
              );
            }

            // Coming Soon Cards (Licensure / Safety)
            const isLicensure = exam.category === "licensure";
            const bgClass = isLicensure ? "bg-[#fdeec6]" : "bg-[#dce6f8]";
            const fgClass = isLicensure ? "text-[#6b4300]" : "text-[#1f3a6e]";

            return (
              <article
                key={exam.code}
                data-cat={exam.category}
                className={`shrink-0 basis-[252px] h-[396px] rounded-[28px] p-[22px] relative overflow-hidden snap-start flex flex-col justify-between transition-all duration-300 ${bgClass} ${fgClass} hover:-translate-y-2 hover:-rotate-[1.2deg] hover:shadow-[0_30px_40px_-26px_rgba(60,10,25,0.6)] group`}
              >
                {/* Top Bar */}
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="py-1 px-3 rounded-full bg-white/55">Coming soon</span>
                </div>

                {/* Acronym */}
                <div className="font-display font-extrabold text-[96px] leading-[0.8] tracking-[-0.055em] my-1.5 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-[1.04]">
                  {exam.code}
                </div>

                {/* Bottom Content & Vote Button */}
                <div>
                  <h4 className="font-display font-bold text-[21px] leading-[1.05] tracking-[-0.02em] m-0">
                    {exam.name}
                  </h4>
                  <p className="text-[13px] opacity-80 mt-1 mb-3">{exam.agency}</p>

                  <button
                    type="button"
                    aria-pressed={isVoted}
                    onClick={() => handleVote(exam.code)}
                    className={`w-full border-0 rounded-[12px] py-3 font-extrabold text-[15px] cursor-pointer transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
                      isVoted ? "bg-[#1b1216] text-white" : "bg-white text-inherit shadow-xs"
                    }`}
                  >
                    {isVoted ? "Voted" : "Vote for this exam"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Carousel Arrow Navigation Buttons */}
        <div className="absolute right-6 sm:right-11 bottom-2 flex gap-2.5 z-20">
          <button
            type="button"
            onClick={() => scrollRail("left")}
            aria-label="Previous exams"
            className="w-12 h-12 rounded-full border-0 bg-white shadow-[0_0_0_1.5px_rgba(138,22,48,0.25)] cursor-pointer grid place-items-center hover:bg-[#8a1630] group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
          >
            <svg
              className="w-5 h-5 stroke-[#8a1630] group-hover:stroke-white fill-none stroke-[2.6] stroke-linecap-round stroke-linejoin-round"
              viewBox="0 0 24 24"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollRail("right")}
            aria-label="Next exams"
            className="w-12 h-12 rounded-full border-0 bg-white shadow-[0_0_0_1.5px_rgba(138,22,48,0.25)] cursor-pointer grid place-items-center hover:bg-[#8a1630] group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
          >
            <svg
              className="w-5 h-5 stroke-[#8a1630] group-hover:stroke-white fill-none stroke-[2.6] stroke-linecap-round stroke-linejoin-round"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
