import { describe, it, expect } from "vitest";
import { isValidElement } from "react";
import { getExpansionSymbol } from "./expansion-symbols";

describe("getExpansionSymbol", () => {
  it('returns a valid React element for "Dominion"', () => {
    const svg = getExpansionSymbol("Dominion");
    expect(isValidElement(svg)).toBe(true);
  });

  it("returns valid React element for all known expansions", () => {
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
      expect(isValidElement(getExpansionSymbol(name))).toBe(true);
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
