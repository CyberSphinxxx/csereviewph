import { pgTable, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Contact Inquiries Table
 * Stores verified contact inquiries, error reports, and privacy requests.
 * Explicitly bounded by a 90-day retention period (expires_at) per RA 10173 principles.
 * Includes anonymized SHA-256 ip_hash for durable cross-serverless rate limiting without storing raw IP PII.
 */
export const contactInquiries = pgTable(
  "contact_inquiries",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 120 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 20 }).default("unread").notNull(),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("idx_contact_inquiries_expires_at").on(table.expiresAt),
    index("idx_contact_inquiries_ip_created").on(table.ipHash, table.createdAt),
    index("idx_contact_inquiries_status").on(table.status),
  ]
);
