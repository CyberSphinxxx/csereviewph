import { describe, it, expect } from "vitest";
import {
  getExamLevelInfo,
  getAllExamLevels,
  prepareExamSession,
} from "@/features/practice/practice-service";

describe("Practice Service — CSE Implementation", () => {
  it("loads all exam levels", () => {
    const levels = getAllExamLevels();
    expect(levels.length).toBe(2);
    expect(levels.map((l) => l.slug)).toEqual(["professional", "subprofessional"]);
  });

  it("loads CSE Professional level and its official subtests", () => {
    const pro = getExamLevelInfo("professional");
    expect(pro).not.toBeNull();
    expect(pro?.name).toBe("Career Service Professional");

    const subjectSlugs = pro?.subjects.map((s) => s.slug);
    expect(subjectSlugs).toContain("verbal-ability");
    expect(subjectSlugs).toContain("numerical-ability");
    expect(subjectSlugs).toContain("analytical-ability");
    expect(subjectSlugs).toContain("general-information");
    expect(subjectSlugs).not.toContain("clerical-ability");
  });

  it("loads CSE Subprofessional level and its clerical subtest", () => {
    const subpro = getExamLevelInfo("subprofessional");
    expect(subpro).not.toBeNull();
    expect(subpro?.name).toBe("Career Service Subprofessional");

    const subjectSlugs = subpro?.subjects.map((s) => s.slug);
    expect(subjectSlugs).toContain("clerical-ability");
    expect(subjectSlugs).not.toContain("analytical-ability");
  });

  it("strictly seeds Analytical Ability only under Professional and Clerical Ability only under Subprofessional", () => {
    const pro = getExamLevelInfo("professional")!;
    const subpro = getExamLevelInfo("subprofessional")!;

    const proSubjects = pro.subjects.map((s) => s.slug);
    const subproSubjects = subpro.subjects.map((s) => s.slug);

    expect(proSubjects).toContain("analytical-ability");
    expect(subproSubjects).not.toContain("analytical-ability");

    expect(subproSubjects).toContain("clerical-ability");
    expect(proSubjects).not.toContain("clerical-ability");
  });

  it("prepares Quick Test session with 10 questions and 10 minutes", () => {
    const { session, questions, rules } = prepareExamSession("professional", "quick");
    expect(session.totalQuestions).toBe(10);
    expect(questions.length).toBe(10);
    expect(rules.timeLimitMinutes).toBe(10);
    expect(session.timer.remainingSeconds).toBe(600);
  });

  it("prepares Medium Test with the honest pool size — never cloned filler to reach 30", () => {
    const { session, questions, rules } = prepareExamSession("professional", "medium");
    // The bank is smaller than 30: an honest session runs every unique
    // question exactly once instead of duplicating items to hit the target.
    const uniqueIds = new Set(questions.map((q) => q.id));
    expect(uniqueIds.size).toBe(questions.length);
    expect(session.totalQuestions).toBe(questions.length);
    expect(questions.length).toBeLessThan(30);
    expect(rules.itemCount).toBe(questions.length);
    expect(rules.timeLimitMinutes).toBe(30);
    expect(session.timer.remainingSeconds).toBe(1800);
  });

  it("prepares Full Test with a single continuous timer and no duplicated items", () => {
    const { session, questions, rules } = prepareExamSession("professional", "full");
    const uniqueIds = new Set(questions.map((q) => q.id));
    expect(uniqueIds.size).toBe(questions.length);
    expect(questions.length).toBeLessThan(170);
    expect(session.totalQuestions).toBe(questions.length);
    expect(rules.timeLimitMinutes).toBe(190);
    expect(rules.hasContinuousTimer).toBe(true);
    expect(session.timer.remainingSeconds).toBe(190 * 60);
  });

  it("never serves the same base question twice within one session", () => {
    for (const mode of ["quick", "medium", "full"] as const) {
      const { questions } = prepareExamSession("professional", mode);
      const ids = questions.map((q) => q.id);
      expect(new Set(ids).size, `mode ${mode} served duplicate questions`).toBe(ids.length);
    }
  });

  it("keeps subprofessional exams free of professional-only subjects", async () => {
    const { SEED_SUBJECTS } = await import("@/db/seed-data");
    const proSubjectIds = new Set(
      SEED_SUBJECTS.filter((s) => s.examLevelId === "level-pro").map((s) => s.id)
    );

    const { questions } = prepareExamSession("subprofessional", "full");
    const leaked = questions.filter((q) => proSubjectIds.has(q.subjectId));
    expect(leaked).toHaveLength(0);
  });

  it("keeps professional exams free of subprofessional-only subjects", async () => {
    const { SEED_SUBJECTS } = await import("@/db/seed-data");
    const subproSubjectIds = new Set(
      SEED_SUBJECTS.filter((s) => s.examLevelId === "level-subpro").map((s) => s.id)
    );

    const { questions } = prepareExamSession("professional", "full");
    const leaked = questions.filter((q) => subproSubjectIds.has(q.subjectId));
    expect(leaked).toHaveLength(0);
  });

  it("prepares Topic Practice session with only the topic's questions without duplicating to 170", () => {
    const { session, questions, rules } = prepareExamSession("professional", "practice", {
      topicId: "top-pro-analogy",
      questionLimit: 10,
    });

    expect(session.totalQuestions).toBeLessThanOrEqual(10);
    expect(questions.length).toBe(session.totalQuestions);
    expect(session.totalQuestions).not.toBe(170);
    // All questions belong strictly to the requested topic
    for (const q of questions) {
      expect(q.topicId).toBe("top-pro-analogy");
    }
    expect(rules.timeLimitMinutes).toBe(15);
  });

  it("ensures all seed questions do not leak [SEED-PLACEHOLDER] in questionText", async () => {
    const { SEED_QUESTIONS } = await import("@/db/seed-data");
    expect(SEED_QUESTIONS.length).toBeGreaterThan(0);
    for (const q of SEED_QUESTIONS) {
      expect(q.questionText).not.toContain("[SEED-PLACEHOLDER]");
      expect(q.questionText).not.toContain("[SEED DATA]");
    }
  });
});
