import { describe, expect, it } from "vitest";
import { getCoachQuip, nextStreak } from "@/features/practice/coach";

describe("nextStreak", () => {
  it("increments on correct answers", () => {
    expect(nextStreak(0, true)).toBe(1);
    expect(nextStreak(4, true)).toBe(5);
  });

  it("resets to zero on a wrong answer", () => {
    expect(nextStreak(3, false)).toBe(0);
    expect(nextStreak(0, false)).toBe(0);
  });
});

describe("getCoachQuip", () => {
  it("returns a deterministic quip for the same seed", () => {
    expect(getCoachQuip("correct", 1)).toBe(getCoachQuip("correct", 1));
    expect(getCoachQuip("wrong", 7)).toBe(getCoachQuip("wrong", 7));
    expect(getCoachQuip("idle", 3)).toBe(getCoachQuip("idle", 3));
  });

  it("returns a non-empty string from every bank for any seed", () => {
    for (let seed = 0; seed < 12; seed++) {
      expect(getCoachQuip("correct", seed).length).toBeGreaterThan(0);
      expect(getCoachQuip("wrong", seed).length).toBeGreaterThan(0);
      expect(getCoachQuip("idle", seed).length).toBeGreaterThan(0);
    }
  });

  it("rotates through the bank as the seed changes", () => {
    const quips = new Set<string>();
    for (let seed = 0; seed < 8; seed++) quips.add(getCoachQuip("correct", seed));
    expect(quips.size).toBeGreaterThan(1);
  });
});
