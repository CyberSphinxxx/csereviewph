import { describe, it, expect } from "vitest";
import {
  EXAM_CATALOG,
  getAllExams,
  getAvailableExams,
  getExamBySlug,
  getFeaturedExam,
  type ExamAvailability,
} from "@/config/exams";

describe("exams.ts — Central Exam Catalog", () => {
  it("ensures all catalog entries have unique IDs and unique slugs", () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const exam of EXAM_CATALOG) {
      expect(ids.has(exam.id), `Duplicate exam id: ${exam.id}`).toBe(false);
      ids.add(exam.id);

      expect(slugs.has(exam.slug), `Duplicate exam slug: ${exam.slug}`).toBe(false);
      slugs.add(exam.slug);
    }
  });

  it("ensures all exam entries have valid availability statuses", () => {
    const validStatuses: ExamAvailability[] = ["available", "beta", "coming-soon"];

    for (const exam of EXAM_CATALOG) {
      expect(validStatuses).toContain(exam.availability);
      expect(exam.badgeText).toBeDefined();
      expect(exam.badgeText.length).toBeGreaterThan(0);
    }
  });

  it("ensures only available exams expose active live reviewer routes", () => {
    const available = getAvailableExams();
    expect(available.length).toBe(1);
    expect(available[0].id).toBe("cse");
    expect(available[0].availability).toBe("available");
    expect(available[0].href).toBe("/cse");

    const comingSoon = EXAM_CATALOG.filter((exam) => exam.availability === "coming-soon");
    expect(comingSoon.length).toBeGreaterThanOrEqual(4);

    for (const exam of comingSoon) {
      expect(exam.actionLabel).toMatch(/Planned Reviewer|Coming Soon/i);
    }
  });

  it("retrieves exams accurately by slug case-insensitively", () => {
    const cse = getExamBySlug("cse");
    expect(cse).toBeDefined();
    expect(cse?.id).toBe("cse");

    const letExam = getExamBySlug("LET");
    expect(letExam).toBeDefined();
    expect(letExam?.id).toBe("let");

    const missing = getExamBySlug("nonexistent");
    expect(missing).toBeUndefined();
  });

  it("returns CSE as the default featured exam", () => {
    const featured = getFeaturedExam();
    expect(featured).toBeDefined();
    expect(featured.id).toBe("cse");
    expect(featured.levels.length).toBe(2);
    expect(featured.levels.map((l) => l.id)).toEqual(["professional", "subprofessional"]);
  });

  it("ensures all catalog entries have declared issuing agencies and valid levels", () => {
    for (const exam of getAllExams()) {
      expect(exam.agency).toBeDefined();
      expect(exam.agency.length).toBeGreaterThan(3);
      expect(exam.levels.length).toBeGreaterThanOrEqual(1);
      for (const level of exam.levels) {
        expect(level.id).toBeDefined();
        expect(level.name).toBeDefined();
        expect(level.shortName).toBeDefined();
      }
    }
  });

  it("ensures honest and supportable roadmap messaging without misleading claims (RT-01)", () => {
    const cse = getExamBySlug("cse")!;
    expect(cse.description).toMatch(/Independent preparation/i);
    expect(cse.description).not.toMatch(/^Official preparation/i);

    const upcoming = getAllExams().filter((e) => e.availability === "coming-soon");
    for (const exam of upcoming) {
      expect(exam.actionLabel).toBe("Planned Reviewer");
    }
  });

  it("verifies catalog-driven route resolution for available vs coming-soon slugs (RT-02)", () => {
    const activeRouteSlug = "cse";
    const resolved = getExamBySlug(activeRouteSlug);
    expect(resolved).toBeDefined();
    expect(resolved?.availability).toBe("available");
    expect(resolved?.href).toBe("/cse");

    // Upcoming exams exist in catalog but must not be marked as available for live test taking
    const upcomingSlugs = ["let", "nursing", "bfp", "napolcom"];
    for (const slug of upcomingSlugs) {
      const exam = getExamBySlug(slug);
      expect(exam).toBeDefined();
      expect(exam?.availability).toBe("coming-soon");
    }

    // Invalid slug triggers undefined
    expect(getExamBySlug("unknown-exam-slug")).toBeUndefined();
  });
});
