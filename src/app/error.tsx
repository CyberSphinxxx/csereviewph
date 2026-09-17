"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error to console or monitoring
    console.error("App Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-5 shadow-sm">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 mb-3">
        Temporary Navigation Error
      </span>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
        Something went wrong
      </h1>

      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
        An unexpected error occurred while loading this review module. Your exam history and bookmarks in local storage remain safe.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-md shadow-brand-700/20 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition"
        >
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span>Return to ReviewTayo</span>
        </Link>
      </div>
    </div>
  );
}
