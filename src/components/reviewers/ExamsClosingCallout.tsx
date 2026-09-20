"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

export function ExamsClosingCallout() {
  return (
    <section className="exams-closing-gradient text-white pt-24 sm:pt-32 pb-16 sm:pb-24 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-11 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-10 items-center">
          {/* Left: Call to Action */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-[#ffe28f] border border-white/20 mb-4 select-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civil Service Exam Ready Today</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight mb-4">
              Ready to test your readiness today?
            </h2>

            <p className="text-base sm:text-lg text-[#ecc9d0] max-w-[34ch] leading-relaxed mb-8">
              Start with the 10-minute diagnostic drill or dive straight into full-length 170-item mock simulations with continuous timers.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/exams/professional/quick"
                prefetch={true}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-[#2a0a12] bg-[#f6b93b] shadow-[0_10px_26px_-10px_rgba(246,185,59,0.7)] hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Start free diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/cse"
                prefetch={true}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-white bg-transparent border border-white/40 hover:bg-white/10 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
              >
                Explore CSE reviewer
              </Link>
            </div>
          </div>

          {/* Right: Golden Moon Owl Mascot */}
          <div className="flex justify-center">
            <div className="w-[min(260px,80%)] aspect-square rounded-full flex flex-col items-center justify-end bg-[radial-gradient(circle_at_34%_28%,#ffe28f,#f6b93b_58%,#d78d14)] shadow-[0_0_100px_20px_rgba(246,185,59,0.28)] pb-[7%] animate-owl-bob mx-auto">
              <div className="w-[62%] flex justify-center">
                <ReviewTayoOwl size="100%" withCap alt="ReviewTayo Mascot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
