import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { LandingFooter } from "@/components/home/LandingFooter";
import { ExamsPageView } from "@/components/reviewers/ExamsPageView";
import { CANONICAL_ORIGIN } from "@/lib/env";

export const metadata: Metadata = {
  title: "Philippine Exam Reviewers & Mock Tests",
  description:
    "Explore 69 Philippine examination reviewers and mock exam tools on ReviewTayo, including Civil Service Exam (CSE-PPT), LET, Nursing, BFP, and NAPOLCOM.",
  alternates: {
    canonical: "/reviewers",
  },
  openGraph: {
    title: "Philippine Exam Reviewers & Mock Tests | ReviewTayo",
    description:
      "Interactive directory of Philippine licensure, civil service, and college entrance examinations. Practice the Civil Service Exam today with full mock tests.",
    url: "/reviewers",
    type: "website",
  },
};

export default function ReviewersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Philippine Exam Reviewers Directory",
    url: `${CANONICAL_ORIGIN}/reviewers`,
    description:
      "Comprehensive interactive directory of Philippine examination reviewers and mock exam tools on ReviewTayo.",
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
      ],
    },
  };

  return (
    <div className="exams-page-gradient min-h-screen flex flex-col text-[#1b1216] dark:text-[#f8ecee] overflow-x-hidden w-full max-w-full selection:bg-[#fbeff0] selection:text-[#8a1630]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main id="main-content" className="flex-1 overflow-x-hidden w-full max-w-full">
        {/* Subtle Breadcrumb Strip */}
        <nav
          aria-label="Breadcrumb"
          className="bg-white/50 dark:bg-[#1a0c11]/50 backdrop-blur-xs border-b border-[#8a1630]/10 dark:border-white/10 py-2.5 px-5 sm:px-11"
        >
          <div className="max-w-[1200px] mx-auto flex items-center gap-1.5 text-xs font-semibold text-[#5a4a50] dark:text-[#d6bcc3]">
            <Link href="/" className="hover:text-[#8a1630] dark:hover:text-[#ff9fb5] transition">
              ReviewTayo
            </Link>
            <ChevronRight className="w-3 h-3 text-[#5a4a50]/60 dark:text-[#d6bcc3]/60" />
            <span className="text-[#8a1630] dark:text-[#ff9fb5] font-bold">
              Exams
            </span>
          </div>
        </nav>

        {/* Interactive Exams Experience */}
        <ExamsPageView />
      </main>

      <LandingFooter />
    </div>
  );
}
