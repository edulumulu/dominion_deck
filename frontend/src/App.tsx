import { useState, useEffect } from "react";
import { fetchExpansions, fetchRandomCards } from "./api";
import { getExpansionSymbol } from "./expansion-symbols";
import { getCardImageUrl } from "./card-images";
import { translateCardText } from "./translate-card-text";
import CardSearchSidebar from "./components/CardSearchSidebar";
import CardDetailModal from "./components/CardDetailModal";
import type { Expansion, Card, RandomCardsResponse } from "./types";

type Lang = "es" | "en";

const UI: Record<Lang, Record<string, string>> = {
  es: {
    title: "Dominion Deck",
    subtitle: "Selecciona las expansiones y genera un mazo aleatorio de cartas de Reino",
    select_all: "Seleccionar todas",
    clear: "Limpiar",
    count: "10 Cartas de Reino",
    generate: "Generar Mazo",
    generating: "Generando...",
    special_rules: "Reglas especiales activas",
    select_expansion: "Selecciona al menos una expansión",
    loading: "Generando mazo...",
    connection_error: "No se pudo conectar con el servidor",
    unknown_error: "Error desconocido",
    empty_title: "Selecciona expansiones y genera un mazo",
    empty_desc: 'Elige al menos una expansión y haz clic en "Generar Mazo"',
    grid_view: "Vista cuadrícula",
    list_view: "Vista lista",
    light_mode: "Modo claro",
    dark_mode: "Modo oscuro",
    lang_en: "EN",
    lang_es: "ES",
  },
  en: {
    title: "Dominion Deck",
    subtitle: "Select expansions and generate a random Kingdom card deck",
    select_all: "Select All",
    clear: "Clear",
    count: "10 Kingdom Cards",
    generate: "Generate Deck",
    generating: "Generating...",
    special_rules: "Active Special Rules",
    select_expansion: "Select at least one expansion",
    loading: "Generating deck...",
    connection_error: "Could not connect to server",
    unknown_error: "Unknown error",
    empty_title: "Select expansions and generate a deck",
    empty_desc: 'Choose at least one expansion and click "Generate Deck"',
    grid_view: "Grid view",
    list_view: "List view",
    light_mode: "Light mode",
    dark_mode: "Dark mode",
    lang_en: "EN",
    lang_es: "ES",
    potion_cost: "Requires Potion",
  },
};

function App() {
  const [expansions, setExpansions] = useState<Expansion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const count = 10;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RandomCardsResponse | null>(null);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const [listView, setListView] = useState(false);
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "es");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const t = (key: string) => UI[lang][key] ?? key;

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

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
      setError(t("select_expansion"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await fetchRandomCards(Array.from(selected), count);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("unknown_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app${dark ? "" : " light"}`}>
      <div className="header">
        <div>
          <h1>{t("title")}</h1>
          <p className="subtitle">
            {t("subtitle")}
          </p>
        </div>
        <div className="header-toggles">
          <button
            className={`icon-btn${result && !loading ? ` active` : ""}`}
            onClick={() => setListView((p) => !p)}
            title={listView ? t("grid_view") : t("list_view")}
            disabled={!result || loading}
          >
            {listView ? "▦" : "☰"}
          </button>
          <button
            className={`icon-btn lang-btn ${lang === "en" ? "active" : ""}`}
            onClick={() =>
              setLang((p) => {
                const next: Lang = p === "es" ? "en" : "es";
                localStorage.setItem("lang", next);
                return next;
              })
            }
            title={lang === "es" ? t("lang_en") : t("lang_es")}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <button
            className={`icon-btn${dark ? "" : " active"}`}
            onClick={() => {
              setDark((p) => {
                const next = !p;
                localStorage.setItem("theme", next ? "dark" : "light");
                return next;
              });
            }}
            title={dark ? t("light_mode") : t("dark_mode")}
          >
            {dark ? "☀" : "☾"}
          </button>
        </div>
      </div>

      <div className="app-layout">
        <div className="app-main">
          <div className="controls">
            <button className="btn btn-secondary" onClick={selectAll}>
              {t("select_all")}
            </button>
            <button className="btn btn-secondary" onClick={clearAll}>
              {t("clear")}
            </button>
            <span className="badge badge-count">{t("count")}</span>
            <button
              className="btn btn-primary"
              onClick={generate}
              disabled={loading || selected.size === 0}
            >
              {loading ? t("generating") : t("generate")}
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
                <span
                  className="expansion-symbol"
                  dangerouslySetInnerHTML={{
                    __html: getExpansionSymbol(exp.name),
                  }}
                />
                <div>
                  <div className="exp-name">
                    {lang === "es" ? exp.name_es : exp.name}
                  </div>
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

          {loading && <div className="loading">{t("loading")}</div>}

          {result && !loading && (
            <>
              {result.special_rules.length > 0 && (
                <div className="special-rules">
                  <h3>{t("special_rules")}</h3>
                  <ul>
                    {result.special_rules.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={listView ? "card-list" : "card-grid"}>
                {result.cards.map((card: Card) => (
                  <div key={card.id} className="card-item">
                    <div className="card-img-wrap">
                      <img
                        className="card-img"
                        src={getCardImageUrl(card.card_name)}
                        alt={lang === "es" ? (card.card_name_es || card.card_name) : card.card_name}
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body">
                      <div className="card-header">
                        <span className="card-name">
                          {lang === "es"
                            ? (card.card_name_es || card.card_name)
                            : card.card_name}
                        </span>
                        <span className="card-cost-wrap">
                          <span className="card-cost" title={card.cost}>{card.cost.replace(/[^0-9]/g, "")}</span>
                          {card.potion_cost && (
                            <span className="potion-icon" title={t("potion_cost")}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 2v6l-4 6v2h12v-2l-4-6V2"/>
                                <path d="M8 14c0 2 2 3 4 3s4-1 4-3"/>
                                <path d="M8 2h8"/>
                              </svg>
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="card-meta">
                        <span className="badge badge-set">
                          {lang === "es"
                            ? (card.set_name_es || card.set_name)
                            : card.set_name}
                        </span>
                        <span className="badge badge-type">{card.type}</span>
                      </div>
                      <div className="card-text">
                        {lang === "es"
                          ? translateCardText(card.card_text)
                          : card.card_text.replace(/\\n/g, "\n").replace(/\\d/g, "\n—\n")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!result && !loading && !error && (
            <div className="empty-state">
              <h3>{t("empty_title")}</h3>
              <p>{t("empty_desc")}</p>
            </div>
          )}
        </div>

        <CardSearchSidebar lang={lang} onSelectCard={setSelectedCard} />
      </div>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          lang={lang}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}

export default App;
