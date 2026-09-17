"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, CloudUpload, Download, Upload, RotateCcw } from "lucide-react";
import { LocalStorageService } from "@/lib/storage";
import { AuthModal } from "@/components/auth/AuthModal";
import { useSession } from "@/lib/auth/auth-client";

interface DataStorageSectionProps {
  onDataChanged: () => void;
  onShowMessage: (msg: string) => void;
}

export function DataStorageSection({ onDataChanged, onShowMessage }: DataStorageSectionProps) {
  const { data: session, refetch: refetchSession } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cloudSyncing, setCloudSyncing] = useState(false);

  const handleCloudSync = async () => {
    if (!session?.user) {
      setAuthModalOpen(true);
      return;
    }
    setCloudSyncing(true);
    try {
      const res = await LocalStorageService.syncGuestDataToCloud();
      if (res.success) {
        onShowMessage(`Progress synced to cloud! (${res.synced?.attempts ?? 0} exams)`);
      } else {
        onShowMessage(res.error || "Sync completed.");
      }
    } catch {
      onShowMessage("Sync failed. Please check network connection.");
    } finally {
      setCloudSyncing(false);
    }
  };

  const handleExportBackup = () => {
    const json = LocalStorageService.exportAllDataAsJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviewtayo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowMessage("Backup exported successfully!");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = LocalStorageService.importDataFromJson(content);
      if (res.success) {
        onShowMessage("Backup restored successfully!");
        onDataChanged();
      } else {
        alert(`Failed to restore backup: ${res.error || "Unknown error"}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetData = () => {
    if (
      confirm(
        "Are you sure you want to reset all your progress? This will delete all local test history, bookmarks, and mistake records."
      )
    ) {
      LocalStorageService.clearAllGuestData();
      onDataChanged();
      onShowMessage("All local data has been reset.");
    }
  };

  return (
    <section
      aria-labelledby="storage-section-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Saved on this device &bull; Manage data
          </span>
        </div>
        <h3 id="storage-section-heading" className="text-base font-bold text-slate-900">
          Your Progress is Saved Locally
        </h3>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Your test history, mistake bank, and bookmarks are saved securely in your browser under Republic Act 10173 (Data Privacy Act). No account is required.
      </p>

      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCloudSync}
          disabled={cloudSyncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition shadow-xs disabled:opacity-50"
        >
          <CloudUpload className="w-3.5 h-3.5" />
          <span>{cloudSyncing ? "Syncing..." : session?.user ? "Sync to Cloud" : "Save to Cloud Account"}</span>
        </button>

        <button
          type="button"
          onClick={handleExportBackup}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Backup (JSON)</span>
        </button>

        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>Restore Backup</span>
          <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
        </label>

        <button
          type="button"
          onClick={handleResetData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All Data</span>
        </button>
      </div>

      <div className="pt-2 border-t border-slate-100 text-right">
        <Link
          href="/settings/data"
          className="text-xs font-semibold text-brand-700 hover:text-brand-800 underline inline-flex items-center gap-1"
        >
          <span>More data &amp; backup settings &rarr;</span>
        </Link>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          refetchSession();
          handleCloudSync();
        }}
      />
    </section>
  );
}
