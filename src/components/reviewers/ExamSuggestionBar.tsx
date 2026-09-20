"use client";

import React, { useState, useEffect } from "react";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

export interface ExamSuggestionBarProps {
  initialExamName?: string;
}

export function ExamSuggestionBar({ initialExamName = "" }: ExamSuggestionBarProps) {
  const [examName, setExamName] = useState(initialExamName);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialExamName && !examName) {
      setExamName(initialExamName);
    }
  }, [initialExamName, examName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = examName.trim();
    if (!trimmed) {
      setMessage("Type the exam name first.");
      return;
    }
    setMessage(`Thanks. We'll look into “${trimmed}”.`);
  };

  return (
    <div
      data-testid="exam-suggestion-bar"
      className="sugbar flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mt-9 p-4 sm:p-6 rounded-[26px] border-2 border-dashed border-[#8a1630]/20 dark:border-white/20 bg-white/95 dark:bg-[#2b1620] min-w-0 w-full max-w-full backdrop-blur-xs"
    >
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 w-full md:w-auto">
        <div className="w-12 sm:w-16 shrink-0">
          <ReviewTayoOwl size={52} withCap alt="ReviewTayo Mascot" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-lg sm:text-2xl text-[#1b1216] dark:text-[#f8ecee] leading-tight m-0">
            Can&apos;t find your exam?
          </h3>
          <p className="text-xs sm:text-base text-[#5a4a50] dark:text-[#d6bcc3] mt-1 m-0">
            Tell us which one you&apos;re preparing for.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center min-w-0 max-w-full">
        <input
          type="text"
          value={examName}
          onChange={(e) => {
            setExamName(e.target.value);
            if (message) setMessage(null);
          }}
          placeholder="Exam name"
          aria-label="Exam you're looking for"
          className="border border-[#8a1630]/20 dark:border-white/20 rounded-xl px-4 py-2.5 w-full sm:w-auto min-w-0 sm:min-w-[200px] sm:max-w-[280px] text-sm sm:text-base font-semibold text-[#1b1216] dark:text-[#f8ecee] placeholder:text-[#5a4a50]/70 dark:placeholder:text-[#d6bcc3]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a1630] dark:focus-visible:ring-[#ff9fb5] bg-white dark:bg-[#1a0c11]"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm bg-[#8a1630] text-white hover:bg-[#a81b3b] transition-colors cursor-pointer shrink-0"
        >
          Send
        </button>
      </form>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="w-full text-left md:text-right font-bold text-sm text-[#0b7a3b] dark:text-[#8ff0b8] mt-2 sm:mt-0"
        >
          {message}
        </p>
      )}
    </div>
  );
}
