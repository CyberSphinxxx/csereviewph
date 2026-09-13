import { notFound } from "next/navigation";
import { SEED_TOPICS, SEED_SUBJECTS } from "@/db/seed-data";
import { prepareExamSession } from "@/features/practice/practice-service";
import { ExamRunner } from "@/features/practice/ExamRunner";

export function generateStaticParams() {
  return SEED_TOPICS.map((t) => ({
    topicId: t.id,
  }));
}

export default async function TopicPracticeSessionPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = SEED_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const subject = SEED_SUBJECTS.find((s) => s.id === topic.subjectId);

  // Prepare a practice session for this topic
  const { questions, rules } = prepareExamSession("professional", "practice", {
    topicId: topic.id,
    questionLimit: 10,
  });

  return (
    <ExamRunner
      initialQuestions={questions}
      rules={{
        ...rules,
        mode: "practice",
        timeLimitMinutes: 15, // Comfortable practice timing
      }}
      title={`${topic.name} — Topic Practice`}
      subtitle={`Subject: ${subject?.name || "Civil Service"}`}
    />
  );
}
