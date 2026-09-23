import { DashboardView } from "@/features/dashboard/DashboardView";
import { AppShell } from "@/features/dashboard/AppShell";

export const metadata = {
  title: "My Exam Workspace",
  description: "Exam-specific study actions, readiness, practice history, and progress.",
};

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  );
}
