import { describe, it, expect } from "vitest";
import { getExpansionSymbol } from "./expansion-symbols";

describe("getExpansionSymbol", () => {
  it('returns a valid SVG string for "Dominion"', () => {
    const svg = getExpansionSymbol("Dominion");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("viewBox");
  });

  it("returns valid SVG for all known expansions", () => {
    const known = [
      "Dominion",
      "Intrigue",
      "Seaside",
      "Alchemy",
      "Prosperity",
      "Cornucopia",
      "Hinterlands",
      "Dark Ages",
      "Guilds",
      "Adventures",
      "Empires",
      "Nocturne",
      "Renaissance",
      "Promo",
      "Base Cards",
    ];
    for (const name of known) {
      const svg = getExpansionSymbol(name);
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
    }
  });

  it('falls back to Dominion SVG for "Unknown" expansion', () => {
    const unknown = getExpansionSymbol("Unknown");
    const dominion = getExpansionSymbol("Dominion");
    expect(unknown).toBe(dominion);
  });

  it("falls back to Dominion SVG for empty string", () => {
    const empty = getExpansionSymbol("");
    const dominion = getExpansionSymbol("Dominion");
    expect(empty).toBe(dominion);
  });
});
