import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "@/lib/env";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : getBaseUrl(),
});

export const { signIn, signUp, signOut, resetPassword, useSession } = authClient;

export async function requestPasswordReset({ email }: { email: string }) {
  try {
    const res = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectTo: "/reset-password" }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: { message: data.message || data.error || "Failed to send reset link." } };
    }
    return { data: { success: true } };
  } catch (err) {
    return { error: { message: err instanceof Error ? err.message : "Network error" } };
  }
}

