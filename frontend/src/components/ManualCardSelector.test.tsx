import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import ManualCardSelector from "./ManualCardSelector";

const mockCards = [
  { id: 1, card_name: "Witch", card_name_es: "Bruja", set_name: "Dominion", set_name_es: "Dominio", type: "Action-Attack", is_kingdom_card: true, cost: "5", potion_cost: false, card_text: "" },
  { id: 2, card_name: "Village", card_name_es: "Aldea", set_name: "Dominion", set_name_es: "Dominio", type: "Action", is_kingdom_card: true, cost: "3", potion_cost: false, card_text: "" },
  { id: 3, card_name: "Pillage", card_name_es: "Saqueo", set_name: "Dark Ages", set_name_es: "Edad Oscura", type: "Action-Attack", is_kingdom_card: true, cost: "5", potion_cost: false, card_text: "" },
];

const onToggleCard = vi.fn();

beforeEach(() => {
  onToggleCard.mockClear();
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

describe("ManualCardSelector", () => {
  it("renders header and starts collapsed", async () => {
    render(<ManualCardSelector lang="es" selectedCardIds={new Set()} onToggleCard={onToggleCard} />);
    expect(screen.getByText("Selección manual")).toBeInTheDocument();
    expect(screen.queryByText("Dominion")).not.toBeInTheDocument();
  });

  it("expands on header click", async () => {
    render(<ManualCardSelector lang="es" selectedCardIds={new Set()} onToggleCard={onToggleCard} />);
    fireEvent.click(screen.getByText("Selección manual"));
    const expTitles = await screen.findAllByText("Dominio");
    expect(expTitles.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Edad Oscura")).toBeInTheDocument();
  });

  it("shows cards grouped by expansion when expanded", async () => {
    render(<ManualCardSelector lang="en" selectedCardIds={new Set()} onToggleCard={onToggleCard} />);
    fireEvent.click(screen.getByText("Manual pick"));
    const expTitles = await screen.findAllByText("Dominion");
    expect(expTitles.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Witch")).toBeInTheDocument();
    expect(screen.getByText("Village")).toBeInTheDocument();
  });

  it("filters cards when expansion unchecked", async () => {
    render(<ManualCardSelector lang="en" selectedCardIds={new Set()} onToggleCard={onToggleCard} />);
    fireEvent.click(screen.getByText("Manual pick"));

    // enable Dark Ages first
    const dAgesCb = (await screen.findAllByRole("checkbox"))[1];
    fireEvent.click(dAgesCb);

    // now uncheck Dominion
    const dominionCb = (await screen.findAllByRole("checkbox"))[0];
    fireEvent.click(dominionCb);

    expect(screen.queryByText("Witch")).not.toBeInTheDocument();
    expect(screen.getByText("Pillage")).toBeInTheDocument();
  });

  it("calls onToggleCard when clicking a card", async () => {
    render(<ManualCardSelector lang="en" selectedCardIds={new Set()} onToggleCard={onToggleCard} />);
    fireEvent.click(screen.getByText("Manual pick"));
    fireEvent.click(await screen.findByText("Witch"));
    expect(onToggleCard).toHaveBeenCalledTimes(1);
    expect(onToggleCard).toHaveBeenCalledWith(expect.objectContaining({ card_name: "Witch" }));
  });

  it("highlights selected cards", async () => {
    render(<ManualCardSelector lang="en" selectedCardIds={new Set([1])} onToggleCard={onToggleCard} />);
    fireEvent.click(screen.getByText("Manual pick"));
    const item = await screen.findByText("Witch");
    expect(item.closest(".sidebar-card-item")?.classList.contains("selected")).toBe(true);
  });

  it("does not toggle when disabled", async () => {
    render(<ManualCardSelector lang="en" selectedCardIds={new Set()} onToggleCard={onToggleCard} disabled />);
    fireEvent.click(screen.getByText("Manual pick"));
    expect(screen.queryByText("Dominion")).not.toBeInTheDocument();
  });
});
