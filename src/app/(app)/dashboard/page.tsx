import { DashboardView } from "@/features/dashboard/DashboardView";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "My Exam Workspace",
  description: "Exam-specific study actions, readiness, practice history, and progress.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f6] dark:bg-[#161315]">
      <Header />
      <main id="main-content" className="flex-1">
        <DashboardView />
      </main>
      <Footer />
    </div>
  );
}
