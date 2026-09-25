import { notFound } from "next/navigation";
import { SEED_LEVELS } from "@/db/seed-data";
import { prepareExamSession } from "@/features/practice/practice-service";
import { ExamRunner } from "@/features/practice/ExamRunner";

export function generateStaticParams() {
  return SEED_LEVELS.map((lvl) => ({
    level: lvl.slug,
  }));
}

export default async function QuickTestPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const examLevel = SEED_LEVELS.find((l) => l.slug === level);

  if (!examLevel) {
    notFound();
  }

  const { questions, rules } = prepareExamSession(level, "quick", {
    questionLimit: 10,
  });

  return (
    <ExamRunner
      initialQuestions={questions}
      rules={{ ...rules, itemCount: questions.length }}
      title={`${examLevel.name} — Quick Diagnostic Test`}
      subtitle={`${questions.length} questions • 10 minutes • Immediate score and concept explanations`}
    />
  );
}
