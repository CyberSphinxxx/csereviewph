import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import GlobalError from "@/app/error";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("Navigation & Optimization Components", () => {
  it("renders Loading streaming skeleton with brand styles", () => {
    const { container } = render(<Loading />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders NotFound 404 page with navigation links to reviewtayo.online", () => {
    render(<NotFound />);
    expect(screen.getByText(/Error 404/i)).toBeInTheDocument();
    expect(screen.getAllByText(/reviewtayo\.online/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Return Home/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Topic Practice/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders GlobalError boundary with retry action", () => {
    const resetMock = vi.fn();
    render(
      <GlobalError
        error={new Error("Test simulation failure")}
        reset={resetMock}
      />
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
  });

  it("renders NavigationProgress in initial dormant state", () => {
    const { container } = render(<NavigationProgress />);
    expect(container.firstChild).toBeNull();
  });
});
