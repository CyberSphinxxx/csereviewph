import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const protectedRoutes = [
    "/api/",
    "/dashboard/",
    "/results/",
    "/exams/",
    "/settings/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: protectedRoutes,
      },
      {
        // Googlebot uses the most specific matching block and does not inherit global '*' disallows.
        // Explicitly repeat private routes to ensure Googlebot respects crawl restrictions.
        userAgent: "Googlebot",
        allow: "/",
        disallow: protectedRoutes,
      },
      {
        // Google AdSense crawler must have unrestricted access to analyze pages for ad serving
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
    ],
    sitemap: getCanonicalUrl("/sitemap.xml"),
  };
}
