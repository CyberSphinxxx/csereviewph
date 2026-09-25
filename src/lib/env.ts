/**
 * Helper utilities for resolving deployment environment variables
 * and URLs dynamically across Vercel Preview, Production, and local environments.
 */

export function getBaseUrl(): string {
  // 1. Browser context: always use the current window location
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Explicit public app URL override
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const raw = process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
    if (raw.includes("reviewtayo.online") && !raw.includes("www.reviewtayo.online")) {
      return "https://www.reviewtayo.online";
    }
    return raw;
  }

  // 3. Better Auth configured URL
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL.replace(/\/+$/, "");
  }

  // 4. Vercel preview deployment URL (when specifically in preview mode)
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  // 5. Vercel production custom domain / canonical alias
  if (
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    !process.env.VERCEL_PROJECT_PRODUCTION_URL.endsWith(".vercel.app")
  ) {
    const raw = process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, "");
    if (raw.includes("reviewtayo.online") && !raw.includes("www.reviewtayo.online")) {
      return "https://www.reviewtayo.online";
    }
    return raw.startsWith("http") ? raw : `https://${raw}`;
  }

  // 6. Production fallback if no custom domain env is provided
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return "https://www.reviewtayo.online";
  }

  // 7. Vercel deployment URL (fallback for preview and branch deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  // 8. Local development fallback. Honors PORT so that `next dev -p <port>`
  // / PORT=<port> npm run dev resolve to the origin the server actually binds
  // (Windows may also silently rebind, so prefer explicit env overrides).
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function isVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

export function getEnvironment(): string {
  return process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
}

/**
 * The single, immutable production canonical origin for ReviewTayo.
 * Prevents canonical drift across preview branches and staging hosts.
 */
export const CANONICAL_ORIGIN = "https://www.reviewtayo.online";

/**
 * Generates an absolute canonical URL on the primary production origin.
 * Used exclusively for canonical link tags, XML sitemaps, and robots directives.
 */
export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${CANONICAL_ORIGIN}${cleanPath}`;
}
