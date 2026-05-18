from sqlalchemy import Boolean, Column, Integer, String, Text
from app.database import Base


class Expansion(Base):
    __tablename__ = "expansions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    name_es = Column(String, default="")
    adds_extra_cards = Column(Boolean, default=False)
    extra_cards_description = Column(Text, default="")
    adds_events = Column(Boolean, default=False)
    adds_landmarks = Column(Boolean, default=False)
    modifies_starting_deck = Column(Boolean, default=False)
    modifies_starting_description = Column(Text, default="")
    notes = Column(Text, default="")


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    card_name = Column(String, nullable=False)
    card_name_es = Column(String, default="")
    set_name = Column(String, nullable=False)
    set_name_es = Column(String, default="")
    type = Column(String, nullable=False)
    is_kingdom_card = Column(Boolean, default=True)
    cost = Column(String, nullable=False)
    potion_cost = Column(Boolean, default=False)
    card_text = Column(Text, default="")
