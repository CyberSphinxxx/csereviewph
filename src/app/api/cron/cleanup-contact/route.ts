import { NextRequest, NextResponse } from "next/server";
import { deleteExpiredContactInquiries } from "@/lib/contact/retention";

export async function GET(req: NextRequest) {
  return handleCleanup(req);
}

export async function POST(req: NextRequest) {
  return handleCleanup(req);
}

async function handleCleanup(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!cronSecret) {
    return NextResponse.json(
      { error: "Retention cleanup is not configured" },
      { status: 503 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deletedCount = await deleteExpiredContactInquiries();
    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedCount} expired contact inquiries.`,
      deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON_CLEANUP_CONTACT] Failed to purge expired inquiries:", error);
    return NextResponse.json(
      { error: "Internal error during retention cleanup" },
      { status: 500 }
    );
  }
}
