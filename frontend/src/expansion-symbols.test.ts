import { describe, it, expect } from "vitest";
import { getExpansionSymbolSrc } from "./expansion-symbols";

describe("getExpansionSymbolSrc", () => {
  it("returns a PNG path for Dominion", () => {
    const src = getExpansionSymbolSrc("Dominion");
    expect(src).toMatch(/\.png$/);
  });

  it("returns PNG paths for all known expansions", () => {
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
      "Menagerie",
      "Allies",
      "Plunder",
      "Rising Sun",
    ];
    for (const name of known) {
      const src = getExpansionSymbolSrc(name);
      expect(src).not.toBeNull();
      expect(src).toMatch(/\.png$/);
    }
  });

  it("returns null for unknown expansion", () => {
    expect(getExpansionSymbolSrc("Unknown")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getExpansionSymbolSrc("")).toBeNull();
  });
});
