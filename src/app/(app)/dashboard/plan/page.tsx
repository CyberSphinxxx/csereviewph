import type { Metadata } from "next";
import { AppShell } from "@/features/dashboard/AppShell";
import { StudyPlanView } from "@/features/dashboard/plan/StudyPlanView";

export const metadata: Metadata = {
  title: "Study plan | ReviewTayo",
  description: "Your weekly study plan from today to exam day.",
  robots: { index: false, follow: false },
};

export default function StudyPlanPage() {
  return (
    <AppShell>
      <StudyPlanView />
    </AppShell>
  );
}
