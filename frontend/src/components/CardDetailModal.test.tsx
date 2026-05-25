import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CardDetailModal from "./CardDetailModal";

const mockCard = {
  id: 1,
  card_name: "Witch",
  card_name_es: "Bruja",
  set_name: "Dominion",
  set_name_es: "Dominio",
  type: "Action-Attack",
  is_kingdom_card: true,
  cost: "5",
  potion_cost: false,
  card_text: "+2 Cards\n+1 Action",
  card_text_es: "+2 Cartas\n+1 Acción",
};

const onClose = vi.fn();

beforeEach(() => {
  onClose.mockClear();
});

describe("CardDetailModal", () => {
  it("closes on ESC key", () => {
    render(<CardDetailModal card={mockCard} lang="en" onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on overlay click", () => {
    const { container } = render(<CardDetailModal card={mockCard} lang="en" onClose={onClose} />);
    const overlay = container.querySelector(".modal-overlay")!;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking modal content", () => {
    const { container } = render(<CardDetailModal card={mockCard} lang="en" onClose={onClose} />);
    const content = container.querySelector(".modal-content")!;
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows translated card name in ES", () => {
    render(<CardDetailModal card={mockCard} lang="es" onClose={onClose} />);
    expect(screen.getByText("Bruja")).toBeInTheDocument();
  });

  it("shows translated card text in ES", () => {
    render(<CardDetailModal card={mockCard} lang="es" onClose={onClose} />);
    expect(screen.getByText(/\+2 Cartas/)).toBeInTheDocument();
  });
});
