export * from "./types";
export * from "./faqs";
export * from "./guides";
export * from "./articles";
export * from "./guide-hubs";

import { STUDY_GUIDES } from "./guides";
import { ARTICLES } from "./articles";
import { FAQS } from "./faqs";
import type { ContentExamId, StudyGuide } from "./types";

export function getStudyGuideBySlug(slug: string) {
  return STUDY_GUIDES.find((g) => g.slug === slug) || null;
}

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

export function getAllStudyGuides() {
  return STUDY_GUIDES;
}

export function getAllArticles() {
  return ARTICLES;
}

export function getAllFaqs() {
  return FAQS;
}

/** Guides whose syllabus targets a specific exam, in data order. */
export function getStudyGuidesByExam(examId: ContentExamId): StudyGuide[] {
  return STUDY_GUIDES.filter((g) => (g.examId ?? "cse") === examId);
}

/** Which exams currently have at least one published guide. */
export function getExamIdsWithGuides(): ContentExamId[] {
  return [...new Set(STUDY_GUIDES.map((g) => g.examId ?? "cse"))];
}
