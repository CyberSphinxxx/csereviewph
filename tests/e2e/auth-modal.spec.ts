import { test, expect } from "@playwright/test";

test.describe("Auth Modal & Dedicated Pages UI Verification", () => {
  test("opens Sign In modal, verifies fields and toggles, switches to Create Account, and captures screenshots", async (
    { page },
    testInfo
  ) => {
    await page.goto("/");

    // Open Sign In modal from header
    const signInBtn = page.locator("header").getByRole("button", { name: "Sign In" });
    await expect(signInBtn).toBeVisible({ timeout: 15000 });
    await signInBtn.click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.getByText("Sign in to sync your study progress across devices.")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(page.getByText("Forgot password?")).toBeVisible();
    await expect(page.getByText("Continue without an account")).toBeVisible();
    await expect(page.getByText("Data Privacy:")).toBeVisible();

    // Toggle password visibility
    const passwordInput = page.getByPlaceholder("Enter your password");
    await passwordInput.fill("SampleSecretPassword");
    await expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = page.getByRole("button", { name: "Show password" });
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Capture Sign In Modal screenshot to portable output path
    await page.screenshot({
      path: testInfo.outputPath("auth_modal_signin.png"),
    });

    // Switch to Create Account mode
    const createAccountSwitch = page.getByRole("button", { name: "Create a free account" });
    await createAccountSwitch.click();

    await expect(page.getByRole("heading", { name: "Create your free account" })).toBeVisible();
    await expect(page.getByText("Save your study progress and continue reviewing on any device.")).toBeVisible();
    await expect(page.getByPlaceholder("Juan Dela Cruz")).toBeVisible();
    await expect(page.getByText("This is how your name appears in your reviewer profile.")).toBeVisible();
    await expect(page.getByPlaceholder("At least 8 characters")).toBeVisible();
    await expect(page.getByText("Use at least 8 characters.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Account & Sync" })).toBeVisible();

    // Capture Create Account Modal screenshot to portable output path
    await page.screenshot({
      path: testInfo.outputPath("auth_modal_signup.png"),
    });

    // Verify closing modal via "Continue without an account"
    await page.getByRole("button", { name: "Continue without an account" }).click();
    await expect(modal).not.toBeVisible();
  });

  test("renders dedicated /sign-in standalone page with brand panel on desktop", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/sign-in");

    // Brand panel (Concept C)
    await expect(page.getByRole("heading", { name: /Review smarter/i })).toBeVisible();
    await expect(page.getByText("Live · Civil Service Exam")).toBeVisible();
    await expect(page.getByText("Sync your study progress")).toBeVisible();

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
