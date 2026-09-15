import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExamRunner } from "@/features/practice/ExamRunner";
import type { EngineQuestion, ExamRuleConfig } from "@/features/exam-engine";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockQuestions: EngineQuestion[] = [
  {
    id: "q1",
    topicId: "top-1",
    topicName: "Grammar",
    topicSlug: "grammar",
    subjectId: "sub-1",
    subjectName: "Verbal Ability",
    subjectSlug: "verbal-ability",
    questionText: "Sample Question 1 text",
    explanation: "Educational explanation for question 1",
    difficulty: "medium",
    language: "en",
    choices: [
      { id: "c1", choiceLabel: "A", text: "Alpha Choice", isCorrect: true, order: 0 },
      { id: "c2", choiceLabel: "B", text: "Beta Choice", isCorrect: false, order: 1 },
    ],
  },
  {
    id: "q2",
    topicId: "top-2",
    topicName: "Percentages",
    topicSlug: "percentages",
    subjectId: "sub-2",
    subjectName: "Numerical Ability",
    subjectSlug: "numerical-ability",
    questionText: "Sample Question 2 text",
    explanation: "Educational explanation for question 2",
    difficulty: "easy",
    language: "en",
    choices: [
      { id: "c3", choiceLabel: "A", text: "Gamma Choice", isCorrect: false, order: 0 },
      { id: "c4", choiceLabel: "B", text: "Delta Choice", isCorrect: true, order: 1 },
    ],
  },
];

const mockRules: ExamRuleConfig = {
  mode: "quick",
  itemCount: 2,
  timeLimitMinutes: 10,
  passingScorePercentage: 80,
  allowsFlagging: true,
  hasContinuousTimer: true,
};

describe("ExamRunner Component", () => {
  it("renders exam header, timer, and current question", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    expect(screen.getByText("Diagnostic Quick Test")).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Sample Question 1 text")).toBeInTheDocument();
    expect(screen.getByText("Alpha Choice")).toBeInTheDocument();
    expect(screen.getByText("Beta Choice")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("selects choices and updates progress hierarchy", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    expect(screen.getByText(/0 answered/i)).toBeInTheDocument();
    expect(screen.getByText(/2 remaining/i)).toBeInTheDocument();

    const choiceBtn = screen.getByText("Alpha Choice");
    fireEvent.click(choiceBtn);

    expect(screen.getByText(/1 answered/i)).toBeInTheDocument();
    expect(screen.getByText(/1 remaining/i)).toBeInTheDocument();
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("toggles flag state on current question", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const flagBtn = screen.getByRole("button", { name: /flag/i });
    expect(flagBtn).toHaveTextContent("Flag");

    fireEvent.click(flagBtn);
    expect(flagBtn).toHaveTextContent("Flagged");

    fireEvent.click(flagBtn);
    expect(flagBtn).toHaveTextContent("Flag");
  });

  it("navigates between questions with Next and Previous buttons", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText("Question 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Sample Question 2 text")).toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: /previous/i });
    fireEvent.click(prevBtn);

    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  });

  it("opens review modal before submission", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Review Before Submission")).toBeInTheDocument();
    expect(screen.getByText("Return to Questions")).toBeInTheDocument();
    expect(screen.getByText("Submit Test")).toBeInTheDocument();
  });

  it("renders Save & Exit and handles confirmation modal for unanswered test", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const exitBtn = screen.getByRole("button", { name: /save and exit/i });
    fireEvent.click(exitBtn);

    expect(screen.getByText("Leave this test?")).toBeInTheDocument();
    expect(screen.getByText("You have not answered any questions yet.")).toBeInTheDocument();
    expect(screen.getByText("Keep Practicing")).toBeInTheDocument();
    expect(screen.getByText("Leave Test")).toBeInTheDocument();

    // Click Keep Practicing to dismiss
    fireEvent.click(screen.getByText("Keep Practicing"));
    expect(screen.queryByText("Leave this test?")).not.toBeInTheDocument();
  });

  it("renders Save & Exit and saves progress for answered test", () => {
    mockPush.mockClear();
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    // Answer Q1
    fireEvent.click(screen.getByText("Alpha Choice"));

    // Click Save & Exit
    const exitBtn = screen.getByRole("button", { name: /save and exit/i });
    fireEvent.click(exitBtn);

    expect(screen.getByText("Leave this test?")).toBeInTheDocument();
    expect(
      screen.getByText("Your progress is saved and you can resume this test later.")
    ).toBeInTheDocument();

    // Click Save & Leave
    fireEvent.click(screen.getByText("Save & Leave"));
    expect(mockPush).toHaveBeenCalledWith("/practice");
  });

  it("opens and toggles controls in Display menu", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const displayBtn = screen.getByRole("button", { name: /display accessibility settings/i });
    fireEvent.click(displayBtn);

    expect(screen.getByText("Font Size")).toBeInTheDocument();
    expect(screen.getByText("High Contrast")).toBeInTheDocument();
    expect(screen.getByText("Reduce Motion")).toBeInTheDocument();

    // Select Large Font
    const largeBtn = screen.getByRole("button", { name: "Large" });
    fireEvent.click(largeBtn);
    expect(largeBtn).toHaveClass("bg-white text-slate-900");

    // Toggle High Contrast
    const contrastSwitch = screen.getByRole("switch", { name: /toggle high contrast/i });
    fireEvent.click(contrastSwitch);
    expect(contrastSwitch).toHaveAttribute("aria-checked", "true");

    // Toggle Reduce Motion
    const motionSwitch = screen.getByRole("switch", { name: /toggle reduce motion/i });
    fireEvent.click(motionSwitch);
    expect(motionSwitch).toHaveAttribute("aria-checked", "true");
  });

  it("detects existing active draft, shows resume banner, and resumes session on click", async () => {
    const { LocalStorageService } = await import("@/lib/storage");
    LocalStorageService.saveActiveDraft({
      id: "draft-pro-quick",
      levelSlug: "professional",
      mode: "quick",
      title: "Diagnostic Quick Test",
      rules: mockRules,
      questions: mockQuestions,
      answers: {
        q1: { questionId: "q1", selectedChoiceId: "c1", isFlagged: true, timeSpentSeconds: 12 },
      },
      flaggedQuestionIds: ["q1"],
      currentQuestionIndex: 0,
      remainingSeconds: 450,
      startedAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
    });

    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    expect(screen.getByText(/Unfinished Session Found/i)).toBeInTheDocument();
    expect(screen.getByText(/1 answered/i)).toBeInTheDocument();

    const resumeBtn = screen.getByRole("button", { name: /Resume Session/i });
    fireEvent.click(resumeBtn);

    // Banner should dismiss and flagged status should be restored
    expect(screen.queryByText(/Unfinished Session Found/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /flag/i })).toHaveTextContent("Flagged");
  });

  it("discards existing draft when Discard & Start Fresh is clicked", async () => {
    const { LocalStorageService } = await import("@/lib/storage");
    LocalStorageService.saveActiveDraft({
      id: "draft-pro-quick",
      levelSlug: "professional",
      mode: "quick",
      title: "Diagnostic Quick Test",
      rules: mockRules,
      questions: mockQuestions,
      answers: {
        q1: { questionId: "q1", selectedChoiceId: "c1", isFlagged: false, timeSpentSeconds: 5 },
      },
      flaggedQuestionIds: [],
      currentQuestionIndex: 0,
      remainingSeconds: 500,
      startedAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
    });

    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    const discardBtn = screen.getByRole("button", { name: /Discard & Start Fresh/i });
    fireEvent.click(discardBtn);

    expect(screen.queryByText(/Unfinished Session Found/i)).not.toBeInTheDocument();
    expect(LocalStorageService.getActiveDraft("professional", "quick")).toBeNull();
  });

  it("selects choice and flags question via keyboard shortcuts", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    // Press 'A' key to select choice A (Alpha Choice)
    fireEvent.keyDown(window, { key: "a" });
    expect(screen.getByText("Alpha Choice").closest("div")).toHaveClass("border-brand-700");

    // Press 'F' key to toggle flag
    fireEvent.keyDown(window, { key: "f" });
    expect(screen.getByRole("button", { name: /flag/i })).toHaveTextContent("Flagged");

    // Press 'ArrowRight' to move to next question
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("Sample Question 2 text")).toBeInTheDocument();
  });

  it("supports striking through and eliminating distractors", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Diagnostic Quick Test"
      />
    );

    // Eliminate Option B
    const eliminateBtn = screen.getByRole("button", { name: /Cross-out Option B/i });
    fireEvent.click(eliminateBtn);

    // Beta choice should now have line-through text and restore button
    expect(screen.getByText("Beta Choice")).toHaveClass("line-through");
    expect(screen.getByRole("button", { name: /Restore Option B/i })).toBeInTheDocument();

    // Clicking the eliminated button does not select it
    fireEvent.click(screen.getByText("Beta Choice"));
    expect(screen.getByText("Beta Choice").closest("div")).not.toHaveClass("border-brand-700");
  });

  it("renders instant feedback and concept explanation in practice mode", () => {
    const practiceRules: ExamRuleConfig = {
      ...mockRules,
      mode: "practice",
    };

    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={practiceRules}
        title="Topic Practice"
      />
    );

    // Select correct choice A
    fireEvent.click(screen.getByText("Alpha Choice"));

    // Verify instant feedback card appears with rationale
    expect(screen.getByText(/Correct! Option A is right/i)).toBeInTheDocument();
    expect(screen.getByText("Educational explanation for question 1")).toBeInTheDocument();
  });

  it("opens and interacts with the virtual arithmetic scratchpad", () => {
    render(
      <ExamRunner
        initialQuestions={mockQuestions}
        rules={mockRules}
        title="Numerical Drill"
      />
    );

    // Click scratchpad button
    fireEvent.click(screen.getByRole("button", { name: /scratchpad/i }));

    // Verify scratchpad modal is visible
    expect(screen.getByText(/Scratchpad & Arithmetic Canvas/i)).toBeInTheDocument();

    // Switch to type notes
    fireEvent.click(screen.getByRole("button", { name: /type notes/i }));
    const textarea = screen.getByPlaceholderText(/type calculations or thoughts here/i);
    fireEvent.change(textarea, { target: { value: "170 * 0.8 = 136" } });
    expect(textarea).toHaveValue("170 * 0.8 = 136");

    // Close scratchpad
    fireEvent.click(screen.getByRole("button", { name: /keep working/i }));
    expect(screen.queryByText(/Scratchpad & Arithmetic Canvas/i)).not.toBeInTheDocument();
  });
});
