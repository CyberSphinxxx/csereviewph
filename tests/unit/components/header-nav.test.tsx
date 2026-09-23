import { describe, it, expect, vi, afterAll } from "vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";
import { ExamSubNav } from "@/components/layout/ExamSubNav";

// Mock next/navigation usePathname
let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

afterAll(() => {
  mockPathname = "/cse";
});

describe("GlobalHeader & ExamSubNav Two-Layer Navigation IA", () => {
  it("renders identical Layer 1 navigation on umbrella pages (/)", () => {
    mockPathname = "/";
    render(<Header />);

    // Layer 1 global nav links should be present
    expect(screen.getByRole("link", { name: "Exams" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Study resources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My dashboard" })).toBeInTheDocument();

    // Old "More" dropdown and "How it works" should NOT be in Layer 1 header
    expect(screen.queryByRole("button", { name: "More" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "How it works" })).not.toBeInTheDocument();
  });

  it("renders identical Layer 1 navigation on /reviewers", () => {
    mockPathname = "/reviewers";
    render(<Header />);

    expect(screen.getByRole("link", { name: "Exams" })).toHaveAttribute("href", "/reviewers");
    expect(screen.getByRole("link", { name: "Study resources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My dashboard" })).toBeInTheDocument();
  });

  it("preserves identical Layer 1 global navigation inside exam context (/cse)", () => {
    mockPathname = "/cse";
    render(<Header />);

    // Global navigation never moves or changes between pages
    expect(screen.getByRole("link", { name: "Exams" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Study resources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My dashboard" })).toBeInTheDocument();

    // Exam-specific links must NOT be in Layer 1 GlobalHeader
    expect(screen.queryByRole("link", { name: "All exams" })).not.toBeInTheDocument();
  });

  it("renders Layer 2 ExamSubNav with contextual links and level switcher in exam context", () => {
    mockPathname = "/cse";
    render(<ExamSubNav examId="cse" />);

    // Contextual CSE sub-nav links
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Practice" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mock exams" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Guides" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Exam info" })).toBeInTheDocument();

    // Level selector button / pill
    expect(screen.getByRole("button", { name: /switch level or exam/i })).toBeInTheDocument();
  });

  it("opens mobile drawer and closes with Escape key", () => {
    mockPathname = "/";
    render(<Header />);

    const openMenuBtn = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(openMenuBtn);

    // Mobile drawer should be open with links
    const mobileNav = screen.getByRole("navigation", { name: /Primary mobile/i });
    expect(mobileNav).toBeInTheDocument();

    // Press Escape to dismiss
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: /Primary mobile/i })).not.toBeInTheDocument();
  });
});
