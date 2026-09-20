"use client";

import React from "react";
import Link from "next/link";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

export function LandingFooter() {
  return (
    <footer className="bg-[#210610] text-[#e6c3cb] py-10 pb-9 text-[15px] text-left">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-11">
        {/* Main Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-9 pt-10 border-t border-white/10">
          {/* Brand & Mission */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-3.5">
            <Link
              href="#top"
              className="inline-flex items-center gap-2 font-logo text-[23px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] rounded"
              aria-label="ReviewTayo home"
            >
              <span className="w-[27px] h-[27px] rounded-[9px] bg-white p-0.5 inline-flex items-center justify-center">
                <ReviewTayoOwl size={27} withCap aria-hidden="true" />
              </span>
              <span>reviewtayo</span>
            </Link>
            <p className="text-[14px] text-[#e6c3cb] leading-relaxed max-w-[30ch] m-0">
              Free practice exams for Philippine government and licensure tests.
            </p>
            <div>
              <span className="inline-flex items-center py-1.5 px-3 rounded-[12px] bg-[#4be08c]/15 text-[#8ff0b8] font-bold text-[13px] shadow-[inset_0_0_0_1.5px_rgba(75,224,140,0.3)]">
                Privacy-first · RA 10173
              </span>
            </div>
          </div>

          {/* Exams Column */}
          <div>
            <h5 className="font-bold text-[15px] text-white m-0 mb-3">Exams</h5>
            <ul className="list-none m-0 p-0 grid gap-2.5 text-[14px]">
              <li>
                <Link href="/cse" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Civil Service Exam (Live)
                </Link>
              </li>
              <li>
                <Link href="/reviewers" className="text-[#e6c3cb] opacity-60 hover:opacity-100 hover:text-white transition">
                  LET Reviewer (Coming soon)
                </Link>
              </li>
              <li>
                <Link href="/reviewers" className="text-[#e6c3cb] opacity-60 hover:opacity-100 hover:text-white transition">
                  Nursing Licensure (Coming soon)
                </Link>
              </li>
              <li>
                <Link href="/reviewers" className="text-[#e6c3cb] opacity-60 hover:opacity-100 hover:text-white transition">
                  BFP Qualifying (Coming soon)
                </Link>
              </li>
              <li>
                <Link href="/reviewers" className="text-[#e6c3cb] opacity-60 hover:opacity-100 hover:text-white transition">
                  NAPOLCOM Reviewer (Coming soon)
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/reviewers" className="text-[#f6b93b] font-semibold hover:underline">
                  Browse all Philippine exams &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Practice Tools */}
          <div>
            <h5 className="font-bold text-[15px] text-white m-0 mb-3">CSE practice tools</h5>
            <ul className="list-none m-0 p-0 grid gap-2.5 text-[14px]">
              <li>
                <Link href="/exams/professional/full" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Full Pro Mock (170 items)
                </Link>
              </li>
              <li>
                <Link href="/exams/subprofessional/full" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Full Subpro Mock (165 items)
                </Link>
              </li>
              <li>
                <Link href="/exams/professional/medium" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Medium Assessment (30 items)
                </Link>
              </li>
              <li>
                <Link href="/exams/professional/quick" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Quick 10-item Drill
                </Link>
              </li>
              <li>
                <Link href="/practice" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Topic Practice Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides & Trust */}
          <div>
            <h5 className="font-bold text-[15px] text-white m-0 mb-3">Guides and trust</h5>
            <ul className="list-none m-0 p-0 grid gap-2.5 text-[14px]">
              <li>
                <Link href="/guides" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Subtest Study Guides
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Strategy and Prep Articles
                </Link>
              </li>
              <li>
                <Link href="/cse/exam-guide" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  CSE Exam Guide and Venues
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  FAQ and Support
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  About ReviewTayo
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Privacy Policy (RA 10173)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Non-Affiliation Notice
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#e6c3cb] hover:text-white hover:underline transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("open-cookie-settings"));
                    }
                  }}
                  className="text-[#e6c3cb] hover:text-white hover:underline transition text-left cursor-pointer"
                >
                  Cookie &amp; Ad Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Non-Affiliation Legal Notice */}
        <div className="mt-10 pt-5 border-t border-white/10 text-[13px] leading-relaxed text-[#c79aa5]">
          <p className="m-0">
            <strong className="text-white">Non-affiliation notice.</strong> ReviewTayo is an independent educational platform. It is not affiliated with, endorsed by, or connected to the Civil Service Commission, the Professional Regulation Commission, the Bureau of Fire Protection, the National Police Commission, or any Philippine government agency.
          </p>
          <p className="mt-3 text-[#a97a86] text-[13px] m-0">
            &copy; {new Date().getFullYear()} ReviewTayo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
