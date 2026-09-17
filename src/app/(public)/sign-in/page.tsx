import type { Metadata } from "next";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

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
  return <AuthPageLayout mode="sign-in" />;
}
