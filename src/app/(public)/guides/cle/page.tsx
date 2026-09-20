import { ExamGuidesHub, getExamGuidesHubMetadata } from "@/features/guides/ExamGuidesHub";

export const metadata = getExamGuidesHubMetadata("cle");

export default function CleGuidesHubPage() {
  return <ExamGuidesHub examId="cle" />;
}
