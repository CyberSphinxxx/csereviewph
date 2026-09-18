"use client";

import { useState, useEffect, useCallback } from "react";
import { type ExamWorkspace, RT_WORKSPACE_CHANGED_EVENT } from "./types";
import { WorkspaceService } from "./workspace-service";
import { getExamConfig, type ExamCatalogEntry } from "@/config/exams";

export function useExamWorkspace() {
  const [allWorkspaces, setAllWorkspacesState] = useState<ExamWorkspace[]>([]);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<ExamWorkspace | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshWorkspaces = useCallback(() => {
    const list = WorkspaceService.getAllWorkspaces();
    const current = WorkspaceService.getCurrentWorkspace();
    setAllWorkspacesState(list);
    setCurrentWorkspaceState(current);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refreshWorkspaces();

    const handleWorkspaceChanged = () => {
      refreshWorkspaces();
    };

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith("rt_workspaces") || e.key.startsWith("rt_current_workspace")) {
        refreshWorkspaces();
      }
    };

    window.addEventListener(RT_WORKSPACE_CHANGED_EVENT, handleWorkspaceChanged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(RT_WORKSPACE_CHANGED_EVENT, handleWorkspaceChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshWorkspaces]);

  const switchWorkspace = useCallback((id: string) => {
    const active = WorkspaceService.setCurrentWorkspace(id);
    if (active) {
      setCurrentWorkspaceState(active);
      setAllWorkspacesState(WorkspaceService.getAllWorkspaces());
    }
  }, []);

  const createWorkspace = useCallback(
    (input: Parameters<typeof WorkspaceService.createWorkspace>[0]) => {
      const created = WorkspaceService.createWorkspace(input);
      refreshWorkspaces();
      return created;
    },
    [refreshWorkspaces]
  );

  const updateWorkspace = useCallback(
    (id: string, updates: Partial<ExamWorkspace>) => {
      const updated = WorkspaceService.updateWorkspace(id, updates);
      refreshWorkspaces();
      return updated;
    },
    [refreshWorkspaces]
  );

  const removeWorkspace = useCallback(
    (id: string) => {
      const result = WorkspaceService.removeWorkspace(id);
      refreshWorkspaces();
      return result;
    },
    [refreshWorkspaces]
  );

  const currentExamConfig: ExamCatalogEntry | undefined = currentWorkspace
    ? getExamConfig(currentWorkspace.examId)
    : undefined;

  return {
    isLoaded,
    currentWorkspace,
    allWorkspaces,
    isMultiExam: allWorkspaces.length > 1,
    currentExamConfig,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    removeWorkspace,
    refreshWorkspaces,
  };
}
