import { describe, it, expect } from "vitest";
import { generateVCard } from "@/shared/lib/vcard/generateVCard";
import type { Card } from "@/shared/api/types";

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    ownerUid: "user-1",
    slug: "john-doe-abc",
    firstName: "John",
    lastName: "Doe",
    phones: [],
    emails: [],
    addresses: [],
    socialLinks: [],
    theme: "minimal",
    accentColor: "#c9a278",
    isPublic: true,
    viewCount: 0,
    saveCount: 0,
    createdAt: { seconds: 0, nanoseconds: 0 } as Card["createdAt"],
    updatedAt: { seconds: 0, nanoseconds: 0 } as Card["updatedAt"],
    ...overrides,
  };
}

describe("generateVCard", () => {
  it("creates a valid vCard 4.0", () => {
    const vcard = generateVCard(makeCard());
    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).toContain("VERSION:4.0");
    expect(vcard).toContain("FN:John Doe");
    expect(vcard).toContain("N:Doe;John;;;");
    expect(vcard).toContain("END:VCARD");
  });

  it('includes prefix and suffix in full name', () => {
    const vcard = generateVCard(makeCard({ prefix: "Dr.", suffix: "Jr." }));
    expect(vcard).toContain("FN:Dr. John Doe Jr.");
  });

  it("includes job title and company", () => {
    const vcard = generateVCard(makeCard({ jobTitle: "Engineer", company: "Acme Inc." }));
    expect(vcard).toContain("TITLE:Engineer");
    expect(vcard).toContain("ORG:Acme Inc.");
  });

  it("includes phone numbers with types", () => {
    const vcard = generateVCard(
      makeCard({
        phones: [
          { type: "mobile", number: "+1-555-0001", primary: true },
          { type: "work", number: "+1-555-0002" },
        ],
      }),
    );
    expect(vcard).toContain("TEL;TYPE=PREF,CELL:+1-555-0001");
    expect(vcard).toContain("TEL;TYPE=WORK:+1-555-0002");
  });

  it("includes email addresses", () => {
    const vcard = generateVCard(
      makeCard({
        emails: [{ type: "work", address: "john@acme.com", primary: true }],
      }),
    );
    expect(vcard).toContain("EMAIL;TYPE=PREF,WORK:john@acme.com");
  });

  it("includes address", () => {
    const vcard = generateVCard(
      makeCard({
        addresses: [
          { label: "Office", street: "123 Main St", city: "Springfield", country: "USA" },
        ],
      }),
    );
    expect(vcard).toContain("ADR;LABEL=\"Office\";;123 Main St;Springfield;;;USA");
  });

  it("includes social links as URLs", () => {
    const vcard = generateVCard(
      makeCard({
        socialLinks: [{ platform: "linkedin", url: "https://linkedin.com/in/john" }],
      }),
    );
    expect(vcard).toContain("URL;TYPE=Linkedin:https://linkedin.com/in/john");
  });

  it("includes nickname and bio", () => {
    const vcard = generateVCard(makeCard({ nickname: "Johnny", bio: "A developer" }));
    expect(vcard).toContain("NICKNAME:Johnny");
    expect(vcard).toContain("NOTE:A developer");
  });

  it("escapes special characters", () => {
    const vcard = generateVCard(makeCard({ firstName: "Jane,O", lastName: "Doe;Jr" }));
    expect(vcard).toContain("FN:Jane\\,O Doe\\;Jr");
  });

  it("handles empty card gracefully", () => {
    const vcard = generateVCard(makeCard({ firstName: "", lastName: "" }));
    expect(vcard).toContain("FN:");
    expect(vcard).toContain("N:;;;;");
  });
});
