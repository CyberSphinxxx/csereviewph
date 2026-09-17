import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { contactRateLimiter } from "@/lib/rate-limit";
import { NextRequest } from "next/server";
import { db } from "@/db";

vi.mock("@/db", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue([{ id: "test" }]),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ count: 0 }]),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    }),
  },
  schema: {
    contactInquiries: {
      ipHash: "ip_hash",
      createdAt: "created_at",
      expiresAt: "expires_at",
    },
  },
}));

function createRequest(body: unknown, ip = "127.0.0.1"): NextRequest {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact — Contact Form API Handler", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/csereviewer",
      CONTACT_IP_HASH_SALT: "contact-test-salt-at-least-32-characters-long",
    };
    contactRateLimiter.reset();
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockResolvedValue([{ id: "test" }]),
    } as unknown as ReturnType<typeof db.insert>);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("successfully receives valid contact submission and persists to DB", async () => {
    const req = createRequest({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      category: "correction",
      message: "Question 42 has a typo in option C.",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.referenceId).toMatch(/^ref_/);
    expect(json.retentionDays).toBe(90);
    expect(json.message).toContain("recorded");
  });

  it("returns 503 and does NOT claim success when database configuration is absent (Finding 2)", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
    delete process.env.POSTGRES_PRISMA_URL;

    const req = createRequest({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      category: "correction",
      message: "Testing missing DB configuration scenario.",
    });

    const res = await POST(req);
    expect(res.status).toBe(503);

    const json = await res.json();
    expect(json.success).toBeUndefined();
    expect(json.error).toContain("temporarily unavailable");
  });

  it("returns 503 when the dedicated IP hash salt is absent", async () => {
    delete process.env.CONTACT_IP_HASH_SALT;

    const res = await POST(createRequest({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      category: "technical",
      message: "Testing missing pseudonymization secret.",
    }));

    expect(res.status).toBe(503);
    expect((await res.json()).success).toBeUndefined();
  });

  it("returns 503 and does NOT claim success when database insert fails (Finding 2)", async () => {
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockRejectedValue(new Error("Connection pool exhausted")),
    } as unknown as ReturnType<typeof db.insert>);

    const req = createRequest({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      category: "technical",
      message: "Testing database write failure scenario.",
    });

    const res = await POST(req);
    expect(res.status).toBe(503);

    const json = await res.json();
    expect(json.success).toBeUndefined();
    expect(json.error).toContain("Could not save your message");
  });

  it("returns 400 and rejects submission if honeypot botField is filled", async () => {
    const req = createRequest({
      name: "Spam Bot",
      email: "bot@spammer.com",
      category: "other",
      message: "Spam message trying to bypass form safeguards.",
      botField: "I am a bot",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("Spam");
  });

  it("returns 400 if name is too short or missing", async () => {
    const req = createRequest({
      name: "J",
      email: "juan@example.com",
      category: "correction",
      message: "Valid length message for testing purposes.",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("name");
  });

  it("returns 400 if email is invalid", async () => {
    const req = createRequest({
      name: "Juan Dela Cruz",
      email: "not-an-email",
      category: "technical",
      message: "Valid length message for testing purposes.",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("email");
  });

  it("returns 400 if message is shorter than 10 characters", async () => {
    const req = createRequest({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      category: "privacy",
      message: "Short",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("message");
  });

  it("returns 400 if category is invalid", async () => {
    const req = createRequest({
      name: "Juan Dela Cruz",
      email: "juan@example.com",
      category: "invalid-cat",
      message: "Valid length message for testing purposes.",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("category");
  });

  it("enforces rate limiting and returns 429 when max requests per window exceeded", async () => {
    const payload = {
      name: "Rate Limit Tester",
      email: "tester@example.com",
      category: "other",
      message: "Testing rate limit threshold for public contact endpoint.",
    };

    const clientIp = "203.0.113.195";

    // 5 allowed requests
    for (let i = 0; i < 5; i++) {
      const res = await POST(createRequest(payload, clientIp));
      expect(res.status).toBe(200);
    }

    // 6th request triggers rate limit
    const limitedRes = await POST(createRequest(payload, clientIp));
    expect(limitedRes.status).toBe(429);

    const json = await limitedRes.json();
    expect(json.error).toContain("Too many submissions");
  });
});
