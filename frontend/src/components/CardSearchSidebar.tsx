import { useState, useEffect } from "react";
import { fetchAllCards } from "../api";
import { getCardImageUrl } from "../card-images";
import type { Card } from "../types";

interface Props {
  lang: "es" | "en";
  onSelectCard: (card: Card) => void;
}

export default function CardSearchSidebar({ lang, onSelectCard }: Props) {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCards()
      .then(setCards)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? cards.filter((c) => {
        const name = lang === "es"
          ? (c.card_name_es || c.card_name)
          : c.card_name;
        return name.toLocaleLowerCase().includes(query.toLocaleLowerCase());
      })
    : [];

  return (
    <div className="sidebar-right">
      <div className="sidebar-header">
        <h3>{lang === "es" ? "Buscar carta" : "Search card"}</h3>
      </div>
      <input
        className="sidebar-search"
        type="text"
        placeholder={
          lang === "es"
            ? "Escribe el nombre..."
            : "Type card name..."
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div className="sidebar-results">
        {loading && (
          <div className="sidebar-status">
            {lang === "es" ? "Cargando..." : "Loading..."}
          </div>
        )}
        {!loading && query.trim() && filtered.length === 0 && (
          <div className="sidebar-status">
            {lang === "es" ? "Sin resultados" : "No results"}
          </div>
        )}
        {filtered.map((card) => (
          <div
            key={card.id}
            className="sidebar-card-item"
            onClick={() => onSelectCard(card)}
          >
            <img
              className="sidebar-card-img"
              src={getCardImageUrl(card.card_name)}
              alt={
                lang === "es"
                  ? (card.card_name_es || card.card_name)
                  : card.card_name
              }
              loading="lazy"
            />
            <div className="sidebar-card-info">
              <span className="sidebar-card-name">
                {lang === "es"
                  ? (card.card_name_es || card.card_name)
                  : card.card_name}
              </span>
              <span className="sidebar-card-type">{card.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
