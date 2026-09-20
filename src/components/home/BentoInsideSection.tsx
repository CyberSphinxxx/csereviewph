"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

export function BentoInsideSection() {
  // Live continuous countdown timer (11400 seconds = 3h 10m)
  const [timerSeconds, setTimerSeconds] = useState(11400);
  const [selectedLength, setSelectedLength] = useState<10 | 30 | 170>(170);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((s) => (s > 0 ? s - 1 : 11400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const lengthCaptions: Record<10 | 30 | 170, string> = {
    10: "Best for a spare few minutes.",
    30: "A solid mid-length check on one or two subjects.",
    170: "One continuous timer, just like exam day.",
  };

  // Animate subject breakdown bars on intersection
  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;

    let reducedMotion = false;
    if (typeof window !== "undefined") {
      reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    }

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      setBarsAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="sec-d" className="py-20 md:py-24 relative">

      <div className="max-w-[1200px] mx-auto px-5 sm:px-11 grid grid-cols-1 lg:grid-cols-[0.85fr_1.3fr] gap-9 lg:gap-12 items-center text-left">
        {/* Left Column Copy */}
        <div className="space-y-5">
          <h2 className="font-display font-extrabold text-[clamp(42px,5.4vw,78px)] leading-[0.98] tracking-[-0.035em] text-[#1b1216] m-0">
            Practice like it’s exam day.
          </h2>
          <p className="text-[20px] text-[#4d3d43] leading-relaxed max-w-[26ch] m-0 font-normal">
            What’s inside the Civil Service Exam reviewer.
          </p>
          <div>
            <Link
              href="/cse"
              className="inline-flex items-center justify-center gap-2 px-6 py-[15px] rounded-[14px] font-bold text-[16px] text-white bg-[#8a1630] shadow-[0_10px_24px_-10px_rgba(138,22,48,0.75)] hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-10px_rgba(138,22,48,0.8)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
            >
              Explore the CSE reviewer
            </Link>
          </div>
        </div>

        {/* Right Column: 6-Column Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-6 auto-rows-[minmax(120px,auto)] gap-3.5">
          {/* Tile 1: Timer Tile (Span 4) */}
          <div className="sm:col-span-4 rounded-[26px] p-5 sm:p-6 bg-[#2a0a12] text-white relative overflow-hidden transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_26px_34px_-24px_rgba(60,10,25,0.6)]">
            <small className="block text-[13px] font-semibold opacity-75">
              Full mock · Professional · 170 items
            </small>
            <b className="block font-display font-extrabold text-[clamp(46px,5.4vw,74px)] leading-none tabular-nums tracking-[-0.04em] my-2 sm:my-3 text-white">
              {formatClock(timerSeconds)}
            </b>
            <div className="h-[6px] rounded-[9px] bg-white/15 overflow-hidden">
              <i className="block w-[34%] h-full bg-[#f6b93b] rounded-[9px] not-italic" />
            </div>
          </div>

          {/* Tile 2: Practice Length Selector (Span 2, Row Span 2) */}
          <div className="sm:col-span-2 sm:row-span-2 rounded-[26px] p-5 sm:p-6 bg-[#8a1630] text-white flex flex-col justify-between transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_26px_34px_-24px_rgba(60,10,25,0.6)]">
            <div>
              <small className="block text-[13px] font-semibold opacity-75">Practice length</small>
              <h4 className="font-display font-bold text-[24px] sm:text-[26px] leading-tight mt-1 mb-3.5 text-white">
                Pick your length
              </h4>

              <div className="grid gap-2.5" role="radiogroup" aria-label="Practice length">
                {/* 10 Items */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedLength === 10}
                  onClick={() => setSelectedLength(10)}
                  className={`flex items-baseline gap-2.5 w-full p-3 rounded-[16px] text-left cursor-pointer transition-all ${
                    selectedLength === 10
                      ? "bg-white text-[#8a1630] shadow-none"
                      : "bg-white/12 text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.3)] hover:bg-white/20 hover:translate-x-1"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]`}
                >
                  <b className="font-display font-extrabold text-[32px] leading-none tracking-[-0.04em] min-w-[50px]">
                    10
                  </b>
                  <span className="text-[13px] font-semibold leading-tight">
                    items
                    <br />
                    Quick drill
                  </span>
                </button>

                {/* 30 Items */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedLength === 30}
                  onClick={() => setSelectedLength(30)}
                  className={`flex items-baseline gap-2.5 w-full p-3 rounded-[16px] text-left cursor-pointer transition-all ${
                    selectedLength === 30
                      ? "bg-white text-[#8a1630] shadow-none"
                      : "bg-white/12 text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.3)] hover:bg-white/20 hover:translate-x-1"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]`}
                >
                  <b className="font-display font-extrabold text-[32px] leading-none tracking-[-0.04em] min-w-[50px]">
                    30
                  </b>
                  <span className="text-[13px] font-semibold leading-tight">
                    items
                    <br />
                    Medium assessment
                  </span>
                </button>

                {/* 170 Items */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedLength === 170}
                  onClick={() => setSelectedLength(170)}
                  className={`flex items-baseline gap-2.5 w-full p-3 rounded-[16px] text-left cursor-pointer transition-all ${
                    selectedLength === 170
                      ? "bg-white text-[#8a1630] shadow-none"
                      : "bg-white/12 text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.3)] hover:bg-white/20 hover:translate-x-1"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]`}
                >
                  <b className="font-display font-extrabold text-[32px] leading-none tracking-[-0.04em] min-w-[50px]">
                    170
                  </b>
                  <span className="text-[13px] font-semibold leading-tight">
                    items
                    <br />
                    Full mock
                  </span>
                </button>
              </div>
            </div>

            <p className="mt-4 pt-3.5 border-t border-white/15 text-[13px] font-semibold text-[#f3cbd3] min-h-[50px]" aria-live="polite">
              {lengthCaptions[selectedLength]}
            </p>
          </div>

          {/* Tile 3: Subject Breakdown Animated Bars (Span 4) */}
          <div
            ref={barsRef}
            className="sm:col-span-4 rounded-[26px] p-5 sm:p-6 bg-white shadow-[0_0_0_1px_rgba(138,22,48,0.1)] transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_26px_34px_-24px_rgba(60,10,25,0.6)]"
          >
            <header className="flex justify-between items-center mb-3">
              <h4 className="font-display font-bold text-[20px] sm:text-[22px] text-[#1b1216] m-0">
                Subject breakdown
              </h4>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#fbeff0] text-[#8a1630] text-[12px] font-bold">
                sample
              </span>
            </header>

            <div className="space-y-2.5 text-[14px] font-semibold text-[#1b1216]">
              {/* Verbal */}
              <div className="grid grid-cols-[100px_1fr_40px] sm:grid-cols-[118px_1fr_40px] gap-3 items-center">
                <span>Verbal</span>
                <div className="h-3 rounded-[9px] bg-[#f4e7e9] overflow-hidden">
                  <i
                    className="block h-full rounded-[9px] bg-[#8a1630] transition-[width] duration-900 ease-[cubic-bezier(0.2,0.8,0.2,1)] not-italic"
                    style={{ width: barsAnimated ? "78%" : "0%" }}
                  />
                </div>
                <span className="text-right tabular-nums">78%</span>
              </div>

              {/* Numerical */}
              <div className="grid grid-cols-[100px_1fr_40px] sm:grid-cols-[118px_1fr_40px] gap-3 items-center">
                <span>Numerical</span>
                <div className="h-3 rounded-[9px] bg-[#f4e7e9] overflow-hidden">
                  <i
                    className="block h-full rounded-[9px] bg-[#a81b3b] transition-[width] duration-900 ease-[cubic-bezier(0.2,0.8,0.2,1)] not-italic"
                    style={{ width: barsAnimated ? "64%" : "0%" }}
                  />
                </div>
                <span className="text-right tabular-nums">64%</span>
              </div>

              {/* Analytical */}
              <div className="grid grid-cols-[100px_1fr_40px] sm:grid-cols-[118px_1fr_40px] gap-3 items-center">
                <span>Analytical</span>
                <div className="h-3 rounded-[9px] bg-[#f4e7e9] overflow-hidden">
                  <i
                    className="block h-full rounded-[9px] bg-[#f6b93b] transition-[width] duration-900 ease-[cubic-bezier(0.2,0.8,0.2,1)] not-italic"
                    style={{ width: barsAnimated ? "71%" : "0%" }}
                  />
                </div>
                <span className="text-right tabular-nums">71%</span>
              </div>

              {/* General Info */}
              <div className="grid grid-cols-[100px_1fr_40px] sm:grid-cols-[118px_1fr_40px] gap-3 items-center">
                <span>General info</span>
                <div className="h-3 rounded-[9px] bg-[#f4e7e9] overflow-hidden">
                  <i
                    className="block h-full rounded-[9px] bg-[#8a1630] transition-[width] duration-900 ease-[cubic-bezier(0.2,0.8,0.2,1)] not-italic"
                    style={{ width: barsAnimated ? "55%" : "0%" }}
                  />
                </div>
                <span className="text-right tabular-nums">55%</span>
              </div>
            </div>
          </div>

          {/* Tile 4: Sequence / Why 162? Tile (Span 3) */}
          <div className="t-why sm:col-span-3 rounded-[26px] p-5 sm:p-6 bg-[#fbeff0] flex gap-3.5 items-start transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_26px_34px_-24px_rgba(60,10,25,0.6)] group">
            <div className="t-why-owl w-16 shrink-0">
              <ReviewTayoOwl size={64} withCap alt="Rationale owl mascot" />
            </div>
            <div>
              <h4 className="font-display font-bold text-[24px] sm:text-[26px] text-[#1b1216] mb-2 m-0">
                Why 162?
              </h4>
              <div className="flex gap-1.5 flex-wrap mb-2">
                <i className="not-italic font-extrabold text-[14px] px-2.5 py-1 rounded-[9px] bg-white shadow-[inset_0_0_0_1.5px_#efd5db] text-[#1b1216]">
                  2
                </i>
                <i className="not-italic font-extrabold text-[14px] px-2.5 py-1 rounded-[9px] bg-white shadow-[inset_0_0_0_1.5px_#efd5db] text-[#1b1216]">
                  6
                </i>
                <i className="not-italic font-extrabold text-[14px] px-2.5 py-1 rounded-[9px] bg-white shadow-[inset_0_0_0_1.5px_#efd5db] text-[#1b1216]">
                  18
                </i>
                <i className="not-italic font-extrabold text-[14px] px-2.5 py-1 rounded-[9px] bg-white shadow-[inset_0_0_0_1.5px_#efd5db] text-[#1b1216]">
                  54
                </i>
                <i className="not-italic font-extrabold text-[14px] px-2.5 py-1 rounded-[9px] bg-[#8a1630] text-white shadow-none">
                  ?
                </i>
              </div>
              <p className="text-[15px] text-[#5a4a50] m-0">Each number is multiplied by 3.</p>
            </div>
          </div>

          {/* Tile 5: Recommended Next Plan Tile (Span 3) */}
          <Link
            href="/practice"
            className="sm:col-span-3 rounded-[26px] p-5 sm:p-6 bg-[#f6b93b] text-[#2a0a12] flex flex-col justify-between transition-all duration-250 hover:-translate-y-1.5 hover:shadow-[0_26px_34px_-24px_rgba(60,10,25,0.6)] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a1630]"
          >
            <div>
              <small className="block text-[13px] font-semibold text-[#451a03]/80">
                Recommended next
              </small>
              <h4 className="font-display font-extrabold text-[28px] sm:text-[30px] my-1 text-[#2a0a12]">
                Numerical ability
              </h4>
              <p className="text-[15px] font-medium max-w-[24ch] m-0 text-[#2a0a12]/90">
                12 practice items from your weakest subject.
              </p>
            </div>
            <span className="self-end w-11 h-11 rounded-full bg-[#2a0a12] grid place-items-center transition-transform duration-250 group-hover:translate-x-1.5">
              <svg
                className="w-5 h-5 stroke-white fill-none stroke-[2.6] stroke-linecap-round stroke-linejoin-round"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
