import { describe, it, expect } from "vitest";
import {
  STUDY_GUIDES,
  ARTICLES,
  FAQS,
  getStudyGuideBySlug,
  getArticleBySlug,
  getAllStudyGuides,
  getAllArticles,
  getAllFaqs,
} from "@/lib/content";

describe("Content Platform — Study Guides, Articles & FAQ Data Integrity", () => {
  describe("Study Guides", () => {
    it("contains rich syllabus-aligned study guides", () => {
      expect(STUDY_GUIDES.length).toBeGreaterThanOrEqual(5);
    });

    it("ensures every study guide has a unique slug and required fields", () => {
      const slugs = new Set<string>();

      for (const guide of STUDY_GUIDES) {
        expect(slugs.has(guide.slug), `Duplicate guide slug: ${guide.slug}`).toBe(
          false
        );
        slugs.add(guide.slug);

        expect(guide.slug).toMatch(/^[a-z0-9-]+$/);
        expect(guide.title.length).toBeGreaterThan(10);
        expect(guide.description.length).toBeGreaterThan(20);
        expect(guide.readTimeMinutes).toBeGreaterThan(0);
        expect(guide.sections.length).toBeGreaterThan(0);

        for (const sec of guide.sections) {
          expect(sec.id).toBeDefined();
          expect(sec.heading.length).toBeGreaterThan(5);
          expect(sec.content.length).toBeGreaterThan(50);
        }

        // Authenticity checks (ADS-09, ADS-10)
        expect(guide.author).toBe("ReviewTayo Editorial Team");
        expect(guide.reviewedBy).toBeUndefined();
        expect(guide.sources).toBeDefined();
        expect(guide.sources!.length).toBeGreaterThan(0);
        for (const source of guide.sources!) {
          expect(source.title.length).toBeGreaterThan(10);
          expect(source.url).toMatch(
            /^https:\/\/(www\.)?(officialgazette\.gov\.ph|csc\.gov\.ph)\//
          );
        }
      }
    });

    it("retrieves study guide by slug", () => {
      const guide = getStudyGuideBySlug("ra-6713-code-of-conduct");
      expect(guide).toBeDefined();
      expect(guide?.title).toContain("Republic Act No. 6713");

      expect(getStudyGuideBySlug("non-existent-slug")).toBeNull();
    });

    it("retrieves all study guides", () => {
      expect(getAllStudyGuides()).toHaveLength(STUDY_GUIDES.length);
    });
  });

  describe("Articles", () => {
    it("contains tactical preparation articles", () => {
      expect(ARTICLES.length).toBeGreaterThanOrEqual(3);
    });

    it("ensures every article has a unique slug and content", () => {
      const slugs = new Set<string>();

      for (const article of ARTICLES) {
        expect(
          slugs.has(article.slug),
          `Duplicate article slug: ${article.slug}`
        ).toBe(false);
        slugs.add(article.slug);

        expect(article.slug).toMatch(/^[a-z0-9-]+$/);
        expect(article.title.length).toBeGreaterThan(10);
        expect(article.description.length).toBeGreaterThan(20);
        expect(article.author).toBe("ReviewTayo Editorial Team");
        expect(article.reviewedBy).toBeUndefined();
        expect(article.keyHighlights.length).toBeGreaterThan(0);
        expect(article.content.length).toBeGreaterThan(3);

        // Authenticity & Verifiable Citations (ADS-09, ADS-10)
        expect(article.sources).toBeDefined();
        expect(article.sources!.length).toBeGreaterThan(0);
        for (const source of article.sources!) {
          expect(source.title.length).toBeGreaterThan(10);
          expect(source.url).toMatch(
            /^https:\/\/(www\.)?(officialgazette\.gov\.ph|csc\.gov\.ph)\//
          );
        }
      }
    });

    it("retrieves article by slug", () => {
      const article = getArticleBySlug("continuous-timer-pacing-strategy");
      expect(article).toBeDefined();
      expect(article?.title).toContain("67-Second Rule");

      expect(getArticleBySlug("non-existent-article")).toBeNull();
    });

    it("retrieves all articles", () => {
      expect(getAllArticles()).toHaveLength(ARTICLES.length);
    });
  });

  describe("FAQs", () => {
    it("contains comprehensive FAQ entries across all categories", () => {
      expect(FAQS.length).toBeGreaterThanOrEqual(8);
      expect(getAllFaqs()).toHaveLength(FAQS.length);

      const categories = new Set(FAQS.map((f) => f.category));
      expect(categories.has("Qualifications & Eligibility")).toBe(true);
      expect(categories.has("Exam Format & Scoring")).toBe(true);
      expect(categories.has("Exam Day Guidelines")).toBe(true);
      expect(categories.has("Preparation & Review")).toBe(true);
    });

    it("ensures every FAQ has unique id, question and detailed answer", () => {
      const ids = new Set<string>();

      for (const faq of FAQS) {
        expect(ids.has(faq.id), `Duplicate FAQ id: ${faq.id}`).toBe(false);
        ids.add(faq.id);

        expect(faq.question.length).toBeGreaterThan(15);
        expect(faq.answer.length).toBeGreaterThan(30);
      }
    });
  });
});
