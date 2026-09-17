import { test, expect } from "@playwright/test";

test.describe("Civil Service Exam Reviewer E2E Flows", () => {
  test.beforeEach(async ({ context }) => {
    // Seed cookie consent in localStorage so the banner is dismissed during exam interaction
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

  test("loads ReviewTayo umbrella homepage with reviewer catalog and navigates to CSE", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Philippine Exam Reviewer & Mock Tests/i);

    // Verify umbrella proposition and heading
    await expect(page.getByText(/Philippine exam preparation, all in one place/i)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Choose your exam/i);

    // Verify Reviewers catalog section
    await expect(page.getByRole("heading", { name: /Select Your Target Examination/i })).toBeVisible();
    await expect(page.getByText("Available Today")).toBeVisible();
    await expect(page.getByText("Coming Soon").first()).toBeVisible();

    // Click primary CTA to enter CSE reviewer
    const startCseBtn = page.getByRole("link", { name: /Start CSE review/i });
    await expect(startCseBtn).toBeVisible();
    await startCseBtn.click();
    await expect(page).toHaveURL(/\/cse$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Philippine Civil Service Exam/i);
  });

  test("loads landing page with exam preparation options", async ({ page }) => {
    await page.goto("/cse");
    await expect(page).toHaveTitle(/Civil Service Exam Reviewer/i);

    // Verify simplified hero copy
    await expect(page.getByText("PHILIPPINE CIVIL SERVICE EXAM REVIEWER", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Philippine Civil Service Exam/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Reviewer & Online Mock Tests/i);
    await expect(
      page.getByText(/Prepare for the CSE-PPT Professional and Subprofessional exams with free subtest drills, full-length continuous-timer mock exams/i)
    ).toBeVisible();

    // Verify streamlined header navigation for new visitors (no premature dashboard)
    await expect(page.getByRole("link", { name: "Practice", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Study Guides", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Exam Info", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Sign In/i })).toBeVisible({ timeout: 15000 });

    // Verify presence of preparation mode cards below the fold
    await expect(page.getByRole("heading", { name: "Quick Test" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Medium Test" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Full Mock Exam" })).toBeVisible();
  });

  test("renders simplified hero with outcome study plan preview and navigates to how-it-works", async ({ page }) => {
    await page.goto("/cse");

    // Verify quiet exam schedule line aligned above the selector card
    await expect(page.getByText("Exam schedule")).toBeVisible();
    await expect(page.getByText(/March 14, 2027/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /View dates/i })).toHaveAttribute("href", "/cse/exam-guide#schedule");

    // Verify outcome evidence cue under supporting copy
    await expect(page.getByText("Your results include")).toBeVisible();
    await expect(page.getByText(/Subject breakdown · Answer explanations · Recommended practice/i)).toBeVisible();

    // Verify left-side quiet "See how the review works" link
    const reviewWorksLink = page.getByRole("link", { name: /See how the review works/i });
    await expect(reviewWorksLink).toBeVisible();

    // Verify exam-level selection card on the right
    await expect(page.getByText("START YOUR REVIEW")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Choose your exam level" })).toBeVisible();

    // Verify level options and subtest notes
    const proRadio = page.getByRole("radio", { name: /^Professional\b/i });
    const subproRadio = page.getByRole("radio", { name: /^Subprofessional\b/i });
    await expect(proRadio).toBeVisible();
    await expect(subproRadio).toBeVisible();
    await expect(page.getByText("Includes Analytical Ability").first()).toBeVisible();
    await expect(page.getByText("Includes Clerical Ability").first()).toBeVisible();

    // By default, Professional is selected
    const startDiagnosticBtn = page.getByRole("link", { name: /Start Free Diagnostic/i });
    await expect(startDiagnosticBtn).toBeVisible();
    await expect(startDiagnosticBtn).toHaveAttribute("href", "/exams/professional/quick");

    // Switching to Subprofessional updates the CTA link
    await subproRadio.click();
    await expect(startDiagnosticBtn).toHaveAttribute("href", "/exams/subprofessional/quick");

    // Reassurance line
    await expect(page.getByText(/10 questions · 10-minute timer/i)).toBeVisible();
    await expect(page.getByText(/No account required/i)).toBeVisible();

    // Comparison helper link
    const compareLink = page.getByRole("link", { name: /Not sure which level\? Compare the two levels/i });
    await expect(compareLink).toBeVisible();
    await expect(compareLink).toHaveAttribute("href", "#compare-levels");

    // Verify HOW YOUR REVIEW WORKS section
    await expect(page.getByText("HOW YOUR REVIEW WORKS")).toBeVisible();
    await expect(page.getByRole("heading", { name: /A short test\. A focused study plan\./i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Take the diagnostic" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Review your results" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Practice the recommended area" })).toBeVisible();

    // Verify WHY STUDY WITH REVIEWTAYO section
    await expect(page.getByText("WHY STUDY WITH REVIEWTAYO")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Original practice questions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Detailed answer explanations" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Built for both CSE levels" })).toBeVisible();

    // Verify link scrolls to section
    await reviewWorksLink.click();
    await expect(page.locator("#how-your-review-works")).toBeVisible();
  });

  test("renders subtle peeking owl on desktop without blocking controls, tracks mouse, and hides on mobile", async ({ page }) => {
    // 1. Desktop Viewport (1280x800)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/cse");
    await page.waitForLoadState("networkidle");

    // Locate the peeking owl decoration
    const peekingOwlSvg = page.locator("svg").filter({ has: page.locator("[data-owl-part='fixed-head']") });
    await expect(peekingOwlSvg).toBeVisible();
    await expect(peekingOwlSvg).toHaveAttribute("aria-hidden", "true");

    // Both pupils exist
    const leftPupil = peekingOwlSvg.locator("[data-owl-pupil='left']");
    const rightPupil = peekingOwlSvg.locator("[data-owl-pupil='right']");
    await expect(leftPupil).toBeAttached();
    await expect(rightPupil).toBeAttached();

    // Verify radio buttons and Start Free Diagnostic CTA are completely clickable and unobstructed
    const proRadio = page.getByRole("radio", { name: /^Professional\b/i });
    const subproRadio = page.getByRole("radio", { name: /^Subprofessional\b/i });
    const ctaBtn = page.getByRole("link", { name: /Start Free Diagnostic/i });

    await expect(proRadio).toHaveAttribute("aria-checked", "true");
    await subproRadio.click();
    await expect(ctaBtn).toHaveAttribute("href", "/exams/subprofessional/quick");
    await proRadio.click();
    await expect(ctaBtn).toHaveAttribute("href", "/exams/professional/quick");

    // Move pointer near card and verify pupil movement
    const cardBox = await page.getByRole("heading", { name: "Choose your exam level" }).boundingBox();
    if (cardBox) {
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.waitForTimeout(100);
      const transform = await leftPupil.getAttribute("transform");
      expect(transform).toMatch(/translate\(-?\d+/);
    }

    // 2. Mobile Viewport (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(peekingOwlSvg).toBeHidden();

    // Check no horizontal scroll on mobile
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test("takes Quick Test, flags a question, submits, and views results", async ({ page }) => {
    await page.goto("/exams/professional/quick");

    // Header and timer visible
    await expect(page.locator("#exam-timer")).toBeVisible();
    await expect(page.getByText(/Question 1 of 10/i)).toBeVisible();

    // Flag question
    const flagBtn = page.locator("#flag-question-button");
    await flagBtn.click();
    await expect(flagBtn).toContainText(/Flagged/i);

    // Select first choice
    const firstChoice = page.locator("button:has(span.rounded-lg:text('A'))").first();
    await firstChoice.click();

    // Navigate to next question
    await page.locator("#next-question-btn").click();
    await expect(page.getByText(/Question 2 of 10/i)).toBeVisible();

    // Open question palette
    await page.getByRole("button", { name: /palette/i }).click();
    await expect(page.getByText(/Question Map/i).first()).toBeVisible();
    // Return from palette
    await page.getByRole("button", { name: /return to exam/i }).click();

    // Open review modal and submit
    await page.getByRole("button", { name: /submit/i }).first().click();
    await expect(page.getByText(/Review Before Submission/i)).toBeVisible();

    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/e4580727-e72d-4085-8b75-221d1cbba244/quick_test_review_submit_modal.png",
      fullPage: false,
    });

    // Confirm submission
    await page.locator("#confirm-submit-btn").click();

    // Verify navigation to results
    await page.waitForURL(/\/results\/.+/);
    await expect(page.getByText("Estimated Score", { exact: true })).toBeVisible();
    await expect(page.getByText(/Score Interpretation & Official CSC Rating Notice/i)).toBeVisible();
    await expect(page.getByText(/Subtest Performance Breakdown/i)).toBeVisible();
    await expect(page.getByText(/Detailed Answer Review/i)).toBeVisible();
    await expect(page.getByText(/Educational Concept & Rationale/i).first()).toBeVisible();
  });

  test("loads Full Mock Exam with single continuous timer matching 170 items", async ({ page }) => {
    await page.goto("/exams/professional/full");

    await expect(page.getByText(/Full Mock Exam/i).first()).toBeVisible();
    await expect(page.getByText(/Question 1 of 170/i)).toBeVisible();
    await expect(page.locator("#exam-timer")).toBeVisible();

    // Verify palette displays items
    await page.getByRole("button", { name: /palette/i }).click();
    await expect(page.getByText(/Question Map/i).first()).toBeVisible();
  });

  test("automatically submits exam when timer expires on timeout without clicking submit", async ({ page }) => {
    // Navigate with a 2-second test expiry timer
    await page.goto("/exams/professional/quick?testExpirySeconds=2");

    await expect(page.locator("#exam-timer")).toBeVisible();
    await expect(page.getByText(/Question 1 of 10/i)).toBeVisible();

    // Select an answer
    const firstChoice = page.locator("button:has(span.rounded-lg:text('A'))").first();
    await firstChoice.click();

    // Do NOT click submit; wait for timer to expire (2 seconds) and automatically submit
    await page.waitForURL(/\/results\/.+/, { timeout: 15000 });
    await expect(page.getByText("Estimated Score", { exact: true })).toBeVisible();
    await expect(page.getByText(/Score Interpretation & Official CSC Rating Notice/i)).toBeVisible();
    await expect(page.getByText(/Subtest Performance Breakdown/i)).toBeVisible();
    await expect(page.getByText(/Detailed Answer Review/i)).toBeVisible();
  });

  test("auto-saves in-progress exam, displays resume prompt on reload, and bookmarks question to dashboard", async ({ page }) => {
    await page.goto("/exams/professional/quick");

    // Select choice on Q1
    const firstChoice = page.locator("button:has(span.rounded-lg:text('A'))").first();
    await firstChoice.click();

    // Reload the page
    await page.reload();

    // Verify resume prompt banner
    await expect(page.getByText(/Unfinished Session Found/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Resume Session/i })).toBeVisible();

    // Click Resume
    await page.getByRole("button", { name: /Resume Session/i }).click();
    await expect(page.getByText(/Unfinished Session Found/i)).not.toBeVisible();

    // Submit
    await page.getByRole("button", { name: /submit/i }).first().click();
    await page.locator("#confirm-submit-btn").click();
    await page.waitForURL(/\/results\/.+/);

    // Click bookmark button on Q1
    const bookmarkBtn = page.getByTitle("Bookmark Question").first();
    await bookmarkBtn.click();

    // Navigate to dashboard
    await page.goto("/dashboard");
    await expect(page.getByText("Your Progress is Saved Locally")).toBeVisible();
    await expect(page.getByText("Export Backup (JSON)")).toBeVisible();

    // Check Bookmarks page
    await page.goto("/dashboard/bookmarks");
    await expect(page.getByRole("button", { name: /Practice Bookmarks/i })).toBeVisible();
  });

  test("supports keyboard shortcuts, choice elimination, and virtual scratchpad in exam runner", async ({ page }) => {
    await page.goto("/exams/professional/quick");

    await expect(page.locator("#exam-timer")).toBeVisible();
    await expect(page.getByText(/Question 1 of 10/i)).toBeVisible();

    // Ensure container has active focus for keyboard event capture
    await page.locator("main").click();

    // Press 'A' key to select choice A on Q1
    await page.keyboard.press("KeyA");
    const choiceACard = page.getByTestId("choice-card-A");
    await expect(choiceACard).toHaveClass(/border-brand-700/);

    // Press 'F' key to flag question
    await page.keyboard.press("KeyF");
    await expect(page.locator("#flag-question-button")).toContainText(/Flagged/i);

    // Press 'ArrowRight' to navigate to Question 2
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText(/Question 2 of 10/i)).toBeVisible();

    // Cross-out (eliminate) Option B on Question 2
    const eliminateBtn = page.getByRole("button", { name: /Cross-out Option B/i }).first();
    await eliminateBtn.click();
    await expect(page.getByRole("button", { name: /Restore Option B/i })).toBeVisible();

    // Open Virtual Scratchpad via button
    await page.getByRole("button", { name: /Scratchpad/i }).first().click();
    await expect(page.getByText(/Scratchpad & Arithmetic Canvas/i)).toBeVisible();

    // Switch to Type Notes tab and enter calculation
    await page.getByRole("button", { name: /Type Notes/i }).click();
    const notesInput = page.getByPlaceholder(/Type calculations or thoughts here/i);
    await notesInput.fill("120 * 0.8 = 96");
    await expect(notesInput).toHaveValue("120 * 0.8 = 96");

    // Close scratchpad
    await page.getByRole("button", { name: /Keep Working/i }).click();
    await expect(page.getByText(/Scratchpad & Arithmetic Canvas/i)).not.toBeVisible();

    // Open Question Report Modal
    await page.locator("#report-question-btn").click();
    await expect(page.getByText("Report an Issue with Question")).toBeVisible();
    await expect(page.getByText("Factual / Answer Key Error")).toBeVisible();
    await page.getByRole("button", { name: /Cancel/i }).click();
    await expect(page.getByText("Report an Issue with Question")).not.toBeVisible();
  });

  test("displays target exam countdown on dashboard and supports Leitner SRS filters in mistake bank", async ({ page }) => {
    // 1. Check Dashboard Header, Footer & Target Exam Countdown
    await page.goto("/dashboard");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("link", { name: "Practice", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    await expect(page.getByText("Target Exam Pacing")).toBeVisible();
    await expect(page.getByText(/Remaining/i)).toBeVisible();
    await expect(page.getByText(/Daily Goal/i)).toBeVisible();

    // 2. Open Mistake Bank and verify persistent navigation
    await page.goto("/dashboard/mistakes");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByText("Leitner SRS")).toBeVisible();
    await expect(page.getByText("Your Mistake Bank is empty!")).toBeVisible();
  });

  test("opens Sign In modal from header and confirms it is in-bounds and centered in viewport", async ({ page }) => {
    await page.goto("/");
    const signInBtn = page.getByRole("button", { name: "Sign In" });
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();

    // Verify modal appears and is visible
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(page.getByText("Welcome back")).toBeVisible();

    // Verify modal bounding box is well within viewport (top > 0)
    const box = await modal.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThan(10);

    // Close modal
    await page.getByRole("button", { name: "Close dialog" }).click();
    await expect(modal).not.toBeVisible();
  });

  test("allows user to safely exit and resume via Save & Exit dialog", async ({ page }) => {
    await page.goto("/exams/professional/quick");
    await expect(page.locator("#exam-timer")).toBeVisible();

    // Capture simplified test runner view
    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/e4580727-e72d-4085-8b75-221d1cbba244/quick_test_simplified_ui.png",
      fullPage: false,
    });

    // Open Display menu and capture
    await page.getByRole("button", { name: /display accessibility settings/i }).click();
    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/e4580727-e72d-4085-8b75-221d1cbba244/quick_test_display_menu.png",
      fullPage: false,
    });
    await page.keyboard.press("Escape");

    // Select choice on Q1
    const firstChoice = page.locator("button:has(span.rounded-lg:text('A'))").first();
    await firstChoice.click();

    // Click Save & Exit
    const exitBtn = page.getByRole("button", { name: /save and exit/i });
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();

    // Verify confirmation modal
    await expect(page.getByText("Leave this test?")).toBeVisible();
    await expect(
      page.getByText(/Your progress is saved and you can resume this test later/i)
    ).toBeVisible();

    // Capture Save & Exit confirmation modal
    await page.screenshot({
      path: "C:/Users/USER-PC/.gemini/antigravity-ide/brain/e4580727-e72d-4085-8b75-221d1cbba244/quick_test_save_exit_modal.png",
      fullPage: false,
    });

    // Click Save & Leave
    await page.getByRole("button", { name: "Save & Leave" }).click();
    await page.waitForURL(/\/practice/);
  });
});
