import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";
import { ArrowRight, Lock } from "lucide-react";
import {
  getStudyGuidesByExam,
  GUIDE_HUBS,
  getGuideHubByExamId,
} from "@/lib/content";
import { getExamConfig } from "@/config/exams";
import type { ContentExamId } from "@/lib/content/types";
import {
  getGuideItemListSchema,
  getBreadcrumbSchema,
} from "@/lib/seo/schema";
import { getCanonicalUrl } from "@/lib/env";
import { GuideCardsGrid } from "./GuideCardsGrid";

interface ExamGuidesHubProps {
  examId: ContentExamId;
}

/** Static metadata per hub, consumed by each route's generateMetadata. */
export function getExamGuidesHubMetadata(
  examId: ContentExamId
): Metadata {
  const hub = getGuideHubByExamId(examId);
  return {
    title: hub.seoTitle,
    description: hub.description,
    alternates: {
      canonical: `/guides/${hub.slug}`,
    },
    openGraph: {
      title: hub.seoTitle,
      description: hub.description,
      type: "website",
      url: `/guides/${hub.slug}`,
    },
  };
}

export function ExamGuidesHub({ examId }: ExamGuidesHubProps) {
  const hub = getGuideHubByExamId(examId);
  const exam = getExamConfig(examId);
  const guides = getStudyGuidesByExam(examId);
  const isLive = exam?.status === "live";

  const itemSchema = getGuideItemListSchema(
    guides,
    `${exam?.shortName ?? hub.title} study guides on ReviewTayo`,
    `/guides/${hub.slug}`
  );
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: getCanonicalUrl() },
    { name: "Study resources", url: getCanonicalUrl("/guides") },
    { name: exam?.shortName ?? hub.title, url: getCanonicalUrl(`/guides/${hub.slug}`) },
  ]);

  const otherHubs = GUIDE_HUBS.filter((h) => h.examId !== examId);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f6] dark:bg-[#1a0c11]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main id="main-content" className="flex-1 pb-16 sm:pb-20">
        {/* Hub header */}
        <section className="border-b border-[#8a1630]/10 dark:border-white/10 bg-gradient-to-b from-[#fbeff0]/70 to-transparent dark:from-[#3b1a25]/60">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-11 py-10 sm:py-14 animate-page-enter">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[13px] font-semibold text-[#9a8a90] dark:text-[#a89ba1]"
            >
              <Link href="/guides" className="hover:text-[#8a1630] dark:hover:text-[#ff9fb5] transition-colors">
                Study resources
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#1b1216] dark:text-[#f8ecee]">
                {exam?.shortName ?? hub.title}
              </span>
            </nav>

            <div className="flex items-start gap-5 mt-5">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#8a1630] text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4be08c]" aria-hidden="true" />
                      Live reviewer
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#fbeff0] text-[#8a1630] dark:bg-[#3b1a25] dark:text-[#ff9fb5]">
                      <Lock className="w-3 h-3" aria-hidden="true" />
                      Coming soon
                    </span>
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9a8a90] dark:text-[#a89ba1]">
                    {exam?.agency}
                  </span>
                </div>

                <h1 className="font-display font-extrabold tracking-[-0.03em] text-3xl sm:text-4xl md:text-5xl leading-[1.05] mt-3 text-[#1b1216] dark:text-[#f8ecee]">
                  {hub.title}
                </h1>
                <p className="text-base text-[#5a4a50] dark:text-[#d8c2c9] max-w-2xl mt-3 leading-relaxed">
                  {hub.heroBlurb}
                </p>
              </div>
              <span className="w-16 shrink-0 hidden md:block mt-2" aria-hidden="true">
                <ReviewTayoOwl size={64} withCap />
              </span>
            </div>

            {/* Subject chips from the catalog */}
            {exam?.subjects && exam.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-5">
                {exam.subjects.map((s) => (
                  <span
                    key={s.id}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#8a1630] shadow-[inset_0_0_0_1.5px_rgba(138,22,48,0.18)] dark:bg-[#2b1620] dark:text-[#ff9fb5]"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Guides grid */}
        <section aria-label="Study guides" className="max-w-[1200px] mx-auto px-5 sm:px-11 pt-8">
          {guides.length > 0 ? (
            <GuideCardsGrid guides={guides} />
          ) : (
            <div className="rounded-3xl bg-white dark:bg-[#2b1620] p-8 sm:p-10 shadow-[0_0_0_1px_rgba(138,22,48,0.1),0_20px_44px_-28px_rgba(90,15,35,0.4)] text-center">
              <span className="w-20 mx-auto block" aria-hidden="true">
                <ReviewTayoOwl size={80} withCap />
              </span>
              <h2 className="font-display font-extrabold tracking-[-0.02em] text-2xl mt-4 text-[#1b1216] dark:text-[#f8ecee]">
                Guides for this exam are in research
              </h2>
              <p className="text-sm text-[#5a4a50] dark:text-[#d8c2c9] mt-2 max-w-xl mx-auto leading-relaxed">
                We publish only syllabus-aligned, source-verified content — no
                scraped dumps. This hub fills up as soon as the first guides pass
                editorial review. Meanwhile, the exam subjects above show exactly
                what will be covered.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Link
                  href="/guides/cse"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8a1630] text-white text-sm font-bold shadow-[0_10px_24px_-10px_rgba(138,22,48,0.75)] hover:-translate-y-0.5 transition-transform"
                >
                  Browse CSE guides
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/reviewers"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#2b1620] text-sm font-bold text-[#1b1216] dark:text-[#f8ecee] shadow-[inset_0_0_0_1.5px_rgba(138,22,48,0.24)] hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25] transition-colors"
                >
                  See all exams
                </Link>
              </div>
            </div>
          )}
        </section>

        <div className="max-w-[1200px] mx-auto px-5 sm:px-11">
          <AdSenseBanner slotId="guides-catalog-bottom" />
        </div>

        {/* Cross-links to the other exam hubs */}
        <section aria-label="Other exam guides" className="max-w-[1200px] mx-auto px-5 sm:px-11 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#9a8a90] dark:text-[#a89ba1]">
            Study guides for other exams
          </h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {otherHubs.map((h) => {
              const pill =
                h.examId === "cse"
                  ? "CSE"
                  : h.examId === "let"
                    ? "LET"
                    : h.examId === "cle"
                      ? "CLE"
                      : h.examId === "napolcom"
                        ? "NAPOLCOM"
                        : h.examId === "nursing"
                          ? "NLE"
                          : "BFP / FOE";
              return (
                <Link
                  key={h.slug}
                  href={`/guides/${h.slug}`}
                  className="px-4 py-2 rounded-full bg-white dark:bg-[#2b1620] text-[13px] font-bold text-[#8a1630] dark:text-[#ff9fb5] shadow-[inset_0_0_0_1.5px_rgba(138,22,48,0.16)] hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25] transition-colors"
                >
                  {pill}
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
