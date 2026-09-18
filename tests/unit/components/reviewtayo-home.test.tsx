import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ReviewTayoHomeView } from "@/components/home/ReviewTayoHomeView";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("ReviewTayoHomeView Component", () => {
  it("renders platform umbrella editorial hero, masthead, and contextual CSE entry", () => {
    render(<ReviewTayoHomeView />);

    // Masthead check
    expect(screen.getByText("Philippine Exam Preparation")).toBeInTheDocument();
    expect(screen.getByText(/ReviewTayo • Examination Index/i)).toBeInTheDocument();

    // Single H1 headline check
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Your review home for/i);
    expect(h1).toHaveTextContent(/Philippine examinations/i);

    // Contextual action -> /cse
    const cseLink = screen.getByRole("link", { name: /^Civil Service reviewer is live now/i });
    expect(cseLink).toBeInTheDocument();
    expect(cseLink).toHaveAttribute("href", "/cse");
  });

  it("renders the Philippine Examination Index with CSE live and upcoming exams in research", () => {
    render(<ReviewTayoHomeView />);

    expect(
      screen.getByRole("heading", { name: /The Philippine Examination Index/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText("LIVE").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("IN RESEARCH").length).toBeGreaterThanOrEqual(4);

    const cseReviewerLinks = screen.getAllByRole("link", { name: /Open (CSE )?reviewer/i });
    expect(cseReviewerLinks.length).toBeGreaterThanOrEqual(1);
    expect(cseReviewerLinks[0]).toHaveAttribute("href", "/cse");
  });

  it("renders live CSE spotlight section and How ReviewTayo Works method", () => {
    render(<ReviewTayoHomeView />);

    expect(
      screen.getByRole("heading", { name: /Civil Service Exam \(CSE-PPT\) Reviewer/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /How ReviewTayo Works/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /^Choose Your Exam$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /^Practice & Simulate$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /^Review Rationales$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /^Track Readiness$/i })
    ).toBeInTheDocument();
  });
});
