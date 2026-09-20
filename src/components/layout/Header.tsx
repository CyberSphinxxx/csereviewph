"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { UserNav } from "@/components/auth/UserNav";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

function navClass(active: boolean) {
  return `min-h-10 inline-flex items-center px-3.5 py-2 text-sm rounded-xl transition-colors font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
    active
      ? "bg-[#8a1630] text-white dark:bg-[#8a1630] dark:text-white font-bold shadow-xs"
      : "text-[#1b1216] dark:text-[#f8ecee] hover:text-[#8a1630] dark:hover:text-[#ff9fb5] hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25]"
  }`;
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key to dismiss mobile drawer and restore focus
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        event.preventDefault();
        setMobileMenuOpen(false);
        hamburgerButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const isExamsActive = pathname === "/reviewers" || Boolean(pathname?.startsWith("/reviewers/"));
  const isStudyActive =
    pathname === "/guides" ||
    Boolean(pathname?.startsWith("/guides/")) ||
    pathname === "/articles" ||
    Boolean(pathname?.startsWith("/articles/"));
  const isDashboardActive = pathname === "/dashboard" || Boolean(pathname?.startsWith("/dashboard/"));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#8a1630]/10 dark:border-white/10 bg-[#fdf8f6]/90 dark:bg-[#1a0c11]/90 backdrop-blur-md print:hidden transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#8a1630] focus:ring-2 focus:ring-[#f6b93b]"
      >
        Skip to main content
      </a>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-11 min-h-[66px] flex items-center justify-between gap-4">
        {/* Left: Brand Identity (ReviewTayo Owl + Georgia Wordmark) */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            prefetch
            className="flex items-center gap-2 font-logo text-[23px] text-[#8a1630] dark:text-[#f8ecee] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
            aria-label="ReviewTayo home"
          >
            <span className="w-[27px] h-[27px] rounded-lg inline-flex items-center justify-center bg-transparent shrink-0">
              <ReviewTayoOwl size={27} withCap aria-hidden="true" />
            </span>
            <span className="font-logo font-normal">reviewtayo</span>
          </Link>
        </div>

        {/* Center/Right: Stable Global Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Global navigation">
          <Link
            href="/reviewers"
            aria-current={isExamsActive ? "page" : undefined}
            className={navClass(isExamsActive)}
          >
            Exams
          </Link>
          <Link
            href="/guides"
            aria-current={isStudyActive ? "page" : undefined}
            className={navClass(isStudyActive)}
          >
            Study resources
          </Link>
          <Link
            href="/dashboard"
            aria-current={isDashboardActive ? "page" : undefined}
            className={navClass(isDashboardActive)}
          >
            My dashboard
          </Link>

          <div className="pl-3 ml-2 border-l border-[#8a1630]/15 dark:border-white/15">
            <UserNav />
          </div>
        </nav>

        {/* Mobile: User Profile Trigger + Hamburger Drawer Button */}
        <div className="flex items-center gap-2 md:hidden">
          <UserNav />
          <button
            ref={hamburgerButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-[#8a1630]/15 dark:border-white/15 bg-white dark:bg-[#2b1620] text-[#8a1630] dark:text-[#f8ecee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav
          ref={drawerRef}
          id="mobile-navigation"
          aria-label="Global mobile navigation"
          className="md:hidden border-t border-[#8a1630]/15 dark:border-white/15 bg-white px-4 py-3 shadow-lg dark:bg-[#2b1620] animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="grid gap-1">
            <Link
              href="/reviewers"
              aria-current={isExamsActive ? "page" : undefined}
              className={navClass(isExamsActive)}
            >
              Exams
            </Link>
            <Link
              href="/guides"
              aria-current={isStudyActive ? "page" : undefined}
              className={navClass(isStudyActive)}
            >
              Study resources
            </Link>
            <Link
              href="/dashboard"
              aria-current={isDashboardActive ? "page" : undefined}
              className={navClass(isDashboardActive)}
            >
              My dashboard
            </Link>

            <div className="my-2 border-t border-[#8a1630]/15 dark:border-white/15" />

            <Link
              href="/faq"
              className={navClass(pathname === "/faq")}
            >
              FAQ &amp; help
            </Link>
            <Link
              href="/settings"
              className={navClass(pathname === "/settings")}
            >
              Settings
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export const GlobalHeader = Header;
