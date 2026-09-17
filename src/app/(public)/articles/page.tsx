import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { getAllArticles } from "@/lib/content";
import { Clock, ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Civil Service Exam Strategy & Preparation Articles",
  description:
    "Expert tips, timing strategies, and educational insights to help Filipino examinees pass the Philippine Civil Service Examination.",
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesCatalogPage() {
  const articles = getAllArticles();
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 animate-page-enter">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-200/80 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Exam Preparation Strategy
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Civil Service Preparation Articles
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Proven pacing frameworks, time management strategies, and tactical advice to help you pass the CSE-PPT on your first attempt.
            </p>
          </div>

          {/* Featured Article Hero */}
          {featuredArticle && (
            <section aria-labelledby="featured-article-title" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
                      Featured Strategy &bull; {featuredArticle.category}
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredArticle.readTimeMinutes} min read</span>
                    </div>
                  </div>

                  <h2 id="featured-article-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    <Link href={`/articles/${featuredArticle.slug}`} className="hover:text-brand-700 transition">
                      {featuredArticle.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {featuredArticle.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Published: {featuredArticle.publishedDate}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Chronological Article List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                All Strategy Guides ({remainingArticles.length + (featuredArticle ? 1 : 0)})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {remainingArticles.map((article) => (
                <article
                  key={article.slug}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTimeMinutes} min</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition leading-snug">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {article.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {article.publishedDate}
                    </span>
                    <Link
                      href={`/articles/${article.slug}`}
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

          <AdSenseBanner slotId="articles-catalog-bottom" />

          {/* CTA Box */}
          <div className="text-center pt-2">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-700 hover:underline"
            >
              <span>Looking for subject reviews? Check out our complete Subtest Study Guides &rarr;</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
