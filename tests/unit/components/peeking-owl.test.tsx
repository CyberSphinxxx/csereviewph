import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, cleanup, act } from "@testing-library/react";
import {
  PeekingOwl,
  calculatePupilOffset,
  isReducedMotionActive,
  isFinePointer,
} from "@/components/home/PeekingOwl";

// Polyfill PointerEvent for jsdom test environment if not defined
if (typeof window !== "undefined" && typeof window.PointerEvent === "undefined") {
  class MockPointerEvent extends MouseEvent {
    pointerType: string;
    constructor(type: string, params: { pointerType?: string; clientX?: number; clientY?: number; bubbles?: boolean } = {}) {
      super(type, params);
      this.pointerType = params.pointerType || "mouse";
    }
  }
  // @ts-expect-error polyfill for jsdom
  window.PointerEvent = MockPointerEvent;
  // @ts-expect-error polyfill for jsdom
  global.PointerEvent = MockPointerEvent;
}

describe("PeekingOwl Component & Motion Logic", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute("data-reduce-motion");
  });

  afterEach(() => {
    cleanup();
    document.documentElement.removeAttribute("data-reduce-motion");
  });

  describe("calculatePupilOffset math engine", () => {
    const dummySvgRect = { left: 100, top: 100, width: 120, height: 120 };
    const leftEyeCoords: [number, number] = [63, 98];
    const rightEyeCoords: [number, number] = [137, 98];

    it("returns (0, 0) when pointer is null", () => {
      const offset = calculatePupilOffset({
        pointer: null,
        svgRect: dummySvgRect,
        eyeCoords: leftEyeCoords,
      });
      expect(offset).toEqual({ x: 0, y: 0 });
    });

    it("guards zero-size and detached SVG elements safely", () => {
      expect(
        calculatePupilOffset({
          pointer: { x: 200, y: 200 },
          svgRect: null,
          eyeCoords: leftEyeCoords,
        })
      ).toEqual({ x: 0, y: 0 });

      expect(
        calculatePupilOffset({
          pointer: { x: 200, y: 200 },
          svgRect: { left: 0, top: 0, width: 0, height: 120 },
          eyeCoords: leftEyeCoords,
        })
      ).toEqual({ x: 0, y: 0 });

      expect(
        calculatePupilOffset({
          pointer: { x: 200, y: 200 },
          svgRect: { left: 0, top: 0, width: 120, height: 0 },
          eyeCoords: leftEyeCoords,
        })
      ).toEqual({ x: 0, y: 0 });
    });

    it("returns (0, 0) when pointer is exactly at eye center", () => {
      const eyeX = dummySvgRect.left + leftEyeCoords[0] * (dummySvgRect.width / 200);
      const eyeY = dummySvgRect.top + leftEyeCoords[1] * (dummySvgRect.height / 416);

      const offset = calculatePupilOffset({
        pointer: { x: eyeX, y: eyeY },
        svgRect: dummySvgRect,
        eyeCoords: leftEyeCoords,
      });
      expect(offset).toEqual({ x: 0, y: 0 });
    });

    it("clamps horizontal movement strictly to [-3, 3] and vertical to [-2, 2] at extreme coordinates", () => {
      const eyeX = dummySvgRect.left + leftEyeCoords[0] * (dummySvgRect.width / 200);
      const eyeY = dummySvgRect.top + leftEyeCoords[1] * (dummySvgRect.height / 416);

      // Extreme Right
      const rightExtreme = calculatePupilOffset({
        pointer: { x: eyeX + 2000, y: eyeY },
        svgRect: dummySvgRect,
        eyeCoords: leftEyeCoords,
      });
      expect(rightExtreme.x).toBe(3);
      expect(rightExtreme.y).toBe(0);

      // Extreme Left
      const leftExtreme = calculatePupilOffset({
        pointer: { x: eyeX - 2000, y: eyeY },
        svgRect: dummySvgRect,
        eyeCoords: leftEyeCoords,
      });
      expect(leftExtreme.x).toBe(-3);
      expect(leftExtreme.y).toBe(0);

      // Extreme Top
      const topExtreme = calculatePupilOffset({
        pointer: { x: eyeX, y: eyeY - 2000 },
        svgRect: dummySvgRect,
        eyeCoords: leftEyeCoords,
      });
      expect(topExtreme.x).toBe(0);
      expect(topExtreme.y).toBe(-2);

      // Extreme Bottom
      const bottomExtreme = calculatePupilOffset({
        pointer: { x: eyeX, y: eyeY + 2000 },
        svgRect: dummySvgRect,
        eyeCoords: leftEyeCoords,
      });
      expect(bottomExtreme.x).toBe(0);
      expect(bottomExtreme.y).toBe(2);

      // Diagonal Extreme: both must remain strictly within bounds
      const diagonalExtreme = calculatePupilOffset({
        pointer: { x: eyeX + 1500, y: eyeY - 1500 },
        svgRect: dummySvgRect,
        eyeCoords: rightEyeCoords,
      });
      expect(diagonalExtreme.x).toBeLessThanOrEqual(3);
      expect(diagonalExtreme.x).toBeGreaterThanOrEqual(-3);
      expect(diagonalExtreme.y).toBeLessThanOrEqual(2);
      expect(diagonalExtreme.y).toBeGreaterThanOrEqual(-2);
    });

    it("supports localPointer SVG CTM coordinates for exact tracking under CSS transforms", () => {
      // Pointer at eye center in SVG coordinates
      const centerOffset = calculatePupilOffset({
        pointer: { x: 500, y: 500 },
        svgRect: dummySvgRect,
        eyeCoords: leftEyeCoords,
        localPointer: { x: 63, y: 98 },
      });
      expect(centerOffset).toEqual({ x: 0, y: 0 });

      // Pointer shifted right in SVG coordinates
      const rightOffset = calculatePupilOffset({
        pointer: { x: 500, y: 500 },
        svgRect: dummySvgRect,
        eyeCoords: leftEyeCoords,
        localPointer: { x: 500, y: 98 },
      });
      expect(rightOffset.x).toBe(3);
      expect(rightOffset.y).toBe(0);

      // Pointer shifted diagonally in SVG coordinates
      const diagonalOffset = calculatePupilOffset({
        pointer: { x: 500, y: 500 },
        svgRect: dummySvgRect,
        eyeCoords: rightEyeCoords,
        localPointer: { x: 137 + 500, y: 98 - 500 },
      });
      expect(diagonalOffset.x).toBeLessThanOrEqual(3);
      expect(diagonalOffset.x).toBeGreaterThanOrEqual(-3);
      expect(diagonalOffset.y).toBeLessThanOrEqual(2);
      expect(diagonalOffset.y).toBeGreaterThanOrEqual(-2);
    });
  });

  describe("Preference helpers: reduced motion and pointer capabilities", () => {
    it("respects OS prefers-reduced-motion media query", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(isReducedMotionActive()).toBe(true);
    });

    it("respects site-level data-reduce-motion='reduce' attribute on root html", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      document.documentElement.setAttribute("data-reduce-motion", "reduce");
      expect(isReducedMotionActive()).toBe(true);

      document.documentElement.removeAttribute("data-reduce-motion");
      expect(isReducedMotionActive()).toBe(false);
    });

    it("correctly identifies fine pointers with hover support vs coarse touch", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === "(hover: hover) and (pointer: fine)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(isFinePointer()).toBe(true);

      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: "",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(isFinePointer()).toBe(false);
    });
  });

  describe("SVG rendering and unique clipPath IDs", () => {
    it("renders full-body SVG with fixed head, fixed body, and two movable pupils with accessibility attributes", () => {
      const { container } = render(<PeekingOwl />);
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("viewBox")).toBe("0 0 200 416");
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
      expect(svg?.getAttribute("focusable")).toBe("false");
      expect(svg?.classList.contains("pointer-events-none")).toBe(true);

      // Fixed body and head exist and contain full B1 mascot paths
      const fixedBody = container.querySelector("[data-owl-part='fixed-body']");
      expect(fixedBody).toBeTruthy();
      const fixedHead = container.querySelector("[data-owl-part='fixed-head']");
      expect(fixedHead).toBeTruthy();

      // Pupils exist
      const leftPupil = container.querySelector("[data-owl-pupil='left']");
      const rightPupil = container.querySelector("[data-owl-pupil='right']");
      expect(leftPupil).toBeTruthy();
      expect(rightPupil).toBeTruthy();
    });

    it("generates unique clipPath IDs across multiple rendered instances to avoid DOM ID collisions", () => {
      const { container: container1 } = render(<PeekingOwl data-testid="owl-1" />);
      const { container: container2 } = render(<PeekingOwl data-testid="owl-2" />);

      const clipPaths1 = Array.from(container1.querySelectorAll("clipPath")).map((cp) => cp.id);
      const clipPaths2 = Array.from(container2.querySelectorAll("clipPath")).map((cp) => cp.id);

      expect(clipPaths1.length).toBe(2);
      expect(clipPaths2.length).toBe(2);

      // Every clipPath ID must be distinct between instances
      for (const id1 of clipPaths1) {
        expect(clipPaths2).not.toContain(id1);
      }

      // Verify each pupil's parent group references the corresponding unique clipPath ID
      const leftClipUser1 = container1.querySelector("[data-owl-pupil='left']")?.parentElement;
      expect(leftClipUser1?.getAttribute("clip-path")).toBe(`url(#${clipPaths1[0]})`);
    });
  });

  describe("Interactive tracking and neutral transitions", () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === "(hover: hover) and (pointer: fine)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    });

    it("tracks mouse movement near the card and updates pupil DOM transforms", async () => {
      let rAFCallback: FrameRequestCallback | null = null;
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        rAFCallback = cb;
        return 101;
      });

      const TestWrapper = () => {
        const cardRef = React.useRef<HTMLDivElement>(null);
        return (
          <section data-testid="hero-section">
            <PeekingOwl cardRef={cardRef} />
            <div ref={cardRef} data-testid="review-card" style={{ width: 400, height: 300 }}>
              Start your review
            </div>
          </section>
        );
      };

      const { container } = render(<TestWrapper />);
      const heroSection = container.querySelector("[data-testid='hero-section']") as HTMLElement;
      const reviewCard = container.querySelector("[data-testid='review-card']") as HTMLElement;
      const svg = container.querySelector("svg") as SVGSVGElement;
      const leftPupil = container.querySelector("[data-owl-pupil='left']") as SVGGElement;
      const rightPupil = container.querySelector("[data-owl-pupil='right']") as SVGGElement;

      vi.spyOn(heroSection, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        right: 1000,
        bottom: 800,
        width: 1000,
        height: 800,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      vi.spyOn(reviewCard, "getBoundingClientRect").mockReturnValue({
        left: 200,
        top: 200,
        right: 600,
        bottom: 500,
        width: 400,
        height: 300,
        x: 200,
        y: 200,
        toJSON: () => {},
      });

      vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
        left: 105,
        top: 350,
        right: 225,
        bottom: 470,
        width: 120,
        height: 120,
        x: 105,
        y: 350,
        toJSON: () => {},
      });

      // Pointer event inside hero tracking zone (e.g. at headline / main text at 100, 200)
      act(() => {
        heroSection.dispatchEvent(
          new PointerEvent("pointermove", {
            clientX: 100,
            clientY: 200,
            bubbles: true,
          })
        );
      });

      // Execute coalesced requestAnimationFrame callback
      expect(rAFCallback).toBeTruthy();
      act(() => {
        rAFCallback!(performance.now());
      });

      // Transforms should be set
      expect(leftPupil.getAttribute("transform")).toMatch(/translate\(-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\)/);
      expect(rightPupil.getAttribute("transform")).toMatch(/translate\(-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\)/);
      expect(leftPupil.style.transition).toBe("none");

      // Pointer moves completely outside hero bounds (e.g. at 1500, 1500)
      act(() => {
        heroSection.dispatchEvent(
          new PointerEvent("pointermove", {
            clientX: 1500,
            clientY: 1500,
            bubbles: true,
          })
        );
      });

      act(() => {
        if (rAFCallback) {
          rAFCallback(performance.now());
        }
      });

      // Should return to neutral with 180ms ease-out transition
      expect(leftPupil.getAttribute("transform")).toBe("translate(0 0)");
      expect(rightPupil.getAttribute("transform")).toBe("translate(0 0)");
      expect(leftPupil.style.transition).toContain("180ms");
    });

    it("returns to neutral immediately with transition 'none' when reduced motion is activated", async () => {
      let rAFCallback: FrameRequestCallback | null = null;
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        rAFCallback = cb;
        return 102;
      });

      const TestWrapper = () => {
        const cardRef = React.useRef<HTMLDivElement>(null);
        return (
          <section data-testid="hero-section">
            <PeekingOwl cardRef={cardRef} />
            <div ref={cardRef} data-testid="review-card" style={{ width: 400, height: 300 }}>
              Start your review
            </div>
          </section>
        );
      };

      const { container } = render(<TestWrapper />);
      const heroSection = container.querySelector("[data-testid='hero-section']") as HTMLElement;
      const reviewCard = container.querySelector("[data-testid='review-card']") as HTMLElement;
      const svg = container.querySelector("svg") as SVGSVGElement;
      const leftPupil = container.querySelector("[data-owl-pupil='left']") as SVGGElement;
      const rightPupil = container.querySelector("[data-owl-pupil='right']") as SVGGElement;

      vi.spyOn(reviewCard, "getBoundingClientRect").mockReturnValue({
        left: 200,
        top: 200,
        right: 600,
        bottom: 500,
        width: 400,
        height: 300,
        x: 200,
        y: 200,
        toJSON: () => {},
      });
      vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
        left: 105,
        top: 350,
        right: 225,
        bottom: 470,
        width: 120,
        height: 120,
        x: 105,
        y: 350,
        toJSON: () => {},
      });

      // Move pupils first
      act(() => {
        heroSection.dispatchEvent(
          new PointerEvent("pointermove", {
            clientX: 300,
            clientY: 300,
            bubbles: true,
          })
        );
      });
      act(() => {
        rAFCallback?.(performance.now());
      });

      // Set attribute for reduced motion
      act(() => {
        document.documentElement.setAttribute("data-reduce-motion", "reduce");
      });

      // Allow MutationObserver microtasks to run
      await act(async () => {
        await Promise.resolve();
      });

      expect(leftPupil.getAttribute("transform")).toBe("translate(0 0)");
      expect(rightPupil.getAttribute("transform")).toBe("translate(0 0)");
      expect(leftPupil.style.transition).toBe("none");
    });

    it("resets to neutral on window blur or tab visibility change", () => {
      const TestWrapper = () => {
        const cardRef = React.useRef<HTMLDivElement>(null);
        return (
          <section data-testid="hero-section">
            <PeekingOwl cardRef={cardRef} />
            <div ref={cardRef} data-testid="review-card" style={{ width: 400, height: 300 }}>
              Start your review
            </div>
          </section>
        );
      };

      const { container } = render(<TestWrapper />);
      const leftPupil = container.querySelector("[data-owl-pupil='left']") as SVGGElement;

      act(() => {
        window.dispatchEvent(new Event("blur"));
      });
      expect(leftPupil.getAttribute("transform")).toBe("translate(0 0)");

      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
      expect(leftPupil.getAttribute("transform")).toBe("translate(0 0)");
    });
  });
});
