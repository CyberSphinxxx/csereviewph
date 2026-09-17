import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/seo/schema";
import { getCanonicalUrl } from "@/lib/env";
import {
  Clock,
  Calendar,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Share2,
} from "lucide-react";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const metaTitle = article.seoTitle || article.title;

  return {
    title: metaTitle,
    description: article.description,
    authors: [{ name: article.author }],
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: article.description,
      type: "article",
      url: `/articles/${article.slug}`,
      ...(article.isoPublishedDate ? { publishedTime: article.isoPublishedDate } : {}),
      ...(article.isoUpdatedDate || article.isoPublishedDate
        ? { modifiedTime: article.isoUpdatedDate || article.isoPublishedDate }
        : {}),
      authors: [article.author],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = getArticleSchema(article);

  const breadcrumbJsonLd = getBreadcrumbSchema([
    {
      name: "Home",
      url: getCanonicalUrl(),
    },
    {
      name: "Articles",
      url: getCanonicalUrl("/articles"),
    },
    {
      name: article.title,
      url: getCanonicalUrl(`/articles/${article.slug}`),
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-brand-700 transition">
              Articles
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-md">
              {article.title}
            </span>
          </nav>

          {/* Article Header Card */}
          <header className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {article.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTimeMinutes} min read</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              {article.description}
            </p>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-800">{article.author}</span>
                  {article.authorRole && (
                    <span className="text-slate-400">({article.authorRole})</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Published: {article.publishedDate}</span>
                </div>
                {article.reviewedBy && (
                  <div className="text-slate-500 italic">
                    Reviewed by <span className="font-medium text-slate-700">{article.reviewedBy}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <Share2 className="w-3.5 h-3.5" />
                <span>Free Educational Resource</span>
              </div>
            </div>
          </header>

          {/* Key Highlights Card */}
          {article.keyHighlights && article.keyHighlights.length > 0 && (
            <div className="bg-gradient-to-br from-brand-50 to-brand-100/40 rounded-2xl border border-brand-200 p-6 space-y-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Executive Summary & Key Takeaways</span>
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                {article.keyHighlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Main Content Body */}
          <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed">
            {article.content.map((paragraph, index) => (
              <p key={index} className="text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {/* Official Sources and Citations */}
            {article.sources && article.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Official Sources & References
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                  {article.sources.map((src, i) => (
                    <li key={i}>
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-brand-700"
                        >
                          {src.title}
                        </a>
                      ) : (
                        <span>{src.title}</span>
                      )}
                      {src.publisher && (
                        <span className="text-slate-400 ml-1">({src.publisher})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* AdSense Placement Bottom */}
          <div className="py-2">
            <AdSenseBanner slotId="article-page-bottom" />
          </div>

          {/* Action Footer Callout */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold">Experience the real pacing</h3>
              <p className="text-xs text-brand-100">
                Take our 170-item Full Mock Exam with the real 3h 10m continuous timer.
              </p>
            </div>
            <Link
              href="/exams/professional/full"
              className="px-5 py-2.5 rounded-xl bg-white text-brand-900 text-xs font-bold hover:bg-brand-50 transition shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <span>Launch Full Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
