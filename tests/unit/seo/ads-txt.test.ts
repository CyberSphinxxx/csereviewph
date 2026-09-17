import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  isValidPublisherId,
  formatPublisherId,
  generateAdsTxtContent,
  resolveAdSlotId,
} from "@/lib/ads";
import { GET } from "@/app/ads.txt/route";

describe("ads.txt/route.ts & ads.ts — Authorized Digital Sellers & Ad Utilities", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isValidPublisherId", () => {
    it("accepts valid 16-digit publisher ID with ca-pub- prefix", () => {
      expect(isValidPublisherId("ca-pub-1234567890123456")).toBe(true);
    });

    it("accepts valid 16-digit publisher ID with pub- prefix", () => {
      expect(isValidPublisherId("pub-9876543210987654")).toBe(true);
    });

    it("rejects empty or null IDs", () => {
      expect(isValidPublisherId(null)).toBe(false);
      expect(isValidPublisherId("")).toBe(false);
      expect(isValidPublisherId("   ")).toBe(false);
    });

    it("rejects dummy placeholder all-zero IDs", () => {
      expect(isValidPublisherId("ca-pub-0000000000000000")).toBe(false);
      expect(isValidPublisherId("pub-0000000000000000")).toBe(false);
    });

    it("rejects invalid length or alphanumeric IDs", () => {
      expect(isValidPublisherId("ca-pub-12345")).toBe(false);
      expect(isValidPublisherId("ca-pub-abcdefghijklmnop")).toBe(false);
    });
  });

  describe("formatPublisherId", () => {
    it("formats publisher ID correctly from ca-pub- prefix", () => {
      expect(formatPublisherId("ca-pub-1234567890123456")).toBe(
        "pub-1234567890123456"
      );
    });

    it("preserves pub- prefix if already present", () => {
      expect(formatPublisherId("pub-9876543210987654")).toBe(
        "pub-9876543210987654"
      );
    });

    it("returns null if empty, null, or placeholder", () => {
      expect(formatPublisherId(null)).toBeNull();
      expect(formatPublisherId("")).toBeNull();
      expect(formatPublisherId("ca-pub-0000000000000000")).toBeNull();
    });
  });

  describe("generateAdsTxtContent", () => {
    it("generates valid Google AdSense authorized seller record when valid ID is provided", () => {
      const output = generateAdsTxtContent("ca-pub-9998887776665554");

      expect(output).toContain(
        "google.com, pub-9998887776665554, DIRECT, f08c47fec0942fa0"
      );
    });

    it("does NOT output any fake DIRECT seller line when unconfigured or default", () => {
      const output = generateAdsTxtContent();

      expect(output).not.toContain("DIRECT");
      expect(output).not.toContain("pub-0000000000000000");
      expect(output).toContain("No active Google AdSense Publisher ID is configured");
    });
  });

  describe("resolveAdSlotId", () => {
    it("resolves raw numeric slot IDs directly", () => {
      expect(resolveAdSlotId("1234567890")).toBe("1234567890");
    });

    it("resolves mapped environment variable for semantic slot name", () => {
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE = "9876543210";
      expect(resolveAdSlotId("homepage-bottom")).toBe("9876543210");
    });

    it("returns null for unmapped or non-numeric slot name", () => {
      delete process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE;
      expect(resolveAdSlotId("homepage-bottom")).toBeNull();
      expect(resolveAdSlotId("unknown-slot")).toBeNull();
      expect(resolveAdSlotId(undefined)).toBeNull();
    });
  });

  describe("GET Route Handler", () => {
    it("returns 200 with text/plain content-type and valid seller record when configured", async () => {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-5555444433332222";

      const response = await GET();
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("text/plain");

      const body = await response.text();
      expect(body).toContain(
        "google.com, pub-5555444433332222, DIRECT, f08c47fec0942fa0"
      );
    });

    it("returns 200 with text/plain comments without fake DIRECT record when unconfigured", async () => {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
      delete process.env.ADSENSE_PUB_ID;

      const response = await GET();
      expect(response.status).toBe(200);
      const body = await response.text();
      expect(body).not.toContain("DIRECT");
      expect(body).toContain("No active Google AdSense Publisher ID is configured");
    });
  });
});
