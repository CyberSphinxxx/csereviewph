import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, PATCH } from "@/app/api/admin/inquiries/route";
import { NextRequest } from "next/server";

vi.mock("@/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              offset: vi.fn().mockResolvedValue([
                { id: "ref_1", name: "User 1", status: "unread", category: "correction" },
              ]),
            }),
          }),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: "ref_1", status: "resolved" }]),
        }),
      }),
    }),
  },
  schema: {
    contactInquiries: {
      id: "id",
      status: "status",
      category: "category",
      createdAt: "created_at",
    },
  },
}));

describe("Admin Inquiries API Handler (/api/admin/inquiries)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ADMIN_API_KEY: "secret_admin_key_123" };
  });

  it("returns 401 Unauthorized if no credentials provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 OK and inquiries list when valid bearer token provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries", {
      headers: {
        Authorization: "Bearer secret_admin_key_123",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.inquiries).toHaveLength(1);
  });

  it("updates inquiry status with PATCH", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer secret_admin_key_123",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: "ref_1", status: "resolved" }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.inquiry.status).toBe("resolved");
  });

  it("rejects PATCH with invalid status", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer secret_admin_key_123",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: "ref_1", status: "nonexistent" }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it("rejects invalid list filters", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/admin/inquiries?status=deleted",
      { headers: { Authorization: "Bearer secret_admin_key_123" } }
    );

    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("does not reuse BETTER_AUTH_SECRET as an admin credential", async () => {
    delete process.env.ADMIN_API_KEY;
    process.env.BETTER_AUTH_SECRET = "auth-secret-that-must-not-authorize-admin";
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries", {
      headers: { Authorization: "Bearer auth-secret-that-must-not-authorize-admin" },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
