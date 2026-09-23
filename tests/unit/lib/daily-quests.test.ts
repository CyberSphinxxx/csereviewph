import { describe, expect, it } from "vitest";
import { generateDailyQuests, questSummaryLine, type DailyQuestInputs } from "@/lib/daily-quests";
import type { SubjectReadinessMetric } from "@/lib/storage";

function readiness(
  subjectId: string,
  subjectName: string,
  accuracy: number,
  answered = 20
): SubjectReadinessMetric {
  return {
    subjectId,
    subjectName,
    subjectSlug: subjectName.toLowerCase().replace(/\s+/g, "-"),
    questionsAnswered: answered,
    correctCount: Math.round((accuracy / 100) * answered),
    accuracyPercentage: accuracy,
  };
}

function baseInputs(overrides: Partial<DailyQuestInputs> = {}): DailyQuestInputs {
  return {
    todayIso: "2026-09-23",
    dailyGoal: 25,
    readiness: [readiness("verbal", "Verbal Ability", 62), readiness("numerical", "Numerical Ability", 78)],
    todaySubjectItems: {},
    todayBestSubjectScore: {},
    reviewItemsToday: 0,
    dueNow: 0,
    anyAttemptToday: false,
    practiceHref: "/dashboard/practice",
    ...overrides,
  };
}

describe("generateDailyQuests", () => {
  it("gives a brand-new user exactly one fixed generic quest, done only after activity", () => {
    const quests = generateDailyQuests(baseInputs({ readiness: [] }));
    expect(quests).toHaveLength(1);
    expect(quests[0].title).toBe("Complete a quick drill");
    expect(quests[0].done).toBe(false);

    const doneQuests = generateDailyQuests(baseInputs({ readiness: [], anyAttemptToday: true }));
    expect(doneQuests[0].done).toBe(true);
  });

  it("targets the weakest measured subject first, from real accuracy data", () => {
    const quests = generateDailyQuests(baseInputs());
    const drill = quests.find((q) => q.kind === "drill");
    expect(drill).toBeDefined();
    expect(drill!.subjectName).toBe("Verbal Ability"); // 62% < 78%
    expect(drill!.target).toBe(13); // clamp(goal/2, 5..20) = 12.5 -> 13
    expect(drill!.progress).toBe(0);
  });

  it("ignores subjects with too little data instead of faking weakness", () => {
    const quests = generateDailyQuests(
      baseInputs({
        readiness: [
          readiness("tiny", "Barely Measured Subject", 10, 2), // only 2 items: not measured
          readiness("solid", "Numerical Ability", 78),
        ],
      })
    );
    expect(quests.some((q) => q.subjectName === "Barely Measured Subject")).toBe(false);
  });

  it("adds a review quest only when items are actually due, and completes it", () => {
    const withoutDue = generateDailyQuests(baseInputs());
    expect(withoutDue.some((q) => q.kind === "review")).toBe(false);

    const withDue = generateDailyQuests(baseInputs({ dueNow: 4, reviewItemsToday: 2 }));
    const review = withDue.find((q) => q.kind === "review");
    expect(review).toBeDefined();
    expect(review!.target).toBe(4);
    expect(review!.progress).toBe(2);
    expect(review!.done).toBe(false);

    const cleared = generateDailyQuests(baseInputs({ dueNow: 4, reviewItemsToday: 4 }));
    expect(cleared.find((q) => q.kind === "review")!.done).toBe(true);
  });

  it("adds a score quest on a below-target subject and completes it after the score is beaten", () => {
    const active = generateDailyQuests(baseInputs());
    const score = active.find((q) => q.kind === "score");
    expect(score).toBeDefined();
    expect(score!.subjectName).toBe("Verbal Ability"); // 62% < 75%

    const beaten = generateDailyQuests(
      baseInputs({ todayBestSubjectScore: { verbal: 80 } })
    );
    expect(beaten.some((q) => q.kind === "score")).toBe(false);
  });

  it("never exceeds three quests and is deterministic for identical inputs", () => {
    const inputs = baseInputs({ dueNow: 6, reviewItemsToday: 1 });
    const first = generateDailyQuests(inputs);
    const second = generateDailyQuests(inputs);
    expect(first.length).toBeLessThanOrEqual(3);
    expect(first.map((q) => q.id)).toEqual(second.map((q) => q.id));
  });

  it("builds a compact summary line that shares the daily-goal totals", () => {
    const quests = generateDailyQuests(baseInputs({ dueNow: 2, reviewItemsToday: 2 }));
    // drill 0/1 done, review done, score not done -> 1 of 3
    expect(questSummaryLine(quests, 15, 25)).toBe("1 of 3 quests · 15/25 items today");
  });
});
