import type { SubjectReadinessMetric } from "@/lib/storage";

/**
 * Daily quests: a small, deterministic set of 1-3 quests that reset every day
 * (Asia/Manila). This module is PURE: it never touches storage or React. The
 * caller gathers real data and derives progress, so quests can never disagree
 * with the daily-goal ring or the Achievements "Daily goal" badge — all three
 * read the same counters, and no separate quest state exists.
 *
 * Exam-gating is enforced upstream: no workspace, no quests (subject-scoped
 * quests need real exam data to mean anything).
 */

export type DailyQuestKind = "drill" | "score" | "review";

export interface DailyQuest {
  /** Stable per (date, kind, subject): same quest all day, safe as a key. */
  id: string;
  kind: DailyQuestKind;
  title: string;
  detail: string;
  /** Items or reviews needed. For score quests this is the percentage target. */
  target: number;
  /** Progress so far today, clamped to 0..target. */
  progress: number;
  done: boolean;
  subjectId?: string;
  subjectName?: string;
  /** Where the CTA sends the user. */
  href: string;
}

export interface DailyQuestInputs {
  /** Today's ISO date (Asia/Manila), e.g. "2026-09-23". */
  todayIso: string;
  dailyGoal: number;
  /** Real subject accuracy from recorded attempts. */
  readiness: SubjectReadinessMetric[];
  /** subjectId -> items answered today (from today's attempt details). */
  todaySubjectItems: Record<string, number>;
  /** subjectId -> best percentage score today. */
  todayBestSubjectScore: Record<string, number>;
  /** Review-mode items answered today (spaced review, mistake bank, bookmarks). */
  reviewItemsToday: number;
  /** Items currently due for spaced review. */
  dueNow: number;
  /** True when at least one attempt was recorded today. */
  anyAttemptToday: boolean;
  practiceHref: string;
}

const SCORE_TARGET = 75;
const MIN_MEASURED_ITEMS = 5;

function clampProgress(value: number, target: number): number {
  return Math.max(0, Math.min(target, value));
}

/** Subjects with at least a few measured answers, weakest accuracy first. */
function measuredSubjects(readiness: SubjectReadinessMetric[]): SubjectReadinessMetric[] {
  return readiness
    .filter((s) => s.questionsAnswered >= MIN_MEASURED_ITEMS)
    .sort((a, b) => a.accuracyPercentage - b.accuracyPercentage);
}

/**
 * Generates today's quests. Deterministic: identical inputs always produce
 * identical quests, so re-renders and re-visits never reshuffle anything.
 */
export function generateDailyQuests(inputs: DailyQuestInputs): DailyQuest[] {
  const { todayIso, practiceHref } = inputs;
  const subjects = measuredSubjects(inputs.readiness);

  // Cold start (no measured subjects yet): one fixed fallback quest.
  if (subjects.length === 0) {
    const progress = inputs.anyAttemptToday ? 1 : 0;
    return [
      {
        id: `${todayIso}:drill:any`,
        kind: "drill",
        title: "Complete a quick drill",
        detail: "Answer any set of questions so I can learn your strengths.",
        target: 1,
        progress,
        done: progress >= 1,
        href: practiceHref,
      },
    ];
  }

  const quests: DailyQuest[] = [];
  const weakest = subjects[0];
  const drillTarget = Math.max(5, Math.min(20, Math.round(inputs.dailyGoal / 2)));

  // 1. Weakest-subject drill (same signal the Study plan ranks by).
  const drillProgress = inputs.todaySubjectItems[weakest.subjectId] ?? 0;
  quests.push({
    id: `${todayIso}:drill:${weakest.subjectId}`,
    kind: "drill",
    title: `Answer ${drillTarget} items in ${weakest.subjectName}`,
    detail: `${weakest.subjectName} is your lowest subject right now.`,
    target: drillTarget,
    progress: clampProgress(drillProgress, drillTarget),
    done: drillProgress >= drillTarget,
    subjectId: weakest.subjectId,
    subjectName: weakest.subjectName,
    href: practiceHref,
  });

  // 2. Due reviews (only when the spaced-repetition pool actually has items).
  if (inputs.dueNow > 0) {
    quests.push({
      id: `${todayIso}:review:any`,
      kind: "review",
      title: `Clear your ${inputs.dueNow} due review${inputs.dueNow === 1 ? "" : "s"}`,
      detail: "Spaced review keeps past mistakes from coming back.",
      target: inputs.dueNow,
      progress: clampProgress(inputs.reviewItemsToday, inputs.dueNow),
      done: inputs.reviewItemsToday >= inputs.dueNow,
      href: "/dashboard/review",
    });
  }

  // 3. Score quest on the weakest subject that is still below target.
  const scoreCandidate = subjects.find(
    (s) => s.accuracyPercentage < SCORE_TARGET && (inputs.todayBestSubjectScore[s.subjectId] ?? 0) < SCORE_TARGET
  );
  if (scoreCandidate) {
    const best = inputs.todayBestSubjectScore[scoreCandidate.subjectId] ?? 0;
    quests.push({
      id: `${todayIso}:score:${scoreCandidate.subjectId}`,
      kind: "score",
      title: `Score ${SCORE_TARGET}% or higher in ${scoreCandidate.subjectName}`,
      detail: "Beat it once today and the quest is yours.",
      target: SCORE_TARGET,
      progress: clampProgress(best, SCORE_TARGET),
      done: best >= SCORE_TARGET,
      subjectId: scoreCandidate.subjectId,
      subjectName: scoreCandidate.subjectName,
      href: practiceHref,
    });
  }

  return quests.slice(0, 3);
}

/** Summary line for compact surfaces: "2 of 3 quests · 15/25 items today". */
export function questSummaryLine(quests: DailyQuest[], itemsToday: number, dailyGoal: number): string {
  const done = quests.filter((q) => q.done).length;
  const items = Math.min(itemsToday, dailyGoal);
  return `${done} of ${quests.length} quests · ${items}/${dailyGoal} items today`;
}
