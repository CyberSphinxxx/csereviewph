import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CSELandingClient } from "@/components/cse/CSELandingClient";
import { CANONICAL_ORIGIN } from "@/lib/env";
import { getExamBySlug } from "@/config/exams";

const cseExam = getExamBySlug("cse");

export const metadata: Metadata = {
  title: "CSE Reviewer Philippines: Free Practice Tests and Mock Exams",
  description:
    cseExam?.description ||
    "Free Civil Service Exam reviewer for Professional and Subprofessional levels. Timed subtest drills, full-length mock exams with a continuous timer, and clear explanations for every item.",
  alternates: {
    canonical: cseExam?.href || "/cse",
  },
  openGraph: {
    title: "CSE Reviewer Philippines: Free Practice Tests and Mock Exams | ReviewTayo",
    description:
      "Prepare for the Civil Service Exam with free subtest drills, full mock exams, and item-by-item explanations. Choose Professional or Subprofessional and start in minutes.",
    url: cseExam?.href || "/cse",
    type: "website",
    siteName: "ReviewTayo",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSE Reviewer Philippines: Free Practice Tests and Mock Exams | ReviewTayo",
    description:
      "Free subtest drills, full mock exams, and item-by-item explanations for the Philippine Civil Service Exam.",
  },
};

export default function CSEPage() {
  const exam = getExamBySlug("cse");

  // RT-02: Ensure route resolves against central exam catalog and availability state
  if (!exam || exam.availability !== "available") {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Philippine ${exam.fullName} Reviewer & Online Mock Tests`,
    url: `${CANONICAL_ORIGIN}${exam.href}`,
    description: exam.description,
    isPartOf: {
      "@type": "WebSite",
      name: "ReviewTayo",
      url: CANONICAL_ORIGIN,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: CANONICAL_ORIGIN,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Exams",
          item: `${CANONICAL_ORIGIN}/reviewers`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: exam.shortName,
          item: `${CANONICAL_ORIGIN}${exam.href}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CSELandingClient />
    </>
  );
}
