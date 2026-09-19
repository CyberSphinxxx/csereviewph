import { describe, it, expect, vi, afterAll } from "vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

// Mock next/navigation usePathname
let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

afterAll(() => {
  mockPathname = "/cse";
});

describe("Header Component Navigation Hierarchy (RT-03)", () => {
  it("renders platform-oriented navigation on umbrella pages (/)", () => {
    mockPathname = "/";
    render(<Header />);

    // Umbrella nav links should be present
    expect(screen.getByRole("link", { name: "Exams" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "How it works" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Study resources" })).toBeInTheDocument();

    // CSE-specific top-level nav links should NOT be in primary desktop nav on umbrella pages
    expect(screen.queryByRole("link", { name: /^Practice$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Mock exams$/ })).not.toBeInTheDocument();
  });

  it("renders platform-oriented navigation on /reviewers", () => {
    mockPathname = "/reviewers";
    render(<Header />);

    expect(screen.getByRole("link", { name: "Exams" })).toHaveAttribute("href", "/reviewers");
    expect(screen.getByRole("link", { name: "How it works" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Study resources" })).toBeInTheDocument();
  });

  it("renders CSE-specific contextual navigation in CSE context (/cse)", () => {
    mockPathname = "/cse";
    render(<Header />);

    // Badge showing active exam context
    expect(screen.getAllByText("CSE").length).toBeGreaterThanOrEqual(1);

    // Contextual CSE links
    expect(screen.getByRole("link", { name: "All exams" })).toHaveAttribute("href", "/reviewers");
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Practice" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mock exams" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Guides" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Exam info" })).toBeInTheDocument();
  });

  it("renders CSE-specific contextual navigation in practice routes (/practice)", () => {
    mockPathname = "/practice";
    render(<Header />);

    expect(screen.getAllByText("CSE").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: "Practice" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Guides" })).toBeInTheDocument();
  });

  it("dismisses the More menu with Escape and restores focus", () => {
    mockPathname = "/";
    render(<Header />);

    const trigger = screen.getByRole("button", { name: "More" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "FAQ & help" })).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});
