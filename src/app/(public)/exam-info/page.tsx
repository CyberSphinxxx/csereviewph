import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  Award,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Civil Service Exam Guide & Information",
  description:
    "Official guide to the Philippine Civil Service Examination (CSE-PPT): schedule, qualifications, application requirements, subtest breakdowns, and exam day protocols.",
  alternates: {
    canonical: "/exam-info",
  },
};

export default function ExamInfoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Hero Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Comprehensive Examination Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Philippine Civil Service Exam (CSE-PPT) Overview
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about the Career Service Examination: eligibility levels, official subtest coverage, application schedules, and exam day regulations.
            </p>
          </div>

          {/* Quick Specs Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Examination Comparison Matrix
                </h2>
                <p className="text-xs text-slate-500">
                  Key structural differences between Professional and Subprofessional levels
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 font-bold bg-slate-50">
                    <th className="p-3">Feature</th>
                    <th className="p-3">Professional Level</th>
                    <th className="p-3">Subprofessional Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Career Qualification</td>
                    <td className="p-3">First & Second Level Positions (Clerical up to Division Chief)</td>
                    <td className="p-3">First Level Positions Only (Clerical, Trades, Crafts)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Total Items</td>
                    <td className="p-3 font-bold text-brand-700">170 Items</td>
                    <td className="p-3 font-bold text-brand-700">165 Items</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Time Allotment</td>
                    <td className="p-3">3 Hours 10 Minutes (190 mins continuous)</td>
                    <td className="p-3">2 Hours 40 Minutes (160 mins continuous)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Subtests Tested</td>
                    <td className="p-3">
                      Verbal Ability, Numerical Ability, <strong>Analytical Ability</strong>, General Information
                    </td>
                    <td className="p-3">
                      Verbal Ability, Numerical Ability, <strong>Clerical Ability</strong>, General Information
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Passing Grade</td>
                    <td className="p-3 font-bold text-emerald-700">80.00% General Rating</td>
                    <td className="p-3 font-bold text-emerald-700">80.00% General Rating</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Application & Documentary Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3">
                <FileCheck className="w-5 h-5 text-brand-700" />
                <span>Documentary Requirements</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Duly accomplished <strong>CS Form No. 100</strong> (Application Form revised series).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Four (4) identical passport-size (4.5 cm x 3.5 cm) photos with handwritten name tag and signature over printed name on white background.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Original and photocopy of valid government-issued ID containing date of birth and signature.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Examination fee: ₱500.00 standard nationwide.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-3">
                <Clock className="w-5 h-5 text-brand-700" />
                <span>Exam Day Regulations</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Gate Closure:</strong> Gates strictly close at 7:45 AM. Late examinees are barred without exception.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Ballpens:</strong> Bring black ballpens only. Gel pens, friction pens, and pencils are prohibited on answer sheets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Dress Code:</strong> Plain casual attire with sleeves (collared shirt or t-shirt). Sleeveless tops, shorts, and slippers are prohibited.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Zero Gadget Policy:</strong> Calculators, smartwatches, and cellphones are strictly banned.</span>
                </li>
              </ul>
            </div>
          </div>

          <AdSenseBanner slotId="exam-info-middle" />

          {/* Official Portal Link Callout */}
          <div className="p-5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
              <span>
                To schedule an appointment or check the official filing calendar, visit the Civil Service Commission&apos;s Online Registration, Appointment and Scheduling System (OCRAS).
              </span>
            </div>
            <a
              href="https://www.csc.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:text-brand-700 transition shrink-0"
            >
              <span>Visit CSC.gov.ph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Bottom Action */}
          <div className="text-center pt-2">
            <Link
              href="/exams/professional/quick"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 text-white text-sm font-bold shadow-md hover:bg-brand-800 transition"
            >
              <span>Start Quick 10-Question Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
