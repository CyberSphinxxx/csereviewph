import { createHash } from "node:crypto";
import { db, schema } from "@/db";
import { and, eq, gte, sql } from "drizzle-orm";

/**
 * In-memory sliding window rate limiter
 */
export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
}

export function createSlidingWindowRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
}) {
  const ipRequestHistory = new Map<string, number[]>();

  return {
    isRateLimited(key: string): boolean {
      const now = Date.now();
      const timestamps = ipRequestHistory.get(key) || [];
      const validTimestamps = timestamps.filter((t) => now - t < options.windowMs);

      if (validTimestamps.length >= options.maxRequests) {
        return true;
      }

      validTimestamps.push(now);
      ipRequestHistory.set(key, validTimestamps);
      return false;
    },
    reset(): void {
      ipRequestHistory.clear();
    },
  };
}

// Global fast-path in-memory limiter (Max 5 inquiries per IP per 15 minutes)
export const contactRateLimiter = createSlidingWindowRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

/**
 * Hashes an IP address using SHA-256 with a salt to ensure anonymity per RA 10173.
 * Raw IP is never stored in the database.
 */
export function hashIpAddress(ip: string): string {
  const salt = process.env.CONTACT_IP_HASH_SALT;
  if (!salt || salt.length < 32) {
    throw new Error("CONTACT_IP_HASH_SALT must be configured with at least 32 characters");
  }
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

/**
 * Checks durable rate limiting against PostgreSQL across all serverless instances.
 * Returns true if the hashed IP exceeded the threshold in the last 15 minutes.
 */
export async function isDurableRateLimited(
  ipHash: string,
  windowMs: number = 15 * 60 * 1000,
  maxRequests: number = 5
): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs);
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.contactInquiries)
    .where(
      and(
        eq(schema.contactInquiries.ipHash, ipHash),
        gte(schema.contactInquiries.createdAt, windowStart)
      )
    );

  const count = result[0]?.count ?? 0;
  return count >= maxRequests;
}
