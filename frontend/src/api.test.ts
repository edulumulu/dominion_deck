import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchExpansions, fetchRandomCards, fetchAllCards } from "./api";

/** Helper: mocks the next fetch call with the given ok flag and response body */
const mockFetch = (ok: boolean, data: unknown) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
    ok,
    json: async () => data,
  } as Response);

afterEach(() => {
  vi.restoreAllMocks();
});

// ── fetchExpansions ───────────────────────────────────────────────────────────

describe("fetchExpansions", () => {
  it("returns parsed json on ok response", async () => {
    const payload = [{ id: 1, name: "Dominion" }];
    mockFetch(true, payload);

    await expect(fetchExpansions()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("/api/expansions");
  });

  it("throws on non-ok response", async () => {
    mockFetch(false, {});
    await expect(fetchExpansions()).rejects.toThrow("Failed to fetch expansions");
  });
});

// ── fetchRandomCards ──────────────────────────────────────────────────────────

describe("fetchRandomCards", () => {
  it("builds the correct URL with multiple expansions and explicit count", async () => {
    const payload = { cards: [], extra_piles: [] };
    mockFetch(true, payload);

    const result = await fetchRandomCards(["Dominion", "Intrigue"], 5);

    expect(result).toEqual(payload);
    expect(fetch).toHaveBeenCalledWith(
      "/api/cards/random?expansions=Dominion%2CIntrigue&count=5"
    );
  });

  it("uses default count of 10 when not specified", async () => {
    mockFetch(true, {});

    await fetchRandomCards(["Dominion"]);

    expect(fetch).toHaveBeenCalledWith(
      "/api/cards/random?expansions=Dominion&count=10"
    );
  });

  it("throws error.detail when the server responds with a non-ok status", async () => {
    mockFetch(false, { detail: "Rate limit exceeded" });

    await expect(fetchRandomCards(["Dominion"])).rejects.toThrow(
      "Rate limit exceeded"
    );
  });

  it("throws fallback message when non-ok body has no detail field", async () => {
    mockFetch(false, {});

    await expect(fetchRandomCards(["Dominion"])).rejects.toThrow(
      "Failed to fetch cards"
    );
  });
});

// ── fetchAllCards ─────────────────────────────────────────────────────────────

describe("fetchAllCards", () => {
  it("returns parsed json on ok response", async () => {
    const payload = [{ id: 1, card_name: "Witch" }];
    mockFetch(true, payload);

    await expect(fetchAllCards()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith("/api/cards?kingdom_only=false");
  });

  it("throws on non-ok response", async () => {
    mockFetch(false, {});

    await expect(fetchAllCards()).rejects.toThrow("Failed to fetch cards");
  });
});
