import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthStandaloneLayout } from "@/components/auth/AuthStandaloneLayout";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Philippine Civil Service Exam reviewer account.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Email reset links land here with ?token=... (see requestPasswordReset's
 * redirectTo). The form reads the token client-side via useSearchParams, which
 * requires a Suspense boundary during prerendering.
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <AuthStandaloneLayout initialState="newpass" />
    </Suspense>
  );
}
