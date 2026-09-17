import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ReviewTayoHomeView } from "@/components/home/ReviewTayoHomeView";

describe("ReviewTayoHomeView Component", () => {
  it("renders platform umbrella hero, heading, and honest entry CTAs", () => {
    render(<ReviewTayoHomeView />);

    // Eyebrow check
    expect(
      screen.getByText(/Philippine exam preparation, all in one place/i)
    ).toBeInTheDocument();

    // Single H1 headline check
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Choose your exam/i);
    expect(h1).toHaveTextContent(/Build your confidence/i);

    // Primary CTA -> /cse
    const cseBtn = screen.getByRole("link", { name: /^Start CSE review/i });
    expect(cseBtn).toBeInTheDocument();
    expect(cseBtn).toHaveAttribute("href", "/cse");

    // Secondary CTA -> #reviewers
    const exploreLink = screen.getByRole("link", { name: /^Explore all reviewers/i });
    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute("href", "#reviewers");
  });

  it("renders reviewer catalog section with CSE available and upcoming exams", () => {
    render(<ReviewTayoHomeView />);

    expect(
      screen.getByRole("heading", { name: /Select Your Target Examination/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Available Today")).toBeInTheDocument();
    expect(screen.getAllByText("Coming Soon").length).toBeGreaterThanOrEqual(4);
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
