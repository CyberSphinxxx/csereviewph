import type { Metadata } from "next";
import { AppShell } from "@/features/dashboard/AppShell";
import { NotesView } from "@/features/dashboard/notes/NotesView";

export const metadata: Metadata = {
  title: "Notes | ReviewTayo",
  description: "Your study notes, saved on this device.",
  robots: { index: false, follow: false },
};

export default function NotesPage() {
  return (
    <AppShell>
      <NotesView />
    </AppShell>
  );
}
