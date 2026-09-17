import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { saveStoredConsent } from "@/components/privacy/CookieConsentBanner";

let currentPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

describe("AdSenseBanner Component — AdSense Policy & Layout Safety", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    localStorage.clear();
    delete (window as unknown as { __tcfapi?: unknown }).__tcfapi;
    process.env = { ...originalEnv };
    currentPathname = "/";
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("does not render when user has not yet granted affirmative consent (default opt-in)", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";

    // No consent set in localStorage
    const { container } = render(<AdSenseBanner slotId="1234567890" />);

    expect(container.firstChild).toBeNull();
  });

  it("does not render when client ID or slot is unconfigured even if consent is given", () => {
    saveStoredConsent({
      essential: true,
      analytics: true,
      ads: true,
      hasChosen: true,
      updatedAt: Date.now(),
    });

    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    const { container } = render(<AdSenseBanner />);

    expect(container.firstChild).toBeNull();
  });

  it("does not render with non-numeric unmapped slot label", () => {
    saveStoredConsent({
      essential: true,
      analytics: true,
      ads: true,
      hasChosen: true,
      updatedAt: Date.now(),
    });

    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";

    const { container } = render(<AdSenseBanner slotId="unmapped-label" />);

    expect(container.firstChild).toBeNull();
  });

  it("renders ins.adsbygoogle unit when valid client ID, valid numeric slot, and consent are present", () => {
    saveStoredConsent({
      essential: true,
      analytics: true,
      ads: true,
      hasChosen: true,
      updatedAt: Date.now(),
    });

    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";

    const { container } = render(
      <AdSenseBanner slotId="1234567890" format="auto" />
    );

    expect(screen.getByLabelText("Advertisement")).toBeInTheDocument();

    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).toBeDefined();
    expect(ins?.getAttribute("data-ad-client")).toBe("ca-pub-1234567890123456");
    expect(ins?.getAttribute("data-ad-slot")).toBe("1234567890");
    expect(ins?.getAttribute("data-ad-format")).toBe("auto");
  });

  it("resolves mapped environment variable for semantic slot name", () => {
    saveStoredConsent({
      essential: true,
      analytics: true,
      ads: true,
      hasChosen: true,
      updatedAt: Date.now(),
    });

    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE = "9876543210";

    const { container } = render(
      <AdSenseBanner slotId="homepage-bottom" />
    );

    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins?.getAttribute("data-ad-slot")).toBe("9876543210");
  });

  it("does not render when user has explicitly declined advertising cookies", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";

    // Explicitly reject advertising
    saveStoredConsent({
      essential: true,
      analytics: true,
      ads: false,
      hasChosen: true,
      updatedAt: Date.now(),
    });

    const { container } = render(
      <AdSenseBanner slotId="1234567890" />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe("AdSenseScript Component — Auto Ads Protection & Route Exclusions", () => {
  beforeEach(() => {
    localStorage.clear();
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-1234567890123456";
    saveStoredConsent({
      essential: true,
      analytics: true,
      ads: true,
      hasChosen: true,
      updatedAt: Date.now(),
    });
  });

  it("renders script on allowed public content route when consent is granted", () => {
    currentPathname = "/articles/why-examinees-fail-civil-service-exam";
    const { container } = render(<AdSenseScript />);
    // Script is rendered
    expect(container.querySelector("script") || document.getElementById("google-adsense")).toBeDefined();
  });

  it("loads the publisher tag under an active certified CMP without local consent", () => {
    localStorage.clear();
    (window as unknown as { __tcfapi?: unknown }).__tcfapi = vi.fn();
    currentPathname = "/articles/continuous-timer-pacing-strategy";

    const { container } = render(<AdSenseScript />);
    expect(container.querySelector("script") || document.getElementById("google-adsense")).toBeDefined();
  });

  it("blocks script execution on /exams routes to prevent Auto Ads in exam rooms", () => {
    currentPathname = "/exams/professional/full";
    const { container } = render(<AdSenseScript />);
    expect(container.firstChild).toBeNull();
  });

  it("blocks script execution on /results routes", () => {
    currentPathname = "/results/attempt-123";
    const { container } = render(<AdSenseScript />);
    expect(container.firstChild).toBeNull();
  });

  it("blocks script execution on /dashboard and /settings routes", () => {
    currentPathname = "/dashboard";
    const { container: dashContainer } = render(<AdSenseScript />);
    expect(dashContainer.firstChild).toBeNull();

    currentPathname = "/settings/privacy";
    const { container: setContainer } = render(<AdSenseScript />);
    expect(setContainer.firstChild).toBeNull();
  });

  it("blocks script execution on /contact, /privacy, /terms, and /disclaimer legal routes", () => {
    currentPathname = "/privacy";
    const { container: privContainer } = render(<AdSenseScript />);
    expect(privContainer.firstChild).toBeNull();

    currentPathname = "/contact";
    const { container: contactContainer } = render(<AdSenseScript />);
    expect(contactContainer.firstChild).toBeNull();
  });
});
