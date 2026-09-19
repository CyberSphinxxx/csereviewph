"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { UserNav } from "@/components/auth/UserNav";
import { Logo } from "@/components/ui/Logo";

function navClass(active: boolean) {
  return `min-h-10 inline-flex items-center px-3 py-2 text-sm rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
    active
      ? "bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 font-bold"
      : "text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 dark:bg-[#1E191C]/95 backdrop-blur-md print:hidden transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-brand-800 focus:ring-2 focus:ring-brand-600"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity (Logo + Wordmark) - stable on every page */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            prefetch
            className="flex items-center shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            aria-label="ReviewTayo home"
          >
            <Logo format="horizontal" className="h-8 sm:h-9 w-auto text-brand-700 dark:text-white" />
          </Link>
        </div>

        {/* Center/Right: Stable Global Navigation Links (Identical on every page) */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Global navigation">
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

          <div className="pl-3 ml-2 border-l border-border/80">
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
            className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:text-slate-300 dark:hover:bg-slate-800"
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
          className="md:hidden border-t border-border bg-white px-4 py-3 shadow-lg dark:bg-[#1E191C] animate-in fade-in slide-in-from-top-2 duration-150"
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

            <div className="my-2 border-t border-border" />

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
