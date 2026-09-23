import type { Metadata } from "next";
import { AppShell } from "@/features/dashboard/AppShell";
import { HistoryView } from "@/features/dashboard/history/HistoryView";

export const metadata: Metadata = {
  title: "History | ReviewTayo",
  description: "Complete record of your past examination simulations and drills.",
  robots: { index: false, follow: false },
};

export default function HistoryPage() {
  return (
    <AppShell>
      <HistoryView />
    </AppShell>
  );
}
