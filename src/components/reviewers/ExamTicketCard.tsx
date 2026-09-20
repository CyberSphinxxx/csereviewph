"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Briefcase,
  Shield,
  BookOpen,
  Activity,
  MessageSquare,
  BarChart3,
  Settings,
  Home,
  FlaskConical,
  Scale,
  GraduationCap,
  Award,
} from "lucide-react";
import {
  type DirectoryExam,
  EXAM_GROUPS_BY_ID,
  EXAM_FAMILIES,
} from "@/config/exam-directory";

export interface ExamTicketCardProps {
  exam: DirectoryExam;
  index: number;
  query?: string;
}

/**
 * Maps icon name to Lucide component
 */
function getGroupIcon(iconName: string, className = "w-6 h-6") {
  switch (iconName) {
    case "briefcase":
      return <Briefcase className={className} />;
    case "shield":
      return <Shield className={className} />;
    case "book-open":
      return <BookOpen className={className} />;
    case "activity":
      return <Activity className={className} />;
    case "message-square":
      return <MessageSquare className={className} />;
    case "bar-chart-3":
      return <BarChart3 className={className} />;
    case "settings":
      return <Settings className={className} />;
    case "home":
      return <Home className={className} />;
    case "flask-conical":
      return <FlaskConical className={className} />;
    case "scale":
      return <Scale className={className} />;
    case "graduation-cap":
      return <GraduationCap className={className} />;
    case "award":
      return <Award className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

/**
 * Highlights single query term inside title safely without innerHTML
 */
function HighlightedText({ text, query }: { text: string; query: string }) {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return <span>{text}</span>;

  // Split single word query or first word
  const words = cleanQ.split(/\s+/).filter(Boolean);
  const target = words[0];
  if (!target) return <span>{text}</span>;

  const idx = text.toLowerCase().indexOf(target);
  if (idx < 0) return <span>{text}</span>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + target.length);
  const after = text.slice(idx + target.length);

  return (
    <span>
      {before}
      <mark className="bg-[#f6b93b] text-[#2a0a12] rounded-xs px-1 font-bold">
        {match}
      </mark>
      {after}
    </span>
  );
}

export function ExamTicketCard({ exam, index, query = "" }: ExamTicketCardProps) {
  const grp = EXAM_GROUPS_BY_ID[exam.groupId];
  const familyConfig = EXAM_FAMILIES[exam.family];

  // Font sizing based on code abbreviation length
  const codeLen = exam.code?.length || 0;
  const codeSizeClass =
    codeLen <= 4
      ? "text-3xl sm:text-4xl"
      : codeLen <= 6
        ? "text-2xl sm:text-3xl"
        : "text-lg sm:text-xl";

  return (
    <article
      data-testid="exam-ticket-card"
      className="tk group transition-transform duration-200 hover:-translate-y-0.5 filter drop-shadow-[0_10px_14px_rgba(90,15,35,0.08)] animate-[pop_0.4s_both]"
      style={{ "--i": index % 10 } as React.CSSProperties}
    >
      <div className="tk-in relative bg-white dark:bg-[#2b1620] border border-[#8a1630]/10 dark:border-white/10 rounded-[22px] overflow-hidden grid grid-cols-[88px_1fr] sm:grid-cols-[132px_1fr_auto] items-stretch min-w-0 w-full max-w-full">
        {/* Left Stub */}
        <div
          className={`tk-stub flex flex-col items-center justify-center text-center p-2.5 sm:p-4 min-h-[100px] sm:min-h-[110px] ${familyConfig.bgClass} sm:row-auto row-span-2 select-none min-w-0`}
        >
          {exam.code ? (
            <b
              className={`font-display font-black leading-none tracking-tight block ${codeSizeClass}`}
            >
              {exam.code}
            </b>
          ) : (
            grp && getGroupIcon(grp.iconName, "w-7 h-7 sm:w-9 sm:h-9 stroke-[2]")
          )}
        </div>

        {/* Main Details Body */}
        <div className="tk-main p-3.5 sm:p-5 sm:border-l-2 sm:border-dashed sm:border-[#8a1630]/15 dark:border-white/15 min-w-0 flex flex-col justify-center">
          <h3 className="font-display font-bold text-base sm:text-xl text-[#1b1216] dark:text-[#f8ecee] leading-snug tracking-tight">
            <HighlightedText text={exam.name} query={query} />
          </h3>

          {exam.agency && (
            <p className="text-xs sm:text-sm text-[#5a4a50] dark:text-[#d6bcc3] mt-1 font-medium">
              {exam.agency}
            </p>
          )}

          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {grp && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold ${familyConfig.bgClass}`}
              >
                {grp.name}
              </span>
            )}
            {exam.itemCount && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#f6ecee] dark:bg-[#3a1f29] text-[#5a4a50] dark:text-[#d6bcc3]">
                {exam.itemCount} items
              </span>
            )}
            {exam.duration && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#f6ecee] dark:bg-[#3a1f29] text-[#5a4a50] dark:text-[#d6bcc3]">
                <Clock className="w-3 h-3 text-[#8a1630] dark:text-[#ff9fb5]" />
                {exam.duration}
              </span>
            )}
          </div>

          {exam.note && (
            <p className="text-xs sm:text-sm text-[#272126] dark:text-[#e4ccd2] mt-2 font-normal leading-relaxed">
              {exam.note}
            </p>
          )}
        </div>

        {/* Action Button Column */}
        <div className="tk-act flex items-center justify-start sm:justify-end px-3.5 pb-3.5 sm:p-5 sm:pl-2 col-start-2 sm:col-start-3 min-w-0">
          {exam.live ? (
            <Link
              href={exam.route}
              prefetch={true}
              className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#8a1630] text-white hover:bg-[#a81b3b] shadow-[0_6px_16px_-4px_rgba(138,22,48,0.5)] hover:-translate-y-0.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a1630]"
            >
              <span>Open exam</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#f6ecee] dark:bg-[#3a1f29] text-[#5a4a50] dark:text-[#d6bcc3]">
              <Clock className="w-3.5 h-3.5 text-[#5a4a50] dark:text-[#d6bcc3]" />
              <span>Coming soon</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
