"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Calendar,
  Palette,
  Type,
  LayoutGrid,
  User,
  Database,
  Shield,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  Settings as SettingsIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const SETTINGS_GROUPS: NavGroup[] = [
  {
    group: "Study",
    items: [
      {
        name: "Study plan",
        href: "/settings/study",
        icon: Calendar,
        description: "Exam level, target date, daily pacing goal",
      },
    ],
  },
  {
    group: "Comfort",
    items: [
      {
        name: "Appearance",
        href: "/settings/appearance",
        icon: Palette,
        description: "Theme and reduced motion",
      },
      {
        name: "Text & reading",
        href: "/settings/reading",
        icon: Type,
        description: "Font size, line spacing, reading width",
      },
      {
        name: "Dashboard layout",
        href: "/settings/dashboard",
        icon: LayoutGrid,
        description: "Density and visible dashboard sections",
      },
    ],
  },
  {
    group: "Account & data",
    items: [
      {
        name: "Account & security",
        href: "/settings/account",
        icon: User,
        description: "Identity, display name, account deletion",
      },
      {
        name: "Data & storage",
        href: "/settings/data",
        icon: Database,
        description: "Sync status, backup, restore, reset data",
      },
      {
        name: "Privacy",
        href: "/settings/privacy",
        icon: Shield,
        description: "Essential storage, analytics, ads, check-in",
      },
    ],
  },
  {
    group: "Help",
    items: [
      {
        name: "Help & about",
        href: "/settings/help",
        icon: HelpCircle,
        description: "FAQ, support, disclosures, diagnostics",
      },
    ],
  },
];

export function SettingsShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOverview = pathname === "/settings";

  // Find active item for mobile header breadcrumb
  const allItems = SETTINGS_GROUPS.flatMap((g) => g.items);
  const activeItem = allItems.find((i) => i.href === pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto">
          {/* Top Page Header / Mobile Back Navigation */}
          <div className="mb-6 sm:mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            {!isOverview ? (
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-400 transition"
                  aria-label="Back to Settings overview"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </Link>
                {activeItem && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700 text-xs">/</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {activeItem.name}
                    </span>
                  </>
                )}
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                  <SettingsIcon className="w-6 h-6 text-brand-700 dark:text-brand-400 hidden sm:inline-block" />
                  <span>{isOverview ? "Settings" : activeItem?.name || "Settings"}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  {isOverview
                    ? "Personalize your study routine, reading comfort, appearance, and data choices."
                    : activeItem?.description || "Manage your preferences and site options."}
                </p>
              </div>
            </div>
          </div>

          {/* 2-Column Desktop Layout (220px nav, 32px gap, content column) */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
            {/* Desktop Quiet Left Sidebar Navigation */}
            <aside className="hidden md:block space-y-6">
              <nav className="space-y-5" aria-label="Settings categories">
                {/* Overview Link */}
                <div>
                  <Link
                    href="/settings"
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isOverview
                        ? "bg-highlight text-highlight-foreground dark:bg-brand-950 dark:text-white font-bold border border-brand-200 dark:border-brand-700/80 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span>Overview</span>
                    {isOverview && <ChevronRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
                  </Link>
                </div>

                {/* Grouped Section Links */}
                {SETTINGS_GROUPS.map((group) => (
                  <div key={group.group} className="space-y-1">
                    <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {group.group}
                    </h2>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                                isActive
                                  ? "bg-highlight text-highlight-foreground dark:bg-brand-950 dark:text-white font-bold border border-brand-200 dark:border-brand-700/80 shadow-2xs"
                                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-700 dark:text-brand-300" : "text-slate-400"}`} />
                                <span className="truncate">{item.name}</span>
                              </div>
                              {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Content Column (max reading width < 70ch) */}
            <div className="min-w-0 w-full">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
