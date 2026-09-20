import { ExamGuidesHub, getExamGuidesHubMetadata } from "@/features/guides/ExamGuidesHub";

export const metadata = getExamGuidesHubMetadata("nursing");

export default function NursingGuidesHubPage() {
  return <ExamGuidesHub examId="nursing" />;
}
