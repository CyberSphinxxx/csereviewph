import { test, expect } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR = "C:/Users/USER-PC/.gemini/antigravity-ide/brain/129befee-075d-452a-8d4f-10aaa2d2d61d";

test.describe("ReviewTayo Multi-Exam Platform Visual & Interactive Walkthrough", () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem(
        "csereviewer_cookie_consent",
        JSON.stringify({
          essential: true,
          analytics: false,
          ads: false,
          hasChosen: true,
          updatedAt: Date.now(),
        })
      );
    });
  });

  test("captures desktop and mobile walkthrough of /, /reviewers, and /cse", async ({ page }) => {
    // 1. Desktop 1280x800: Umbrella Homepage
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/Philippine exam preparation, all in one place/i)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Choose your exam/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Build your confidence/i);

    // Reviewer catalog checks
    await expect(page.getByRole("heading", { name: /Select Your Target Examination/i })).toBeVisible();
    await expect(page.getByText("Available Today")).toBeVisible();
    await expect(page.getByText("Coming Soon").first()).toBeVisible();

    // Verify CSE card has active link
    const cseCardBtn = page.locator("#reviewers").getByRole("link", { name: /Open CSE Reviewer/i });
    await expect(cseCardBtn).toBeVisible();
    await expect(cseCardBtn).toHaveAttribute("href", "/cse");

    // Verify upcoming exams are disabled
    const plannedButtons = page.getByRole("button", { name: /Planned Reviewer/i });
    const count = await plannedButtons.count();
    expect(count).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < count; i++) {
      await expect(plannedButtons.nth(i)).toBeDisabled();
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "reviewtayo_home_desktop.png"),
      fullPage: false,
    });

    // 2. Click Primary CTA "Start CSE review" -> navigates to /cse
    const startCseBtn = page.getByRole("link", { name: /Start CSE review/i });
    await startCseBtn.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/cse$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Philippine Civil Service Exam/i);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "reviewtayo_cse_landing.png"),
      fullPage: false,
    });

    // 3. Click "Reviewers" nav link -> navigates to /reviewers
    const reviewersLink = page.getByRole("link", { name: "Reviewers", exact: true }).first();
    await reviewersLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/reviewers$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Philippine Examination Reviewers/i);

    // Test filter tabs
    await page.getByRole("button", { name: "Licensure" }).click();
    await expect(page.getByText("Licensure Examination for Teachers")).toBeVisible();
    await page.getByRole("button", { name: "All Reviewers" }).click();

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "reviewtayo_reviewers_catalog.png"),
      fullPage: false,
    });

    // 4. Mobile Viewport 375x812 on Umbrella Homepage
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Confirm no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "reviewtayo_home_mobile.png"),
      fullPage: false,
    });
  });
});
