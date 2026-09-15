"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm, AuthMode } from "./AuthForm";
import { Logo } from "@/components/ui/Logo";
import {
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Cloud,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface AuthPageLayoutProps {
  mode: AuthMode;
}

export function AuthPageLayout({ mode }: AuthPageLayoutProps) {
  const router = useRouter();

  const handleModeChange = (newMode: AuthMode) => {
    if (newMode === "sign-in") {
      router.push("/sign-in");
    } else if (newMode === "create-account") {
      router.push("/create-account");
    } else if (newMode === "forgot-password") {
      router.push("/forgot-password");
    }
  };

  const handleSuccess = () => {
    router.push("/practice");
  };

  const handleGuestContinue = () => {
    router.push("/practice");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-lg"
          aria-label="csereviewph home"
        >
          <Logo
            format="horizontal"
            className="h-8 w-auto text-brand-700 dark:text-white transition-opacity group-hover:opacity-90"
          />
        </Link>

        <Link
          href="/practice"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to practice</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Progress & Benefit Preview (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col space-y-6 pr-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
                <Zap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Cloud Synchronization</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Keep your study progress with you.
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Save your results, track weak areas, and continue reviewing on any device.
              </p>
            </div>

            {/* Study Progress Preview Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                      Diagnostic Mock Exam
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Professional Level &bull; 170 items
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  84.5% Passed
                </span>
              </div>

              {/* Weak Areas Sample Preview */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                  <span>Target Competency</span>
                  <span>Accuracy</span>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        General Information & RA 6713
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[90%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Numerical Reasoning (Word Problems)
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">68%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[68%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Pill Row */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Cloud className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                  <span>Synced across devices</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Mistake bank saved</span>
                </div>
              </div>
            </div>

            {/* Privacy Reassurance Note */}
            <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                We respect your data. Your reviewer records belong to you and are strictly protected under
                Republic Act No. 10173. No spam, no public profiles, and zero selling of personal data.
              </p>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <AuthForm
                mode={mode}
                onModeChange={handleModeChange}
                onSuccess={handleSuccess}
                onGuestContinue={handleGuestContinue}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
