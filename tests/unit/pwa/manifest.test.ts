import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";

describe("PWA Web App Manifest (/manifest.webmanifest)", () => {
  it("generates valid PWA manifest with standalone display and Philippine CSE metadata", () => {
    const data = manifest();

    expect(data.name).toContain("ReviewTayo");
    expect(data.short_name).toBe("ReviewTayo");
    expect(data.display).toBe("standalone");
    expect(data.theme_color).toBe("#86152D");
    expect(data.background_color).toBe("#FAF8F7");

    expect(data.icons).toBeDefined();
    expect(data.icons?.length).toBeGreaterThanOrEqual(3);

    const icon192 = data.icons?.find((i) => i.sizes === "192x192");
    expect(icon192?.src).toBe("/icon-192.png");

    const icon512 = data.icons?.find((i) => i.sizes === "512x512");
    expect(icon512?.src).toBe("/icon-512.png");
  });
});
