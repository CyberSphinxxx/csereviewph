import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/questions/report/route";
import { NextRequest } from "next/server";

// Mock the database module so the route's persistence branch runs without a
// real PostgreSQL connection.
const insertMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/db", () => ({
  db: { insert: vi.fn(() => ({ values: insertMock })) },
  schema: { questionReports: { id: "id" } },
}));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: vi.fn().mockResolvedValue(null) } },
}));

describe("Question Report API Endpoint (/api/questions/report)", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    insertMock.mockResolvedValue(undefined);
    process.env.DATABASE_URL = "postgres://test:test@localhost:5432/test";
  });

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it("returns 400 if questionId is missing or empty", async () => {
    const req = new NextRequest("http://localhost:3000/api/questions/report", {
      method: "POST",
      body: JSON.stringify({
        reason: "factual_error",
        comments: "Wrong answer key.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toMatch(/questionId/);
  });

  it("returns 400 if reason is invalid", async () => {
    const req = new NextRequest("http://localhost:3000/api/questions/report", {
      method: "POST",
      body: JSON.stringify({
        questionId: "q-123",
        reason: "unsupported_reason_code",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toMatch(/reason/);
  });

  it("returns 201 with reportId on valid payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/questions/report", {
      method: "POST",
      body: JSON.stringify({
        questionId: "q-123",
        reason: "factual_error",
        comments: "According to CSC MC No. 19, this item has changed.",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reportId).toBeDefined();
    expect(data.message).toBeDefined();
    expect(data.storage).toBe("database");
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ questionId: "q-123", reason: "factual_error" })
    );
  });

  it("returns 503 instead of a fabricated success when the database write fails", async () => {
    insertMock.mockRejectedValueOnce(new Error("connection refused"));

    const req = new NextRequest("http://localhost:3000/api/questions/report", {
      method: "POST",
      body: JSON.stringify({
        questionId: "q-123",
        reason: "typo",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);

    const data = await res.json();
    expect(data.success).toBeUndefined();
    expect(data.error).toMatch(/could not save/i);
  });

  it("does not trust a client-supplied userId; identity comes from the session only", async () => {
    insertMock.mockClear();

    const req = new NextRequest("http://localhost:3000/api/questions/report", {
      method: "POST",
      body: JSON.stringify({
        questionId: "q-123",
        reason: "other",
        userId: "spoofed-user-id",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ userId: null })
    );
  });
});
