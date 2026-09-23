/**
 * Owl-coach reaction logic: streak tracking and deterministic Taglish quips.
 * Pure functions only — no React, no DOM.
 */

export type CoachQuipKind = "correct" | "wrong" | "idle";

export function nextStreak(prevStreak: number, isCorrect: boolean): number {
  return isCorrect ? prevStreak + 1 : 0;
}

/** Quips are short Taglish encouragement lines, written fresh for this project. */
const CORRECT_QUIPS = [
  "Ayos! Tama ’yan.",
  "Galing! Tuloy mo ’yan.",
  "Tama! Nasa momentum ka na.",
  "Korek — ang galing mo!",
] as const;

const WRONG_QUIPS = [
  "Oops — okay lang ’yan!",
  "Hindi ’yan, pero kaya mo sa next.",
  "Mali nga — pero heto ang bakit:",
  "Halos! Basahin ang paliwanag:",
] as const;

const IDLE_QUIPS = [
  "Kalmado lang — isa-isa ’yan.",
  "Isipin nang mabuti, nandito lang ako.",
  "Take your time, bantay na bantay ako.",
  "Basahin mabuti — kaya mo ’yan!",
] as const;

/**
 * Deterministic pick so tests and UI stay stable: same seed → same quip.
 * Seed with anything stable per question (e.g. the question id hash).
 */
export function getCoachQuip(kind: CoachQuipKind, seed: number): string {
  const bank =
    kind === "correct" ? CORRECT_QUIPS : kind === "wrong" ? WRONG_QUIPS : IDLE_QUIPS;
  const idx = Math.abs(Math.floor(seed)) % bank.length;
  return bank[idx]!;
}
