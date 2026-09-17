// @vitest-environment node
import { describe, it, expect } from "vitest";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as rootMetadata } from "@/app/layout";
import { getRootRobots } from "@/lib/seo/schema";
import { metadata as examInfoMetadata } from "@/app/(public)/exam-info/page";
import { metadata as cseMetadata } from "@/app/(public)/cse/page";
import { metadata as reviewersMetadata } from "@/app/(public)/reviewers/page";
import { metadata as cseExamGuideMetadata } from "@/app/(public)/cse/exam-guide/page";
import { generateMetadata as generateExamGuideSectionMetadata } from "@/app/(public)/cse/exam-guide/[section]/page";
import { metadata as guidesMetadata } from "@/app/(public)/guides/page";
import { generateMetadata as generateGuideMetadata } from "@/app/(public)/guides/[slug]/page";
import { metadata as articlesMetadata } from "@/app/(public)/articles/page";
import { generateMetadata as generateArticleMetadata } from "@/app/(public)/articles/[slug]/page";
import { metadata as faqMetadata } from "@/app/(public)/faq/layout";
import { metadata as practiceMetadata } from "@/app/(app)/practice/layout";
import { metadata as settingsMetadata } from "@/app/(app)/settings/layout";
import { metadata as dashboardMetadata } from "@/app/(app)/dashboard/layout";
import { metadata as examLevelMetadata } from "@/app/(app)/exams/[level]/layout";
import { metadata as resultsMetadata } from "@/app/(app)/results/layout";
import { metadata as practiceTopicMetadata } from "@/app/(app)/practice/[topicId]/page";
import { getBaseUrl } from "@/lib/env";
import { getAllArticles, getAllStudyGuides } from "@/lib/content";

describe("SEO Metadata & Canonical Architecture", () => {
  it("ensures canonical base URL is always https://www.reviewtayo.online in production", () => {
    const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://reviewtayo.online";
    expect(getBaseUrl()).toBe("https://www.reviewtayo.online");

    process.env.NEXT_PUBLIC_APP_URL = "http://reviewtayo.online";
    expect(getBaseUrl()).toBe("https://www.reviewtayo.online");

    process.env.NEXT_PUBLIC_APP_URL = "https://www.reviewtayo.online";
    expect(getBaseUrl()).toBe("https://www.reviewtayo.online");

    process.env.NEXT_PUBLIC_APP_URL = originalEnv;
  });

  it("ensures homepage metadata targets core Philippine Civil Service Reviewer queries", () => {
    expect(homeMetadata.title).toContain("Reviewer");
    expect(homeMetadata.title).not.toContain("| ReviewTayo");
    expect(homeMetadata.description).toBeDefined();
    expect(homeMetadata.description).toContain("Civil Service");
    expect(homeMetadata.alternates?.canonical).toBe("/");
  });

  it("ensures public catalog pages have unique titles, descriptions, and canonicals without redundant brand suffix", () => {
    const pages = [
      { name: "exam-info", meta: examInfoMetadata, canonical: "/exam-info" },
      { name: "cse-exam-guide", meta: cseExamGuideMetadata, canonical: "/cse/exam-guide" },
      { name: "guides", meta: guidesMetadata, canonical: "/guides" },
      { name: "articles", meta: articlesMetadata, canonical: "/articles" },
      { name: "faq", meta: faqMetadata, canonical: "/faq" },
      { name: "practice", meta: practiceMetadata, canonical: "/practice" },
      { name: "reviewers", meta: reviewersMetadata, canonical: "/reviewers" },
      { name: "cse", meta: cseMetadata, canonical: "/cse" },
    ];

    const titles = new Set<string>();

    for (const page of pages) {
      const title = String(page.meta.title);
      expect(titles.has(title), `Duplicate title found: ${title}`).toBe(false);
      titles.add(title);

      // Must not manually include "| ReviewTayo" or "— ReviewTayo" (root layout template adds it)
      expect(title).not.toContain("ReviewTayo");
      expect(title.length).toBeGreaterThan(15);
      expect(page.meta.description).toBeDefined();
      expect(page.meta.description!.length).toBeGreaterThan(30);
      expect(page.meta.alternates?.canonical).toBe(page.canonical);

      // Must not contain obsolete meta keywords
      expect(page.meta.keywords).toBeUndefined();
    }
  });

  it("ensures article detail pages generate unique metadata, self-referential canonicals, and no duplicate brand suffix", async () => {
    const articles = getAllArticles();
    expect(articles.length).toBeGreaterThanOrEqual(5);

    for (const article of articles) {
      const meta = await generateArticleMetadata({
        params: Promise.resolve({ slug: article.slug }),
      });

      const title = String(meta.title);
      expect(title).toBe(article.seoTitle || article.title);
      expect(title).not.toContain("ReviewTayo");
      // Full rendered SERP title with layout suffix must stay strictly within 45 to 60 characters
      const serpTitle = `${title} | ReviewTayo`;
      expect(serpTitle.length).toBeGreaterThanOrEqual(45);
      expect(serpTitle.length).toBeLessThanOrEqual(60);
      expect(meta.description).toBe(article.description);
      expect(meta.alternates?.canonical).toBe(`/articles/${article.slug}`);
      expect(meta.keywords).toBeUndefined();
      expect((meta.openGraph as { type?: string } | undefined)?.type).toBe("article");
    }
  });

  it("ensures study guide detail pages generate clean titles and self-referential canonicals without meta keywords", async () => {
    const guides = getAllStudyGuides();
    expect(guides.length).toBeGreaterThanOrEqual(5);

    for (const guide of guides) {
      const meta = await generateGuideMetadata({
        params: Promise.resolve({ slug: guide.slug }),
      });

      const title = String(meta.title);
      expect(title).toBe(guide.seoTitle || `${guide.title} Study Guide`);
      expect(title).not.toContain("ReviewTayo");
      // Full rendered SERP title with layout suffix must stay strictly within 45 to 60 characters
      const serpTitle = `${title} | ReviewTayo`;
      expect(serpTitle.length).toBeGreaterThanOrEqual(45);
      expect(serpTitle.length).toBeLessThanOrEqual(60);
      expect(meta.description).toBe(guide.description);
      expect(meta.alternates?.canonical).toBe(`/guides/${guide.slug}`);
      expect(meta.keywords).toBeUndefined();
    }
  });

  it("ensures exam guide section pages have valid self-referential canonicals", async () => {
    const sections = ["schedule", "testing-centers", "requirements", "exam-day"];

    for (const section of sections) {
      const meta = await generateExamGuideSectionMetadata({
        params: Promise.resolve({ section }),
      });

      expect(meta.title).toBeDefined();
      expect(meta.alternates?.canonical).toBe(`/cse/exam-guide/${section}`);
      expect(meta.keywords).toBeUndefined();
    }
  });

  it("ensures preview deployments strictly enforce noindex and nofollow across all robots directives", () => {
    const previewRobots = getRootRobots(true) as {
      index?: boolean;
      follow?: boolean;
      googleBot?: { index?: boolean; follow?: boolean };
    };

    expect(previewRobots.index).toBe(false);
    expect(previewRobots.follow).toBe(false);
    expect(previewRobots.googleBot?.index).toBe(false);
    expect(previewRobots.googleBot?.follow).toBe(false);

    const prodRobots = getRootRobots(false) as {
      index?: boolean;
      follow?: boolean;
      googleBot?: { index?: boolean; follow?: boolean };
    };

    expect(prodRobots.index).toBe(true);
    expect(prodRobots.follow).toBe(true);
    expect(prodRobots.googleBot?.index).toBe(true);
    expect(prodRobots.googleBot?.follow).toBe(true);

    // Also assert root metadata has valid robots configuration
    expect(rootMetadata.robots).toBeDefined();
  });

  it("ensures private application routes and runners enforce noindex, nofollow", () => {
    const privateMetas = [
      { name: "dashboard", meta: dashboardMetadata },
      { name: "settings", meta: settingsMetadata },
      { name: "exams", meta: examLevelMetadata },
      { name: "results", meta: resultsMetadata },
      { name: "practice-runner", meta: practiceTopicMetadata },
    ];

    for (const route of privateMetas) {
      expect(route.meta.robots, `${route.name} must specify robots`).toBeDefined();
      const robots = route.meta.robots as { index?: boolean; follow?: boolean };
      expect(robots.index, `${route.name} must be noindex`).toBe(false);
      expect(robots.follow, `${route.name} must be nofollow`).toBe(false);
    }
  });
});
