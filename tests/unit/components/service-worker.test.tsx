// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

describe("ServiceWorkerRegister Component — PWA & Offline Support", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing in browser environment", () => {
    const { container } = render(<ServiceWorkerRegister />);
    expect(container).toBeInTheDocument();
  });

  it("displays offline banner when offline event fires", () => {
    render(<ServiceWorkerRegister />);

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByText("Offline Mode Active")).toBeInTheDocument();
    expect(
      screen.getByText(/You can continue mock tests, drills, and mistake reviews offline/i)
    ).toBeInTheDocument();
  });

  it("displays back online toast when online event fires", () => {
    render(<ServiceWorkerRegister />);

    // First go offline
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    // Then go online
    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.getByText("Back Online")).toBeInTheDocument();
  });

  it("displays install prompt when beforeinstallprompt event is dispatched", () => {
    render(<ServiceWorkerRegister />);

    const beforeInstallEvent = new Event("beforeinstallprompt");
    Object.assign(beforeInstallEvent, {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: "accepted" }),
    });

    act(() => {
      window.dispatchEvent(beforeInstallEvent);
    });

    expect(screen.getByText("Install ReviewTayo App")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Install$/i })).toBeInTheDocument();
  });
});
