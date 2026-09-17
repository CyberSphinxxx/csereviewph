import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/user/sync/route";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/db", () => {
  const insertChain = {
    values: vi.fn().mockReturnThis(),
    onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
  };
  return {
    db: {
      insert: vi.fn().mockReturnValue(insertChain),
    },
  };
});

type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;

describe("User Sync API Endpoint (/api/user/sync)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when no authenticated session is present", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null as unknown as SessionData);

    const req = new NextRequest("http://localhost:3000/api/user/sync", {
      method: "POST",
      body: JSON.stringify({ history: [] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toMatch(/Authentication required/);
  });

  it("returns 400 when payload is invalid JSON", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "u-123", email: "juan@example.ph", name: "Juan" },
      session: { id: "s-123", userId: "u-123" },
    } as unknown as SessionData);

    const req = new Request("http://localhost:3000/api/user/sync", {
      method: "POST",
      body: "not-a-json",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toMatch(/Invalid JSON/);
  });

  it("returns 200 and sync summary for valid authenticated sync payload", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "u-123", email: "juan@example.ph", name: "Juan" },
      session: { id: "s-123", userId: "u-123" },
    } as unknown as SessionData);

    const req = new NextRequest("http://localhost:3000/api/user/sync", {
      method: "POST",
      body: JSON.stringify({
        history: [
          {
            id: "att-1",
            title: "CSE Professional Quick Test",
            mode: "quick",
            rawScore: 8,
            percentage: 80,
            totalQuestions: 10,
            passed: true,
            date: "2026-09-10T12:00:00Z",
          },
        ],
        bookmarks: [
          {
            id: "q-prof-1",
            bookmarkedAt: "2026-09-10T12:00:00Z",
          },
        ],
        mistakeBank: [
          {
            id: "q-prof-2",
            box: 2,
            reviewCount: 3,
            nextReviewDue: "2026-09-13T12:00:00Z",
          },
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.synced).toBeDefined();
    expect(data.synced.attempts).toBeGreaterThanOrEqual(1);
    expect(data.synced.bookmarks).toBeGreaterThanOrEqual(1);
    expect(data.synced.mistakes).toBe(1);
  });
});
