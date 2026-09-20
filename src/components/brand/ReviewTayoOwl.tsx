"use client";

import React, { useEffect, useRef } from "react";

export type OwlMood = "idle" | "happy" | "oops";

export interface ReviewTayoOwlProps extends React.SVGProps<SVGSVGElement> {
  mood?: OwlMood;
  withCap?: boolean;
  tracked?: boolean;
  bob?: boolean;
  className?: string;
  size?: number | string;
  alt?: string;
}

export function ReviewTayoOwl({
  mood = "idle",
  withCap = false,
  tracked = false,
  bob = false,
  className = "",
  size,
  alt,
  "aria-hidden": ariaHiddenProp,
  style,
  ...props
}: ReviewTayoOwlProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!tracked || mood !== "idle") return;

    let rafId: number | null = null;
    let isFine = true;
    let reducedMotion = false;

    if (typeof window !== "undefined") {
      isFine = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? true;
      reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    }

    if (!isFine || reducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height * 0.4);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 280) * 6;

        const tx = ((dx / d) * k).toFixed(1);
        const ty = ((dy / d) * k).toFixed(1);

        if (leftPupilRef.current) {
          leftPupilRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
        }
        if (rightPupilRef.current) {
          rightPupilRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
        }
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [tracked, mood]);

  const isDecorative = ariaHiddenProp === true || (!alt && ariaHiddenProp !== false);
  const isAccessible = !isDecorative && alt;

  const widthStyle = size ? (typeof size === "number" ? `${size}px` : size) : undefined;
  const heightStyle = size ? "auto" : undefined;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 236"
      role={isAccessible ? "img" : undefined}
      aria-label={isAccessible ? alt : undefined}
      aria-hidden={isDecorative ? "true" : undefined}
      className={`owl ${bob ? "animate-owl-bob" : ""} ${className}`.trim()}
      style={{
        width: widthStyle,
        height: heightStyle,
        ...style,
      }}
      {...props}
    >
      {/* Feet */}
      <rect x="66" y="208" width="30" height="14" rx="7" fill="#F6B93B" />
      <rect x="104" y="208" width="30" height="14" rx="7" fill="#F6B93B" />

      {/* Body */}
      <path
        d="M100 34C152 34 180 74 180 132C180 188 150 214 100 214C50 214 20 188 20 132C20 74 48 34 100 34Z"
        fill="#8A1630"
      />

      {/* Ear tufts */}
      <path d="M34 56L54 18L88 44Z" fill="#6B0F25" />
      <path d="M166 56L146 18L112 44Z" fill="#6B0F25" />

      {/* Wings */}
      <path d="M22 118C2 150 10 192 44 200C42 172 38 146 22 118Z" fill="#6B0F25" />
      <path d="M178 118C198 150 190 192 156 200C158 172 162 146 178 118Z" fill="#6B0F25" />

      {/* Belly */}
      <ellipse cx="100" cy="162" rx="48" ry="50" fill="#F8DDE2" />

      {/* Feather scallops */}
      <path
        d="M74 142q13 11 26 0q13 11 26 0M70 166q15 11 30 0q15 11 30 0M78 190q11 9 22 0q11 9 22 0"
        fill="none"
        stroke="#DDA3AF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Head */}
      <ellipse cx="100" cy="94" rx="68" ry="48" fill="#A81B3B" />

      {/* Graduation Cap */}
      {withCap && (
        <g id="graduation-cap">
          <path d="M60 34L100 14L140 34L100 54Z" fill="#221219" />
          <path d="M80 44V58Q100 68 120 58V44" fill="#33202A" />
          <path d="M140 34V58" stroke="#F6B93B" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="140" cy="61" r="5" fill="#F6B93B" />
        </g>
      )}

      {/* Eyes by Mood */}
      {mood === "happy" ? (
        <g className="eyes-happy">
          <path
            d="M54 100Q74 74 94 100"
            fill="none"
            stroke="#fff"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M106 100Q126 74 146 100"
            fill="none"
            stroke="#fff"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="50" cy="114" r="8" fill="#F26F8A" opacity=".6" />
          <circle cx="150" cy="114" r="8" fill="#F26F8A" opacity=".6" />
        </g>
      ) : mood === "oops" ? (
        <g className="eyes-oops">
          <g className="eye left-eye">
            <circle cx="74" cy="94" r="26" fill="#fff" stroke="#F8DDE2" strokeWidth="4" />
            <g>
              <circle cx="74" cy="100" r="12" fill="#1B0A10" />
              <circle cx="78" cy="95" r="4" fill="#fff" />
            </g>
          </g>
          <g className="eye right-eye">
            <circle cx="126" cy="94" r="26" fill="#fff" stroke="#F8DDE2" strokeWidth="4" />
            <g>
              <circle cx="126" cy="100" r="12" fill="#1B0A10" />
              <circle cx="130" cy="95" r="4" fill="#fff" />
            </g>
          </g>
          <path
            d="M50 78L90 66"
            stroke="#F8DDE2"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M150 78L110 66"
            stroke="#F8DDE2"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <g className="eyes-idle">
          <g className="eye left-eye">
            <circle cx="74" cy="94" r="26" fill="#fff" stroke="#F8DDE2" strokeWidth="4" />
            <g ref={leftPupilRef} className="pupil">
              <circle cx="74" cy="94" r="12" fill="#1B0A10" />
              <circle cx="78" cy="89" r="4" fill="#fff" />
            </g>
          </g>
          <g className="eye right-eye">
            <circle cx="126" cy="94" r="26" fill="#fff" stroke="#F8DDE2" strokeWidth="4" />
            <g ref={rightPupilRef} className="pupil">
              <circle cx="126" cy="94" r="12" fill="#1B0A10" />
              <circle cx="130" cy="89" r="4" fill="#fff" />
            </g>
          </g>
        </g>
      )}

      {/* Beak */}
      <path
        d="M91 108L109 108L100 127Z"
        fill="#F6B93B"
        stroke="#F6B93B"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
