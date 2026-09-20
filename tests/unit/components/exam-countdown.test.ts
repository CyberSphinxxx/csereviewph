import { describe, it, expect } from "vitest";
import { getExamCountdown } from "@/lib/date-utils";

describe("ExamCountdown date calculations", () => {
  it("formats future dates with countdown day count", () => {
    const base = new Date("2027-03-01T12:00:00");
    const result = getExamCountdown("2027-03-14", base);

    expect(result.days).toBe(13);
    expect(result.isPast).toBe(false);
    expect(result.isToday).toBe(false);
    expect(result.label).toBe("13 days until the exam");
    expect(result.formattedDate).toBe("March 14, 2027");
  });

  it("handles 1 day until exam accurately with singular form", () => {
    const base = new Date("2027-03-13T10:00:00");
    const result = getExamCountdown("2027-03-14", base);

    expect(result.days).toBe(1);
    expect(result.isPast).toBe(false);
    expect(result.isToday).toBe(false);
    expect(result.label).toBe("1 day until the exam");
  });

  it("handles exam day accurately (isToday)", () => {
    const base = new Date("2027-03-14T08:30:00");
    const result = getExamCountdown("2027-03-14", base);

    expect(result.days).toBe(0);
    expect(result.isPast).toBe(false);
    expect(result.isToday).toBe(true);
    expect(result.label).toBe("Exam is today");
  });

  it("handles past dates gracefully", () => {
    const base = new Date("2027-03-15T09:00:00");
    const result = getExamCountdown("2027-03-14", base);

    expect(result.days).toBe(0);
    expect(result.isPast).toBe(true);
    expect(result.isToday).toBe(false);
    expect(result.label).toBe("Exam date passed, check the new schedule");
  });
});
