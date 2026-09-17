import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, DELETE } from "@/app/api/user/account/route";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/db", () => {
  const chain = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([]),
  };
  const delChain = {
    where: vi.fn().mockResolvedValue([]),
  };
  return {
    db: {
      select: vi.fn().mockReturnValue(chain),
      delete: vi.fn().mockReturnValue(delChain),
    },
  };
});

type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;

describe("User Account API Endpoint — RA 10173 Portability & Erasure (/api/user/account)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET (Right to Data Portability)", () => {
    it("returns 401 when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as unknown as SessionData);

      const res = await GET(new Request("http://localhost:3000/api/user/account"));
      expect(res.status).toBe(401);

      const data = await res.json();
      expect(data.error).toMatch(/Authentication required/);
    });

    it("returns 200 with exported user profile and exam history citing RA 10173", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: {
          id: "u-456",
          name: "Maria Santos",
          email: "maria@example.ph",
          createdAt: new Date("2026-09-01"),
        },
        session: { id: "s-456", userId: "u-456" },
      } as unknown as SessionData);

      const res = await GET(new Request("http://localhost:3000/api/user/account"));
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.legalNotice).toMatch(/Republic Act No\. 10173/);
      expect(data.user.email).toBe("maria@example.ph");
      expect(data.data).toBeDefined();
    });
  });

  describe("DELETE (Right to Erasure)", () => {
    it("returns 401 when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null as unknown as SessionData);

      const res = await DELETE(new Request("http://localhost:3000/api/user/account", { method: "DELETE" }));
      expect(res.status).toBe(401);
    });

    it("returns 200 confirming permanent erasure under RA 10173", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue({
        user: {
          id: "u-456",
          name: "Maria Santos",
          email: "maria@example.ph",
        },
        session: { id: "s-456", userId: "u-456" },
      } as unknown as SessionData);

      const res = await DELETE(new Request("http://localhost:3000/api/user/account", { method: "DELETE" }));
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.message).toMatch(/permanently erased/);
      expect(data.message).toMatch(/10173/);
    });
  });
});
