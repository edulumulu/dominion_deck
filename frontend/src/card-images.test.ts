import { describe, it, expect } from "vitest";
import { getCardImageUrl } from "./card-images";

describe("getCardImageUrl", () => {
  const BASE = "https://raw.githubusercontent.com/connorburt/dominion-cards/master/cards";

  it('returns URL ending with "witch.jpg" for "Witch"', () => {
    expect(getCardImageUrl("Witch")).toBe(`${BASE}/witch.jpg`);
  });

  it('returns URL ending with "kings-court.jpg" for "King\'s Court"', () => {
    expect(getCardImageUrl("King's Court")).toBe(`${BASE}/kings-court.jpg`);
  });

  it("strips apostrophes and normalizes special characters", () => {
    expect(getCardImageUrl("St. Something's Day")).toBe(`${BASE}/st-somethings-day.jpg`);
  });

  it("handles multiple spaces and hyphens", () => {
    expect(getCardImageUrl("  Foo  Bar  ")).toBe(`${BASE}/foo-bar.jpg`);
  });

  it("handles empty-string-like input gracefully", () => {
    expect(getCardImageUrl("a")).toBe(`${BASE}/a.jpg`);
  });
});
