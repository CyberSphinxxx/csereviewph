import type { Metadata } from "next";
import { AuthStandaloneLayout } from "@/components/auth/AuthStandaloneLayout";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Request password reset instructions for your Philippine Civil Service Exam reviewer account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <AuthStandaloneLayout initialState="reset" />;
}
