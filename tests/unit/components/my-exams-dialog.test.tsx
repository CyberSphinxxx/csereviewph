import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MyExamsDialog } from "@/components/workspace/MyExamsDialog";
import { LocalStorageService } from "@/lib/storage";
import { WorkspaceService } from "@/lib/workspace/workspace-service";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("MyExamsDialog Component", () => {
  beforeEach(() => {
    mockPush.mockClear();
    LocalStorageService.clearAllGuestData();
  });

  it("renders when open with dialog title and workspace list", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });

    render(<MyExamsDialog isOpen={true} onClose={vi.fn()} />);

    // Title and active workspace details
    expect(screen.getByText("My Exam Workspaces")).toBeInTheDocument();
    expect(screen.getByText(/Civil Service Exam \(CSE\)/i)).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
  });

  it("calls onClose when Close button or Done button is clicked", () => {
    WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    const onClose = vi.fn();

    render(<MyExamsDialog isOpen={true} onClose={onClose} />);

    // Click Close 'X' button
    const closeBtn = screen.getByRole("button", { name: "Close dialog" });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Click Done button
    const doneBtn = screen.getByRole("button", { name: "Done" });
    fireEvent.click(doneBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("allows switching between multiple workspaces", () => {
    const cseWs = WorkspaceService.createWorkspace({ examId: "cse", levelId: "professional" });
    const letWs = WorkspaceService.createWorkspace({ examId: "let", levelId: "secondary" });
    WorkspaceService.setCurrentWorkspace(cseWs.id);

    const onClose = vi.fn();
    render(<MyExamsDialog isOpen={true} onClose={onClose} />);

    expect(screen.getByText("Switch to this exam")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Switch to this exam"));

    expect(WorkspaceService.getCurrentWorkspace()?.id).toBe(letWs.id);
    expect(onClose).toHaveBeenCalled();
  });
});
