import { useState, useEffect } from "react";
import { fetchExpansions, fetchRandomCards } from "./api";
import type { Expansion, Card, RandomCardsResponse } from "./types";

function App() {
  const [expansions, setExpansions] = useState<Expansion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RandomCardsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpansions()
      .then((data) => {
        const exps = data.filter(
          (e: Expansion) => e.name !== "Base Cards" && e.name !== "Promo"
        );
        setExpansions(exps);
      })
      .catch(() => setError("No se pudo conectar con el servidor"));
  }, []);

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(expansions.map((e) => e.name)));
  };

  const clearAll = () => {
    setSelected(new Set());
  };

  const generate = async () => {
    if (selected.size === 0) {
      setError("Selecciona al menos una expansión");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await fetchRandomCards(Array.from(selected), count);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Dominion Deck</h1>
      <p className="subtitle">
        Selecciona las expansiones y genera un mazo aleatorio de cartas de
        Reino
      </p>

      <div className="controls">
        <button className="btn btn-secondary" onClick={selectAll}>
          Seleccionar todas
        </button>
        <button className="btn btn-secondary" onClick={clearAll}>
          Limpiar
        </button>
        <label>
          Cartas:
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>
        <button
          className="btn btn-primary"
          onClick={generate}
          disabled={loading || selected.size === 0}
        >
          {loading ? "Generando..." : "Generar Mazo"}
        </button>
      </div>

      <div className="expansion-grid">
        {expansions.map((exp) => (
          <div
            key={exp.name}
            className={`expansion-card ${selected.has(exp.name) ? "selected" : ""}`}
            onClick={() => toggle(exp.name)}
          >
            <input
              type="checkbox"
              checked={selected.has(exp.name)}
              onChange={() => {}}
            />
            <div>
              <div className="exp-name">{exp.name}</div>
              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {exp.adds_extra_cards && (
                  <span className="badge badge-extra">+cartas</span>
                )}
                {exp.modifies_starting_deck && (
                  <span className="badge badge-start">+inicio</span>
                )}
                {exp.adds_events && (
                  <span className="badge badge-event">events</span>
                )}
                {exp.adds_landmarks && (
                  <span className="badge badge-event">landmarks</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Generando mazo...</div>}

      {result && !loading && (
        <>
          {result.special_rules.length > 0 && (
            <div className="special-rules">
              <h3>Reglas especiales activas</h3>
              <ul>
                {result.special_rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card-grid">
            {result.cards.map((card: Card) => (
              <div key={card.id} className="card-item">
                <div className="card-header">
                  <span className="card-name">{card.card_name}</span>
                  <span className="card-cost">{card.cost}</span>
                </div>
                <div className="card-meta">
                  <span className="badge badge-set">{card.set_name}</span>
                  <span className="badge badge-type">{card.type}</span>
                </div>
                <div className="card-text">
                  {card.card_text
                    .replace(/\\n/g, "\n")
                    .replace(/\\d/g, "\n—\n")}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!result && !loading && !error && (
        <div className="empty-state">
          <h3>Selecciona expansiones y genera un mazo</h3>
          <p>Elige al menos una expansión y haz clic en "Generar Mazo"</p>
        </div>
      )}
    </div>
  );
}

export default App;
