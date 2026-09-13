import type { Metadata } from "next";
import "./globals.css";
import { getBaseUrl } from "@/lib/env";
import { CookieConsentBanner } from "@/components/privacy/CookieConsentBanner";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

import { ThemeProvider } from "@/components/providers/ThemeProvider";

const baseUrl = getBaseUrl();
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "csereviewph.com — Philippine Civil Service Exam Reviewer",
    template: "%s | csereviewph.com",
  },
  description:
    "Comprehensive, 100% original Philippine Civil Service Examination (CSE-PPT) preparation platform. Practice Professional & Subprofessional mock tests with real continuous timers, detailed concept rationales, and mistake analytics.",
  keywords: [
    "csereviewph.com",
    "Civil Service Exam",
    "CSE Reviewer",
    "CSE Professional",
    "CSE Subprofessional",
    "Philippine Civil Service Commission",
    "Civil Service Mock Exam",
    "CSE Reviewer 2026",
    "Civil Service Reviewer Philippines",
    "CSC PPT reviewer",
    "RA 6713 reviewer",
    "Philippine Constitution reviewer",
  ],
  authors: [{ name: "csereviewph.com Editorial Team" }],
  creator: "csereviewph.com",
  publisher: "csereviewph.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: baseUrl,
    siteName: "csereviewph.com",
    title: "csereviewph.com — Free Civil Service Exam Mock Tests & Practice",
    description:
      "Pass the Philippine Civil Service Examination with confidence. Full 170-item mock tests, continuous timers, and detailed explanations for Filipino civil service examinees.",
  },
  twitter: {
    card: "summary_large_image",
    title: "csereviewph.com — Civil Service Exam Reviewer",
    description:
      "Pass the Philippine Civil Service Examination with confidence. Free, 100% original, and syllabus-aligned mock tests.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: adsenseClientId
    ? {
        "google-adsense-account": adsenseClientId,
      }
    : {},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "csereviewph.com",
    url: baseUrl,
    description:
      "Comprehensive, 100% original Philippine Civil Service Examination (CSE-PPT) preparation platform.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/practice?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#090d16" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('csereviewph_user_preferences_v1');if(p){var parsed=JSON.parse(p);var t=parsed&&parsed.appearance&&parsed.appearance.theme;var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t==='system'&&m)){document.documentElement.classList.add('dark');}}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white flex flex-col transition-colors duration-150">
        <ThemeProvider>
          <NavigationProgress />
          {children}
          <CookieConsentBanner />
          <AdSenseScript />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
