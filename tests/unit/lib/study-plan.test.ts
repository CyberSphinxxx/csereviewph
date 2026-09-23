import { describe, expect, it } from "vitest";
import {
  addDaysIso,
  dayOfWeekIso,
  daysUntilManila,
  formatManilaDate,
  getManilaTodayString,
  parseManilaDate,
  startOfWeekIso,
} from "@/lib/study-plan";

// A fixed instant where it is 2026-09-21 in Manila (Sun Sep 20 evening UTC).
const NOW = new Date("2026-09-20T18:30:00Z");

describe("getManilaTodayString", () => {
  it("anchors today to Asia/Manila across the UTC boundary", () => {
    expect(getManilaTodayString(NOW)).toBe("2026-09-21");
  });

  it("matches a normal daytime date", () => {
    expect(getManilaTodayString(new Date("2026-09-21T04:00:00Z"))).toBe("2026-09-21");
  });
});

describe("parseManilaDate", () => {
  it("parses a valid ISO date at Manila midnight", () => {
    const d = parseManilaDate("2027-03-14");
    expect(d).not.toBeNull();
    expect(d!.toISOString()).toBe("2027-03-13T16:00:00.000Z");
  });

  it("rejects malformed input", () => {
    expect(parseManilaDate("")).toBeNull();
    expect(parseManilaDate("2027/03/14")).toBeNull();
    expect(parseManilaDate("not-a-date")).toBeNull();
  });

  it("rejects impossible calendar dates", () => {
    expect(parseManilaDate("2027-02-31")).toBeNull();
    expect(parseManilaDate("2027-13-01")).toBeNull();
  });
});

describe("daysUntilManila", () => {
  it("counts whole days to a future exam", () => {
    expect(daysUntilManila("2027-03-14", NOW)).toBe(174);
  });

  it("returns 0 on exam day and negative afterwards", () => {
    expect(daysUntilManila("2026-09-21", NOW)).toBe(0);
    expect(daysUntilManila("2026-09-20", NOW)).toBe(-1);
  });

  it("returns null for invalid dates", () => {
    expect(daysUntilManila("2027-02-31", NOW)).toBeNull();
  });
});

describe("formatManilaDate", () => {
  it("formats long and short forms", () => {
    expect(formatManilaDate("2027-03-14")).toBe("March 14, 2027");
    expect(formatManilaDate("2027-03-14", false)).toBe("Mar 14, 2027");
  });

  it("passes invalid input through unchanged", () => {
    expect(formatManilaDate("oops")).toBe("oops");
  });
});

describe("addDaysIso / dayOfWeekIso / startOfWeekIso", () => {
  it("adds and subtracts days", () => {
    expect(addDaysIso("2026-09-21", 7)).toBe("2026-09-28");
    expect(addDaysIso("2026-09-21", -7)).toBe("2026-09-14");
    expect(addDaysIso("bad", 1)).toBeNull();
  });

  it("computes weekday and week start", () => {
    expect(dayOfWeekIso("2026-09-21")).toBe(1); // Monday
    expect(startOfWeekIso("2026-09-21")).toBe("2026-09-20"); // its Sunday
    expect(startOfWeekIso("2026-09-20")).toBe("2026-09-20");
  });
});
