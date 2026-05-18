import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import CardSearchSidebar from "./CardSearchSidebar";

const mockCards = [
  { id: 1, card_name: "Witch", card_name_es: "Bruja", set_name: "Dominion", set_name_es: "Dominio", type: "Action-Attack", is_kingdom_card: true, cost: "5", card_text: "+2 Cards\n+1 Action" },
  { id: 2, card_name: "Village", card_name_es: "Aldea", set_name: "Dominion", set_name_es: "Dominio", type: "Action", is_kingdom_card: true, cost: "3", card_text: "+1 Card\n+2 Actions" },
];

const onSelectCard = vi.fn();

beforeEach(() => {
  onSelectCard.mockClear();
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url: RequestInfo | URL) => {
    if (String(url) === "/api/cards?kingdom_only=false") {
      return { ok: true, json: async () => mockCards } as Response;
    }
    return { ok: false } as Response;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CardSearchSidebar", () => {
  it("filters cards by name as user types", async () => {
    render(<CardSearchSidebar lang="en" onSelectCard={onSelectCard} />);

    const input = await screen.findByPlaceholderText("Type card name...");
    fireEvent.change(input, { target: { value: "Witch" } });
    expect(screen.getByText("Witch")).toBeInTheDocument();
    expect(screen.queryByText("Village")).not.toBeInTheDocument();
  });

  it('shows "No results" when search matches nothing', async () => {
    render(<CardSearchSidebar lang="en" onSelectCard={onSelectCard} />);

    const input = await screen.findByPlaceholderText("Type card name...");
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText("No results")).toBeInTheDocument();
  });
});
