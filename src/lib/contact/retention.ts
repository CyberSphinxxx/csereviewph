import { db, schema } from "@/db";
import { lte } from "drizzle-orm";

/**
 * Purges contact inquiries whose expires_at timestamp is at or before the cutoff date (default: now).
 * Strictly enforces the 90-day data retention limit per RA 10173 principles.
 * @returns The number of expired records deleted.
 */
export async function deleteExpiredContactInquiries(cutoffDate: Date = new Date()): Promise<number> {
  const hasDbConfig = Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL
  );

  if (!hasDbConfig) {
    return 0;
  }

  const deleted = await db
    .delete(schema.contactInquiries)
    .where(lte(schema.contactInquiries.expiresAt, cutoffDate))
    .returning({ id: schema.contactInquiries.id });

  return deleted.length;
}
