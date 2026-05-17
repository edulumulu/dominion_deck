/**
 * Longer phrases must come before shorter ones so shared
 * prefixes are matched at the most specific level first.
 */

const PHRASES: [string, string][] = [
  ["This is not in the Supply", "No está en el Suministro"],
  ["This stays in play", "Esto permanece en juego"],
  ["the rest of the game", "el resto de la partida"],
  ["for the rest of the game", "por el resto de la partida"],

  // "set aside" as adjective comes BEFORE the verb form
  [" set aside cards", " cartas apartadas"],
  ["set aside cards", "cartas apartadas"],
  [" set aside card", " carta apartada"],
  ["set aside card", "carta apartada"],

  // Actions
  ["Directly after resolving an Action",
   "Justo después de resolver una Acción"],

  // Drawing
  ["Draw until", "Roba hasta"],
  ["draw until", "roba hasta"],
  ["draw an extra card", "roba una carta extra"],
  ["after you finish drawing", "después de terminar de robar"],
  ["finish drawing", "terminar de robar"],
  ["as you draw them", "mientras las robas"],
  ["as you draw", "mientras robas"],
  ["Draws ", "Roba "],
  ["draws ", "roba "],
  [" draws ", " roba "],
  [" Draw ", " Roba "],
  [" draw ", " roba "],
  [" drawn", " robadas"],
  [" drawing", " robando"],

  // Discard
  ["Discard any number of cards", "Descarta cualquier número de cartas"],
  ["Discard any number", "Descarta cualquier número"],
  ["discard any number", "descarta cualquier número"],
  ["discard the", "descarta las"],
  [" discard ", " descarta "],
  ["\nDiscard ", "\nDescarta "],
  ["Discard ", "Descarta "],
  [" discards ", " descarta "],
  ["Discards ", "Descarta "],
  ["Discard it", "Descártala"],
  ["discard it", "descártala"],
  ["discard them", "descartarlas"],

  // Trash
  ["Trash this card", "Elimina esta carta"],
  ["trash this card", "elimina esta carta"],
  [" trashed card", " carta eliminada"],
  [" trashed cards", " cartas eliminadas"],
  ["Trashed cards", "Cartas eliminadas"],
  ["the trashed card", "la carta eliminada"],
  ["the trashed cards", "las cartas eliminadas"],
  [" trashes", " elimina"],
  [" trash ", " elimina "],
  ["\nTrash ", "\nElimina "],
  ["Trash ", "Elimina "],

  // Gain
  ["Gain a ", "Gana un "],
  ["gain a ", "gana un "],
  ["Gain an ", "Gana un "],
  ["gain an ", "gana un "],

  // Put into / on top
  ["put them into your hand", "ponlos en tu mano"],
  ["put it into your hand", "ponlo en tu mano"],
  [" into your hand", " a tu mano"],
  [" on top of your deck", " sobre tu mazo"],
  ["on top of your deck", "sobre tu mazo"],
  [" on top of", " sobre"],
  ["putting them on top", "poniéndolos sobre"],
  ["putting it on top", "poniéndolo sobre"],

  // Turn references
  [" at the start of your next turn",
   " al comienzo de tu próximo turno"],
  ["At the start of your next turn",
   "Al comienzo de tu próximo turno"],
  [" at the start of your turn",
   " al comienzo de tu turno"],
  ["At the start of your turn",
   "Al comienzo de tu turno"],
  [" when you discard this from play",
   " cuando descartes esto de juego"],
  ["When you discard this from play",
   "Cuando descartes esto de juego"],
  [" when you play this",
   " cuando juegues esto"],
  ["When you play this",
   "Cuando juegues esto"],
  [" when you gain this",
   " cuando ganes esto"],
  ["When you gain this",
   "Cuando ganes esto"],
  [" when you buy this",
   " cuando compres esto"],
  ["When you buy this",
   "Cuando compres esto"],
  [" when you trash this",
   " cuando elimines esto"],
  ["When you trash this",
   "Cuando elimines esto"],
  [" a turn", " un turno"],
  [" this turn", " este turno"],
  ["This turn", "Este turno"],
  ["next turn", "próximo turno"],
  ["last turn", "último turno"],
  ["an extra turn", "un turno extra"],

  // Player references
  ["the player to your left", "el jugador a tu izquierda"],
  ["the player to your right", "el jugador a tu derecha"],
  ["Other players", "Los demás jugadores"],
  ["each other player", "cada otro jugador"],
  ["Each other player", "Cada otro jugador"],
  ["revealed a hand with no", "revelado una mano sin"],
  ["Reveal a hand with no", "Revela una mano sin"],

  // Hand / deck
  [" your hand", " tu mano"],
  ["Your hand", "Tu mano"],
  [" your discard pile", " tu pila de descartes"],
  ["Your discard pile", "Tu pila de descartes"],
  [" your deck", " tu mazo"],
  ["Your deck", "Tu mazo"],
  ["your choice", "tu elección"],
  ["your choosing", "tu elección"],

  // Reveal
  ["Reveal the top", "Revela las primeras"],
  ["reveal the top", "revela las primeras"],
  ["Reveal your hand", "Revela tu mano"],
  ["reveal your hand", "revela tu mano"],
  ["reveal a card", "revela una carta"],
  ["Reveal a card", "Revela una carta"],
  ["reveal a Treasure", "revela un Tesoro"],
  [" Reveal ", " Revela "],
  [" reveal ", " revela "],

  // Supply
  ["the Supply", "el Suministro"],
  ["The Supply", "El Suministro"],
  ["supply pile", "pila del suministro"],
  ["Supply pile", "pila del Suministro"],
  ["supply piles", "pilas del suministro"],
  ["Supply piles", "pilas del Suministro"],
  ["If there are one or more empty Supply piles",
   "Si hay una o más pilas del Suministro vacías"],

  // Set aside (verb – comes AFTER adjective patterns)
  ["set aside", "apartar"],
  ["Set aside", "Aparta"],
  ["setting it aside", "apartándola"],
  ["set it aside", "apártala"],

  // Cost
  ["costing exactly", "que cueste exactamente"],
  ["costing up to", "que cueste hasta"],
  ["costing at most", "que cueste como máximo"],
  ["costing less than", "que cueste menos de"],
  ["costs ", "cuesta "],
  ["The cards cost", "Las cartas cuestan"],
  ["cards cost", "cartas cuestan"],

  // VP
  ["Worth 0 VP", "Vale 0 PV"],
  ["Worth 1VP", "Vale 1PV"],
  ["Worth 2VP", "Vale 2PV"],
  ["Worth 3VP", "Vale 3PV"],
  ["Worth 4VP", "Vale 4PV"],
  ["Worth 5VP", "Vale 5PV"],
  ["Worth 6VP", "Vale 6PV"],
  ["Worth 10VP", "Vale 10PV"],

  // Misc common
  ["Choose one", "Elige una"],
  ["Choose two", "Elige dos"],
  ["You may", "Puedes"],
  ["you may", "puedes"],
  ["you can", "puedes"],
  [" at least", " al menos"],
  ["at least", "al menos"],
  [" face down", " boca abajo"],
  [" face up", " boca arriba"],
  ["face down", "boca abajo"],
  ["face up", "boca arriba"],
  [" in any order", " en cualquier orden"],
  ["in either order", "en cualquier orden"],
  ["Do this twice", "Haz esto dos veces"],
  ["(round down)", "(redondeado hacia abajo)"],
  ["(rounded down)", "(redondeado hacia abajo)"],
  ["other than", "que no sea"],
  ["instead of", "en lugar de"],
  ["a copy of it", "una copia de ella"],
  ["a copy of that", "una copia de esa"],
  ["a copy of", "una copia de"],
  [" at the end of the game",
   " al final de la partida"],
  [" at end of turn", " al final del turno"],
  ["(at end of turn)", "(al final del turno)"],
  ["At the end of", "Al final de"],
  [" at the end of", " al final de"],
  ["Once per game", "Una vez por partida"],
  ["Once per turn", "Una vez por turno"],
  [" per ", " por "],
  ["Per ", "Por "],
  [" differently named card",
   " carta de nombre diferente"],
  ["differently named card",
   "carta de nombre diferente"],
  [" differently named cards",
   " cartas de nombre diferente"],
  ["differently named cards",
   "cartas de nombre diferente"],
  ["may look through", "puede buscar en"],
  ["You may look at", "Puedes mirar"],
  ["you may look at", "puedes mirar"],
  ["Look through", "Busca en"],
  ["look through", "busca en"],
  ["When scoring", "Al puntuar"],
  ["When you would", "Cuando fueras a"],
  ["When you gain", "Cuando ganas"],
  ["When you ", "Cuando "],
  ["may choose", "puede elegir"],
  ["no cards in hand", "sin cartas en la mano"],
  [" 5 cards", " 5 cartas"],
  [" 4 cards", " 4 cartas"],
  [" 3 cards", " 3 cartas"],
  [" 2 cards", " 2 cartas"],
  ["It's your ", "Es tu "],
  ["it's your ", "es tu "],

  // Short verbs (broad, keep late)
  ["Gain ", "Gana "],
  ["gain ", "gana "],
  ["costing ", "que cueste "],

  // the Coppers / Gold / Silver
  ["the Coppers", "los Cobres"],
  ["the Gold", "el Oro"],
  ["the Silver", "la Plata"],
];

const TYPES: [string, string][] = [
  ["Action-Attack-Duration", "Acción-Ataque-Duración"],
  ["Action-Attack-Knight", "Acción-Ataque-Caballero"],
  ["Action-Attack-Looter", "Acción-Ataque-Saqueador"],
  ["Action-Duration-Reaction", "Acción-Duración-Reacción"],
  ["Action-Reserve-Victory", "Acción-Reserva-Victoria"],
  ["Action-Attack-Traveller", "Acción-Ataque-Viajero"],
  ["Action-Attack", "Acción-Ataque"],
  ["Action-Duration", "Acción-Duración"],
  ["Action-Treasure", "Acción-Tesoro"],
  ["Action-Prize", "Acción-Premio"],
  ["Action-Reaction", "Acción-Reacción"],
  ["Action-Reserve", "Acción-Reserva"],
  ["Action-Traveller", "Acción-Viajero"],
  ["Action-Looter", "Acción-Saqueador"],
  ["Action-Ruins", "Acción-Ruinas"],
  ["Action-Shelter", "Acción-Shelter"],
  ["Action-Gathering", "Acción-Reunión"],
  ["Action-Victory", "Acción-Victoria"],
  ["Victory-Reaction", "Victoria-Reacción"],
  ["Victory-Castle", "Victoria-Castillo"],
  ["Victory-Shelter", "Victoria-Refugio"],
  ["Treasure-Reaction", "Tesoro-Reacción"],
  ["Treasure-Reserve", "Tesoro-Reserva"],
  ["Treasure-Prize", "Tesoro-Premio"],
  ["Treasure-Attack", "Tesoro-Ataque"],
  ["Treasure-Victory", "Tesoro-Victoria"],
  ["Reaction-Shelter", "Reacción-Refugio"],
  ["Victory card", "carta de Victoria"],
  ["Action card", "carta de Acción"],
  ["Treasure card", "carta de Tesoro"],
  ["Attack card", "carta de Ataque"],
  ["Victory cards", "cartas de Victoria"],
  ["Action cards", "cartas de Acción"],
  ["Treasure cards", "cartas de Tesoro"],
  ["Attack cards", "cartas de Ataque"],
  ["Reserve", "Reserva"],
  ["Duration", "Duración"],
  ["Reaction", "Reacción"],
  ["Gathering", "Reunión"],
  ["Traveller", "Viajero"],
  ["Shelter", "Refugio"],
  ["Castle", "Castillo"],
  ["Prize", "Premio"],
  ["Knight", "Caballero"],
  ["Looter", "Saqueador"],
  ["Page", "Paje"],
  ["Peasant", "Campesino"],
  ["Event", "Evento"],
  ["Landmark", "Monumento"],
  ["Ruins", "Ruinas"],
];

const CARD_NAMES: [string, string][] = [
  ["Copper", "Cobre"],
  ["Silver", "Plata"],
  ["Gold", "Oro"],
  ["Estate", "Finca"],
  ["Duchy", "Ducado"],
  ["Province", "Provincia"],
  ["Curse", "Maldición"],
  ["Potion", "Poción"],
  ["Platinum", "Platino"],
  ["Colony", "Colonia"],
  ["Spoils", "Botín"],
  ["Madman", "Loco"],
  ["Mercenary", "Mercenario"],
  ["Champion", "Campeón"],
  ["Teacher", "Maestro"],
  ["Disciple", "Discípulo"],
  ["Hero", "Héroe"],
  ["Warrior", "Guerrero"],
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyPhrases(
  text: string,
  phrases: [string, string][],
  caseSensitive = false,
): string {
  let result = text;
  for (const [from, to] of phrases) {
    const flags = caseSensitive ? "g" : "gi";
    const escaped = escapeRegex(from);
    const regex = new RegExp(escaped, flags);
    result = result.replace(regex, to);
  }
  return result;
}

export function translateCardText(text: string): string {
  let result = text
    .replace(/\\n/g, "\n")
    .replace(/\\d/g, "\n—\n");

  result = applyPhrases(result, PHRASES);
  result = applyPhrases(result, TYPES);
  result = applyPhrases(result, CARD_NAMES);

  // Word-level catch-all for remaining common words
  result = result.replace(/\bdiscard(s|ed)?\b/gi, "descarta");
  result = result.replace(/\bhand(s)?\b/gi, "mano");
  result = result.replace(/\bdeck(s)?\b/gi, "mazo");
  result = result.replace(/\bturn(s)?\b/gi, "turno");
  result = result.replace(/\bcoin\b/gi, "moneda");
  result = result.replace(/\bcoins\b/gi, "monedas");

  // Plural vs singular
  result = result.replace(/\bcard(s?)\b/gi, (_, s) =>
    s ? "cartas" : "carta",
  );

  // +/- structured syntax
  result = result.replace(
    /\+(1) Card\(s?\)/gi, "+$1 Carta",
  );
  result = result.replace(
    /\+(1) Card(s)?\b/gi, "+$1 Carta",
  );
  result = result.replace(
    /\+(2|\d+) Card(s)?\b/gi, "+$1 Cartas",
  );
  result = result.replace(
    /\+(1) Action\(s?\)/gi, "+$1 Acción",
  );
  result = result.replace(
    /\+(1) Action(s)?\b/gi, "+$1 Acción",
  );
  result = result.replace(
    /\+(2|\d+) Action(s)?\b/gi, "+$1 Acciones",
  );
  result = result.replace(
    /\+(1) Buy\(s?\)/gi, "+$1 Compra",
  );
  result = result.replace(
    /\+(1) Buy(s)?\b/gi, "+$1 Compra",
  );
  result = result.replace(
    /\+(2|\d+) Buy(s)?\b/gi, "+$1 Compras",
  );
  result = result.replace(/\+(1)VP\b/gi, "+$1 PV");
  result = result.replace(/\+(2|\d+)VP\b/gi, "+$1 PV");
  result = result.replace(
    /\+(1) Victory\b/gi, "+$1 Victoria",
  );
  result = result.replace(
    /\+(2|\d+) Victory\b/gi, "+$1 Victorias",
  );

  // Card(s) parenthetical notation
  result = result.replace(
    /\bCard\(s?\)\b/gi, "Carta",
  );

  return result;
}
