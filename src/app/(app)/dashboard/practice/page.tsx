import type { Metadata } from "next";
import { AppShell } from "@/features/dashboard/AppShell";
import { PracticeHubView } from "@/features/dashboard/practice/PracticeHubView";

export const metadata: Metadata = {
  title: "Practice | ReviewTayo",
  description: "Choose how you want to practice: tests, review, focus, and more.",
  robots: { index: false, follow: false },
};

export default function DashboardPracticePage() {
  return (
    <AppShell>
      <PracticeHubView />
    </AppShell>
  );
}
