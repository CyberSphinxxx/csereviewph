import { describe, it, expect } from "vitest";
import robots from "@/app/robots";

describe("robots.ts — Search Engine & AdSense Crawler Configuration", () => {
  it("returns a valid Robots object with sitemap and rules", () => {
    const config = robots();

    expect(config).toBeDefined();
    expect(config.sitemap).toMatch(/\/sitemap\.xml$/);
    expect(Array.isArray(config.rules)).toBe(true);
  });

  it("explicitly permits Mediapartners-Google for AdSense page analysis", () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];

    const adsenseRule = rules.find(
      (r) => r.userAgent === "Mediapartners-Google"
    );

    expect(adsenseRule).toBeDefined();
    expect(adsenseRule?.allow).toBe("/");
  });

  it("permits Googlebot and general crawlers while protecting internal API endpoints", () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];

    const generalRule = rules.find((r) => r.userAgent === "*");
    expect(generalRule).toBeDefined();
    expect(generalRule?.allow).toBe("/");
    expect(generalRule?.disallow).toContain("/api/");
    expect(generalRule?.disallow).toContain("/settings/");

    const googlebotRule = rules.find((r) => r.userAgent === "Googlebot");
    expect(googlebotRule).toBeDefined();
    expect(googlebotRule?.allow).toBe("/");
    expect(googlebotRule?.disallow).toContain("/api/");
    expect(googlebotRule?.disallow).toContain("/settings/");
    expect(googlebotRule?.disallow).toContain("/dashboard/");
    expect(googlebotRule?.disallow).toContain("/exams/");
    expect(googlebotRule?.disallow).toContain("/results/");
  });
});
