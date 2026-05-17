export interface Expansion {
  id: number;
  name: string;
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
  set_name: string;
  type: string;
  is_kingdom_card: boolean;
  cost: string;
  card_text: string;
}

export interface RandomCardsResponse {
  cards: Card[];
  active_expansions: string[];
  special_rules: string[];
}
