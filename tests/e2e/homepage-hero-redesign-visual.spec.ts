import { test, expect } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR = "C:/Users/USER-PC/.gemini/antigravity-ide/brain/1d73f1fb-e9c6-4e88-acc8-b5ee0b638565";

test.describe("ReviewTayo Homepage Hero Redesign Visual & Responsive Verification", () => {
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

  test("verifies desktop hero presentation and captures screenshots across resolutions", async ({ page }) => {
    const desktopViewports = [
      { name: "1280", width: 1280, height: 800 },
      { name: "1440", width: 1440, height: 900 },
      { name: "1536", width: 1536, height: 960 },
      { name: "1920", width: 1920, height: 1080 },
    ];

    for (const vp of desktopViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Verify masthead
      await expect(page.getByText("Philippine Exam Preparation", { exact: true })).toBeVisible();

      // Verify H1
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toContainText(/Your review home for/i);
      await expect(h1).toContainText(/Philippine examinations/i);

      // Verify live CSE contextual action
      const liveCseLink = page.getByRole("link", { name: /^Civil Service reviewer is live now/i });
      await expect(liveCseLink).toBeVisible();
      await expect(liveCseLink).toHaveAttribute("href", "/cse");

      // Verify index rows are visible
      await expect(page.getByRole("heading", { name: /The Philippine Examination Index/i })).toBeVisible();
      await expect(page.getByText("Civil Service Commission (CSC)").first()).toBeVisible();
      await expect(page.getByText("Professional Regulation Commission (PRC)").first()).toBeVisible();

      // Capture screenshot
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `hero_desktop_${vp.name}.png`),
        fullPage: false,
      });
    }
  });

  test("verifies mobile hero presentation across 375, 390, and 430 widths", async ({ page }) => {
    const mobileViewports = [
      { name: "375", width: 375, height: 667 },
      { name: "390", width: 390, height: 844 },
      { name: "430", width: 430, height: 932 },
    ];

    for (const vp of mobileViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

      // Verify long titles wrap without breaking on mobile
      await expect(page.getByRole("heading", { name: "Licensure Examination for Teachers" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Bureau of Fire Protection Examinations" })).toBeVisible();

      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `hero_mobile_${vp.name}.png`),
        fullPage: false,
      });
    }
  });

  test("verifies user interactions: anchor scroll, Sign In modal, and CSE navigation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 1. Sign In modal check
    const signInBtn = page.getByRole("button", { name: /Sign In/i }).first();
    await expect(signInBtn).toBeVisible({ timeout: 10000 });
    await signInBtn.click();
    await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "hero_signin_modal.png"),
      fullPage: false,
    });

    // Close modal
    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: /Welcome back/i })).not.toBeVisible();

    // 2. Click CSE link -> navigates to /cse
    const cseLink = page.getByRole("link", { name: /^Civil Service reviewer is live now/i });
    await cseLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/cse$/);

    // Verify CSE page has distinct conversion-oriented level selector card
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Philippine Civil Service Exam/i);
    await expect(page.getByRole("heading", { name: /Choose your exam level/i })).toBeVisible();

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "cse_page_distinct_comparison.png"),
      fullPage: false,
    });
  });
});
