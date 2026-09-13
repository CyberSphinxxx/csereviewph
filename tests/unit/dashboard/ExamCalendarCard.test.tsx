import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExamCalendarCard } from "@/features/dashboard/ExamCalendarCard";

describe("ExamCalendarCard Component", () => {
  const mockConfig = {
    targetDate: "2027-03-14",
    examName: "March 2027 CSE-PPT",
    dailyGoal: 25,
  };

  it("renders target exam info, countdown, mini month calendar, and daily goal", () => {
    render(
      <ExamCalendarCard
        config={mockConfig}
        dailyAnswered={10}
        onConfigChange={vi.fn()}
      />
    );

    expect(screen.getByText("Your Exam")).toBeInTheDocument();
    expect(screen.getByText("March 2027 CSE-PPT")).toBeInTheDocument();
    expect(screen.getByText("March 14, 2027")).toBeInTheDocument();
    expect(screen.getByText(/remaining/i)).toBeInTheDocument();
    expect(screen.getByText("Change date")).toBeInTheDocument();
    expect(screen.getByText("10 / 25 items")).toBeInTheDocument();
    expect(screen.getByText("March 2027")).toBeInTheDocument();
  });

  it("opens accessible inline editor with htmlFor and id bindings (D03)", () => {
    render(
      <ExamCalendarCard
        config={mockConfig}
        dailyAnswered={10}
        onConfigChange={vi.fn()}
      />
    );

    const changeDateBtn = screen.getByRole("button", { name: "Change date" });
    fireEvent.click(changeDateBtn);

    // Form inputs must have accessible names associated via labels (Finding D03)
    const presetSelect = screen.getByLabelText("Target Exam Schedule");
    expect(presetSelect).toBeInTheDocument();
    expect(presetSelect).toHaveAttribute("id", "target-exam-preset");

    const dateInput = screen.getByLabelText("Target Date");
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute("id", "target-exam-date");

    const goalInput = screen.getByLabelText(/Daily Question Goal/i);
    expect(goalInput).toBeInTheDocument();
    expect(goalInput).toHaveAttribute("id", "daily-question-goal");
  });

  it("allows saving a new target date and invokes onConfigChange", () => {
    const handleConfigChange = vi.fn();
    render(
      <ExamCalendarCard
        config={mockConfig}
        dailyAnswered={10}
        onConfigChange={handleConfigChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Change date" }));

    const presetSelect = screen.getByLabelText("Target Exam Schedule");
    fireEvent.change(presetSelect, { target: { value: "2027-08-08" } });

    const saveBtn = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveBtn);

    expect(handleConfigChange).toHaveBeenCalledWith(
      expect.objectContaining({
        targetDate: "2027-08-08",
        examName: "August 2027 CSE-PPT",
      })
    );
  });

  it("cancels edits and restores previous values when Cancel is clicked", () => {
    render(
      <ExamCalendarCard
        config={mockConfig}
        dailyAnswered={10}
        onConfigChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Change date" }));

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);

    // Form should be closed
    expect(screen.queryByLabelText("Target Date")).not.toBeInTheDocument();
    expect(screen.getByText("March 2027 CSE-PPT")).toBeInTheDocument();
  });
});
