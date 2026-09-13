"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, ChevronDown, Menu, X } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import { LocalStorageService } from "@/lib/storage";
import { UserNav } from "@/components/auth/UserNav";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
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

  const showProgress = Boolean(session?.user || hasProgress);
  const isDashboard = pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md print:hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" prefetch={true} className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-bold shadow-md shadow-brand-700/20 group-hover:bg-brand-800 transition shrink-0">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-gold-400" />
          </div>
          <div className="flex items-center">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              csereview<span className="text-brand-600 dark:text-brand-400">ph</span>
              <span className="text-gold-600 dark:text-gold-400 font-semibold ml-0.5 text-sm sm:text-base">.com</span>
            </span>
            <span className="hidden lg:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-full border border-brand-200 dark:border-brand-800">
              Civil Service Exam
            </span>
          </div>
        </Link>

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
            href="/cse/exam-guide"
            prefetch={true}
            className={`px-2.5 py-1.5 text-sm font-medium rounded-lg transition ${
              pathname?.startsWith("/cse/exam-guide")
                ? "text-brand-700 dark:text-brand-300 font-bold bg-brand-50 dark:bg-brand-950/60"
                : "text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Exam Info
          </Link>

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
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <Link
                  href="/#how-it-works"
                  onClick={() => setMoreMenuOpen(false)}
                  className="block px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  How It Works
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg animate-fade-in">
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
            href="/practice"
            prefetch={true}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            Practice
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
            href="/cse/exam-guide"
            prefetch={true}
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            Exam Info
          </Link>

          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              How It Works
            </Link>
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
        </div>
      )}
    </header>
  );
}
