/** Exams a piece of content serves. "cse" is the default for legacy guide entries. Matches EXAM_CATALOG ids. */
export type ContentExamId = "cse" | "let" | "cle" | "napolcom" | "nursing" | "bfp";

export interface GuideSection {
  id: string;
  heading: string;
  content: string;
  keyTakeaways?: string[];
  exampleQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ContentSource {
  title: string;
  url?: string;
  publisher?: string;
}

export interface StudyGuide {
  slug: string;
  title: string;
  seoTitle?: string;
  subject: string;
  /** Exam whose syllabus this guide targets. Defaults to "cse" in data. */
  examId: ContentExamId;
  level: "All" | "Professional" | "Subprofessional";
  description: string;
  readTimeMinutes: number;
  lastUpdated: string;
  isoUpdatedDate?: string;
  author?: string;
  authorRole?: string;
  reviewedBy?: string;
  tags: string[];
  sources?: ContentSource[];
  sections: GuideSection[];
}

export interface Article {
  slug: string;
  title: string;
  seoTitle?: string;
  category: "Strategy" | "Exam Overview" | "Preparation Tips";
  description: string;
  readTimeMinutes: number;
  publishedDate: string;
  isoPublishedDate?: string;
  isoUpdatedDate?: string;
  author: string;
  authorRole?: string;
  reviewedBy?: string;
  sources?: ContentSource[];
  keyHighlights: string[];
  content: string[];
  /** Exams this article serves. Optional for backward compatibility; an
   * article without examIds is a legacy CSE article. */
  examIds?: ContentExamId[];
}

export interface FAQItem {
  id: string;
  category:
    | "Qualifications & Eligibility"
    | "Exam Format & Scoring"
    | "Exam Day Guidelines"
    | "Preparation & Review";
  question: string;
  answer: string;
  relatedLinks?: Array<{ text: string; href: string }>;
  /** Exams this FAQ entry serves. Optional for backward compatibility; an
   * entry without examIds is a legacy CSE entry. */
  examIds?: ContentExamId[];
}
