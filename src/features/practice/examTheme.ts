import type { ExamMode } from "@/features/exam-engine";

/**
 * View-layer theme for the exam runner.
 *
 * "exam-hall"  — formal, graded-assessment chrome (long-form / timed mocks).
 * "exam-coach" — mascot-guided chrome for low-stakes practice and drills.
 *
 * This is presentation only. The exam engine never reads the theme; only the
 * view components do, so there is no exam-specific branching in the engine.
 */
export type ExamTheme = "exam-hall" | "exam-coach";

/** Modes where the owl may react: low-stakes learning and drill contexts. */
const COACH_MODES: ReadonlySet<ExamMode> = new Set<ExamMode>([
  "practice",
  "quick",
  "bookmarks",
  "mistakes",
]);

export function getExamTheme(mode: ExamMode): ExamTheme {
  return COACH_MODES.has(mode) ? "exam-coach" : "exam-hall";
}
