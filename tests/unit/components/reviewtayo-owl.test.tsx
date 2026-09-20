import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ReviewTayoOwl } from "@/components/brand/ReviewTayoOwl";

describe("ReviewTayoOwl Component", () => {
  it("renders default idle owl mascot with correct SVG viewBox", () => {
    const { container } = render(<ReviewTayoOwl />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 200 236");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".eyes-idle")).toBeInTheDocument();
  });

  it("renders with graduation cap when withCap is true", () => {
    const { container } = render(<ReviewTayoOwl withCap />);
    const cap = container.querySelector("#graduation-cap");

    expect(cap).toBeInTheDocument();
  });

  it("renders happy mood with curved eyes and blushing cheeks", () => {
    const { container } = render(<ReviewTayoOwl mood="happy" />);
    const happyGroup = container.querySelector(".eyes-happy");

    expect(happyGroup).toBeInTheDocument();
    expect(container.querySelector(".eyes-idle")).not.toBeInTheDocument();
  });

  it("renders oops mood with furrowed brow and tilted pupils", () => {
    const { container } = render(<ReviewTayoOwl mood="oops" />);
    const oopsGroup = container.querySelector(".eyes-oops");

    expect(oopsGroup).toBeInTheDocument();
  });

  it("renders with accessible role and label when alt is provided", () => {
    const { container } = render(<ReviewTayoOwl alt="ReviewTayo Official Mascot" />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "ReviewTayo Official Mascot");
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("applies bobbing animation class when bob is true", () => {
    const { container } = render(<ReviewTayoOwl bob />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveClass("animate-owl-bob");
  });
});
