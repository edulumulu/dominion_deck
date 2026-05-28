import { useEffect } from "react";
import { getCardImageUrl } from "../card-images";

import { ExpansionSymbol } from "./ExpansionSymbol";
import type { Card } from "../types";

interface Props {
  card: Card;
  lang: "es" | "en";
  onClose: () => void;
}

export default function CardDetailModal({ card, lang, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-body">
          <div className="modal-img-wrap">
            <img
              className="modal-img"
              src={getCardImageUrl(card.card_name)}
              alt={
                lang === "es"
                  ? (card.card_name_es || card.card_name)
                  : card.card_name
              }
            />
          </div>
          <div className="modal-details">
            <h2 className="modal-title">
              {lang === "es"
                ? (card.card_name_es || card.card_name)
                : card.card_name}
            </h2>
            <div className="modal-meta">
              <span className="card-cost-wrap">
                <span className="card-cost" title={card.cost}>
                  {card.cost.replace(/[^0-9]/g, "")}
                </span>
                {card.potion_cost && (
                  <span className="potion-icon" title={lang === "es" ? "Requiere Poción" : "Requires Potion"}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 2v6l-4 6v2h12v-2l-4-6V2"/>
                      <path d="M8 14c0 2 2 3 4 3s4-1 4-3"/>
                      <path d="M8 2h8"/>
                    </svg>
                  </span>
                )}
              </span>
              <span className="badge badge-type">{card.type}</span>
              <span className="badge badge-set">
                {lang === "es"
                  ? (card.set_name_es || card.set_name)
                  : card.set_name}
              </span>
              <ExpansionSymbol name={card.set_name} className="expansion-symbol card-symbol" />
            </div>
            <div className="modal-text">
              {lang === "es"
                ? (card.card_text_es || card.card_text)
                    .replace(/\\n/g, "\n")
                    .replace(/\\d/g, "\n—\n")
                : card.card_text
                    .replace(/\\n/g, "\n")
                    .replace(/\\d/g, "\n—\n")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
