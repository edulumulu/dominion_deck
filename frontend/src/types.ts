export interface Expansion {
  id: number;
  name: string;
  name_es: string;
  adds_extra_cards: boolean;
  extra_cards_description: string;
  adds_events: boolean;
  adds_landmarks: boolean;
  modifies_starting_deck: boolean;
  modifies_starting_description: string;
  notes: string;
}

export interface Card {
  id: number;
  card_name: string;
  card_name_es: string;
  set_name: string;
  set_name_es: string;
  type: string;
  is_kingdom_card: boolean;
  cost: string;
  potion_cost: boolean;
  card_text: string;
  card_text_es: string;
}

export interface ExtraPile {
  pile_label: string;
  pile_label_es: string;
  cards: Card[];
}

export interface RandomCardsResponse {
  cards: Card[];
  active_expansions: string[];
  special_rules: string[];
  extra_piles: ExtraPile[];
}
