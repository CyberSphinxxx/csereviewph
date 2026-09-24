import { describe, expect, it } from "vitest";
import {
  generateWeeklyPlan,
  weeklyPlanSignature,
  type PlanSubjectInput,
} from "@/lib/study-plan-generator";
import { PLAN_TEMPLATES } from "@/config/study-plan-templates";

const base = {
  today: "2026-09-21", // a Monday
  examDate: "2027-03-14",
  dailyGoal: 25,
  dueReviewCount: 0,
};

const subjects: PlanSubjectInput[] = [
  { subjectId: "verbal", subjectName: "Verbal Ability", accuracy: 72, questionsAnswered: 40 },
  { subjectId: "numerical", subjectName: "Numerical Ability", accuracy: 41, questionsAnswered: 40 },
  { subjectId: "analytical", subjectName: "Analytical Ability", accuracy: 58, questionsAnswered: 30 },
  { subjectId: "geninfo", subjectName: "General Information", accuracy: 0, questionsAnswered: 0 },
];

describe("generateWeeklyPlan", () => {
  it("produces 7 days aligned to the Sunday-start week", () => {
    const plan = generateWeeklyPlan({ ...base, subjects });
    expect(plan.days).toHaveLength(7);
    expect(plan.weekStart).toBe("2026-09-20");
    expect(plan.days[0].dayOfWeek).toBe(0);
    expect(plan.days[6].dayOfWeek).toBe(6);
  });

  it("is deterministic for identical inputs", () => {
    const a = generateWeeklyPlan({ ...base, subjects });
    const b = generateWeeklyPlan({ ...base, subjects });
    expect(a.days.map((d) => d.focus)).toEqual(b.days.map((d) => d.focus));
  });

  it("schedules due SRS review on the first active day", () => {
    const plan = generateWeeklyPlan({ ...base, subjects, dueReviewCount: 11 });
    const active = plan.days.filter((d) => d.state !== "past");
    expect(active[0].focus).toBe("Spaced review");
    expect(active[0].targetItems).toBe(11);
    expect(active[0].href).toBe("/dashboard/mistakes");
  });

  it("orders focus weakest-first and rotates", () => {
    const plan = generateWeeklyPlan({ ...base, subjects });
    const drills = plan.days.map((d) => d.focus).filter((f) => f.endsWith("drill"));
    expect(drills[0]).toBe("Numerical Ability drill"); // 41%, weakest measured
    expect(drills[1]).toBe("Analytical Ability drill"); // 58%
    expect(drills[2]).toBe("Verbal Ability drill"); // 72%
    expect(drills[3]).toBe("Numerical Ability drill"); // rotation wraps
  });

  it("skips unmeasured subjects in the drill rotation", () => {
    const plan = generateWeeklyPlan({ ...base, subjects });
    const drills = plan.days.map((d) => d.focus).filter((f) => f.endsWith("drill"));
    for (const f of drills) {
      expect(f).not.toContain("General Information");
    }
  });

  it("cold start: no measured subjects produces baseline plan", () => {
    const plan = generateWeeklyPlan({
      ...base,
      subjects: [{ ...subjects[0], questionsAnswered: 0, accuracy: 0 }],
    });
    expect(plan.isColdStart).toBe(true);
    expect(plan.days[1].focus).toBe("Quick diagnostic drill"); // today
    expect(plan.rationale).toMatch(/baseline/i);
  });

  it("final week switches to mixed rehearsal", () => {
    const plan = generateWeeklyPlan({
      ...base,
      today: "2027-03-09",
      examDate: "2027-03-14",
      subjects,
    });
    const active = plan.days.filter((d) => d.state !== "past");
    for (const day of active.slice(1)) {
      expect(day.focus).toBe("Mixed rehearsal");
    }
  });

  it("past days get a neutral planning label, never a completion claim", () => {
    const plan = generateWeeklyPlan({ ...base, today: "2026-09-23", subjects });
    expect(plan.days[0].state).toBe("past");
    expect(plan.days[0].focus).toBe("No activity");
    expect(plan.days[0].targetItems).toBe(0);
  });

  it("accepts every configured template id", () => {
    for (const t of PLAN_TEMPLATES) {
      const plan = generateWeeklyPlan({ ...base, subjects, template: t.id });
      expect(plan.days).toHaveLength(7);
      expect(plan.days.every((d) => d.focus.length > 0)).toBe(true);
    }
  });

  it("balanced rotation gives each subject its own day and closes with mixed review", () => {
    const plan = generateWeeklyPlan({ ...base, subjects, template: "balanced" });
    const active = plan.days.filter((d) => d.state !== "past");
    const focuses = active.map((d) => d.focus);
    // Each measured subject appears at most once before the closing review day
    expect(focuses[0]).toBe("Analytical Ability drill");
    expect(focuses[1]).toBe("General Information drill");
    expect(focuses[2]).toBe("Numerical Ability drill");
    expect(focuses[3]).toBe("Verbal Ability drill");
    expect(focuses[focuses.length - 1]).toBe("Mixed review");
  });

  it("weak-focus concentrates on the single lowest subject", () => {
    const plan = generateWeeklyPlan({ ...base, subjects, template: "weak-focus" });
    const active = plan.days.filter((d) => d.state !== "past");
    const drillDays = active.filter((d) => d.focus === "Numerical Ability drill").length;
    expect(drillDays).toBe(active.length - 1); // every day except the closing mixed review
    expect(active[active.length - 1].focus).toBe("Mixed review");
  });

  it("cram mode schedules timed assessments away from the exam and mocks in the final week", () => {
    const far = generateWeeklyPlan({ ...base, subjects, template: "cram" });
    const farActive = far.days.filter((d) => d.state !== "past");
    expect(farActive[0].focus).toBe("Timed assessment");
    expect(farActive.some((d) => d.focus === "Timed assessment")).toBe(true);

    const near = generateWeeklyPlan({
      ...base,
      today: "2027-03-09",
      examDate: "2027-03-14",
      subjects,
      template: "cram",
    });
    const nearActive = near.days.filter((d) => d.state !== "past");
    expect(nearActive[0].focus).toBe("Full mock exam");
    expect(nearActive[1].focus).toBe("Light review");
  });

  it("non-smart templates fall back to the cold-start baseline with no data", () => {
    for (const t of PLAN_TEMPLATES.filter((x) => x.id !== "smart" && x.id !== "weak-focus")) {
      const plan = generateWeeklyPlan({
        ...base,
        subjects: [{ ...subjects[0], questionsAnswered: 0, accuracy: 0 }],
        template: t.id,
      });
      expect(plan.isColdStart).toBe(true);
      expect(plan.rationale).toMatch(/baseline/i);
    }
  });

  it("clamps the daily goal into range", () => {
    const plan = generateWeeklyPlan({ ...base, subjects, dailyGoal: 5000 });
    expect(plan.days[2].targetItems).toBe(200);
  });

  it("handles missing exam date without crashing", () => {
    const plan = generateWeeklyPlan({ ...base, examDate: undefined, subjects });
    expect(plan.days).toHaveLength(7);
    expect(plan.rationale).toMatch(/Numerical/);
  });
});

describe("weeklyPlanSignature", () => {
  it("changes only when real inputs change", () => {
    const sigA = weeklyPlanSignature({ ...base, subjects, dueReviewCount: 3 });
    const sigB = weeklyPlanSignature({ ...base, subjects, dueReviewCount: 3 });
    expect(sigA).toBe(sigB);

    const sigC = weeklyPlanSignature({ ...base, subjects, dueReviewCount: 4 });
    expect(sigC).not.toBe(sigA);

    const sigT = weeklyPlanSignature({ ...base, subjects, template: "balanced" });
    expect(sigT).not.toBe(sigA);

    const changedAccuracy = subjects.map((s) =>
      s.subjectId === "verbal" ? { ...s, accuracy: 73 } : s
    );
    const sigD = weeklyPlanSignature({ ...base, subjects: changedAccuracy, dueReviewCount: 3 });
    expect(sigD).not.toBe(sigA);
  });
});
