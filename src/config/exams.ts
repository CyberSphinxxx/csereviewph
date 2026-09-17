export type ExamAvailability = "available" | "beta" | "coming-soon";

export type ExamCategory = "civil-service" | "licensure" | "public-safety" | "other";

export interface ExamLevel {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  items?: number;
  timeLimitMinutes?: number;
}

export interface ExamCatalogEntry {
  id: string;
  slug: string;
  shortName: string;
  fullName: string;
  description: string;
  agency: string;
  availability: ExamAvailability;
  category: ExamCategory;
  levels: ExamLevel[];
  accent: "brand" | "blue" | "emerald" | "amber" | "indigo";
  href: string;
  actionLabel: string;
  badgeText: string;
}

export const EXAM_CATALOG: ExamCatalogEntry[] = [
  {
    id: "cse",
    slug: "cse",
    shortName: "CSE",
    fullName: "Civil Service Examination (CSE-PPT)",
    description:
      "Official preparation for Career Service Professional and Subprofessional examinations with full-length continuous timers and detailed subject breakdowns.",
    agency: "Civil Service Commission (CSC)",
    availability: "available",
    category: "civil-service",
    levels: [
      {
        id: "professional",
        name: "Career Service Professional",
        shortName: "Professional",
        description: "Qualifies for 1st & 2nd level government positions; includes Analytical Ability.",
        items: 170,
        timeLimitMinutes: 190,
      },
      {
        id: "subprofessional",
        name: "Career Service Subprofessional",
        shortName: "Subprofessional",
        description: "Qualifies for 1st level clerical & administrative positions; includes Clerical Ability.",
        items: 165,
        timeLimitMinutes: 160,
      },
    ],
    accent: "brand",
    href: "/cse",
    actionLabel: "Open CSE Reviewer",
    badgeText: "Available Today",
  },
  {
    id: "let",
    slug: "let",
    shortName: "LET",
    fullName: "Licensure Examination for Teachers",
    description:
      "Comprehensive reviewer covering General Education, Professional Education, and major subject specializations for future Filipino educators.",
    agency: "Professional Regulation Commission (PRC)",
    availability: "coming-soon",
    category: "licensure",
    levels: [
      {
        id: "elementary",
        name: "Elementary Teacher Education",
        shortName: "Elementary",
        description: "General Education (40%) and Professional Education (60%).",
      },
      {
        id: "secondary",
        name: "Secondary Teacher Education",
        shortName: "Secondary",
        description: "General Education (20%), Professional Education (40%), and Specialization (40%).",
      },
    ],
    accent: "blue",
    href: "/let",
    actionLabel: "Planned Reviewer",
    badgeText: "Coming Soon",
  },
  {
    id: "nursing",
    slug: "nursing",
    shortName: "NLE",
    fullName: "Philippine Nursing Licensure Examination",
    description:
      "Core clinical nursing competencies, maternal and child care, community health, and medical-surgical practice drills based on PRC regulatory standards.",
    agency: "Professional Regulation Commission (PRC)",
    availability: "coming-soon",
    category: "licensure",
    levels: [
      {
        id: "nle-boards",
        name: "Nurse Licensure (NLE)",
        shortName: "RN Licensure",
        description: "Comprehensive 5-part nursing practice assessment.",
      },
    ],
    accent: "emerald",
    href: "/nursing",
    actionLabel: "Planned Reviewer",
    badgeText: "Coming Soon",
  },
  {
    id: "bfp",
    slug: "bfp",
    shortName: "BFP Qualifying",
    fullName: "Bureau of Fire Protection Examinations",
    description:
      "Fire Officer Qualifying Examination (FOE) preparation covering fire suppression science, general ability, and administrative service regulations.",
    agency: "Bureau of Fire Protection (BFP) & CSC",
    availability: "coming-soon",
    category: "public-safety",
    levels: [
      {
        id: "foe",
        name: "Fire Officer Examination (FOE)",
        shortName: "FOE Qualifying",
        description: "Recruitment and entry qualification for fire service personnel.",
      },
    ],
    accent: "amber",
    href: "/bfp",
    actionLabel: "Planned Reviewer",
    badgeText: "Coming Soon",
  },
  {
    id: "napolcom",
    slug: "napolcom",
    shortName: "NAPOLCOM",
    fullName: "NAPOLCOM Police Examinations",
    description:
      "PNP Entrance and Police Promotional Examinations covering police operations, constitutional mandates, and public safety ethics.",
    agency: "National Police Commission (NAPOLCOM)",
    availability: "coming-soon",
    category: "public-safety",
    levels: [
      {
        id: "entrance",
        name: "PNP Entrance Examination",
        shortName: "PNP Entrance",
        description: "Required for civilian applicants entering the Philippine National Police.",
      },
      {
        id: "promotional",
        name: "Police Promotional Examinations",
        shortName: "Promotional",
        description: "Eligibility assessment for active police personnel advancing in rank.",
      },
    ],
    accent: "indigo",
    href: "/napolcom",
    actionLabel: "Planned Reviewer",
    badgeText: "Coming Soon",
  },
];

export function getAllExams(): ExamCatalogEntry[] {
  return EXAM_CATALOG;
}

export function getAvailableExams(): ExamCatalogEntry[] {
  return EXAM_CATALOG.filter((exam) => exam.availability === "available");
}

export function getExamBySlug(slug: string): ExamCatalogEntry | undefined {
  return EXAM_CATALOG.find((exam) => exam.slug.toLowerCase() === slug.toLowerCase());
}

export function getFeaturedExam(): ExamCatalogEntry {
  const cse = EXAM_CATALOG.find((exam) => exam.id === "cse");
  if (!cse) {
    throw new Error("Featured CSE exam configuration is required in catalog");
  }
  return cse;
}
