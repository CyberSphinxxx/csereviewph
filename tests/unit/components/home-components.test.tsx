import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroExamLevelSelector } from "@/components/home/HeroExamLevelSelector";
import { SubtestExplorer } from "@/components/home/SubtestExplorer";
import { vi } from "vitest";

describe("HeroExamLevelSelector Component", () => {
  it("renders header labels and selection options", () => {
    const handleSelect = vi.fn();
    render(
      <HeroExamLevelSelector selectedLevel="professional" onSelectLevel={handleSelect} />
    );

    expect(screen.getByText(/START YOUR REVIEW/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose your exam level/i)).toBeInTheDocument();

    expect(screen.getByText("Professional")).toBeInTheDocument();
    expect(screen.getByText(/For second-level positions/i)).toBeInTheDocument();
    expect(screen.getByText(/Includes Analytical Ability/i)).toBeInTheDocument();

    expect(screen.getByText("Subprofessional")).toBeInTheDocument();
    expect(screen.getByText(/For first-level positions/i)).toBeInTheDocument();
    expect(screen.getByText(/Includes Clerical Ability/i)).toBeInTheDocument();
  });

  it("renders quiet exam schedule line with link to schedule guide", () => {
    const handleSelect = vi.fn();
    render(
      <HeroExamLevelSelector selectedLevel="professional" onSelectLevel={handleSelect} />
    );

    expect(screen.getByText("Exam schedule")).toBeInTheDocument();
    expect(screen.getByText(/March 14, 2027/i)).toBeInTheDocument();
    const viewDatesLink = screen.getByRole("link", { name: /View dates/i });
    expect(viewDatesLink).toBeInTheDocument();
    expect(viewDatesLink).toHaveAttribute("href", "/cse/exam-guide#schedule");
  });

  it("renders single primary CTA button pointing to selected level and reassurance line", () => {
    const handleSelect = vi.fn();
    const { rerender } = render(
      <HeroExamLevelSelector selectedLevel="professional" onSelectLevel={handleSelect} />
    );

    const cta = screen.getByRole("link", { name: /Start Free Diagnostic/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/exams/professional/quick");

    expect(screen.getByText(/10 questions · 10-minute timer/i)).toBeInTheDocument();
    expect(screen.getByText(/No account required/i)).toBeInTheDocument();

    // Re-render with subprofessional
    rerender(
      <HeroExamLevelSelector selectedLevel="subprofessional" onSelectLevel={handleSelect} />
    );
    expect(screen.getByRole("link", { name: /Start Free Diagnostic/i })).toHaveAttribute(
      "href",
      "/exams/subprofessional/quick"
    );
  });

  it("calls onSelectLevel when level option is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <HeroExamLevelSelector selectedLevel="professional" onSelectLevel={handleSelect} />
    );

    const subproBtn = screen.getByRole("radio", { name: /Subprofessional/i });
    fireEvent.click(subproBtn);
    expect(handleSelect).toHaveBeenCalledWith("subprofessional");

    const proBtn = screen.getByRole("radio", { name: /^Professional\b/i });
    fireEvent.click(proBtn);
    expect(handleSelect).toHaveBeenCalledWith("professional");
  });

  it("renders compare levels helper link pointing to #compare-levels", () => {
    const handleSelect = vi.fn();
    render(
      <HeroExamLevelSelector selectedLevel="professional" onSelectLevel={handleSelect} />
    );

    const compareLink = screen.getByRole("link", { name: /Not sure which level\? Compare the two levels/i });
    expect(compareLink).toBeInTheDocument();
    expect(compareLink).toHaveAttribute("href", "#compare-levels");
  });
});

describe("SubtestExplorer Component", () => {
  it("renders all 5 Civil Service subtest tabs with item counts", () => {
    render(<SubtestExplorer />);

    expect(screen.getByRole("button", { name: /Verbal Ability 50Q/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Numerical Ability 40Q/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Analytical Ability 30Q/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /General Information 20Q/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clerical Ability 30Q/i })).toBeInTheDocument();
  });

  it("switches to Analytical Ability and verifies Professional exclusivity", () => {
    render(<SubtestExplorer />);

    const analyticalTab = screen.getByRole("button", { name: /Analytical Ability 30Q/i });
    fireEvent.click(analyticalTab);

    expect(screen.getByText("Professional Level Only")).toBeInTheDocument();
    expect(screen.getByText(/Formal Logic, Syllogisms & Conditional Statements/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Practice Analytical Ability/i })).toHaveAttribute("href", "/practice");
  });

  it("switches to Clerical Ability and verifies Subprofessional exclusivity", () => {
    render(<SubtestExplorer />);

    const clericalTab = screen.getByRole("button", { name: /Clerical Ability 30Q/i });
    fireEvent.click(clericalTab);

    expect(screen.getByText("Subprofessional Level Only")).toBeInTheDocument();
    expect(screen.getByText(/Alphabetical Filing Rules & Standard Office Indexing/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Practice Clerical Ability/i })).toHaveAttribute("href", "/practice");
  });
});
