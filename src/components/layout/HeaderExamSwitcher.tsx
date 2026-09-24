"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useExamWorkspace } from "@/lib/workspace/useExamWorkspace";
import { getExamConfig } from "@/config/exams";
import { MyExamsDialog } from "@/components/workspace/MyExamsDialog";
import { ChevronDown, Check, Plus, Settings } from "lucide-react";

export function HeaderExamSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentWorkspace, allWorkspaces, switchWorkspace, isLoaded } = useExamWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleSelectWorkspace = (workspaceId: string) => {
    switchWorkspace(workspaceId);
    setIsOpen(false);
    // Safe route switching: always navigate to the newly selected exam's dashboard
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse ml-1 hidden sm:inline-block" />
    );
  }

  // "No exam chosen" is a real state: never fabricate a workspace for
  // contextual routes like /cse or /practice. The header falls back to a
  // plain "Choose an exam" entry point instead of a phantom CSE workspace.
  const activeWorkspace = currentWorkspace;

  const examConfig = activeWorkspace ? getExamConfig(activeWorkspace.examId) : undefined;
  const shortName = examConfig?.shortName || activeWorkspace?.examId?.toUpperCase() || "Exam";
  const trackName = activeWorkspace?.trackName || "Standard";

  return (
    <>
      <div className="relative inline-block text-left ml-1" ref={menuRef} onKeyDown={handleKeyDown}>
        {activeWorkspace ? (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label={`Current preparation exam: ${examConfig?.fullName || shortName}, ${trackName} track. Click to switch examination workspace.`}
            className="group inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-brand-200/80 bg-brand-50/80 px-2.5 py-1 text-xs font-semibold text-brand-800 shadow-2xs transition hover:bg-brand-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:border-brand-800/80 dark:bg-brand-950/60 dark:text-brand-300 dark:hover:bg-brand-900/60"
          >
            {/* Desktop Full Label */}
            <span className="hidden sm:inline-flex sm:items-center">
              <span>{shortName}</span>
              <span className="text-slate-400 mx-1">&bull;</span>
              <span className="font-normal text-slate-600 dark:text-slate-400">{trackName}</span>
            </span>
            {/* Mobile Compact Label */}
            <span className="sm:hidden">
              {shortName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-brand-600 dark:text-brand-400 transition-transform duration-150 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <Link
            href="/reviewers"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
          >
            <span>Choose an exam</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </Link>
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute left-0 z-50 mt-2 w-72 rounded-2xl border border-border bg-white py-2 shadow-xl motion-safe:animate-fade-in sm:w-80 dark:bg-[#1E191C]"
          >
            <div className="px-3.5 py-1.5 border-b border-border/60 mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Your Exam Workspaces
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {allWorkspaces.length} active
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto py-1">
              {allWorkspaces.map((ws) => {
                const config = getExamConfig(ws.examId);
                const isCurrent = currentWorkspace?.id === ws.id;

                return (
                  <button
                    key={ws.id}
                    role="menuitem"
                    type="button"
                    onClick={() => handleSelectWorkspace(ws.id)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-2 transition ${
                      isCurrent
                        ? "bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">
                        {config?.fullName || ws.examId.toUpperCase()}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Track: <strong>{ws.trackName || "Standard"}</strong></span>
                        {ws.targetExamDate && (
                          <span className="truncate">&bull; {ws.targetExamDate}</span>
                        )}
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-700 text-white shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold shrink-0">
                        Switch
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border/80 pt-1.5 mt-1 space-y-0.5">
              <Link
                href="/reviewers"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
              >
                <Plus className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Browse all Philippine exams</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setManageDialogOpen(true);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Manage my exams</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* My Exams Management Dialog */}
      <MyExamsDialog
        isOpen={manageDialogOpen}
        onClose={() => setManageDialogOpen(false)}
      />
    </>
  );
}
