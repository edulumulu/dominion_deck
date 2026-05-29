import { useState, useEffect, useMemo, useRef } from "react";
import { fetchExpansions, fetchRandomCards, fetchAllCards } from "./api";
import { getCardImageUrl } from "./card-images";
import { ExpansionSymbol } from "./components/ExpansionSymbol";

import CardSearchSidebar from "./components/CardSearchSidebar";
import ManualCardSelector from "./components/ManualCardSelector";
import CardDetailModal from "./components/CardDetailModal";
import type { Expansion, Card, ExtraPile, RandomCardsResponse } from "./types";

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
    potion_cost: "Requiere Poción",
    extra_piles_title: "Mazos extra",
    manual_deck: "Mazo manual",
    remove: "Eliminar",
    reset: "Reiniciar",
    empty_manual: "Selecciona las cartas de tu mazo manualmente con Selección manual",
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
    extra_piles_title: "Extra Supply Piles",
    manual_deck: "Manual deck",
    remove: "Remove",
    reset: "Reset",
    empty_manual: "Or pick your cards manually with Manual pick",
  },
};

function App() {
  const [expansions, setExpansions] = useState<Expansion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const count = 10;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RandomCardsResponse | null>(null);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("theme") !== "light"; } catch { return true; }
  });
  const [listView, setListView] = useState(false);
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem("lang") as Lang) || "es"; } catch { return "es"; }
  });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [manualCards, setManualCards] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const manualCardIds = new Set(manualCards.map((c) => c.id));
  const hasManualDeck = manualCards.length > 0;
  const hasAutoDeck = result !== null && !loading;
  const hasContent = hasManualDeck || hasAutoDeck;
  const sidebarRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => UI[lang][key] ?? key;

  const resetAll = () => {
    setManualCards([]);
    setResult(null);
    setError("");
  };

  const toggleManualCard = (card: Card) => {
    const willAdd = !manualCardIds.has(card.id);
    setManualCards((prev) => {
      if (prev.some((c) => c.id === card.id)) {
        return prev.filter((c) => c.id !== card.id);
      }
      if (prev.length >= 10) return prev;
      return [...prev, card];
    });
    if (willAdd && sidebarRef.current) {
      const header = sidebarRef.current.querySelector(".manual-selector-header");
      if (header) {
        header.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  useEffect(() => {
    const onConnError = () => setError(UI.es.connection_error);
    fetchExpansions()
      .then((data) => {
        const exps = data.filter(
          (e: Expansion) => e.name !== "Base Cards" && e.name !== "Promo"
        );
        setExpansions(exps);
      })
      .catch(onConnError);
    fetchAllCards().then(setAllCards).catch(onConnError);
  }, []);

  const manualExtraPiles = useMemo(() => {
    if (manualCards.length === 0) return [];
    const selectedNames = new Set(manualCards.map((c) => c.card_name));
    const expNames = [...new Set(manualCards.map((c) => c.set_name))];
    const allCardsMap = new Map(allCards.map((c) => [c.card_name, c]));

    const EXTRA_PILES_CONFIG = [
      { pile_label: "Colony & Platinum", pile_label_es: "Colonia y Platino", condition: expNames.includes("Prosperity"), card_names: ["Colony", "Platinum"] },
      { pile_label: "Potion", pile_label_es: "Poción", condition: expNames.includes("Alchemy"), card_names: ["Potion"] },
      { pile_label: "Ruins", pile_label_es: "Ruinas", condition: ["Cultist", "Marauder", "Death Cart"].some((n) => selectedNames.has(n)), card_names: ["Abandoned Mine", "Ruined Library", "Ruined Market", "Ruined Village", "Survivors"] },
      { pile_label: "Spoils", pile_label_es: "Botín", condition: ["Marauder", "Bandit Camp", "Pillage"].some((n) => selectedNames.has(n)), card_names: ["Spoils"] },
      { pile_label: "Madman", pile_label_es: "Loco", condition: selectedNames.has("Hermit"), card_names: ["Madman"] },
      { pile_label: "Mercenary", pile_label_es: "Mercenario", condition: selectedNames.has("Urchin"), card_names: ["Mercenary"] },
      { pile_label: "Prizes", pile_label_es: "Premios", condition: selectedNames.has("Tournament"), card_names: ["Bag of Gold", "Diadem", "Followers", "Princess", "Trusty Steed"] },
      { pile_label: "Wish", pile_label_es: "Deseo", condition: ["Leprechaun", "Magic Lamp"].some((n) => selectedNames.has(n)), card_names: ["Wish"] },
      { pile_label: "Imp", pile_label_es: "Diablillo", condition: ["Devil's Workshop", "Tormentor"].some((n) => selectedNames.has(n)), card_names: ["Imp"] },
      { pile_label: "Ghost", pile_label_es: "Fantasma", condition: ["Exorcist", "Haunted Mirror"].some((n) => selectedNames.has(n)), card_names: ["Ghost"] },
      { pile_label: "Bat", pile_label_es: "Murciélago", condition: selectedNames.has("Vampire"), card_names: ["Bat"] },
    ];

    return EXTRA_PILES_CONFIG
      .filter((cfg) => cfg.condition)
      .map((cfg) => ({
        pile_label: cfg.pile_label,
        pile_label_es: cfg.pile_label_es,
        cards: cfg.card_names.map((name) => allCardsMap.get(name)).filter(Boolean) as Card[],
      }));
  }, [manualCards, allCards]);

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
            className={`icon-btn${hasContent && !loading ? ` active` : ""}`}
            onClick={() => setListView((p) => !p)}
            title={listView ? t("grid_view") : t("list_view")}
            disabled={!hasContent || loading}
          >
            {listView ? "▦" : "☰"}
          </button>
          <button
            className={`icon-btn lang-btn ${lang === "en" ? "active" : ""}`}
            onClick={() =>
              setLang((p) => {
                const next: Lang = p === "es" ? "en" : "es";
                try { localStorage.setItem("lang", next); } catch { /* noop */ }
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
                try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* noop */ }
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
              disabled={loading || selected.size === 0 || hasManualDeck}
            >
              {loading ? t("generating") : t("generate")}
            </button>
            {hasContent && (
              <button className="btn btn-secondary btn-reset" onClick={resetAll}>
                {t("reset")}
              </button>
            )}
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
                <ExpansionSymbol name={exp.name} />
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

          {manualCards.length > 0 && (
            <div className="manual-deck">
              <div className="manual-deck-header">
                <h3>{t("manual_deck")} ({manualCards.length}/10)</h3>
              </div>
              <div className={listView ? "card-list" : "card-grid"}>
                {manualCards.map((card: Card) => (
                  <div key={card.id} className="card-item manual-deck-card">
                    <button
                      className="card-remove-btn"
                      onClick={() => toggleManualCard(card)}
                      title={t("remove")}
                    >
                      ✕
                    </button>
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
                    </div>
                  </div>
                ))}
              </div>

              {manualExtraPiles.length > 0 && (
                <div className="extra-piles" style={{ marginTop: "1.25rem" }}>
                  <h3 className="extra-piles-title">{t("extra_piles_title")}</h3>
                  {manualExtraPiles.map((pile: ExtraPile) => (
                    <div key={pile.pile_label} className="extra-pile-group">
                      <h4 className="extra-pile-label">
                        {lang === "es" ? pile.pile_label_es : pile.pile_label}
                      </h4>
                      <div className={listView ? "card-list extra-pile-cards" : "card-grid extra-pile-cards"}>
                        {pile.cards.map((card: Card) => (
                          <div key={card.card_name} className="card-item">
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
                                  ? (card.card_text_es || card.card_text).replace(/\\n/g, "\n").replace(/\\d/g, "\n—\n")
                                  : card.card_text.replace(/\\n/g, "\n").replace(/\\d/g, "\n—\n")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                          ? (card.card_text_es || card.card_text).replace(/\\n/g, "\n").replace(/\\d/g, "\n—\n")
                          : card.card_text.replace(/\\n/g, "\n").replace(/\\d/g, "\n—\n")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {result.extra_piles.length > 0 && (
                <div className="extra-piles">
                  <h3 className="extra-piles-title">{t("extra_piles_title")}</h3>
                  {result.extra_piles.map((pile: ExtraPile) => (
                    <div key={pile.pile_label} className="extra-pile-group">
                      <h4 className="extra-pile-label">
                        {lang === "es" ? pile.pile_label_es : pile.pile_label}
                      </h4>
                      <div className={listView ? "card-list extra-pile-cards" : "card-grid extra-pile-cards"}>
                        {pile.cards.map((card: Card) => (
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
                                  ? (card.card_text_es || card.card_text).replace(/\\n/g, "\n").replace(/\\d/g, "\n—\n")
                                  : card.card_text.replace(/\\n/g, "\n").replace(/\\d/g, "\n—\n")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!hasContent && !loading && !error && (
            <div className="empty-state">
              <h3>{t("empty_title")}</h3>
              <p>{t("empty_desc")}</p>
              <p className="empty-manual-hint">{t("empty_manual")}</p>
            </div>
          )}
        </div>

        <div className="sidebar-col" ref={sidebarRef}>
          <CardSearchSidebar lang={lang} onSelectCard={setSelectedCard} />
          <ManualCardSelector
            lang={lang}
            selectedCardIds={manualCardIds}
            onToggleCard={toggleManualCard}
            disabled={hasAutoDeck}
          />
        </div>
      </div>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          lang={lang}
          onClose={() => setSelectedCard(null)}
        />
      )}

      <footer className="app-footer">
        <p>
          {lang === "es" ? "Creado por" : "Created by"}{" "}
          <a href="https://github.com/edulumulu" target="_blank" rel="noopener noreferrer">
            edulumulu
          </a>
          {" · "}
          {lang === "es"
            ? "Herramienta no oficial, no afiliada con Rio Grande Games."
            : "Unofficial tool, not affiliated with Rio Grande Games."}
        </p>
        <p>
          Dominion &copy;{" "}
          <a href="https://www.riograndegames.com" target="_blank" rel="noopener noreferrer">
            Rio Grande Games
          </a>
          {", "}
          {lang === "es" ? "diseñado por" : "designed by"} Donald X. Vaccarino.{" "}
          {lang === "es" ? "Imágenes vía" : "Card images via"}{" "}
          <a href="https://github.com/connorburt/dominion-cards" target="_blank" rel="noopener noreferrer">
            connorburt/dominion-cards
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
