import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthForm } from "@/components/auth/AuthForm";
import { signIn, signUp, requestPasswordReset } from "@/lib/auth/auth-client";

vi.mock("@/lib/auth/auth-client", () => ({
  signIn: {
    email: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
  requestPasswordReset: vi.fn(),
}));

describe("AuthForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Sign In Mode", () => {
    it("renders sign in fields, titles, and data privacy notice", () => {
      render(<AuthForm initialMode="sign-in" />);

      expect(screen.getByText("Welcome back")).toBeInTheDocument();
      expect(screen.getByText("Sign in to sync your study progress across devices.")).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
      // Data privacy moved to create-account only in the split-panel redesign
      expect(screen.queryByText(/Data Privacy:/i)).not.toBeInTheDocument();
      // And the tab switcher is present with Sign in active
      expect(screen.getByRole("button", { name: "Sign in" })).toHaveAttribute("aria-pressed", "true");
    });

    it("displays error when email format is invalid", async () => {
      render(<AuthForm initialMode="sign-in" />);

      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });

      const submitBtn = screen.getByRole("button", { name: "Sign In" });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
      expect(signIn.email).not.toHaveBeenCalled();
    });

    it("displays error when password is empty on submission", async () => {
      render(<AuthForm initialMode="sign-in" />);

      const emailInput = screen.getByLabelText(/Email Address/i);
      fireEvent.change(emailInput, { target: { value: "juan@example.ph" } });

      const submitBtn = screen.getByRole("button", { name: "Sign In" });
      fireEvent.click(submitBtn);

      // Empty password now surfaces as a per-field inline error (not the
      // form-level "incorrect credentials" message reserved for real API failures)
      expect(await screen.findByText("Enter your password.")).toBeInTheDocument();
      expect(signIn.email).not.toHaveBeenCalled();
    });

    it("submits valid credentials and calls onSuccess", async () => {
      vi.mocked(signIn.email).mockResolvedValueOnce({ data: { user: { id: "u-1" } } } as unknown as ReturnType<typeof signIn.email>);
      const onSuccess = vi.fn();

      render(<AuthForm initialMode="sign-in" onSuccess={onSuccess} />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "juan@example.ph" } });
      fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "Secret123!" } });

      fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

      await waitFor(() => {
        expect(signIn.email).toHaveBeenCalledWith({
          email: "juan@example.ph",
          password: "Secret123!",
        });
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it("ignores a second submit while a request is in flight (Enter key path)", async () => {
      // A form fires its submit event on Enter inside an input even while the
      // submit button is disabled, so the in-flight ref must make the second
      // submission a no-op.
      let resolveSignIn: (value: unknown) => void = () => {};
      vi.mocked(signIn.email).mockImplementationOnce(
        () => new Promise((resolve) => { resolveSignIn = resolve; }) as ReturnType<typeof signIn.email>
      );
      const onSuccess = vi.fn();

      render(<AuthForm initialMode="sign-in" onSuccess={onSuccess} />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "juan@example.ph" } });
      fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "Secret123!" } });

      const submitBtn = screen.getByRole("button", { name: "Sign In" });
      fireEvent.click(submitBtn);
      await waitFor(() => expect(submitBtn).toBeDisabled());

      // Second submit while in flight (e.g. pressing Enter in the email input)
      const form = submitBtn.closest("form");
      expect(form).not.toBeNull();
      fireEvent.submit(form as HTMLFormElement);

      expect(signIn.email).toHaveBeenCalledTimes(1);

      resolveSignIn({ data: { user: { id: "u-1" } } });
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(submitBtn).toBeEnabled();
      });
      expect(signIn.email).toHaveBeenCalledTimes(1);
    });

    it("displays 'The email or password is incorrect.' when signIn fails", async () => {
      vi.mocked(signIn.email).mockResolvedValueOnce({ error: { message: "Invalid credentials" } } as unknown as ReturnType<typeof signIn.email>);

      render(<AuthForm initialMode="sign-in" />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "juan@example.ph" } });
      fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "WrongPassword" } });

      fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

      expect(await screen.findByText("The email or password is incorrect.")).toBeInTheDocument();
    });
  });

  describe("Create Account Mode", () => {
    it("validates required display name and minimum password length", async () => {
      render(<AuthForm initialMode="create-account" />);

      expect(screen.getByText("Create your free account")).toBeInTheDocument();
      expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("At least 8 characters")).toBeInTheDocument();

      // Empty name
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "juan@example.ph" } });
      fireEvent.click(screen.getByRole("button", { name: /Create Account & Sync/i }));
      expect(await screen.findByText("Enter your display name.")).toBeInTheDocument();

      // Short password (< 8 chars)
      fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: "Juan Dela Cruz" } });
      fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "short" } });
      fireEvent.click(screen.getByRole("button", { name: /Create Account & Sync/i }));
      expect(await screen.findByText("Password must be at least 8 characters.")).toBeInTheDocument();
    });

    it("handles already existing email with helpful redirection message", async () => {
      vi.mocked(signUp.email).mockResolvedValueOnce({
        error: { message: "User already exists with this email" },
      } as unknown as ReturnType<typeof signUp.email>);

      render(<AuthForm initialMode="create-account" />);

      fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: "Juan Dela Cruz" } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "existing@example.ph" } });
      fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "ValidPassword123!" } });

      fireEvent.click(screen.getByRole("button", { name: /Create Account & Sync/i }));

      expect(await screen.findByText("An account with this email already exists. Sign in instead.")).toBeInTheDocument();
    });
  });

  describe("Forgot Password Flow", () => {
    it("transitions to forgot password and submits reset request", async () => {
      vi.mocked(requestPasswordReset).mockResolvedValueOnce({ data: { success: true } });

      render(<AuthForm initialMode="sign-in" />);

      // Click "Forgot password?"
      fireEvent.click(screen.getByRole("button", { name: /Forgot password\?/i }));

      expect(screen.getByText("Reset your password")).toBeInTheDocument();
      expect(screen.getByText(/Enter your email address and we'll send you instructions/i)).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: "juan@example.ph" } });
      fireEvent.click(screen.getByRole("button", { name: /Send Reset Link/i }));

      await waitFor(() => {
        expect(requestPasswordReset).toHaveBeenCalledWith({ email: "juan@example.ph" });
        expect(screen.getByText("Check your inbox")).toBeInTheDocument();
      });

      // Back to sign in
      fireEvent.click(screen.getByRole("button", { name: /Back to sign in/i }));
      expect(screen.getByText("Welcome back")).toBeInTheDocument();
    });
  });

  describe("Guest Action & Password Toggle", () => {
    it("invokes onGuestContinue when 'Continue without an account' is clicked", () => {
      const onGuestContinue = vi.fn();
      render(<AuthForm initialMode="sign-in" onGuestContinue={onGuestContinue} />);

      const guestBtn = screen.getByRole("button", { name: /Continue without an account/i });
      fireEvent.click(guestBtn);

      expect(onGuestContinue).toHaveBeenCalledTimes(1);
    });

    it("toggles password type between password and text", () => {
      render(<AuthForm initialMode="sign-in" />);

      const passwordInput = screen.getByPlaceholderText("Enter your password");
      expect(passwordInput).toHaveAttribute("type", "password");

      const toggleBtn = screen.getByRole("button", { name: "Show password" });
      fireEvent.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");

      fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });
});
