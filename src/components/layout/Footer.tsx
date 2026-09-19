"use client";

import Link from "next/link";
import { Award, ShieldCheck, Mail, FileText, BookOpen, HelpCircle, Layers } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white dark:bg-[#1E191C] text-muted-foreground text-sm print:hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand & Mission Column (lg:col-span-2) */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              prefetch={true}
              className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-lg"
              aria-label="ReviewTayo home"
            >
              <Logo
                format="horizontal"
                className="h-8 w-auto text-brand-700 dark:text-white transition-opacity group-hover:opacity-90"
              />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              The Philippine examination preparation platform. Empowering Filipino examinees with 100% original syllabus questions, continuous real-time countdown timers, and diagnostic performance analytics.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacy-First &bull; RA 10173 Principles</span>
            </div>
          </div>

          {/* Exams Directory Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Exams
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cse" prefetch={true} className="text-brand-700 dark:text-brand-400 font-bold hover:underline flex items-center gap-1">
                  <span>Civil Service Exam (Live)</span>
                </Link>
              </li>
              <li>
                <Link href="/reviewers" prefetch={true} className="text-slate-500 hover:text-brand-700 transition">
                  LET Reviewer (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/reviewers" prefetch={true} className="text-slate-500 hover:text-brand-700 transition">
                  Nursing Licensure (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/reviewers" prefetch={true} className="text-slate-500 hover:text-brand-700 transition">
                  BFP Qualifying (Coming Soon)
                </Link>
              </li>
              <li>
                <Link href="/reviewers" prefetch={true} className="text-slate-500 hover:text-brand-700 transition">
                  NAPOLCOM Reviewer (Coming Soon)
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/reviewers" prefetch={true} className="font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-700 transition flex items-center gap-1">
                  <Layers className="w-3 h-3 text-brand-600" />
                  <span>Browse all Philippine exams &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* CSE Practice & Simulations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              CSE Practice Tools
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/exams/professional/full" prefetch={true} className="hover:text-brand-700 transition">
                  Full Pro Mock (170 Items)
                </Link>
              </li>
              <li>
                <Link href="/exams/subprofessional/full" prefetch={true} className="hover:text-brand-700 transition">
                  Full Subpro Mock (165 Items)
                </Link>
              </li>
              <li>
                <Link href="/exams/professional/medium" prefetch={true} className="hover:text-brand-700 transition">
                  Medium Assessment (30 Items)
                </Link>
              </li>
              <li>
                <Link href="/exams/professional/quick" prefetch={true} className="hover:text-brand-700 transition">
                  Quick 10-Item Drill
                </Link>
              </li>
              <li>
                <Link href="/practice" prefetch={true} className="hover:text-brand-700 transition">
                  Topic Practice Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Guides & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Guides &amp; Trust
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/guides" className="hover:text-brand-700 transition flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Subtest Study Guides
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-brand-700 transition flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Strategy &amp; Prep Articles
                </Link>
              </li>
              <li>
                <Link href="/cse/exam-guide" className="hover:text-brand-700 transition flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-600" />
                  CSE Exam Guide &amp; Venues
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-700 transition flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  FAQ &amp; Support
                </Link>
              </li>
              <li>
                <Link href="/about" prefetch={true} className="hover:text-brand-700 transition">
                  About ReviewTayo
                </Link>
              </li>
              <li>
                <Link href="/privacy" prefetch={true} className="hover:text-brand-700 transition">
                  Privacy Policy (RA 10173)
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={true} className="hover:text-brand-700 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" prefetch={true} className="hover:text-brand-700 transition">
                  Non-Affiliation Notice
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-brand-700 transition flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
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
                  className="hover:text-brand-700 transition text-slate-500 underline text-left"
                >
                  Cookie &amp; Ad Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright Bottom Bar */}
        <div className="pt-6 border-t border-border text-xs text-muted-foreground space-y-2">
          <p className="leading-relaxed">
            <strong className="text-foreground">Official Non-Affiliation Disclaimer:</strong> ReviewTayo is an independent educational platform and is not affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with the Philippine Civil Service Commission (CSC), the Professional Regulation Commission (PRC), the Bureau of Fire Protection (BFP), the National Police Commission (NAPOLCOM), the Civil Service Institute (CSI), or any Philippine government department or agency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-slate-400">
            <p>&copy; {new Date().getFullYear()} ReviewTayo. All rights reserved.</p>
            <p>Independent Philippine Exam Preparation Platform</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
