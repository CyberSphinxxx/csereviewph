import type { EngineQuestion } from "@/features/exam-engine";
import type {
  ActiveExamSessionDraft,
  AttemptSummary,
  DailyActivityCell,
  GuestBackupPayload,
  StoredAttemptDetails,
  StoredBookmarkItem,
  StoredMistakeItem,
  StudyStreakData,
  SubjectReadinessMetric,
  TargetExamConfig,
} from "./types";

// Storage Key Constants
export const STORAGE_KEYS = {
  HISTORY: "cse_guest_attempts_history",
  ATTEMPT_PREFIX: "cse_guest_attempt_",
  MISTAKES: "cse_guest_mistake_bank",
  BOOKMARKS: "cse_guest_bookmarks",
  STREAK: "cse_guest_streak",
  DRAFT_PREFIX: "cse_guest_draft_",
  TARGET_EXAM: "cse_guest_target_exam",
  DAILY_ACTIVITY_PREFIX: "cse_guest_daily_activity_",
  LEGACY_HISTORY: "attempts_history",
  LEGACY_MISTAKES: "mistake_bank",
  LEGACY_BOOKMARKS: "bookmarked_question_ids",
  LEGACY_ATTEMPT_PREFIX: "attempt_",
} as const;

export const LEITNER_INTERVAL_DAYS: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 1, // review daily
  2: 3, // review every 3 days
  3: 7, // review weekly
  4: 14, // review every 2 weeks
  5: 30, // mastered (monthly refresh)
};

export function calculateNextReviewDate(box: 1 | 2 | 3 | 4 | 5, fromDate = new Date()): string {
  const days = LEITNER_INTERVAL_DAYS[box];
  const next = new Date(fromDate.getTime() + days * 24 * 60 * 60 * 1000);
  return next.toISOString();
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeGetItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSetItem(key: string, value: unknown): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[LocalStorageService] Failed to set key "${key}":`, err);
    return false;
  }
}

function safeRemoveItem(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore removal errors
  }
}

export function getTodayString(d = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(d);
  } catch {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }
}

export function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getTodayString(d);
}

const DEFAULT_FALLBACK_SUBJECTS = [
  { id: "sub-pro-verbal", name: "Verbal Ability", slug: "verbal-ability" },
  { id: "sub-pro-numerical", name: "Numerical Ability", slug: "numerical-ability" },
  { id: "sub-pro-analytical", name: "Analytical Ability", slug: "analytical-ability" },
  { id: "sub-pro-geninfo", name: "General Information", slug: "general-information" },
  { id: "sub-subpro-clerical", name: "Clerical Operations", slug: "clerical-operations" },
];

export class LocalStorageService {
  private static migrated = false;

  public static resetMigrationForTesting(): void {
    this.migrated = false;
  }

  /**
   * Automatically migrates legacy keys created in earlier iterations
   * into the modern, typed cse_guest_* namespace.
   */
  public static runMigration(): void {
    if (!isBrowser() || this.migrated) return;

    try {
      // 1. Migrate legacy history
      const legacyHistoryRaw = window.localStorage.getItem(STORAGE_KEYS.LEGACY_HISTORY);
      const modernHistoryRaw = window.localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (legacyHistoryRaw && !modernHistoryRaw) {
        const parsed = JSON.parse(legacyHistoryRaw);
        if (Array.isArray(parsed)) {
          const transformed: AttemptSummary[] = parsed.map((item) => ({
            id: item.id || `migrated-${Date.now()}`,
            title: item.title || "Practice Exam",
            mode: item.mode || "practice",
            percentage: typeof item.percentage === "number" ? item.percentage : 0,
            rawScore: typeof item.percentage === "number" ? Math.round(item.percentage * 0.1) : 0,
            totalQuestions: 10,
            passed: Boolean(item.passed),
            date: item.date || new Date().toISOString(),
          }));
          window.localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(transformed));
        }
      }

      // 2. Migrate legacy mistakes
      const legacyMistakesRaw = window.localStorage.getItem(STORAGE_KEYS.LEGACY_MISTAKES);
      const modernMistakesRaw = window.localStorage.getItem(STORAGE_KEYS.MISTAKES);
      if (legacyMistakesRaw && !modernMistakesRaw) {
        const parsed = JSON.parse(legacyMistakesRaw);
        if (Array.isArray(parsed)) {
          const transformed: StoredMistakeItem[] = parsed.map((q: EngineQuestion) => {
            const correctChoice = q.choices?.find((c) => c.isCorrect);
            return {
              id: q.id,
              question: q,
              attemptId: "legacy-attempt",
              correctChoiceId: correctChoice?.id,
              addedAt: new Date().toISOString(),
              reviewCount: 0,
            };
          });
          window.localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(transformed));
        }
      }

      // 3. Migrate legacy bookmarks
      const legacyBookmarksRaw = window.localStorage.getItem(STORAGE_KEYS.LEGACY_BOOKMARKS);
      const modernBookmarksRaw = window.localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (legacyBookmarksRaw && !modernBookmarksRaw) {
        const parsed = JSON.parse(legacyBookmarksRaw);
        if (Array.isArray(parsed)) {
          const transformed: StoredBookmarkItem[] = [];
          for (const item of parsed) {
            if (typeof item === "string") {
              transformed.push({
                id: item,
                question: {
                  id: item,
                  topicId: "legacy",
                  topicName: "General Review",
                  topicSlug: "general",
                  subjectId: "sub-legacy",
                  subjectName: "General Review",
                  subjectSlug: "general",
                  questionText: `Bookmarked Item ${item}`,
                  explanation: "",
                  difficulty: "medium",
                  language: "en",
                  choices: [],
                },
                bookmarkedAt: new Date().toISOString(),
              });
            } else if (item && typeof item === "object" && (item as StoredBookmarkItem).id) {
              transformed.push(item as StoredBookmarkItem);
            }
          }
          window.localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(transformed));
        }
      }

      this.migrated = true;
    } catch (e) {
      console.warn("[LocalStorageService] Migration skipped or failed:", e);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Active Exam Session Drafts (Auto-Save & Resumption)                        */
  /* -------------------------------------------------------------------------- */

  public static getDraftKey(levelSlug: string, mode: string, topicId?: string): string {
    return `${STORAGE_KEYS.DRAFT_PREFIX}${levelSlug}_${mode}${topicId ? `_${topicId}` : ""}`;
  }

  public static saveActiveDraft(draft: ActiveExamSessionDraft): boolean {
    const key = this.getDraftKey(
      draft.levelSlug,
      draft.mode,
      draft.questions[0]?.topicId && draft.mode === "practice" ? draft.questions[0].topicId : undefined
    );
    return safeSetItem(key, {
      ...draft,
      lastSavedAt: new Date().toISOString(),
    });
  }

  public static getActiveDraft(
    levelSlug: string,
    mode: string,
    topicId?: string
  ): ActiveExamSessionDraft | null {
    const key = this.getDraftKey(levelSlug, mode, topicId);
    return safeGetItem<ActiveExamSessionDraft | null>(key, null);
  }

  public static clearActiveDraft(levelSlug: string, mode: string, topicId?: string): void {
    const key = this.getDraftKey(levelSlug, mode, topicId);
    safeRemoveItem(key);
  }

  /* -------------------------------------------------------------------------- */
  /* Completed Attempts & History                                               */
  /* -------------------------------------------------------------------------- */

  public static getAttemptHistory(): AttemptSummary[] {
    this.runMigration();
    return safeGetItem<AttemptSummary[]>(STORAGE_KEYS.HISTORY, []);
  }

  public static getAttemptDetails(attemptId: string): StoredAttemptDetails | null {
    this.runMigration();
    const modern = safeGetItem<StoredAttemptDetails | null>(
      `${STORAGE_KEYS.ATTEMPT_PREFIX}${attemptId}`,
      null
    );
    if (modern) return modern;

    // Check legacy key format
    return safeGetItem<StoredAttemptDetails | null>(
      `${STORAGE_KEYS.LEGACY_ATTEMPT_PREFIX}${attemptId}`,
      null
    );
  }

  public static recordCompletedAttempt(attempt: StoredAttemptDetails): void {
    this.runMigration();

    // 1. Save detailed attempt record
    safeSetItem(`${STORAGE_KEYS.ATTEMPT_PREFIX}${attempt.id}`, attempt);

    // 2. Append to history summaries
    const history = this.getAttemptHistory();
    const summary: AttemptSummary = {
      id: attempt.id,
      title: attempt.title,
      mode: attempt.mode,
      percentage: attempt.scoreResult.percentageScore,
      rawScore: attempt.scoreResult.rawScore,
      totalQuestions: attempt.scoreResult.totalQuestions,
      passed: attempt.scoreResult.isPassed,
      date: attempt.completedAt,
    };

    // Prepend to show most recent first
    const updatedHistory = [summary, ...history.filter((h) => h.id !== attempt.id)];
    safeSetItem(STORAGE_KEYS.HISTORY, updatedHistory);

    // Evict detailed attempt records beyond the 20 most recent to prevent localStorage quota exhaustion
    const MAX_DETAILED_ATTEMPTS = 20;
    if (updatedHistory.length > MAX_DETAILED_ATTEMPTS) {
      const toEvict = updatedHistory.slice(MAX_DETAILED_ATTEMPTS);
      for (const item of toEvict) {
        safeRemoveItem(`${STORAGE_KEYS.ATTEMPT_PREFIX}${item.id}`);
        safeRemoveItem(`${STORAGE_KEYS.LEGACY_ATTEMPT_PREFIX}${item.id}`);
      }
    }

    // 3. Update Mistake Bank with incorrect questions
    const currentMistakes = this.getMistakeBank();
    const mistakeMap = new Map<string, StoredMistakeItem>(currentMistakes.map((m) => [m.id, m]));

    const answersMap = new Map(attempt.answers.map((a) => [a.questionId, a]));

    for (const q of attempt.questions) {
      const ans = answersMap.get(q.id);
      const correctChoice = q.choices.find((c) => c.isCorrect);
      const isCorrect = ans?.selectedChoiceId && ans.selectedChoiceId === correctChoice?.id;

      if (!isCorrect) {
        const existing = mistakeMap.get(q.id);
        if (existing) {
          // Demote to Box 1, reset streak, due immediately
          mistakeMap.set(q.id, {
            ...existing,
            attemptId: attempt.id,
            selectedChoiceId: ans?.selectedChoiceId,
            reviewCount: existing.reviewCount + 1,
            box: 1,
            consecutiveCorrect: 0,
            lastReviewedAt: attempt.completedAt,
            nextReviewDue: calculateNextReviewDate(1, new Date(attempt.completedAt)),
          });
        } else {
          mistakeMap.set(q.id, {
            id: q.id,
            question: q,
            attemptId: attempt.id,
            selectedChoiceId: ans?.selectedChoiceId,
            correctChoiceId: correctChoice?.id,
            addedAt: attempt.completedAt,
            reviewCount: 1,
            box: 1,
            consecutiveCorrect: 0,
            lastReviewedAt: attempt.completedAt,
            nextReviewDue: new Date(attempt.completedAt).toISOString(), // immediately due
          });
        }
      } else if (attempt.mode === "mistakes") {
        // Correct answer during a mistake review drill advances Leitner box
        const existing = mistakeMap.get(q.id);
        if (existing) {
          const currentBox = existing.box || 1;
          const nextBox = Math.min(5, currentBox + 1) as 1 | 2 | 3 | 4 | 5;
          const consecutive = (existing.consecutiveCorrect || 0) + 1;
          mistakeMap.set(q.id, {
            ...existing,
            box: nextBox,
            consecutiveCorrect: consecutive,
            reviewCount: existing.reviewCount + 1,
            lastReviewedAt: attempt.completedAt,
            nextReviewDue: calculateNextReviewDate(nextBox, new Date(attempt.completedAt)),
          });
        }
      }
    }

    safeSetItem(STORAGE_KEYS.MISTAKES, Array.from(mistakeMap.values()));

    // 4. Update Study Streak & Daily Questions Count
    this.addDailyQuestionsAnswered(attempt.answers.length);
    this.recordDailyActivity();

    // 5. Clean up active draft for this exam if one exists
    const levelSlug = attempt.title.toLowerCase().includes("subprof")
      ? "subprofessional"
      : "professional";
    this.clearActiveDraft(levelSlug, attempt.mode);
  }

  public static deleteAttempt(attemptId: string): void {
    const history = this.getAttemptHistory();
    const updated = history.filter((h) => h.id !== attemptId);
    safeSetItem(STORAGE_KEYS.HISTORY, updated);
    safeRemoveItem(`${STORAGE_KEYS.ATTEMPT_PREFIX}${attemptId}`);
    safeRemoveItem(`${STORAGE_KEYS.LEGACY_ATTEMPT_PREFIX}${attemptId}`);
  }

  /* -------------------------------------------------------------------------- */
  /* Mistake Bank                                                               */
  /* -------------------------------------------------------------------------- */

  public static getMistakeBank(): StoredMistakeItem[] {
    this.runMigration();
    return safeGetItem<StoredMistakeItem[]>(STORAGE_KEYS.MISTAKES, []);
  }

  public static removeMistake(questionId: string): void {
    const current = this.getMistakeBank();
    const filtered = current.filter((m) => m.id !== questionId);
    safeSetItem(STORAGE_KEYS.MISTAKES, filtered);
  }

  public static clearMistakeBank(): void {
    safeSetItem(STORAGE_KEYS.MISTAKES, []);
    safeRemoveItem(STORAGE_KEYS.LEGACY_MISTAKES);
  }

  /**
   * Returns mistake items that are currently due for spaced repetition review
   * (items in Box 1-4 whose nextReviewDue is now or in the past).
   */
  public static getDueMistakes(): StoredMistakeItem[] {
    const all = this.getMistakeBank();
    const now = Date.now();
    return all.filter((m) => {
      const box = m.box || 1;
      if (box >= 5) return false; // Box 5 is mastered
      if (!m.nextReviewDue) return true; // Legacy items without date are due immediately
      return new Date(m.nextReviewDue).getTime() <= now;
    });
  }

  /**
   * Updates an item's Leitner box after a flashcard or drill response.
   */
  public static updateMistakeSRS(
    questionId: string,
    isCorrect: boolean
  ): StoredMistakeItem | null {
    const all = this.getMistakeBank();
    const idx = all.findIndex((m) => m.id === questionId);
    if (idx === -1) return null;

    const item = all[idx];
    const now = new Date();
    let updatedItem: StoredMistakeItem;

    if (isCorrect) {
      const currentBox = item.box || 1;
      const nextBox = Math.min(5, currentBox + 1) as 1 | 2 | 3 | 4 | 5;
      const consecutive = (item.consecutiveCorrect || 0) + 1;
      updatedItem = {
        ...item,
        box: nextBox,
        consecutiveCorrect: consecutive,
        reviewCount: item.reviewCount + 1,
        lastReviewedAt: now.toISOString(),
        nextReviewDue: calculateNextReviewDate(nextBox, now),
      };
    } else {
      updatedItem = {
        ...item,
        box: 1,
        consecutiveCorrect: 0,
        reviewCount: item.reviewCount + 1,
        lastReviewedAt: now.toISOString(),
        nextReviewDue: calculateNextReviewDate(1, now),
      };
    }

    all[idx] = updatedItem;
    safeSetItem(STORAGE_KEYS.MISTAKES, all);
    return updatedItem;
  }

  /**
   * Directly marks a mistake item as Mastered (Leitner Box 5).
   */
  public static markMistakeMastered(questionId: string): void {
    const all = this.getMistakeBank();
    const idx = all.findIndex((m) => m.id === questionId);
    if (idx === -1) return;

    all[idx] = {
      ...all[idx],
      box: 5,
      consecutiveCorrect: (all[idx].consecutiveCorrect || 0) + 1,
      lastReviewedAt: new Date().toISOString(),
      nextReviewDue: calculateNextReviewDate(5, new Date()),
    };
    safeSetItem(STORAGE_KEYS.MISTAKES, all);
  }

  /**
   * Retrieves summary counts by Leitner box for visual progress indicators.
   */
  public static getMistakeStats(): {
    total: number;
    dueCount: number;
    masteredCount: number;
    byBox: Record<1 | 2 | 3 | 4 | 5, number>;
  } {
    const all = this.getMistakeBank();
    const now = Date.now();
    const byBox: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let dueCount = 0;
    let masteredCount = 0;

    for (const m of all) {
      const box = (m.box || 1) as 1 | 2 | 3 | 4 | 5;
      byBox[box] = (byBox[box] || 0) + 1;
      if (box === 5) {
        masteredCount++;
      } else if (!m.nextReviewDue || new Date(m.nextReviewDue).getTime() <= now) {
        dueCount++;
      }
    }

    return {
      total: all.length,
      dueCount,
      masteredCount,
      byBox,
    };
  }

  /* -------------------------------------------------------------------------- */
  /* Bookmarks                                                                  */
  /* -------------------------------------------------------------------------- */

  public static getBookmarks(): StoredBookmarkItem[] {
    this.runMigration();
    return safeGetItem<StoredBookmarkItem[]>(STORAGE_KEYS.BOOKMARKS, []);
  }

  public static isBookmarked(questionId: string): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some((b) => b.id === questionId);
  }

  public static toggleBookmark(question: EngineQuestion, notes?: string): boolean {
    const bookmarks = this.getBookmarks();
    const existsIndex = bookmarks.findIndex((b) => b.id === question.id);

    if (existsIndex >= 0) {
      // Remove
      bookmarks.splice(existsIndex, 1);
      safeSetItem(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return false;
    } else {
      // Add
      bookmarks.unshift({
        id: question.id,
        question,
        bookmarkedAt: new Date().toISOString(),
        notes,
      });
      safeSetItem(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return true;
    }
  }

  public static removeBookmark(questionId: string): void {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter((b) => b.id !== questionId);
    safeSetItem(STORAGE_KEYS.BOOKMARKS, filtered);
  }

  /* -------------------------------------------------------------------------- */
  /* Study Streak & Activity Tracking                                           */
  /* -------------------------------------------------------------------------- */

  public static getStudyStreak(): StudyStreakData {
    const raw = safeGetItem<StudyStreakData>(STORAGE_KEYS.STREAK, {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: "",
      activeDates: [],
      checkInDates: [],
    });

    const today = getTodayString();
    const yesterday = getYesterdayString();

    // If last active date is today or yesterday, streak is retained.
    // If older, streak has expired back to 0 (while preserving longestStreak).
    let activeStreak = raw.currentStreak;
    if (raw.lastActiveDate && raw.lastActiveDate !== today && raw.lastActiveDate !== yesterday) {
      activeStreak = 0;
    }

    return {
      ...raw,
      currentStreak: activeStreak,
      checkInDates: raw.checkInDates || [],
    };
  }

  public static recordDailyCheckIn(): void {
    const current = this.getStudyStreak();
    const today = getTodayString();
    const checkIns = current.checkInDates || [];
    if (!checkIns.includes(today)) {
      const updated: StudyStreakData = {
        ...current,
        checkInDates: [...checkIns, today],
      };
      safeSetItem(STORAGE_KEYS.STREAK, updated);
    }
  }

  public static formatDayStreak(days: number): string {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  /**
   * Generates continuous daily cells for the activity grid across the last N weeks
   * up to today, mapped in Asia/Manila date keys.
   */
  public static getActivityGridData(weeks = 12): DailyActivityCell[] {
    const today = getTodayString();
    const streak = this.getStudyStreak();
    const history = this.getAttemptHistory();
    const checkIns = new Set(streak.checkInDates || []);
    const activeDates = new Set(streak.activeDates || []);

    const cells: DailyActivityCell[] = [];
    const totalDays = weeks * 7;

    const now = new Date();
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = getTodayString(d);
      const questionCount = this.getDailyQuestionsAnswered(dateStr);
      const hasCheckIn = checkIns.has(dateStr) || activeDates.has(dateStr);
      const sessionsCount = history.filter((h) => h.date && h.date.startsWith(dateStr)).length;

      let activityLevel: 0 | 1 | 2 | 3 = 0;
      if (questionCount >= 26) {
        activityLevel = 3;
      } else if (questionCount >= 11) {
        activityLevel = 2;
      } else if (questionCount >= 1) {
        activityLevel = 1;
      }

      const formattedDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      cells.push({
        date: dateStr,
        formattedDate,
        dayOfWeek: d.getDay(),
        questionCount,
        hasCheckIn,
        sessionsCount,
        activityLevel,
        isToday: dateStr === today,
        isFuture: dateStr > today,
      });
    }

    return cells;
  }

  public static recordDailyActivity(): StudyStreakData {
    const current = this.getStudyStreak();
    const today = getTodayString();

    if (current.lastActiveDate === today) {
      return current;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(yesterday.getDate()).padStart(2, "0")}`;

    let newStreak = 1;
    if (current.lastActiveDate === yesterdayStr) {
      newStreak = current.currentStreak + 1;
    }

    const updated: StudyStreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, current.longestStreak),
      lastActiveDate: today,
      activeDates: Array.from(new Set([...current.activeDates, today])),
      checkInDates: Array.from(new Set([...(current.checkInDates || []), today])),
    };

    safeSetItem(STORAGE_KEYS.STREAK, updated);
    return updated;
  }

  public static getDailyQuestionsAnswered(date = getTodayString()): number {
    return safeGetItem<number>(`${STORAGE_KEYS.DAILY_ACTIVITY_PREFIX}${date}`, 0);
  }

  public static addDailyQuestionsAnswered(count: number, date = getTodayString()): number {
    const current = this.getDailyQuestionsAnswered(date);
    const updated = current + count;
    safeSetItem(`${STORAGE_KEYS.DAILY_ACTIVITY_PREFIX}${date}`, updated);
    return updated;
  }

  public static getTargetExamConfig(): TargetExamConfig {
    return safeGetItem<TargetExamConfig>(STORAGE_KEYS.TARGET_EXAM, {
      targetDate: "2027-03-14",
      examName: "March 2027 CSE-PPT",
      dailyGoal: 25,
    });
  }

  public static saveTargetExamConfig(config: TargetExamConfig): boolean {
    return safeSetItem(STORAGE_KEYS.TARGET_EXAM, config);
  }

  /* -------------------------------------------------------------------------- */
  /* Dynamic Diagnostic Metrics (Dynamic Subject Readiness)                     */
  /* -------------------------------------------------------------------------- */

  public static getSubjectReadiness(): SubjectReadinessMetric[] {
    const history = this.getAttemptHistory();

    // Default template from SEED_SUBJECTS keyed by slug
    const subjectsMap = new Map<
      string,
      {
        subjectId: string;
        subjectName: string;
        subjectSlug: string;
        total: number;
        correct: number;
      }
    >();

    for (const sub of DEFAULT_FALLBACK_SUBJECTS) {
      if (!subjectsMap.has(sub.slug)) {
        subjectsMap.set(sub.slug, {
          subjectId: sub.id,
          subjectName: sub.name,
          subjectSlug: sub.slug,
          total: 0,
          correct: 0,
        });
      }
    }

    // Inspect recent attempts
    for (const summary of history.slice(0, 15)) {
      const details = this.getAttemptDetails(summary.id);
      if (!details?.scoreResult?.subjectBreakdown) continue;

      for (const score of details.scoreResult.subjectBreakdown) {
        const entry = Array.from(subjectsMap.values()).find(
          (s) => s.subjectId === score.subjectId || s.subjectName === score.subjectName
        );
        if (entry) {
          entry.total += score.total;
          entry.correct += score.correct;
        } else {
          subjectsMap.set(score.subjectId, {
            subjectId: score.subjectId,
            subjectName: score.subjectName,
            subjectSlug: score.subjectId,
            total: score.total,
            correct: score.correct,
          });
        }
      }
    }

    return Array.from(subjectsMap.values()).map((val) => {
      const accuracy = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
      return {
        subjectId: val.subjectId,
        subjectName: val.subjectName,
        subjectSlug: val.subjectSlug,
        questionsAnswered: val.total,
        correctCount: val.correct,
        accuracyPercentage: accuracy,
      };
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Backup, Export, Restore, & Privacy Reset (RA 10173)                        */
  /* -------------------------------------------------------------------------- */

  public static exportAllGuestData(): GuestBackupPayload {
    const history = this.getAttemptHistory();
    const attempts: Record<string, StoredAttemptDetails> = {};

    for (const h of history) {
      const detail = this.getAttemptDetails(h.id);
      if (detail) {
        attempts[h.id] = detail;
      }
    }

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      history,
      attempts,
      mistakeBank: this.getMistakeBank(),
      bookmarks: this.getBookmarks(),
      streak: this.getStudyStreak(),
      targetExam: this.getTargetExamConfig(),
    };
  }

  public static exportAllDataAsJson(): string {
    return JSON.stringify(this.exportAllGuestData(), null, 2);
  }

  public static async syncGuestDataToCloud(): Promise<{
    success: boolean;
    message?: string;
    synced?: { attempts: number; bookmarks: number; mistakes: number };
    error?: string;
  }> {
    try {
      const payload = this.exportAllGuestData();
      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || `Sync failed with status ${res.status}`,
        };
      }

      return {
        success: true,
        message: data.message,
        synced: data.synced,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Network error during sync",
      };
    }
  }


  public static importDataFromJson(jsonString: string): { success: boolean; error?: string } {
    try {
      if (typeof jsonString !== "string" || jsonString.length > 2 * 1024 * 1024) {
        return { success: false, error: "Backup file is invalid or exceeds 2MB limit." };
      }
      const parsed = JSON.parse(jsonString) as Partial<GuestBackupPayload>;
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.history)) {
        return { success: false, error: "Invalid backup format or unsupported version." };
      }

      // Save imported records
      safeSetItem(STORAGE_KEYS.HISTORY, parsed.history);

      if (parsed.attempts && typeof parsed.attempts === "object" && !Array.isArray(parsed.attempts)) {
        for (const [id, detail] of Object.entries(parsed.attempts)) {
          // Sanitize keys to prevent prototype pollution and arbitrary injection
          if (
            !id ||
            id === "__proto__" ||
            id === "prototype" ||
            id === "constructor" ||
            !/^[a-zA-Z0-9_-]{1,64}$/.test(id)
          ) {
            continue;
          }
          if (detail && typeof detail === "object") {
            safeSetItem(`${STORAGE_KEYS.ATTEMPT_PREFIX}${id}`, detail);
          }
        }
      }

      if (Array.isArray(parsed.mistakeBank)) {
        safeSetItem(STORAGE_KEYS.MISTAKES, parsed.mistakeBank);
      }

      if (Array.isArray(parsed.bookmarks)) {
        safeSetItem(STORAGE_KEYS.BOOKMARKS, parsed.bookmarks);
      }

      if (parsed.streak) {
        safeSetItem(STORAGE_KEYS.STREAK, parsed.streak);
      }

      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Failed to parse backup JSON.",
      };
    }
  }

  public static clearAllGuestData(): void {
    if (!isBrowser()) return;
    try {
      // Find and remove all keys matching cse_guest_* or legacy keys
      const toRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (
          k &&
          (k.startsWith("cse_guest_") ||
            k.startsWith("attempt_") ||
            k === "attempts_history" ||
            k === "mistake_bank" ||
            k === "bookmarked_question_ids")
        ) {
          toRemove.push(k);
        }
      }
      for (const k of toRemove) {
        window.localStorage.removeItem(k);
      }
    } catch {
      // Ignore errors
    }
  }
}
