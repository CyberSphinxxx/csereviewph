import { test, expect } from "@playwright/test";

test.describe("Auth Modal & Dedicated Pages UI Verification", () => {
  test("opens Sign In modal, verifies fields and toggles, switches to Create Account, and captures screenshots", async ({
    page,
  }) => {
    await page.goto("/");

    // Open Sign In modal from header
    const signInBtn = page.getByRole("button", { name: "Sign In" });
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

    // Capture Sign In Modal screenshot
    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/129befee-075d-452a-8d4f-10aaa2d2d61d/auth_modal_signin.png",
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

    // Capture Create Account Modal screenshot
    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/129befee-075d-452a-8d4f-10aaa2d2d61d/auth_modal_signup.png",
    });

    // Verify closing modal via "Continue without an account"
    await page.getByRole("button", { name: "Continue without an account" }).click();
    await expect(modal).not.toBeVisible();
  });

  test("renders dedicated /sign-in page with 2-column layout on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/sign-in");

    await expect(page.getByText("Keep your study progress with you.")).toBeVisible();
    await expect(page.getByText("Save your results, track weak areas, and continue reviewing on any device.")).toBeVisible();
    await expect(page.getByText("Diagnostic Mock Exam")).toBeVisible();
    await expect(page.getByText("84.5% Passed")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/129befee-075d-452a-8d4f-10aaa2d2d61d/dedicated_signin_desktop.png",
    });
  });

  test("renders dedicated /create-account page with 2-column layout on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/create-account");

    await expect(page.getByText("Keep your study progress with you.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create your free account" })).toBeVisible();
    await expect(page.getByPlaceholder("Juan Dela Cruz")).toBeVisible();

    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/129befee-075d-452a-8d4f-10aaa2d2d61d/dedicated_signup_desktop.png",
    });
  });

  test("renders dedicated /forgot-password page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/forgot-password");

    await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Send Reset Link" })).toBeVisible();

    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/129befee-075d-452a-8d4f-10aaa2d2d61d/dedicated_forgot_password.png",
    });
  });
});
