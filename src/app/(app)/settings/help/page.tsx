"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  Flag,
  Accessibility,
  Info,
  ExternalLink,
  Copy,
  Check,
  Laptop,
} from "lucide-react";

export default function HelpAboutSettingsPage() {
  const [copied, setCopied] = useState(false);
  const [diagnostics, setDiagnostics] = useState({
    appVersion: "1.2.0-cse",
    framework: "Next.js 15 (App Router)",
    userAgent: "Loading...",
    viewport: "Loading...",
    timeZone: "Asia/Manila",
    storageAvailable: true,
    onlineStatus: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let storageOk = false;
    try {
      window.localStorage.setItem("__test_diag", "1");
      window.localStorage.removeItem("__test_diag");
      storageOk = true;
    } catch {
      storageOk = false;
    }

    setDiagnostics({
      appVersion: "1.2.0-cse",
      framework: "Next.js 15 (App Router)",
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth} x ${window.innerHeight} px`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Manila",
      storageAvailable: storageOk,
      onlineStatus: navigator.onLine,
    });
  }, []);

  const handleCopyDiagnostics = () => {
    const text = [
      `Application Version: ${diagnostics.appVersion}`,
      `Framework: ${diagnostics.framework}`,
      `Browser: ${diagnostics.userAgent}`,
      `Viewport: ${diagnostics.viewport}`,
      `Timezone: ${diagnostics.timeZone}`,
      `Storage Available: ${diagnostics.storageAvailable ? "Yes" : "No"}`,
      `Network: ${diagnostics.onlineStatus ? "Online" : "Offline"}`,
    ].join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* 1. Help & Support Directory */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span>Help &amp; Support Resources</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Find answers to common exam questions or contact our editorial and technical team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link
            href="/faq"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Frequently Asked Questions
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  CSE schedule, timer rules, passing scores
                </span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </Link>

          <Link
            href="/contact"
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Contact Support
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Report technical issues or feedback
                </span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </Link>
        </div>

        {/* Question Problem Reporting Note (per §12) */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Flag className="w-4 h-4 text-amber-500" />
            <span>Reporting a Problem with an Exam Question</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            To report a question typo, ambiguous choices, or factual error, use the <strong>Flag / Report</strong> button directly inside that question or during test results review. This automatically captures the Question ID and specific choices for our editorial review.
          </p>
        </div>
      </section>

      {/* 2. Accessibility Statement & Accommodations */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-3 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Accessibility className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span>Accessibility &amp; Accommodations</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            ReviewTayo is engineered to conform to WCAG 2.2 AA accessibility guidelines, including 44px touch targets, scalable typography, full keyboard navigation, screen-reader status live regions, and reduced-motion preferences.
          </p>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          If you encounter any accessibility barrier or need special exam accommodations, please reach out through our{" "}
          <Link href="/contact" className="text-brand-700 dark:text-brand-400 underline font-semibold">
            Contact Support form
          </Link>
          .
        </p>
      </section>

      {/* 3. About & Official Non-Affiliation Disclosure */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-3 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" />
            <span>About ReviewTayo</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Independent educational preparation platform for Filipino civil service examinees.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
          <p className="font-bold">Official Non-Affiliation Disclaimer:</p>
          <p className="text-[11px]">
            ReviewTayo is an independent educational reviewer and is not affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with the Philippine Civil Service Commission (CSC), the Civil Service Institute (CSI), or any Philippine government department or agency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <Link href="/about" className="text-brand-700 dark:text-brand-400 hover:underline font-semibold">
            About Our Mission &rarr;
          </Link>
          <Link href="/disclaimer" className="text-slate-500 dark:text-slate-400 hover:underline">
            Legal Disclaimer &rarr;
          </Link>
          <Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:underline">
            Privacy Policy &rarr;
          </Link>
          <Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:underline">
            Terms of Service &rarr;
          </Link>
        </div>
      </section>

      {/* 4. Safe System Diagnostics Preview (per §12) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>System Diagnostics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Useful when contacting technical support. Safe preview without tokens or private history.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyDiagnostics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Diagnostics"}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1 overflow-x-auto">
          <div>Application: ReviewTayo {diagnostics.appVersion}</div>
          <div>Architecture: {diagnostics.framework}</div>
          <div>Browser: {diagnostics.userAgent}</div>
          <div>Viewport: {diagnostics.viewport}</div>
          <div>Timezone: {diagnostics.timeZone}</div>
          <div>
            Storage: {diagnostics.storageAvailable ? "Available" : "Disabled/Quota Exceeded"} &bull;{" "}
            Network: {diagnostics.onlineStatus ? "Online" : "Offline"}
          </div>
        </div>
      </section>
    </div>
  );
}
