import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Logo } from "@/components/ui/Logo";

describe("Logo Component", () => {
  it("renders default horizontal format with proper viewBox and accessibility attributes", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 1020 210");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveClass("text-brand-700", "dark:text-white");
    // Ensure no static duplicate title or ID exists
    expect(container.querySelector("title")).not.toBeInTheDocument();
  });

  it("renders icon format with 1:1 square viewBox", () => {
    const { container } = render(<Logo format="icon" className="h-10 w-10" />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 200 200");
    expect(svg).toHaveClass("h-10", "w-10");
  });

  it("renders stacked format with 800x480 viewBox", () => {
    const { container } = render(<Logo format="stacked" />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 800 480");
  });

  it("applies explicit color variants", () => {
    const { container: cMaroon } = render(<Logo variant="maroon" />);
    expect(cMaroon.querySelector("svg")).toHaveClass("text-brand-700");
    expect(cMaroon.querySelector("svg")).not.toHaveClass("dark:text-white");

    const { container: cWhite } = render(<Logo variant="white" />);
    expect(cWhite.querySelector("svg")).toHaveClass("text-white");

    const { container: cOnMaroon } = render(<Logo variant="on-maroon" />);
    expect(cOnMaroon.querySelector("svg")).toHaveClass("text-white");
  });
});
