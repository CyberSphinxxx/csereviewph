import { ExamGuidesHub, getExamGuidesHubMetadata } from "@/features/guides/ExamGuidesHub";

export const metadata = getExamGuidesHubMetadata("bfp");

export default function BfpGuidesHubPage() {
  return <ExamGuidesHub examId="bfp" />;
}
