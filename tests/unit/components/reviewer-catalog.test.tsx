import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ReviewerCatalog } from "@/components/reviewers/ReviewerCatalog";
import { ReviewerCard } from "@/components/reviewers/ReviewerCard";
import { getFeaturedExam, getExamBySlug } from "@/config/exams";

describe("ReviewerCatalog & ReviewerCard Components", () => {
  it("renders CSE reviewer card with available badge and functional link to /cse", () => {
    const cse = getFeaturedExam();
    render(<ReviewerCard exam={cse} featured={true} />);

    expect(screen.getByRole("heading", { name: /Civil Service Examination/i })).toBeInTheDocument();
    expect(screen.getByText("Available Today")).toBeInTheDocument();
    expect(screen.getByText("Civil Service Commission (CSC)")).toBeInTheDocument();

    const startBtn = screen.getByRole("link", { name: /Open CSE Reviewer/i });
    expect(startBtn).toHaveAttribute("href", "/cse");
  });

  it("renders upcoming reviewer cards with Coming Soon status and disabled planned action", () => {
    const letExam = getExamBySlug("let")!;
    expect(letExam).toBeDefined();

    render(<ReviewerCard exam={letExam} />);

    expect(screen.getByRole("heading", { name: /Licensure Examination for Teachers/i })).toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
    expect(screen.getByText(/Professional Regulation Commission \(PRC\)/i)).toBeInTheDocument();

    // Verify button is disabled and does NOT navigate anywhere
    const plannedBtn = screen.getByRole("button", { name: /Planned Reviewer/i });
    expect(plannedBtn).toBeDisabled();
    expect(plannedBtn).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByRole("link", { name: /Planned Reviewer/i })).not.toBeInTheDocument();
  });

  it("renders all catalog entries including the research card in full catalog mode", () => {
    render(<ReviewerCatalog initialCategory="all" showCategoryTabs={true} />);

    expect(screen.getByRole("heading", { name: /Civil Service Examination/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Licensure Examination for Teachers/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Philippine Nursing Licensure Examination/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Bureau of Fire Protection Examinations/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /NAPOLCOM Police Examinations/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /More Philippine Exams/i })).toBeInTheDocument();
  });
});
