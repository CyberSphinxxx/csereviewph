import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { contactRateLimiter, hashIpAddress, isDurableRateLimited } from "@/lib/rate-limit";
import { deleteExpiredContactInquiries } from "@/lib/contact/retention";
import { randomUUID } from "node:crypto";

interface ContactSubmission {
  name: string;
  email: string;
  category: string;
  message: string;
  botField?: string; // Honeypot field
}

const ALLOWED_CATEGORIES = [
  "correction",
  "technical",
  "privacy",
  "content",
  "other",
] as const;

export async function POST(req: NextRequest) {
  try {
    const hasDbConfig = Boolean(
      process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        process.env.POSTGRES_PRISMA_URL
    );

    if (
      !hasDbConfig ||
      !process.env.CONTACT_IP_HASH_SALT ||
      process.env.CONTACT_IP_HASH_SALT.length < 32
    ) {
      return NextResponse.json(
        {
          error:
            "The message service is temporarily unavailable due to database maintenance. Please send your inquiry directly to contact@reviewtayo.online.",
        },
        { status: 503 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const ipHash = hashIpAddress(ip);

    // 1. Rate limiting check (Fast in-memory pre-filter + durable DB cross-instance check)
    let durableRateLimited = false;
    try {
      durableRateLimited = await isDurableRateLimited(ipHash);
    } catch (error) {
      console.error("[Contact] Durable rate-limit check failed:", error);
      return NextResponse.json(
        { error: "The message service is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    if (contactRateLimiter.isRateLimited(ipHash) || durableRateLimited) {
      return NextResponse.json(
        {
          error:
            "Too many submissions from this connection. Please wait 15 minutes before sending another inquiry.",
        },
        { status: 429 }
      );
    }

    const body = (await req.json()) as Partial<ContactSubmission>;

    // 2. Honeypot spam trap
    if (body.botField && body.botField.trim().length > 0) {
      return NextResponse.json(
        { error: "Spam submission detected." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "other";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // 3. Input validation
    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Please enter a valid name (2–100 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 120) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!ALLOWED_CATEGORIES.includes(category as (typeof ALLOWED_CATEGORIES)[number])) {
      return NextResponse.json(
        { error: "Please select a valid inquiry category." },
        { status: 400 }
      );
    }

    if (!message || message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: "Please provide a message between 10 and 5,000 characters." },
        { status: 400 }
      );
    }

    const referenceId = `ref_${randomUUID()}`;
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // Strict 90-day retention

    // 4. Persistence into PostgreSQL with 90-day retention
    // Critical: Do NOT return success if database is unavailable or write fails (Finding 2)
    try {
      await db.insert(schema.contactInquiries).values({
        id: referenceId,
        name,
        email,
        category,
        message,
        status: "unread",
        ipHash,
        expiresAt,
      });
    } catch (dbErr) {
      console.error(
        `[Contact] Database insert failed for ref ${referenceId}:`,
        dbErr instanceof Error ? dbErr.message : dbErr
      );
      return NextResponse.json(
        {
          error:
            "Could not save your message due to a database error. Please try again or email contact@reviewtayo.online directly.",
        },
        { status: 503 }
      );
    }

    // 5. Operator notification dispatch (if webhook configured).
    // Only non-PII routing metadata leaves the application database.
    if (process.env.CONTACT_WEBHOOK_URL) {
      try {
        const notificationResponse = await fetch(process.env.CONTACT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "contact_inquiry",
            referenceId,
            category,
            createdAt: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(3000),
        });
        if (!notificationResponse.ok) {
          console.warn(
            `[Contact] Notification webhook returned ${notificationResponse.status} for ref ${referenceId}`
          );
        }
      } catch (error) {
        console.warn(
          `[Contact] Notification webhook failed for ref ${referenceId}:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    // 6. Opportunistic cleanup supplements the authenticated daily cron.
    try {
      await deleteExpiredContactInquiries();
    } catch (error) {
      console.warn(
        `[Contact] Opportunistic retention cleanup failed for ref ${referenceId}:`,
        error instanceof Error ? error.message : error
      );
    }

    // 7. Auditing log with PII redaction (Email & Name NOT stored in raw console log)
    console.info(
      `[CONTACT_SUBMISSION] [${new Date().toISOString()}] Category: ${category} | Ref: ${referenceId} | DB: saved | MsgLen: ${message.length} | (Personal data redacted per RA 10173, retained for 90 days)`
    );

    return NextResponse.json(
      {
        success: true,
        referenceId,
        retentionDays: 90,
        message: `Your inquiry has been recorded (Reference: ${referenceId}). It will be reviewed by our editorial and technical support team.`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to process contact submission. Please try again or email us directly at contact@reviewtayo.online.",
      },
      { status: 500 }
    );
  }
}
