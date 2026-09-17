import { test, expect } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR = "C:/Users/USER-PC/.gemini/antigravity-ide/brain/89e2bca2-0d67-42d2-9211-553ad3fc1846";

test.describe("Peeking Owl Full-Body Visual Verification & Screenshot Captures", () => {
  test("captures desktop 1920, 1440, 1280, 1024 hidden, and mobile 390 hidden states", async ({ page }) => {
    // 1. Desktop 1920x1080 Light Theme
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/cse");
    await page.waitForLoadState("networkidle");

    const peekingOwlSvg = page.locator("svg").filter({ has: page.locator("[data-owl-part='fixed-body']") });
    await expect(peekingOwlSvg).toBeVisible();

    const card = page.getByRole("heading", { name: "Choose your exam level" });
    const cardBox = await card.boundingBox();
    if (cardBox) {
      await page.mouse.move(cardBox.x - 40, cardBox.y + 40);
      await page.waitForTimeout(250);
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "desktop-1920-light.png"),
      fullPage: false,
    });

    // 2. Desktop 1440x900 Light Theme & Close-up
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(200);
    await expect(peekingOwlSvg).toBeVisible();

    if (cardBox) {
      await page.mouse.move(cardBox.x - 50, cardBox.y + 60);
      await page.waitForTimeout(250);
    }

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "desktop-1440-light-tracking.png"),
      fullPage: false,
    });

    const cardWrapper = page.locator(".relative.z-0:has(svg:has([data-owl-part='fixed-body']))");
    const wrapperBox = await cardWrapper.boundingBox();
    if (wrapperBox) {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, "peeking-owl-closeup-light.png"),
        clip: {
          x: Math.max(0, wrapperBox.x - 160),
          y: Math.max(0, wrapperBox.y - 40),
          width: wrapperBox.width + 180,
          height: wrapperBox.height + 80,
        },
      });
    }

    // 3. Desktop 1440x900 Dark Theme & Close-up
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(200);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "desktop-1440-dark-tracking.png"),
      fullPage: false,
    });

    if (wrapperBox) {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, "peeking-owl-closeup-dark.png"),
        clip: {
          x: Math.max(0, wrapperBox.x - 160),
          y: Math.max(0, wrapperBox.y - 40),
          width: wrapperBox.width + 180,
          height: wrapperBox.height + 80,
        },
      });
    }

    // 4. Desktop 1280x800 Light Theme (Breakpoint entry)
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
    });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(200);
    await expect(peekingOwlSvg).toBeVisible();

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "desktop-1280-light.png"),
      fullPage: false,
    });

    const wrapperBox1280 = await cardWrapper.boundingBox();
    if (wrapperBox1280) {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, "peeking-owl-closeup-1280.png"),
        clip: {
          x: Math.max(0, wrapperBox1280.x - 160),
          y: Math.max(0, wrapperBox1280.y - 40),
          width: wrapperBox1280.width + 180,
          height: wrapperBox1280.height + 80,
        },
      });
    }

    // 5. Tablet 1024x768 (Must be HIDDEN below 1280px)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(200);
    await expect(peekingOwlSvg).toBeHidden();

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "desktop-1024-light-hidden.png"),
      fullPage: false,
    });

    // 6. Mobile 390x844 Light Theme (Hidden check)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await expect(peekingOwlSvg).toBeHidden();

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "mobile-390-light-hidden.png"),
      fullPage: false,
    });

    // 7. Mobile 390x844 Dark Theme (Hidden check)
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(200);
    await expect(peekingOwlSvg).toBeHidden();

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "mobile-390-dark-hidden.png"),
      fullPage: false,
    });
  });

  test("tracks cursor when hovering over main headline copy on the left without disconnecting", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/cse");
    await page.waitForLoadState("networkidle");

    const headline = page.getByRole("heading", { level: 1 });
    const headlineBox = await headline.boundingBox();
    expect(headlineBox).toBeTruthy();

    // Hover over headline on the left side of the hero section
    await page.mouse.move(headlineBox!.x + 50, headlineBox!.y + 30);
    await page.waitForTimeout(250);

    const leftPupil = page.locator("[data-owl-pupil='left']");
    const transform = await leftPupil.getAttribute("transform");
    expect(transform).not.toBe("translate(0 0)");
    // Since pointer is to the left of the mascot, horizontal offset must be negative (gazing leftwards)
    expect(transform).toMatch(/translate\(-[0-9]/);
  });
});
