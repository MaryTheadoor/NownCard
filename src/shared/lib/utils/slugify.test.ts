import { describe, it, expect } from "vitest";
import { slugify, generateUniqueSlug } from "@/shared/lib/utils/slugify";

describe("slugify", () => {
  it("converts spaces to hyphens", () => {
    expect(slugify("John Doe")).toBe("john-doe");
  });

  it("removes special characters", () => {
    expect(slugify("Jane & Co.")).toBe("jane-and-co");
  });

  it("handles accented characters", () => {
    expect(slugify("José Muñoz")).toBe("jose-munoz");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("foo---bar")).toBe("foo-bar");
  });
});

describe("generateUniqueSlug", () => {
  it("generates a slug with random suffix", () => {
    const slug = generateUniqueSlug("John", "Doe");
    expect(slug).toMatch(/^john-doe-[a-z0-9]{4}$/);
  });

  it("generates unique slugs on each call", () => {
    const slug1 = generateUniqueSlug("Jane", "Smith");
    const slug2 = generateUniqueSlug("Jane", "Smith");
    expect(slug1).not.toBe(slug2);
  });
});
