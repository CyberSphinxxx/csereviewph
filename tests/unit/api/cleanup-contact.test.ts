import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/contact/retention", () => ({
  deleteExpiredContactInquiries: vi.fn().mockResolvedValue(3),
}));

import { GET } from "@/app/api/cron/cleanup-contact/route";

describe("Contact retention cleanup cron", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, CRON_SECRET: "cron-secret-for-tests" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("rejects requests without the Vercel bearer secret", async () => {
    const res = await GET(new NextRequest("http://localhost/api/cron/cleanup-contact"));
    expect(res.status).toBe(401);
  });

  it("fails closed when CRON_SECRET is not configured", async () => {
    delete process.env.CRON_SECRET;
    const res = await GET(new NextRequest("http://localhost/api/cron/cleanup-contact"));
    expect(res.status).toBe(503);
  });

  it("deletes expired records for an authenticated Vercel cron request", async () => {
    const req = new NextRequest("http://localhost/api/cron/cleanup-contact", {
      headers: { Authorization: "Bearer cron-secret-for-tests" },
    });
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.deletedCount).toBe(3);
  });
});
