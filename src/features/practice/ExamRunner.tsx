"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  type EngineQuestion,
  type ExamRuleConfig,
  type ExamSessionState,
  createExamSession,
  selectChoice,
  toggleFlag,
  navigateNext,
  navigatePrev,
  jumpToQuestion,
  stepTimer,
  getExamSessionSummary,
  formatTimeRemaining,
  calculateScore,
} from "@/features/exam-engine";
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  LayoutGrid,
  X,
  Edit3,
  EyeOff,
  Eye,
  CheckCircle2,
  BookOpen,
  Check,
  Sliders,
} from "lucide-react";

import {
  LocalStorageService,
  type ActiveExamSessionDraft,
  type StoredUserAnswer,
  type StoredAttemptDetails,
} from "@/lib/storage";
import { triggerHaptic } from "@/lib/haptics";
import { useExamKeyboardShortcuts } from "./hooks/useExamKeyboardShortcuts";
import { ExamScratchpad } from "./ExamScratchpad";
import { QuestionReportModal } from "./QuestionReportModal";
import { TestModeBar } from "./TestModeBar";

interface ExamRunnerProps {
  initialQuestions: EngineQuestion[];
  rules: ExamRuleConfig;
  title: string;
  subtitle?: string;
  onComplete?: (attemptId: string) => void;
}

export function ExamRunner({
  initialQuestions,
  rules,
  title,
}: ExamRunnerProps) {
  const router = useRouter();
  const levelSlug = title.toLowerCase().includes("subprof") ? "subprofessional" : "professional";
  const topicId =
    initialQuestions[0]?.topicId && rules.mode === "practice"
      ? initialQuestions[0].topicId
      : undefined;

  const [savedDraft, setSavedDraft] = useState<ActiveExamSessionDraft | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const startedAtRef = useRef<string>(new Date().toISOString());

  // Initialize session state
  const [session, setSession] = useState<ExamSessionState>(() =>
    createExamSession(initialQuestions, rules.timeLimitMinutes, rules.allowsFlagging)
  );

  // Testing UX & Accessibility States
  const [eliminatedChoices, setEliminatedChoices] = useState<Record<string, string[]>>({});
  const [practiceFeedbackMode] = useState<"instant" | "simulated">("instant");
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadNotes, setScratchpadNotes] = useState("");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xl">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showDisplayMenu, setShowDisplayMenu] = useState(false);
  const displayMenuRef = useRef<HTMLDivElement>(null);

  // Check for existing active draft on mount
  useEffect(() => {
    const draft = LocalStorageService.getActiveDraft(levelSlug, rules.mode, topicId);
    if (
      draft &&
      draft.questions.length === initialQuestions.length &&
      Object.keys(draft.answers).length > 0
    ) {
      setSavedDraft(draft);
      setShowResumeBanner(true);
    }
  }, [levelSlug, rules.mode, topicId, initialQuestions.length]);

  // Click outside to dismiss Display menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (displayMenuRef.current && !displayMenuRef.current.contains(event.target as Node)) {
        setShowDisplayMenu(false);
      }
    }
    if (showDisplayMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDisplayMenu]);

  const handleResumeDraft = () => {
    if (!savedDraft) return;
    const restoredAnswers = new Map();
    for (const [qId, a] of Object.entries(savedDraft.answers)) {
      restoredAnswers.set(qId, {
        questionId: a.questionId,
        selectedChoiceId: a.selectedChoiceId,
        isFlagged: Boolean(a.isFlagged),
        timeSpentSeconds: a.timeSpentSeconds || 0,
      });
    }
    setSession({
      totalQuestions: savedDraft.questions.length,
      currentIndex: Math.min(savedDraft.currentQuestionIndex, savedDraft.questions.length - 1),
      answers: restoredAnswers,
      timer: {
        totalSeconds: savedDraft.rules.timeLimitMinutes * 60,
        remainingSeconds: savedDraft.remainingSeconds,
        isExpired: savedDraft.remainingSeconds <= 0,
        isWarning: savedDraft.remainingSeconds <= 300,
      },
      isReviewing: false,
      isSubmitted: false,
      allowsFlagging: savedDraft.rules.allowsFlagging,
    });
    startedAtRef.current = savedDraft.startedAt;
    setShowResumeBanner(false);
  };

  const handleDiscardDraft = () => {
    LocalStorageService.clearActiveDraft(levelSlug, rules.mode, topicId);
    setShowResumeBanner(false);
    setSavedDraft(null);
  };

  // Allow testExpirySeconds query param for automated e2e testing of timeout auto-submit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const testExpiry = params.get("testExpirySeconds");
      if (testExpiry) {
        const secs = parseInt(testExpiry, 10);
        if (!isNaN(secs) && secs > 0) {
          setSession((prev) => ({
            ...prev,
            timer: {
              totalSeconds: secs,
              remainingSeconds: secs,
              isExpired: false,
              isWarning: false,
            },
          }));
        }
      }
    }
  }, []);

  const [showNavigator, setShowNavigator] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const currentQuestion = initialQuestions[session.currentIndex] || initialQuestions[0];
  const currentAnswer = session.answers.get(currentQuestion?.id);
  const summary = getExamSessionSummary(session);

  // Auto-save active draft to LocalStorageService
  useEffect(() => {
    if (isSubmittingRef.current || session.timer.isExpired) return;

    // Only auto-save if at least one question has been answered
    if (session.answers.size > 0) {
      const answersObj: Record<string, StoredUserAnswer> = {};
      const flaggedIds: string[] = [];

      session.answers.forEach((ans, qId) => {
        answersObj[qId] = {
          questionId: ans.questionId,
          selectedChoiceId: ans.selectedChoiceId ?? undefined,
          isFlagged: Boolean(ans.isFlagged),
          timeSpentSeconds: ans.timeSpentSeconds || 0,
        };
        if (ans.isFlagged) {
          flaggedIds.push(qId);
        }
      });

      LocalStorageService.saveActiveDraft({
        id: `draft-${levelSlug}-${rules.mode}${topicId ? `-${topicId}` : ""}`,
        levelSlug,
        mode: rules.mode,
        title,
        rules,
        questions: initialQuestions,
        answers: answersObj,
        flaggedQuestionIds: flaggedIds,
        currentQuestionIndex: session.currentIndex,
        remainingSeconds: session.timer.remainingSeconds,
        startedAt: startedAtRef.current,
        lastSavedAt: new Date().toISOString(),
      });
    }
  }, [session, levelSlug, rules, topicId, title, initialQuestions]);


  const handleSaveAndExit = () => {
    if (session.answers.size > 0) {
      const answersObj: Record<string, StoredUserAnswer> = {};
      const flaggedIds: string[] = [];

      session.answers.forEach((ans, qId) => {
        answersObj[qId] = {
          questionId: ans.questionId,
          selectedChoiceId: ans.selectedChoiceId ?? undefined,
          isFlagged: Boolean(ans.isFlagged),
          timeSpentSeconds: ans.timeSpentSeconds || 0,
        };
        if (ans.isFlagged) {
          flaggedIds.push(qId);
        }
      });

      LocalStorageService.saveActiveDraft({
        id: `draft-${levelSlug}-${rules.mode}${topicId ? `-${topicId}` : ""}`,
        levelSlug,
        mode: rules.mode,
        title,
        rules,
        questions: initialQuestions,
        answers: answersObj,
        flaggedQuestionIds: flaggedIds,
        currentQuestionIndex: session.currentIndex,
        remainingSeconds: session.timer.remainingSeconds,
        startedAt: startedAtRef.current,
        lastSavedAt: new Date().toISOString(),
      });
    } else {
      // If 0 answers were submitted, ensure no empty draft lingers
      LocalStorageService.clearActiveDraft(levelSlug, rules.mode, topicId);
    }
    setShowExitModal(false);
    router.push("/practice");
  };

  const handleDiscardAndExit = () => {
    LocalStorageService.clearActiveDraft(levelSlug, rules.mode, topicId);
    setShowExitModal(false);
    router.push(rules.mode === "quick" ? "/" : "/practice");
  };

  // Submit test and persist results
  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    triggerHaptic(20);

    const activeSession = sessionRef.current;
    const timeSpentTotal = activeSession.timer.totalSeconds - activeSession.timer.remainingSeconds;

    const engineAnswersList = initialQuestions.map((q) => {
      const ans = activeSession.answers.get(q.id);
      return {
        questionId: q.id,
        selectedChoiceId: ans?.selectedChoiceId || null,
        isFlagged: ans?.isFlagged || false,
        timeSpentSeconds: ans?.timeSpentSeconds || 0,
      };
    });

    const userAnswersList: StoredUserAnswer[] = initialQuestions.map((q) => {
      const ans = activeSession.answers.get(q.id);
      return {
        questionId: q.id,
        selectedChoiceId: ans?.selectedChoiceId || undefined,
        isFlagged: ans?.isFlagged || false,
        timeSpentSeconds: ans?.timeSpentSeconds || 0,
      };
    });

    const scoreResult = calculateScore(
      initialQuestions,
      engineAnswersList,
      rules.passingScorePercentage,
      timeSpentTotal
    );

    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const attemptData: StoredAttemptDetails = {
      id: attemptId,
      title,
      mode: rules.mode,
      rules,
      questions: initialQuestions,
      answers: userAnswersList,
      scoreResult,
      completedAt: new Date().toISOString(),
    };

    try {
      LocalStorageService.recordCompletedAttempt(attemptData);
      LocalStorageService.clearActiveDraft(levelSlug, rules.mode, topicId);
    } catch {
      // Graceful localstorage failure handling
    }

    router.push(`/results/${attemptId}`);
  }, [initialQuestions, levelSlug, rules, title, topicId, router]);

  // Continuous Single Timer step
  useEffect(() => {
    if (session.timer.isExpired) return;

    let lastTick = performance.now();
    const timerInterval = setInterval(() => {
      const now = performance.now();
      const elapsedSeconds = Math.floor((now - lastTick) / 1000);

      if (elapsedSeconds >= 1) {
        lastTick = now;
        setSession((prev) => {
          if (prev.timer.isExpired) return prev;
          return stepTimer(prev, elapsedSeconds);
        });
      }
    }, 1000);

    const handleVisibilityChange = () => {
      if (!document.hidden && !sessionRef.current.timer.isExpired) {
        const now = performance.now();
        const elapsed = Math.floor((now - lastTick) / 1000);
        if (elapsed >= 1) {
          lastTick = now;
          setSession((prev) => stepTimer(prev, elapsed));
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timerInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session.timer.isExpired]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (session.timer.isExpired && !isSubmittingRef.current) {
      handleSubmit();
    }
  }, [session.timer.isExpired, handleSubmit]);

  // Choice elimination toggle handler
  const handleToggleEliminate = (choiceId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    triggerHaptic(15);
    const qId = currentQuestion.id;
    setEliminatedChoices((prev) => {
      const currentList = prev[qId] || [];
      const isAlreadyEliminated = currentList.includes(choiceId);
      const updatedList = isAlreadyEliminated
        ? currentList.filter((id) => id !== choiceId)
        : [...currentList, choiceId];

      if (!isAlreadyEliminated && currentAnswer?.selectedChoiceId === choiceId) {
        setSession((prevSession) => selectChoice(prevSession, qId, ""));
      }

      return {
        ...prev,
        [qId]: updatedList,
      };
    });
  };

  // Keyboard Shortcuts Hook integration
  useExamKeyboardShortcuts({
    onSelectChoice: (index) => {
      if (!currentQuestion?.choices[index]) return;
      const targetChoice = currentQuestion.choices[index];
      const isElim = (eliminatedChoices[currentQuestion.id] || []).includes(targetChoice.id);
      if (isElim) return;

      triggerHaptic(12);
      setSession((prev) => selectChoice(prev, currentQuestion.id, targetChoice.id));
    },
    onNext: () => {
      triggerHaptic(10);
      if (session.currentIndex === session.totalQuestions - 1) {
        setShowReviewModal(true);
      } else {
        setSession((prev) => navigateNext(prev));
      }
    },
    onPrev: () => {
      triggerHaptic(10);
      setSession((prev) => navigatePrev(prev));
    },
    onToggleFlag: () => {
      if (rules.allowsFlagging) {
        triggerHaptic(12);
        setSession((prev) => toggleFlag(prev, currentQuestion.id));
      }
    },
    onToggleNavigator: () => {
      setShowNavigator((prev) => !prev);
    },
    onToggleScratchpad: () => {
      setShowScratchpad((prev) => !prev);
    },
    onCloseModal: () => {
      setShowNavigator(false);
      setShowReviewModal(false);
      setShowScratchpad(false);
      setShowExitModal(false);
      setShowDisplayMenu(false);
    },
    isModalOpen:
      showNavigator ||
      showReviewModal ||
      showScratchpad ||
      showExitModal ||
      showDisplayMenu,
  });

  const questionFontSizeClass = {
    normal: "text-lg sm:text-xl",
    large: "text-xl sm:text-2xl",
    xl: "text-2xl sm:text-3xl",
  }[fontSize];

  const choiceFontSizeClass = {
    normal: "text-base",
    large: "text-lg",
    xl: "text-xl",
  }[fontSize];

  const isMathOrAnalytical =
    currentQuestion?.subjectSlug === "numerical-ability" ||
    currentQuestion?.subjectSlug === "analytical-ability" ||
    currentQuestion?.subjectName?.toLowerCase().includes("numerical") ||
    currentQuestion?.subjectName?.toLowerCase().includes("analytical");

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${
        highContrast ? "bg-slate-200" : "bg-slate-100"
      } ${reduceMotion ? "[&_*]:!transition-none [&_*]:!animation-none" : ""}`}
    >
      {/* Top Focused Minimal Test Mode Header */}
      <TestModeBar
        examName={title || "Civil Service Exam (CSE)"}
        levelName={levelSlug === "subprofessional" ? "Subprofessional" : "Professional"}
        currentIndex={session.currentIndex}
        totalQuestions={session.totalQuestions}
        remainingSeconds={session.timer.remainingSeconds}
        isWarning={session.timer.isWarning}
        hasAnswers={summary.answered > 0}
        onExit={() => {
          if (summary.answered > 0) {
            handleSaveAndExit();
          } else {
            handleDiscardAndExit();
          }
        }}
      />

      {/* Resume Session Banner */}
      {showResumeBanner && savedDraft && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-900 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Unfinished Session Found:</strong> You have an in-progress test with{" "}
                <span className="font-semibold text-amber-950">
                  {Object.keys(savedDraft.answers).length} answered
                </span>{" "}
                and{" "}
                <span className="font-semibold text-amber-950">
                  {formatTimeRemaining(savedDraft.remainingSeconds)} remaining
                </span>
                .
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleResumeDraft}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition shadow-xs"
              >
                Resume Session
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-medium transition"
              >
                Discard &amp; Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Exam Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dominant Question Column */}
          <div className="lg:col-span-8 space-y-6">
            {currentQuestion && (
              <div
                className={`rounded-2xl shadow-xs p-5 sm:p-7 md:p-8 transition-all ${
                  highContrast ? "bg-white border-2 border-slate-900" : "bg-white border border-slate-200/90"
                }`}
              >
                {/* Question Subtest & Utility Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 font-bold text-xs tracking-wide">
                      {currentQuestion.subjectName}
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-500 font-medium">{currentQuestion.topicName}</span>
                    {currentQuestion.language === "fil" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        FILIPINO
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                      Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-600 border text-[10px]">A-E</kbd> to answer, <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-600 border text-[10px]">F</kbd> to flag
                    </span>

                    {rules.allowsFlagging && (
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(12);
                          setSession((prev) => toggleFlag(prev, currentQuestion.id));
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          currentAnswer?.isFlagged
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        id="flag-question-button"
                      >
                        <Flag className={`w-3.5 h-3.5 ${currentAnswer?.isFlagged ? "fill-amber-600 text-amber-600" : ""}`} />
                        <span>{currentAnswer?.isFlagged ? "Flagged" : "Flag"}</span>
                      </button>
                    )}

                    {/* Virtual Scratchpad for calculations */}
                    <button
                      type="button"
                      onClick={() => setShowScratchpad(true)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        isMathOrAnalytical
                          ? "bg-brand-50 text-brand-900 border border-brand-300"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                      title="Open Virtual Scratchpad (Press S)"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>Scratchpad</span>
                    </button>

                    {/* Question Map / Palette Drawer Trigger */}
                    <button
                      type="button"
                      onClick={() => setShowNavigator(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
                      aria-label="Open Question Map / Palette"
                      title="Open Question Map / Palette"
                    >
                      <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Map</span>
                    </button>

                    {/* Display Menu Trigger */}
                    <div className="relative" ref={displayMenuRef}>
                      <button
                        type="button"
                        onClick={() => setShowDisplayMenu((prev) => !prev)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
                        aria-label="Display accessibility settings"
                        aria-expanded={showDisplayMenu}
                      >
                        <Sliders className="w-3.5 h-3.5 text-slate-600" />
                        <span className="hidden sm:inline">Display</span>
                      </button>

                      {showDisplayMenu && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 space-y-3 text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block mb-1.5">Font Size</span>
                            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                              <button
                                type="button"
                                onClick={() => setFontSize("normal")}
                                className={`py-1 rounded-lg font-semibold transition ${
                                  fontSize === "normal"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                Normal
                              </button>
                              <button
                                type="button"
                                onClick={() => setFontSize("large")}
                                className={`py-1 rounded-lg font-semibold transition ${
                                  fontSize === "large"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                Large
                              </button>
                              <button
                                type="button"
                                onClick={() => setFontSize("xl")}
                                className={`py-1 rounded-lg font-semibold transition ${
                                  fontSize === "xl"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                X-Large
                              </button>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-800 block">High Contrast</span>
                              <span className="text-[10px] text-slate-500">Sharper borders &amp; text</span>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={highContrast}
                              aria-label="Toggle high contrast"
                              onClick={() => setHighContrast((prev) => !prev)}
                              className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                                highContrast ? "bg-slate-900 justify-end" : "bg-slate-200 justify-start"
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                            </button>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-800 block">Reduce Motion</span>
                              <span className="text-[10px] text-slate-500">Minimize animations</span>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={reduceMotion}
                              aria-label="Toggle reduce motion"
                              onClick={() => setReduceMotion((prev) => !prev)}
                              className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                                reduceMotion ? "bg-slate-900 justify-end" : "bg-slate-200 justify-start"
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReportModal(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition"
                      id="report-question-btn"
                      title="Report an error or issue with this question"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Report</span>
                    </button>
                  </div>
                </div>

                {/* Progress Hierarchy */}
                <div className="mt-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Question {session.currentIndex + 1} of {session.totalQuestions}
                    </h2>
                    <div className="text-xs font-medium text-slate-500">
                      Progress: <span className="font-semibold text-slate-800">{summary.answered} answered</span> &bull;{" "}
                      <span className="font-semibold text-slate-800">{summary.flagged} flagged</span> &bull;{" "}
                      <span className="font-semibold text-slate-800">{summary.unanswered} remaining</span>
                    </div>
                  </div>
                  {/* Inline Mini Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-900 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${summary.total > 0 ? Math.round((summary.answered / summary.total) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div
                  className={`mt-4 font-medium leading-relaxed whitespace-pre-line ${questionFontSizeClass} ${
                    highContrast ? "text-black font-semibold" : "text-slate-900"
                  }`}
                >
                  {currentQuestion.questionText}
                </div>

                {/* Choices (Clean rows, hover-revealed eliminate button) */}
                <div className="mt-6 space-y-3">
                  {currentQuestion.choices.map((choice) => {
                    const isSelected = currentAnswer?.selectedChoiceId === choice.id;
                    const isEliminated = (eliminatedChoices[currentQuestion.id] || []).includes(choice.id);

                    // Practice Instant Feedback calculation
                    const isPracticeInstant =
                      rules.mode === "practice" &&
                      practiceFeedbackMode === "instant" &&
                      Boolean(currentAnswer?.selectedChoiceId);
                    const isCorrectChoice = choice.isCorrect;
                    const isSelectedAndWrong = isSelected && !isCorrectChoice;

                    let choiceCardClasses = "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70";
                    let choiceBadgeClasses = "bg-slate-100 text-slate-700 group-hover:bg-slate-200";

                    if (isPracticeInstant) {
                      if (isCorrectChoice) {
                        choiceCardClasses = "border-emerald-500 bg-emerald-50/70 shadow-xs";
                        choiceBadgeClasses = "bg-emerald-600 text-white";
                      } else if (isSelectedAndWrong) {
                        choiceCardClasses = "border-rose-400 bg-rose-50/70 shadow-xs";
                        choiceBadgeClasses = "bg-rose-600 text-white";
                      }
                    } else if (isSelected) {
                      choiceCardClasses = "border-brand-700 dark:border-brand-400 bg-highlight dark:bg-brand-950/40 ring-1 ring-brand-700 dark:ring-brand-400 shadow-xs";
                      choiceBadgeClasses = "bg-brand-700 dark:bg-brand-600 text-white";
                    }

                    if (isEliminated) {
                      choiceCardClasses = "border-dashed border-slate-200 bg-slate-50/80 opacity-60";
                      choiceBadgeClasses = "bg-slate-200 text-slate-400";
                    }

                    if (highContrast && !isEliminated) {
                      choiceCardClasses += " border-2 border-slate-800 text-black";
                    }

                    return (
                      <div
                        key={choice.id}
                        data-testid={`choice-card-${choice.choiceLabel}`}
                        onContextMenu={(e) => handleToggleEliminate(choice.id, e)}
                        className={`group relative w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${choiceCardClasses}`}
                      >
                        <button
                          type="button"
                          data-testid={`choice-option-${choice.choiceLabel}`}
                          disabled={isEliminated}
                          onClick={() => {
                            if (isEliminated) return;
                            triggerHaptic(12);
                            setSession((prev) => selectChoice(prev, currentQuestion.id, choice.id));
                          }}
                          className="flex-1 flex items-start sm:items-center gap-3 sm:gap-4 text-left disabled:cursor-not-allowed"
                        >
                          <span
                            className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${choiceBadgeClasses}`}
                          >
                            {choice.choiceLabel}
                          </span>
                          <span
                            className={`flex-1 ${choiceFontSizeClass} leading-snug ${
                              isEliminated
                                ? "line-through text-slate-400 italic"
                                : highContrast
                                ? "text-black font-semibold"
                                : "text-slate-800"
                            }`}
                          >
                            {choice.text}
                          </span>
                          {isSelected && (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-700 dark:bg-brand-600 text-white text-[11px] font-semibold">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Selected</span>
                            </span>
                          )}
                        </button>

                        {/* Strikethrough / Choice Eliminator Tool: Subtle on hover/focus, visible when eliminated */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleEliminate(choice.id, e)}
                          className={`p-1.5 rounded-lg border transition shrink-0 ${
                            isEliminated
                              ? "opacity-100 bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300"
                              : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 bg-white border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                          title={isEliminated ? `Restore Option ${choice.choiceLabel}` : `Cross-out Option ${choice.choiceLabel}`}
                          aria-label={isEliminated ? `Restore Option ${choice.choiceLabel}` : `Cross-out Option ${choice.choiceLabel}`}
                        >
                          {isEliminated ? <Eye className="w-4 h-4 text-brand-700" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Instant Rationale Panel for Practice Mode */}
                {rules.mode === "practice" &&
                  practiceFeedbackMode === "instant" &&
                  Boolean(currentAnswer?.selectedChoiceId) && (
                    <div
                      className={`mt-6 p-5 rounded-xl border animate-fade-in ${
                        currentQuestion.choices.find((c) => c.id === currentAnswer?.selectedChoiceId)?.isCorrect
                          ? "bg-emerald-50/70 border-emerald-200"
                          : "bg-rose-50/70 border-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm mb-2">
                        {currentQuestion.choices.find((c) => c.id === currentAnswer?.selectedChoiceId)?.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-800">
                              Correct! Option {currentQuestion.choices.find((c) => c.isCorrect)?.choiceLabel} is right.
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            <span className="text-rose-800">
                              Incorrect. The correct answer is Option {currentQuestion.choices.find((c) => c.isCorrect)?.choiceLabel}.
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                        <span>Educational Concept &amp; Rationale</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}

                {/* Bottom Navigation Controls */}
                <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      setSession((prev) => navigatePrev(prev));
                    }}
                    disabled={session.currentIndex === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-sm text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    id="prev-question-btn"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      if (session.currentIndex === session.totalQuestions - 1) {
                        setShowReviewModal(true);
                      } else {
                        setSession((prev) => navigateNext(prev));
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs transition active:scale-95"
                    id="next-question-btn"
                  >
                    <span>{session.currentIndex === session.totalQuestions - 1 ? "Review & Submit" : "Next"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Persistent Question Map */}
          <aside className="hidden lg:block lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs sticky top-20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-slate-600" />
                <span>Question Map</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            </div>

            {/* Compact Legend: ● Answered ○ Unanswered ◇ Flagged */}
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-brand-700" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-white border border-slate-300" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rotate-45 border border-amber-500 bg-amber-200" />
                <span>Flagged</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-[55vh] overflow-y-auto p-1">
              {initialQuestions.map((q, idx) => {
                const ans = session.answers.get(q.id);
                const isAnswered = Boolean(ans?.selectedChoiceId);
                const isFlagged = Boolean(ans?.isFlagged);
                const isCurrent = idx === session.currentIndex;

                let btnClasses = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
                if (isAnswered) {
                  btnClasses = "bg-brand-700 border-brand-700 text-white font-bold";
                }
                if (isFlagged) {
                  btnClasses = "bg-amber-50 border-amber-400 text-amber-900 font-bold";
                }
                if (isCurrent) {
                  btnClasses += " ring-2 ring-brand-700 ring-offset-1";
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      setSession((prev) => jumpToQuestion(prev, idx));
                    }}
                    className={`relative h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition ${btnClasses}`}
                  >
                    {idx + 1}
                    {isFlagged && isAnswered && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </main>

      {/* Save & Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Leave this test?</h3>
            <p className="text-sm text-slate-600 mb-6">
              {summary.answered > 0
                ? "Your progress is saved and you can resume this test later."
                : "You have not answered any questions yet."}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                Keep Practicing
              </button>
              <button
                type="button"
                onClick={summary.answered > 0 ? handleSaveAndExit : handleDiscardAndExit}
                className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-sm transition"
              >
                {summary.answered > 0 ? "Save & Leave" : "Leave Test"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Virtual Scratchpad Component */}
      <ExamScratchpad
        isOpen={showScratchpad}
        onClose={() => setShowScratchpad(false)}
        notes={scratchpadNotes}
        onNotesChange={setScratchpadNotes}
      />

      {/* Question Map Modal / Drawer */}
      {showNavigator && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-slate-900" />
                  <span>Question Map</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNavigator(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                  aria-label="Close question map"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Legend */}
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 my-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-brand-700" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-white border border-slate-300" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rotate-45 border border-amber-500 bg-amber-200" />
                  <span>Flagged</span>
                </div>
              </div>

              {/* Question Number Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto p-1">
                {initialQuestions.map((q, idx) => {
                  const ans = session.answers.get(q.id);
                  const isAnswered = Boolean(ans?.selectedChoiceId);
                  const isFlagged = Boolean(ans?.isFlagged);
                  const isCurrent = idx === session.currentIndex;

                  let btnClasses = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
                  if (isAnswered) {
                    btnClasses = "bg-brand-700 border-brand-700 text-white font-bold";
                  }
                  if (isFlagged) {
                    btnClasses = "bg-amber-50 border-amber-400 text-amber-900 font-bold";
                  }
                  if (isCurrent) {
                    btnClasses += " ring-2 ring-brand-700 ring-offset-2";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(10);
                        setSession((prev) => jumpToQuestion(prev, idx));
                        setShowNavigator(false);
                      }}
                      className={`relative h-11 rounded-xl border text-sm font-semibold flex items-center justify-center transition ${btnClasses}`}
                    >
                      {idx + 1}
                      {isFlagged && isAnswered && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowNavigator(false)}
                className="w-full py-2.5 rounded-xl border border-slate-300 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Prior to Submission */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">Review Before Submission</h3>
            <p className="text-xs text-slate-500 mb-6">
              Ensure you have addressed all questions and flagged items before submitting your final answers.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-2xl font-black text-slate-900">
                  {summary.answered} of {summary.total}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Answered</div>
              </div>
              <div
                className={`p-3.5 rounded-xl border text-center ${
                  summary.unanswered > 0 ? "bg-rose-50/70 border-rose-200" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className={`text-2xl font-black ${summary.unanswered > 0 ? "text-rose-600" : "text-slate-400"}`}>
                  {summary.unanswered}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Unanswered</div>
              </div>
              <div
                className={`p-3.5 rounded-xl border text-center ${
                  summary.flagged > 0 ? "bg-amber-50/70 border-amber-200" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className={`text-2xl font-black ${summary.flagged > 0 ? "text-amber-600" : "text-slate-400"}`}>
                  {summary.flagged}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Flagged</div>
              </div>
            </div>

            {summary.unanswered > 0 && (
              <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  You have <strong>{summary.unanswered} unanswered</strong> question(s). Unanswered questions are scored as incorrect.
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 text-sm transition"
              >
                Return to Questions
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 font-bold text-white text-sm shadow-md transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
                id="confirm-submit-btn"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Calculating Results..." : "Submit Test"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Error / Typo Reporting Modal */}
      {currentQuestion && (
        <QuestionReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          questionId={currentQuestion.id}
          questionText={currentQuestion.questionText}
        />
      )}
    </div>
  );
}
