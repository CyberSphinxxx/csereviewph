"use client";

import React, { useState } from "react";
import { usePreferences } from "@/lib/preferences";
import {
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function AppearanceSettingsPage() {
  const { preferences, mounted, updateCategory, resetCategory } = usePreferences();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleThemeChange = (theme: "system" | "light" | "dark") => {
    const res = updateCategory("appearance", { theme });
    if (res.success) {
      setSaveStatus("Saved on this device");
      setTimeout(() => setSaveStatus(null), 2500);
    } else {
      setSaveStatus("Could not persist theme preference");
    }
  };

  const handleMotionChange = (reduceMotion: "device" | "reduce") => {
    const res = updateCategory("appearance", { reduceMotion });
    if (res.success) {
      setSaveStatus("Saved on this device");
      setTimeout(() => setSaveStatus(null), 2500);
    } else {
      setSaveStatus("Could not persist motion preference");
    }
  };

  const handleReset = () => {
    resetCategory("appearance");
    setSaveStatus("Appearance reset to defaults");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  if (!mounted) {
    return <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />;
  }

  const currentTheme = preferences.appearance.theme;
  const currentMotion = preferences.appearance.reduceMotion;

  const themes = [
    {
      id: "system",
      name: "System default",
      description: "Automatically match your computer or phone operating system color theme.",
      icon: Laptop,
    },
    {
      id: "light",
      name: "Light theme",
      description: "Crisp porcelain panels with deep Philippine maroon brand accents and warm details.",
      icon: Sun,
    },
    {
      id: "dark",
      name: "Dark theme",
      description: "Warm charcoal surfaces with high-contrast text and luminous rose-maroon accents.",
      icon: Moon,
    },
  ] as const;

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Autosave Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 h-5">
        <span>Preferences autosave immediately to your current browser.</span>
        {saveStatus && (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{saveStatus}</span>
          </span>
        )}
      </div>

      {/* 1. Theme Selection Cards */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Color Theme</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Choose your preferred interface theme. Selected indicator confirms your active setting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? "border-brand-600 dark:border-brand-400 bg-highlight dark:bg-brand-950 ring-1 ring-brand-600 dark:ring-brand-400 shadow-2xs"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg transition ${
                      isSelected
                        ? "bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-brand-600 dark:border-brand-400 bg-brand-600 dark:bg-brand-500 text-white"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block mb-1">
                    {t.name}
                  </span>
                  <p
                    className={`text-[11px] leading-relaxed transition ${
                      isSelected
                        ? "text-slate-700 dark:text-slate-200 font-medium"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {t.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Live Theme Component Preview (required per §5) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>Theme Live Preview</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Demonstrates real typography, inputs, selection states, buttons, and progress meters under your current theme.
          </p>
        </div>

        {/* Live Preview Container */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4">
          {/* Sample Heading and Paragraph */}
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Civil Service Commission &bull; Article IX-B Constitutional Powers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Under the 1987 Philippine Constitution, the Civil Service Commission serves as the central personnel agency of the government, maintaining meritocracy across civil servant appointments.
            </p>
          </div>

          {/* Sample Interactive Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Sample Input Field
              </label>
              <input
                type="text"
                readOnly
                value="Sample examinee notes"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Buttons &amp; Actions
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs transition"
                >
                  Primary action
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>

          {/* Sample Selected Choice State */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Selected Choice State
            </span>
            <div className="p-2.5 rounded-xl border border-brand-600 dark:border-brand-400 bg-highlight dark:bg-brand-950 flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-950 dark:text-white">
                Option B: Qualified examinee meeting eligibility benchmarks
              </span>
              <span className="p-1 rounded-full bg-brand-600 dark:bg-brand-500 text-white">
                <Check className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Sample Subject Progress Row */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                General Information &bull; RA 6713 Code of Conduct
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">82% Mastery</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-brand-600 dark:bg-brand-500 rounded-full" style={{ width: "82%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Motion Preference */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Motion &amp; Animation</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Follow your operating system reduced-motion preference or force reduced transitions across review tests.
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition">
            <input
              type="radio"
              name="reduceMotion"
              value="device"
              checked={currentMotion === "device"}
              onChange={() => handleMotionChange("device")}
              className="mt-0.5 h-4 w-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Follow device setting (Recommended)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Honors your operating system&apos;s reduced-motion setting automatically.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition">
            <input
              type="radio"
              name="reduceMotion"
              value="reduce"
              checked={currentMotion === "reduce"}
              onChange={() => handleMotionChange("reduce")}
              className="mt-0.5 h-4 w-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Reduce motion on this site
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Minimizes card transitions and eliminates non-essential animations.
              </span>
            </div>
          </label>
        </div>
      </section>

      {/* Reset Section Action */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset appearance defaults</span>
        </button>
      </div>
    </div>
  );
}
