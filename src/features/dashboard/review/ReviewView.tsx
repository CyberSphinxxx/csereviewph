"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, CheckCircle2, Layers, Repeat, Trash2 } from "lucide-react";
import {
  LocalStorageService,
  type StoredBookmarkItem,
  type StoredMistakeItem,
} from "@/lib/storage";
import { ExamRunner } from "@/features/practice/ExamRunner";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

type ReviewTab = "due" | "bank" | "bookmarks";

const CARD =
  "rounded-3xl bg-white dark:bg-[#2b1620] shadow-[0_0_0_1.5px_rgba(138,22,48,0.12),0_18px_36px_-26px_rgba(90,15,35,0.4)] dark:shadow-[0_0_0_1.5px_rgba(255,255,255,0.1)] p-5";

function isDue(item: StoredMistakeItem): boolean {
  const box = item.box || 1;
  if (box >= 5) return false;
  if (!item.nextReviewDue) return true;
  return new Date(item.nextReviewDue).getTime() <= Date.now();
}

/**
 * Pure Leitner box/due counts, derived from the mistake list so that the
 * Review view's stats stay a pure function of state (no hidden localStorage
 * read inside useMemo, which both breaks exhaustive-deps and re-reads
 * storage on every render).
 */
export function computeMistakeStats(items: StoredMistakeItem[]): {
  total: number;
  dueCount: number;
  masteredCount: number;
  byBox: Record<1 | 2 | 3 | 4 | 5, number>;
} {
  const now = Date.now();
  const byBox: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let dueCount = 0;
  let masteredCount = 0;

  for (const item of items) {
    const box = (item.box || 1) as 1 | 2 | 3 | 4 | 5;
    byBox[box] = (byBox[box] || 0) + 1;
    if (box === 5) {
      masteredCount++;
    } else if (!item.nextReviewDue || new Date(item.nextReviewDue).getTime() <= now) {
      dueCount++;
    }
  }

  return {
    total: items.length,
    dueCount,
    masteredCount,
    byBox,
  };
}

function dueLabel(item: StoredMistakeItem): string {
  const box = item.box || 1;
  if (box === 5) return "Mastered";
  if (!item.nextReviewDue) return "Due now";
  const diff = new Date(item.nextReviewDue).getTime() - Date.now();
  if (diff <= 0) return "Due now";
  return `Due in ${Math.ceil(diff / 864e5)}d`;
}

export function ReviewView() {
  const [tab, setTab] = useState<ReviewTab>("due");
  const [mistakes, setMistakes] = useState<StoredMistakeItem[]>([]);
  const [bookmarks, setBookmarks] = useState<StoredBookmarkItem[]>([]);
  const [drill, setDrill] = useState<StoredMistakeItem[] | null>(null);
  const [bookmarkDrill, setBookmarkDrill] = useState(false);

  const reload = () => {
    setMistakes(LocalStorageService.getMistakeBank());
    setBookmarks(LocalStorageService.getBookmarks());
  };

  useEffect(() => {
    reload();
  }, []);

  const dueItems = useMemo(() => mistakes.filter(isDue), [mistakes]);

  // Derived purely from the mistakes list, which reload() refreshes after
  // every add/remove/master action.
  const stats = useMemo(() => computeMistakeStats(mistakes), [mistakes]);

  if (drill && drill.length > 0) {
    const questions = drill.map((m) => m.question);
    return (
      <ExamRunner
        initialQuestions={questions}
        rules={{
          mode: "mistakes",
          itemCount: questions.length,
          timeLimitMinutes: Math.max(10, Math.ceil(questions.length * 1.5)),
          passingScorePercentage: 80,
          allowsFlagging: true,
          hasContinuousTimer: true,
        }}
        title="Spaced Review Drill"
        subtitle={`Reviewing ${questions.length} items with Leitner progression`}
      />
    );
  }

  if (bookmarkDrill && bookmarks.length > 0) {
    const questions = bookmarks.map((b) => b.question);
    return (
      <ExamRunner
        initialQuestions={questions}
        rules={{
          mode: "bookmarks",
          itemCount: questions.length,
          timeLimitMinutes: Math.max(10, Math.ceil(questions.length * 1.5)),
          passingScorePercentage: 80,
          allowsFlagging: true,
          hasContinuousTimer: true,
        }}
        title="Bookmarked Questions Practice"
        subtitle={`Reviewing ${questions.length} saved questions`}
      />
    );
  }

  const removeMistake = (id: string) => {
    LocalStorageService.removeMistake(id);
    reload();
  };

  const markMastered = (id: string) => {
    LocalStorageService.markMistakeMastered(id);
    reload();
  };

  const removeBookmark = (id: string) => {
    LocalStorageService.removeBookmark(id);
    reload();
  };

  const tabs: { id: ReviewTab; label: string }[] = [
    { id: "due", label: `Due today (${dueItems.length})` },
    { id: "bank", label: `Mistake bank (${mistakes.length})` },
    { id: "bookmarks", label: `Bookmarks (${bookmarks.length})` },
  ];

  return (
    <div className="animate-page-enter space-y-5">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#1b1216] dark:text-[#f5eff1]">
          Review
        </h1>
        <p className="text-[#5a4a50] dark:text-[#a89ba1] text-sm mt-1">
          Bring back what you missed, just before you would forget it.
        </p>
      </div>

      {/* Due hero */}
      <section
        aria-label="Due today"
        className="rounded-3xl bg-gradient-to-br from-[#8a1630] to-[#65102a] text-white p-6 flex flex-wrap items-center gap-6"
      >
        <b className="font-display font-extrabold tracking-[-0.05em] leading-[0.85] text-6xl sm:text-7xl">
          {dueItems.length}
        </b>
        <div className="flex-1 min-w-[220px]">
          <b className="block font-display text-lg font-extrabold">questions due today</b>
          <p className="text-[#f3cbd3] text-[13.5px] mt-1 max-w-[48ch]">
            Missed questions come back sooner, and the ones you get right come back later.
          </p>
        </div>
        {dueItems.length > 0 ? (
          <button
            type="button"
            onClick={() => setDrill(dueItems)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f6b93b] text-[#2a0a12] text-sm font-extrabold shadow-[0_10px_24px_-12px_rgba(246,185,59,0.8)] hover:-translate-y-0.5 transition-transform"
          >
            Start review
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-white text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#7ee2a8]" />
            All clear for today
          </span>
        )}
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Review lists">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
              tab === t.id
                ? "bg-[#8a1630] text-white"
                : "bg-[#f4ecee] dark:bg-[#3a1f29] text-[#1b1216] dark:text-[#f8ecee]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Due list */}
      {tab === "due" && (
        <div>
          {dueItems.length === 0 ? (
            <div className={`${CARD} text-center py-10`}>
              <span className="w-20 mx-auto block" aria-hidden="true">
                <ReviewTayoOwl size={80} withCap bob />
              </span>
              <h3 className="font-display text-xl font-extrabold mt-3 text-[#1b1216] dark:text-[#f8ecee]">
                Nothing due right now
              </h3>
              <p className="text-sm font-semibold text-[#8a7a80] dark:text-[#a89ba1] mt-1 max-w-sm mx-auto">
                Missed questions reappear here on their Leitner schedule. Practice something new meanwhile.
              </p>
              <Link
                href="/dashboard/practice"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8a1630] text-white text-sm font-extrabold"
              >
                Open practice
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            dueItems.map((item) => (
              <QuestionRow
                key={item.id}
                item={item}
                onRemove={removeMistake}
                onMastered={markMastered}
              />
            ))
          )}
        </div>
      )}

      {/* Mistake bank */}
      {tab === "bank" && (
        <div>
          {mistakes.length === 0 ? (
            <div className={`${CARD} text-center py-10`}>
              <Layers className="w-10 h-10 mx-auto text-[#c9b3b9]" />
              <h3 className="font-display text-xl font-extrabold mt-3 text-[#1b1216] dark:text-[#f8ecee]">
                Your mistake bank is empty
              </h3>
              <p className="text-sm font-semibold text-[#8a7a80] dark:text-[#a89ba1] mt-1 max-w-sm mx-auto">
                Questions you miss during tests and drills are saved here automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {([1, 2, 3, 4, 5] as const).map((box) => (
                  <div
                    key={box}
                    className="rounded-xl bg-[#f4ecee] dark:bg-[#3a1f29] p-3 text-center"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wide text-[#8a7a80] dark:text-[#a89ba1]">
                      Box {box}
                    </div>
                    <div className="font-display text-lg font-extrabold text-[#1b1216] dark:text-[#f8ecee]">
                      {stats.byBox[box]}
                    </div>
                  </div>
                ))}
              </div>
              {mistakes.map((item) => (
                <QuestionRow
                  key={item.id}
                  item={item}
                  onRemove={removeMistake}
                  onMastered={markMastered}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Bookmarks */}
      {tab === "bookmarks" && (
        <div>
          {bookmarks.length === 0 ? (
            <div className={`${CARD} text-center py-10`}>
              <span className="w-20 mx-auto block" aria-hidden="true">
                <ReviewTayoOwl size={80} withCap />
              </span>
              <h3 className="font-display text-xl font-extrabold mt-3 text-[#1b1216] dark:text-[#f8ecee]">
                No bookmarks yet
              </h3>
              <p className="text-sm font-semibold text-[#8a7a80] dark:text-[#a89ba1] mt-1 max-w-sm mx-auto">
                Tap the bookmark on any question to save it here.
              </p>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setBookmarkDrill(true)}
                className="mb-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8a1630] text-white text-sm font-extrabold shadow-[0_10px_24px_-10px_rgba(138,22,48,0.75)] hover:-translate-y-0.5 transition-transform"
              >
                Practice all {bookmarks.length} saved {bookmarks.length === 1 ? "question" : "questions"}
                <ArrowRight className="w-4 h-4" />
              </button>
              {bookmarks.map((b) => (
                <div key={b.id} className={`${CARD} mb-2.5`}>
                  <div className="flex items-center justify-between gap-2 text-[12px] font-semibold text-[#8a7a80] dark:text-[#a89ba1]">
                    <span className="inline-flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-[#f6b93b]" />
                      {b.question.subjectName} · {b.question.topicName}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeBookmark(b.id)}
                      aria-label="Remove bookmark"
                      className="text-[#8a7a80] hover:text-[#d1344b] p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold text-[15px] mt-1.5 whitespace-pre-line text-[#1b1216] dark:text-[#f8ecee]">
                    {b.question.questionText}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionRow({
  item,
  onRemove,
  onMastered,
}: {
  item: StoredMistakeItem;
  onRemove: (id: string) => void;
  onMastered: (id: string) => void;
}) {
  const box = item.box || 1;
  return (
    <div className={`${CARD} mb-2.5`}>
      <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold">
        <span className="inline-flex items-center gap-1.5 text-[#8a1630] dark:text-[#de5572]">
          <Repeat className="w-3.5 h-3.5" />
          {item.question.subjectName} · {item.question.topicName}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[#f4ecee] dark:bg-[#3a1f29] text-[#5a4a50] dark:text-[#d6bcc3] text-[11px]">
          Box {box}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] ${
            box >= 5
              ? "bg-[#e4f7ec] text-[#0a6b35]"
              : dueLabel(item) === "Due now"
              ? "bg-[#fdeec6] text-[#6b4300]"
              : "bg-[#f4ecee] dark:bg-[#3a1f29] text-[#5a4a50] dark:text-[#d6bcc3]"
          }`}
        >
          {dueLabel(item)}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          {box < 5 && (
            <button
              type="button"
              onClick={() => onMastered(item.id)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#e4f7ec] text-[#0a6b35] text-[11px] font-extrabold"
              title="Mark directly as mastered"
            >
              <CheckCircle2 className="w-3 h-3" />
              Mastered
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label="Remove from mistake bank"
            className="text-[#8a7a80] hover:text-[#d1344b] p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </span>
      </div>
      <p className="font-semibold text-[15px] mt-2 whitespace-pre-line text-[#1b1216] dark:text-[#f8ecee]">
        {item.question.questionText}
      </p>
      {item.question.explanation && (
        <p className="mt-2 text-[13px] font-semibold rounded-xl bg-[#fbeff0] dark:bg-[#351a22] text-[#5a4a50] dark:text-[#d6bcc3] px-3.5 py-2.5">
          {item.question.explanation}
        </p>
      )}
    </div>
  );
}
