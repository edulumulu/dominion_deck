import { describe, it, expect } from "vitest";
import { translateCardText } from "./translate-card-text";

describe("translateCardText", () => {
  it('translates "Draw a card" at start of string', () => {
    expect(translateCardText("Draw a card")).toBe("Roba una carta");
  });

  it('translates " Draw a card" with leading space', () => {
    expect(translateCardText(" Draw a card")).toBe(" Roba una carta");
  });

  it("handles +2 Card(s) to +2 Cartas", () => {
    expect(translateCardText("+2 Card(s)")).toBe("+2 Cartas");
  });

  it("handles +1 Card(s) to +1 Carta", () => {
    expect(translateCardText("+1 Card(s)")).toBe("+1 Carta");
  });

  it("handles +N Action(s)", () => {
    expect(translateCardText("+1 Action")).toBe("+1 Acción");
  });

  it("handles +2 Action(s)", () => {
    expect(translateCardText("+2 Actions")).toBe("+2 Acciones");
  });

  it("handles +N Buy(s)", () => {
    expect(translateCardText("+1 Buy")).toBe("+1 Compra");
  });

  it("handles +2 Buy(s)", () => {
    expect(translateCardText("+2 Buys")).toBe("+2 Compras");
  });

  it("handles +N VP", () => {
    expect(translateCardText("+2VP")).toBe("+2 PV");
  });

  it("handles +1 VP", () => {
    expect(translateCardText("+1VP")).toBe("+1 PV");
  });

  it("preserves English if no match is found", () => {
    const text = "Some completely unknown text here";
    expect(translateCardText(text)).toBe(text);
  });

  it("handles escaped newlines (\\\\n to newline)", () => {
    expect(translateCardText("line1\\nline2")).toBe("line1\nline2");
  });

  it("handles \\\\d to em-dash separator", () => {
    expect(translateCardText("before\\dafter")).toBe("before\n—\nafter");
  });

  it('translates card type "Action-Attack" to "Acción-Ataque"', () => {
    expect(translateCardText("Action-Attack")).toBe("Acción-Ataque");
  });

  it('translates card type "Action-Duration" to "Acción-Duración"', () => {
    expect(translateCardText("Action-Duration")).toBe("Acción-Duración");
  });

  it('translates card type "Treasure-Victory" to "Tesoro-Victoria"', () => {
    expect(translateCardText("Treasure-Victory")).toBe("Tesoro-Victoria");
  });
});
