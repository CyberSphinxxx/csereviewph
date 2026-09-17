import { test, expect } from "@playwright/test";

test.describe("AdSense & Privacy Browser Verification", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start with a fresh unchosen visitor state
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.clear());
  });

  test("1. Cookie consent flow: Customize, Accept All, Reopen, Essential Only, and Granular Save", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Banner should be visible for unchosen visitor
    const banner = page.locator("#cookie-consent-banner");
    await expect(banner).toBeVisible();

    // 1A. Click 'Customize' to open preferences modal
    const customizeBtn = page.getByRole("button", { name: /Customize/i });
    await expect(customizeBtn).toBeVisible();
    await customizeBtn.click();

    // Preferences panel shows Strictly Essential and customizable toggles
    await expect(banner.getByText("Strictly Essential")).toBeVisible();
    await expect(banner.getByText("Required", { exact: true })).toBeVisible();

    const analyticsCheckbox = banner.locator("#cookie-analytics-toggle");
    await expect(analyticsCheckbox).toBeVisible();

    const adsCheckbox = banner.locator("#cookie-ads-toggle");
    await expect(adsCheckbox).toBeVisible();

    // Close settings dialog via X button
    const closeSettingsBtn = banner.getByRole("button", { name: /Close preferences/i });
    await closeSettingsBtn.click();

    // 1B. Test Accept All from main banner
    const acceptAllBtn = banner.getByRole("button", { name: /Accept All/i });
    await acceptAllBtn.click();
    await expect(banner).toBeHidden();

    // Verify stored consent in localStorage
    const consentAfterAccept = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("csereviewer_cookie_consent") || "{}");
    });
    expect(consentAfterAccept.hasChosen).toBe(true);
    expect(consentAfterAccept.ads).toBe(true);
    expect(consentAfterAccept.analytics).toBe(true);

    // 1C. Reopen preferences via footer button
    const reopenBtn = page.getByRole("button", { name: /Cookie & Ad Preferences/i });
    await reopenBtn.scrollIntoViewIfNeeded();
    await reopenBtn.click();
    await expect(banner).toBeVisible();

    // 1D. Test Essential Only (Reject Non-Essential in modal)
    const rejectNonEssentialBtn = banner.getByRole("button", { name: /Reject Non-Essential/i });
    await rejectNonEssentialBtn.click();
    await expect(banner).toBeHidden();

    const consentAfterEssential = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("csereviewer_cookie_consent") || "{}");
    });
    expect(consentAfterEssential.hasChosen).toBe(true);
    expect(consentAfterEssential.ads).toBe(false);
    expect(consentAfterEssential.analytics).toBe(false);

    // 1E. Reopen again and test Granular Save (Analytics: ON, Ads: OFF)
    await reopenBtn.scrollIntoViewIfNeeded();
    await reopenBtn.click();
    await expect(banner).toBeVisible();

    const analyticsToggle = banner.locator("#cookie-analytics-toggle");
    await analyticsToggle.check();
    expect(await analyticsToggle.isChecked()).toBe(true);

    const adsToggle = banner.locator("#cookie-ads-toggle");
    await adsToggle.uncheck();
    expect(await adsToggle.isChecked()).toBe(false);

    const savePreferencesBtn = banner.getByRole("button", { name: /Save My Preferences/i });
    await savePreferencesBtn.click();
    await expect(banner).toBeHidden();

    const consentAfterGranular = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem("csereviewer_cookie_consent") || "{}");
    });
    expect(consentAfterGranular.hasChosen).toBe(true);
    expect(consentAfterGranular.ads).toBe(false);
    expect(consentAfterGranular.analytics).toBe(true);
  });

  test("2. Privacy policy displays TCF v2.3 and contact-retention/IP-hash disclosure", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /Privacy Policy/i, level: 1 })).toBeVisible();

    // Check visible text for TCF v2.3 and contact disclosures
    const mainContent = await page.locator("main").textContent();
    expect(mainContent).toContain("TCF v2.3");
    expect(mainContent).toContain("90 days");
    expect(mainContent).toContain("salted, one-way hash of the submitting IP address");
    expect(mainContent).toContain("abuse prevention");
  });

  test("3. Restricted routes strictly do NOT inject AdSense scripts", async ({ page }) => {
    const restrictedRoutes = [
      "/exams/professional/full",
      "/practice/top-pro-grammar",
      "/results/test",
      "/dashboard",
      "/settings",
      "/sign-in",
      "/contact",
      "/privacy",
      "/terms",
      "/disclaimer",
    ];

    for (const route of restrictedRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      // Verify no Google AdSense script tags are present in DOM
      const adScriptCount = await page.locator('script[src*="pagead2.googlesyndication.com"]').count();
      const adsbygoogleScriptCount = await page.locator('script[src*="adsbygoogle"]').count();

      expect(adScriptCount, `AdSense script found on restricted route: ${route}`).toBe(0);
      expect(adsbygoogleScriptCount, `adsbygoogle script found on restricted route: ${route}`).toBe(0);
    }
  });

  test("4. Allowed content route (/articles) does not inject AdSense without client ID & consent", async ({ page }) => {
    await page.goto("/articles/why-examinees-fail-civil-service-exam", { waitUntil: "domcontentloaded" });

    // In local dev without NEXT_PUBLIC_ADSENSE_CLIENT_ID, no AdSense script should be injected
    const adScriptCount = await page.locator('script[src*="pagead2.googlesyndication.com"]').count();
    expect(adScriptCount).toBe(0);

    // Verify article loads correctly
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("5. Local SEO endpoints: /ads.txt, /robots.txt, and /sitemap.xml", async ({ request }) => {
    // /ads.txt
    const adsTxt = await request.get("/ads.txt");
    expect(adsTxt.status()).toBe(200);
    const adsTxtBody = await adsTxt.text();
    expect(adsTxtBody).toContain("reviewtayo.online");
    expect(adsTxtBody).toContain("No active Google AdSense Publisher ID is configured");
    expect(adsTxtBody).not.toContain("pub-0000000000000000");

    // /robots.txt
    const robotsTxt = await request.get("/robots.txt");
    expect(robotsTxt.status()).toBe(200);
    const robotsTxtBody = await robotsTxt.text();
    expect(robotsTxtBody).toContain("Disallow: /exams/");
    expect(robotsTxtBody).toContain("User-Agent: Mediapartners-Google");
    expect(robotsTxtBody).toContain("Allow: /");

    // /sitemap.xml
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain("<urlset");
    expect(sitemapBody).not.toContain("/exams/");
    expect(sitemapBody).not.toContain("/dashboard");
    expect(sitemapBody).toContain("/articles");
    expect(sitemapBody).toContain("/guides");
  });
});
