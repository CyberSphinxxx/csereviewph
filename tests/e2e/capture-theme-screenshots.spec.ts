import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const ARTIFACTS_DIR = "C:/Users/USER-PC/.gemini/antigravity-ide/brain/6087c7b2-1d5e-431c-9a07-da74b49c6f9c";

test.describe("Capture Theme & Reviewers Verification Screenshots", () => {
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

  test("captures visual evidence of landing CTAs, reviewers gradient, and dark red theme", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // 1. Landing Page Light Mode
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const landingLightPath = path.join(ARTIFACTS_DIR, "landing-hero-light.png");
    await page.screenshot({ path: landingLightPath, fullPage: false });

    // 2. Click "Choose an exam"
    const chooseBtn = page.getByRole("link", { name: /Choose an exam/i });
    await expect(chooseBtn).toBeVisible();
    await chooseBtn.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/reviewers$/);
    await expect(page.getByRole("heading", { level: 1, name: /What are you aiming for\?/i })).toBeVisible();

    // 3. Reviewers Page Light Mode (with warm blush/pink gradient)
    const reviewersLightPath = path.join(ARTIFACTS_DIR, "reviewers-gradient-light.png");
    await page.screenshot({ path: reviewersLightPath, fullPage: false });

    // 4. Activate Dark Mode on Reviewers Page
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(300);

    const reviewersDarkPath = path.join(ARTIFACTS_DIR, "reviewers-dark-red.png");
    await page.screenshot({ path: reviewersDarkPath, fullPage: false });

    // 5. Navigate back to Landing Page in Dark Mode
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(300);

    const landingDarkPath = path.join(ARTIFACTS_DIR, "landing-dark-red.png");
    await page.screenshot({ path: landingDarkPath, fullPage: false });

    expect(fs.existsSync(landingLightPath)).toBe(true);
    expect(fs.existsSync(reviewersLightPath)).toBe(true);
    expect(fs.existsSync(reviewersDarkPath)).toBe(true);
    expect(fs.existsSync(landingDarkPath)).toBe(true);
  });
});
