import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SEED_TOPICS, SEED_LEVELS } from "@/db/seed-data";

describe("sitemap.ts — Dynamic XML Sitemap Generation", () => {
  it("generates a comprehensive list of all public indexable routes", () => {
    const map = sitemap();

    expect(Array.isArray(map)).toBe(true);
    expect(map.length).toBeGreaterThan(15);
  });

  it("includes homepage with highest priority 1.0", () => {
    const map = sitemap();
    const home = map.find((entry) => !entry.url.replace(/https?:\/\/[^/]+/, ""));

    expect(home).toBeDefined();
    expect(home?.priority).toBe(1.0);
    expect(home?.changeFrequency).toBe("daily");
  });

  it("excludes interactive session routes and topic runners to preserve crawl budget", () => {
    const map = sitemap();

    for (const level of SEED_LEVELS) {
      for (const mode of ["quick", "medium", "full"]) {
        const expectedPath = `/exams/${level.slug}/${mode}`;
        const entry = map.find((e) => e.url.endsWith(expectedPath));
        expect(entry, `Sitemap should not include interactive session route ${expectedPath}`).toBeUndefined();
      }
    }

    for (const topic of SEED_TOPICS) {
      const expectedPath = `/practice/${topic.id}`;
      const entry = map.find((e) => e.url.endsWith(expectedPath));
      expect(entry, `Sitemap should not include topic runner ${expectedPath}`).toBeUndefined();
    }
  });

  it("assigns verified content update dates instead of generic new Date() to articles and guides", () => {
    const map = sitemap();
    const guideEntry = map.find((e) => e.url.endsWith("/guides/ra-6713-code-of-conduct"));
    const articleEntry = map.find((e) => e.url.endsWith("/articles/why-examinees-fail-civil-service-exam"));

    expect(guideEntry).toBeDefined();
    expect(articleEntry).toBeDefined();

    expect(guideEntry?.lastModified).toBeInstanceOf(Date);
    expect(articleEntry?.lastModified).toBeInstanceOf(Date);
    // Verified date should match the content date (2026-09-10)
    expect(new Date(guideEntry!.lastModified!).toISOString()).toContain("2026-09-10");
  });

  it("includes mandatory trust, legal, and AdSense compliance pages", () => {
    const map = sitemap();
    const mandatoryPages = [
      "/about",
      "/privacy",
      "/terms",
      "/disclaimer",
      "/contact",
      "/faq",
      "/exam-info",
      "/cse/exam-guide",
      "/guides",
      "/articles",
    ];

    for (const page of mandatoryPages) {
      const entry = map.find((e) => e.url.endsWith(page));
      expect(entry, `Missing trust page ${page} in sitemap`).toBeDefined();
      expect(entry?.priority).toBeGreaterThanOrEqual(0.6);
    }
  });

  it("includes all individual study guides and article slugs in sitemap", () => {
    const map = sitemap();

    expect(map.find((e) => e.url.endsWith("/guides/ra-6713-code-of-conduct"))).toBeDefined();
    expect(map.find((e) => e.url.endsWith("/guides/philippine-constitution-essentials"))).toBeDefined();
    expect(map.find((e) => e.url.endsWith("/articles/why-examinees-fail-civil-service-exam"))).toBeDefined();
    expect(map.find((e) => e.url.endsWith("/articles/continuous-timer-pacing-strategy"))).toBeDefined();
  });
});
