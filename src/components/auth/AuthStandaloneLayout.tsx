"use client";

import React from "react";
import Link from "next/link";
import { AuthStandaloneForm } from "./AuthStandaloneForm";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";
import { Logo } from "@/components/ui/Logo";
import { ArrowLeft } from "lucide-react";
import { BENEFITS } from "./auth-fields";
import type { AuthStandaloneState } from "./AuthStandaloneForm";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86152d] dark:focus-visible:outline-[#ffd27a]";

/**
 * Concept C from the auth redesign: a standalone split page.
 *
 * Left: fixed-maroon brand panel (a shell choice, intentionally identical in
 * light and dark themes) carrying the owl, the hero line and account benefits.
 * Right: theme-aware form card that follows the site's light/dark tokens.
 */
export function AuthStandaloneLayout({ initialState }: { initialState?: AuthStandaloneState }) {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--background)] transition-colors">
      {/* Slim top bar */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--brand-border)] bg-[color:var(--card)] px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-[1080px] items-center gap-3.5">
          <Link
            href="/"
            aria-label="ReviewTayo home"
            className={`group inline-flex items-center rounded-lg ${FOCUS}`}
          >
            {/* Maroon wordmark on light, white on dark */}
            <Logo
              format="horizontal"
              variant="maroon"
              className="h-8 w-auto text-brand-700 transition-opacity group-hover:opacity-90 dark:hidden"
            />
            <Logo
              format="horizontal"
              variant="white"
              className="hidden h-8 w-auto text-white transition-opacity group-hover:opacity-90 dark:block"
            />
          </Link>
          <Link
            href="/practice"
            className={`ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--brand-muted)] transition hover:text-[color:var(--brand-text)] sm:text-sm ${FOCUS}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to practice</span>
          </Link>
        </div>
      </header>

      {/* Split page */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="grid w-full max-w-[980px] grid-cols-1 overflow-hidden rounded-[26px] bg-[color:var(--card)] shadow-[0_0_0_1.5px_rgba(138,22,48,0.12),0_30px_80px_rgba(138,22,48,0.12)] dark:bg-[color:var(--card)] dark:shadow-[0_0_0_1.5px_rgba(255,255,255,0.14),0_30px_80px_rgba(0,0,0,0.45)] lg:grid-cols-2">
          {/* Brand panel — fixed maroon in both themes (shell choice, not theme) */}
          <div
            className="relative flex flex-col overflow-hidden p-7 text-white sm:p-9 lg:p-11"
            style={{ background: "linear-gradient(165deg, #8a1630 0%, #a81b3b 62%, #c4213f 100%)" }}
          >
            {/* Decorative circles */}
            <div aria-hidden="true" className="pointer-events-none absolute -right-[100px] -top-[100px] h-[280px] w-[280px] rounded-full bg-white/[0.06]" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-[60px] -left-[60px] h-[160px] w-[160px] rounded-full bg-black/[0.08]" />

            <div className="relative z-[1] flex h-full flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e5f6ec] px-3 py-1.5 text-[12.5px] font-bold text-[#0b7a3b]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#12a150]" aria-hidden="true" />
                Live · Civil Service Exam
              </span>

              <div className="mt-4 w-[120px] shrink-0 animate-owl-bob">
                <ReviewTayoOwl withCap tracked bob alt="ReviewTayo owl coach" />
              </div>

              <h1 className="mt-4 font-display text-[clamp(24px,2.6vw,30px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
                Review smarter.
                <br />
                Pass sooner.
              </h1>
              <p className="mt-2 max-w-[36ch] text-[14.5px] leading-relaxed text-white/80">
                Save your progress and continue reviewing on any device.
              </p>

              <ul className="mt-auto flex flex-col gap-3 pt-7">
                {BENEFITS.map((b) => (
                  <li key={b.t} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#f6b93b]/20 text-[#f6b93b]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m5 13 4 4 10-10" />
                      </svg>
                    </span>
                    <div>
                      <b className="block text-[13.5px] text-white">{b.t}</b>
                      <span className="text-[12.5px] text-white/75">{b.d}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[11.5px] text-white/60">ReviewTayo · reviewtayo.online</p>
            </div>
          </div>

          {/* Form side — theme-aware */}
          <div className="flex items-center justify-center p-7 sm:p-9 lg:p-10">
            <AuthStandaloneForm initialState={initialState} />
          </div>
        </div>
      </main>
    </div>
  );
}
