import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";
import { ArrowRight, Clock, Lock, BookOpen, Lightbulb, Target, HelpCircle } from "lucide-react";
import { EXAM_CATALOG } from "@/config/exams";
import {
  getAllStudyGuides,
  getStudyGuidesByExam,
  getAllArticles,
  getGuideHubByExamId,
  type GuideHubConfig,
} from "@/lib/content";
import {
  getGuideItemListSchema,
  getBreadcrumbSchema,
} from "@/lib/seo/schema";
import { getCanonicalUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Study Guides & Reviewers for Philippine Exams",
  description:
    "Free study guides for Philippine government and licensure exams — Civil Service (CSE), LET, Criminology, NAPOLCOM, Nursing, and Fire Officer. Syllabus-aligned guides with sample questions.",
  alternates: {
    canonical: "/guides",
  },
};

/** Directory order: hubs with live guides first, then by catalog order. */
const HUB_ORDER: GuideHubConfig["examId"][] = [
  "cse",
  "let",
  "cle",
  "napolcom",
  "nursing",
  "bfp",
];

/** Decorative ticker terms for the marquee band at the bottom of the page. */
const TICKER_TERMS = [
  "CSE",
  "LET",
  "CLE",
  "NLE",
  "NAPOLCOM",
  "BFP",
  "Civil Service",
  "Licensure",
  "Public Safety",
];

export default function StudyGuidesDirectoryPage() {
  const allGuides = getAllStudyGuides();
  const articles = getAllArticles();

  const itemSchema = getGuideItemListSchema(
    allGuides,
    "ReviewTayo study guides for Philippine exams",
    "/guides"
  );
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: getCanonicalUrl() },
    { name: "Study resources", url: getCanonicalUrl("/guides") },
  ]);

  const shelves = HUB_ORDER.map((examId) => {
    const hub = getGuideHubByExamId(examId);
    const exam = EXAM_CATALOG.find((e) => e.id === examId)!;
    const guides = getStudyGuidesByExam(examId);
    return { hub, exam, guides };
  });

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
        {/* Hero */}
        <section className="border-b border-[#8a1630]/10 dark:border-white/10 bg-gradient-to-b from-[#fbeff0]/70 to-transparent dark:from-[#3b1a25]/60">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-11 py-12 sm:py-16 text-center animate-page-enter">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.14em] text-[#8a1630] dark:text-[#ff9fb5]">
              Study resources
            </span>
            <h1 className="font-display font-extrabold tracking-[-0.03em] text-4xl sm:text-5xl md:text-6xl leading-[1.02] mt-3 text-[#1b1216] dark:text-[#f8ecee]">
              Every exam. Every guide.
              <br />
              <span className="text-[#8a1630] dark:text-[#ff9fb5]">One library.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#5a4a50] dark:text-[#d8c2c9] max-w-2xl mx-auto mt-5 leading-relaxed">
              Free, syllabus-aligned study guides for Philippine examinations — pick
              your exam below or browse the whole library.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm font-bold text-[#5a4a50] dark:text-[#d8c2c9]">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8a1630] dark:text-[#ff9fb5]" aria-hidden="true" />
                {allGuides.length} study guides
              </span>
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#8a1630] dark:text-[#ff9fb5]" aria-hidden="true" />
                {articles.length} strategy articles
              </span>
              <span className="hidden sm:flex items-center gap-2">
                <Target className="w-4 h-4 text-[#8a1630] dark:text-[#ff9fb5]" aria-hidden="true" />
                {EXAM_CATALOG.length} exams covered
              </span>
            </div>
          </div>
        </section>

        {/* Directory shelves */}
        <section aria-label="Guides by exam" className="max-w-[1200px] mx-auto px-5 sm:px-11 pt-10 sm:pt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shelves.map(({ hub, exam, guides }) => {
              const isLive = exam.status === "live";
              const subjectChips = exam.subjects?.slice(0, 4) ?? [];
              return (
                <Link
                  key={hub.slug}
                  href={`/guides/${hub.slug}`}
                  className={`group rounded-3xl p-7 sm:p-8 flex flex-col transition-[background-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6b93b] ${
                    isLive
                      ? "bg-[#8a1630] hover:bg-[#a81b3b] text-white shadow-[0_22px_44px_-24px_rgba(138,22,48,0.7)]"
                      : "bg-white hover:bg-[#fdf1f2] dark:bg-[#2b1620] dark:hover:bg-[#3b1a25] shadow-[0_0_0_1px_rgba(138,22,48,0.1),0_14px_30px_-22px_rgba(90,15,35,0.4)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-white/15 text-white whitespace-nowrap shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4be08c]" aria-hidden="true" />
                        Live reviewer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-[#fbeff0] text-[#8a1630] dark:bg-[#3b1a25] dark:text-[#ff9fb5] whitespace-nowrap shrink-0">
                        <Lock className="w-3 h-3" aria-hidden="true" />
                        Coming soon
                      </span>
                    )}
                    <span
                      className={`min-w-0 text-left text-[10.5px] font-bold uppercase tracking-wider ${
                        isLive ? "text-[#f3cbd3]" : "text-[#9a8a90] dark:text-[#a89ba1]"
                      }`}
                    >
                      {exam.agency}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h2
                      className={`font-display font-extrabold tracking-[-0.02em] text-2xl leading-tight ${
                        isLive ? "text-white" : "text-[#1b1216] dark:text-[#f8ecee]"
                      }`}
                    >
                      {exam.shortName}
                    </h2>
                    <p
                      className={`text-[13.5px] leading-relaxed mt-2.5 ${
                        isLive ? "text-[#f3cbd3]" : "text-[#5a4a50] dark:text-[#d8c2c9]"
                      }`}
                    >
                      {hub.shelfSay}
                    </p>
                  </div>

                  <div className="mt-auto pt-6">
                    {isLive ? (
                      <>
                        <div className="flex gap-5 text-[12.5px] font-bold text-white/95">
                          <span>
                            <span className="font-display font-extrabold text-lg mr-1">{guides.length}</span>
                            guides
                          </span>
                          <span>
                            <span className="font-display font-extrabold text-lg mr-1">{articles.length}</span>
                            articles
                          </span>
                          <span>
                            <span className="font-display font-extrabold text-lg mr-1">
                              {new Set(guides.map((g) => g.subject)).size}
                            </span>
                            subjects
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {subjectChips.map((s) => (
                            <span
                              key={s.id}
                              className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-white/14 text-white"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {subjectChips.map((s) => (
                          <span
                            key={s.id}
                            className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-[#fbeff0] text-[#8a1630] dark:bg-[#3b1a25] dark:text-[#ff9fb5]"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 mt-5 font-extrabold text-sm transition-transform duration-200 group-hover:translate-x-1 ${
                        isLive ? "text-[#f6b93b]" : "text-[#8a1630] dark:text-[#ff9fb5]"
                      }`}
                    >
                      {isLive ? `Open ${exam.shortName} guides` : `See what's coming`}
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Resource-type strip */}
        <section aria-label="Browse all resources" className="max-w-[1200px] mx-auto px-5 sm:px-11 pt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/guides/cse"
              className="group rounded-2xl bg-white dark:bg-[#2b1620] p-6 shadow-[0_0_0_1px_rgba(138,22,48,0.08)] hover:bg-[#fdf1f2] dark:hover:bg-[#3b1a25] transition-[background-color] duration-300"
            >
              <span className="font-display font-extrabold text-3xl text-[#8a1630] dark:text-[#ff9fb5]">
                {allGuides.length}
              </span>
              <span className="block text-sm font-bold text-[#1b1216] dark:text-[#f8ecee] mt-1">
                Study guides
              </span>
              <span className="block text-xs font-semibold text-[#9a8a90] dark:text-[#a89ba1] mt-0.5">
                Subtest deep-dives with sample questions
              </span>
            </Link>
            <Link
              href="/articles"
              className="group rounded-2xl bg-white dark:bg-[#2b1620] p-6 shadow-[0_0_0_1px_rgba(138,22,48,0.08)] hover:bg-[#fdf1f2] dark:hover:bg-[#3b1a25] transition-[background-color] duration-300"
            >
              <span className="font-display font-extrabold text-3xl text-[#8a1630] dark:text-[#ff9fb5]">
                {articles.length}
              </span>
              <span className="block text-sm font-bold text-[#1b1216] dark:text-[#f8ecee] mt-1">
                Strategy articles
              </span>
              <span className="block text-xs font-semibold text-[#9a8a90] dark:text-[#a89ba1] mt-0.5">
                Pacing, scoring, and how to prepare
              </span>
            </Link>
            <Link
              href="/practice"
              className="group rounded-2xl bg-white dark:bg-[#2b1620] p-6 shadow-[0_0_0_1px_rgba(138,22,48,0.08)] hover:bg-[#fdf1f2] dark:hover:bg-[#3b1a25] transition-[background-color] duration-300"
            >
              <span className="font-display font-extrabold text-3xl text-[#8a1630] dark:text-[#ff9fb5]">
                Free
              </span>
              <span className="block text-sm font-bold text-[#1b1216] dark:text-[#f8ecee] mt-1">
                Practice drills
              </span>
              <span className="block text-xs font-semibold text-[#9a8a90] dark:text-[#a89ba1] mt-0.5">
                10-item quick drills by subject
              </span>
            </Link>
            <Link
              href="/faq"
              className="group rounded-2xl bg-white dark:bg-[#2b1620] p-6 shadow-[0_0_0_1px_rgba(138,22,48,0.08)] hover:bg-[#fdf1f2] dark:hover:bg-[#3b1a25] transition-[background-color] duration-300"
            >
              <span className="font-display font-extrabold text-3xl text-[#8a1630] dark:text-[#ff9fb5]">
                FAQ
              </span>
              <span className="block text-sm font-bold text-[#1b1216] dark:text-[#f8ecee] mt-1">
                Exam info &amp; help
              </span>
              <span className="block text-xs font-semibold text-[#9a8a90] dark:text-[#a89ba1] mt-0.5">
                Eligibility, format, exam-day rules
              </span>
            </Link>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-5 sm:px-11">
          <AdSenseBanner slotId="guides-catalog-bottom" />
        </div>

        {/* CSE quick access: guides included in this exam */}
        <section
          aria-labelledby="featured-cse-guides"
          className="max-w-[1200px] mx-auto px-5 sm:px-11 pt-6"
        >
          <div className="rounded-3xl bg-white dark:bg-[#2b1620] p-7 sm:p-10 shadow-[0_0_0_1px_rgba(138,22,48,0.08),0_20px_44px_-28px_rgba(90,15,35,0.4)]">
            <div className="flex items-start gap-4">
              <span className="w-14 shrink-0 hidden sm:block" aria-hidden="true">
                <ReviewTayoOwl size={56} withCap />
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a1630] dark:text-[#ff9fb5]">
                  Most popular
                </span>
                <h2
                  id="featured-cse-guides"
                  className="font-display font-extrabold tracking-[-0.025em] text-2xl sm:text-3xl mt-1 text-[#1b1216] dark:text-[#f8ecee]"
                >
                  Start with the Civil Service Exam guides
                </h2>
                <p className="text-sm text-[#5a4a50] dark:text-[#d8c2c9] mt-2 max-w-2xl leading-relaxed">
                  The CSE is the exam ReviewTayo covers in full today — six subtest
                  deep-dives with sample questions, written from the Official Gazette
                  and CSC publications.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {getStudyGuidesByExam("cse").slice(0, 4).map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-xl px-5 py-3.5 bg-[#fdf8f6] dark:bg-[#1f1017] hover:bg-[#fbeff0] dark:hover:bg-[#3b1a25] transition-colors"
                    >
                      <span className="min-w-0">
                        <span className="block text-[10.5px] font-bold uppercase tracking-wider text-[#8a1630] dark:text-[#ff9fb5]">
                          {guide.subject}
                        </span>
                        <span className="block text-sm font-bold text-[#1b1216] dark:text-[#f8ecee] truncate group-hover:text-[#8a1630] dark:group-hover:text-[#ff9fb5] transition-colors">
                          {guide.title}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-[#9a8a90] dark:text-[#a89ba1] shrink-0">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {guide.readTimeMinutes} min
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/guides/cse"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-[#8a1630] text-white text-sm font-bold shadow-[0_10px_24px_-10px_rgba(138,22,48,0.75)] hover:-translate-y-0.5 transition-transform"
                >
                  Browse all CSE guides
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom callout */}
        <div className="text-center pt-8">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8a1630] dark:text-[#ff9fb5] hover:underline"
          >
            <span>Ready to test these concepts? Practice free mock exams &rarr;</span>
          </Link>
        </div>

        {/* Exam ticker band — same treatment as the landing page's countdown marquee */}
        <div
          className="mt-14 border-t border-white/15 bg-[#2a0a12] dark:bg-[#1a0c11] overflow-hidden whitespace-nowrap py-4 -mx-5 sm:-mx-11 px-5 sm:px-11"
          aria-hidden="true"
        >
          <div className="inline-flex items-center animate-[marq_40s_linear_infinite] hover:[animation-play-state:paused] font-display font-extrabold text-[24px] text-[#f6b93b]">
            {[0, 1].map((copy) => (
              <span key={copy} className="inline-flex items-center gap-[30px] pr-[30px]">
                {TICKER_TERMS.map((term) => (
                  <span key={`${copy}-${term}`} className="inline-flex items-center gap-[30px]">
                    {term}
                    <i className="w-[9px] h-[9px] rounded-full bg-white opacity-50 block" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
