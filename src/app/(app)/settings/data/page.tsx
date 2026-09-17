"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePreferences } from "@/lib/preferences";
import { useSession } from "@/lib/auth/auth-client";
import { LocalStorageService, type GuestBackupPayload } from "@/lib/storage";
import {
  Database,
  Cloud,
  CloudUpload,
  Download,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

export default function DataStorageSettingsPage() {
  const { mounted, resetCategory, resetAllPreferences } = usePreferences();
  const { data: session } = useSession();

  const [historyCount, setHistoryCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [storageBytes, setStorageBytes] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Restore preview modal state
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restorePayload, setRestorePayload] = useState<GuestBackupPayload | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshStorageStats = () => {
    try {
      const history = LocalStorageService.getAttemptHistory();
      const bookmarks = LocalStorageService.getBookmarks();
      const mistakes = LocalStorageService.getMistakeBank();
      const streak = LocalStorageService.getStudyStreak();

      setHistoryCount(history.length);
      setBookmarkCount(bookmarks.length);
      setMistakeCount(mistakes.length);
      setStreakDays(streak.currentStreak);

      // Estimate local storage usage
      let totalLength = 0;
      if (typeof window !== "undefined" && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && (key.startsWith("cse_") || key.startsWith("attempt_") || key.startsWith("csereviewph_"))) {
            const val = window.localStorage.getItem(key) || "";
            totalLength += (key.length + val.length) * 2; // ~2 bytes per UTF-16 char
          }
        }
      }
      setStorageBytes(totalLength);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (!mounted) return;
    refreshStorageStats();
  }, [mounted]);

  // Sync Now handler
  const handleSyncNow = async () => {
    if (!session?.user) return;
    setIsSyncing(true);
    setSyncFeedback(null);

    try {
      const res = await LocalStorageService.syncGuestDataToCloud();
      if (res.success) {
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setLastSyncedAt(timeStr);
        setSyncFeedback(`Successfully synchronized ${res.synced?.attempts ?? 0} mock tests and ${res.synced?.bookmarks ?? 0} bookmarks.`);
        setStatusMessage({ type: "success", text: "Cloud sync completed successfully." });
      } else {
        setSyncFeedback(res.error || "Sync failed.");
        setStatusMessage({ type: "error", text: res.error || "Cloud sync encountered an issue." });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sync failed";
      setSyncFeedback(msg);
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Download device backup JSON
  const handleDownloadBackup = () => {
    try {
      const data = LocalStorageService.exportAllDataAsJson();
      const dateStr = new Date().toISOString().slice(0, 10);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reviewtayo-backup-v1-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: "success", text: "Device backup downloaded successfully." });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage({ type: "error", text: "Failed to create device backup JSON." });
    }
  };

  // Download cloud account export (RA 10173)
  const handleDownloadAccountData = async () => {
    try {
      const res = await fetch("/api/user/account");
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reviewtayo-cloud-account-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: "success", text: "Cloud account privacy data exported." });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage({ type: "error", text: "Failed to download cloud account data." });
    }
  };

  // Handle Restore file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setRestoreError("Selected backup file exceeds 2MB limit.");
      setRestoreModalOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw) as GuestBackupPayload;

        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.history)) {
          setRestoreError("Invalid backup file format or incompatible backup version.");
          setRestorePayload(null);
        } else {
          setRestorePayload(parsed);
          setRestoreError(null);
        }
        setRestoreModalOpen(true);
      } catch {
        setRestoreError("Could not parse JSON file. Please ensure the file is valid.");
        setRestorePayload(null);
        setRestoreModalOpen(true);
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Confirm restore
  const handleConfirmRestore = () => {
    if (!restorePayload) return;
    try {
      const res = LocalStorageService.importDataFromJson(JSON.stringify(restorePayload));
      if (res.success) {
        refreshStorageStats();
        setRestoreModalOpen(false);
        setStatusMessage({
          type: "success",
          text: `Restored ${restorePayload.history.length} test attempts and ${restorePayload.bookmarks?.length ?? 0} bookmarks.`,
        });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setRestoreError(res.error || "Failed to restore backup data.");
      }
    } catch (err) {
      setRestoreError(err instanceof Error ? err.message : "Error restoring data");
    }
  };

  // Clear device study data
  const handleClearDeviceData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all exam history, mistake items, and bookmarks stored on this device? We recommend downloading a backup first.\n\nThis will NOT delete your cloud account if you are signed in."
    );
    if (!confirmed) return;

    LocalStorageService.clearAllGuestData();
    refreshStorageStats();
    setStatusMessage({ type: "success", text: "Device study data has been cleared." });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  if (!mounted) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />;
  }

  const storageKb = (storageBytes / 1024).toFixed(1);

  return (
    <div className="space-y-8 max-w-2xl">
      {statusMessage && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold px-2 py-0.5 hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Group: Where your progress is saved */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span>Where Your Progress is Saved</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Real-time status of your local device storage and cloud synchronization.
          </p>
        </div>

        {/* Observed Status Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Storage Status: Saved on this device
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                {session?.user
                  ? lastSyncedAt
                    ? `Last cloud sync: today at ${lastSyncedAt}`
                    : "Cloud account connected • Ready to sync"
                  : "Offline local storage only • Sign in to enable cloud sync"}
              </span>
            </div>

            {session?.user ? (
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition shrink-0"
              >
                {isSyncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CloudUpload className="w-3.5 h-3.5" />
                )}
                <span>Sync Now</span>
              </button>
            ) : (
              <Link
                href="/settings/account"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0"
              >
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                <span>Connect Account</span>
              </Link>
            )}
          </div>

          {syncFeedback && (
            <div className="text-xs font-medium text-brand-700 dark:text-brand-400 pt-1 border-t border-slate-200 dark:border-slate-700">
              {syncFeedback}
            </div>
          )}
        </div>

        {/* Compact Storage Details Disclosure */}
        <details className="group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <summary className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between">
            <span>View Stored Data Details (~{storageKb} KB on device)</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-4 pb-4 pt-1 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-slate-600 dark:text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Mock Tests</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{historyCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Bookmarks</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{bookmarkCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Mistake Bank</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{mistakeCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Active Streak</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{streakDays}d</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
              Storage categories stored locally: completed attempts, question answers, bookmarks, mistake review boxes, study streak, target exam date, and UI preferences.
            </p>
          </div>
        </details>
      </section>

      {/* 2. Group: Backup & Restore */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Backup &amp; Restore</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Export a versioned backup file for moving your review sessions to another browser, or restore a previous JSON backup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Download Device Backup */}
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-left transition flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Download className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Download Device Backup
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Importable JSON containing all {historyCount} test attempts, bookmarks, mistake items, and streak data.
            </p>
          </button>

          {/* Restore Device Backup */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-left transition flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Restore Device Backup
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload a previously exported backup file. Previews item counts before confirming import.
            </p>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload device backup file"
          />
        </div>

        {/* Cloud Account Privacy Export (if signed in) */}
        {session?.user && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Download Cloud Account Export (RA 10173)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Privacy export of your authenticated server profile and synchronized records.
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadAccountData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Cloud Records</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. Group: Distinct Scoped Reset Actions (per §9) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Reset or Remove Data</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Scoped reset options. Each action explains what is removed and what is preserved.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
          {/* Reset Appearance */}
          <div className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reset Appearance Preferences
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Resets color theme and reduced motion. Preserves exam progress, account, and privacy consent.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                resetCategory("appearance");
                setStatusMessage({ type: "success", text: "Appearance preferences reset to defaults." });
                setTimeout(() => setStatusMessage(null), 3000);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 transition"
            >
              Reset appearance
            </button>
          </div>

          {/* Reset Reading */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reset Reading Comfort
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Resets text size, line spacing, and column width. Preserves exam scores and history.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                resetCategory("reading");
                setStatusMessage({ type: "success", text: "Reading comfort reset to defaults." });
                setTimeout(() => setStatusMessage(null), 3000);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 transition"
            >
              Reset reading
            </button>
          </div>

          {/* Reset Dashboard View */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reset Dashboard View
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Restores default section visibility and spacing. Preserves stored activity and streak.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                resetCategory("dashboard");
                setStatusMessage({ type: "success", text: "Dashboard layout restored to defaults." });
                setTimeout(() => setStatusMessage(null), 3000);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 transition"
            >
              Reset dashboard
            </button>
          </div>

          {/* Reset All Preferences */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reset All Site Preferences
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Restores default study plan, display, reading, and dashboard settings. Preserves mock attempts.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset all study plan, display, reading, and dashboard preferences?")) {
                  resetAllPreferences();
                  setStatusMessage({ type: "success", text: "All preferences reset to defaults." });
                  setTimeout(() => setStatusMessage(null), 3000);
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 transition"
            >
              Reset preferences
            </button>
          </div>

          {/* Clear Study Data on this Device */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                Clear Study Data on This Device
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Clears attempts, mistakes, bookmarks, and streak on this browser. Preserves cloud data if signed in.
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearDeviceData}
              className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300 shrink-0 transition"
            >
              Clear device data
            </button>
          </div>

          {/* Delete Account & Cloud Data Link */}
          {session?.user && (
            <div className="py-3.5 last:pb-0 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                  Delete Cloud Account &amp; Server Data
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Permanently erase your account, sessions, and cloud database records under RA 10173.
                </span>
              </div>
              <Link
                href="/settings/account#delete"
                className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300 shrink-0 transition"
              >
                Go to account deletion &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Restore Preview Confirmation Modal */}
      {restoreModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="restore-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 id="restore-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              Restore Device Backup Preview
            </h3>

            {restoreError ? (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
                {restoreError}
              </div>
            ) : restorePayload ? (
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  Found valid backup created on{" "}
                  <strong>
                    {new Date(restorePayload.exportedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </strong>
                  :
                </p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div>
                    <span className="block font-bold text-base text-slate-900 dark:text-white">
                      {restorePayload.history.length}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Attempts</span>
                  </div>
                  <div>
                    <span className="block font-bold text-base text-slate-900 dark:text-white">
                      {restorePayload.bookmarks?.length ?? 0}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Bookmarks</span>
                  </div>
                  <div>
                    <span className="block font-bold text-base text-slate-900 dark:text-white">
                      {restorePayload.mistakeBank?.length ?? 0}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">Mistakes</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Restoring will merge these study records onto this device. Active login sessions and privacy consent will remain intact.
                </p>
              </div>
            ) : null}

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRestoreModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              {restorePayload && !restoreError && (
                <button
                  type="button"
                  onClick={handleConfirmRestore}
                  className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm transition"
                >
                  Confirm Restore
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
