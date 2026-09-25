import { notFound } from "next/navigation";
import { SEED_LEVELS } from "@/db/seed-data";
import { prepareExamSession } from "@/features/practice/practice-service";
import { ExamRunner } from "@/features/practice/ExamRunner";

export function generateStaticParams() {
  return SEED_LEVELS.map((lvl) => ({
    level: lvl.slug,
  }));
}

export default async function FullMockExamPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const examLevel = SEED_LEVELS.find((l) => l.slug === level);

  if (!examLevel) {
    notFound();
  }

  // Full Mock Exam uses exact real CSE-PPT allotments
  const isPro = level === "professional";
  const targetItemCount = isPro ? 170 : 165;
  const timeLimitMinutes = isPro ? 190 : 160; // 3h10m (190m) Pro, 2h40m (160m) Subpro

  const { questions, rules } = prepareExamSession(level, "full", {
    questionLimit: targetItemCount,
  });

  // An insufficient bank yields an honest, clearly labeled shorter session —
  // never duplicated filler presented as a complete exam.
  const shortened = questions.length < targetItemCount;

  return (
    <ExamRunner
      initialQuestions={questions}
      rules={{
        ...rules,
        itemCount: questions.length,
        timeLimitMinutes,
      }}
      title={`${examLevel.name} — Full Mock Exam`}
      subtitle={
        shortened
          ? `Honest practice: ${questions.length} of ${targetItemCount} items available — the full bank is still being written. Timer: ${Math.floor(timeLimitMinutes / 60)}h ${timeLimitMinutes % 60}m.`
          : `${targetItemCount} items • ${Math.floor(timeLimitMinutes / 60)}h ${timeLimitMinutes % 60}m continuous single timer • Real CSE-PPT Simulation`
      }
    />
  );
}
