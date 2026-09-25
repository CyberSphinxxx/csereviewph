"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ResultsView, type AttemptData } from "@/features/results/ResultsView";

import { LocalStorageService } from "@/lib/storage";

type ResultsPageState =
  | { kind: "loading" }
  | { kind: "ready"; data: AttemptData }
  | { kind: "missing" };

export default function ResultsPage() {
  const params = useParams();
  const attemptId = params?.attemptId as string;

  const [state, setState] = useState<ResultsPageState>({ kind: "loading" });

  useEffect(() => {
    if (!attemptId) return;

    const stored = LocalStorageService.getAttemptDetails(attemptId);
    if (stored) {
      setState({ kind: "ready", data: stored as unknown as AttemptData });
      return;
    }

    // No fallback result is manufactured here: a missing, evicted, or
    // not-yet-synced attempt shows an honest unavailable state instead of a
    // fabricated score.
    setState({ kind: "missing" });
  }, [attemptId]);

  if (state.kind === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading your result...</p>
        </div>
      </div>
    );
  }

  if (state.kind === "missing") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Result not available on this device
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            We could not find this attempt in this device&apos;s records. It may have been completed
            on another device and not yet synced, or its detailed record may no longer be stored
            locally. We will never show an estimated score in place of your real result.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard/history"
              className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800"
            >
              Open attempt history
            </Link>
            <Link
              href="/practice"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Back to practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ResultsView attemptData={state.data} />;
}
