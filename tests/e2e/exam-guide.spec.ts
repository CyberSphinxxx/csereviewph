import { test, expect } from "@playwright/test";

test.describe("CSE Exam Guide & Official CSC Resources E2E", () => {
  test.beforeEach(async ({ context }) => {
    // Seed cookie consent to prevent banners from obscuring clicks
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

  test("loads public CSE Exam Guide with independence disclaimer, urgent advisories, and confirmed schedules", async ({
    page,
  }) => {
    await page.goto("/cse/exam-guide");

    // Check page title and headings
    await expect(page).toHaveTitle(/CSE Exam Schedule, Requirements & Testing Centers/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/CSE Exam Guide and Official CSC Links/i);

    // Verify prominent independence disclaimer
    const disclaimer = page.getByRole("note", { name: /Independent Platform Disclaimer/i });
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer).toContainText(/independent exam-preparation platform/i);
    await expect(disclaimer).toContainText(/not affiliated with or endorsed by the Civil Service Commission/i);

    // Verify urgent weather advisory is at the top of the page
    const urgentBanner = page.locator("section[aria-label='Urgent CSC Advisories and Bulletins']");
    await expect(urgentBanner).toBeVisible();
    await expect(urgentBanner).toContainText(/Urgent: Weather Suspension for 9 August 2026/i);

    // Verify 2027 confirmed schedule cards
    await expect(page.getByRole("heading", { name: "14 March 2027 CSE-PPT", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "8 August 2027 CSE-PPT", exact: true })).toBeVisible();
    await expect(page.getByText(/350,000 examinees/i).first()).toBeVisible();

    // Verify testing center vs room assignment terminology box
    await expect(page.getByText(/1\. Testing Center/i)).toBeVisible();
    await expect(page.getByText(/2\. Application Office/i)).toBeVisible();
    await expect(page.getByText(/3\. School Assignment/i)).toBeVisible();
    await expect(page.getByText(/4\. Room Assignment/i)).toBeVisible();
  });

  test("filters testing centers by session and region, showing amendment history", async ({
    page,
  }) => {
    await page.goto("/cse/exam-guide");
    await page.waitForLoadState("networkidle");

    // Select the 9 August 2026 historical session
    const sessionSelect = page.getByLabel("Examination Session *");
    await expect(sessionSelect).toBeVisible();
    await sessionSelect.selectOption("session-2026-08-09");
    await expect(sessionSelect).toHaveValue("session-2026-08-09");

    // Select Region VIII (Eastern Visayas)
    const regionSelect = page.getByLabel("CSC Region *");
    await regionSelect.selectOption("region-8");
    await expect(regionSelect).toHaveValue("region-8");

    // Verify Calbayog City is displayed with transfer history
    await expect(page.getByRole("heading", { name: "Calbayog City" })).toBeVisible();
    await expect(page.getByText(/Transferred from Catbalogan City/i)).toBeVisible();

    // Verify Catbalogan City is preserved with Superseded notice
    await expect(page.getByRole("heading", { name: "Catbalogan City" })).toBeVisible();
    await expect(page.getByText(/Superseded/i)).toBeVisible();

    // Switch to Region V (Bicol Region)
    await regionSelect.selectOption("region-5");
    // Verify Masbate City is displayed with 'Added by Amendment'
    await expect(page.getByRole("heading", { name: "Masbate City" })).toBeVisible();
    await expect(page.getByText(/Added by Examination Announcement No. 04/i)).toBeVisible();

    // Switch to NCR
    await regionSelect.selectOption("ncr");
    // Verify Caloocan City shows removed status
    await expect(page.getByRole("heading", { name: "Caloocan City" })).toBeVisible();
    await expect(page.getByText(/Removed from the testing center list/i)).toBeVisible();
  });

  test("properly isolates Region I OCSEAS link and displays safe external portal links", async ({
    page,
  }) => {
    await page.goto("/cse/exam-guide");

    // Check Region I specific portal in official links
    const roiBadge = page.getByText("Region I Only");
    await expect(roiBadge).toBeVisible();
    await expect(page.getByRole("heading", { name: "Region I OCSEAS Applicant Login" })).toBeVisible();
    await expect(page.getByText(/Restricted to Region I applicants/i)).toBeVisible();

    // Check universal OCSEAS Selector link has no regional restriction badge
    const universalSelector = page.getByRole("heading", { name: /Select Your Region in CSC OCSEAS/i });
    await expect(universalSelector).toBeVisible();

    // Check eNOSA school assignment portal link
    const enosaHeading = page.getByRole("heading", { name: /Check Your School Assignment \(eNOSA\)/i });
    await expect(enosaHeading).toBeVisible();

    // Check login security helper is visible
    await expect(
      page.getByText(/Enter your CSC credentials only on a verified csc.gov.ph domain/i)
    ).toBeVisible();
  });

  test("opens sources and editorial audit trail panel", async ({ page }) => {
    await page.goto("/cse/exam-guide");
    await page.waitForLoadState("networkidle");

    const sourcesSection = page.locator("#sources");
    await expect(sourcesSection).toBeVisible();

    const expandBtn = sourcesSection.getByRole("button", { name: /View Sourced Documents/i });
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    // Sourced documents list should now be visible
    const sourcesList = sourcesSection.locator("#official-sources-list");
    await expect(sourcesList).toBeVisible();
    await expect(sourcesList.getByRole("heading", { name: /Calendar of Civil Service Examinations through Pen and Paper Test for CY 2027/i })).toBeVisible();
    await expect(sourcesList.getByRole("heading", { name: /Examination Announcement No. 03, s. 2026/i })).toBeVisible();
    await expect(sourcesList.getByRole("heading", { name: /Examination Announcement No. 04, s. 2026/i })).toBeVisible();
  });

  test("responsive mobile viewport interactions and anchor navigation", async ({ page }) => {
    // Test on mobile viewport (iPhone 13 width)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/cse/exam-guide");

    // Verify urgent advisory appears at the top
    await expect(page.getByText(/Urgent: Weather Suspension/i)).toBeVisible();

    // Verify hero and quick jump buttons work on mobile
    const findTestingCentersBtn = page.getByRole("link", { name: /Find Testing Centers/i });
    await expect(findTestingCentersBtn).toBeVisible();
    await findTestingCentersBtn.click();

    // Verify we scrolled to testing center finder
    await expect(page.getByRole("heading", { name: "Testing-Center Finder" })).toBeVisible();

    // Verify mobile header menu contains Exam Info
    const mobileMenuBtn = page.getByRole("button", { name: /Open navigation menu/i });
    await mobileMenuBtn.click();

    const mobileExamGuideLink = page.getByRole("link", { name: "Exam Info", exact: true });
    await expect(mobileExamGuideLink).toBeVisible();
  });
});
