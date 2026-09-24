import type { Metadata } from "next";
import { AuthStandaloneLayout } from "@/components/auth/AuthStandaloneLayout";

export const metadata: Metadata = {
  title: "Create Free Account",
  description:
    "Create your free Philippine Civil Service Exam reviewer account. Save your practice exam results, track weak areas, and sync study progress on any device.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateAccountPage() {
  return <AuthStandaloneLayout initialState="create" />;
}
