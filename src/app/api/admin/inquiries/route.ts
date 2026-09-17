import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { timingSafeEqual } from "node:crypto";

const VALID_STATUSES = ["unread", "read", "resolved"] as const;
const VALID_CATEGORIES = ["correction", "technical", "privacy", "content", "other"] as const;

function securelyMatches(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

function isAuthorized(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;

  const authHeader = req.headers.get("authorization");
  const providedKey = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : req.headers.get("x-admin-key");

  return Boolean(providedKey && securelyMatches(providedKey, adminKey));
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");
  const categoryFilter = searchParams.get("category");
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number.parseInt(searchParams.get("pageSize") || "50", 10) || 50)
  );

  if (statusFilter && !VALID_STATUSES.includes(statusFilter as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
  }
  if (categoryFilter && !VALID_CATEGORIES.includes(categoryFilter as (typeof VALID_CATEGORIES)[number])) {
    return NextResponse.json({ error: "Invalid category filter" }, { status: 400 });
  }

  try {
    const conditions: SQL[] = [];
    if (statusFilter) {
      conditions.push(eq(schema.contactInquiries.status, statusFilter));
    }
    if (categoryFilter) {
      conditions.push(eq(schema.contactInquiries.category, categoryFilter));
    }

    const inquiries = await db
      .select()
      .from(schema.contactInquiries)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(schema.contactInquiries.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return NextResponse.json(
      { success: true, inquiries, pagination: { page, pageSize } },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADMIN_INQUIRIES] Failed to fetch inquiries:", error);
    return NextResponse.json({ error: "Failed to retrieve inquiries" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
    }

    const updated = await db
      .update(schema.contactInquiries)
      .set({ status })
      .where(eq(schema.contactInquiries.id, id))
      .returning({ id: schema.contactInquiries.id, status: schema.contactInquiries.status });

    if (updated.length === 0) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated[0] }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_INQUIRIES] Failed to update inquiry status:", error);
    return NextResponse.json({ error: "Failed to update inquiry status" }, { status: 500 });
  }
}
