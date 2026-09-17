"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi, Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [showOnlineReconnected, setShowOnlineReconnected] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV !== "development"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // 2. Connectivity Listeners
    const handleOffline = () => {
      setIsOffline(true);
      setShowOnlineReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlineReconnected(true);
      const t = setTimeout(() => setShowOnlineReconnected(false), 3500);
      return () => clearTimeout(t);
    };

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("offline", handleOffline);
      window.addEventListener("online", handleOnline);
    }

    // 3. BeforeInstallPrompt Listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("[PWA] User accepted install prompt");
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <>
      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between gap-3 animate-slide-up"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">Offline Mode Active</div>
              <div className="text-[11px] text-slate-300">
                You can continue mock tests, drills, and mistake reviews offline.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Online Toast */}
      {showOnlineReconnected && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-fade-in"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">Back Online</div>
            <div className="text-[11px] text-emerald-200">
              Cloud connection restored. All local progress is up to date.
            </div>
          </div>
        </div>
      )}

      {/* Install App Prompt Floating Banner */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 z-40 bg-white border border-brand-200 text-slate-900 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm animate-fade-in">
          <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
            <Download className="w-4 h-4 text-gold-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900">Install ReviewTayo App</div>
            <div className="text-[11px] text-slate-500 leading-tight">
              Study anywhere on your device, even without internet.
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-2.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setShowInstallPrompt(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
              aria-label="Dismiss install prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
