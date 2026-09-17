import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExamGuidePage from "@/app/(public)/cse/exam-guide/page";

describe("CSE Exam Guide Page Integration", () => {
  it("renders the full public exam guide page with header, footer, and main sections", () => {
    render(<ExamGuidePage />);

    // Header brand and exam guide active/present
    expect(screen.getByText(/reviewtayo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Exam Guide/i).length).toBeGreaterThanOrEqual(1);

    // Independence disclaimer
    const disclaimer = screen.getByRole("note", { name: /Independent Platform Disclaimer/i });
    expect(disclaimer).toBeInTheDocument();
    expect(disclaimer).toHaveTextContent(/independent exam-preparation platform/i);
    expect(disclaimer).toHaveTextContent(/not affiliated with or endorsed by the Civil Service Commission/i);

    // Main headings
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/CSE Exam Guide and Official CSC Links/i);
    expect(screen.getByRole("heading", { name: /CSE Exam Schedule & Application Periods/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Testing-Center Finder/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /How to Apply for the CSE-PPT/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Application & Documentary Requirements/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Check Your School & Room Assignment \(eNOSA\)/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Exam-Day Protocol & What to Bring/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Results, Ratings & Certification of Eligibility/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /CSC Regional Office Directory \(16 Regions\)/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Official CSC Links Directory/i })).toBeInTheDocument();

    // Zero credential inputs
    const passwords = screen.queryAllByLabelText(/password/i);
    expect(passwords.length).toBe(0);
  });
});
