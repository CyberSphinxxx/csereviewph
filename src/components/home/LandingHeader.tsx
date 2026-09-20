"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";
import { useSession } from "@/lib/auth/auth-client";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserNav } from "@/components/auth/UserNav";

export interface LandingHeaderProps {
  isDark?: boolean;
}

export function LandingHeader({ isDark = false }: LandingHeaderProps) {
  const { data: session, refetch } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
          isDark
            ? "bg-[#2a0a12]/75 border-b border-white/10 text-white"
            : "bg-[#fdf8f6]/80 border-b border-[#8a1630]/10 text-[#1b1216]"
        } backdrop-blur-md`}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-11 flex items-center justify-between h-[66px]">
          {/* Logo */}
          <Link
            href="#top"
            className={`flex items-center gap-2 font-logo text-[23px] font-normal transition-colors ${
              isDark ? "text-white" : "text-[#8a1630]"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] rounded-lg`}
            aria-label="ReviewTayo home"
          >
            <span
              className={`w-[27px] h-[27px] rounded-lg inline-flex items-center justify-center transition-colors ${
                isDark ? "bg-white p-0.5" : "bg-transparent"
              }`}
            >
              <ReviewTayoOwl size={27} withCap aria-hidden="true" />
            </span>
            <span>reviewtayo</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-[26px] m-0 p-0 list-none">
            <li>
              <Link
                href="#exams"
                className={`text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] rounded ${
                  isDark ? "text-white hover:text-[#f6b93b]" : "text-[#1b1216] hover:text-[#8a1630]"
                }`}
              >
                Exams
              </Link>
            </li>
            <li>
              <Link
                href="/guides"
                className={`text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] rounded ${
                  isDark ? "text-white hover:text-[#f6b93b]" : "text-[#1b1216] hover:text-[#8a1630]"
                }`}
              >
                Study resources
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={`text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] rounded ${
                  isDark ? "text-white hover:text-[#f6b93b]" : "text-[#1b1216] hover:text-[#8a1630]"
                }`}
              >
                My dashboard
              </Link>
            </li>
          </ul>

          {/* Desktop Auth / Action */}
          <div className="hidden md:flex items-center">
            {session?.user ? (
              <UserNav />
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={`border text-[14px] font-semibold px-[14px] py-[8px] rounded-[10px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
                  isDark
                    ? "bg-white/10 text-white border-white/30 hover:bg-white/20"
                    : "bg-white text-[#1b1216] border-black/12 hover:bg-[#fbeff0]"
                }`}
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {session?.user && <UserNav />}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="landing-mobile-menu"
              className={`w-[42px] h-[42px] border rounded-[11px] grid place-items-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
                isDark
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white border-black/12 text-[#8a1630]"
              }`}
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="flex flex-col gap-[3px] items-center justify-center">
                <i className={`block w-[17px] h-[2px] rounded-[2px] transition-colors ${isDark ? "bg-white" : "bg-[#8a1630]"}`} />
                <i className={`block w-[17px] h-[2px] rounded-[2px] transition-colors ${isDark ? "bg-white" : "bg-[#8a1630]"}`} />
                <i className={`block w-[17px] h-[2px] rounded-[2px] transition-colors ${isDark ? "bg-white" : "bg-[#8a1630]"}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="landing-mobile-menu"
            aria-label="Mobile navigation"
            className="md:hidden border-t border-[#8a1630]/15 bg-[#fdf8f6] dark:bg-[#2a0a12] px-6 py-4 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 text-left"
          >
            <div className="flex flex-col gap-2">
              <Link
                href="#exams"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-[#1b1216] dark:text-white rounded-lg hover:bg-[#fbeff0] dark:hover:bg-white/10 transition"
              >
                Exams
              </Link>
              <Link
                href="/guides"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-[#1b1216] dark:text-white rounded-lg hover:bg-[#fbeff0] dark:hover:bg-white/10 transition"
              >
                Study resources
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-[#1b1216] dark:text-white rounded-lg hover:bg-[#fbeff0] dark:hover:bg-white/10 transition"
              >
                My dashboard
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-[#1b1216] dark:text-white rounded-lg hover:bg-[#fbeff0] dark:hover:bg-white/10 transition"
              >
                FAQ &amp; help
              </Link>

              {!session?.user && (
                <div className="pt-2 border-t border-[#8a1630]/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setModalOpen(true);
                    }}
                    className="w-full text-center px-4 py-2.5 rounded-xl font-bold text-white bg-[#8a1630] hover:bg-[#701126] transition shadow-md"
                  >
                    Sign in to ReviewTayo
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Auth Modal for Guests */}
      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          refetch();
          setModalOpen(false);
        }}
      />
    </>
  );
}
