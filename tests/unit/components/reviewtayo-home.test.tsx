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
  it("renders the benefit-led hero with trust line and exam picker card", () => {
    render(<ReviewTayoHomeView />);

    // Eyebrow and Benefit Headline
    expect(screen.getByText("PHILIPPINE EXAM PREPARATION")).toBeInTheDocument();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Free practice exams for Philippine government and licensure tests/i);

    // Trust line
    expect(screen.getAllByText(/No account/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Free diagnostic/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Explanations included/i)).toBeInTheDocument();

    // Right Exam Picker card
    expect(screen.getByText(/Choose the exam you.*re preparing for/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /^Professional\b/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /^Subprofessional\b/i })).toBeInTheDocument();

    // Direct 2-click path to free diagnostic
    const diagnosticBtn = screen.getByRole("link", { name: /Start free diagnostic/i });
    expect(diagnosticBtn).toHaveAttribute("href", "/exams/professional/quick");
    expect(screen.getByRole("link", { name: /View exam overview/i })).toHaveAttribute(
      "href",
      "/cse?level=professional"
    );
  });

  it("renders Available now section with Live CSE card and Open exam action", () => {
    render(<ReviewTayoHomeView />);

    expect(screen.getByRole("heading", { name: /Available now/i })).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getAllByText("Civil Service Exam (CSE)").length).toBeGreaterThanOrEqual(1);

    const openExamLinks = screen.getAllByRole("link", { name: /Open exam/i });
    expect(openExamLinks.length).toBeGreaterThanOrEqual(1);
    expect(openExamLinks[0]).toHaveAttribute("href", "/cse");
  });

  it("renders Coming soon section with category chips and Notify me triggers", () => {
    render(<ReviewTayoHomeView />);

    expect(screen.getByRole("heading", { name: /Coming soon/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All Categories/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Civil Service" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Licensure" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Public Safety" })).toBeInTheDocument();

    // Notify me action buttons
    const notifyBtns = screen.getAllByRole("button", { name: /Notify me/i });
    expect(notifyBtns.length).toBeGreaterThanOrEqual(3);
  });

  it("renders 3-step How it works section", () => {
    render(<ReviewTayoHomeView />);

    expect(screen.getByRole("heading", { name: /How ReviewTayo Works/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Pick an exam/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Take a free diagnostic/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Follow recommended practice/i })).toBeInTheDocument();
  });
});
