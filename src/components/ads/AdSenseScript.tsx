"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { getStoredConsent, type CookieConsentState } from "@/components/privacy/CookieConsentBanner";
import { isValidPublisherId } from "@/lib/ads";

/**
 * Route prefixes where advertisements are strictly prohibited.
 * Prevents Google Auto Ads from executing in active examination rooms,
 * test runners, results screens, user accounts, and utility/legal pages.
 */
export const RESTRICTED_AD_ROUTES = [
  "/exams",
  "/practice",
  "/results",
  "/dashboard",
  "/settings",
  "/sign-in",
  "/create-account",
  "/forgot-password",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
];

interface AdSenseScriptProps {
  clientId?: string;
}

export function AdSenseScript({ clientId }: AdSenseScriptProps) {
  const pathname = usePathname();
  const effectiveClientId =
    clientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

  // Strictly opt-in: default to false until affirmative consent is confirmed (ADS-04, RA 10173)
  const [canLoadAds, setCanLoadAds] = useState(false);

  useEffect(() => {
    // Determine whether user has affirmatively consented to advertising cookies
    const checkConsent = () => {
      const win = window as unknown as { __tcfapi?: unknown };
      if (typeof win.__tcfapi === "function") {
        // The certified CMP's TCF signal is authoritative. Loading the publisher
        // tag lets Google read that signal; this does not grant local ad consent.
        setCanLoadAds(true);
        return;
      }
      const consent = getStoredConsent();
      if (consent && consent.hasChosen && consent.ads === true) {
        setCanLoadAds(true);
      } else {
        setCanLoadAds(false);
      }
    };

    checkConsent();

    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsentState>;
      if (customEvent.detail) {
        setCanLoadAds(Boolean(customEvent.detail.hasChosen && customEvent.detail.ads));
      }
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    return () => {
      window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
    };
  }, []);

  // Prohibit AdSense script execution on protected/private/examination routes
  const isRestricted = Boolean(
    pathname &&
      RESTRICTED_AD_ROUTES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
      )
  );

  if (isRestricted || !isValidPublisherId(effectiveClientId) || !canLoadAds) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${effectiveClientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
