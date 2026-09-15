"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn, signUp, requestPasswordReset } from "@/lib/auth/auth-client";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export type AuthMode = "sign-in" | "create-account" | "forgot-password";

interface AuthFormProps {
  initialMode?: AuthMode;
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onSuccess?: () => void;
  onGuestContinue?: () => void;
}

export function AuthForm({
  initialMode = "sign-in",
  mode: controlledMode,
  onModeChange,
  onSuccess,
  onGuestContinue,
}: AuthFormProps) {
  const [internalMode, setInternalMode] = useState<AuthMode>(initialMode);
  const currentMode = controlledMode ?? internalMode;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleModeChange = (newMode: AuthMode) => {
    setError(null);
    setResetSent(false);
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (currentMode === "forgot-password") {
      setLoading(true);
      try {
        const res = await requestPasswordReset({ email: email.trim() });
        if (res.error) {
          setError(res.error.message || "Something went wrong. Please check your connection and try again.");
        } else {
          setResetSent(true);
        }
      } catch {
        setError("Something went wrong. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (currentMode === "create-account") {
      if (!name.trim()) {
        setError("Please enter your display name.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      setLoading(true);
      try {
        const res = await signUp.email({
          email: email.trim(),
          password,
          name: name.trim(),
        });

        if (res.error) {
          const msg = res.error.message?.toLowerCase() || "";
          if (msg.includes("already") || msg.includes("exist") || msg.includes("registered")) {
            setError("An account with this email already exists. Sign in instead.");
          } else {
            setError(res.error.message || "Something went wrong. Please check your connection and try again.");
          }
          setLoading(false);
          return;
        }

        setLoading(false);
        if (onSuccess) onSuccess();
      } catch {
        setError("Something went wrong. Please check your connection and try again.");
        setLoading(false);
      }
      return;
    }

    // Sign In Mode
    if (!password) {
      setError("The email or password is incorrect.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn.email({
        email: email.trim(),
        password,
      });

      if (res.error) {
        setError("The email or password is incorrect.");
        setLoading(false);
        return;
      }

      setLoading(false);
      if (onSuccess) onSuccess();
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Titles */}
      <div className="mb-5">
        <h2
          id="auth-form-title"
          className="text-xl font-bold text-slate-900 dark:text-white tracking-tight"
        >
          {currentMode === "sign-in" && "Welcome back"}
          {currentMode === "create-account" && "Create your free account"}
          {currentMode === "forgot-password" && "Reset your password"}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {currentMode === "sign-in" &&
            "Sign in to sync your study progress across devices."}
          {currentMode === "create-account" &&
            "Save your study progress and continue reviewing on any device."}
          {currentMode === "forgot-password" &&
            "Enter your email address and we'll send you instructions to reset your password."}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="mb-4 flex items-start gap-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 text-xs text-rose-700 dark:text-rose-300"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Reset Sent Success Notice */}
      {resetSent ? (
        <div className="space-y-4 py-2">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Check your email</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                If an account exists for <span className="font-medium text-slate-900 dark:text-white">{email}</span>,
                you will receive password reset instructions shortly.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleModeChange("sign-in")}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Display Name (Create Account only) */}
          {currentMode === "create-account" && (
            <div>
              <label
                htmlFor="auth-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="w-full rounded-xl border border-input dark:border-border bg-white dark:bg-[#1E191C] pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                This is how your name appears in your reviewer profile.
              </p>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@example.ph"
                className="w-full rounded-xl border border-input dark:border-border bg-white dark:bg-[#1E191C] pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition"
              />
            </div>
          </div>

          {/* Password (Sign In & Create Account only) */}
          {currentMode !== "forgot-password" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="auth-password"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                {currentMode === "sign-in" && (
                  <button
                    type="button"
                    onClick={() => handleModeChange("forgot-password")}
                    className="text-xs text-brand-700 hover:text-brand-800 dark:text-brand-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    currentMode === "create-account"
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                  className="w-full rounded-xl border border-input dark:border-border bg-white dark:bg-[#1E191C] pl-9 pr-10 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {currentMode === "create-account" && (
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Use at least 8 characters.
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-700 hover:bg-brand-800 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {currentMode === "create-account"
                    ? "Creating account..."
                    : currentMode === "forgot-password"
                    ? "Sending instructions..."
                    : "Signing in..."}
                </span>
              </>
            ) : currentMode === "create-account" ? (
              "Create Account & Sync"
            ) : currentMode === "forgot-password" ? (
              "Send Reset Link"
            ) : (
              "Sign In"
            )}
          </button>

          {/* Guest Option (Continue without an account) */}
          {onGuestContinue && currentMode !== "forgot-password" && (
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={onGuestContinue}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:underline transition py-1"
              >
                Continue without an account
              </button>
            </div>
          )}

          {/* Account Mode Switcher */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            {currentMode === "sign-in" && (
              <>
                New to CSE Reviewer?{" "}
                <button
                  type="button"
                  onClick={() => handleModeChange("create-account")}
                  className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
                >
                  Create a free account
                </button>
              </>
            )}
            {currentMode === "create-account" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleModeChange("sign-in")}
                  className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
            {currentMode === "forgot-password" && (
              <button
                type="button"
                onClick={() => handleModeChange("sign-in")}
                className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
              >
                Back to sign in
              </button>
            )}
          </div>

          {/* Data Privacy (RA 10173) Notice Box */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 p-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5 mt-4">
            <ShieldCheck className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <Link
                href="/privacy"
                className="font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 underline underline-offset-2"
              >
                Data Privacy:
              </Link>{" "}
              Creating an account is optional. We use your email and display name to save and
              sync your study progress across devices. You can export or delete your records anytime.
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
