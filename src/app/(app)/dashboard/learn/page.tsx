import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileQuestion,
  HelpCircle,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/features/dashboard/AppShell";
import { WorkspaceService } from "@/lib/workspace/workspace-service";
import {
  getAllArticles,
  getAllFaqs,
  getAllStudyGuides,
} from "@/lib/content";
import type { Article, ContentExamId, FAQItem } from "@/lib/content/types";
import { getExamConfig } from "@/config/exams";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Study guides, strategy articles and answers to common questions for your exam, from the same library used across ReviewTayo.",
};

const CARD =
  "rounded-3xl bg-white dark:bg-[#2b1620] shadow-[0_0_0_1.5px_rgba(138,22,48,0.12),0_18px_36px_-26px_rgba(90,15,35,0.4)] dark:shadow-[0_0_0_1.5px_rgba(255,255,255,0.1)] p-5";

/** Section icon chips reuse the site family palette (same tokens as exam tickets). */
const CHIP_STYLES: Record<"guides" | "articles" | "faq", string> = {
  guides:
    "bg-[var(--bgc)] text-[var(--fgc)] [--bgc:#8a1630] [--fgc:#fff] dark:[--bgc:#8a1630] dark:[--fgc:#fff]",
  articles:
    "bg-[var(--bgc)] text-[var(--fgc)] [--bgc:#fdeec6] [--fgc:#6b4300] dark:[--bgc:#4a3410] dark:[--fgc:#fdeec6]",
  faq: "bg-[var(--bgc)] text-[var(--fgc)] [--bgc:#dce6f8] [--fgc:#1f3a6e] dark:[--bgc:#1f304f] dark:[--fgc:#cce0ff]",
};

/** FAQ category pills share the family palette too. */
const FAQ_CATEGORY_STYLES: Record<string, string> = {
  "Qualifications & Eligibility":
    "bg-[var(--bgc)] text-[var(--fgc)] [--bgc:#d7efe0] [--fgc:#14532d] dark:[--bgc:#133a22] dark:[--fgc:#c2ebd0]",
  "Exam Format & Scoring":
    "bg-[var(--bgc)] text-[var(--fgc)] [--bgc:#dce6f8] [--fgc:#1f3a6e] dark:[--bgc:#1f304f] dark:[--fgc:#cce0ff]",
  "Exam Day Guidelines":
    "bg-[var(--bgc)] text-[var(--fgc)] [--bgc:#fdeec6] [--fgc:#6b4300] dark:[--bgc:#4a3410] dark:[--fgc:#fdeec6]",
  "Preparation & Review":
    "bg-[var(--bgc)] text-[var(--fgc)] [--bgc:#fbeff0] [--fgc:#8a1630] dark:[--bgc:#38192a] dark:[--fgc:#ff9fb5]",
};

const MUTED = "text-[#5a4a50] dark:text-[#a89ba1]";

function ExamChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4ecee] dark:bg-[#3a1f29] text-[#8a1630] dark:text-[#de5572] px-2.5 py-0.5 text-[11px] font-extrabold whitespace-nowrap">
      <BookOpen className="w-3 h-3" aria-hidden="true" /> {label}
    </span>
  );
}

function TimeChip({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4ecee] dark:bg-[#3a1f29] text-[#5a4a50] dark:text-[#a89ba1] px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap">
      <Clock3 className="w-3 h-3" aria-hidden="true" /> {minutes} min
    </span>
  );
}

function ComingSoon({ examName }: { examName: string }) {
  return (
    <div className="mt-3 rounded-2xl border border-dashed border-[#e8ccd3] dark:border-white/15 p-4 text-center">
      <Sparkles className="w-5 h-5 mx-auto text-[#b8808e] dark:text-[#a89ba1]" aria-hidden="true" />
      <p className={`mt-1.5 text-[13.5px] font-bold ${MUTED}`}>
        More materials coming soon for {examName}
      </p>
      <p className="text-[12.5px] font-semibold text-[#8a7a80] dark:text-[#8d7d84] mt-0.5">
        New content lands here as the library grows.
      </p>
    </div>
  );
}

export default function LearnPage() {
  const workspace = WorkspaceService.getCurrentWorkspace();
  const examId: ContentExamId = (workspace?.examId as ContentExamId) || "cse";
  const examName = getExamConfig(examId)?.shortName || examId.toUpperCase();

  // Exam scoping happens at the data level: legacy items without examIds count
  // as CSE, so the same library serves every exam without duplication.
  const guides = getAllStudyGuides().filter((g) => g.examId === examId);
  const articles = (getAllArticles() as Article[]).filter(
    (a) => (a.examIds ?? ["cse"]).includes(examId)
  );
  const faqs = (getAllFaqs() as FAQItem[]).filter(
    (f) => (f.examIds ?? ["cse"]).includes(examId)
  );
  const faqCategories = [...new Set(faqs.map((f) => f.category))];

  return (
    <AppShell>
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#1b1216] dark:text-[#f5eff1]">
          Learn
        </h1>
        <p className={`text-sm mt-1 ${MUTED}`}>
          Guides, articles and answers for {examName}, all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Study guides */}
        <section aria-labelledby="learn-guides" className={`${CARD} flex flex-col`}>
          <div className="flex items-center gap-2.5">
            <span
              className={`w-9 h-9 rounded-xl grid place-items-center ${CHIP_STYLES.guides}`}
            >
              <BookOpen className="w-[18px] h-[18px]" />
            </span>
            <h2
              id="learn-guides"
              className="font-display text-lg font-extrabold text-[#1b1216] dark:text-[#f8ecee]"
            >
              Study guides
            </h2>
            <span className={`ml-auto text-[12.5px] font-bold ${MUTED}`}>
              {guides.length}
            </span>
          </div>

          {guides.length > 0 ? (
            <>
              <ul className="mt-3 grid gap-2.5 flex-1">
                {guides.slice(0, 5).map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides/${g.slug}`}
                      className="group block rounded-2xl bg-[#fdf8f6] dark:bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(138,22,48,0.08)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] p-3.5 hover:shadow-[inset_0_0_0_1.5px_rgba(138,22,48,0.35)] dark:hover:shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.25)] transition-shadow"
                    >
                      <span className="block text-[14.5px] font-bold leading-snug text-[#1b1216] dark:text-[#f8ecee] group-hover:underline">
                        {g.title}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-1.5">
                        <ExamChip label={g.subject} />
                        <TimeChip minutes={g.readTimeMinutes} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/guides"
                className="mt-3.5 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8a1630] dark:text-[#de5572] hover:underline self-start"
              >
                All study guides <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <ComingSoon examName={examName} />
          )}
        </section>

        {/* Articles */}
        <section aria-labelledby="learn-articles" className={`${CARD} flex flex-col`}>
          <div className="flex items-center gap-2.5">
            <span
              className={`w-9 h-9 rounded-xl grid place-items-center ${CHIP_STYLES.articles}`}
            >
              <Newspaper className="w-[18px] h-[18px]" />
            </span>
            <h2
              id="learn-articles"
              className="font-display text-lg font-extrabold text-[#1b1216] dark:text-[#f8ecee]"
            >
              Articles
            </h2>
            <span className={`ml-auto text-[12.5px] font-bold ${MUTED}`}>
              {articles.length}
            </span>
          </div>

          {articles.length > 0 ? (
            <>
              <ul className="mt-3 grid gap-2.5 flex-1">
                {articles.slice(0, 5).map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/articles/${a.slug}`}
                      className="group block rounded-2xl bg-[#fdf8f6] dark:bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(138,22,48,0.08)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] p-3.5 hover:shadow-[inset_0_0_0_1.5px_rgba(138,22,48,0.35)] dark:hover:shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.25)] transition-shadow"
                    >
                      <span className="block text-[14.5px] font-bold leading-snug text-[#1b1216] dark:text-[#f8ecee] group-hover:underline">
                        {a.title}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-1.5">
                        <ExamChip label={a.category} />
                        <TimeChip minutes={a.readTimeMinutes} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/articles"
                className="mt-3.5 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8a1630] dark:text-[#de5572] hover:underline self-start"
              >
                All articles <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <ComingSoon examName={examName} />
          )}
        </section>

        {/* FAQ */}
        <section aria-labelledby="learn-faq" className={`${CARD} lg:col-span-2`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-9 h-9 rounded-xl grid place-items-center ${CHIP_STYLES.faq}`}>
              <HelpCircle className="w-[18px] h-[18px]" />
            </span>
            <h2
              id="learn-faq"
              className="font-display text-lg font-extrabold text-[#1b1216] dark:text-[#f8ecee]"
            >
              Common questions
            </h2>
            <span className={`ml-auto text-[12.5px] font-bold ${MUTED}`}>
              {faqs.length}
            </span>
          </div>

          {faqCategories.length > 0 ? (
            <>
              <div className="mt-3 flex flex-wrap gap-2">
                {faqCategories.map((c) => (
                  <span
                    key={c}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-extrabold ${
                      FAQ_CATEGORY_STYLES[c] || FAQ_CATEGORY_STYLES["Preparation & Review"]
                    }`}
                  >
                    <FileQuestion className="w-3.5 h-3.5" aria-hidden="true" /> {c}
                  </span>
                ))}
              </div>
              <p className={`mt-3 text-[14px] font-semibold ${MUTED}`}>
                Qualifications, scoring, exam-day rules and prep questions are answered in the full
                FAQ.
              </p>
              <Link
                href="/faq"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#8a1630] dark:text-[#de5572] hover:underline self-start"
              >
                Browse the FAQ <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <ComingSoon examName={examName} />
          )}
        </section>
      </div>
    </AppShell>
  );
}
