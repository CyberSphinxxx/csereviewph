"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import { LocalStorageService } from "@/lib/storage";
import { UserNav } from "@/components/auth/UserNav";
import { Logo } from "@/components/ui/Logo";
import { HeaderExamSwitcher } from "./HeaderExamSwitcher";
import { useExamWorkspace } from "@/lib/workspace/useExamWorkspace";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { currentWorkspace, currentExamConfig } = useExamWorkspace();
  const [hasProgress, setHasProgress] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const history = LocalStorageService.getAttemptHistory();
      const bookmarks = LocalStorageService.getBookmarks();
      const mistakes = LocalStorageService.getMistakeBank();
      if (history.length > 0 || bookmarks.length > 0 || mistakes.length > 0) {
        setHasProgress(true);
      }
    } catch {
      // LocalStorage unavailable in private mode or SSR
    }
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  }, [pathname]);

  // Click outside to dismiss More menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showProgress = Boolean(session?.user || hasProgress || currentWorkspace);
  const isDashboard = pathname === "/dashboard" || pathname?.startsWith("/dashboard/");
  const isCseContext =
    pathname === "/cse" ||
    pathname?.startsWith("/cse/") ||
    pathname?.startsWith("/practice") ||
    pathname?.startsWith("/exams") ||
    pathname?.startsWith("/guides") ||
    pathname?.startsWith("/articles") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/results") ||
    pathname === "/exam-info" ||
    Boolean(currentWorkspace);

  const examInfoHref =
    currentExamConfig?.routes?.infoUrl ||
    (currentWorkspace?.examId === "cse" ? "/cse/exam-guide" : "/exam-info");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 dark:bg-[#1E191C]/95 backdrop-blur-md print:hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <Link
            href="/"
            prefetch={true}
            className="flex items-center group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-lg"
            aria-label="ReviewTayo home"
          >
            <Logo
              format="horizontal"
              className="h-8 sm:h-9 w-auto text-brand-700 dark:text-white transition-opacity group-hover:opacity-90"
            />
          </Link>
          <HeaderExamSwitcher />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
          {showProgress && (
            <Link
              href="/dashboard"
              prefetch={true}
              aria-current={isDashboard ? "page" : undefined}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
                isDashboard
                  ? "bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Dashboard
            </Link>
          )}

          <Link
            href="/reviewers"
            prefetch={true}
            className={`px-2.5 py-1.5 text-sm font-medium rounded-lg transition ${
              pathname === "/reviewers" || pathname?.startsWith("/reviewers/")
                ? "text-brand-700 dark:text-brand-300 font-bold bg-brand-50 dark:bg-brand-950/60"
                : "text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Reviewers
          </Link>

          {!isCseContext ? (
            <>
              <Link
                href="/#how-it-works"
                className="px-2.5 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                How It Works
              </Link>
              <Link
                href="/cse"
                prefetch={true}
                className="px-2.5 py-1.5 text-sm font-medium rounded-lg text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-white hover:bg-brand-50/70 dark:hover:bg-brand-950/50 transition font-semibold"
              >
                CSE Reviewer
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/practice"
                prefetch={true}
                className={`px-2.5 py-1.5 text-sm font-medium rounded-lg transition ${
                  pathname?.startsWith("/practice")
                    ? "text-brand-700 dark:text-brand-300 font-bold bg-brand-50 dark:bg-brand-950/60"
                    : "text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Practice
              </Link>
              <Link
                href="/guides"
                prefetch={true}
                className={`px-2.5 py-1.5 text-sm font-medium rounded-lg transition ${
                  pathname?.startsWith("/guides")
                    ? "text-brand-700 dark:text-brand-300 font-bold bg-brand-50 dark:bg-brand-950/60"
                    : "text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Study Guides
              </Link>
              <Link
                href={examInfoHref}
                prefetch={true}
                className={`px-2.5 py-1.5 text-sm font-medium rounded-lg transition ${
                  pathname === examInfoHref || pathname?.startsWith(examInfoHref)
                    ? "text-brand-700 dark:text-brand-300 font-bold bg-brand-50 dark:bg-brand-950/60"
                    : "text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Exam Info
              </Link>
            </>
          )}

          {/* Desktop More Menu for Utilities */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              aria-expanded={moreMenuOpen}
              aria-haspopup="true"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${moreMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-[#1E191C] border border-border shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <Link
                  href="/#how-it-works"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  How It Works
                </Link>
                <Link
                  href="/reviewers"
                  prefetch={true}
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  All Reviewers
                </Link>
                <Link
                  href="/faq"
                  prefetch={true}
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  FAQ &amp; Support
                </Link>
                <Link
                  href="/settings"
                  prefetch={true}
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Settings &amp; Preferences
                </Link>
              </div>
            )}
          </div>

          <div className="pl-1">
            <UserNav />
          </div>
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center space-x-2 md:hidden">
          <UserNav />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-border bg-white/98 dark:bg-[#1E191C]/98 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-border/60">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {showProgress && (
            <Link
              href="/dashboard"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isDashboard ? "page" : undefined}
              className={`block px-3 py-2 text-sm font-semibold rounded-lg transition ${
                isDashboard
                  ? "bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/reviewers"
            prefetch={true}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            All Reviewers
          </Link>

          {!isCseContext ? (
            <>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                How It Works
              </Link>
              <Link
                href="/cse"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 rounded-lg transition"
              >
                Civil Service Exam (Live)
              </Link>
            </>
          ) : (
            <>
              <div className="pt-1.5 pb-1 px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {currentExamConfig?.shortName || "Current"} Reviewer
                </span>
              </div>
              <Link
                href="/practice"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Practice Subtests
              </Link>
              <Link
                href="/guides"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Study Guides
              </Link>
              <Link
                href={examInfoHref}
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Exam Info
              </Link>
            </>
          )}

          <div className="pt-2 mt-2 border-t border-border space-y-1">
            {isCseContext && (
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                How It Works
              </Link>
            )}
            <Link
              href="/faq"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              FAQ &amp; Help
            </Link>
            <Link
              href="/settings"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              Settings
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
