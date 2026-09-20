import type { StudyGuide } from "./types";

export const STUDY_GUIDES: StudyGuide[] = [
  {
    slug: "ra-6713-code-of-conduct",
    examId: "cse",
    title: "Republic Act No. 6713: Code of Conduct & Ethical Standards for Public Officials",
    seoTitle: "RA 6713 Code of Conduct & Ethics Guide",
    subject: "General Information",
    level: "All",
    description:
      "A complete breakdown of the 8 Norms of Conduct, prohibited transactions, SALN filing deadlines, and penalties for government civil servants.",
    readTimeMinutes: 8,
    lastUpdated: "September 2026",
    isoUpdatedDate: "2026-09-10T08:00:00+08:00",
    author: "ReviewTayo Editorial Team",
    authorRole: "Civil Service Exam Curriculum Researchers",
    sources: [
      {
        title: "Republic Act No. 6713 (Code of Conduct and Ethical Standards for Public Officials and Employees)",
        url: "https://www.officialgazette.gov.ph/1989/02/20/republic-act-no-6713/",
        publisher: "Official Gazette of the Republic of the Philippines",
      },
      {
        title: "Civil Service Commission Memorandum Circulars and Advisories",
        url: "https://csc.gov.ph/phocadownload/userupload/erpo/announcements/2024/ExamAnnouncement06s2024_Conduct%20of%2011%20Aug%202024%20CSE-PPT.pdf",
        publisher: "Civil Service Commission (CSC)",
      },
    ],
    tags: ["RA 6713", "Ethics", "SALN", "General Information", "Public Service"],
    sections: [
      {
        id: "norms-of-conduct",
        heading: "The 8 Norms of Conduct of Public Officials and Employees (Section 4)",
        content:
          "Section 4 of RA 6713 establishes eight fundamental norms that every public official and civil service employee must uphold regardless of salary grade or rank: (1) Commitment to public interest — public interest must always prevail over personal interest; (2) Professionalism — performing duties with highest degree of excellence and dedication; (3) Justness and sincerity — remaining true to the people and not discriminating; (4) Political neutrality — providing service without bias toward any political party; (5) Responsiveness to the public — prompt, courteous, and adequate service; (6) Nationalism and patriotism — maintaining allegiance to the Republic; (7) Commitment to democracy — upholding the Constitution and civil liberties; and (8) Simple living — leading modest lives appropriate to their positions.",
        keyTakeaways: [
          "Commitment to Public Interest requires that government resources are never used for personal enrichment.",
          "Political Neutrality prohibits partisan political activities or discrimination based on political affiliation.",
          "Simple Living requires that lifestyle and assets be commensurate with legitimate civil service earnings.",
        ],
        exampleQuestion: {
          question:
            "Under RA 6713, which norm of conduct is violated when a public official displays excessive ostentation and lavish wealth inconsistent with their declared government income?",
          options: [
            "A. Professionalism",
            "B. Political Neutrality",
            "C. Simple Living",
            "D. Nationalism and Patriotism",
          ],
          correctIndex: 2,
          explanation:
            "Section 4(h) of RA 6713 explicitly mandates 'Simple living', directing public officials and employees to lead modest lives appropriate to their positions and income, avoiding extravagant or ostentatious displays of wealth.",
        },
      },
      {
        id: "saln-requirements",
        heading: "Statement of Assets, Liabilities, and Net Worth (SALN) Deadlines",
        content:
          "Public officials and employees are legally obligated under Section 8 to file sworn SALN declarations and disclosure of business interests and financial connections under three distinct statutory circumstances: (1) Within 30 days after assumption of office; (2) On or before April 30 of every year thereafter; and (3) Within 30 days after separation from government service. Failure to file is punishable by suspension or dismissal.",
        keyTakeaways: [
          "Annual SALN filing deadline: On or before April 30 of every year.",
          "Assumption/Separation deadline: Within 30 days from assuming or vacating office.",
          "Exemptions: Those who serve in an honorary capacity, laborers, and casual/temporary workers.",
        ],
      },
      {
        id: "prohibited-acts",
        heading: "Prohibited Acts and Transactions (Section 7)",
        content:
          "Section 7 strictly prohibits public servants from: (1) Financial and material interest in any transaction requiring approval of their office; (2) Outside employment or private practice of profession unless authorized by law; (3) Disclosure and/or misuse of confidential government information; and (4) Soliciting or accepting gifts, loans, or favors in connection with official operations. Post-employment: Civil servants cannot practice before their former office within one (1) year after separation.",
        keyTakeaways: [
          "1-year restriction on practicing before or representing private entities against former government agency.",
          "Gift acceptance is strictly prohibited if given in contemplation of or in exchange for official action.",
        ],
      },
    ],
  },
  {
    slug: "philippine-constitution-essentials",
    examId: "cse",
    title: "1987 Philippine Constitution: High-Yield Provisions for Civil Service Examinees",
    seoTitle: "1987 Philippine Constitution Reviewer",
    subject: "General Information",
    level: "All",
    description:
      "Core constitutional concepts: Article III Bill of Rights, the 3 Independent Constitutional Commissions, and public accountability.",
    readTimeMinutes: 10,
    lastUpdated: "September 2026",
    isoUpdatedDate: "2026-09-10T08:00:00+08:00",
    author: "ReviewTayo Editorial Team",
    authorRole: "Civil Service Exam Curriculum Researchers",
    sources: [
      {
        title: "1987 Constitution of the Republic of the Philippines (Official Text)",
        url: "https://www.officialgazette.gov.ph/constitutions/1987-constitution/",
        publisher: "Official Gazette of the Republic of the Philippines",
      },
    ],
    tags: ["Constitution", "Bill of Rights", "Civil Service Commission", "Article IX"],
    sections: [
      {
        id: "bill-of-rights",
        heading: "Article III: The Bill of Rights Fundamentals",
        content:
          "The Bill of Rights is the cornerstone of fundamental civil liberties in the Philippines. High-frequency CSE test areas include: Section 1 (Due Process and Equal Protection of the Laws: procedural due process requires notice and hearing; substantive due process requires fair and reasonable laws); Section 2 (Unreasonable Searches and Seizures: requires a valid search warrant issued upon probable cause personally determined by a judge); Section 3 (Privacy of Communication and Correspondence: inviolable except upon lawful court order or public safety); and Section 12 (Miranda Rights: right to remain silent and to have competent and independent counsel during custodial investigation).",
        keyTakeaways: [
          "Search warrants and warrants of arrest can ONLY be issued by a judge upon probable cause.",
          "Evidence obtained in violation of the Bill of Rights is inadmissible for any purpose (Fruit of the Poisonous Tree doctrine).",
          "The right against self-incrimination applies to testimonial evidence.",
        ],
        exampleQuestion: {
          question:
            "Which government authority has the sole constitutional power to issue warrants of arrest and search warrants upon determination of probable cause?",
          options: [
            "A. Police Chief or Investigator",
            "B. City or Provincial Prosecutor",
            "C. Judge of a competent court",
            "D. Secretary of Justice",
          ],
          correctIndex: 2,
          explanation:
            "Article III, Section 2 of the 1987 Philippine Constitution provides that warrants of arrest and search warrants may be issued only upon probable cause personally determined by a judge after examination under oath or affirmation of the complainant and witnesses.",
        },
      },
      {
        id: "constitutional-commissions",
        heading: "Article IX: The Three Independent Constitutional Commissions",
        content:
          "The 1987 Constitution establishes three independent constitutional bodies possessing fiscal autonomy and specialized mandates: (1) Civil Service Commission (CSC) — the central personnel agency of the Philippine government; (2) Commission on Elections (COMELEC) — enforces and administers all election laws; and (3) Commission on Audit (COA) — examines, audits, and settles all accounts pertaining to government revenue and expenditures.",
        keyTakeaways: [
          "The Civil Service Commission is the central personnel agency mandated to ensure merit and fitness in public appointments.",
          "Members of Constitutional Commissions serve fixed 7-year terms without reappointment.",
          "All three commissions enjoy fiscal autonomy, meaning their approved appropriations cannot be reduced by the legislature.",
        ],
      },
    ],
  },
  {
    slug: "verbal-ability-grammar-paragraph-org",
    examId: "cse",
    title: "Verbal Ability: Grammar Mastery & Paragraph Organization Strategies",
    seoTitle: "CSE Verbal Ability & Grammar Guide",
    subject: "Verbal Ability",
    level: "All",
    description:
      "Subject-verb agreement essentials, pronoun case rules, common idiom traps, and the chronological clue technique for paragraph organization.",
    readTimeMinutes: 7,
    lastUpdated: "September 2026",
    isoUpdatedDate: "2026-09-10T08:00:00+08:00",
    author: "ReviewTayo Editorial Team",
    authorRole: "Civil Service Exam Curriculum Researchers",
    sources: [
      {
        title: "Civil Service Commission Examination Announcement: Test Scope & Guidelines (Verbal Ability - English & Filipino)",
        url: "https://csc.gov.ph/phocadownload/userupload/erpo/announcements/2024/ExamAnnouncement06s2024_Conduct%20of%2011%20Aug%202024%20CSE-PPT.pdf",
        publisher: "Civil Service Commission (CSC)",
      },
    ],
    tags: ["Verbal Ability", "Grammar", "Paragraph Organization", "English", "Filipino"],
    sections: [
      {
        id: "subject-verb-agreement",
        heading: "Crucial Subject-Verb Agreement Rules",
        content:
          "The most common grammatical pitfall on the CSE is intervening phrases between subject and verb. Rule 1: Phrases such as 'together with', 'as well as', 'in addition to', and 'accompanied by' do not change the number of the true subject. Rule 2: In 'either... or' and 'neither... nor', the verb agrees with the closer subject. Rule 3: Indefinite pronouns like 'each', 'either', 'neither', 'everyone', 'everybody', 'anyone', and 'someone' are strictly singular.",
        keyTakeaways: [
          "'The supervisor, together with the project team members, (is / are) attending the conference.' Correct: IS (subject is singular supervisor).",
          "'Neither the department manager nor the staff (was / were) informed.' Correct: WERE (closer subject 'staff' is plural).",
          "'Each of the candidates (has / have) submitted the documents.' Correct: HAS (each is singular).",
        ],
        exampleQuestion: {
          question:
            "Choose the grammatically correct sentence:",
          options: [
            "A. The Director, accompanied by her deputies, are inspecting the regional branches.",
            "B. The Director, accompanied by her deputies, is inspecting the regional branches.",
            "C. The Director, accompanied by her deputies, have inspected the regional branches.",
            "D. The Director, accompanied by her deputies, were inspecting the regional branches.",
          ],
          correctIndex: 1,
          explanation:
            "The subject 'Director' is singular. The parenthetical phrase 'accompanied by her deputies' does not compound the subject. Therefore, the singular verb 'is inspecting' is required.",
        },
      },
      {
        id: "paragraph-organization",
        heading: "Paragraph Organization: The Topic-Transition-Conclusion Method",
        content:
          "Paragraph organization questions require ordering four or five scrambled sentences (labeled 1 to 5) into a coherent, logical paragraph. Step 1: Identify the Lead Sentence — it must be an independent general topic statement without backward-referencing pronouns (such as 'These factors', 'However', 'Therefore'). Step 2: Look for Chronological or Structural Transitions (e.g., 'First', 'Subsequently', 'Consequently'). Step 3: Identify the Concluding Sentence which summarizes or draws the final inference.",
        keyTakeaways: [
          "Never select a sentence starting with 'Hence', 'Furthermore', or 'This result' as sentence #1.",
          "Trace pronoun antecedents: if sentence 3 mentions 'the reform', look for the preceding sentence where the specific reform was named.",
        ],
      },
    ],
  },
  {
    slug: "numerical-ability-word-problems",
    examId: "cse",
    title: "Numerical Ability: Core Formulas, Percentage Shortcuts & Word Problems",
    seoTitle: "CSE Numerical Ability & Math Guide",
    subject: "Numerical Ability",
    level: "All",
    description:
      "Essential algebraic formulas for ratio and proportion, percentage increases/discounts, work rate equations, and number sequences without a calculator.",
    readTimeMinutes: 9,
    lastUpdated: "September 2026",
    isoUpdatedDate: "2026-09-10T08:00:00+08:00",
    author: "ReviewTayo Editorial Team",
    authorRole: "Civil Service Exam Curriculum Researchers",
    sources: [
      {
        title: "Civil Service Commission Examination Announcement: Test Scope & Guidelines (Numerical Ability)",
        url: "https://csc.gov.ph/phocadownload/userupload/erpo/announcements/2024/ExamAnnouncement06s2024_Conduct%20of%2011%20Aug%202024%20CSE-PPT.pdf",
        publisher: "Civil Service Commission (CSC)",
      },
    ],
    tags: ["Numerical Ability", "Math Shortcuts", "Word Problems", "Percentages"],
    sections: [
      {
        id: "percentage-shortcuts",
        heading: "Mental Math for Percentages, Discounts & Markups",
        content:
          "Because calculators are strictly barred on exam day, master base-10 decomposition: (1) To find 10%, shift decimal left by 1 digit; (2) To find 5%, take half of 10%; (3) To find 1%, shift decimal left by 2 digits; (4) For successive discounts (e.g., 20% followed by 10%), apply multiplicatively, not additively (a 20% discount leaves 80%; 10% off 80% is 8%; total discount is 28%, NOT 30%). Formula for percentage change: ((New Value - Old Value) / Old Value) * 100%.",
        keyTakeaways: [
          "Percentage Change = (Difference / Original Value) * 100%.",
          "Never simply sum multiple percentage discounts—compute each successively on the remaining balance.",
        ],
        exampleQuestion: {
          question:
            "An office desk originally priced at ₱5,000 is marked down by 20%. During a clearance sale, an additional 10% discount is applied to the discounted price. What is the final sale price?",
          options: ["A. ₱3,500", "B. ₱3,600", "C. ₱3,700", "D. ₱3,800"],
          correctIndex: 1,
          explanation:
            "Step 1: First discount is 20% of ₱5,000 = ₱1,000. Price becomes ₱4,000. Step 2: Second discount is 10% of ₱4,000 = ₱400. Final price = ₱4,000 - ₱400 = ₱3,600.",
        },
      },
      {
        id: "work-rate-problems",
        heading: "Work Rate Formula (The Inverted Rate Rule)",
        content:
          "If Person A completes a job in 'a' hours, their 1-hour work rate is 1/a. If Person B completes it in 'b' hours, their rate is 1/b. Working together, their combined hourly rate is (1/a + 1/b). The time 'T' to finish the entire job together is T = (a * b) / (a + b).",
        keyTakeaways: [
          "Combined Work Time = (Product of individual times) / (Sum of individual times).",
          "If worker A takes 6 hours and worker B takes 3 hours: T = (6 * 3) / (6 + 3) = 18 / 9 = 2 hours.",
        ],
      },
    ],
  },
  {
    slug: "analytical-reasoning-logic",
    examId: "cse",
    title: "Analytical Ability: Syllogisms, Assumptions & Analogy Formulas",
    seoTitle: "CSE Analytical Ability & Logic Guide",
    subject: "Analytical Ability",
    level: "Professional",
    description:
      "Techniques for identifying valid deductive conclusions, Venn diagram mapping for categorical syllogisms, and single-word analogies.",
    readTimeMinutes: 8,
    lastUpdated: "September 2026",
    isoUpdatedDate: "2026-09-10T08:00:00+08:00",
    author: "ReviewTayo Editorial Team",
    authorRole: "Civil Service Exam Curriculum Researchers",
    sources: [
      {
        title: "Civil Service Commission Examination Announcement: Test Scope & Guidelines (Analytical Ability - Professional Level)",
        url: "https://csc.gov.ph/phocadownload/userupload/erpo/announcements/2024/ExamAnnouncement06s2024_Conduct%20of%2011%20Aug%202024%20CSE-PPT.pdf",
        publisher: "Civil Service Commission (CSC)",
      },
    ],
    tags: ["Analytical Ability", "Logic", "Syllogisms", "Professional Level"],
    sections: [
      {
        id: "syllogisms-venn",
        heading: "Categorical Syllogisms & Venn Diagram Mapping",
        content:
          "Syllogisms test your ability to determine what necessarily follows from given premises, ignoring real-world truth. Rule 1: 'All A are B' means circle A is entirely inside circle B. Rule 2: 'Some A are B' means circle A and circle B intersect (at least one member shared). Rule 3: 'No A are B' means circles A and B are completely disjoint. Crucial tip: If a conclusion is merely possible but not guaranteed by the premises, it is invalid.",
        keyTakeaways: [
          "Accept premises as true even if they sound contrary to factual reality.",
          "'Some' in formal logic means 'at least one', not necessarily 'less than all'.",
          "Two negative premises yield NO valid categorical conclusion.",
        ],
        exampleQuestion: {
          question:
            "Premises: (1) All accountants are meticulous. (2) Some auditors are accountants. Which conclusion necessarily follows?",
          options: [
            "A. All auditors are meticulous.",
            "B. Some auditors are meticulous.",
            "C. No auditors are meticulous.",
            "D. All meticulous people are auditors.",
          ],
          correctIndex: 1,
          explanation:
            "Since some auditors are accountants, and every single accountant is meticulous, those auditors who are accountants must also be meticulous. Hence, 'Some auditors are meticulous' necessarily follows.",
        },
      },
    ],
  },
  {
    slug: "clerical-ability-filing-procedures",
    examId: "cse",
    title: "Clerical Ability: Alphabetical Filing Rules & Office Procedures",
    seoTitle: "CSE Clerical Ability & Filing Guide",
    subject: "Clerical Ability",
    level: "Subprofessional",
    description:
      "Standard filing indexing rules (Names of individuals, business titles, government agencies) and proofreading for Subprofessional examinees.",
    readTimeMinutes: 7,
    lastUpdated: "September 2026",
    isoUpdatedDate: "2026-09-10T08:00:00+08:00",
    author: "ReviewTayo Editorial Team",
    authorRole: "Civil Service Exam Curriculum Researchers",
    sources: [
      {
        title: "Civil Service Commission Examination Announcement: Test Scope & Guidelines (Clerical Ability - Subprofessional Level)",
        url: "https://csc.gov.ph/phocadownload/userupload/erpo/announcements/2024/ExamAnnouncement06s2024_Conduct%20of%2011%20Aug%202024%20CSE-PPT.pdf",
        publisher: "Civil Service Commission (CSC)",
      },
    ],
    tags: ["Clerical Ability", "Filing Rules", "Office Procedures", "Subprofessional Level"],
    sections: [
      {
        id: "filing-rules",
        heading: "Standard Alphabetical Filing Rules for Individual Names",
        content:
          "Rule 1: An individual's name is indexed in this exact order: Surname (Unit 1), First Name (Unit 2), Middle Name or Initial (Unit 3). Rule 2: Prefixes such as De, Del, Dela, San, and Mac are treated as part of the surname (e.g., 'Dela Cruz, Maria P.' is alphabetized under 'D'). Rule 3: Suffixes such as Jr., Sr., and Roman numerals (III) are considered the final indexing unit. Rule 4: 'Nothing comes before something' (e.g., 'Santos, Maria' precedes 'Santos, Maria Elena').",
        keyTakeaways: [
          "Individual: Surname first, then First name, then Middle initial, then Suffix.",
          "Hyphenated surnames are indexed as one single combined unit.",
          "Abbreviated names are indexed as if spelled out in full.",
        ],
        exampleQuestion: {
          question:
            "Which of the following names should be filed THIRD in alphabetical order?",
          options: [
            "A. Dela Cruz, Antonio B.",
            "B. Cruz, Antonio C.",
            "C. De la Torre, Beatrice S.",
            "D. Cruz, Antonio",
          ],
          correctIndex: 0,
          explanation:
            "Applying indexing rules: (1) Cruz, Antonio [nothing comes before initial]; (2) Cruz, Antonio C.; (3) Dela Cruz, Antonio B.; (4) De la Torre, Beatrice S. Therefore, 'Dela Cruz, Antonio B.' is filed third.",
        },
      },
    ],
  },
];
