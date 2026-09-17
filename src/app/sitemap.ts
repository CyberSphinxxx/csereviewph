import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/env";
import { getAllStudyGuides, getAllArticles } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getCanonicalUrl();
  const platformReleaseDate = new Date("2026-09-16T00:00:00.000Z");

  // 1. Core platform pages
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: platformReleaseDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/practice`,
      lastModified: platformReleaseDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exam-info`,
      lastModified: platformReleaseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cse/exam-guide`,
      lastModified: platformReleaseDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...[
      "schedule",
      "testing-centers",
      "how-to-apply",
      "requirements",
      "exam-day",
      "results",
      "official-links",
    ].map((section) => ({
      url: `${baseUrl}/cse/exam-guide/${section}`,
      lastModified: platformReleaseDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/faq`,
      lastModified: platformReleaseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 2. Study Guides (Catalog and individual subtest guides with verified content dates)
  const studyGuides = getAllStudyGuides();
  const guideRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides`,
      lastModified: platformReleaseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...studyGuides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: guide.isoUpdatedDate
        ? new Date(guide.isoUpdatedDate)
        : platformReleaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // 3. Strategic Preparation Articles (with verified published/updated dates)
  const articles = getAllArticles();
  const articleRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/articles`,
      lastModified: platformReleaseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.isoUpdatedDate
        ? new Date(article.isoUpdatedDate)
        : article.isoPublishedDate
          ? new Date(article.isoPublishedDate)
          : platformReleaseDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // 4. Trust, legal, and AdSense compliance pages
  const trustAndLegalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: platformReleaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: platformReleaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: platformReleaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: platformReleaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: platformReleaseDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [
    ...coreRoutes,
    ...guideRoutes,
    ...articleRoutes,
    ...trustAndLegalRoutes,
  ];
}
