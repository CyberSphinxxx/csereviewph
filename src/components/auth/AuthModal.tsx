"use client";

/**
 * Split-panel auth modal (Concept A from the auth redesign).
 *
 * Left: fixed-maroon brand panel (a shell choice — identical in light and
 * dark) with the owl mascot, hero line and account benefits. Right: the
 * theme-aware AuthForm with Sign in / Create account tabs and an inline
 * forgot-password flow.
 *
 * The post-auth guest-data sync screen is preserved verbatim from the
 * previous modal. All auth API calls live in AuthForm — nothing is duplicated
 * here.
 */

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LocalStorageService } from "@/lib/storage";
import { AuthForm, AuthMode } from "./AuthForm";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";
import { BENEFITS } from "./auth-fields";
import {
  X,
  CloudUpload,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "sign-in",
}: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Sync state after successful auth
  const [authComplete, setAuthComplete] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setAuthComplete(false);
      setSyncResult(null);
    }
  }, [isOpen, initialMode]);

  // Save previous focus exactly once per open (a separate effect keeps the
  // keydown listener from re-running and clobbering this when the parent's
  // inline onClose/onSuccess callbacks change identity every render).
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
  }, [isOpen]);

  // Focus dialog on open, lock body scroll, trap Tab focus, handle Escape
  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the close button (first stop in the dialog)
    const timer = setTimeout(() => {
      modalRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 50);

    // Escape + focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Return focus to the trigger when the modal closes (scroll lock is
  // already restored by the effect above).
  useEffect(() => {
    if (isOpen) return;
    const prev = previousFocusRef.current;
    if (prev && prev.isConnected && document.activeElement === document.body) {
      prev.focus();
      previousFocusRef.current = null;
    }
  });

  if (!isOpen || !mounted) return null;

  const handleAuthSuccess = () => {
    // Check if there are local guest attempts to sync
    const guestHistory = LocalStorageService.getAttemptHistory();
    const guestBookmarks = LocalStorageService.getBookmarks();
    if (guestHistory.length === 0 && guestBookmarks.length === 0) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setAuthComplete(true);
    }
  };

  const handleSyncGuestData = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await LocalStorageService.syncGuestDataToCloud();
      if (res.success) {
        setSyncResult(
          `Successfully migrated ${res.synced?.attempts ?? 0} exams and ${res.synced?.bookmarks ?? 0} bookmarks to your account!`
        );
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      } else {
        setSyncResult(`Sync note: ${res.error || "Completed with warnings."}`);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      }
    } catch {
      setSyncResult("Sync failed. You can re-sync anytime from your dashboard.");
    } finally {
      setSyncing(false);
    }
  };

  const guestExamsCount = LocalStorageService.getAttemptHistory().length;
  const guestBookmarksCount = LocalStorageService.getBookmarks().length;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(27,10,16,0.55)] p-4 backdrop-blur-md animate-in fade-in duration-200 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !syncing) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={authComplete ? "sync-modal-title" : "auth-form-title"}
        className="relative my-auto grid w-[calc(100vw-32px)] max-w-[740px] grid-cols-1 overflow-hidden rounded-[22px] border border-[rgba(138,22,48,0.14)] bg-[color:var(--card)] shadow-[0_30px_90px_rgba(27,10,16,0.4)] md:grid-cols-[310px_1fr] dark:border-[rgba(255,255,255,0.14)]"
      >
        {/* Close button — above both panels */}
        <button
          onClick={onClose}
          disabled={syncing}
          className="absolute right-3.5 top-3.5 z-[6] grid h-9 w-9 place-items-center rounded-full bg-[color:var(--secondary)] text-[color:var(--brand-muted)] transition hover:text-[color:var(--brand-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86152d] disabled:opacity-50 dark:focus-visible:outline-[#ffd27a]"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Post-auth Guest Data Sync Screen (full-width, no brand panel) */}
        {authComplete ? (
          <div className="space-y-5 p-6 sm:p-7">
            <div className="flex items-center gap-2.5 text-[color:var(--brand-text)]">
              <CloudUpload className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h2 id="sync-modal-title" className="text-xl font-bold tracking-tight">
                Sync Offline Progress
              </h2>
            </div>

            <div className="rounded-xl bg-brand-50/80 p-4 dark:bg-brand-950/40 md:border md:border-brand-200/80 md:dark:border-brand-900/60">
              <div className="mb-2 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-200">
                    Signed In Successfully!
                  </h3>
                  <p className="text-xs text-brand-700 dark:text-brand-300">
                    We detected offline study progress on this device.
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg border border-brand-100 bg-[color:var(--card)] p-2.5 dark:border-brand-900/50">
                  <div className="text-lg font-bold text-[color:var(--brand-text)]">
                    {guestExamsCount}
                  </div>
                  <div className="text-[color:var(--brand-muted)]">Practice Exams</div>
                </div>
                <div className="rounded-lg border border-brand-100 bg-[color:var(--card)] p-2.5 dark:border-brand-900/50">
                  <div className="text-lg font-bold text-[color:var(--brand-text)]">
                    {guestBookmarksCount}
                  </div>
                  <div className="text-[color:var(--brand-muted)]">Bookmarks</div>
                </div>
              </div>
            </div>

            {syncResult && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                {syncResult}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSyncGuestData}
                disabled={syncing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86152d] dark:focus-visible:outline-[#ffd27a]"
              >
                {syncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-4 w-4" aria-hidden="true" />
                    Sync to Cloud Now
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onSuccess) onSuccess();
                  onClose();
                }}
                disabled={syncing}
                className="rounded-xl border border-[color:var(--brand-border)] px-4 py-2.5 text-sm font-medium text-[color:var(--brand-muted)] transition hover:bg-[color:var(--blush)] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86152d] dark:focus-visible:outline-[#ffd27a]"
              >
                Skip for Now
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Brand panel — fixed maroon in both themes (shell choice, not theme) */}
            <div
              className="relative hidden overflow-hidden p-6 text-white md:flex md:flex-col md:gap-4 lg:p-8"
              style={{ background: "linear-gradient(165deg, #8a1630 0%, #a81b3b 62%, #c4213f 100%)" }}
            >
              {/* Decorative circles */}
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-[230px] w-[230px] rounded-full bg-white/[0.06]" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-[60px] -left-[60px] h-[160px] w-[160px] rounded-full bg-black/[0.08]" />

              <div className="relative z-[1] flex h-full flex-col">
                <span className="inline-flex w-fit items-center rounded-full bg-[#f6b93b] px-3 py-1.5 text-[12px] font-extrabold text-[#3d2a05]">
                  Live · Civil Service Exam
                </span>

                <div className="mt-3 w-[112px] shrink-0 animate-owl-bob">
                  <ReviewTayoOwl withCap tracked bob alt="ReviewTayo owl coach" />
                </div>

                <h3 className="mt-3 font-display text-[22px] font-extrabold leading-[1.15] tracking-[-0.04em]">
                  Review smarter.
                  <br />
                  Pass sooner.
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/80">
                  Save your progress and continue reviewing on any device.
                </p>

                <ul className="mt-auto flex flex-col gap-3 pt-4">
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

                <p className="mt-3.5 text-[11.5px] text-white/60">ReviewTayo · reviewtayo.online</p>
              </div>
            </div>

            {/* Form panel */}
            <div className="p-6 pt-12 sm:p-7 sm:pt-12 md:p-7 md:pt-12 lg:p-8 lg:pt-12">
              <AuthForm
                mode={mode}
                onModeChange={(newMode) => setMode(newMode)}
                onSuccess={handleAuthSuccess}
                onGuestContinue={onClose}
              />
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
