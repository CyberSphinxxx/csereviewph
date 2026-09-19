import { test, expect } from "@playwright/test";

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

    await expect(page.getByText(/Philippine exam preparation/i).first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Free practice exams/i);
    await expect(page.getByText(/Choose the exam you’re preparing for/i).first()).toBeVisible();

    // Available now and live exam checks
    await expect(page.getByRole("heading", { name: /Start With a Live Reviewer/i })).toBeVisible();
    await expect(page.getByText("Live").first()).toBeVisible();

    // Verify CSE card has Open exam link
    const cseCardBtn = page.getByRole("link", { name: /Open exam/i }).first();
    await expect(cseCardBtn).toBeVisible();
    await expect(cseCardBtn).toHaveAttribute("href", "/cse");

    // 2. Click "Open exam" -> navigates to /cse
    await cseCardBtn.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/cse(\?.*)?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Philippine Civil Service Exam/i);

    // Verify ExamSubNav is present with Overview active
    const subNav = page.getByRole("navigation", { name: /Exam navigation/i });
    await expect(subNav).toBeVisible();
    await expect(subNav.getByRole("link", { name: "Overview" })).toBeVisible();

    // 3. Click global "Exams" nav link -> navigates to /reviewers
    const examsLink = page.getByRole("navigation", { name: "Global navigation" }).getByRole("link", { name: "Exams", exact: true });
    await examsLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/reviewers$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Philippine Exams Directory/i);

    // Test filter tabs
    await page.getByRole("button", { name: "Licensure" }).click();
    await expect(page.getByText("Licensure Examination for Teachers")).toBeVisible();
    await page.getByRole("button", { name: "All Exams" }).click();

    // 4. Test 2-click hero diagnostic flow from homepage
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const diagnosticBtn = page.getByRole("link", { name: /Start free diagnostic/i });
    await expect(diagnosticBtn).toBeVisible();
    await diagnosticBtn.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/exams\/professional\/quick$/);

    // 5. Mobile Viewport 375x812 on Homepage
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Confirm no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

  });
});
