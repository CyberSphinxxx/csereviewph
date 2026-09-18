"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { useExamWorkspace } from "@/lib/workspace/useExamWorkspace";
import { getExamConfig } from "@/config/exams";
import {
  X,
  CheckCircle2,
  Calendar,
  Layers,
  Trash2,
  Edit2,
  Plus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface MyExamsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyExamsDialog({ isOpen, onClose }: MyExamsDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const {
    allWorkspaces,
    currentWorkspace,
    switchWorkspace,
    updateWorkspace,
    removeWorkspace,
  } = useExamWorkspace();

  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editTrack, setEditTrack] = useState<string>("");
  const [editTargetDate, setEditTargetDate] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (confirmDeleteId) {
          setConfirmDeleteId(null);
        } else if (editingWorkspaceId) {
          setEditingWorkspaceId(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, confirmDeleteId, editingWorkspaceId]);

  if (!isOpen || !mounted) return null;

  const handleSwitch = (id: string) => {
    switchWorkspace(id);
    onClose();
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
  };

  const handleStartEdit = (id: string, currentTrack?: string, currentDate?: string) => {
    setEditingWorkspaceId(id);
    setEditTrack(currentTrack || "");
    setEditTargetDate(currentDate || "");
  };

  const handleSaveEdit = (id: string, examId: string) => {
    const exam = getExamConfig(examId);
    const selectedLevel = exam?.levels?.find((lvl) => lvl.id === editTrack || lvl.shortName === editTrack);
    const trackName = selectedLevel?.shortName || selectedLevel?.name || editTrack;

    updateWorkspace(id, {
      levelId: selectedLevel?.id || editTrack,
      trackName,
      targetExamDate: editTargetDate,
    });
    setEditingWorkspaceId(null);
  };

  const handleRemove = (id: string) => {
    removeWorkspace(id);
    setConfirmDeleteId(null);
    if (allWorkspaces.length <= 1) {
      onClose();
      router.push("/dashboard");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-exams-title"
        className="bg-white dark:bg-[#1E191C] border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh] my-auto relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-700 dark:text-brand-400" />
            <h2 id="my-exams-title" className="text-lg font-extrabold text-slate-900 dark:text-white">
              My Exam Workspaces
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {allWorkspaces.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You do not have any active exam workspaces yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/reviewers");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-brand-700 hover:bg-brand-800 text-white transition"
              >
                <Plus className="w-4 h-4" />
                <span>Explore Exam Reviewers</span>
              </button>
            </div>
          ) : (
            allWorkspaces.map((ws) => {
              const exam = getExamConfig(ws.examId);
              const isCurrent = currentWorkspace?.id === ws.id;
              const isEditing = editingWorkspaceId === ws.id;

              return (
                <div
                  key={ws.id}
                  className={`p-4 rounded-xl border transition ${
                    isCurrent
                      ? "border-brand-300 dark:border-brand-700/80 bg-brand-50/40 dark:bg-brand-950/20 shadow-2xs"
                      : "border-border bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {exam?.fullName || ws.examId.toUpperCase()}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-800 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/60 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Current
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Track: <strong className="text-slate-800 dark:text-slate-200">{ws.trackName || "Standard"}</strong></span>
                        {ws.targetExamDate && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>Target: {ws.targetExamDate}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(ws.id, ws.levelId || ws.trackName, ws.targetExamDate)}
                          title="Edit track or target date"
                          aria-label={`Edit ${exam?.shortName || ws.examId} workspace settings`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(ws.id)}
                        title="Remove workspace"
                        aria-label={`Remove ${exam?.shortName || ws.examId} workspace`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editing inline form */}
                  {isEditing && (
                    <div className="mt-3 pt-3 border-t border-border/80 space-y-3 animate-fade-in text-xs">
                      {exam?.levels && exam.levels.length > 1 && (
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Choose track / level:
                          </label>
                          <select
                            value={editTrack}
                            onChange={(e) => setEditTrack(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                          >
                            {exam.levels.map((lvl) => (
                              <option key={lvl.id} value={lvl.id}>
                                {lvl.name} ({lvl.shortName})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Target exam date:
                        </label>
                        <input
                          type="date"
                          value={editTargetDate}
                          onChange={(e) => setEditTargetDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingWorkspaceId(null)}
                          className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(ws.id, ws.examId)}
                          className="px-3 py-1.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold transition"
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmation for removal */}
                  {confirmDeleteId === ws.id && (
                    <div
                      role="alert"
                      className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-900 dark:text-red-200 space-y-2 animate-fade-in"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>
                          Are you sure you want to remove this exam workspace? Your local test history for this exam will be deleted.
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(ws.id)}
                          className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold transition"
                        >
                          Confirm Remove
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Switch to workspace action */}
                  {!isCurrent && !isEditing && confirmDeleteId !== ws.id && (
                    <div className="mt-3 pt-2.5 border-t border-border/60 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSwitch(ws.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition"
                      >
                        <span>Switch to this exam</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border/80 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push("/reviewers");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 hover:underline"
          >
            <Plus className="w-4 h-4" />
            <span>Add another examination</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-border hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
