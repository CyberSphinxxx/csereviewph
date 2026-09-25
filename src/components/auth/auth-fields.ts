/**
 * Shared auth field specs, validation rules, and copy.
 *
 * Both the auth modal (AuthForm) and the standalone auth pages
 * (AuthStandaloneForm) render from these definitions so validation rules,
 * autocomplete attributes, and copy can never drift apart. API calls stay in
 * the components — this module is pure data + pure validators.
 */

export type FieldMetaKey = "signin" | "create" | "reset" | "newpass";

export interface FieldSpec {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  icon: "mail" | "lock" | "user";
  placeholder: string;
  autoComplete: string;
  eye?: boolean;
  meter?: boolean;
  forgot?: boolean;
  hint?: string;
}

export const SIGNIN_FIELDS: FieldSpec[] = [
  { id: "si-email", label: "Email Address", type: "email", icon: "mail", placeholder: "juan@example.ph", autoComplete: "email" },
  { id: "si-pass", label: "Password", type: "password", icon: "lock", placeholder: "Enter your password", autoComplete: "current-password", eye: true, forgot: true },
];

export const CREATE_FIELDS: FieldSpec[] = [
  { id: "ca-name", label: "Display Name", type: "text", icon: "user", placeholder: "Juan Dela Cruz", autoComplete: "name", hint: "This is how your name appears in your reviewer profile." },
  { id: "ca-email", label: "Email Address", type: "email", icon: "mail", placeholder: "juan@example.ph", autoComplete: "email" },
  { id: "ca-pass", label: "Password", type: "password", icon: "lock", placeholder: "At least 8 characters", autoComplete: "new-password", eye: true, meter: true },
];

export const RESET_FIELDS: FieldSpec[] = [
  { id: "rs-email", label: "Email Address", type: "email", icon: "mail", placeholder: "juan@example.ph", autoComplete: "email" },
];

export const NEWPASS_FIELDS: FieldSpec[] = [
  { id: "np-pass", label: "New password", type: "password", icon: "lock", placeholder: "At least 8 characters", autoComplete: "new-password", eye: true, meter: true },
  { id: "np-confirm", label: "Confirm new password", type: "password", icon: "lock", placeholder: "Re-enter your new password", autoComplete: "new-password", eye: true },
];

export const FIELD_SETS: Record<FieldMetaKey, FieldSpec[]> = {
  signin: SIGNIN_FIELDS,
  create: CREATE_FIELDS,
  reset: RESET_FIELDS,
  newpass: NEWPASS_FIELDS,
};

export const META: Record<FieldMetaKey, { title: string; sub: string; cta: string }> = {
  signin: { title: "Welcome back", sub: "Sign in to sync your study progress across devices.", cta: "Sign In" },
  create: { title: "Create your free account", sub: "Save your study progress and continue reviewing on any device.", cta: "Create Account & Sync" },
  reset: { title: "Reset your password", sub: "Enter your email address and we'll send you instructions to reset your password.", cta: "Send Reset Link" },
  newpass: { title: "Set a new password", sub: "Choose a strong password you have not used on ReviewTayo before.", cta: "Update Password" },
};

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address.";
}

export const RULES: Record<string, (v: string) => string> = {
  "si-email": isEmail,
  "ca-email": isEmail,
  "rs-email": isEmail,
  "si-pass": (v) => (v ? "" : "Enter your password."),
  "ca-name": (v) => (v.trim() ? "" : "Enter your display name."),
  "ca-pass": (v) => (v.length >= 8 ? "" : "Password must be at least 8 characters."),
  "np-pass": (v) => (v.length >= 8 ? "" : "Password must be at least 8 characters."),
  "np-confirm": (v) => (v ? "" : "Re-enter your new password."),
};

export const GENERIC_ERROR =
  "Something went wrong. Please check your connection and try again.";

/** Brand-panel benefits (modal + standalone pages share this copy). */
export const BENEFITS = [
  { t: "Sync your study progress", d: "Pick up on any device, right where you left off." },
  { t: "Track your readiness", d: "Accuracy and streaks saved as you review." },
  { t: "Your data, your call", d: "Export or delete your records anytime." },
];
