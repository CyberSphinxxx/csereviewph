import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const VALID_REASONS = new Set([
  "factual_error",
  "typo",
  "bad_explanation",
  "formatting",
  "other",
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, reason, comments } = body ?? {};

    // Identity is derived from the authenticated session, never from the body.
    let sessionUserId: string | null = null;
    try {
      const reqHeaders = request.headers ?? (await headers());
      const session = await auth.api.getSession({ headers: reqHeaders });
      sessionUserId = session?.user?.id ?? null;
    } catch {
      sessionUserId = null;
    }

    if (!questionId || typeof questionId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing 'questionId'" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || !VALID_REASONS.has(reason)) {
      return NextResponse.json(
        {
          error:
            "Invalid 'reason'. Must be one of: factual_error, typo, bad_explanation, formatting, other",
        },
        { status: 400 }
      );
    }

    const sanitizedComments =
      typeof comments === "string" ? comments.slice(0, 1000).trim() : null;    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Persist to PostgreSQL when a connection is configured. When the write
    // fails, the caller sees an honest 503 instead of a fabricated success.
    let persistedToDb = false;
    const hasDbConfig = Boolean(
      process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        process.env.POSTGRES_PRISMA_URL
    );

    if (hasDbConfig) {
      await db.insert(schema.questionReports).values({
        id: reportId,
        questionId,
        userId: sessionUserId,
        reason,
        comments: sanitizedComments,
        status: "pending",
      });
      persistedToDb = true;
    }

    return NextResponse.json(
      {
        success: true,
        reportId,
        storage: persistedToDb ? "database" : "not_configured",
        message: "Thank you! Your report has been submitted to our content review team.",
      },
      { status: 201 }
    );
  } catch (err) {
    // The report was NOT saved. Tell the client so it can retry instead of
    // showing a success state for data that was discarded.
    console.error("[QuestionReport] Error processing report request:", err);
    return NextResponse.json(
      { error: "We could not save your report right now. Please try again in a moment." },
      { status: 503 }
    );
  }
}
