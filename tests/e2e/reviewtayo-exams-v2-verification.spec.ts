import { test, expect } from "@playwright/test";

test.describe("ReviewTayo Exams V2 (/reviewers) Production Verification", () => {
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

  test("1-15: Full browser verification of /reviewers prototype implementation", async ({
    page,
  }) => {
    // Collect console errors to assert zero errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Load /reviewers on standard desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/reviewers");
    await page.waitForLoadState("networkidle");

    // 2. Confirm the old directory design is gone
    await expect(page.getByText("Philippine Exams Directory")).not.toBeVisible();
    await expect(page.getByText("ReviewTayo Exam Catalog")).not.toBeVisible();
    await expect(page.getByText("Our Content Authenticity Commitment")).not.toBeVisible();

    // 3. Confirm the new HTML-inspired experience appears
    await expect(
      page.getByRole("heading", { level: 1, name: /What are you aiming for\?/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /Search every exam\./i })
    ).toBeVisible();

    // Verify warm blush/pink exams-page-gradient is active on the page container
    const hasGradient = await page.locator(".exams-page-gradient").count();
    expect(hasGradient).toBeGreaterThanOrEqual(1);

    // 4. Switch through every exam goal option
    const radiogroup = page.getByRole("radiogroup", { name: /Your exam goal/i });
    await expect(radiogroup).toBeVisible();

    // Goal 1: Government
    const govGoal = page.getByRole("radio", { name: /A government job/i });
    await govGoal.click();
    await expect(govGoal).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText(/Civil service and agency exams are here/i)).toBeVisible();
    await expect(
      page.getByText("Career Service Examination, Professional Level").first()
    ).toBeVisible();

    // Goal 2: Police / Military / Public Safety
    const safetyGoal = page.getByRole("radio", { name: /A police, military or fire career/i });
    await safetyGoal.click();
    await expect(safetyGoal).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText(/Police, military and fire exams are all here/i)).toBeVisible();
    await expect(page.getByText(/PNP Entrance Examination/i).first()).toBeVisible();

    // Goal 3: Professional License (with sub-field filter chips)
    const licGoal = page.getByRole("radio", { name: /A professional license/i });
    await licGoal.click();
    await expect(licGoal).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText(/That covers a lot of boards/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /All fields/i })).toBeVisible();

    // Click Education sub-field chip
    const eduChip = page.getByRole("button", { name: /^Education\b/i }).first();
    await eduChip.click();
    await expect(
      page.getByText(/Licensure Examination for Professional Teachers, Elementary/i).first()
    ).toBeVisible();

    // Goal 4: College / Scholarships
    const schoolGoal = page.getByRole("radio", { name: /A college or scholarship spot/i });
    await schoolGoal.click();
    await expect(schoolGoal).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText(/Entrance, scholarship and admission tests are here/i)).toBeVisible();

    // Goal 5: School / Skills
    const skillsGoal = page.getByRole("radio", { name: /A school or skills certificate/i });
    await skillsGoal.click();
    await expect(skillsGoal).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText(/DepEd assessments and TESDA certificates are here/i)).toBeVisible();

    // 5. Test "See all exams" CTA from finder panel
    await govGoal.click();
    const seeAllBtn = page.getByRole("button", { name: /See all .* exams/i });
    await expect(seeAllBtn).toBeVisible();
    await seeAllBtn.click();

    // Reset filter to All exams before global search
    await page.getByRole("button", { name: /All exams/i }).click();

    // 6. Test search and popular chips in catalog
    const searchInput = page.getByRole("textbox", { name: /Search exams/i });
    await expect(searchInput).toBeVisible();

    // Click popular chip: "Teacher"
    await page.getByRole("button", { name: "Teacher", exact: true }).click();
    await expect(searchInput).toHaveValue("teacher");
    await expect(page.getByRole("heading", { level: 3, name: /Teacher/i }).first()).toBeVisible();

    // Clear search
    const clearBtn = page.getByRole("button", { name: /Clear search/i });
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(searchInput).toHaveValue("");

    // Search for "nurse"
    await searchInput.fill("nurse");
    await expect(
      page.getByRole("heading", { level: 3, name: /Nurse.*Licensure Examination/i })
    ).toBeVisible();

    // 7. Test "Live only" toggle switch
    await clearBtn.click();
    const liveSwitch = page.getByRole("checkbox", { name: /Live only/i });
    await expect(liveSwitch).not.toBeChecked();

    // Toggle live only
    await page.locator("label:has-text('Live only')").click();
    await expect(liveSwitch).toBeChecked();

    // Non-live exam should be hidden
    await expect(page.getByRole("heading", { level: 3, name: /Fire Officer/i })).not.toBeVisible();

    // Live CSE exam ticket should be visible
    const cseHeading = page.getByRole("heading", {
      level: 3,
      name: /Career Service Examination, Professional Level/i,
    });
    await expect(cseHeading).toBeVisible();

    // 8. Open available CSE path and confirm working action
    const openExamBtn = page.getByRole("link", { name: /Open exam/i }).first();
    await expect(openExamBtn).toBeVisible();
    await expect(openExamBtn).toHaveAttribute("href", "/cse");

    // 9. Confirm coming-soon exams do NOT lead to broken pages
    await page.locator("label:has-text('Live only')").click(); // Turn off live only
    await expect(liveSwitch).not.toBeChecked();

    const comingSoonBadges = page.locator("article.tk").getByText(/Coming soon/i);
    expect(await comingSoonBadges.count()).toBeGreaterThan(0);
    // Ensure no links exist on coming soon tickets
    const comingSoonLinks = page.locator("article.tk:has-text('Coming soon') a");
    expect(await comingSoonLinks.count()).toBe(0);

    // 10. Test empty state and suggestion bar
    await searchInput.fill("nonexistenttestingexam");
    await expect(page.getByText(/No exam matches/i)).toBeVisible();
    await expect(page.getByRole("img", { name: /ReviewTayo Mascot Oops/i })).toBeVisible();

    const sugInput = page.getByRole("textbox", { name: /Exam you're looking for/i });
    await expect(sugInput).toBeVisible();
    await page.getByRole("button", { name: /Send/i }).click();
    await expect(page.getByText(/Thanks\. We'll look into/i)).toBeVisible();

    // Clear search to restore view
    await clearBtn.click();

    // 11. Test global keyboard shortcut '/' to focus search input
    await page.locator("body").click();
    await page.keyboard.press("/");
    await expect(searchInput).toBeFocused();

    // 12. Confirm absence of prototype-only "Design notes" content
    await expect(page.locator("#notesbtn")).not.toBeAttached();
    await expect(page.locator(".note")).not.toBeAttached();
    await expect(page.getByText("1 · Owl finder")).not.toBeVisible();
    await expect(page.getByText("2 · Search and tickets")).not.toBeVisible();
    await expect(page.getByText("Design notes")).not.toBeVisible();

    // 13. Confirm bottom maroon gradient closing section and footer
    const closingSection = page.locator("section.exams-closing-gradient");
    await expect(closingSection).toBeVisible();
    await expect(
      closingSection.getByRole("heading", { name: /Ready to test your readiness today\?/i })
    ).toBeVisible();
    await expect(
      closingSection.getByRole("link", { name: /Start free diagnostic/i })
    ).toHaveAttribute("href", "/exams/professional/quick");

    // Capture desktop screenshot
    await page.screenshot({
      path: "artifacts/exams-v2-desktop.png",
      fullPage: false,
    });

    // 14. Responsive behavior & No horizontal overflow test across breakpoints
    const viewports = [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 430, height: 932 },
      { width: 375, height: 812 },
      { width: 320, height: 600 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

      if (scrollWidth > clientWidth + 2) {
        const badElements = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll("*"));
          const cw = document.documentElement.clientWidth;
          return elements
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              return rect.right > cw + 2;
            })
            .map((el) => ({
              tag: el.tagName,
              id: el.id,
              class: (el.className || "").toString().slice(0, 100),
              right: el.getBoundingClientRect().right,
              width: el.getBoundingClientRect().width,
            }))
            .slice(0, 15);
        });
        console.log(`[OVERFLOW AT ${vp.width}px]:`, JSON.stringify(badElements, null, 2));
      }

      expect(
        scrollWidth,
        `Horizontal overflow at ${vp.width}px: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`
      ).toBeLessThanOrEqual(clientWidth + 2);
    }

    // Capture mobile screenshot at 375px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({
      path: "artifacts/exams-v2-mobile.png",
      fullPage: false,
    });

    // 15. Check for console errors
    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("favicon") && !err.includes("ad-block")
    );
    expect(criticalErrors).toEqual([]);
  });

  test("Reduced motion preference renders cleanly without animation locks", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/reviewers");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();

    const isReduced = await page.evaluate(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
    expect(isReduced).toBe(true);
  });
});
