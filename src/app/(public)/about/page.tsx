import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { ShieldCheck, BookOpen, Clock, Target, Award, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — csereviewph.com",
  description:
    "Learn about csereviewph.com, our mission to democratize Civil Service Exam preparation for all Filipinos, and our commitment to 100% original, leak-free educational content.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Banner */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-gold-500" />
              <span>Independent Civil Service Examination Reviewer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              About csereview<span className="text-brand-600">ph</span><span className="text-gold-600 font-extrabold ml-1">.com</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We are dedicated to helping aspiring Filipino civil servants pass the Career Service Examination through accessible, high-fidelity practice and concept-driven instruction.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
                <p className="text-xs text-slate-500">Democratizing access to high-quality exam preparation in the Philippines</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              Every year, hundreds of thousands of Filipinos take the Philippine Civil Service Examination (CSE-PPT) seeking job security, merit-based advancement, and the honor of serving the nation. Yet historically, over 80% of test-takers do not meet the 80.00% benchmark score—not for lack of intellect, but due to unfamiliarity with the continuous pacing, lack of diagnostic feedback, and reliance on disorganized review materials.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>csereviewph.com</strong> was created to bridge this gap. We provide a modern, free, and distraction-free platform that accurately emulates the real exam experience, pinpoints individual weaknesses, and provides in-depth concept explanations.
            </p>
          </div>

          {/* 100% Original Content Guarantee */}
          <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-700/80 text-gold-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Our 100% Original Content Pledge</h2>
                  <p className="text-xs text-slate-300">Ethical authoring & zero-tolerance for copyright infringement</p>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                We take intellectual property and academic integrity seriously:
              </p>

              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                  <span><strong>Zero Copyrighted Materials:</strong> We never copy, scrape, or reproduce questions from commercial reviewer books, PDF dumps, or leaked test papers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                  <span><strong>Syllabus-Aligned Authoring:</strong> Every item is written fresh by subject-matter educators, strictly following the official scope published by the Civil Service Commission.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                  <span><strong>Educational Explanations:</strong> Every question features an in-depth rationale explaining the underlying grammatical rule, algebraic theorem, or constitutional provision.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Key Platform Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="p-2 w-fit rounded-lg bg-brand-50 text-brand-700">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Fidelity Countdown</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Single continuous 3h10m (Pro) and 2h40m (Subpro) timer matching the real paper-and-pencil test allotment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Mistake Bank</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically archives missed items so you can practice them repeatedly until total mastery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="p-2 w-fit rounded-lg bg-amber-50 text-amber-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Free & Open</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Supported by non-intrusive advertising so that quality prep is accessible to every Filipino regardless of financial background.
              </p>
            </div>
          </div>

          {/* AdSense Placement */}
          <AdSenseBanner slotId="about-page-bottom" />

          {/* Next Action Callout */}
          <div className="text-center pt-4">
            <Link
              href="/exams/professional/quick"
              prefetch={true}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-700 text-white font-bold text-sm shadow-md hover:bg-brand-800 transition"
            >
              Start Your First Diagnostic Test
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
