import type { Metadata } from "next";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your Philippine Civil Service Exam reviewer password. Receive secure instructions by email to regain access to your account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <AuthPageLayout mode="forgot-password" />;
}
