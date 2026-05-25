import os
import random

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Card, Expansion
from app.schemas import CardOut, ExpansionOut, ExtraPileOut, RandomCardsResponse
from app.seed import seed_database

cors_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost").split(",")]

app = FastAPI(title="Dominion Deck API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    seed_database()


@app.get("/api/expansions", response_model=list[ExpansionOut])
def list_expansions(db: Session = Depends(get_db)):
    expansions = db.query(Expansion).all()
    return expansions


@app.get("/api/cards", response_model=list[CardOut])
def list_cards(
    expansion: str | None = Query(None),
    kingdom_only: bool = Query(True),
    db: Session = Depends(get_db),
):
    q = db.query(Card)
    if expansion:
        q = q.filter(Card.set_name == expansion)
    if kingdom_only:
        q = q.filter(Card.is_kingdom_card == True)
    return q.all()


@app.get("/api/cards/random", response_model=RandomCardsResponse)
def random_cards(
    expansions: str = Query(..., description="Comma-separated expansion names"),
    count: int = Query(10, ge=1, le=20),
    db: Session = Depends(get_db),
):
    exp_names = [e.strip() for e in expansions.split(",") if e.strip()]

    q = db.query(Card).filter(
        Card.is_kingdom_card == True,
        Card.set_name.in_(exp_names),
    )

    total = q.count()
    if total < count:
        raise HTTPException(
            status_code=400,
            detail=f"Only {total} kingdom cards available in selected expansions, requested {count}",
        )

    ids = [r[0] for r in q.with_entities(Card.id).all()]
    selected_ids = random.sample(ids, count)
    selected_cards = db.query(Card).filter(Card.id.in_(selected_ids)).all()

    selected_cards = sorted(selected_cards, key=lambda c: selected_ids.index(c.id))

    expansions_meta = (
        db.query(Expansion).filter(Expansion.name.in_(exp_names)).all()
    )
    special_rules = []
    for exp in expansions_meta:
        if exp.adds_extra_cards and exp.extra_cards_description:
            special_rules.append(f"[{exp.name}] {exp.extra_cards_description}")
        if exp.modifies_starting_deck and exp.modifies_starting_description:
            special_rules.append(f"[{exp.name}] {exp.modifies_starting_description}")
        if exp.adds_events:
            special_rules.append(
                f"[{exp.name}] Esta expansión añade Events (cartas especiales que se compran como acción)."
            )
        if exp.adds_landmarks:
            special_rules.append(
                f"[{exp.name}] Esta expansión añade Landmarks (objetivos de puntuación adicionales)."
            )
        if exp.notes:
            special_rules.append(f"[{exp.name}] {exp.notes}")

    selected_names = {c.card_name for c in selected_cards}

    CARD_EXTRA_RULES = {
        "Witch": "Witch añade Maldiciones al suministro.",
        "Familiar": "Familiar añade Maldiciones al suministro.",
        "Cultist": "Cultist añade Ruinas al suministro.",
        "Marauder": "Marauder añade Ruinas y Spoils al suministro.",
        "Pillage": "Pillage añade Spoils al suministro.",
        "Bandit Camp": "Bandit Camp añade Spoils al suministro.",
        "Hermit": "Hermit añade Madman al suministro (fuera del suministro normal).",
        "Urchin": "Urchin añade Mercenary (se obtiene al traspasar Urchin).",
        "Young Witch": "Young Witch requiere un 11º mazo de Reino (Bane card) de coste $2-$3.",
        "Tournament": "Tournament añade los Prizes (Bolsa de Oro, Diadema, Seguidores, Princesa, Corcel Fiel).",
        "Page": "Page añade la cadena Traveller: Treasure Hunter → Disciple → Soldier → Fugitive → Hero → Champion.",
        "Peasant": "Peasant añade Teacher en la cadena Traveller.",
    }

    for name, rule in CARD_EXTRA_RULES.items():
        if name in selected_names:
            special_rules.append(f"[{name}] {rule}")

    EXTRA_PILES_CONFIG = [
        {
            "pile_label": "Colony & Platinum",
            "pile_label_es": "Colonia y Platino",
            "condition": "Prosperity" in exp_names,
            "card_names": ["Colony", "Platinum"],
        },
        {
            "pile_label": "Potion",
            "pile_label_es": "Poción",
            "condition": "Alchemy" in exp_names,
            "card_names": ["Potion"],
        },
        {
            "pile_label": "Ruins",
            "pile_label_es": "Ruinas",
            "condition": bool(selected_names & {"Cultist", "Marauder", "Death Cart"}),
            "card_names": ["Abandoned Mine", "Ruined Library", "Ruined Market", "Ruined Village", "Survivors"],
        },
        {
            "pile_label": "Spoils",
            "pile_label_es": "Botín",
            "condition": bool(selected_names & {"Marauder", "Bandit Camp", "Pillage"}),
            "card_names": ["Spoils"],
        },
        {
            "pile_label": "Madman",
            "pile_label_es": "Loco",
            "condition": "Hermit" in selected_names,
            "card_names": ["Madman"],
        },
        {
            "pile_label": "Mercenary",
            "pile_label_es": "Mercenario",
            "condition": "Urchin" in selected_names,
            "card_names": ["Mercenary"],
        },
        {
            "pile_label": "Prizes",
            "pile_label_es": "Premios",
            "condition": "Tournament" in selected_names,
            "card_names": ["Bag of Gold", "Diadem", "Followers", "Princess", "Trusty Steed"],
        },
        {
            "pile_label": "Wish",
            "pile_label_es": "Deseo",
            "condition": bool(selected_names & {"Leprechaun", "Magic Lamp"}),
            "card_names": ["Wish"],
        },
        {
            "pile_label": "Imp",
            "pile_label_es": "Diablillo",
            "condition": bool(selected_names & {"Devil's Workshop", "Tormentor"}),
            "card_names": ["Imp"],
        },
        {
            "pile_label": "Ghost",
            "pile_label_es": "Fantasma",
            "condition": bool(selected_names & {"Exorcist", "Haunted Mirror"}),
            "card_names": ["Ghost"],
        },
        {
            "pile_label": "Bat",
            "pile_label_es": "Murciélago",
            "condition": "Vampire" in selected_names,
            "card_names": ["Bat"],
        },
    ]

    extra_piles = []
    for config in EXTRA_PILES_CONFIG:
        if config["condition"]:
            cards = (
                db.query(Card)
                .filter(Card.card_name.in_(config["card_names"]))
                .all()
            )
            extra_piles.append(
                ExtraPileOut(
                    pile_label=config["pile_label"],
                    pile_label_es=config["pile_label_es"],
                    cards=[CardOut.model_validate(c) for c in cards],
                )
            )

    return RandomCardsResponse(
        cards=[CardOut.model_validate(c) for c in selected_cards],
        active_expansions=exp_names,
        special_rules=special_rules,
        extra_piles=extra_piles,
    )
