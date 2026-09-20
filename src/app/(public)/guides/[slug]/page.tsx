import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { getAllStudyGuides, getStudyGuideBySlug } from "@/lib/content";
import { getExamConfig } from "@/config/exams";
import { getStudyGuideSchema, getBreadcrumbSchema } from "@/lib/seo/schema";
import { getCanonicalUrl } from "@/lib/env";
import {
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  User,
} from "lucide-react";

export async function generateStaticParams() {
  const guides = getAllStudyGuides();
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getStudyGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Study Guide Not Found",
    };
  }

  const metaTitle = guide.seoTitle || `${guide.title} Study Guide`;

  return {
    title: metaTitle,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: guide.description,
      type: "article",
      url: `/guides/${guide.slug}`,
      ...(guide.isoUpdatedDate ? { modifiedTime: guide.isoUpdatedDate } : {}),
      authors: guide.author ? [guide.author] : ["ReviewTayo Editorial Team"],
    },
  };
}

export default async function StudyGuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getStudyGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const guideJsonLd = getStudyGuideSchema(guide);
  const exam = getExamConfig(guide.examId ?? "cse");
  const hubHref = exam ? `/guides/${exam.slug}` : "/guides";

  const breadcrumbJsonLd = getBreadcrumbSchema([
    {
      name: "Home",
      url: getCanonicalUrl(),
    },
    {
      name: "Study resources",
      url: getCanonicalUrl("/guides"),
    },
    {
      name: `${exam?.shortName ?? "Exam"} guides`,
      url: getCanonicalUrl(hubHref),
    },
    {
      name: guide.title,
      url: getCanonicalUrl(`/guides/${guide.slug}`),
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f6] dark:bg-[#1a0c11]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-brand-700 transition">
              Study resources
            </Link>
            <span>/</span>
            <Link href={hubHref} className="hover:text-brand-700 transition whitespace-nowrap">
              {exam?.shortName ?? "Exam"} guides
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-[#f8ecee] font-medium truncate max-w-[160px] sm:max-w-md">
              {guide.title}
            </span>
          </nav>

          {/* Guide Header */}
          <header className="bg-white dark:bg-[#2b1620] rounded-2xl shadow-[0_0_0_1px_rgba(138,22,48,0.1),0_18px_40px_-28px_rgba(90,15,35,0.4)] p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
                {guide.subject}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Level: {guide.level}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>{guide.readTimeMinutes} min read</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {guide.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {guide.description}
            </p>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-800">{guide.author}</span>
                  {guide.authorRole && (
                    <span className="text-slate-400">({guide.authorRole})</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last updated: {guide.lastUpdated}</span>
                </div>
                {guide.reviewedBy && (
                  <div className="text-slate-500 italic">
                    Reviewed by <span className="font-medium text-slate-700">{guide.reviewedBy}</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Table of Contents Box */}
          <nav aria-label="Table of contents" className="p-5 rounded-xl bg-[#f6ecee] dark:bg-[#1f1017]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
              Table of Contents
            </span>
            <ul className="space-y-1.5 text-xs text-brand-800">
              {guide.sections.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="hover:underline flex items-center gap-1.5"
                  >
                    <span className="text-slate-400">{idx + 1}.</span>
                    <span>{section.heading}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Guide Sections */}
          <div className="space-y-8">
            {guide.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-white dark:bg-[#2b1620] rounded-2xl shadow-[0_0_0_1px_rgba(138,22,48,0.09),0_18px_40px_-28px_rgba(90,15,35,0.4)] p-6 sm:p-8 space-y-6 scroll-mt-20"
              >
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-600 shrink-0" />
                  <span>{section.heading}</span>
                </h2>

                <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-3">
                  <p>{section.content}</p>
                </div>

                {/* Key Takeaways */}
                {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                  <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-100 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      <span>Key Takeaways for Examinees</span>
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-brand-950">
                      {section.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Example Question with Explanation */}
                {section.exampleQuestion && (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                      <span>Sample Exam Simulation Question</span>
                    </span>

                    <p className="text-sm font-semibold text-slate-900">
                      {section.exampleQuestion.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {section.exampleQuestion.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-2.5 rounded-lg border text-slate-700 ${
                            i === section.exampleQuestion?.correctIndex
                              ? "bg-emerald-50 border-emerald-300 font-semibold text-emerald-900"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Concept Rationale: </strong>
                      {section.exampleQuestion.explanation}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Guide Sources and Official Basis */}
          {guide.sources && guide.sources.length > 0 && (
            <div className="bg-white dark:bg-[#2b1620] rounded-2xl shadow-[0_0_0_1px_rgba(138,22,48,0.09)] p-6 sm:p-8 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Syllabus References & Legal Authorities
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
                {guide.sources.map((src, i) => (
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

          {/* AdSense Placement Bottom */}
          <div className="py-2">
            <AdSenseBanner slotId="guide-page-bottom" />
          </div>

          {/* Next Steps CTA */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#8a1630] to-[#2a0a12] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_44px_-24px_rgba(138,22,48,0.7)]">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold">Apply what you learned</h3>
              <p className="text-xs text-[#f3cbd3]">
                Practice specific {guide.subject} questions in timed examination conditions.
              </p>
            </div>
            <Link
              href="/practice"
              className="px-5 py-2.5 rounded-xl bg-white text-brand-900 text-xs font-bold hover:bg-brand-50 transition shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <span>Practice Questions Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
