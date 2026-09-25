import { test, expect } from "@playwright/test";

test.describe("Auth Modal & Dedicated Pages UI Verification", () => {
  test("opens the split-panel Sign In modal: brand panel, tabs, fields, eye toggle, Create account tab, guest close", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    // Open Sign In modal from header (desktop + mobile triggers both match)
    const signInBtn = page
      .locator("header")
      .getByRole("button", { name: "Sign In" })
      .first();
    await expect(signInBtn).toBeVisible({ timeout: 15000 });
    await signInBtn.click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Split panel: maroon brand side (desktop) + form side
    await expect(page.getByText("Live · Civil Service Exam")).toBeVisible();
    await expect(page.getByText("Sync your study progress", { exact: true })).toBeVisible();
    await expect(page.getByText("Your data, your call")).toBeVisible();

    // Tab switcher with aria-pressed state (scoped to the switcher group —
    // the form's CTA is "Sign In", which "Sign in" would substring-match)
    const switcher = modal.getByRole("group", { name: "Sign in or create account" });
    const signInTab = switcher.getByRole("button", { name: "Sign in" });
    const createTab = switcher.getByRole("button", { name: "Create account" });
    await expect(signInTab).toHaveAttribute("aria-pressed", "true");
    await expect(createTab).toHaveAttribute("aria-pressed", "false");

    // Sign-in form fields; privacy box is create-account only now
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(modal.getByLabel("Email Address")).toBeVisible();
    await expect(modal.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(modal.getByText("Forgot password?")).toBeVisible();
    await expect(modal.getByText("Data Privacy:")).toHaveCount(0);

    // Toggle password visibility
    const passwordInput = modal.getByPlaceholder("Enter your password");
    await passwordInput.fill("SampleSecretPassword");
    await expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = modal.getByRole("button", { name: "Show password" });
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Capture Sign In Modal screenshot to portable output path
    await page.screenshot({
      path: testInfo.outputPath("auth_modal_signin.png"),
    });

    // Switch to Create Account via the tab
    await createTab.click();
    await expect(signInTab).toHaveAttribute("aria-pressed", "false");
    await expect(createTab).toHaveAttribute("aria-pressed", "true");

    await expect(page.getByRole("heading", { name: "Create your free account" })).toBeVisible();
    await expect(modal.getByPlaceholder("Juan Dela Cruz")).toBeVisible();
    await expect(modal.getByText("This is how your name appears in your reviewer profile.")).toBeVisible();
    await expect(modal.getByPlaceholder("At least 8 characters")).toBeVisible();
    await expect(modal.getByText("Use at least 8 characters.")).toBeVisible();
    await expect(modal.getByRole("button", { name: "Create Account & Sync" })).toBeVisible();
    await expect(modal.getByText("Data Privacy:")).toBeVisible();

    // Capture Create Account Modal screenshot to portable output path
    await page.screenshot({
      path: testInfo.outputPath("auth_modal_signup.png"),
    });

    // Verify closing modal via "Continue without an account"
    await signInTab.click();
    await modal.getByRole("button", { name: "Continue without an account" }).click();
    await expect(modal).not.toBeVisible();
  });

  test("inline validation, forgot-password flow, Escape close, and focus return to trigger", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    const trigger = page
      .locator("header")
      .getByRole("button", { name: "Sign In" })
      .first();
    await trigger.click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Empty submit → inline per-field errors (no API call)
    await modal.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Enter your password.")).toBeVisible();

    // Forgot password flow: inline state inside the modal
    await modal.getByRole("button", { name: "Forgot password?" }).click();
    await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
    await modal.getByRole("button", { name: "Send Reset Link" }).click();
    // Inline validation boundary only — the real reset API stays out of e2e
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();

    // Escape closes the modal and focus returns to the trigger
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
    await expect(trigger).toBeFocused();

    await page.screenshot({
      path: testInfo.outputPath("auth_modal_closed_focus.png"),
    });
  });

  test("renders dedicated /sign-in standalone page with brand panel on desktop", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/sign-in");

    // Brand panel (Concept C)
    await expect(page.getByRole("heading", { name: /Review smarter/i })).toBeVisible();
    await expect(page.getByText("Live · Civil Service Exam")).toBeVisible();
    await expect(page.getByText("Sync your study progress", { exact: true })).toBeVisible();

    // Form side
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to practice/i })).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("dedicated_signin_desktop.png"),
    });
  });

  test("renders dedicated /create-account standalone page with privacy notice", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/create-account");

    await expect(page.getByRole("heading", { name: /Review smarter/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create your free account" })).toBeVisible();
    await expect(page.getByPlaceholder("Juan Dela Cruz")).toBeVisible();
    await expect(page.getByText("Data Privacy:")).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("dedicated_signup_desktop.png"),
    });
  });

  test("renders dedicated /forgot-password page", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/forgot-password");

    await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Send Reset Link" })).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("dedicated_forgot_password.png"),
    });
  });

  test("renders /reset-password new-password form with token, invalid state without", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto("/reset-password?token=demo-token");
    await expect(page.getByRole("heading", { name: "Set a new password" })).toBeVisible();
    await expect(page.getByText("New password", { exact: true })).toBeVisible();
    await expect(page.getByText("Confirm new password")).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("dedicated_reset_password.png"),
    });

    await page.goto("/reset-password");
    await expect(page.getByText("This reset link is not valid")).toBeVisible();
    await expect(page.getByRole("button", { name: "Request a new link" })).toBeVisible();
  });

  test("inline validation shows on the standalone sign-in page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/sign-in");

    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  });
});
