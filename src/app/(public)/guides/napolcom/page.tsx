import { ExamGuidesHub, getExamGuidesHubMetadata } from "@/features/guides/ExamGuidesHub";

export const metadata = getExamGuidesHubMetadata("napolcom");

export default function NapolcomGuidesHubPage() {
  return <ExamGuidesHub examId="napolcom" />;
}
