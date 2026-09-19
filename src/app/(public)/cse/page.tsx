import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CSELandingClient } from "@/components/cse/CSELandingClient";
import { CANONICAL_ORIGIN } from "@/lib/env";
import { getExamBySlug } from "@/config/exams";

const cseExam = getExamBySlug("cse");

export const metadata: Metadata = {
  title: "Civil Service Exam Reviewer & Online Mock Tests",
  description:
    cseExam?.description ||
    "Free Philippine Civil Service Exam (CSE-PPT) reviewer and mock tests. Practice Professional and Subprofessional exams with real continuous timers and explanations.",
  alternates: {
    canonical: cseExam?.href || "/cse",
  },
  openGraph: {
    title: `${cseExam?.fullName || "Civil Service Exam"} Reviewer & Online Mock Tests`,
    description:
      "Pass the Civil Service Exam with free subtest drills, full-length 170-item continuous timer mock exams, and detailed answer rationales.",
    url: cseExam?.href || "/cse",
    type: "website",
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
