import { addDaysIso, daysUntilManila, getManilaTodayString, startOfWeekIso } from "./study-plan";
import type { PlanTemplateId } from "@/config/study-plan-templates";

/**
 * Rule-based weekly study plan generator.
 *
 * Pure function: same inputs always produce the same plan. Inputs are real
 * user data (subject accuracies, daily goal, exam date, due SRS count);
 * nothing is hardcoded per user and nothing is random. Computation is O(n)
 * over subjects so it is cheap to run client-side, and callers are expected
 * to memoize on an input signature rather than re-run per render.
 */

export interface PlanSubjectInput {
  subjectId: string;
  subjectName: string;
  /** Measured accuracy percentage (0-100). */
  accuracy: number;
  /** Items answered for this subject; 0 means unmeasured. */
  questionsAnswered: number;
}

export interface PlanDay {
  iso: string;
  /** 0 = Sunday ... 6 = Saturday */
  dayOfWeek: number;
  /** Primary focus line, e.g. "Numerical Ability drill". */
  focus: string;
  /** Suggested item count for the day. */
  targetItems: number;
  /** Human state derived from real activity data by the caller. */
  state: "past" | "today" | "upcoming";
  /** Optional action href for today's focus. */
  href?: string;
}

export interface WeeklyPlanInput {
  /** YYYY-MM-DD Manila-anchored today; defaults to real today. */
  today?: string;
  /** YYYY-MM-DD exam date, or empty/none when unset. */
  examDate?: string;
  /** Daily goal in items (already clamped 5-200). */
  dailyGoal: number;
  /** Per-subject accuracy from real sessions. */
  subjects: PlanSubjectInput[];
  /** Number of SRS items currently due. */
  dueReviewCount: number;
  /** Weekly template selection. Defaults to "smart". */
  template?: PlanTemplateId;
  /** Route used for subject drills. */
  practiceHref?: string;
  /** Route used for quick drills (new users). */
  quickDrillHref?: string;
  /** Route used for spaced review. */
  reviewHref?: string;
  /** Route used for timed medium assessments (cram mode). */
  mediumHref?: string;
  /** Route used for full mock exams (cram mode). */
  fullMockHref?: string;
}

export interface WeeklyPlan {
  /** True when there is not enough history for accuracy-based ordering. */
  isColdStart: boolean;
  /** Week window covered (Monday..Sunday per site preference is caller's concern; grid is Sun-Sat). */
  weekStart: string;
  days: PlanDay[];
  /** One-line explanation of how the plan was built, shown in the UI. */
  rationale: string;
}

export const COLD_START_MIN_SESSIONS = 1;

function sortSubjects(subjects: PlanSubjectInput[]): PlanSubjectInput[] {
  // Weakest first: unmeasured (0 items answered) count as least-known and
  // come before measured low scores? No: they lack evidence, so they rank
  // after measured subjects but before higher accuracies.
  return [...subjects].sort((a, b) => {
    const aMeasured = a.questionsAnswered > 0;
    const bMeasured = b.questionsAnswered > 0;
    if (aMeasured && bMeasured) return a.accuracy - b.accuracy;
    if (aMeasured !== bMeasured) return aMeasured ? -1 : 1;
    return 0;
  });
}

/**
 * Generates the 7-day plan for the requested template. Shared behavior:
 * - Cold start (no measured subjects): every template falls back to the same
 *   baseline week alternating quick drills and spaced review.
 * - Past days get a neutral "No activity" planning label; the view derives
 *   real Done status from recorded activity for that calendar date.
 * - Smart: due SRS items take the first active day, then subjects rotate
 *   weakest-first; a final pre-exam week switches to mixed rehearsal.
 * - Balanced: one subject per weekday (unmeasured subjects included so the
 *   whole library gets exposure), mixed review on the last day of the cycle.
 * - Weak-focus: the single lowest measured subject fills most days, one mixed
 *   review day. If nothing is measured, cold-start fallback applies.
 * - Cram: timed assessments and full mocks dominate, lighter drilling.
 */
export function generateWeeklyPlan(input: WeeklyPlanInput): WeeklyPlan {
  const today = input.today ?? getManilaTodayString();
  const weekStart = startOfWeekIso(today) ?? today;
  const goal = Math.min(200, Math.max(5, Math.round(input.dailyGoal) || 25));
  const practiceHref = input.practiceHref ?? "/practice";
  const quickHref = input.quickDrillHref ?? "/exams/professional/quick";
  const reviewHref = input.reviewHref ?? "/dashboard/mistakes";
  const mediumHref = input.mediumHref ?? "/exams/professional/medium";
  const fullMockHref = input.fullMockHref ?? "/exams/professional/full";
  const template: PlanTemplateId = input.template ?? "smart";

  const measured = input.subjects.filter((s) => s.questionsAnswered > 0);
  const isColdStart = measured.length === 0;
  const ordered = sortSubjects(input.subjects);

  const daysLeft = input.examDate ? daysUntilManila(input.examDate, new Date(`${today}T00:00:00+08:00`)) : null;
  const isFinalWeek = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  const focusFor = (i: number): PlanDay => {
    const iso = addDaysIso(weekStart, i) ?? today;
    const state: PlanDay["state"] = iso < today ? "past" : iso === today ? "today" : "upcoming";
    return { iso, dayOfWeek: i, focus: "", targetItems: goal, state };
  };

  const days: PlanDay[] = Array.from({ length: 7 }, (_, i) => focusFor(i));

  if (isColdStart) {
    for (const day of days) {
      if (day.state === "past") {
        day.focus = "No activity";
        day.targetItems = 0;
      } else if (day.state === "today") {
        day.focus = "Quick diagnostic drill";
        day.href = quickHref;
      } else {
        day.focus = day.dayOfWeek % 2 === 0 ? "Quick drill" : "Spaced review warm-up";
        day.href = day.dayOfWeek % 2 === 0 ? quickHref : reviewHref;
      }
    }
    return {
      isColdStart,
      weekStart,
      days,
      rationale:
        "No measured subjects yet, so this week builds a baseline. Accuracy-based planning starts after your first session.",
    };
  }

  // Neutral planning label for past days; never claim "Done" without activity data.
  for (const day of days) {
    if (day.state === "past") {
      day.focus = "No activity";
      day.targetItems = 0;
    }
  }

  if (template === "balanced") {
    // One subject per weekday across the full library, measured or not.
    const cycle = [...ordered].sort((a, b) =>
      a.subjectId.localeCompare(b.subjectId)
    );
    const upcomingAndToday = days.filter((d) => d.state !== "past");
    if (cycle.length > 0) {
      upcomingAndToday.forEach((day, i) => {
        if (i === upcomingAndToday.length - 1) {
          day.focus = "Mixed review";
          day.href = reviewHref;
        } else {
          const subject = cycle[i % cycle.length];
          day.focus = `${subject.subjectName} drill`;
          day.href = practiceHref;
        }
      });
    } else {
      upcomingAndToday.forEach((day) => {
        day.focus = "Mixed review";
        day.href = reviewHref;
      });
    }
    const subjectsListed = cycle
      .slice(0, 3)
      .map((s) => s.subjectName)
      .join(", ");
    return {
      isColdStart,
      weekStart,
      days,
      rationale: `Balanced rotation: one subject a day across ${cycle.length} ${cycle.length === 1 ? "subject" : "subjects"} (${subjectsListed}${cycle.length > 3 ? ", and more" : ""}), with a mixed review day to close the cycle.`,
    };
  }

  if (template === "weak-focus") {
    const weakest = measured.reduce((m, s) => (s.accuracy < m.accuracy ? s : m));
    const upcomingAndToday = days.filter((d) => d.state !== "past");
    upcomingAndToday.forEach((day, i) => {
      if (upcomingAndToday.length > 2 && i === upcomingAndToday.length - 1) {
        day.focus = "Mixed review";
        day.href = reviewHref;
      } else {
        day.focus = `${weakest.subjectName} drill`;
        day.href = practiceHref;
      }
    });
    return {
      isColdStart,
      weekStart,
      days,
      rationale: `Weak-subject focus: this week centers on ${weakest.subjectName} (currently ${weakest.accuracy}%), with one mixed review day to keep everything else warm.`,
    };
  }

  if (template === "cram") {
    const upcomingAndToday = days.filter((d) => d.state !== "past");
    const daysToExam = isFinalWeek;
    upcomingAndToday.forEach((day, i) => {
      if (daysToExam) {
        // Final week: alternate full mocks with light spaced review.
        if (i % 2 === 0) {
          day.focus = "Full mock exam";
          day.href = fullMockHref;
          day.targetItems = goal;
        } else {
          day.focus = "Light review";
          day.href = reviewHref;
          day.targetItems = Math.max(5, Math.round(goal / 2));
        }
      } else {
        // Exam not imminent: assessments lead, drills fill the gaps.
        if (i % 3 === 2) {
          day.focus = `${measured[i % measured.length].subjectName} drill`;
          day.href = practiceHref;
        } else {
          day.focus = "Timed assessment";
          day.href = mediumHref;
        }
      }
    });
    return {
      isColdStart,
      weekStart,
      days,
      rationale: daysToExam
        ? "Cram mode in the final week: full mock exams alternating with light review days, nothing new, everything warm."
        : "Cram mode: timed assessments lead the week with targeted drills in between.",
    };
  }

  // template === "smart" (default)
  const rotation = ordered.filter((s) => s.questionsAnswered > 0);

  let rotationIndex = 0;
  let reviewAssigned = false;
  for (const day of days) {
    if (day.state === "past") {
      continue;
    }
    if (!reviewAssigned && input.dueReviewCount > 0) {
      day.focus = "Spaced review";
      day.targetItems = Math.min(goal, Math.max(input.dueReviewCount, 5));
      day.href = reviewHref;
      reviewAssigned = true;
      continue;
    }
    if (isFinalWeek) {
      day.focus = "Mixed rehearsal";
      day.href = quickHref;
      continue;
    }
    const subject = rotation[rotationIndex % rotation.length];
    rotationIndex += 1;
    day.focus = `${subject.subjectName} drill`;
    day.href = practiceHref;
  }

  const weakest = rotation[0];
  const rationale = isFinalWeek
    ? "Final week before your exam: mixed rehearsal keeps every subject warm without introducing new material."
    : `Built from your weakest subject first (${weakest.subjectName} at ${weakest.accuracy}%), rotating through the rest, with spaced review slotted first because ${input.dueReviewCount} ${input.dueReviewCount === 1 ? "item is" : "items are"} due.`;

  return { isColdStart, weekStart, days, rationale };
}

/** Stable signature for memoization: recompute only when real inputs change. */
export function weeklyPlanSignature(input: WeeklyPlanInput): string {
  const subj = [...input.subjects]
    .sort((a, b) => a.subjectId.localeCompare(b.subjectId))
    .map((s) => `${s.subjectId}:${s.accuracy}:${s.questionsAnswered}`)
    .join("|");
  return [
    input.today ?? "",
    input.examDate ?? "",
    input.dailyGoal,
    input.dueReviewCount,
    input.template ?? "smart",
    subj,
  ].join("~");
}
