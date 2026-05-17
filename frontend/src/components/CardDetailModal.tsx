import { useEffect } from "react";
import { getCardImageUrl } from "../card-images";
import { translateCardText } from "../translate-card-text";
import { getExpansionSymbol } from "../expansion-symbols";
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
              <span className="card-cost" title={card.cost}>
                {card.cost.replace(/[^0-9]/g, "")}
              </span>
              <span className="badge badge-type">{card.type}</span>
              <span className="badge badge-set">
                {lang === "es"
                  ? (card.set_name_es || card.set_name)
                  : card.set_name}
              </span>
              <span
                className="expansion-symbol card-symbol"
                dangerouslySetInnerHTML={{
                  __html: getExpansionSymbol(card.set_name),
                }}
              />
            </div>
            <div className="modal-text">
              {lang === "es"
                ? translateCardText(card.card_text)
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
