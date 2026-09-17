import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, ShieldAlert, Scale, CheckCircle2, Ban } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service governing the use of ReviewTayo educational Civil Service Exam reviewer platform.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const lastUpdated = "September 9, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5 text-brand-600" />
              <span>User Agreement & Platform Rules</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Last updated: {lastUpdated} &bull; Please read carefully
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-5 h-5 text-brand-600" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or utilizing <strong>ReviewTayo</strong> (&ldquo;the Platform&rdquo;), you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                2. Permitted Educational Use
              </h2>
              <p>
                ReviewTayo is provided free of charge strictly for personal, non-commercial review and preparation for the Philippine Career Service Examination. You are granted a personal, revocable, non-exclusive license to practice questions, review educational explanations, and monitor your personal readiness.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Ban className="w-5 h-5 text-red-600" />
                3. Prohibited Activities
              </h2>
              <p>You agree not to engage in any of the following unauthorized activities:</p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                <li>
                  <strong>Automated Scraping:</strong> Using bots, scrapers, crawlers, or automated scripts to systematically harvest questions, explanations, or diagnostic databases.
                </li>
                <li>
                  <strong>Commercial Resale:</strong> Packaging, publishing, printing, or reselling platform questions or study materials as paid reviewer modules without explicit written authorization.
                </li>
                <li>
                  <strong>Denial of Service & Tampering:</strong> Attempting to disrupt, overload, or bypass rate limits, timers, or security mechanisms of the platform.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldAlert className="w-5 h-5 text-gold-600" />
                4. Intellectual Property
              </h2>
              <p>
                All original questions, choices, rationales, software code, graphic designs, algorithms, and documentation on ReviewTayo are the proprietary intellectual property of ReviewTayo and its educational contributors. All rights are reserved under the Intellectual Property Code of the Philippines (Republic Act No. 8293).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Scale className="w-5 h-5 text-brand-600" />
                5. Disclaimer of Warranties & Limitation of Liability
              </h2>
              <p>
                The Platform is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. While we strive for absolute factual accuracy and curriculum fidelity, ReviewTayo makes no guarantees that using this platform guarantees passing the official Civil Service Commission examination. In no event shall ReviewTayo or its maintainers be liable for any direct, indirect, or consequential damages resulting from your use of the platform.
              </p>
            </section>

            <section className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                6. Governing Law & Jurisdiction
              </h2>
              <p className="text-xs text-slate-600">
                These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of the Philippines.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
