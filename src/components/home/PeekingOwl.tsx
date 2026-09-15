"use client";

import React, { useId, useRef, useEffect } from "react";

export const OWL_VIEWBOX: [number, number] = [200, 416];
export const LEFT_EYE_COORDS: [number, number] = [63, 98];
export const RIGHT_EYE_COORDS: [number, number] = [137, 98];

export interface CalculatePupilOffsetParams {
  pointer: { x: number; y: number } | null;
  svgRect: { left: number; top: number; width: number; height: number } | null;
  eyeCoords: [number, number]; // [x, y] in viewBox coordinates, e.g. [63, 98]
  viewBox?: [number, number]; // [width, height], default [200, 416]
  maxOffset?: { x: number; y: number }; // default { x: 3, y: 2 }
  activationDistance?: number; // distance in CSS px to reach max offset, default 60
  localPointer?: { x: number; y: number }; // optional pointer in SVG coordinates from CTM
}

/**
 * Pure calculation for pupil offset:
 * - Guards zero-size or detached elements
 * - Supports exact local pointer coordinates from SVG Screen CTM (matrixTransform)
 * - Clamps offset strictly within [-maxOffset.x, maxOffset.x] and [-maxOffset.y, maxOffset.y]
 * - Smoothly approaches max offset based on distance
 */
export function calculatePupilOffset({
  pointer,
  svgRect,
  eyeCoords,
  viewBox = OWL_VIEWBOX,
  maxOffset = { x: 3, y: 2 },
  activationDistance = 60,
  localPointer,
}: CalculatePupilOffsetParams): { x: number; y: number } {
  if (localPointer) {
    const dx = localPointer.x - eyeCoords[0];
    const dy = localPointer.y - eyeCoords[1];
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      return { x: 0, y: 0 };
    }

    const ux = dx / dist;
    const uy = dy / dist;

    // Approximate scale factor from SVG coordinates to CSS px
    const scaleX = svgRect && svgRect.width > 0 ? svgRect.width / viewBox[0] : 0.75;
    const distInPx = dist * scaleX;

    const factor = Math.min(1, distInPx / activationDistance);
    const rawX = ux * maxOffset.x * factor;
    const rawY = uy * maxOffset.y * factor;

    const clampedX = Math.max(-maxOffset.x, Math.min(maxOffset.x, rawX));
    const clampedY = Math.max(-maxOffset.y, Math.min(maxOffset.y, rawY));

    return {
      x: Math.round(clampedX * 100) / 100,
      y: Math.round(clampedY * 100) / 100,
    };
  }

  if (!pointer || !svgRect || svgRect.width <= 0 || svgRect.height <= 0) {
    return { x: 0, y: 0 };
  }

  const scaleX = svgRect.width / viewBox[0];
  const scaleY = svgRect.height / viewBox[1];

  if (scaleX <= 0 || scaleY <= 0) {
    return { x: 0, y: 0 };
  }

  const eyeScreenX = svgRect.left + eyeCoords[0] * scaleX;
  const eyeScreenY = svgRect.top + eyeCoords[1] * scaleY;

  const dx = pointer.x - eyeScreenX;
  const dy = pointer.y - eyeScreenY;
  const dist = Math.hypot(dx, dy);

  if (dist === 0) {
    return { x: 0, y: 0 };
  }

  const ux = dx / dist;
  const uy = dy / dist;

  const factor = Math.min(1, dist / activationDistance);
  const rawX = ux * maxOffset.x * factor;
  const rawY = uy * maxOffset.y * factor;

  const clampedX = Math.max(-maxOffset.x, Math.min(maxOffset.x, rawX));
  const clampedY = Math.max(-maxOffset.y, Math.min(maxOffset.y, rawY));

  return {
    x: Math.round(clampedX * 100) / 100,
    y: Math.round(clampedY * 100) / 100,
  };
}

/**
 * Checks if reduced motion is requested via either:
 * 1. OS-level media query `(prefers-reduced-motion: reduce)`
 * 2. Site-level `data-reduce-motion="reduce"` attribute on `<html>`
 */
export function isReducedMotionActive(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  const osPreference = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const sitePreference = document.documentElement?.getAttribute("data-reduce-motion") === "reduce";
  return osPreference || sitePreference;
}

/**
 * Checks if pointer is a fine hover device (mouse/trackpad, not touch/coarse).
 */
export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false;
}

export interface PeekingOwlProps extends React.SVGProps<SVGSVGElement> {
  cardRef?: React.RefObject<HTMLElement | null>;
  heroRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function PeekingOwl({
  cardRef,
  heroRef,
  className = "",
  ...props
}: PeekingOwlProps) {
  const rawId = useId();
  const cleanId = rawId.replace(/:/g, "-");
  const leftClipId = `peek-left-eye-${cleanId}`;
  const rightClipId = `peek-right-eye-${cleanId}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const latestPointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    // Identify the hero tracking scope element (hero section or card's parent)
    const scopeEl =
      heroRef?.current ||
      cardRef?.current?.closest("section") ||
      cardRef?.current?.parentElement ||
      svgEl.parentElement;

    if (!scopeEl) return;

    const returnToNeutral = (immediate = false) => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      latestPointerRef.current = null;

      const transitionVal = immediate
        ? "none"
        : "transform 180ms cubic-bezier(0.2, 0, 0, 1)";

      if (leftPupilRef.current) {
        leftPupilRef.current.style.transition = transitionVal;
        leftPupilRef.current.setAttribute("transform", "translate(0 0)");
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.style.transition = transitionVal;
        rightPupilRef.current.setAttribute("transform", "translate(0 0)");
      }
    };

    const updatePupils = () => {
      rafIdRef.current = null;

      if (!isFinePointer() || isReducedMotionActive() || !latestPointerRef.current) {
        returnToNeutral(true);
        return;
      }

      // Check hero section proximity: pointer must be within the hero container
      if (scopeEl) {
        const heroRect = scopeEl.getBoundingClientRect();
        if (heroRect.width > 0 && heroRect.height > 0) {
          const px = latestPointerRef.current.x;
          const py = latestPointerRef.current.y;

          const inHero =
            px >= heroRect.left &&
            px <= heroRect.right &&
            py >= heroRect.top &&
            py <= heroRect.bottom;

          if (!inHero) {
            returnToNeutral(false);
            return;
          }
        }
      }

      const currentSvg = svgRef.current;
      if (!currentSvg) return;

      const svgRect = currentSvg.getBoundingClientRect();
      if (svgRect.width <= 0 || svgRect.height <= 0) {
        returnToNeutral(false);
        return;
      }

      let localPointer: { x: number; y: number } | undefined;
      try {
        if (
          typeof currentSvg.getScreenCTM === "function" &&
          typeof currentSvg.createSVGPoint === "function"
        ) {
          const ctm = currentSvg.getScreenCTM();
          if (ctm) {
            const pt = currentSvg.createSVGPoint();
            pt.x = latestPointerRef.current.x;
            pt.y = latestPointerRef.current.y;
            const transformed = pt.matrixTransform(ctm.inverse());
            localPointer = { x: transformed.x, y: transformed.y };
          }
        }
      } catch {
        // Fallback to linear calculation
      }

      const leftOffset = calculatePupilOffset({
        pointer: latestPointerRef.current,
        svgRect,
        eyeCoords: LEFT_EYE_COORDS,
        viewBox: OWL_VIEWBOX,
        localPointer,
      });

      const rightOffset = calculatePupilOffset({
        pointer: latestPointerRef.current,
        svgRect,
        eyeCoords: RIGHT_EYE_COORDS,
        viewBox: OWL_VIEWBOX,
        localPointer,
      });

      if (leftPupilRef.current && rightPupilRef.current) {
        leftPupilRef.current.style.transition = "none";
        rightPupilRef.current.style.transition = "none";
        leftPupilRef.current.setAttribute("transform", `translate(${leftOffset.x} ${leftOffset.y})`);
        rightPupilRef.current.setAttribute("transform", `translate(${rightOffset.x} ${rightOffset.y})`);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Only fine pointers (mouse/trackpad)
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        return;
      }
      if (!isFinePointer() || isReducedMotionActive()) {
        return;
      }

      latestPointerRef.current = { x: e.clientX, y: e.clientY };

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updatePupils);
      }
    };

    const handlePointerLeave = () => {
      returnToNeutral(false);
    };

    // Scoped listener on hero wrapper element
    scopeEl.addEventListener("pointermove", handlePointerMove as EventListener, { passive: true });
    scopeEl.addEventListener("pointerleave", handlePointerLeave as EventListener);

    // Hero viewport visibility handling via IntersectionObserver
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              returnToNeutral(false);
            }
          }
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(scopeEl);
    }

    // Window blur & document visibility handling
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        returnToNeutral(true);
      }
    };
    const handleBlur = () => {
      returnToNeutral(false);
    };
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // OS reduced-motion listener
    const osReducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const handleMotionQueryChange = () => {
      if (isReducedMotionActive()) {
        returnToNeutral(true);
      }
    };
    osReducedMotionQuery?.addEventListener?.("change", handleMotionQueryChange);

    // Site reduced-motion MutationObserver on document.documentElement
    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-reduce-motion"
          ) {
            if (isReducedMotionActive()) {
              returnToNeutral(true);
            }
          }
        }
      });
      mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-reduce-motion"],
      });
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      scopeEl.removeEventListener("pointermove", handlePointerMove as EventListener);
      scopeEl.removeEventListener("pointerleave", handlePointerLeave as EventListener);
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      osReducedMotionQuery?.removeEventListener?.("change", handleMotionQueryChange);
    };
  }, [cardRef, heroRef]);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 416"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none select-none text-[#86152D] dark:text-white ${className}`}
      {...props}
    >
      <defs>
        <clipPath id={leftClipId} clipPathUnits="userSpaceOnUse">
          <path d="M48 80C45 90 47 108 59 113C71 117 80 106 79 96C70 87 59 84 48 80Z" />
        </clipPath>
        <clipPath id={rightClipId} clipPathUnits="userSpaceOnUse">
          <path d="M152 80C155 90 153 108 141 113C129 117 120 106 121 96C130 87 141 84 152 80Z" />
        </clipPath>
      </defs>
      <g data-owl-part="fixed-body">
        <path
          fillRule="evenodd"
          d="M38 150C17 177 15 209 20 243C24 274 43 307 65 337L73 356L72 367C58 370 51 377 52 388L64 378L65 393L76 380L82 393L88 376L96 376L95 353L100 275C91 225 65 181 38 150ZM44 182C56 207 73 244 86 284L94 347C76 293 56 228 44 182Z"
        />
        <g transform="translate(200 0) scale(-1 1)">
          <path
            fillRule="evenodd"
            d="M38 150C17 177 15 209 20 243C24 274 43 307 65 337L73 356L72 367C58 370 51 377 52 388L64 378L65 393L76 380L82 393L88 376L96 376L95 353L100 275C91 225 65 181 38 150ZM44 182C56 207 73 244 86 284L94 347C76 293 56 228 44 182Z"
          />
        </g>
      </g>
      <g data-owl-part="fixed-head">
        <path d="M25 24C41 40 81 26 99 62L100 81C83 57 47 66 30 48C26 42 25 33 25 24Z" />
        <path d="M175 24C159 40 119 26 101 62L100 81C117 57 153 66 170 48C174 42 175 33 175 24Z" />
        <path
          fillRule="evenodd"
          d="M25 58C40 73 66 69 83 88L100 139L117 88C134 69 160 73 175 58L171 110C166 145 117 153 100 182C83 153 34 145 29 110ZM48 80C45 90 47 108 59 113C71 117 80 106 79 96C70 87 59 84 48 80ZM152 80C155 90 153 108 141 113C129 117 120 106 121 96C130 87 141 84 152 80Z"
        />
      </g>
      <g clipPath={`url(#${leftClipId})`}>
        <g ref={leftPupilRef} data-owl-pupil="left" transform="translate(0 0)">
          <ellipse cx="63" cy="98" rx="8" ry="10" />
        </g>
      </g>
      <g clipPath={`url(#${rightClipId})`}>
        <g ref={rightPupilRef} data-owl-pupil="right" transform="translate(0 0)">
          <ellipse cx="137" cy="98" rx="8" ry="10" />
        </g>
      </g>
    </svg>
  );
}
