import type { ContentExamId } from "./types";

/**
 * Per-exam guide hub configuration (Concept B: directory + per-exam hubs).
 *
 * Each exam gets a static hub at /guides/{slug} with its own metadata and
 * JSON-LD; /guides is the directory that interlinks all hubs. Copy here is
 * editorial; exam facts (subjects, agency, availability) come from
 * EXAM_CATALOG at render time so the two never drift.
 *
 * SEO titles must land at 45-60 characters after the layout template appends
 * " | ReviewTayo" (pinned by tests/unit/seo/metadata.test.ts).
 */
export interface GuideHubConfig {
  examId: ContentExamId;
  /** URL segment under /guides. Static route: src/app/(public)/guides/{slug}/page.tsx */
  slug: string;
  /** Page H1 */
  title: string;
  /** <title> without the " | ReviewTayo" suffix. 45-60 chars including suffix. */
  seoTitle: string;
  /** Meta description */
  description: string;
  /** Intro paragraph under the H1 */
  heroBlurb: string;
  /** One-liner on the directory shelf card */
  shelfSay: string;
}

export const GUIDE_HUBS: GuideHubConfig[] = [
  {
    examId: "cse",
    slug: "cse",
    title: "Civil Service Exam study guides",
    seoTitle: "Civil Service Exam Study Guides by Subtest",
    description:
      "Structured syllabus study guides for the Philippine Civil Service Exam (CSE-PPT). Detailed coverage of RA 6713, Philippine Constitution, Vocabulary, Paragraph Organization, and Math.",
    heroBlurb:
      "Master the core principles, constitutional provisions, math shortcuts, and grammar rules required to pass the Philippine Career Service Examination — free, no account needed.",
    shelfSay:
      "Professional & Subprofessional levels, aligned to the official CSC exam scope.",
  },
  {
    examId: "let",
    slug: "let",
    title: "LET study guides for future teachers",
    seoTitle: "LET Reviewer: Study Guides for Future Teachers",
    description:
      "Syllabus study guides for the Licensure Examination for Teachers (LET) — General Education, Professional Education, and major specializations for elementary and secondary levels.",
    heroBlurb:
      "Research is underway for General Education and Professional Education guides aligned to the PRC board scope for elementary and secondary teachers.",
    shelfSay:
      "General Education and Professional Education guides are in research for elementary and secondary levels.",
  },
  {
    examId: "cle",
    slug: "cle",
    title: "Criminologist board exam study guides",
    seoTitle: "Criminologist Board Exam Study Guides (CLE)",
    description:
      "Study guides for the Criminologist Licensure Examination — criminal jurisprudence, law enforcement administration, criminalistics, and correctional administration.",
    heroBlurb:
      "Six board subjects, one long exam day. Guides for criminal jurisprudence, law enforcement administration, criminalistics, and more are in research.",
    shelfSay:
      "A PRC board exam separate from the PNP entrance — six subjects from jurisprudence to criminalistics.",
  },
  {
    examId: "napolcom",
    slug: "napolcom",
    title: "NAPOLCOM exam study guides",
    seoTitle: "NAPOLCOM & PNP Entrance Exam Study Guides",
    description:
      "Study guides for the NAPOLCOM PNP Entrance and Promotional Examinations — police operations, constitutional and criminal law, verbal aptitude, and quantitative reasoning.",
    heroBlurb:
      "For civilian applicants entering the Philippine National Police and active personnel advancing in rank — guides covering the official NAPOLCOM scope are in research.",
    shelfSay:
      "For PNP applicants and personnel advancing in rank — entrance and promotional exam coverage.",
  },
  {
    examId: "nursing",
    slug: "nursing",
    title: "Philippine nursing board exam study guides",
    seoTitle: "Philippine Nursing Board Exam Study Guides",
    description:
      "Study guides for the Philippine Nurse Licensure Examination (NLE) — community health, maternal and child, medical-surgical, and psychiatric nursing.",
    heroBlurb:
      "A five-part clinical and theoretical assessment for aspiring Registered Nurses — guides for every NLE subject are in research.",
    shelfSay:
      "Five-part clinical and theoretical assessment for aspiring Registered Nurses.",
  },
  {
    examId: "bfp",
    slug: "bfp",
    title: "Fire Officer exam study guides",
    seoTitle: "Fire Officer Exam (FOE) Study Guides — BFP",
    description:
      "Study guides for the Bureau of Fire Protection Fire Officer Examination (FOE) — Fire Safety Code (RA 9514), fire suppression, and administrative service matters.",
    heroBlurb:
      "Recruitment and entry qualification for fire service personnel — guides covering the Fire Safety Code, suppression and operations, and administration are in research.",
    shelfSay:
      "Recruitment and entry qualification for fire service personnel across three subject areas.",
  },
];

export function getGuideHubByExamId(examId: ContentExamId): GuideHubConfig {
  const hub = GUIDE_HUBS.find((h) => h.examId === examId);
  if (!hub) {
    throw new Error(`Missing guide hub config for exam: ${examId}`);
  }
  return hub;
}

export function getGuideHubBySlug(slug: string): GuideHubConfig | undefined {
  return GUIDE_HUBS.find((h) => h.slug.toLowerCase() === slug.toLowerCase());
}
