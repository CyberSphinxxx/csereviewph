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

/** Per-strategy explanation shown alongside the plan (Part 2A). */
export interface PlanStrategyExplanation {
  /** What this strategy optimizes for. */
  headline: string;
  /** How this specific plan week was built, mentioning real inputs. */
  why: string;
}

export interface WeeklyPlanInput {
  /** YYYY-MM-DD Manila-anchored today; defaults to real today. */
  today?: string;
  /** YYYY-MM-DD exam date, or empty/none when unset. */
  examDate?: string;
  /**
   * YYYY-MM-DD first day of the learner's study period (the window start).
   * Recorded activity lives in separate history records, so regenerating the
   * plan can never erase it. Currently informational for future windowed
   * pacing; the week grid itself always covers the current real week.
   */
  studyStartDate?: string;
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
  /** Week window covered (Sunday-start; alignment is the caller's concern). */
  weekStart: string;
  days: PlanDay[];
  /** One-line explanation of how the plan was built, shown in the UI. */
  rationale: string;
  /** Deeper per-strategy explanation for the "Why this plan" block. */
  explanation: PlanStrategyExplanation;
  /**
   * Factual state changes the caller can surface as "Plan adjusted" feedback
   * after a regeneration. Derived only from the generated plan itself, never
   * from internal generator state.
   */
  facts: PlanFact[];
}

export interface PlanFact {
  kind: "reviews" | "subjects" | "goal" | "window" | "exam";
  /** Human-readable factual sentence, e.g. "3 review items scheduled first." */
  text: string;
}

export const COLD_START_MIN_SESSIONS = 1;

function sortSubjects(subjects: PlanSubjectInput[]): PlanSubjectInput[] {
  // Weakest first: unmeasured (0 items answered) lack evidence, so they rank
  // after measured subjects but before higher accuracies.
  return [...subjects].sort((a, b) => {
    const aMeasured = a.questionsAnswered > 0;
    const bMeasured = b.questionsAnswered > 0;
    if (aMeasured && bMeasured) return a.accuracy - b.accuracy;
    if (aMeasured !== bMeasured) return aMeasured ? -1 : 1;
    return 0;
  });
}

function pluralize(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/**
 * Generates the 7-day plan for the requested template. Shared behavior:
 * - Cold start (no measured subjects): every template falls back to the same
 *   baseline week alternating quick drills and spaced review.
 * - Past days get a neutral "No activity" planning label; the view derives
 *   real Done status from recorded activity for that calendar date.
 * - Smart: due SRS items take the first active day, then subjects rotate
 *   weakest-first; a final pre-exam week switches to mixed rehearsal.
 * - Balanced: due reviews take the first day when items are due, then one
 *   subject per weekday (unmeasured subjects included so the whole library
 *   gets exposure), mixed review closing the cycle.
 * - Weak-focus: the single lowest measured subject fills most days, one mixed
 *   review day. With zero history it says so explicitly and falls back to a
 *   diagnostic-led baseline week — it never pretends to know a "weakest".
 * - Cram: timed assessments and full mocks dominate; due reviews take the
 *   first day when items are due, lighter drilling fills gaps.
 */
export function generateWeeklyPlan(input: WeeklyPlanInput): WeeklyPlan {
  const today = input.today ?? getManilaTodayString();
  const weekStart = startOfWeekIso(today) ?? today;
  const goal = Math.min(200, Math.max(5, Math.round(input.dailyGoal) || 25));
  const practiceHref = input.practiceHref ?? "/practice";
  const quickHref = input.quickDrillHref ?? "/practice";
  const reviewHref = input.reviewHref ?? "/dashboard/mistakes";
  const mediumHref = input.mediumHref ?? practiceHref;
  const fullMockHref = input.fullMockHref ?? practiceHref;
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

  // Fact helper: only statements derivable from the generated plan itself.
  const facts: PlanFact[] = [];
  const dueCount = Math.max(0, Math.round(input.dueReviewCount) || 0);
  if (dueCount > 0) {
    facts.push({
      kind: "reviews",
      text: `${dueCount} ${pluralize(dueCount, "review item", "review items")} due today moved to the front of the week.`,
    });
  }

  const addGoalFact = (target: number) => {
    facts.push({
      kind: "goal",
      text: `Each study day targets about ${target} ${pluralize(target, "item", "items")}.`,
    });
  };

  if (input.examDate && daysLeft !== null && daysLeft >= 0) {
    facts.push({
      kind: "exam",
      text: `${daysLeft} ${pluralize(daysLeft, "day", "days")} remain until exam day.`,
    });
  }

  // Weak-focus with zero history: say so explicitly instead of inventing a
  // "weakest" subject. Checked BEFORE the generic cold-start fallback so its
  // message is not swallowed by the baseline rationale.
  if (template === "weak-focus" && measured.length === 0) {
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
    facts.push({
      kind: "subjects",
      text: "No measured subjects yet — a diagnostic unlocks weak-subject focus.",
    });
    return {
      isColdStart: true,
      weekStart,
      days,
      rationale:
        "Weak-subject focus needs at least one measured subject to know what to target. Take a diagnostic and this week will concentrate on your lowest subject.",
      explanation: {
        headline: "Not enough data yet",
        why: "Weak-subject focus concentrates on one subject — but nothing has been measured, so there is no lowest subject to pick. Your first diagnostic session unlocks this strategy; this week falls back to a diagnostic-led baseline.",
      },
      facts,
    };
  }

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
    facts.push({
      kind: "subjects",
      text: "No measured subjects yet — a diagnostic starts accuracy-based planning.",
    });
    return {
      isColdStart,
      weekStart,
      days,
      rationale:
        "No measured subjects yet, so this week builds a baseline. Accuracy-based planning starts after your first session.",
      explanation: {
        headline: "Building your baseline",
        why: "Nothing has been measured yet, so every strategy would look identical this week. The fastest way to a real plan is a 10-question diagnostic: after it, Smart, Balanced, Weak-subject focus, and Cram each generate genuinely different weeks.",
      },
      facts,
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
    // Due reviews claim the first active day before the rotation starts.
    const cycle = [...ordered].sort((a, b) => a.subjectId.localeCompare(b.subjectId));
    const upcomingAndToday = days.filter((d) => d.state !== "past");
    let startIdx = 0;
    if (dueCount > 0 && upcomingAndToday.length > 0) {
      upcomingAndToday[0].focus = "Spaced review";
      upcomingAndToday[0].href = reviewHref;
      upcomingAndToday[0].targetItems = Math.min(goal, Math.max(dueCount, 5));
      startIdx = 1;
      addGoalFact(Math.min(goal, Math.max(dueCount, 5)));
    }
    const rotationSlots = upcomingAndToday.slice(startIdx);
    if (cycle.length > 0) {
      rotationSlots.forEach((day, i) => {
        if (i === rotationSlots.length - 1 && rotationSlots.length > 1) {
          day.focus = "Mixed review";
          day.href = reviewHref;
        } else {
          const subject = cycle[i % cycle.length];
          day.focus = `${subject.subjectName} drill`;
          day.href = practiceHref;
        }
      });
    } else {
      rotationSlots.forEach((day) => {
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
      rationale: `Balanced rotation: ${dueCount > 0 ? "spaced review first, then " : ""}one subject a day across ${cycle.length} ${pluralize(cycle.length, "subject", "subjects")} (${subjectsListed}${cycle.length > 3 ? ", and more" : ""}), with a mixed review day to close the cycle.`,
      explanation: {
        headline: "Even coverage across every subject",
        why: `This week gives every subject its own day — measured or not — so no topic quietly drops out of your routine${cycle.length > 0 ? `: ${cycle.slice(0, 3).map((s) => s.subjectName).join(", ")}${cycle.length > 3 ? ", and more" : ""}` : ""}. A mixed review day closes the cycle to keep earlier subjects warm. Choose this when your accuracy is roughly even and you want breadth over depth.`,
      },
      facts,
    };
  }

  if (template === "weak-focus") {
    const weakest = measured.reduce((m, s) => (s.accuracy < m.accuracy ? s : m));
    const upcomingAndToday = days.filter((d) => d.state !== "past");
    let firstIdx = 0;
    if (dueCount > 0 && upcomingAndToday.length > 2) {
      upcomingAndToday[0].focus = "Spaced review";
      upcomingAndToday[0].href = reviewHref;
      firstIdx = 1;
    }
    upcomingAndToday.slice(firstIdx).forEach((day, i, arr) => {
      if (arr.length > 2 && i === arr.length - 1) {
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
      explanation: {
        headline: `Concentrated reps on ${weakest.subjectName}`,
        why: `${weakest.subjectName} is your lowest measured subject at ${weakest.accuracy}%, so most of this week drills it — raising the weakest link lifts your total score fastest. One mixed review day keeps every other subject from cooling off. Choose this when one subject is clearly holding you back.`,
      },
      facts,
    };
  }

  if (template === "cram") {
    const upcomingAndToday = days.filter((d) => d.state !== "past");
    const daysToExam = isFinalWeek;
    let idx = 0;
    if (dueCount > 0 && upcomingAndToday.length > 0) {
      upcomingAndToday[0].focus = "Spaced review";
      upcomingAndToday[0].href = reviewHref;
      idx = 1;
    }
    const rest = upcomingAndToday.slice(idx);
    rest.forEach((day, i) => {
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
          const subject = measured[idx > 0 ? (i + 1) % measured.length : i % measured.length];
          day.focus = `${subject.subjectName} drill`;
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
      explanation: {
        headline: daysToExam ? "Final-week rehearsal" : "Exam-condition training",
        why: daysToExam
          ? "With exam day inside seven days, the plan alternates full mock exams with light review days — nothing new, everything warm. Mocks train pacing across the full paper; light days prevent burnout right before the exam."
          : "Cram mode front-loads timed assessments: full-length timed conditions expose pacing problems early, with targeted drills between assessments to fix exactly what the assessments expose. Choose this when exam day is close or you want pressure training.",
      },
      facts,
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
    : `Built from your weakest subject first (${weakest.subjectName} at ${weakest.accuracy}%), rotating through the rest, with spaced review slotted first because ${input.dueReviewCount} ${pluralize(input.dueReviewCount, "item is", "items are")} due.`;

  facts.push({
    kind: "subjects",
    text: `Leads with ${weakest.subjectName} (${weakest.accuracy}%), your lowest measured subject.`,
  });

  return {
    isColdStart,
    weekStart,
    days,
    rationale,
    explanation: {
      headline: "Weakest subject first",
      why: `Your sessions rank ${weakest.subjectName} lowest at ${weakest.accuracy}%, so it drills first and the rotation continues upward from there. Due spaced reviews always take the first slot — recall beats novelty. In the final week before your exam this strategy switches to mixed rehearsal automatically. Choose this as your day-to-day default.`,
    },
    facts,
  };
}

/** Stable signature for memoization: recompute only when real inputs change.
 *  Route hrefs are included so switching the active exam level (which swaps
 *  /exams/professional/* for /exams/subprofessional/*) recomputes the plan. */
export function weeklyPlanSignature(input: WeeklyPlanInput): string {
  const subj = [...(input.subjects ?? [])]
    .sort((a, b) => a.subjectId.localeCompare(b.subjectId))
    .map((s) => `${s.subjectId}:${s.accuracy}:${s.questionsAnswered}`)
    .join("|");
  return [
    input.today ?? "",
    input.examDate ?? "",
    input.studyStartDate ?? "",
    input.dailyGoal,
    input.dueReviewCount,
    input.template ?? "smart",
    input.practiceHref ?? "",
    input.quickDrillHref ?? "",
    input.reviewHref ?? "",
    input.mediumHref ?? "",
    input.fullMockHref ?? "",
    subj,
  ].join("~");
}
