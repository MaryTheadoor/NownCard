import { describe, it, expect } from "vitest";
import { planConfig, isPlanAtLeast } from "@/features/payments/api";

describe("planConfig", () => {
  it("free plan limits social links to 3", () => {
    expect(planConfig.free.maxSocialLinks).toBe(3);
  });

  it("free plan limits cards to 1", () => {
    expect(planConfig.free.maxCards).toBe(1);
  });

  it("pro plan has unlimited social links", () => {
    expect(planConfig.pro.maxSocialLinks).toBe(Infinity);
  });

  it("business plan has unlimited cards", () => {
    expect(planConfig.business.maxCards).toBe(Infinity);
  });

  it("free plan has no background image", () => {
    expect(planConfig.free.backgroundImage).toBe(false);
  });

  it("pro and business plans have background images", () => {
    expect(planConfig.pro.backgroundImage).toBe(true);
    expect(planConfig.business.backgroundImage).toBe(true);
  });
});

describe("isPlanAtLeast", () => {
  it("free is at least free", () => {
    expect(isPlanAtLeast("free", "free")).toBe(true);
  });

  it("pro is at least free", () => {
    expect(isPlanAtLeast("pro", "free")).toBe(true);
  });

  it("free is not at least pro", () => {
    expect(isPlanAtLeast("free", "pro")).toBe(false);
  });

  it("business is at least pro", () => {
    expect(isPlanAtLeast("business", "pro")).toBe(true);
  });

  it("pro is not at least business", () => {
    expect(isPlanAtLeast("pro", "business")).toBe(false);
  });
});

describe("planConfig theme access", () => {
  it("free plan only has minimal theme", () => {
    expect(planConfig.free.themes).toEqual(["minimal"]);
  });

  it("pro plan has all themes", () => {
    const themes = planConfig.pro.themes;
    expect(themes).toContain("cosmic");
    expect(themes).toContain("warm");
    expect(themes).toContain("minimal");
  });
});
