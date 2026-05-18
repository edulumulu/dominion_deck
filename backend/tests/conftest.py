import csv
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import Card, Expansion
from app.translations import CARD_TRANSLATIONS, EXPANSION_TRANSLATIONS


def _seed(session):
    csv_path = os.path.join(os.path.dirname(__file__), "..", "dominion_cards.csv")
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            eng_name = row["card_name"]
            eng_set = row["set_name"]
            raw_is_kingdom = row["is_kingdom_card"].strip() == "1"
            card_type = row["type"]
            card_text = row["card_text"]
            is_kingdom = (
                raw_is_kingdom
                and "This is not in the Supply." not in card_text
                and not any(card_type.endswith(t) for t in ["Ruins", "Shelter", "Prize"])
            )
            session.add(Card(
                card_name=eng_name,
                card_name_es=CARD_TRANSLATIONS.get(eng_name, eng_name),
                set_name=eng_set,
                set_name_es=EXPANSION_TRANSLATIONS.get(eng_set, eng_set),
                type=card_type,
                is_kingdom_card=is_kingdom,
                cost=row["cost"],
                card_text=card_text,
            ))

    expansion_meta = {
        "Dominion": {"adds_extra_cards": False, "extra_cards_description": "", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Expansión base. 25 cartas de Reino."},
        "Intrigue": {"adds_extra_cards": False, "extra_cards_description": "", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": ""},
        "Seaside": {"adds_extra_cards": False, "extra_cards_description": "", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Introduce cartas Duration (se quedan en juego entre turnos)."},
        "Alchemy": {"adds_extra_cards": True, "extra_cards_description": "Añade la carta Potion al suministro como Treasure especial para costes con poción.", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Los costes incluyen Þ (Potion). Requiere tener Potion en el suministro."},
        "Prosperity": {"adds_extra_cards": True, "extra_cards_description": "Añade Platinum ($9, vale $5) y Colony (10VP) al suministro.", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Expansión de lujo. Añade cartas de alto coste."},
        "Cornucopia": {"adds_extra_cards": True, "extra_cards_description": "Young Witch requiere un 11º mazo de Reino (Bane card) de coste $2-$3.", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Incluye cartas Prize (fuera del suministro)."},
        "Hinterlands": {"adds_extra_cards": False, "extra_cards_description": "", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Cartas con efectos al ganarlas."},
        "Dark Ages": {"adds_extra_cards": True, "extra_cards_description": "Reemplaza los Estates iniciales por Shelters (Necropolis, Hovel, Overgrown Estate). Añade Ruins y Spoils.", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": True, "modifies_starting_description": "Cada jugador empieza con Necropolis, Hovel, Overgrown Estate en vez de 3 Estates.", "notes": "Introduce cartas Looter, Ruins, Shelter, Knight, Spoils."},
        "Guilds": {"adds_extra_cards": True, "extra_cards_description": "Introduce Coin tokens y la mecánica de overpay (pagar de más).", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Varias cartas tienen coste X+ (se puede pagar más de su coste base para obtener efectos extra)."},
        "Adventures": {"adds_extra_cards": True, "extra_cards_description": "Añade Events (cartas especiales que se compran como una acción). Introduce Tavern mat y Reserve tokens.", "adds_events": True, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Incluye cartas Reserve, Duration, Traveller, y Event tokens."},
        "Empires": {"adds_extra_cards": True, "extra_cards_description": "Añade Events, Landmarks, y split piles (2 cartas diferentes en un mismo mazo). Introduce Debt tokens.", "adds_events": True, "adds_landmarks": True, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Los split piles contienen 5 de una carta encima y 5 de otra debajo."},
        "Promo": {"adds_extra_cards": False, "extra_cards_description": "", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Cartas promocionales."},
        "Nocturne": {"adds_extra_cards": True, "extra_cards_description": "Introduce cartas Night, Heirlooms (reemplazan Coppers iniciales), y States.", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": True, "modifies_starting_description": "Algunas cartas reemplazan los Coppers iniciales por Heirlooms.", "notes": "Incluye cartas Night (se juegan después de la Buy phase), States, y Boons/Hexes."},
        "Renaissance": {"adds_extra_cards": True, "extra_cards_description": "Introduce Projects (mejoras permanentes que se compran) y Artifacts.", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Incluye cartas Coffers y Villagers."},
        "Base Cards": {"adds_extra_cards": False, "extra_cards_description": "", "adds_events": False, "adds_landmarks": False, "modifies_starting_deck": False, "modifies_starting_description": "", "notes": "Cartas base del juego (Copper, Silver, Gold, Estate, Duchy, Province, Curse, etc.)"},
    }
    for name, meta in expansion_meta.items():
        session.add(Expansion(
            name=name,
            name_es=EXPANSION_TRANSLATIONS.get(name, name),
            **meta,
        ))
    session.commit()


@pytest.fixture(scope="session")
def test_engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    with Session() as session:
        _seed(session)
    return engine


@pytest.fixture
def client(test_engine):
    TestSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    def override_get_db():
        db = TestSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as tc:
        yield tc
    app.dependency_overrides.clear()
