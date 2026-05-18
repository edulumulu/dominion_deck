import { useState, useEffect, useMemo } from "react";
import { fetchAllCards } from "../api";
import { getCardImageUrl } from "../card-images";
import type { Card } from "../types";

interface Props {
  lang: "es" | "en";
  selectedCardIds: Set<number>;
  onToggleCard: (card: Card) => void;
}

interface ExpGroup {
  name: string;
  name_es: string;
  cards: Card[];
}

export default function ManualCardSelector({ lang, selectedCardIds, onToggleCard }: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedExps, setCheckedExps] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAllCards()
      .then((all) => {
        const kingdom = all.filter((c) => c.is_kingdom_card);
        setCards(kingdom);
        const names = [...new Set(kingdom.map((c) => c.set_name))];
        setCheckedExps(new Set(names));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, ExpGroup>();
    for (const c of cards) {
      if (!checkedExps.has(c.set_name)) continue;
      if (!map.has(c.set_name)) {
        map.set(c.set_name, {
          name: c.set_name,
          name_es: c.set_name_es || c.set_name,
          cards: [],
        });
      }
      map.get(c.set_name)!.cards.push(c);
    }
    return Array.from(map.values());
  }, [cards, checkedExps]);

  const toggleExp = (name: string) => {
    setCheckedExps((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const expNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of cards) {
      if (!map.has(c.set_name)) {
        map.set(c.set_name, c.set_name_es || c.set_name);
      }
    }
    return Array.from(map.entries()).map(([name, name_es]) => ({ name, name_es }));
  }, [cards]);

  return (
    <div className="sidebar-right manual-selector">
      <div className="manual-selector-header" onClick={() => setOpen((p) => !p)}>
        <span className={`manual-selector-arrow${open ? " open" : ""}`}>▶</span>
        <h3>{lang === "es" ? "Selección manual" : "Manual pick"}</h3>
      </div>

      {open && (
        <>
          <div className="manual-exp-filters">
            {loading && <div className="sidebar-status">
              {lang === "es" ? "Cargando..." : "Loading..."}
            </div>}
            {!loading && expNames.map((e) => (
              <label key={e.name} className="manual-exp-filter">
                <input
                  type="checkbox"
                  checked={checkedExps.has(e.name)}
                  onChange={() => toggleExp(e.name)}
                />
                <span>{lang === "es" ? (e.name_es || e.name) : e.name}</span>
              </label>
            ))}
          </div>

          <div className="sidebar-results">
            {groups.map((g) => (
              <div key={g.name} className="manual-exp-section">
                <div className="manual-exp-title">
                  {lang === "es" ? g.name_es : g.name}
                </div>
                {g.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`sidebar-card-item${selectedCardIds.has(card.id) ? " selected" : ""}`}
                    onClick={() => onToggleCard(card)}
                  >
                    <img
                      className="sidebar-card-img"
                      src={getCardImageUrl(card.card_name)}
                      alt={lang === "es" ? (card.card_name_es || card.card_name) : card.card_name}
                      loading="lazy"
                    />
                    <div className="sidebar-card-info">
                      <span className="sidebar-card-name">
                        {lang === "es" ? (card.card_name_es || card.card_name) : card.card_name}
                      </span>
                      <span className="sidebar-card-type">{card.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
