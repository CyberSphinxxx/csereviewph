import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  CookieConsentBanner,
  getStoredConsent,
  saveStoredConsent,
  type CookieConsentState,
} from "@/components/privacy/CookieConsentBanner";

describe("CookieConsentBanner Component — RA 10173 & AdSense Consent", () => {
  beforeEach(() => {
    localStorage.clear();
    delete (window as unknown as { __tcfapi?: unknown }).__tcfapi;
    vi.restoreAllMocks();
  });

  it("renders consent banner when no prior consent exists", async () => {
    render(<CookieConsentBanner />);

    expect(
      screen.getByRole("region", { name: /Cookie and Privacy Consent/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Privacy & Ad Transparency Notice/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Accept All/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Essential Only/i })
    ).toBeInTheDocument();
  });

  it("saves full consent when 'Accept All' is clicked", async () => {
    render(<CookieConsentBanner />);

    const acceptBtn = screen.getByRole("button", { name: /Accept All/i });
    fireEvent.click(acceptBtn);

    const saved = getStoredConsent();
    expect(saved).toBeDefined();
    expect(saved?.essential).toBe(true);
    expect(saved?.analytics).toBe(true);
    expect(saved?.ads).toBe(true);
    expect(saved?.hasChosen).toBe(true);

    // Banner should hide
    expect(
      screen.queryByRole("region", { name: /Cookie and Privacy Consent/i })
    ).not.toBeInTheDocument();
  });

  it("saves essential-only consent when 'Essential Only' is clicked", async () => {
    render(<CookieConsentBanner />);

    const declineBtn = screen.getByRole("button", { name: /Essential Only/i });
    fireEvent.click(declineBtn);

    const saved = getStoredConsent();
    expect(saved).toBeDefined();
    expect(saved?.essential).toBe(true);
    expect(saved?.analytics).toBe(false);
    expect(saved?.ads).toBe(false);
    expect(saved?.hasChosen).toBe(true);
  });

  it("does not display initial banner if user has already chosen", () => {
    const priorConsent: CookieConsentState = {
      essential: true,
      analytics: true,
      ads: true,
      hasChosen: true,
      updatedAt: Date.now(),
    };
    saveStoredConsent(priorConsent);

    render(<CookieConsentBanner />);

    expect(
      screen.queryByRole("region", { name: /Cookie and Privacy Consent/i })
    ).not.toBeInTheDocument();
  });

  it("reopens preferences modal when open-cookie-settings event is received", async () => {
    const priorConsent: CookieConsentState = {
      essential: true,
      analytics: false,
      ads: false,
      hasChosen: true,
      updatedAt: Date.now(),
    };
    saveStoredConsent(priorConsent);

    render(<CookieConsentBanner />);

    act(() => {
      window.dispatchEvent(new CustomEvent("open-cookie-settings"));
    });

    expect(
      screen.getByText(/Cookie & Advertising Preferences/i)
    ).toBeInTheDocument();
  });

  it("defers to a certified TCF CMP without creating blanket local ad consent", () => {
    (window as unknown as { __tcfapi?: unknown }).__tcfapi = vi.fn();

    render(<CookieConsentBanner />);

    expect(screen.queryByRole("region", { name: /Cookie and Privacy Consent/i })).not.toBeInTheDocument();
    expect(getStoredConsent()).toBeNull();
  });
});
