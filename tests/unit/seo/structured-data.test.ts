import { describe, it, expect } from "vitest";
import { getAllArticles, getAllStudyGuides, FAQS } from "@/lib/content";
import {
  getRootOrganizationSchema,
  getRootWebSiteSchema,
  getArticleSchema,
  getStudyGuideSchema,
  getBreadcrumbSchema,
  getFaqSchema,
} from "@/lib/seo/schema";
import { CANONICAL_ORIGIN } from "@/lib/env";

describe("Schema.org Structured Data & JSON-LD Builders", () => {
  it("generates valid root Organization and WebSite schema without fake search actions", () => {
    const orgSchema = getRootOrganizationSchema();
    const siteSchema = getRootWebSiteSchema();

    expect(orgSchema["@context"]).toBe("https://schema.org");
    expect(orgSchema["@type"]).toBe("Organization");
    expect(orgSchema.name).toBe("ReviewTayo");
    expect(orgSchema.url).toBe(CANONICAL_ORIGIN);
    expect(orgSchema.logo).toBe(`${CANONICAL_ORIGIN}/icon-512.png`);

    expect(siteSchema["@context"]).toBe("https://schema.org");
    expect(siteSchema["@type"]).toBe("WebSite");
    expect(siteSchema.name).toBe("ReviewTayo");
    expect(siteSchema.url).toBe(CANONICAL_ORIGIN);
    expect(siteSchema.description).toContain("Philippine Civil Service");
    // Strictly no fake search actions without a real on-site query endpoint
    expect((siteSchema as { potentialAction?: unknown }).potentialAction).toBeUndefined();
  });

  it("validates that all production articles produce compliant Article JSON-LD", () => {
    const articles = getAllArticles();
    expect(articles.length).toBeGreaterThanOrEqual(5);

    for (const article of articles) {
      const jsonLd = getArticleSchema(article);

      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe("Article");
      expect(jsonLd.headline).toBe(article.title);
      expect(jsonLd.description).toBe(article.description);
      expect(jsonLd.image).toBe(`${CANONICAL_ORIGIN}/og-image.png`);
      expect(jsonLd.author["@type"]).toBe("Organization");
      expect(jsonLd.author.name).toBe(article.author);
      expect(jsonLd.author.url).toBe(CANONICAL_ORIGIN);
      expect(jsonLd.publisher["@type"]).toBe("Organization");
      expect(jsonLd.publisher.name).toBe("ReviewTayo");
      expect(jsonLd.publisher.url).toBe(CANONICAL_ORIGIN);
      expect(jsonLd.publisher.logo.url).toBe(`${CANONICAL_ORIGIN}/icon-512.png`);
      expect(jsonLd.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(jsonLd.mainEntityOfPage).toBe(`${CANONICAL_ORIGIN}/articles/${article.slug}`);
    }
  });

  it("validates that all production study guides produce compliant TechArticle JSON-LD", () => {
    const guides = getAllStudyGuides();
    expect(guides.length).toBeGreaterThanOrEqual(5);

    for (const guide of guides) {
      const jsonLd = getStudyGuideSchema(guide);

      expect(jsonLd["@context"]).toBe("https://schema.org");
      expect(jsonLd["@type"]).toBe("TechArticle");
      expect(jsonLd.headline).toBe(guide.title);
      expect(jsonLd.description).toBe(guide.description);
      expect(jsonLd.image).toBe(`${CANONICAL_ORIGIN}/og-image.png`);
      expect(jsonLd.author["@type"]).toBe("Organization");
      expect(jsonLd.author.name).toBe(guide.author || "ReviewTayo Editorial Team");
      expect(jsonLd.publisher["@type"]).toBe("Organization");
      expect(jsonLd.publisher.name).toBe("ReviewTayo");
      expect(jsonLd.publisher.logo.url).toBe(`${CANONICAL_ORIGIN}/icon-512.png`);
      expect(jsonLd.mainEntityOfPage).toBe(`${CANONICAL_ORIGIN}/guides/${guide.slug}`);
      expect(jsonLd.about).toBe(guide.subject);
      expect(["All", "Professional", "Subprofessional"]).toContain(jsonLd.educationalLevel);
    }
  });

  it("generates valid BreadcrumbList schema structure for content hierarchies", () => {
    const crumbs = [
      { name: "Home", url: CANONICAL_ORIGIN },
      { name: "Articles", url: `${CANONICAL_ORIGIN}/articles` },
      { name: "Pacing Strategy", url: `${CANONICAL_ORIGIN}/articles/continuous-timer-pacing-strategy` },
    ];

    const breadcrumbSchema = getBreadcrumbSchema(crumbs);

    expect(breadcrumbSchema["@context"]).toBe("https://schema.org");
    expect(breadcrumbSchema["@type"]).toBe("BreadcrumbList");
    expect(breadcrumbSchema.itemListElement).toHaveLength(3);

    expect(breadcrumbSchema.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: CANONICAL_ORIGIN,
    });
    expect(breadcrumbSchema.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Articles",
      item: `${CANONICAL_ORIGIN}/articles`,
    });
    expect(breadcrumbSchema.itemListElement[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "Pacing Strategy",
      item: `${CANONICAL_ORIGIN}/articles/continuous-timer-pacing-strategy`,
    });
  });

  it("generates valid FAQPage schema matching production FAQS data", () => {
    const faqSchema = getFaqSchema(FAQS);

    expect(faqSchema["@context"]).toBe("https://schema.org");
    expect(faqSchema["@type"]).toBe("FAQPage");
    expect(faqSchema.mainEntity.length).toBe(FAQS.length);

    for (const item of faqSchema.mainEntity) {
      expect(item["@type"]).toBe("Question");
      expect(item.name.length).toBeGreaterThan(15);
      expect(item.acceptedAnswer["@type"]).toBe("Answer");
      expect(item.acceptedAnswer.text.length).toBeGreaterThan(30);
    }
  });
});
