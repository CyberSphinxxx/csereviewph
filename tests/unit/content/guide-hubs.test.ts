import { describe, it, expect } from "vitest";
import {
  getAllStudyGuides,
  getStudyGuidesByExam,
  getExamIdsWithGuides,
  GUIDE_HUBS,
  getGuideHubByExamId,
  getGuideHubBySlug,
} from "@/lib/content";
import { getExamGuidesHubMetadata } from "@/features/guides/ExamGuidesHub";
import { getGuideItemListSchema } from "@/lib/seo/schema";
import { EXAM_CATALOG } from "@/config/exams";
import type { ContentExamId } from "@/lib/content/types";

describe("Guide hubs — Concept B directory + per-exam hub architecture", () => {
  it("has a hub config for every catalog exam, with unique slugs", () => {
    expect(GUIDE_HUBS).toHaveLength(EXAM_CATALOG.length);

    const slugs = new Set(GUIDE_HUBS.map((h) => h.slug));
    expect(slugs.size).toBe(GUIDE_HUBS.length);

    for (const hub of GUIDE_HUBS) {
      expect(EXAM_CATALOG.some((e) => e.id === hub.examId)).toBe(true);
      expect(hub.slug).toMatch(/^[a-z0-9-]+$/);
      expect(hub.title.length).toBeGreaterThan(10);
      expect(hub.description.length).toBeGreaterThan(30);
      expect(hub.shelfSay.length).toBeGreaterThan(10);
    }
  });

  it("keeps every hub SERP title within the 45-60 character layout template", () => {
    for (const hub of GUIDE_HUBS) {
      const serpTitle = `${hub.seoTitle} | ReviewTayo`;
      expect(serpTitle.length, `SERP title out of range: ${serpTitle}`).toBeGreaterThanOrEqual(45);
      expect(serpTitle.length, `SERP title out of range: ${serpTitle}`).toBeLessThanOrEqual(60);
    }
  });

  it("resolves hubs by exam id and slug, and throws on unknown exam", () => {
    expect(getGuideHubByExamId("cse").slug).toBe("cse");
    expect(getGuideHubBySlug("let")?.examId).toBe("let");
    expect(getGuideHubBySlug("does-not-exist")).toBeUndefined();
    expect(() => getGuideHubByExamId("unknown" as ContentExamId)).toThrow();
  });

  it("maps every production guide to a valid exam with cse as the legacy default", () => {
    for (const guide of getAllStudyGuides()) {
      expect(EXAM_CATALOG.some((e) => e.id === (guide.examId ?? "cse"))).toBe(true);
      expect(getStudyGuidesByExam(guide.examId ?? "cse").length).toBeGreaterThan(0);
    }
  });

  it("currently publishes guides only for the live CSE exam", () => {
    expect(getExamIdsWithGuides()).toEqual(["cse"]);
    expect(getStudyGuidesByExam("cse")).toHaveLength(getAllStudyGuides().length);
    expect(getStudyGuidesByExam("let")).toHaveLength(0);
  });

  it("generates per-hub metadata with self-referential canonicals and no meta keywords", () => {
    for (const hub of GUIDE_HUBS) {
      const meta = getExamGuidesHubMetadata(hub.examId);
      expect(meta.title).toBe(hub.seoTitle);
      expect(meta.description).toBe(hub.description);
      expect(meta.alternates?.canonical).toBe(`/guides/${hub.slug}`);
      expect(meta.keywords).toBeUndefined();
      expect((meta.openGraph as { url?: string } | undefined)?.url).toBe(`/guides/${hub.slug}`);
    }
  });

  it("builds an ItemList schema with 1-based positions and absolute guide URLs", () => {
    const guides = getStudyGuidesByExam("cse");
    const schema = getGuideItemListSchema(guides, "CSE guides", "/guides/cse");

    expect(schema["@type"]).toBe("ItemList");
    expect(schema.numberOfItems).toBe(guides.length);
    expect(schema.itemListElement).toHaveLength(guides.length);

    schema.itemListElement.forEach((item, i) => {
      expect(item.position).toBe(i + 1);
      expect(item.url).toMatch(/\/guides\/[a-z0-9-]+$/);
      expect(item.name).toBe(guides[i].title);
    });
  });
});
