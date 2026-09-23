import { describe, expect, it } from "vitest";
import {
  PRACTICE_MODES,
  PRACTICE_MODE_GROUPS,
  getEnabledPracticeModes,
  getPracticeMode,
  getPracticeModesByGroup,
} from "@/config/practice-modes";

describe("practice mode catalog", () => {
  it("has unique ids", () => {
    const ids = PRACTICE_MODES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("assigns every mode to a known group", () => {
    const groupIds = new Set(PRACTICE_MODE_GROUPS.map((g) => g.id));
    for (const mode of PRACTICE_MODES) {
      expect(groupIds.has(mode.group), `mode ${mode.id} has unknown group ${mode.group}`).toBe(true);
    }
  });

  it("enabled modes always carry an engine mode and href", () => {
    for (const mode of getEnabledPracticeModes()) {
      expect(mode.engineMode, `${mode.id} missing engineMode`).toBeTruthy();
      expect(mode.href, `${mode.id} missing href`).toBeTruthy();
    }
  });

  it("coming-soon modes never expose an href or engine mode (no fake entries)", () => {
    for (const mode of PRACTICE_MODES.filter((m) => !m.enabled)) {
      expect(mode.engineMode).toBeUndefined();
      expect(mode.href).toBeUndefined();
    }
  });

  it("covers the real feature set as enabled", () => {
    const enabledIds = getEnabledPracticeModes().map((m) => m.id);
    for (const id of ["quick", "medium", "full", "diagnostic", "srs", "mistakes", "bookmarks", "topics"]) {
      expect(enabledIds).toContain(id);
    }
  });

  it("keeps unshipped ideas as coming soon", () => {
    for (const id of ["flashcards", "vocab", "formula-sheets", "custom-builder", "weak-spot", "timed-sprint", "daily-challenge"]) {
      const mode = getPracticeMode(id);
      expect(mode, `${id} missing from catalog`).toBeTruthy();
      expect(mode!.enabled).toBe(false);
    }
  });

  it("filters by group", () => {
    const tests = getPracticeModesByGroup("tests");
    expect(tests.length).toBeGreaterThanOrEqual(4);
    expect(tests.every((m) => m.group === "tests")).toBe(true);
  });

  it("each group has at least one mode", () => {
    for (const g of PRACTICE_MODE_GROUPS) {
      expect(getPracticeModesByGroup(g.id).length, `group ${g.id} empty`).toBeGreaterThan(0);
    }
  });
});
