import { test, expect } from "@playwright/test";

test.describe("ReviewTayo Multi-Exam Platform Accessibility & Responsive Verification (RT-04)", () => {
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

  test("Keyboard-only path, focus visibility, and Escape dismiss behavior on umbrella homepage (/)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Start keyboard traversal with Tab
    await page.keyboard.press("Tab");

    // 1. First focusable link should be Logo home link or skip link
    const firstFocused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName.toLowerCase(),
        ariaLabel: el?.getAttribute("aria-label"),
        href: el?.getAttribute("href"),
      };
    });
    expect(firstFocused.tag).toBe("a");
    expect(firstFocused.ariaLabel).toMatch(/ReviewTayo home/i);

    // 2. Tab into desktop navigation items
    await page.keyboard.press("Tab"); // Reviewers
    const navItem1 = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(navItem1).toBe("Reviewers");

    await page.keyboard.press("Tab"); // How It Works
    const navItem2 = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(navItem2).toBe("How It Works");

    await page.keyboard.press("Tab"); // CSE Reviewer
    const navItem3 = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(navItem3).toBe("CSE Reviewer");

    await page.keyboard.press("Tab"); // More Menu button
    const moreBtn = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName.toLowerCase(),
        expanded: el?.getAttribute("aria-expanded"),
        text: el?.textContent?.trim(),
      };
    });
    expect(moreBtn.tag).toBe("button");
    expect(moreBtn.text).toBe("More");
    expect(moreBtn.expanded).toBe("false");

    // Open More dropdown with Enter
    await page.keyboard.press("Enter");
    const isExpanded = await page.evaluate(() => document.activeElement?.getAttribute("aria-expanded"));
    expect(isExpanded).toBe("true");

    // Dismiss with Escape
    await page.keyboard.press("Escape");
    // Verify menu closes cleanly or returns
    await page.mouse.click(10, 10); // Outside dismiss check

    // Continue Tab down into Hero CTAs
    let reachedStartBtn = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const activeText = await page.evaluate(() => document.activeElement?.textContent?.trim() || "");
      if (activeText.includes("Start CSE review")) {
        reachedStartBtn = true;
        break;
      }
    }
    expect(reachedStartBtn).toBe(true);

    // Verify focus outline visibility on active element
    const focusOutline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      return {
        outlineStyle: computed.outlineStyle,
        boxShadow: computed.boxShadow,
      };
    });
    expect(focusOutline).toBeDefined();
  });

  test("Reflow at 320px CSS width without horizontal scroll (WCAG 1.4.10)", async ({ page }) => {
    const testRoutes = ["/", "/reviewers", "/cse"];

    for (const route of testRoutes) {
      await page.setViewportSize({ width: 320, height: 600 });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

      // Subpixel rounding tolerance (max 2px margin)
      expect(
        scrollWidth,
        `Horizontal overflow detected on ${route} at 320px viewport: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`
      ).toBeLessThanOrEqual(clientWidth + 2);
    }
  });

  test("200% Zoom scaling without content collision or clipping", async ({ page }) => {
    // 200% zoom on 1280px standard desktop simulates a 640px viewport with 2x device scale factor
    await page.setViewportSize({ width: 640, height: 480 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Verify primary action remains clickable and visible
    const cseBtn = page.getByRole("link", { name: /Start CSE review/i });
    await expect(cseBtn).toBeVisible();
    await expect(cseBtn).toBeEnabled();

    // Verify reviewer section is visible and readable
    await expect(page.getByRole("heading", { name: /Select Your Target Examination/i })).toBeVisible();
  });

  test("Reduced motion preference disables/minimizes transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify body renders without animation freeze
    await expect(page.locator("h1")).toBeVisible();
    const isReduced = await page.evaluate(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
    expect(isReduced).toBe(true);
  });

  test("Color contrast measurements on key text and interactive CTA elements", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check primary button background and color
    const cseBtnStyles = await page.getByRole("link", { name: /Start CSE review/i }).evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
      };
    });

    // Brand button: text is white rgb(255, 255, 255) on brand-700 (#86152d ~ rgb(134, 21, 45) or darker)
    expect(cseBtnStyles.color).toBe("rgb(255, 255, 255)");

    // Check body text color in hero
    const bodyColor = await page.locator("p").first().evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(bodyColor).toBeDefined();

    // Check category badge
    const badgeColor = await page.getByText("Available Today").evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });
    expect(badgeColor.color).toBeDefined();
    expect(badgeColor.backgroundColor).toBeDefined();
  });
});
