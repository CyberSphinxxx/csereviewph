import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ExamsPageView } from "@/components/reviewers/ExamsPageView";

// Mock scrollIntoView
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.clearAllTimers();
});

describe("ExamsPageView Component (reviewtayo-exams-v2)", () => {
  it("renders Owl Finder with 'What are you aiming for?' and 5 interactive goals", () => {
    render(<ExamsPageView />);

    expect(
      screen.getByRole("heading", { level: 1, name: /What are you aiming for\?/i })
    ).toBeInTheDocument();

    const radiogroup = screen.getByRole("radiogroup", { name: /Your exam goal/i });
    expect(radiogroup).toBeInTheDocument();

    // 5 goals
    expect(screen.getByText("A government job")).toBeInTheDocument();
    expect(screen.getByText("A police, military or fire career")).toBeInTheDocument();
    expect(screen.getByText("A professional license")).toBeInTheDocument();
    expect(screen.getByText("A college or scholarship spot")).toBeInTheDocument();
    expect(screen.getByText("A school or skills certificate")).toBeInTheDocument();

    // Initial placeholder in match panel
    expect(screen.getByText("Your matches show up here.")).toBeInTheDocument();
  });

  it("updates speech bubble and displays matching mini-cards when a goal is picked", async () => {
    render(<ExamsPageView />);

    const govGoal = screen.getByRole("radio", { name: /A government job/i });
    fireEvent.click(govGoal);

    expect(govGoal).toHaveAttribute("aria-checked", "true");

    // Speech bubble updates
    expect(
      screen.getByText(/Civil service and agency exams are here/i)
    ).toBeInTheDocument();

    // Mini cards show up
    const proMatches = screen.getAllByText("Career Service Examination, Professional Level");
    expect(proMatches.length).toBeGreaterThanOrEqual(1);

    const subproMatches = screen.getAllByText("Career Service Examination, Subprofessional Level");
    expect(subproMatches.length).toBeGreaterThanOrEqual(1);

    // Live badges
    const liveBadges = screen.getAllByText("Live");
    expect(liveBadges.length).toBeGreaterThan(0);
  });

  it("shows sub-field filter chips when selecting a multi-field goal (e.g. professional license)", async () => {
    render(<ExamsPageView />);

    const licGoal = screen.getByRole("radio", { name: /A professional license/i });
    fireEvent.click(licGoal);

    expect(screen.getByText(/All fields/i)).toBeInTheDocument();

    // Click "Education" field chip specifically
    const eduChips = screen.getAllByRole("button", { name: /Education/i });
    const fieldChip = eduChips.find((btn) => btn.hasAttribute("aria-pressed"));
    expect(fieldChip).toBeDefined();
    fireEvent.click(fieldChip!);

    expect(
      screen.getByText(/Licensure Examination for Professional Teachers, Elementary/i)
    ).toBeInTheDocument();
  });

  it("renders catalog with search input, kbd shortcut, popular chips, and categories", () => {
    render(<ExamsPageView />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Search every exam\./i })
    ).toBeInTheDocument();

    const searchInput = screen.getByRole("textbox", { name: /Search exams/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("placeholder", "Try “nurse”, “CPA” or “UPCAT”");

    // Popular query buttons
    expect(screen.getByRole("button", { name: "Civil service" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Teacher" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nurse" })).toBeInTheDocument();

    // Category navigation
    const catNav = screen.getByRole("navigation", { name: /Exam categories/i });
    expect(catNav).toBeInTheDocument();
    expect(within(catNav).getByRole("button", { name: /All exams/i })).toBeInTheDocument();
  });

  it("filters ticket cards by search query and marks matched keywords", async () => {
    render(<ExamsPageView />);

    const searchInput = screen.getByRole("textbox", { name: /Search exams/i });
    fireEvent.change(searchInput, { target: { value: "nurse" } });

    expect(searchInput).toHaveValue("nurse");

    // NLE ticket heading should be visible
    expect(
      screen.getByRole("heading", { level: 3, name: /Nurse.*Licensure Examination/i })
    ).toBeInTheDocument();

    // Clear search button should appear and work
    const clearBtn = screen.getByRole("button", { name: /Clear search/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);

    expect(searchInput).toHaveValue("");
  });

  it("filters to live exams when 'Live only' switch is toggled", async () => {
    render(<ExamsPageView />);

    const liveCheckbox = screen.getByRole("checkbox", { name: /Live only/i });
    expect(liveCheckbox).not.toBeChecked();

    // Initially coming soon exams are present
    expect(
      screen.getByText(/Fire Officer Examination/i)
    ).toBeInTheDocument();

    // Toggle live only
    fireEvent.click(liveCheckbox);
    expect(liveCheckbox).toBeChecked();

    // Non-live exam should not be present
    expect(
      screen.queryByText(/Fire Officer Examination/i)
    ).not.toBeInTheDocument();

    // Live CSE exams remain present
    const proExams = screen.getAllByText(/Career Service Examination, Professional Level/i);
    expect(proExams.length).toBeGreaterThanOrEqual(1);
  });

  it("ensures live tickets link to /cse and coming-soon tickets display non-navigating badge", () => {
    render(<ExamsPageView />);

    // Live CSE ticket has working link to /cse
    const openBtns = screen.getAllByRole("link", { name: /Open exam/i });
    expect(openBtns.length).toBeGreaterThan(0);
    expect(openBtns[0]).toHaveAttribute("href", "/cse");

    // Coming soon tickets show non-navigating badge
    const comingSoonBadges = screen.getAllByText(/Coming soon/i);
    expect(comingSoonBadges.length).toBeGreaterThan(0);
  });

  it("displays empty state with oops mascot when no exams match query", async () => {
    render(<ExamsPageView />);

    const searchInput = screen.getByRole("textbox", { name: /Search exams/i });
    fireEvent.change(searchInput, { target: { value: "nonexistentxyzexam" } });

    expect(
      screen.getByRole("heading", { level: 3, name: /No exam matches.*nonexistentxyzexam.*yet/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /ReviewTayo Mascot Oops/i })).toBeInTheDocument();
  });

  it("suggestion bar submits exam request and displays confirmation", async () => {
    render(<ExamsPageView />);

    const sugInput = screen.getByRole("textbox", { name: /Exam you're looking for/i });
    const sendBtn = screen.getByRole("button", { name: /Send/i });

    // Empty submission error
    fireEvent.click(sendBtn);
    expect(screen.getByText("Type the exam name first.")).toBeInTheDocument();

    // Valid submission
    fireEvent.change(sugInput, { target: { value: "Barangay Health Worker Exam" } });
    fireEvent.click(sendBtn);

    expect(
      screen.getByText(/Thanks\. We'll look into “Barangay Health Worker Exam”\./i)
    ).toBeInTheDocument();
  });

  it("strictly excludes prototype-only design notes and commentary", () => {
    const { container } = render(<ExamsPageView />);

    expect(container.querySelector("#notesbtn")).toBeNull();
    expect(container.querySelector(".note")).toBeNull();
    expect(screen.queryByText(/1 · Owl finder/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/2 · Search and tickets/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Design notes/i)).not.toBeInTheDocument();
  });
});
