"use client";

import React, { useState, useRef, useEffect } from "react";
import { OwlFinderSection } from "@/components/reviewers/OwlFinderSection";
import { ExamCatalogSection } from "@/components/reviewers/ExamCatalogSection";
import { ExamsClosingCallout } from "@/components/reviewers/ExamsClosingCallout";
import { EXAM_GROUPS_BY_ID } from "@/config/exam-directory";

const DEFAULT_PAGE_SIZE = 10;

export function ExamsPageView() {
  const [query, setQuery] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[] | null>(null);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [liveOnly, setLiveOnly] = useState(false);
  const [shownCount, setShownCount] = useState(DEFAULT_PAGE_SIZE);

  const catalogRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut: Pressing '/' focuses search (unless in an input/textarea)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["input", "textarea", "select"].includes(
          (document.activeElement?.tagName || "").toLowerCase()
        )
      ) {
        e.preventDefault();
        catalogRef.current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          searchInputRef.current?.focus({ preventScroll: true });
        }, 150);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Universal pointermove listener: pupil tracking on all owls
  useEffect(() => {
    let pq = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (pq) return;
      pq = true;
      requestAnimationFrame(() => {
        pq = false;
        const pupils = document.querySelectorAll<SVGGElement>(".pupil");
        pupils.forEach((p) => {
          const owner = p.ownerSVGElement;
          if (!owner) return;
          const r = owner.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height * 0.4);
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, d / 280) * 6;
          p.style.transform = `translate(${((dx / d) * k).toFixed(1)}px, ${((dy / d) * k).toFixed(1)}px)`;
        });
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const handleSelectGoalForCatalog = (groupIds: string[], label: string) => {
    setSelectedGroupIds(groupIds);
    setSelectedLabel(label);
    setQuery("");
    setShownCount(DEFAULT_PAGE_SIZE);

    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGoToSearch = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    }, 450);
  };

  const handleSelectGroup = (gid: string | null) => {
    setSelectedGroupIds(gid ? [gid] : null);
    setSelectedLabel(gid ? EXAM_GROUPS_BY_ID[gid]?.name || "" : "");
    setShownCount(DEFAULT_PAGE_SIZE);
  };

  const handleClearFilterPill = () => {
    setSelectedGroupIds(null);
    setSelectedLabel("");
    setShownCount(DEFAULT_PAGE_SIZE);
  };

  const handleQueryChange = (newQ: string) => {
    setQuery(newQ);
    setShownCount(DEFAULT_PAGE_SIZE);
  };

  const handleToggleLiveOnly = (newLive: boolean) => {
    setLiveOnly(newLive);
    setShownCount(DEFAULT_PAGE_SIZE);
  };

  const handleShowMore = () => {
    setShownCount((prev) => prev + DEFAULT_PAGE_SIZE);
  };

  return (
    <div className="w-full bg-transparent text-[#1b1216] dark:text-[#f8ecee]">
      {/* 1. Owl Finder Section */}
      <OwlFinderSection
        onSelectGoalForCatalog={handleSelectGoalForCatalog}
        onGoToSearch={handleGoToSearch}
      />

      {/* 2. Search & Catalog Section */}
      <ExamCatalogSection
        query={query}
        onQueryChange={handleQueryChange}
        selectedGroupIds={selectedGroupIds}
        selectedLabel={selectedLabel}
        onSelectGroup={handleSelectGroup}
        onClearFilterPill={handleClearFilterPill}
        liveOnly={liveOnly}
        onToggleLiveOnly={handleToggleLiveOnly}
        shownCount={shownCount}
        onShowMore={handleShowMore}
        catalogRef={catalogRef}
        searchInputRef={searchInputRef}
      />

      {/* 3. Deliberate Maroon Gradient Closing Section */}
      <ExamsClosingCallout />
    </div>
  );
}
