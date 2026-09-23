import type { Metadata } from "next";
import { AppShell } from "@/features/dashboard/AppShell";
import { AchievementsView } from "@/features/dashboard/achievements/AchievementsView";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Badges earned from your real study activity: tests completed, streaks, notes, mastery and goals.",
};

export default function AchievementsPage() {
  return (
    <AppShell>
      <AchievementsView />
    </AppShell>
  );
}
