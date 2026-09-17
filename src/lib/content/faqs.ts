import type { FAQItem } from "./types";

export const FAQS: FAQItem[] = [
  {
    id: "eligibility-qualifications",
    category: "Qualifications & Eligibility",
    question: "Who is qualified to take the Philippine Civil Service Examination (CSE-PPT)?",
    answer:
      "Filipino citizens who are at least 18 years of age on the date of filing, of good moral character, and who have not been convicted of a crime involving moral turpitude, dishonorably discharged from military service, or dismissed for cause from government service. There is no educational requirement; both high school graduates and college degree holders may apply depending on the exam level.",
    relatedLinks: [
      { text: "CSE Documentary Requirements Checklist", href: "/cse/exam-guide/requirements" },
      { text: "How to Apply for the Civil Service Exam", href: "/cse/exam-guide/how-to-apply" },
    ],
  },
  {
    id: "pro-vs-subpro-difference",
    category: "Qualifications & Eligibility",
    question: "What is the difference between the Professional and Subprofessional exams?",
    answer:
      "The Career Service Professional Eligibility qualifies you for both first-level (clerical, trades, crafts) and second-level (technical, scientific, executive, managerial) positions in government. The Subprofessional Eligibility qualifies you strictly for first-level positions. The Professional exam includes Analytical Ability, whereas the Subprofessional exam covers Clerical Ability instead.",
    relatedLinks: [
      { text: "Professional vs. Subprofessional Comparison Guide", href: "/articles/professional-vs-subprofessional-difference" },
      { text: "CSE Professional Reviewer Breakdown", href: "/articles/cse-professional-exam-reviewer-guide" },
    ],
  },
  {
    id: "eligibility-expiration",
    category: "Qualifications & Eligibility",
    question: "Does the Civil Service Certificate of Eligibility (CoE) expire?",
    answer:
      "No. Career Service Eligibility gained through passing the Civil Service Examination has lifetime validity. It does not expire and does not require periodic renewal.",
    relatedLinks: [
      { text: "Results Verification & Claiming Your CoE", href: "/cse/exam-guide/results" },
    ],
  },
  {
    id: "exam-frequency-retake",
    category: "Qualifications & Eligibility",
    question: "How often can I take the Civil Service Examination?",
    answer:
      "Under CSC guidelines, examinees who fail may take the examination again after a three-month waiting period (the three-month retake ban). The CSC typically conducts the nationwide Pen and Paper Test (CSE-PPT) twice each calendar year (usually in March and August).",
    relatedLinks: [
      { text: "View Civil Service Exam Schedules & Calendars", href: "/cse/exam-guide/schedule" },
    ],
  },
  {
    id: "passing-grade-percentage",
    category: "Exam Format & Scoring",
    question: "What is the passing grade for the Civil Service Exam?",
    answer:
      "To pass, an examinee must obtain a general rating of at least 80.00%. The Civil Service Commission computes this rating using a calibrated statistical weighting formula across all subtests. Examinees must perform consistently across all subtests, as failing severely in any single subtest can prevent passing even if your overall raw count is high.",
    relatedLinks: [
      { text: "How Civil Service Exam Scoring Works", href: "/articles/how-civil-service-exam-scoring-works" },
      { text: "Complete CSE-PPT Overview & Comparison Matrix", href: "/exam-info" },
    ],
  },
  {
    id: "exam-duration-items",
    category: "Exam Format & Scoring",
    question: "How many items are there, and how long is the exam duration?",
    answer:
      "For the Professional Level, there are 170 items administered within a single continuous time limit of 3 hours and 10 minutes (190 minutes). For the Subprofessional Level, there are 165 items with a time limit of 2 hours and 40 minutes (160 minutes). Both tests use a single overall countdown timer rather than partitioned section timers.",
    relatedLinks: [
      { text: "The 67-Second Rule Pacing Guide", href: "/articles/continuous-timer-pacing-strategy" },
      { text: "Practice Full Mock Exam with Continuous Timer", href: "/practice" },
    ],
  },
  {
    id: "exam-day-items-bring",
    category: "Exam Day Guidelines",
    question: "What items must I bring on the day of the examination?",
    answer:
      "Examinees must bring: (1) Valid government-issued photo ID accepted by the CSC (e.g., PhilID/National ID, Passport, Driver's License, UMID, PRC ID, Voter's ID); (2) Black ballpens (strictly black ink only, no friction pens or gel pens that bleed); (3) Official Application Receipt (if issued); (4) Printed Notice of School Assignment (ONSA); and (5) Clear water bottle without labels.",
    relatedLinks: [
      { text: "Exam-Day Protocols & What to Bring Checklist", href: "/cse/exam-guide/exam-day" },
    ],
  },
  {
    id: "prohibited-items-exam",
    category: "Exam Day Guidelines",
    question: "What items are strictly prohibited inside the examination room?",
    answer:
      "Prohibited items include calculators, cellular phones, smartwatches, recording devices, blank scratch paper, correction fluids/tape, books, and unauthorized review sheets. Possession of any electronic communication device during the test can lead to immediate disqualification and permanent disbarment from taking government examinations.",
    relatedLinks: [
      { text: "Exam-Day Protocols & Prohibited Items", href: "/cse/exam-guide/exam-day" },
    ],
  },
  {
    id: "recommended-study-timeline",
    category: "Preparation & Review",
    question: "How long should I prepare before taking the Civil Service Exam?",
    answer:
      "A focused study period of 6 to 10 weeks (dedicating 1 to 2 hours daily) is recommended for most working professionals and students. Allocate the first 4 weeks to reviewing core rules (grammar, RA 6713, and math shortcuts), followed by timed mock simulations to adapt to the 67-second-per-item pace.",
    relatedLinks: [
      { text: "Explore All Subtest Study Guides", href: "/guides" },
      { text: "Common Pitfalls to Avoid in the CSE", href: "/articles/why-examinees-fail-civil-service-exam" },
    ],
  },
  {
    id: "calculator-allowed",
    category: "Preparation & Review",
    question: "Are calculators allowed for the Numerical Ability subtest?",
    answer:
      "No. Absolutely no calculators of any kind (basic, scientific, or digital) are permitted in the CSE-PPT. All calculations must be performed using mental math or by computing on the test booklet margins using your black ballpen.",
    relatedLinks: [
      { text: "Word Problems & Arithmetic Shortcuts Guide", href: "/guides/numerical-ability-word-problems" },
      { text: "Practice Numerical Ability Subtest", href: "/practice" },
    ],
  },
];
