import type { Metadata } from "next";
import type { Article, StudyGuide, FAQItem } from "@/lib/content/types";
import { CANONICAL_ORIGIN } from "@/lib/env";

/**
 * Production Schema.org JSON-LD and Metadata builders for ReviewTayo.
 * Centralized to guarantee adherence to Google Search Central guidelines
 * and avoid schema replication drift in tests and templates.
 */

export function getRootRobots(previewMode: boolean): Metadata["robots"] {
  if (previewMode) {
    return {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export function getRootOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ReviewTayo",
    url: CANONICAL_ORIGIN,
    logo: `${CANONICAL_ORIGIN}/icon-512.png`,
  };
}

export function getRootWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ReviewTayo",
    url: CANONICAL_ORIGIN,
    description:
      "Free Philippine Civil Service Examination (CSE-PPT) reviewer and mock exam platform.",
  };
}

export function getArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: `${CANONICAL_ORIGIN}/og-image.png`,
    author: {
      "@type": "Organization",
      name: article.author,
      url: CANONICAL_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "ReviewTayo",
      url: CANONICAL_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: `${CANONICAL_ORIGIN}/icon-512.png`,
      },
    },
    datePublished: article.isoPublishedDate,
    dateModified: article.isoUpdatedDate || article.isoPublishedDate,
    mainEntityOfPage: `${CANONICAL_ORIGIN}/articles/${article.slug}`,
  };
}

export function getStudyGuideSchema(guide: StudyGuide) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.description,
    image: `${CANONICAL_ORIGIN}/og-image.png`,
    author: {
      "@type": "Organization",
      name: guide.author || "ReviewTayo Editorial Team",
      url: CANONICAL_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "ReviewTayo",
      url: CANONICAL_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: `${CANONICAL_ORIGIN}/icon-512.png`,
      },
    },
    ...(guide.isoUpdatedDate ? { dateModified: guide.isoUpdatedDate } : {}),
    mainEntityOfPage: `${CANONICAL_ORIGIN}/guides/${guide.slug}`,
    about: guide.subject,
    educationalLevel: guide.level,
  };
}

export function getBreadcrumbSchema(crumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function getFaqSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
