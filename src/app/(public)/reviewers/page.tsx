import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReviewerCatalog } from "@/components/reviewers/ReviewerCatalog";
import { CANONICAL_ORIGIN } from "@/lib/env";

export const metadata: Metadata = {
  title: "Philippine Exam Reviewers Directory",
  description:
    "Explore available and planned Philippine examination reviewers on ReviewTayo, including Civil Service Exam, LET, Nursing, BFP, and NAPOLCOM.",
  alternates: {
    canonical: "/reviewers",
  },
  openGraph: {
    title: "Philippine Exam Reviewers Directory | ReviewTayo",
    description:
      "Comprehensive directory of Philippine licensure, civil service, and qualifying examination reviewers. Review CSE today and discover upcoming exam tools.",
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
      "Directory of Philippine examination reviewers and mock exam tools on ReviewTayo.",
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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb strip */}
        <nav
          aria-label="Breadcrumb"
          className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-border/60 py-2.5 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-brand-700 dark:hover:text-white transition">
              ReviewTayo
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Exams
            </span>
          </div>
        </nav>

        {/* Directory Hero Header */}
        <section className="py-12 sm:py-16 border-b border-border bg-gradient-to-b from-white via-brand-50/10 to-background dark:from-[#1E191C] dark:via-[#1E191C]/60 dark:to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ReviewTayo Exam Catalog</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Philippine Exams Directory
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Find verified preparation tools, subtest drills, and full-length simulated mock tests designed for major Philippine career and licensure examinations.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Original Syllabus Questions
              </span>
              <span>&bull;</span>
              <span>Single Continuous Countdown Timers</span>
              <span>&bull;</span>
              <span>Comprehensive Subject Analytics</span>
            </div>
          </div>
        </section>

        {/* Reviewer Catalog Section */}
        <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewerCatalog initialCategory="all" showCategoryTabs={true} />
        </section>

        {/* Editorial Standards & Roadmap Section */}
        <section className="py-12 bg-slate-50/80 dark:bg-slate-950/60 border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Our Content Authenticity Commitment
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              ReviewTayo strictly authors every question fresh from published regulatory syllabi and laws. We never scrape, reproduce, or copy exam items from past confidential tests, unofficial reviewer PDFs, or social media groups. Every upcoming reviewer listed above is built step-by-step to adhere to rigorous editorial quality gates before release.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
