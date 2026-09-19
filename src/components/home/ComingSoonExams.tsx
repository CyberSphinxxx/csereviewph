"use client";

import React, { useState } from "react";
import { Bell, BookOpen, Building2, Check, Sparkles, X } from "lucide-react";
import { EXAM_CATALOG, type ExamCatalogEntry, type ExamCategory } from "@/config/exams";

const CATEGORIES: { id: "all" | ExamCategory; label: string }[] = [
  { id: "all", label: "All Categories" },
  { id: "civil-service", label: "Civil Service" },
  { id: "licensure", label: "Licensure" },
  { id: "public-safety", label: "Public Safety" },
];

export function ComingSoonExams() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | ExamCategory>("all");
  const [notifyExam, setNotifyExam] = useState<ExamCatalogEntry | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const planned = EXAM_CATALOG.filter(
    (exam) =>
      exam.availability !== "available" &&
      (selectedCategory === "all" || exam.category === selectedCategory)
  );

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const stored = JSON.parse(localStorage.getItem("rt_notifications_v1") || "[]");
      stored.push({ examId: notifyExam?.id, email, date: new Date().toISOString() });
      localStorage.setItem("rt_notifications_v1", JSON.stringify(stored));
    } catch {
      // Ignore localStorage restrictions
    }
    setIsSubmitted(true);
  };

  const handleCloseModal = () => {
    setNotifyExam(null);
    setEmail("");
    setIsSubmitted(false);
  };

  return (
    <section aria-labelledby="coming-soon-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coming Soon</span>
          </div>
          <h2 id="coming-soon-heading" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Coming Soon: More Philippine Exams
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Each reviewer is built according to official regulatory syllabi and authored independently. Get notified when practice opens.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  active
                    ? "bg-white dark:bg-[#1E191C] text-slate-900 dark:text-white shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Planned Exam Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {planned.map((exam) => (
          <article
            key={exam.id}
            className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xs transition hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  {exam.shortName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  Coming soon
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {exam.fullName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {exam.description}
                </p>
              </div>

              <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{exam.agency}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <BookOpen className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{exam.levels.map((l) => l.shortName).join(" &bull; ")}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setNotifyExam(exam)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                <Bell className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Notify me</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Notify Me Modal */}
      {notifyExam && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notify-dialog-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
        >
          <div className="bg-white dark:bg-[#1E191C] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border relative">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                    Release Notification
                  </span>
                  <h3 id="notify-dialog-title" className="text-xl font-bold text-slate-900 dark:text-white">
                    Notify me when {notifyExam.shortName} is live
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    We’ll send you one email when the {notifyExam.fullName} question bank and simulated tests launch.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="notify-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <input
                    id="notify-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  />
                  <p className="text-[11px] text-slate-400">Zero spam. Protected under RA 10173.</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Keep me updated</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">You’re on the list!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  We will email <strong>{email}</strong> the moment the {notifyExam.shortName} reviewer is ready for practice.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-brand-700 text-white text-xs font-bold transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
