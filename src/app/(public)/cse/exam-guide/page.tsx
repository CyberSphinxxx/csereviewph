import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ExamSubNav } from "@/components/layout/ExamSubNav";
import { Footer } from "@/components/layout/Footer";
import { ExamGuideView } from "@/components/exam-guide/ExamGuideView";

export const metadata: Metadata = {
  title: "CSE Exam Schedule, Requirements & Testing Centers",
  description:
    "Comprehensive guide to Civil Service Exam schedules, testing centers across all 16 CSC regions, application requirements, and official CSC links.",
  alternates: {
    canonical: "/cse/exam-guide",
  },
  openGraph: {
    title: "CSE Exam Schedule, Requirements & Testing Centers",
    description:
      "Comprehensive Civil Service Examination guide with verified testing center localities, exam calendars, application requirements, and official CSC resources.",
    url: "/cse/exam-guide",
    type: "website",
  },
};

export default function ExamGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />
      <ExamSubNav examId="cse" />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ExamGuideView />
      </main>

      <Footer />
    </div>
  );
}
