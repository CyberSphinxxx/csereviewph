import type { Metadata } from "next";
import { AppShell } from "@/features/dashboard/AppShell";
import { ReviewView } from "@/features/dashboard/review/ReviewView";

export const metadata: Metadata = {
  title: "Review | ReviewTayo",
  description: "Spaced review, mistake bank, and bookmarks.",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <AppShell>
      <ReviewView />
    </AppShell>
  );
}
