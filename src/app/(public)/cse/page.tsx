import type { Metadata } from "next";
import { CSELandingClient } from "@/components/cse/CSELandingClient";
import { CANONICAL_ORIGIN } from "@/lib/env";

export const metadata: Metadata = {
  title: "Civil Service Exam Reviewer & Online Mock Tests",
  description:
    "Free Philippine Civil Service Exam (CSE-PPT) reviewer and mock tests. Practice Professional and Subprofessional exams with real continuous timers and explanations.",
  alternates: {
    canonical: "/cse",
  },
  openGraph: {
    title: "Civil Service Exam Reviewer & Online Mock Tests",
    description:
      "Pass the Civil Service Exam with free subtest drills, full-length 170-item continuous timer mock exams, and detailed answer rationales.",
    url: "/cse",
    type: "website",
  },
};

export default function CSEPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Philippine Civil Service Exam Reviewer & Online Mock Tests",
    url: `${CANONICAL_ORIGIN}/cse`,
    description:
      "Free Philippine Civil Service Exam (CSE-PPT) reviewer and mock tests with real continuous timers, detailed rationales, and topic drills.",
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
          name: "Reviewers",
          item: `${CANONICAL_ORIGIN}/reviewers`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Civil Service Exam",
          item: `${CANONICAL_ORIGIN}/cse`,
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
