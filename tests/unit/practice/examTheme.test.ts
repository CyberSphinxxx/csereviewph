import { describe, expect, it } from "vitest";
import { getExamTheme } from "@/features/practice/examTheme";

describe("getExamTheme", () => {
  it("maps low-stakes practice modes to the owl coach theme", () => {
    expect(getExamTheme("practice")).toBe("exam-coach");
    expect(getExamTheme("quick")).toBe("exam-coach");
    expect(getExamTheme("bookmarks")).toBe("exam-coach");
    expect(getExamTheme("mistakes")).toBe("exam-coach");
  });

  it("maps long-form graded modes to the exam hall theme", () => {
    expect(getExamTheme("medium")).toBe("exam-hall");
    expect(getExamTheme("full")).toBe("exam-hall");
  });
});
