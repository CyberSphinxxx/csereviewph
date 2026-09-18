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

export interface ExamSubjectConfig {
  id: string;
  slug: string;
  name: string;
  order: number;
  description?: string;
  levelIds?: string[]; // If restricted to specific levels
}

export interface ExamCapabilities {
  hasQuickDrill: boolean;
  hasMediumAssessment: boolean;
  hasFullMock: boolean;
  hasTopicPractice: boolean;
}

export interface ExamRoutes {
  infoUrl: string;
  practiceUrl: string;
  quickDrillUrl?: string;
  fullMockUrl?: string;
}

export interface ExamMockSpecs {
  itemCount: number;
  timeLimitMinutes: number;
  passingScorePercentage: number;
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
  subjects?: ExamSubjectConfig[];
  capabilities?: ExamCapabilities;
  routes?: ExamRoutes;
  mockSpecs?: ExamMockSpecs;
  defaultTargetDate?: string;
  defaultTargetName?: string;
}

export const EXAM_CATALOG: ExamCatalogEntry[] = [
  {
    id: "cse",
    slug: "cse",
    shortName: "CSE",
    fullName: "Civil Service Examination (CSE-PPT)",
    description:
      "Independent preparation for Career Service Professional and Subprofessional examinations with full-length continuous timers and detailed subject breakdowns.",
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
    capabilities: {
      hasQuickDrill: true,
      hasMediumAssessment: true,
      hasFullMock: true,
      hasTopicPractice: true,
    },
    routes: {
      infoUrl: "/cse/exam-guide",
      practiceUrl: "/practice",
      quickDrillUrl: "/exams/professional/quick",
      fullMockUrl: "/exams/professional/full",
    },
    mockSpecs: {
      itemCount: 170,
      timeLimitMinutes: 190,
      passingScorePercentage: 80,
    },
    defaultTargetDate: "2027-03-14",
    defaultTargetName: "March 2027 CSE-PPT",
    subjects: [
      { id: "sub-pro-verbal", slug: "verbal-ability", name: "Verbal Ability", order: 1 },
      { id: "sub-pro-numerical", slug: "numerical-ability", name: "Numerical Ability", order: 2 },
      { id: "sub-pro-analytical", slug: "analytical-ability", name: "Analytical Ability", order: 3, levelIds: ["professional"] },
      { id: "sub-pro-geninfo", slug: "general-information", name: "General Information", order: 4 },
      { id: "sub-subpro-clerical", slug: "clerical-operations", name: "Clerical Operations", order: 5, levelIds: ["subprofessional"] },
    ],
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
        items: 150,
        timeLimitMinutes: 180,
      },
      {
        id: "secondary",
        name: "Secondary Teacher Education",
        shortName: "Secondary",
        description: "General Education (20%), Professional Education (40%), and Specialization (40%).",
        items: 150,
        timeLimitMinutes: 180,
      },
    ],
    accent: "blue",
    href: "/let",
    actionLabel: "Planned Reviewer",
    badgeText: "Coming Soon",
    capabilities: {
      hasQuickDrill: false,
      hasMediumAssessment: false,
      hasFullMock: false,
      hasTopicPractice: false,
    },
    routes: {
      infoUrl: "/reviewers",
      practiceUrl: "/reviewers",
    },
    defaultTargetDate: "2027-09-26",
    defaultTargetName: "September 2027 LET",
    subjects: [
      { id: "sub-let-gened", slug: "general-education", name: "General Education", order: 1 },
      { id: "sub-let-profed", slug: "professional-education", name: "Professional Education", order: 2 },
      { id: "sub-let-specialization", slug: "specialization", name: "Major / Specialization", order: 3, levelIds: ["secondary"] },
    ],
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
        items: 500,
        timeLimitMinutes: 300,
      },
    ],
    accent: "emerald",
    href: "/nursing",
    actionLabel: "Planned Reviewer",
    badgeText: "Coming Soon",
    capabilities: {
      hasQuickDrill: false,
      hasMediumAssessment: false,
      hasFullMock: false,
      hasTopicPractice: false,
    },
    routes: {
      infoUrl: "/reviewers",
      practiceUrl: "/reviewers",
    },
    defaultTargetDate: "2027-11-14",
    defaultTargetName: "November 2027 NLE",
    subjects: [
      { id: "sub-nle-ch", slug: "community-health", name: "Community Health Nursing", order: 1 },
      { id: "sub-nle-mc", slug: "maternal-child", name: "Maternal and Child Nursing", order: 2 },
      { id: "sub-nle-ms", slug: "medical-surgical", name: "Medical-Surgical Nursing", order: 3 },
      { id: "sub-nle-mh", slug: "mental-health", name: "Mental Health & Psychiatric Nursing", order: 4 },
      { id: "sub-nle-fund", slug: "fundamentals", name: "Fundamentals of Nursing", order: 5 },
    ],
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
        items: 100,
        timeLimitMinutes: 120,
      },
    ],
    accent: "amber",
    href: "/bfp",
    actionLabel: "Planned Reviewer",
    badgeText: "Coming Soon",
    capabilities: {
      hasQuickDrill: false,
      hasMediumAssessment: false,
      hasFullMock: false,
      hasTopicPractice: false,
    },
    routes: {
      infoUrl: "/reviewers",
      practiceUrl: "/reviewers",
    },
    subjects: [
      { id: "sub-bfp-fire", slug: "fire-suppression", name: "Fire Suppression & Investigation", order: 1 },
      { id: "sub-bfp-safety", slug: "fire-safety-code", name: "Fire Safety & RA 9514 Code", order: 2 },
      { id: "sub-bfp-admin", slug: "administrative-service", name: "Administrative Service Matters", order: 3 },
      { id: "sub-bfp-general", slug: "general-ability", name: "General Ability", order: 4 },
    ],
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
        items: 150,
        timeLimitMinutes: 180,
      },
      {
        id: "promotional",
        name: "Police Promotional Examinations",
        shortName: "Promotional",
        description: "Eligibility assessment for active police personnel advancing in rank.",
        items: 150,
        timeLimitMinutes: 180,
      },
    ],
    accent: "indigo",
    href: "/napolcom",
    actionLabel: "Planned Reviewer",
    badgeText: "Coming Soon",
    capabilities: {
      hasQuickDrill: false,
      hasMediumAssessment: false,
      hasFullMock: false,
      hasTopicPractice: false,
    },
    routes: {
      infoUrl: "/reviewers",
      practiceUrl: "/reviewers",
    },
    subjects: [
      { id: "sub-nap-law", slug: "law-enforcement", name: "Law Enforcement & Police Operations", order: 1 },
      { id: "sub-nap-const", slug: "constitutional-law", name: "Constitutional & Criminal Law", order: 2 },
      { id: "sub-nap-verbal", slug: "verbal-aptitude", name: "Verbal Aptitude", order: 3 },
      { id: "sub-nap-quant", slug: "quantitative-reasoning", name: "Quantitative Reasoning", order: 4 },
    ],
  },
];

export function getAllExams(): ExamCatalogEntry[] {
  return EXAM_CATALOG;
}

export function getAvailableExams(): ExamCatalogEntry[] {
  return EXAM_CATALOG.filter((exam) => exam.availability === "available");
}

export function getExamBySlug(slug: string): ExamCatalogEntry | undefined {
  return EXAM_CATALOG.find((exam) => exam.slug.toLowerCase() === slug.toLowerCase() || exam.id.toLowerCase() === slug.toLowerCase());
}

export function getExamConfig(examId: string): ExamCatalogEntry | undefined {
  return EXAM_CATALOG.find((exam) => exam.id.toLowerCase() === examId.toLowerCase() || exam.slug.toLowerCase() === examId.toLowerCase());
}

export function getExamSubjects(examId: string, levelId?: string): ExamSubjectConfig[] {
  const exam = getExamConfig(examId);
  if (!exam || !exam.subjects) return [];
  if (!levelId) return exam.subjects;
  return exam.subjects.filter((s) => !s.levelIds || s.levelIds.includes(levelId));
}

export function getExamTrack(examId: string, levelId?: string): ExamLevel | undefined {
  const exam = getExamConfig(examId);
  if (!exam || !exam.levels) return undefined;
  if (!levelId) return exam.levels[0];
  return exam.levels.find((lvl) => lvl.id.toLowerCase() === levelId.toLowerCase());
}

export function getFeaturedExam(): ExamCatalogEntry {
  const cse = EXAM_CATALOG.find((exam) => exam.id === "cse");
  if (!cse) {
    throw new Error("Featured CSE exam configuration is required in catalog");
  }
  return cse;
}
