/**
 * Google AdSense Publisher & Slot Resolution Utilities
 */

/**
 * Validates whether a given string is a genuine, syntactically valid Google AdSense Publisher ID.
 * Format: ca-pub-XXXXXXXXXXXXXXXX or pub-XXXXXXXXXXXXXXXX (16 numeric digits).
 * Rejects empty, non-16-digit, or placeholder values (like all zeroes).
 */
export function isValidPublisherId(clientId?: string | null): boolean {
  if (!clientId) return false;
  const trimmed = clientId.trim();
  const match = trimmed.match(/^(?:ca-)?pub-(\d{16})$/);
  if (!match) return false;
  const digits = match[1];
  if (/^0+$/.test(digits)) return false;
  return true;
}

/**
 * Formats a valid publisher ID into "pub-XXXXXXXXXXXXXXXX" standard format.
 * Returns null if the provided ID is invalid or placeholder.
 */
export function formatPublisherId(clientId?: string | null): string | null {
  if (!isValidPublisherId(clientId)) {
    return null;
  }
  const trimmed = clientId!.trim();
  if (trimmed.startsWith("ca-pub-")) {
    return trimmed.replace(/^ca-/, "");
  }
  if (!trimmed.startsWith("pub-")) {
    return `pub-${trimmed}`;
  }
  return trimmed;
}

/**
 * Generates the content of /ads.txt.
 * If a valid publisher ID is present, generates the authorized Google direct seller line.
 * If no valid publisher ID is configured, serves comments only to prevent publishing
 * invalid/dummy seller records to AdSense crawlers (ADS-03).
 */
export function generateAdsTxtContent(clientId?: string | null): string {
  const pubId = formatPublisherId(clientId);

  const lines = [
    "# reviewtayo.online — Google AdSense Authorized Digital Sellers (ads.txt)",
    "# See: https://support.google.com/adsense/answer/7532444",
  ];

  if (!pubId) {
    lines.push(
      "# Note: No active Google AdSense Publisher ID is configured.",
      "# Set NEXT_PUBLIC_ADSENSE_CLIENT_ID (format: ca-pub-XXXXXXXXXXXXXXXX) in production environment variables once issued.",
      "# Do not publish dummy seller records to ensure policy compliance."
    );
    return lines.join("\n") + "\n";
  }

  lines.push(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0`);
  return lines.join("\n") + "\n";
}

/**
 * Resolves a valid numeric AdSense slot ID from either:
 * 1. An explicit numeric slot ID string (8 to 15 digits), or
 * 2. An environment variable mapped from a semantic slot name.
 * Returns null if no numeric slot ID is found.
 */
export function resolveAdSlotId(slotOrName?: string): string | null {
  if (!slotOrName) return null;
  const trimmed = slotOrName.trim();

  // If already a numeric string (real AdSense unit ID)
  if (/^\d{8,15}$/.test(trimmed)) {
    return trimmed;
  }

  // Check dynamic environment mappings
  let mapped: string | undefined;
  switch (trimmed) {
    case "homepage-bottom":
      mapped =
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE_BOTTOM;
      break;
    case "articles-catalog-bottom":
      mapped =
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLES ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLES_BOTTOM;
      break;
    case "article-page-bottom":
      mapped =
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_DETAIL ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_PAGE_BOTTOM;
      break;
    case "guides-catalog-bottom":
      mapped =
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDES ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDES_BOTTOM;
      break;
    case "guide-page-bottom":
      mapped =
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_DETAIL ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_PAGE_BOTTOM;
      break;
    case "faq-page-bottom":
      mapped =
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_FAQ ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_FAQ_BOTTOM;
      break;
    case "exam-info-middle":
      mapped =
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXAM_INFO ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXAM_INFO_MIDDLE;
      break;
    case "practice-directory-bottom":
      mapped =
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_PRACTICE ||
        process.env.NEXT_PUBLIC_ADSENSE_SLOT_PRACTICE_BOTTOM;
      break;
    default:
      mapped =
        process.env[
          `NEXT_PUBLIC_ADSENSE_SLOT_${trimmed.toUpperCase().replace(/-/g, "_")}`
        ];
  }

  if (mapped && /^\d{8,15}$/.test(mapped.trim())) {
    return mapped.trim();
  }

  return null;
}
