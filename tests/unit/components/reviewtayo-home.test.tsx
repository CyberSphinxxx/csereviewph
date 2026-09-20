import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReviewTayoHomeView } from "@/components/home/ReviewTayoHomeView";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/lib/auth/auth-client", () => ({
  useSession: () => ({ data: null, refetch: vi.fn() }),
  signOut: vi.fn(),
}));

describe("ReviewTayoHomeView Component", () => {
  it("renders the hero with headline, primary calls to action, and trust strip", () => {
    render(<ReviewTayoHomeView />);

    // H1 Benefit Headline
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Review smarter.\s*Pass sooner./i);

    // Subtitle
    expect(
      screen.getByText(/Free timed mock exams for Philippine government and licensure tests/i)
    ).toBeInTheDocument();

    // Primary & Secondary CTAs
    const startLinks = screen.getAllByRole("link", { name: /Start free diagnostic/i });
    expect(startLinks.length).toBeGreaterThanOrEqual(1);
    expect(startLinks[0]).toHaveAttribute("href", "/exams/professional/quick");

    const browseLinks = screen.getAllByRole("link", { name: /Browse exams/i });
    expect(browseLinks.length).toBeGreaterThanOrEqual(1);

    // Trust strip
    expect(screen.getByText(/No account needed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Free diagnostic/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Explanations included/i)).toBeInTheDocument();
  });

  it("renders the interactive 'Try a real question' widget with option selection and feedback", () => {
    render(<ReviewTayoHomeView />);

    expect(screen.getByRole("heading", { name: /Try a real question\. Right now\./i })).toBeInTheDocument();
    expect(screen.getByText(/What is 15% of 240\?/i)).toBeInTheDocument();

    // Select the correct option ("36" - index 1)
    const optB = screen.getByRole("button", { name: /B 36/i });
    expect(optB).toBeInTheDocument();
    fireEvent.click(optB);

    // Correct feedback appears
    expect(screen.getByText(/Correct\./i)).toBeInTheDocument();
    expect(screen.getByText(/10% of 240 is 24 and 5% is 12\. Add them to get 36\./i)).toBeInTheDocument();

    // Next question button appears and advances
    const nextBtn = screen.getByRole("button", { name: /Next question/i });
    expect(nextBtn).toBeInTheDocument();
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Choose the word closest in meaning to “prudent”\./i)).toBeInTheDocument();
  });

  it("renders the Exam Chooser Carousel with category tabs and voting action", () => {
    render(<ReviewTayoHomeView />);

    expect(screen.getByRole("heading", { name: /Which exam are you taking\?/i })).toBeInTheDocument();

    // Category Tabs
    const allTab = screen.getByRole("button", { name: /^All$/i });
    const civilTab = screen.getByRole("button", { name: /^Civil Service$/i });
    const licensureTab = screen.getByRole("button", { name: /^Licensure$/i });
    const safetyTab = screen.getByRole("button", { name: /^Public Safety$/i });

    expect(allTab).toHaveAttribute("aria-pressed", "true");
    expect(civilTab).toHaveAttribute("aria-pressed", "false");
    expect(licensureTab).toHaveAttribute("aria-pressed", "false");
    expect(safetyTab).toHaveAttribute("aria-pressed", "false");

    // Live CSE Card
    expect(screen.getByText("Civil Service Exam")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open exam/i })).toHaveAttribute("href", "/cse");

    // Diagnostic Shortcuts
    expect(screen.getByRole("link", { name: /^Professional$/i })).toHaveAttribute(
      "href",
      "/exams/professional/quick"
    );
    expect(screen.getByRole("link", { name: /^Subprofessional$/i })).toHaveAttribute(
      "href",
      "/exams/subprofessional/quick"
    );

    // Vote action on coming soon cards
    const voteButtons = screen.getAllByRole("button", { name: /Vote for this exam/i });
    expect(voteButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(voteButtons[0]);
    expect(voteButtons[0]).toHaveTextContent(/Voted/i);
  });

  it("renders Bento Grid with practice length selector and subject breakdown", () => {
    render(<ReviewTayoHomeView />);

    expect(screen.getByRole("heading", { name: /Practice like it’s exam day\./i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore the CSE reviewer/i })).toHaveAttribute("href", "/cse");

    // Practice length selector buttons
    const opt10 = screen.getByRole("radio", { name: /10 items Quick drill/i });
    const opt170 = screen.getByRole("radio", { name: /170 items Full mock/i });

    expect(opt170).toHaveAttribute("aria-checked", "true");
    fireEvent.click(opt10);
    expect(opt10).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText(/Best for a spare few minutes\./i)).toBeInTheDocument();

    // Subject breakdown
    expect(screen.getByText(/Subject breakdown/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Verbal/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Analytical/i).length).toBeGreaterThanOrEqual(1);

    // Rationale tile
    expect(screen.getByText(/Why 162\?/i)).toBeInTheDocument();
  });

  it("renders Countdown Close and Footer with legal notice", () => {
    render(<ReviewTayoHomeView />);

    expect(screen.getByText(/days until the Civil Service Exam\./i)).toBeInTheDocument();
    expect(screen.getByText(/Non-affiliation notice\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/Privacy-first · RA 10173/i).length).toBeGreaterThanOrEqual(1);
  });
});
