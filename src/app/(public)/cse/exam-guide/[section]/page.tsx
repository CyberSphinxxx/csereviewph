import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExamGuideView } from "@/components/exam-guide/ExamGuideView";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { getCanonicalUrl } from "@/lib/env";

const VALID_SECTIONS = [
  "schedule",
  "testing-centers",
  "how-to-apply",
  "requirements",
  "exam-day",
  "results",
  "official-links",
] as const;

type SectionSlug = (typeof VALID_SECTIONS)[number];

const SECTION_METADATA: Record<
  SectionSlug,
  { title: string; description: string }
> = {
  schedule: {
    title: "CSE Exam Schedule & Calendar (2027 & Historical)",
    description: "View verified examination dates, filing opening periods, and target passer release dates for the Philippine Civil Service Exam.",
  },
  "testing-centers": {
    title: "Civil Service Exam Testing Centers by Region",
    description: "Search and filter CSE-PPT testing center localities across all 16 CSC regions, including amendment history and updates.",
  },
  "how-to-apply": {
    title: "How to Apply for the Civil Service Exam (12 Steps)",
    description: "Step-by-step guide to filing your CSE-PPT application, selecting your CSC regional office, and scheduling personal appearance.",
  },
  requirements: {
    title: "CSE Application & Documentary Requirements Checklist",
    description: "Complete list of required forms (CS Form 100), ID criteria, passport photos with name tag specifications, and statutory eligibility.",
  },
  "exam-day": {
    title: "CSE Exam-Day Protocols & What to Bring Checklist",
    description: "Essential rules for exam day: strict 7:45 AM gate closure, mandatory IDs, black ballpens, permitted items, and prohibited gadgets.",
  },
  results: {
    title: "CSE Results, Rating Verification & Certification",
    description: "How to check official passer lists on csc.gov.ph, generate your OCSERGS rating, and claim your Certificate of Eligibility.",
  },
  "official-links": {
    title: "Official CSC Links & Regional Portal Directory",
    description: "Verified directory of official Civil Service Commission websites, OCSEAS application portals, eServe, and eNOSA systems.",
  },
};

export function generateStaticParams() {
  return VALID_SECTIONS.map((section) => ({
    section,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const resolved = await params;
  const section = resolved.section as SectionSlug;

  if (!VALID_SECTIONS.includes(section)) {
    return {
      title: "CSE Exam Guide",
      alternates: {
        canonical: "/cse/exam-guide",
      },
    };
  }

  const meta = SECTION_METADATA[section];
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/cse/exam-guide/${section}`,
    },
  };
}

export default async function ExamGuideSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const resolved = await params;
  const section = resolved.section as SectionSlug;

  if (!VALID_SECTIONS.includes(section)) {
    notFound();
  }

  const meta = SECTION_METADATA[section];

  const breadcrumbJsonLd = getBreadcrumbSchema([
    {
      name: "Home",
      url: getCanonicalUrl(),
    },
    {
      name: "CSE Exam Guide",
      url: getCanonicalUrl("/cse/exam-guide"),
    },
    {
      name: meta.title,
      url: getCanonicalUrl(`/cse/exam-guide/${section}`),
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-700 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/cse/exam-guide" className="hover:text-brand-700 transition">
            CSE Exam Guide
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-[200px] sm:max-w-md">
            {meta.title}
          </span>
        </nav>

        <ExamGuideView initialSection={section} />
      </main>

      <Footer />
    </div>
  );
}
