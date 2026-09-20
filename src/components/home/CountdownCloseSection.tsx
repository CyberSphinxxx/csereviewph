"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

export function CountdownCloseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  // Target exam date: March 14, 2027 CSE-PPT
  const calculateDaysLeft = () => {
    const targetDate = new Date("2027-03-14T00:00:00+08:00").getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((targetDate - now) / 864e5));
  };

  const finalDays = calculateDaysLeft();
  const [displayDays, setDisplayDays] = useState(finalDays);

  // Count-up animation on scroll into view
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    let reducedMotion = false;
    if (typeof window !== "undefined") {
      reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    }
    if (reducedMotion || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const t0 = performance.now();
        const duration = 1500;

        const step = (t: number) => {
          const progress = Math.min(1, (t - t0) / duration);
          const ease = 1 - Math.pow(1 - progress, 3);
          setDisplayDays(Math.round(finalDays * ease));

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [finalDays]);

  // Pointer spotlight effect
  useEffect(() => {
    const section = sectionRef.current;
    const spot = spotRef.current;
    if (!section || !spot) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      spot.style.setProperty("--mx", `${mx}px`);
      spot.style.setProperty("--my", `${my}px`);
    };

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => section.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sec-e"
      className="relative text-white overflow-hidden pt-48 sm:pt-60 pb-0"
    >
      {/* Interactive Radial Spotlight */}
      <div
        ref={spotRef}
        className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(180deg,transparent_0,#000_320px)]"
        style={{
          background:
            "radial-gradient(640px circle at var(--mx,72%) var(--my,58%), rgba(150,26,58,0.7) 0, transparent 62%)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-11 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] items-center min-h-[540px]">
          {/* Left Column: Number & CTAs */}
          <div className="text-left">
            {/* Giant Outlined Countdown Number */}
            <div
              className="font-display font-extrabold text-[clamp(150px,24vw,330px)] leading-[0.85] tracking-[-0.065em] text-transparent bg-[linear-gradient(180deg,rgba(251,239,240,0.2),rgba(251,239,240,0.02))] [-webkit-background-clip:text] bg-clip-text [-webkit-text-stroke:2px_#fbeff0] transition-colors duration-500 hover:text-[#fbeff0] pt-2.5 cursor-default select-none"
            >
              <span ref={numRef}>{displayDays}</span>
            </div>

            {/* Supporting Copy & CTAs */}
            <div className="mt-2 sm:mt-4">
              <h2 className="font-display font-extrabold text-[clamp(26px,3.4vw,44px)] leading-none text-white mb-3.5 max-w-[16ch]">
                days until the Civil Service Exam.
              </h2>
              <p className="text-[19px] text-[#ecc9d0] mb-6 max-w-[30ch] leading-relaxed font-normal">
                Where would you score today? Find out in 10 minutes.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/exams/professional/quick"
                  className="inline-flex items-center justify-center gap-2 px-6 py-[15px] rounded-[14px] font-bold text-[16px] text-[#2a0a12] bg-[#f6b93b] shadow-[0_10px_26px_-10px_rgba(246,185,59,0.7)] hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Start free diagnostic
                </Link>
                <Link
                  href="/reviewers"
                  className="inline-flex items-center justify-center gap-2 px-6 py-[15px] rounded-[14px] font-bold text-[16px] text-white bg-transparent shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.4)] hover:bg-white/10 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
                >
                  Browse exams
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Glowing Golden Moon with Owl */}
          <div className="mt-9 lg:mt-0 flex justify-center">
            <div className="w-[min(330px,88%)] aspect-square rounded-full flex flex-col items-center justify-end bg-[radial-gradient(circle_at_34%_28%,#ffe28f,#f6b93b_58%,#d78d14)] shadow-[0_0_120px_24px_rgba(246,185,59,0.32)] pb-[7%] animate-owl-bob mx-auto">
              <div className="w-[62%] flex justify-center">
                <ReviewTayoOwl size="100%" withCap alt="ReviewTayo mascot in the moon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Marquee Ticker */}
      <div className="border-t border-white/15 overflow-hidden whitespace-nowrap py-4 mt-10" aria-hidden="true">
        <div className="inline-flex items-center animate-[marq_40s_linear_infinite] hover:[animation-play-state:paused] font-display font-extrabold text-[24px] text-[#f6b93b]">
          <span className="inline-flex items-center gap-[30px] pr-[30px]">
            Civil Service<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            Licensure<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            Public Safety<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            CSE<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            LET<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            CLE<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            NLE<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            NAPOLCOM<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            BFP<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
          </span>
          <span className="inline-flex items-center gap-[30px] pr-[30px]">
            Civil Service<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            Licensure<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            Public Safety<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            CSE<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            LET<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            CLE<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            NLE<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            NAPOLCOM<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
            BFP<i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
          </span>
        </div>
      </div>
    </section>
  );
}
