/**
 * Directory configuration for the complete catalog of Philippine exams on ReviewTayo.
 * Covers 16 official category groups, 5 exploration goals, and 69 examinations.
 *
 * Rules:
 * - Engine logic must remain generic and decoupled.
 * - Only Civil Service Examination functionality that genuinely exists is marked live.
 * - Future exams are marked coming-soon and do not lead to nonexistent review routes.
 * - No scraped or external third-party content.
 */

export type ExamFamily = "civil" | "safety" | "lic" | "school" | "skills";

export interface ExamGroup {
  id: string;
  name: string;
  family: ExamFamily;
  iconName: string;
  order: number;
}

export interface ExamGoal {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  groupIds: string[];
  say: string;
}

export interface DirectoryExam {
  id: string;
  groupId: string;
  code: string;
  name: string;
  agency?: string;
  live: boolean;
  itemCount?: number;
  duration?: string;
  note?: string;
  alsoGroupIds?: string[];
  keywords?: string;
  family: ExamFamily;
  route: string;
}

export const EXAM_FAMILIES: Record<
  ExamFamily,
  { bgClass: string; fgClass: string; style: { bg: string; fg: string } }
> = {
  civil: {
    bgClass: "bg-[#8a1630] text-white",
    fgClass: "text-[#8a1630] dark:text-[#ff9fb5]",
    style: { bg: "#8a1630", fg: "#ffffff" },
  },
  safety: {
    bgClass: "bg-[#dce6f8] text-[#1f3a6e] dark:bg-[#1f304f] dark:text-[#cce0ff]",
    fgClass: "text-[#1f3a6e] dark:text-[#cce0ff]",
    style: { bg: "#dce6f8", fg: "#1f3a6e" },
  },
  lic: {
    bgClass: "bg-[#fdeec6] text-[#6b4300] dark:bg-[#4a3410] dark:text-[#fdeec6]",
    fgClass: "text-[#6b4300] dark:text-[#fdeec6]",
    style: { bg: "#fdeec6", fg: "#6b4300" },
  },
  school: {
    bgClass: "bg-[#d7efe0] text-[#14532d] dark:bg-[#133a22] dark:text-[#c2ebd0]",
    fgClass: "text-[#14532d] dark:text-[#c2ebd0]",
    style: { bg: "#d7efe0", fg: "#14532d" },
  },
  skills: {
    bgClass: "bg-[#e6dcf7] text-[#45276f] dark:bg-[#352152] dark:text-[#e1d3f7]",
    fgClass: "text-[#45276f] dark:text-[#e1d3f7]",
    style: { bg: "#e6dcf7", fg: "#45276f" },
  },
};

export const EXAM_GROUPS: ExamGroup[] = [
  { id: "gov", name: "Government & Civil Service", family: "civil", iconName: "briefcase", order: 0 },
  { id: "safety", name: "Police, Military & Public Safety", family: "safety", iconName: "shield", order: 1 },
  { id: "crim", name: "Criminology", family: "safety", iconName: "shield", order: 2 },
  { id: "edu", name: "Education", family: "lic", iconName: "book-open", order: 3 },
  { id: "health", name: "Nursing, Medicine & Health", family: "lic", iconName: "activity", order: 4 },
  { id: "psych", name: "Psychology & Social Sciences", family: "lic", iconName: "message-square", order: 5 },
  { id: "biz", name: "Accounting, Finance & Business", family: "lic", iconName: "bar-chart-3", order: 6 },
  { id: "eng", name: "Engineering", family: "lic", iconName: "settings", order: 7 },
  { id: "arch", name: "Architecture, Planning & Design", family: "lic", iconName: "home", order: 8 },
  { id: "sci", name: "Science, Agriculture & Environment", family: "lic", iconName: "flask-conical", order: 9 },
  { id: "law", name: "Law", family: "lic", iconName: "scale", order: 10 },
  { id: "admit", name: "Medical & Law School Admission", family: "school", iconName: "graduation-cap", order: 11 },
  { id: "college", name: "College Entrance", family: "school", iconName: "graduation-cap", order: 12 },
  { id: "scholar", name: "Scholarships", family: "school", iconName: "award", order: 13 },
  { id: "basic", name: "Basic Education (DepEd)", family: "skills", iconName: "book-open", order: 14 },
  { id: "tesda", name: "Technical & Vocational (TESDA)", family: "skills", iconName: "settings", order: 15 },
];

export const EXAM_GROUPS_BY_ID: Record<string, ExamGroup> = Object.fromEntries(
  EXAM_GROUPS.map((g) => [g.id, g])
);

export const EXAM_GOALS: ExamGoal[] = [
  {
    id: "gov",
    title: "A government job",
    subtitle: "Civil service and agency exams",
    iconName: "briefcase",
    groupIds: ["gov"],
    say: "Civil service and agency exams are here.",
  },
  {
    id: "safety",
    title: "A police, military or fire career",
    subtitle: "PNP, AFP, PMA, BFP and more",
    iconName: "shield",
    groupIds: ["safety", "crim"],
    say: "Police, military and fire exams are all here.",
  },
  {
    id: "lic",
    title: "A professional license",
    subtitle: "Teacher, nurse, engineer, accountant and more",
    iconName: "badge-check",
    groupIds: ["edu", "health", "psych", "biz", "eng", "arch", "sci", "law"],
    say: "That covers a lot of boards. Pick a field to narrow it down.",
  },
  {
    id: "school",
    title: "A college or scholarship spot",
    subtitle: "Entrance, scholarship and admission tests",
    iconName: "graduation-cap",
    groupIds: ["college", "scholar", "admit"],
    say: "Entrance, scholarship and admission tests are here.",
  },
  {
    id: "skills",
    title: "A school or skills certificate",
    subtitle: "DepEd assessments and TESDA NC",
    iconName: "book-open",
    groupIds: ["basic", "tesda"],
    say: "DepEd assessments and TESDA certificates are here.",
  },
];

let examCounter = 0;
function createExam(
  groupId: string,
  code: string,
  name: string,
  agency: string,
  extra?: {
    live?: boolean;
    itemCount?: number;
    duration?: string;
    note?: string;
    alsoGroupIds?: string[];
    keywords?: string;
    route?: string;
  }
): DirectoryExam {
  const grp = EXAM_GROUPS_BY_ID[groupId] || EXAM_GROUPS[0];
  const isLive = Boolean(extra?.live);
  const route = extra?.route || (isLive ? "/cse" : "/reviewers");

  return {
    id: `exam-${examCounter++}`,
    groupId,
    code,
    name,
    agency: agency || undefined,
    live: isLive,
    itemCount: extra?.itemCount,
    duration: extra?.duration,
    note: extra?.note,
    alsoGroupIds: extra?.alsoGroupIds,
    keywords: extra?.keywords,
    family: grp.family,
    route,
  };
}

export const DIRECTORY_EXAMS: DirectoryExam[] = [
  /* 1. Government & Civil Service */
  createExam("gov", "CSE", "Career Service Examination, Professional Level", "Civil Service Commission", {
    live: true,
    itemCount: 170,
    duration: "3h 10m",
    note: "For second-level positions",
    keywords: "civil service cse pro csc government",
    route: "/cse",
  }),
  createExam("gov", "CSE", "Career Service Examination, Subprofessional Level", "Civil Service Commission", {
    live: true,
    itemCount: 165,
    duration: "2h 40m",
    note: "For first-level positions",
    keywords: "civil service cse subpro csc government",
    route: "/cse",
  }),
  createExam("gov", "CSE-FSO", "Career Service Examination for Foreign Service Officer", "", {
    keywords: "fso foreign service diplomat dfa",
  }),
  createExam("gov", "FOE", "Fire Officer Examination", "Bureau of Fire Protection / CSC", {
    itemCount: 100,
    duration: "2h",
    note: "Recruitment and entry qualification for fire service personnel",
    alsoGroupIds: ["safety"],
    keywords: "fire officer bfp firefighter",
  }),
  createExam("gov", "POE", "Penology Officer Examination", "", {
    keywords: "penology jail prison corrections bjmp",
  }),
  createExam("gov", "BCLTE", "Basic Competency on Local Treasury Examination", "Civil Service Commission", {
    note: "CSC withheld this exam for 2026 while the system is being reviewed.",
    keywords: "local treasury bclte treasurer",
  }),

  /* 2. Police, Military & Public Safety */
  createExam("safety", "PNPEE", "PNP Entrance Examination", "National Police Commission", {
    itemCount: 150,
    duration: "3h",
    note: "NAPOLCOM Entrance Exam, for civilian applicants entering the Philippine National Police",
    keywords: "police pnp napolcom entrance",
  }),
  createExam("safety", "PNP", "PNP Promotional Examination", "National Police Commission", {
    itemCount: 150,
    duration: "3h",
    note: "For active police personnel advancing in rank",
    keywords: "police pnp napolcom promotion promotional",
  }),
  createExam("safety", "PESE", "Police Executive Service Eligibility Examination", "", {
    keywords: "police executive pnp eligibility",
  }),
  createExam("safety", "PNPACAT", "Philippine National Police Academy Cadet Admission Test", "Philippine National Police Academy", {
    note: "The PNPA runs its own cadet admission exam",
    keywords: "pnpa cadet police academy",
  }),
  createExam("safety", "PMAEE", "Philipp Military Academy Entrance Examination", "Philippine Military Academy", {
    note: "The PMA runs its own cadet admission exam",
    keywords: "pma cadet military academy baguio",
  }),
  createExam("safety", "AFPSAT", "Armed Forces of the Philippines Service Aptitude Test", "Armed Forces of the Philippines", {
    keywords: "afp soldier military",
  }),
  createExam("safety", "", "Philippine Army recruitment and qualifying examinations", "Philippine Army", {
    keywords: "army soldier military",
  }),
  createExam("safety", "", "Philippine Navy recruitment and qualifying examinations", "Philippine Navy", {
    keywords: "navy sailor military",
  }),
  createExam("safety", "", "Philippine Air Force recruitment and qualifying examinations", "Philippine Air Force", {
    keywords: "air force pilot military paf",
  }),
  createExam("safety", "", "Philippine Coast Guard aptitude and recruitment examinations", "Philippine Coast Guard", {
    keywords: "coast guard pcg",
  }),

  /* 3. Criminology */
  createExam("crim", "CLE", "Criminologist Licensure Examination", "Professional Regulation Commission", {
    itemCount: 600,
    duration: "6h",
    note: "A PRC board exam, separate from the PNP Entrance Examination",
    keywords: "criminology criminologist prc board",
  }),

  /* 4. Education */
  createExam("edu", "LET", "Licensure Examination for Professional Teachers, Elementary", "Professional Regulation Commission", {
    itemCount: 150,
    duration: "3h",
    note: "General Education 40%, Professional Education 60%",
    keywords: "let lept teacher teachers teaching elementary prc board",
  }),
  createExam("edu", "LET", "Licensure Examination for Professional Teachers, Secondary", "Professional Regulation Commission", {
    itemCount: 150,
    duration: "3h",
    note: "General Education 20%, Professional Education 40%, Specialization 40%",
    keywords: "let lept teacher teachers teaching secondary high school prc board",
  }),
  createExam("edu", "", "Guidance Counselors Licensure Examination", "Professional Regulation Commission", {
    alsoGroupIds: ["psych"],
    keywords: "guidance counselor counseling prc board",
  }),
  createExam("edu", "", "Librarians Licensure Examination", "Professional Regulation Commission", {
    keywords: "librarian library prc board",
  }),

  /* 5. Nursing, Medicine & Health */
  createExam("health", "NLE", "Nurses Licensure Examination", "Professional Regulation Commission", {
    itemCount: 500,
    duration: "5h",
    note: "5-part nursing practice assessment",
    keywords: "nurse nursing rn registered nurse prc board",
  }),
  createExam("health", "PLE", "Physicians Licensure Examination", "Professional Regulation Commission", {
    keywords: "doctor physician medicine md medical prc board",
  }),
  createExam("health", "MTLE", "Medical Technologists Licensure Examination", "Professional Regulation Commission", {
    keywords: "medtech med tech medical technologist laboratory prc board",
  }),
  createExam("health", "", "Midwives Licensure Examination", "Professional Regulation Commission", {
    keywords: "midwife midwifery prc board",
  }),
  createExam("health", "", "Pharmacists Licensure Examination", "Professional Regulation Commission", {
    keywords: "pharmacy pharmacist prc board",
  }),
  createExam("health", "", "Dentists Licensure Examination", "Professional Regulation Commission", {
    keywords: "dentist dental prc board",
  }),
  createExam("health", "", "Dental Hygienists Licensure Examination", "Professional Regulation Commission", {
    keywords: "dental hygienist prc board",
  }),
  createExam("health", "", "Physical Therapists Licensure Examination", "Professional Regulation Commission", {
    keywords: "pt physiotherapy physical therapy prc board",
  }),
  createExam("health", "", "Occupational Therapists Licensure Examination", "Professional Regulation Commission", {
    keywords: "ot occupational therapy prc board",
  }),
  createExam("health", "", "Respiratory Therapists Licensure Examination", "Professional Regulation Commission", {
    keywords: "rt respiratory therapy prc board",
  }),
  createExam("health", "", "Speech-Language Pathologists Licensure Examination", "Professional Regulation Commission", {
    keywords: "slp speech therapy prc board",
  }),
  createExam("health", "", "Optometrists Licensure Examination", "Professional Regulation Commission", {
    keywords: "optometry optometrist eye prc board",
  }),
  createExam("health", "", "Nutritionists-Dietitians Licensure Examination", "Professional Regulation Commission", {
    keywords: "nutrition nutritionist dietitian dietician prc board",
  }),
  createExam("health", "", "Veterinarians Licensure Examination", "Professional Regulation Commission", {
    alsoGroupIds: ["sci"],
    keywords: "vet veterinary veterinarian animal prc board",
  }),

  /* 6. Psychology & Social Sciences */
  createExam("psych", "", "Psychometricians Licensure Examination", "Professional Regulation Commission", {
    keywords: "psychometrician psychology prc board",
  }),
  createExam("psych", "", "Psychologists Licensure Examination", "Professional Regulation Commission", {
    keywords: "psychologist psychology prc board",
  }),
  createExam("psych", "", "Social Workers Licensure Examination", "Professional Regulation Commission", {
    keywords: "social work worker prc board",
  }),

  /* 7. Accounting, Finance & Business */
  createExam("biz", "CPALE", "Certified Public Accountants Licensure Examination", "Professional Regulation Commission", {
    keywords: "cpa accountant accountancy accounting board prc",
  }),
  createExam("biz", "", "Customs Brokers Licensure Examination", "Professional Regulation Commission", {
    keywords: "customs broker prc board",
  }),
  createExam("biz", "", "Real Estate Brokers Licensure Examination", "Professional Regulation Commission", {
    keywords: "real estate broker rebl prc board",
  }),
  createExam("biz", "", "Real Estate Appraisers Licensure Examination", "Professional Regulation Commission", {
    keywords: "real estate appraiser prc board",
  }),
  createExam("biz", "", "Real Estate Consultants Licensure Examination", "Professional Regulation Commission", {
    keywords: "real estate consultant prc board",
  }),

  /* 8. Engineering */
  createExam("eng", "CELE", "Civil Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "civil engineer engineering ce prc board",
  }),
  createExam("eng", "", "Mechanical Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "mechanical engineer engineering me prc board",
  }),
  createExam("eng", "", "Certified Plant Mechanics Licensure Examination", "Professional Regulation Commission", {
    keywords: "plant mechanic cpm prc board",
  }),
  createExam("eng", "REE", "Registered Electrical Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "electrical engineer engineering ee prc board",
  }),
  createExam("eng", "RME", "Registered Master Electricians Licensure Examination", "Professional Regulation Commission", {
    keywords: "master electrician electrical prc board",
  }),
  createExam("eng", "", "Electronics Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "electronics engineer ece engineering prc board",
  }),
  createExam("eng", "", "Electronics Technicians Licensure Examination", "Professional Regulation Commission", {
    keywords: "electronics technician prc board",
  }),
  createExam("eng", "", "Chemical Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "chemical engineer engineering che prc board",
  }),
  createExam("eng", "", "Chemical Technicians Licensure Examination", "Professional Regulation Commission", {
    alsoGroupIds: ["sci"],
    keywords: "chemical technician chemistry prc board",
  }),
  createExam("eng", "", "Geodetic Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "geodetic engineer surveying prc board",
  }),
  createExam("eng", "", "Mining Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "mining engineer engineering prc board",
  }),
  createExam("eng", "", "Metallurgical Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "metallurgical engineer engineering prc board",
  }),
  createExam("eng", "", "Sanitary Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "sanitary engineer engineering prc board",
  }),
  createExam("eng", "", "Aeronautical Engineers Licensure Examination", "Professional Regulation Commission", {
    keywords: "aeronautical aerospace engineer engineering prc board",
  }),
  createExam("eng", "", "Agricultural and biosystems professional examinations", "Professional Regulation Commission", {
    alsoGroupIds: ["sci"],
    keywords: "agricultural biosystems engineer agriculture prc board",
  }),

  /* 9. Architecture, Planning & Design */
  createExam("arch", "", "Architects Licensure Examination", "Professional Regulation Commission", {
    keywords: "architect architecture prc board",
  }),
  createExam("arch", "", "Landscape Architects Licensure Examination", "Professional Regulation Commission", {
    keywords: "landscape architect prc board",
  }),
  createExam("arch", "", "Interior Designers Licensure Examination", "Professional Regulation Commission", {
    keywords: "interior design designer prc board",
  }),
  createExam("arch", "", "Environmental Planners Licensure Examination", "Professional Regulation Commission", {
    alsoGroupIds: ["sci"],
    keywords: "environmental planner planning urban prc board",
  }),
  createExam("arch", "", "Master Plumbers Licensure Examination", "Professional Regulation Commission", {
    keywords: "plumber plumbing prc board",
  }),

  /* 10. Science, Agriculture & Environment */
  createExam("sci", "", "Chemists Licensure Examination", "Professional Regulation Commission", {
    keywords: "chemist chemistry prc board",
  }),
  createExam("sci", "", "Agriculturists Licensure Examination", "Professional Regulation Commission", {
    keywords: "agriculturist agriculture farming prc board",
  }),
  createExam("sci", "", "Foresters Licensure Examination", "Professional Regulation Commission", {
    keywords: "forester forestry prc board",
  }),
  createExam("sci", "", "Fisheries Professionals Licensure Examination", "Professional Regulation Commission", {
    keywords: "fisheries fishery fish prc board",
  }),
  createExam("sci", "", "Food Technologists Licensure Examination", "Professional Regulation Commission", {
    keywords: "food technologist technology prc board",
  }),

  /* 11. Law */
  createExam("law", "", "Philippine Bar Examination", "Supreme Court", {
    note: "Admission to the practice of law",
    keywords: "bar exam lawyer law attorney",
  }),
  createExam("law", "", "Shari'ah Bar Examination", "Supreme Court", {
    note: "For Shari'ah counselors-at-law",
    keywords: "shariah sharia bar lawyer counselor",
  }),

  /* 12. Medical & Law School Admission */
  createExam("admit", "NMAT", "National Medical Admission Test", "", {
    keywords: "medical school admission med school doctor",
  }),
  createExam("admit", "UP LAE", "UP Law Aptitude Examination", "University of the Philippines", {
    keywords: "law school admission up law lae",
  }),

  /* 13. College Entrance */
  createExam("college", "UPCAT", "University of the Philippines College Admission Test", "University of the Philippines", {
    keywords: "up upcat college entrance admission",
  }),
  createExam("college", "USTET", "University of Santo Tomas Entrance Test", "University of Santo Tomas", {
    keywords: "ust ustet college entrance admission thomasian",
  }),
  createExam("college", "ACET", "Ateneo College Entrance Test", "Ateneo de Manila University", {
    keywords: "ateneo acet college entrance admission",
  }),
  createExam("college", "DCAT", "DLSU College Admission Test", "De La Salle University", {
    keywords: "dlsu la salle dcat college entrance admission",
  }),
  createExam("college", "PUPCET", "Polytechnic University of the Philippines College Entrance Test", "Polytechnic University of the Philippines", {
    keywords: "pup pupcet college entrance admission",
  }),
  createExam("college", "PLMAT", "Pamantasan ng Lungsod ng Maynila Admission Test", "Pamantasan ng Lungsod ng Maynila", {
    keywords: "plm plmat college entrance admission",
  }),
  createExam("college", "MSU-SASE", "Mindanao State University System Admission and Scholarship Examination", "Mindanao State University System", {
    keywords: "msu sase college entrance admission scholarship",
  }),

  /* 14. Scholarships */
  createExam("scholar", "", "DOST-SEI Undergraduate Scholarship Examination", "DOST-SEI", {
    keywords: "dost sei scholarship science",
  }),
  createExam("scholar", "", "DOST-SEI Junior Level Science Scholarships examination", "DOST-SEI", {
    keywords: "dost sei junior scholarship science",
  }),

  /* 15. Basic Education (DepEd) */
  createExam("basic", "NAT", "National Achievement Test", "Department of Education", {
    keywords: "deped nat achievement grade school",
  }),
  createExam("basic", "NCAE", "National Career Assessment Examination", "Department of Education", {
    keywords: "deped ncae career assessment grade 9",
  }),
  createExam("basic", "PEPT", "Philippine Educational Placement Test", "Department of Education", {
    keywords: "deped pept placement",
  }),
  createExam("basic", "ALS A&E", "Alternative Learning System Accreditation and Equivalency assessment", "Department of Education", {
    keywords: "deped als alternative learning equivalency",
  }),

  /* 16. Technical & Vocational (TESDA) */
  createExam("tesda", "NC I", "TESDA National Certificate I assessment", "TESDA", {
    note: "May include practical competency demonstrations, not only multiple choice",
    keywords: "tesda nc1 national certificate vocational technical",
  }),
  createExam("tesda", "NC II", "TESDA National Certificate II assessment", "TESDA", {
    note: "May include practical competency demonstrations, not only multiple choice",
    keywords: "tesda nc2 national certificate vocational technical",
  }),
  createExam("tesda", "NC III", "TESDA National Certificate III assessment", "TESDA", {
    note: "May include practical competency demonstrations, not only multiple choice",
    keywords: "tesda nc3 national certificate vocational technical",
  }),
  createExam("tesda", "NC IV", "TESDA National Certificate IV assessment", "TESDA", {
    note: "May include practical competency demonstrations, not only multiple choice",
    keywords: "tesda nc4 national certificate vocational technical",
  }),
];

/**
 * Filter helpers
 */
export function isExamInGroup(exam: DirectoryExam, groupId: string): boolean {
  return exam.groupId === groupId || Boolean(exam.alsoGroupIds?.includes(groupId));
}

export function sortExamsByPriority(exams: DirectoryExam[]): DirectoryExam[] {
  return [...exams].sort((a, b) => {
    // 1. Live exams first
    if (a.live && !b.live) return -1;
    if (!a.live && b.live) return 1;

    // 2. Group order
    const aGrp = EXAM_GROUPS_BY_ID[a.groupId]?.order ?? 99;
    const bGrp = EXAM_GROUPS_BY_ID[b.groupId]?.order ?? 99;
    if (aGrp !== bGrp) return aGrp - bGrp;

    // 3. Alphabetical by name
    return a.name.localeCompare(b.name);
  });
}

export function matchesSearchQuery(exam: DirectoryExam, query: string): boolean {
  const clean = query.trim().toLowerCase();
  if (!clean) return true;

  const tokens = clean.split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;

  const grpName = EXAM_GROUPS_BY_ID[exam.groupId]?.name || "";
  const alsoNames = (exam.alsoGroupIds || [])
    .map((g) => EXAM_GROUPS_BY_ID[g]?.name || "")
    .join(" ");

  const haystack = `${exam.name} ${exam.code} ${exam.agency || ""} ${grpName} ${alsoNames} ${exam.keywords || ""} ${exam.note || ""}`.toLowerCase();

  return tokens.every((token) => haystack.includes(token));
}

export function filterDirectoryExams({
  query = "",
  groupIds = null,
  liveOnly = false,
}: {
  query?: string;
  groupIds?: string[] | null;
  liveOnly?: boolean;
}): DirectoryExam[] {
  return sortExamsByPriority(
    DIRECTORY_EXAMS.filter((exam) => {
      if (liveOnly && !exam.live) return false;
      if (!matchesSearchQuery(exam, query)) return false;
      if (groupIds && groupIds.length > 0) {
        return groupIds.some((gid) => isExamInGroup(exam, gid));
      }
      return true;
    })
  );
}

export function getLiveExamsCount(): number {
  return DIRECTORY_EXAMS.filter((e) => e.live).length;
}
