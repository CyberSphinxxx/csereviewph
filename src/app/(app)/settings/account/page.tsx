"use client";

import React, { useState } from "react";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  User,
  Shield,
  Trash2,
  LogOut,
  AlertTriangle,
  Check,
  Loader2,
  Lock,
  Download,
} from "lucide-react";

export default function AccountSettingsPage() {
  const { data: session, isPending, refetch } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleExportAccountData = async () => {
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
    } catch {
      setStatusMessage({ type: "error", text: "Failed to export account data. Please try again." });
    }
  };

  const handleExecuteDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      setStatusMessage({ type: "error", text: 'Please type "DELETE" to confirm permanent account erasure.' });
      return;
    }

    setIsDeleting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/user/account", { method: "DELETE" });
      if (res.ok) {
        await signOut();
        setDeleteModalOpen(false);
        setStatusMessage({
          type: "success",
          text: "Your cloud account and associated synchronized study records have been permanently erased.",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to delete account on server. Please try again.",
        });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error occurred while attempting account erasure." });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPending) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />;
  }

  const user = session?.user;

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
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
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

      {/* 1. Identity & Account Overview */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <span>Account Profile</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Manage your authenticated identity and sign-in status.
          </p>
        </div>

        {!user ? (
          /* Guest Mode Container */
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">
                G
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Using this device as a guest
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your mock exams, bookmarks, and streak are safely stored in this browser&apos;s local storage.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-md shadow-brand-700/20 transition"
              >
                Sign In or Create Free Account
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated User Details */
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Full Name / Display Name
                </label>
                <div className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold">
                  {user.name || "Civil Service Examinee"}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Email Address
                </label>
                <div className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold flex items-center justify-between">
                  <span className="truncate">{user.email}</span>
                  <span title="Email is verified">
                    <Lock className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Member since {new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  refetch();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2. Account Data Portability & Rights */}
      {user && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-3 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Data Portability (RA 10173)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              In accordance with Section 18 of the Philippine Data Privacy Act of 2012, you have the right to obtain a copy of your personal cloud account records.
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleExportAccountData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download Cloud Account Records (JSON)</span>
            </button>
          </div>
        </section>
      )}

      {/* 3. Account Deletion (Separated section per §8) */}
      {user && (
        <section id="delete" className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-5 sm:p-6 space-y-4 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Account &amp; Associated Cloud Data</span>
            </h2>
            <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5 leading-relaxed">
              Permanently erase your authenticated profile, test records, and bookmarks from our server database. This action complies with RA 10173 Right to Erasure and cannot be reversed.
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Erase My Cloud Account</span>
            </button>
          </div>
        </section>
      )}

      {/* Account Deletion Confirmation Modal */}
      {deleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 id="delete-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
                Confirm Permanent Account Erasure
              </h3>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>
                This will permanently delete your account, authentication tokens, test attempt history, and bookmarks stored in the cloud database.
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                Study data stored locally in your device&apos;s browser will not be affected unless you choose to clear device data in Data &amp; Storage settings.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <label htmlFor="confirm-delete-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Type &quot;DELETE&quot; below to confirm:
              </label>
              <input
                id="confirm-delete-input"
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteConfirmText("");
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Permanently Erase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign-In / Register Modal for Guests */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
