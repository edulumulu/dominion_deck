from pydantic import BaseModel


class ExpansionOut(BaseModel):
    id: int
    name: str
    name_es: str
    adds_extra_cards: bool
    extra_cards_description: str
    adds_events: bool
    adds_landmarks: bool
    modifies_starting_deck: bool
    modifies_starting_description: str
    notes: str

    model_config = {"from_attributes": True}


class CardOut(BaseModel):
    id: int
    card_name: str
    card_name_es: str
    set_name: str
    set_name_es: str
    type: str
    is_kingdom_card: bool
    cost: str
    potion_cost: bool = False
    card_text: str
    card_text_es: str = ""

    model_config = {"from_attributes": True}


class ExtraPileOut(BaseModel):
    pile_label: str
    pile_label_es: str
    cards: list[CardOut]


class RandomCardsResponse(BaseModel):
    cards: list[CardOut]
    active_expansions: list[str]
    special_rules: list[str]
    extra_piles: list[ExtraPileOut] = []
