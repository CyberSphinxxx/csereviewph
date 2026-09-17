import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Compass, Home, BookOpen, Clock, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mb-6 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 mb-3">
          Error 404 &bull; Page Not Found
        </span>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">
          Looking for a Review Module?
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-8 leading-relaxed">
          The page or review questionnaire you requested cannot be located. You can navigate back to the practice directory or resume your Civil Service test preparation below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mb-8">
          <Link
            href="/"
            prefetch={true}
            className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition text-center group"
          >
            <Home className="w-5 h-5 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Return Home</span>
            <span className="text-[11px] text-slate-500">reviewtayo.online</span>
          </Link>

          <Link
            href="/practice"
            prefetch={true}
            className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition text-center group"
          >
            <BookOpen className="w-5 h-5 text-gold-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Topic Practice</span>
            <span className="text-[11px] text-slate-500">All 5 Subtests</span>
          </Link>

          <Link
            href="/exams/professional/quick"
            prefetch={true}
            className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition text-center group"
          >
            <Clock className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Quick 10-Item Drill</span>
            <span className="text-[11px] text-slate-500">10-Minute Assessment</span>
          </Link>
        </div>

        <Link
          href="/dashboard"
          prefetch={true}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-md shadow-brand-700/20 transition"
        >
          <span>Go to User Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>

      <Footer />
    </div>
  );
}
