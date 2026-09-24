import type { Metadata } from "next";
import { AuthStandaloneLayout } from "@/components/auth/AuthStandaloneLayout";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Philippine Civil Service Exam reviewer account to sync your study progress, exam scores, and mistake bank across devices.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return <AuthStandaloneLayout initialState="signin" />;
}
