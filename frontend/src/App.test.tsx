import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import App from "./App";

const mockExpansions = [
  { id: 1, name: "Dominion", name_es: "Dominio", adds_extra_cards: false, extra_cards_description: "", adds_events: false, adds_landmarks: false, modifies_starting_deck: false, modifies_starting_description: "", notes: "" },
  { id: 2, name: "Intrigue", name_es: "Intriga", adds_extra_cards: false, extra_cards_description: "", adds_events: false, adds_landmarks: false, modifies_starting_deck: false, modifies_starting_description: "", notes: "" },
  { id: 3, name: "Seaside", name_es: "Costa", adds_extra_cards: false, extra_cards_description: "", adds_events: false, adds_landmarks: false, modifies_starting_deck: false, modifies_starting_description: "", notes: "" },
];

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url: RequestInfo | URL) => {
    if (String(url) === "/api/expansions") {
      return { ok: true, json: async () => mockExpansions } as Response;
    }
    return { ok: false } as Response;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("renders title", () => {
    render(<App />);
    expect(screen.getByText("Dominion Deck")).toBeInTheDocument();
  });

  it("renders expansion grid after fetch", async () => {
    render(<App />);
    expect(await screen.findByText("Dominio")).toBeInTheDocument();
    expect(await screen.findByText("Intriga")).toBeInTheDocument();
    expect(await screen.findByText("Costa")).toBeInTheDocument();
  });

  it("selects and deselects an expansion", async () => {
    render(<App />);
    const dominio = await screen.findByText("Dominio");
    const card = dominio.closest(".expansion-card")!;
    const checkbox = card.querySelector('input[type="checkbox"]')!;

    fireEvent.click(dominio);
    expect(checkbox).toBeChecked();

    fireEvent.click(dominio);
    expect(checkbox).not.toBeChecked();
  });

  it('"Select All" marks every expansion', async () => {
    render(<App />);
    await screen.findByText("Dominio");

    fireEvent.click(screen.getByText("Seleccionar todas"));
    const checkboxes = document.querySelectorAll('.expansion-card input[type="checkbox"]');
    expect(checkboxes).toHaveLength(3);
    checkboxes.forEach((cb) => expect(cb).toBeChecked());
  });

  it('"Clear" deselects everything', async () => {
    render(<App />);
    await screen.findByText("Dominio");

    fireEvent.click(screen.getByText("Seleccionar todas"));
    fireEvent.click(screen.getByText("Limpiar"));
    const checkboxes = document.querySelectorAll('.expansion-card input[type="checkbox"]');
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
  });

  it("disables generate button when no expansion selected", async () => {
    render(<App />);
    await screen.findByText("Dominio");

    const btn = screen.getByText("Generar Mazo") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);

    fireEvent.click(screen.getByText("Seleccionar todas"));
    expect(btn.disabled).toBe(false);

    fireEvent.click(screen.getByText("Limpiar"));
    expect(btn.disabled).toBe(true);
  });

  it("toggles language between ES and EN", async () => {
    render(<App />);
    await screen.findByText("Dominio");

    fireEvent.click(screen.getByTitle("EN"));
    expect(screen.getByText("Select All")).toBeInTheDocument();
  });

  it("toggles light class on html element", async () => {
    render(<App />);
    await screen.findByText("Dominio");

    expect(document.documentElement.classList.contains("light")).toBe(false);
    fireEvent.click(screen.getByTitle("Modo claro"));
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});
