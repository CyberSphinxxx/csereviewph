// @vitest-environment node
import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";

describe("PostgreSQL Integration — Real Database Engine (PGlite)", () => {
  let client: PGlite;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(async () => {
    // Spin up fresh in-memory Postgres 16 instance
    client = new PGlite();
    db = drizzle(client, { schema });

    // Apply all Drizzle migration SQL files generated for the project in order
    const migrationFiles = readdirSync("src/db/migrations")
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const migrationSql = readFileSync(`src/db/migrations/${file}`, "utf-8");
      await client.exec(migrationSql);
    }
  }, 30000);

  it("verifies Postgres version and connection", async () => {
    const res = await client.query<{ version: string }>("SELECT version()");
    expect(res.rows[0].version).toContain("PostgreSQL");
  });

  it("enforces foreign key constraints on insert", async () => {
    // Attempt to insert an exam level with a non-existent exam_id
    await expect(
      db.insert(schema.examLevels).values({
        id: "level-invalid",
        examId: "non-existent-exam-id",
        slug: "invalid",
        name: "Invalid Level",
      })
    ).rejects.toThrow();
  });

  it("enforces unique constraints on exam slug", async () => {
    await db.insert(schema.exams).values({
      id: "exam-1",
      slug: "ph-cse",
      name: "Philippine CSE",
    });

    // Attempting to insert another exam with duplicate slug must fail
    await expect(
      db.insert(schema.exams).values({
        id: "exam-2",
        slug: "ph-cse",
        name: "Duplicate CSE",
      })
    ).rejects.toThrow();
  });

  it("enforces CASCADE delete behavior across hierarchy", async () => {
    // Insert Exam -> Level -> Subject -> Topic -> Question -> Choice
    await db.insert(schema.exams).values({
      id: "exam-test",
      slug: "test-exam",
      name: "Test Exam",
    });

    await db.insert(schema.examLevels).values({
      id: "level-test",
      examId: "exam-test",
      slug: "test-level",
      name: "Test Level",
    });

    await db.insert(schema.subjects).values({
      id: "subj-test",
      examLevelId: "level-test",
      slug: "test-subject",
      name: "Test Subject",
    });

    await db.insert(schema.topics).values({
      id: "topic-test",
      subjectId: "subj-test",
      slug: "test-topic",
      name: "Test Topic",
    });

    await db.insert(schema.questions).values({
      id: "q-test",
      topicId: "topic-test",
      questionText: "Real Postgres Cascade Test Question?",
      explanation: "Testing cascade delete behavior",
      difficulty: "medium",
      language: "en",
      status: "draft",
      isSeedData: true,
    });

    await db.insert(schema.choices).values({
      id: "choice-test-1",
      questionId: "q-test",
      choiceLabel: "A",
      text: "Choice Text",
      isCorrect: true,
    });

    // Verify records exist
    const questionsBefore = await db.select().from(schema.questions).where(eq(schema.questions.id, "q-test"));
    expect(questionsBefore.length).toBe(1);

    const choicesBefore = await db.select().from(schema.choices).where(eq(schema.choices.id, "choice-test-1"));
    expect(choicesBefore.length).toBe(1);

    // DELETE parent exam -> cascade should delete level, subject, topic, question, and choices
    await db.delete(schema.exams).where(eq(schema.exams.id, "exam-test"));

    const questionsAfter = await db.select().from(schema.questions).where(eq(schema.questions.id, "q-test"));
    expect(questionsAfter.length).toBe(0);

    const choicesAfter = await db.select().from(schema.choices).where(eq(schema.choices.id, "choice-test-1"));
    expect(choicesAfter.length).toBe(0);
  });

  it("handles question status lifecycle transitions without physical deletion", async () => {
    await db.insert(schema.exams).values({ id: "e1", slug: "e1", name: "E1" });
    await db.insert(schema.examLevels).values({ id: "l1", examId: "e1", slug: "l1", name: "L1" });
    await db.insert(schema.subjects).values({ id: "s1", examLevelId: "l1", slug: "s1", name: "S1" });
    await db.insert(schema.topics).values({ id: "t1", subjectId: "s1", slug: "t1", name: "T1" });

    // 1. Draft
    await db.insert(schema.questions).values({
      id: "q-lifecycle",
      topicId: "t1",
      questionText: "Lifecycle Question?",
      explanation: "Testing lifecycle",
      status: "draft",
    });

    let q = (await db.select().from(schema.questions).where(eq(schema.questions.id, "q-lifecycle")))[0];
    expect(q.status).toBe("draft");

    // 2. Under Review
    await db.update(schema.questions).set({ status: "under_review" }).where(eq(schema.questions.id, "q-lifecycle"));
    q = (await db.select().from(schema.questions).where(eq(schema.questions.id, "q-lifecycle")))[0];
    expect(q.status).toBe("under_review");

    // 3. Approved
    await db.update(schema.questions).set({ status: "approved" }).where(eq(schema.questions.id, "q-lifecycle"));
    q = (await db.select().from(schema.questions).where(eq(schema.questions.id, "q-lifecycle")))[0];
    expect(q.status).toBe("approved");

    // 4. Published
    await db.update(schema.questions).set({ status: "published" }).where(eq(schema.questions.id, "q-lifecycle"));
    q = (await db.select().from(schema.questions).where(eq(schema.questions.id, "q-lifecycle")))[0];
    expect(q.status).toBe("published");

    // 5. Archived (outdated / superseded)
    await db.update(schema.questions).set({ status: "archived" }).where(eq(schema.questions.id, "q-lifecycle"));
    q = (await db.select().from(schema.questions).where(eq(schema.questions.id, "q-lifecycle")))[0];
    expect(q.status).toBe("archived");
  });

  it("stores and queries test attempts and user answers with relational joins", async () => {
    await db.insert(schema.exams).values({ id: "e1", slug: "e1", name: "E1" });
    await db.insert(schema.examLevels).values({ id: "l1", examId: "e1", slug: "l1", name: "L1" });
    await db.insert(schema.subjects).values({ id: "s1", examLevelId: "l1", slug: "s1", name: "S1" });
    await db.insert(schema.topics).values({ id: "t1", subjectId: "s1", slug: "t1", name: "T1" });
    await db.insert(schema.questions).values({
      id: "q1",
      topicId: "t1",
      questionText: "Sample item?",
      explanation: "Test exp",
    });
    await db.insert(schema.choices).values({
      id: "c1",
      questionId: "q1",
      choiceLabel: "A",
      text: "Choice A",
      isCorrect: true,
    });

    // Record test attempt
    await db.insert(schema.testAttempts).values({
      id: "attempt-1",
      examLevelId: "l1",
      mode: "quick",
      totalQuestions: 1,
      score: 1,
      percentage: "100.00",
      passed: true,
      timeSpentSeconds: 45,
      status: "completed",
    });

    // Record user answer
    await db.insert(schema.userAnswers).values({
      id: "ans-1",
      testAttemptId: "attempt-1",
      questionId: "q1",
      selectedChoiceId: "c1",
      isCorrect: true,
      isFlagged: false,
      timeSpentSeconds: 45,
    });

    const attempts = await db.select().from(schema.testAttempts).where(eq(schema.testAttempts.id, "attempt-1"));
    expect(attempts.length).toBe(1);
    expect(attempts[0].percentage).toBe("100.00");
    expect(attempts[0].passed).toBe(true);
  });

  it("seeds full CSE schema and verifies subject exclusivity and exam-engine integration against real Postgres", async () => {
    const {
      SEED_EXAM,
      SEED_LEVELS,
      SEED_RULES,
      SEED_SUBJECTS,
      SEED_TOPICS,
      SEED_QUESTIONS,
    } = await import("@/db/seed-data");
    const { selectQuestionsForExam, calculateScore } = await import("@/features/exam-engine");

    // 1. Seed into real Postgres
    await db.insert(schema.exams).values(SEED_EXAM);
    for (const lvl of SEED_LEVELS) {
      await db.insert(schema.examLevels).values(lvl);
    }
    for (const rule of SEED_RULES) {
      await db.insert(schema.examRules).values({
        ...rule,
        passingScorePercentage: rule.passingScorePercentage.toFixed(2),
      });
    }
    for (const sub of SEED_SUBJECTS) {
      await db.insert(schema.subjects).values(sub);
    }
    for (const top of SEED_TOPICS) {
      await db.insert(schema.topics).values(top);
    }
    for (const q of SEED_QUESTIONS) {
      await db.insert(schema.questions).values({
        id: q.id,
        topicId: q.topicId,
        questionText: q.questionText,
        explanation: q.explanation,
        difficulty: q.difficulty,
        language: q.language,
        status: "draft",
        isSeedData: true,
      });
      for (const c of q.choices) {
        await db.insert(schema.choices).values({
          id: c.id,
          questionId: q.id,
          choiceLabel: c.choiceLabel,
          text: c.text,
          isCorrect: c.isCorrect,
          order: c.order,
        });
      }
    }

    // 2. Query subjects for Professional vs Subprofessional directly from Postgres
    const proSubjects = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.examLevelId, "level-pro"));
    const proSlugs = proSubjects.map((s) => s.slug);

    const subproSubjects = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.examLevelId, "level-subpro"));
    const subproSlugs = subproSubjects.map((s) => s.slug);

    // Assert Analytical Ability ONLY under Professional
    expect(proSlugs).toContain("analytical-ability");
    expect(subproSlugs).not.toContain("analytical-ability");

    // Assert Clerical Ability ONLY under Subprofessional
    expect(subproSlugs).toContain("clerical-ability");
    expect(proSlugs).not.toContain("clerical-ability");

    // 3. Query questions and choices from real Postgres database and run Exam Engine
    const dbQuestions = await db.select().from(schema.questions);
    const dbChoices = await db.select().from(schema.choices);

    const choicesByQuestion = new Map<string, typeof dbChoices>();
    for (const c of dbChoices) {
      const list = choicesByQuestion.get(c.questionId) || [];
      list.push(c);
      choicesByQuestion.set(c.questionId, list);
    }

    const engineQuestions: import("@/features/exam-engine").EngineQuestion[] = dbQuestions.map((q) => ({
      id: q.id,
      topicId: q.topicId,
      topicName: "Test Topic",
      topicSlug: "test-topic",
      subjectId: "subj-analytical",
      subjectName: "Analytical Ability",
      subjectSlug: "analytical-ability",
      questionText: q.questionText,
      explanation: q.explanation,
      difficulty: q.difficulty as "easy" | "medium" | "hard",
      language: q.language as "en" | "fil",
      choices: (choicesByQuestion.get(q.id) || []).map((c) => ({
        id: c.id,
        choiceLabel: c.choiceLabel,
        text: c.text,
        isCorrect: c.isCorrect,
        order: c.order,
      })),
    }));

    // Select questions with exam-engine question selector using ExamRuleConfig
    const testRules: import("@/features/exam-engine").ExamRuleConfig = {
      mode: "quick",
      itemCount: 5,
      timeLimitMinutes: 10,
      passingScorePercentage: 80,
      allowsFlagging: true,
      hasContinuousTimer: true,
    };
    const selected = selectQuestionsForExam(engineQuestions, testRules);
    expect(selected.length).toBe(5);

    // Score answers using exam-engine scoring
    const sampleAnswers = selected.map((q, idx) => ({
      questionId: q.id,
      selectedChoiceId: idx === 0 ? "wrong" : q.choices.find((c) => c.isCorrect)?.id || null,
      isFlagged: false,
      timeSpentSeconds: 15,
    }));

    const scoreResult = calculateScore(selected, sampleAnswers, 80, 75);
    expect(scoreResult.totalQuestions).toBe(5);
    expect(scoreResult.correctCount).toBe(4);
    expect(scoreResult.percentageScore).toBe(80);
    expect(scoreResult.isPassed).toBe(true);
  });

  it("verifies critical foreign key and contact indexes exist in PostgreSQL catalog", async () => {
    const res = await client.query<{ indexname: string; tablename: string }>(
      "SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public'"
    );
    const indexNames = new Set(res.rows.map((r) => r.indexname));

    expect(indexNames.has("idx_questions_topic_id")).toBe(true);
    expect(indexNames.has("idx_questions_topic_status")).toBe(true);
    expect(indexNames.has("idx_choices_question_id")).toBe(true);
    expect(indexNames.has("idx_test_attempts_user_id")).toBe(true);
    expect(indexNames.has("idx_user_answers_attempt_id")).toBe(true);
    expect(indexNames.has("idx_bookmarks_user_id")).toBe(true);
    expect(indexNames.has("idx_sessions_user_id")).toBe(true);

    // Finding 1 & 3: Contact inquiries indexes
    expect(indexNames.has("idx_contact_inquiries_expires_at")).toBe(true);
    expect(indexNames.has("idx_contact_inquiries_ip_created")).toBe(true);
    expect(indexNames.has("idx_contact_inquiries_status")).toBe(true);
  });

  it("stores contact inquiries and enforces 90-day retention cleanup against PostgreSQL", async () => {
    const now = new Date();
    const expiredDate = new Date(now.getTime() - 1000); // 1 second in past
    const futureDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days in future

    // Insert an expired inquiry
    await db.insert(schema.contactInquiries).values({
      id: "inq-expired",
      name: "Expired Inquiry",
      email: "expired@example.com",
      category: "other",
      message: "This inquiry has passed its 90-day retention period.",
      status: "unread",
      ipHash: "hash-123",
      createdAt: new Date(now.getTime() - 91 * 24 * 60 * 60 * 1000),
      expiresAt: expiredDate,
    });

    // Insert an active inquiry
    await db.insert(schema.contactInquiries).values({
      id: "inq-active",
      name: "Active Inquiry",
      email: "active@example.com",
      category: "correction",
      message: "This inquiry is well within its 90-day retention window.",
      status: "unread",
      ipHash: "hash-456",
      createdAt: now,
      expiresAt: futureDate,
    });

    // Verify both rows exist in PostgreSQL
    const beforeCount = await client.query<{ count: string }>(
      "SELECT count(*) FROM contact_inquiries"
    );
    expect(parseInt(beforeCount.rows[0].count, 10)).toBe(2);

    // Execute retention deletion (Finding 3)
    const { lte } = await import("drizzle-orm");
    const deleted = await db
      .delete(schema.contactInquiries)
      .where(lte(schema.contactInquiries.expiresAt, now))
      .returning({ id: schema.contactInquiries.id });

    expect(deleted.length).toBe(1);
    expect(deleted[0].id).toBe("inq-expired");

    // Verify only the active inquiry remains in PostgreSQL
    const remaining = await db.select().from(schema.contactInquiries);
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe("inq-active");
  });
});

