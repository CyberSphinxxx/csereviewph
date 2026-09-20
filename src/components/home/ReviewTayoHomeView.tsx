"use client";

import React, { useState, useEffect, useRef } from "react";
import { LandingHeader } from "@/components/home/LandingHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { TryQuestionSection } from "@/components/home/TryQuestionSection";
import { ExamChooserRail } from "@/components/home/ExamChooserRail";
import { BentoInsideSection } from "@/components/home/BentoInsideSection";
import { CountdownCloseSection } from "@/components/home/CountdownCloseSection";
import { LandingFooter } from "@/components/home/LandingFooter";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";

export function ReviewTayoHomeView() {
  const [isDarkHeader, setIsDarkHeader] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Measure section positions to configure seamless gradient stops (--s1, --s2, --s3, --s4)
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const setStops = () => {
      const pageRect = page.getBoundingClientRect();
      const base = pageRect.top + window.scrollY;

      const secKeys = ["b", "c", "d", "e"];
      secKeys.forEach((k, i) => {
        const sec = document.getElementById(`sec-${k}`);
        if (sec) {
          const top = Math.round(sec.getBoundingClientRect().top + window.scrollY - base);
          page.style.setProperty(`--s${i + 1}`, `${top}px`);
        }
      });
    };

    setStops();
    window.addEventListener("resize", setStops);
    window.addEventListener("load", setStops);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setStops);
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(setStops);
      resizeObserver.observe(page);
    }

    return () => {
      window.removeEventListener("resize", setStops);
      window.removeEventListener("load", setStops);
      resizeObserver?.disconnect();
    };
  }, []);

  // Universal Pupil Tracking: all owls on page look at cursor
  useEffect(() => {
    let pq = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (pq) return;
      pq = true;
      requestAnimationFrame(() => {
        pq = false;
        const pupils = document.querySelectorAll<SVGGElement>(".pupil");
        pupils.forEach((p) => {
          const owner = p.ownerSVGElement;
          if (!owner) return;
          const r = owner.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height * 0.4);
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, d / 280) * 6;
          p.style.transform = `translate(${((dx / d) * k).toFixed(1)}px, ${((dy / d) * k).toFixed(1)}px)`;
        });
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Monitor scroll position for dynamic sticky header color transition
  useEffect(() => {
    let ticking = false;

    const checkHeaderTheme = () => {
      ticking = false;
      const secE = document.getElementById("sec-e");
      if (secE) {
        const rect = secE.getBoundingClientRect();
        setIsDarkHeader(rect.top < -150);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkHeaderTheme);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    checkHeaderTheme();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={pageRef}
      id="page"
      className="landing-page-gradient min-h-screen flex flex-col font-body text-[#1b1216] selection:bg-[#fbeff0] selection:text-[#8a1630] relative"
    >
      {/* Sticky Adaptable Header */}
      <LandingHeader isDark={isDarkHeader} />

      {/* Main Content Sections */}
      <main id="top" className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Try a Question */}
        <TryQuestionSection />

        {/* Section 3: Exam Chooser Carousel */}
        <ExamChooserRail />

        {/* Section 4: What's Inside Bento */}
        <BentoInsideSection />

        {/* Section 5: Countdown Close */}
        <CountdownCloseSection />
      </main>

      {/* Monetization / Ad Slot (Kept non-disruptive at bottom) */}
      <div className="bg-[#210610] px-4 py-2">
        <AdSenseBanner slotId="homepage-bottom" />
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
