"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { FAQS } from "@/lib/content";
import { getFaqSchema } from "@/lib/seo/schema";
import { ChevronDown, ChevronUp, Search, ArrowRight, CheckCircle2 } from "lucide-react";

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("eligibility-qualifications");

  const categories = [
    "All",
    "Qualifications & Eligibility",
    "Exam Format & Scoring",
    "Exam Day Guidelines",
    "Preparation & Review",
  ];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Schema.org FAQPage JSON-LD for rich snippets
  const faqSchema = getFaqSchema(FAQS);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Schema.org FAQPage metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 animate-page-enter">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-200/80 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Examination Guidance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Civil Service Exam Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Verified answers to common questions on CSE eligibility requirements, the 80% passing standard, exam day guidelines, and pacing methods.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQ by keyword (e.g. passing grade, calculator, valid ID, retake)..."
                className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                      aria-expanded={isOpen}
                    >
                      <div>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                          {faq.category}
                        </span>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {faq.question}
                        </h2>
                      </div>
                      <div className="text-slate-400 shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-900" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 border-t border-slate-100 pt-3 space-y-3">
                        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          <p>{faq.answer}</p>
                        </div>

                        {/* Related Guides & Practice Links */}
                        {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                              Related Guides &amp; Practice
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {faq.relatedLinks.map((link, idx) => (
                                <Link
                                  key={idx}
                                  href={link.href}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-xs font-medium border border-slate-200 hover:border-brand-200 transition"
                                >
                                  <span>{link.text}</span>
                                  <ArrowRight className="w-3 h-3 text-slate-400" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Official Verification & Contextual Action Block */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified per official Civil Service Commission advisories</span>
                          </div>

                          <Link
                            href="/exams/professional/quick"
                            className="inline-flex items-center gap-1 text-slate-900 font-bold hover:text-brand-700 transition"
                          >
                            <span>Practice related questions</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500">
                  No matching questions found for &ldquo;{searchQuery}&rdquo;.
                </p>
              </div>
            )}
          </div>

          <AdSenseBanner slotId="faq-page-bottom" />

          {/* Bottom Action Card */}
          <div className="bg-slate-900 rounded-2xl text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-lg font-bold">Ready to test your preparation?</h2>
              <p className="text-xs text-slate-300">
                Practice 10 random questions with instant answers and concept explanations.
              </p>
            </div>
            <Link
              href="/exams/professional/quick"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 transition shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <span>Take Free Diagnostic Drill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
