import { describe, it, expect, vi, afterAll } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("link", { name: "Reviewers" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "How It Works" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CSE Reviewer" })).toBeInTheDocument();

    // CSE-specific top-level nav links should NOT be in primary desktop nav on umbrella pages
    expect(screen.queryByRole("link", { name: /^Practice$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Study Guides$/ })).not.toBeInTheDocument();
  });

  it("renders platform-oriented navigation on /reviewers", () => {
    mockPathname = "/reviewers";
    render(<Header />);

    expect(screen.getByRole("link", { name: "Reviewers" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "How It Works" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CSE Reviewer" })).toBeInTheDocument();
  });

  it("renders CSE-specific contextual navigation in CSE context (/cse)", () => {
    mockPathname = "/cse";
    render(<Header />);

    // Badge showing active exam context
    expect(screen.getByText("Civil Service Exam")).toBeInTheDocument();

    // Contextual CSE links
    expect(screen.getByRole("link", { name: "Reviewers" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Practice" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Study Guides" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Exam Info" })).toBeInTheDocument();
  });

  it("renders CSE-specific contextual navigation in practice routes (/practice)", () => {
    mockPathname = "/practice";
    render(<Header />);

    expect(screen.getByText("Civil Service Exam")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Practice" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Study Guides" })).toBeInTheDocument();
  });
});
