import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Free Philippine Civil Service Exam Reviewer & Mock Tests",
  description:
    "100% free Philippine Civil Service Exam (CSE-PPT) reviewer and online mock tests. Practice Professional and Subprofessional exams with real continuous countdown timers, original syllabus questions, and topic analytics.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
