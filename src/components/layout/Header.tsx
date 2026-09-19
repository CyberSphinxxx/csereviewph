"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import { LocalStorageService } from "@/lib/storage";
import { UserNav } from "@/components/auth/UserNav";
import { Logo } from "@/components/ui/Logo";
import { HeaderExamSwitcher } from "./HeaderExamSwitcher";
import { useExamWorkspace } from "@/lib/workspace/useExamWorkspace";

const EXAM_ROUTE_PREFIXES = [
  "/cse",
  "/practice",
  "/exams",
  "/dashboard",
  "/results",
  "/guides",
  "/articles",
];

function isExamRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/exam-info" || EXAM_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function navClass(active: boolean) {
  return `min-h-10 inline-flex items-center px-3 py-2 text-sm rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
    active
      ? "bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 font-bold"
      : "text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
  }`;
}

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { currentWorkspace, currentExamConfig } = useExamWorkspace();
  const [hasProgress, setHasProgress] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      setHasProgress(
        LocalStorageService.getAttemptHistory().length > 0 ||
          LocalStorageService.getBookmarks().length > 0 ||
          LocalStorageService.getMistakeBank().length > 0,
      );
    } catch {
      // Storage can be unavailable during SSR or in restricted browser modes.
    }
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const examContext = isExamRoute(pathname);
  const showWorkspaceLink = Boolean(session?.user || hasProgress || currentWorkspace);
  const dashboardActive = pathname === "/dashboard" || pathname?.startsWith("/dashboard/");
  const practiceHref = currentExamConfig?.routes?.practiceUrl || "/practice";
  const mockHref = currentExamConfig?.routes?.fullMockUrl || practiceHref;
  const infoHref = currentExamConfig?.routes?.infoUrl || "/exam-info";

  const handleMoreKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && moreMenuOpen) {
      event.preventDefault();
      setMoreMenuOpen(false);
      moreButtonRef.current?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 dark:bg-[#1E191C]/95 backdrop-blur-md print:hidden transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-brand-800 focus:ring-2 focus:ring-brand-600"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/"
            prefetch
            className="flex items-center shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            aria-label="ReviewTayo exam library home"
          >
            <Logo format="horizontal" className="h-8 sm:h-9 w-auto text-brand-700 dark:text-white" />
          </Link>
          {examContext && <HeaderExamSwitcher />}
        </div>

        <nav className="hidden md:flex items-center gap-1" aria-label={examContext ? "Exam workspace" : "Primary"}>
          {examContext ? (
            <>
              <Link href="/reviewers" className={navClass(false)}>All exams</Link>
              <Link href="/dashboard" aria-current={dashboardActive ? "page" : undefined} className={navClass(Boolean(dashboardActive))}>Overview</Link>
              <Link href={practiceHref} className={navClass(Boolean(pathname?.startsWith("/practice")))}>Practice</Link>
              <Link href={mockHref} className={navClass(Boolean(pathname?.startsWith("/exams")))}>Mock exams</Link>
              <Link href="/guides" className={navClass(Boolean(pathname?.startsWith("/guides")))}>Guides</Link>
              <Link href={infoHref} className={navClass(pathname === infoHref || Boolean(pathname?.startsWith(`${infoHref}/`)))}>Exam info</Link>
            </>
          ) : (
            <>
              <Link href="/reviewers" className={navClass(pathname === "/reviewers")}>Exams</Link>
              <Link href="/#how-it-works" className={navClass(false)}>How it works</Link>
              <Link href="/guides" className={navClass(Boolean(pathname?.startsWith("/guides")))}>Study resources</Link>
              {showWorkspaceLink && <Link href="/dashboard" className={navClass(false)}>My workspace</Link>}
            </>
          )}

          <div ref={moreMenuRef} className="relative" onKeyDown={handleMoreKeyDown}>
            <button
              ref={moreButtonRef}
              type="button"
              onClick={() => setMoreMenuOpen((open) => !open)}
              aria-expanded={moreMenuOpen}
              aria-haspopup="true"
              className={navClass(false)}
            >
              More <ChevronDown className={`ml-1 h-4 w-4 transition-transform motion-reduce:transition-none ${moreMenuOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white dark:bg-[#1E191C] p-1.5 shadow-lg">
                <Link href="/faq" className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">FAQ &amp; help</Link>
                <Link href="/about" className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">About ReviewTayo</Link>
                <Link href="/settings" className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Settings</Link>
              </div>
            )}
          </div>

          <div className="pl-1"><UserNav /></div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <UserNav />
          <button
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

      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label={examContext ? "Exam workspace mobile" : "Primary mobile"} className="md:hidden border-t border-border bg-white px-4 py-3 shadow-lg dark:bg-[#1E191C]">
          <div className="mb-2 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {examContext ? `${currentExamConfig?.shortName || "Exam"} workspace` : "ReviewTayo library"}
          </div>
          <div className="grid gap-1">
            {examContext ? (
              <>
                <Link href="/reviewers" className={navClass(false)}>← All exams</Link>
                <Link href="/dashboard" className={navClass(Boolean(dashboardActive))}>Overview</Link>
                <Link href={practiceHref} className={navClass(Boolean(pathname?.startsWith("/practice")))}>Practice</Link>
                <Link href={mockHref} className={navClass(Boolean(pathname?.startsWith("/exams")))}>Mock exams</Link>
                <Link href="/guides" className={navClass(Boolean(pathname?.startsWith("/guides")))}>Guides</Link>
                <Link href={infoHref} className={navClass(pathname === infoHref)}>Exam info</Link>
              </>
            ) : (
              <>
                <Link href="/reviewers" className={navClass(pathname === "/reviewers")}>Exams</Link>
                <Link href="/#how-it-works" className={navClass(false)}>How it works</Link>
                <Link href="/guides" className={navClass(Boolean(pathname?.startsWith("/guides")))}>Study resources</Link>
                {showWorkspaceLink && <Link href="/dashboard" className={navClass(false)}>My workspace</Link>}
              </>
            )}
            <div className="my-1 border-t border-border" />
            <Link href="/faq" className={navClass(false)}>FAQ &amp; help</Link>
            <Link href="/settings" className={navClass(false)}>Settings</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
