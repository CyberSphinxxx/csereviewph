import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Civil Service Exam Practice Tests by Subtest",
  description:
    "Target your weak areas with free Philippine Civil Service Exam practice tests. Focused question drills by subtest with step-by-step pedagogical explanations.",
  alternates: {
    canonical: "/practice",
  },
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
