import { ExamGuidesHub, getExamGuidesHubMetadata } from "@/features/guides/ExamGuidesHub";

export const metadata = getExamGuidesHubMetadata("let");

export default function LetGuidesHubPage() {
  return <ExamGuidesHub examId="let" />;
}
