"use client";

import { useEffect, useRef, useState } from "react";
import { getStoredConsent, type CookieConsentState } from "@/components/privacy/CookieConsentBanner";
import { isValidPublisherId, resolveAdSlotId } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export interface AdSenseBannerProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AdSenseBanner({
  slotId,
  format = "auto",
  responsive = true,
  className = "",
  style,
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  // Default to false: strictly opt-in under RA 10173 and Google Publisher Policies (ADS-04)
  const [adsAllowed, setAdsAllowed] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const numericSlotId = resolveAdSlotId(slotId);
  const isConfigured = Boolean(isValidPublisherId(clientId) && numericSlotId);

  useEffect(() => {
    // Check initial cookie consent: only allow ads if affirmatively consented
    const consent = getStoredConsent();
    if (consent && consent.hasChosen && consent.ads === true) {
      setAdsAllowed(true);
    } else {
      setAdsAllowed(false);
    }

    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsentState>;
      if (customEvent.detail) {
        setAdsAllowed(Boolean(customEvent.detail.hasChosen && customEvent.detail.ads));
      }
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    return () => {
      window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
    };
  }, []);

  useEffect(() => {
    if (!isConfigured || !adsAllowed) return;

    try {
      if (typeof window !== "undefined" && adRef.current) {
        if (!adLoaded) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      }
    } catch {
      // AdSense push errors are caught silently in preview/dev
    }
  }, [isConfigured, adsAllowed, adLoaded]);

  // If user has not consented or if unit is not configured with genuine credentials, render nothing (ADS-04, ADS-06)
  if (!adsAllowed || !isConfigured || !numericSlotId) {
    return null;
  }

  // Active production AdSense unit
  return (
    <aside
      aria-label="Advertisement"
      className={`my-6 mx-auto w-full max-w-4xl px-4 overflow-hidden ${className}`}
    >
      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase text-center mb-1">
        Advertisement
      </div>
      <div className="min-h-[100px] flex items-center justify-center bg-slate-50/50 rounded-lg overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", ...style }}
          data-ad-client={clientId}
          data-ad-slot={numericSlotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </aside>
  );
}
