/**
 * Study-plan domain utilities.
 *
 * Date handling: all "today" logic is anchored to Asia/Manila (PHT, UTC+8),
 * matching LocalStorageService.getTodayString(), so streaks, daily item
 * counts, the exam countdown, and the weekly plan agree on where midnight
 * falls regardless of the visitor's device timezone.
 */

export const STUDY_TIME_ZONE = "Asia/Manila";

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Returns the YYYY-MM-DD "today" string in Asia/Manila. */
export function getManilaTodayString(d = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: STUDY_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }
}

/**
 * Parses YYYY-MM-DD into a Date at Manila midnight (UTC+8).
 * Returns null for malformed or impossible dates.
 */
export function parseManilaDate(iso: string): Date | null {
  if (!ISO_DATE_PATTERN.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00+08:00`);
  if (Number.isNaN(d.getTime())) return null;
  // Roll-over guard rejects impossible calendar dates like 2027-02-31
  const roundTrip = new Intl.DateTimeFormat("en-CA", {
    timeZone: STUDY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  if (roundTrip !== iso) return null;
  return d;
}

/**
 * Whole-day difference between a YYYY-MM-DD target date and Manila today.
 * Negative when the date is in the past. Returns null for invalid input.
 */
export function daysUntilManila(iso: string, now = new Date()): number | null {
  const target = parseManilaDate(iso);
  if (!target) return null;
  const today = parseManilaDate(getManilaTodayString(now));
  if (!today) return null;
  return Math.round((target.getTime() - today.getTime()) / 864e5);
}

/** Formats a YYYY-MM-DD date in Manila time. Long form by default. */
export function formatManilaDate(iso: string, long = true): string {
  const d = parseManilaDate(iso);
  if (!d) return iso;
  return d.toLocaleDateString("en-US", {
    timeZone: STUDY_TIME_ZONE,
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Adds n days to a YYYY-MM-DD string, clamped to valid calendar dates. */
export function addDaysIso(iso: string, days: number): string | null {
  const d = parseManilaDate(iso);
  if (!d) return null;
  return getManilaTodayString(new Date(d.getTime() + days * 864e5));
}

/** Day of week (0 = Sunday, 6 = Saturday) for a YYYY-MM-DD date. */
export function dayOfWeekIso(iso: string): number | null {
  const d = parseManilaDate(iso);
  if (!d) return null;
  return Number(
    new Intl.DateTimeFormat("en-US", { timeZone: STUDY_TIME_ZONE, weekday: "short" })
      .format(d)
      .replace("Sun", "0")
      .replace("Mon", "1")
      .replace("Tue", "2")
      .replace("Wed", "3")
      .replace("Thu", "4")
      .replace("Fri", "5")
      .replace("Sat", "6")
  );
}

/**
 * Returns the ISO date of the first day (Sunday) of the week containing
 * `iso`. Used to align the weekly plan and activity heatmap grids.
 */
export function startOfWeekIso(iso: string): string | null {
  const dow = dayOfWeekIso(iso);
  if (dow === null) return null;
  return addDaysIso(iso, -dow);
}
