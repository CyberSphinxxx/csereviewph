import { ExamGuidesHub, getExamGuidesHubMetadata } from "@/features/guides/ExamGuidesHub";

export const metadata = getExamGuidesHubMetadata("cse");

export default function CseGuidesHubPage() {
  return <ExamGuidesHub examId="cse" />;
}
