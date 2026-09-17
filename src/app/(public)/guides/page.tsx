import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { getAllStudyGuides } from "@/lib/content";
import { Clock, Tag, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Civil Service Exam Study Guides by Subtest",
  description:
    "Structured syllabus study guides for the Philippine Civil Service Exam (CSE-PPT). Detailed coverage of RA 6713, Philippine Constitution, Vocabulary, Paragraph Organization, and Math.",
  alternates: {
    canonical: "/guides",
  },
};

export default function StudyGuidesCatalogPage() {
  const guides = getAllStudyGuides();
  const featuredGuide = guides[0];
  const remainingGuides = guides.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 animate-page-enter">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-200/80 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Syllabus-Aligned Materials
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Civil Service Subtest Study Guides
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Master the core principles, constitutional provisions, math shortcuts, and grammar rules required to pass the Philippine Career Service Examination.
            </p>
          </div>

          {/* Featured Study Guide Hero */}
          {featuredGuide && (
            <section aria-labelledby="featured-guide-title" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
                      Featured &bull; {featuredGuide.subject}
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredGuide.readTimeMinutes} min read</span>
                    </div>
                  </div>

                  <h2 id="featured-guide-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    <Link href={`/guides/${featuredGuide.slug}`} className="hover:text-brand-700 transition">
                      {featuredGuide.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {featuredGuide.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredGuide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Link
                    href={`/guides/${featuredGuide.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition"
                  >
                    <span>Read Featured Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Additional Guides Directory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                All Subject Guides ({remainingGuides.length + (featuredGuide ? 1 : 0)})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {remainingGuides.map((guide) => (
                <article
                  key={guide.slug}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {guide.subject}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{guide.readTimeMinutes} min</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition leading-snug">
                      <Link href={`/guides/${guide.slug}`}>
                        {guide.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {guide.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Scope: <strong className="text-slate-700">{guide.level}</strong>
                    </span>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-brand-700 transition"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <AdSenseBanner slotId="guides-catalog-bottom" />

          {/* Bottom Callout */}
          <div className="text-center pt-2">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-700 hover:underline"
            >
              <span>Ready to test these concepts? Explore targeted question drills by topic &rarr;</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
