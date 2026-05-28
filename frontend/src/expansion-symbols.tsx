const SYMBOL_MAP: Record<string, string> = {
  Dominion: "/symbols/dominion-2ed.png",
  Intrigue: "/symbols/intrigue-2ed.png",
  Seaside: "/symbols/seaside-2ed.png",
  Alchemy: "/symbols/alchemy.png",
  Prosperity: "/symbols/prosperity-2ed.png",
  Cornucopia: "/symbols/cornucopia.png",
  Hinterlands: "/symbols/hinterlands-2ed.png",
  "Dark Ages": "/symbols/darkages.png",
  Guilds: "/symbols/guilds.png",
  Adventures: "/symbols/adventures.png",
  Empires: "/symbols/empires.png",
  Nocturne: "/symbols/nocturne.png",
  Renaissance: "/symbols/renaissance.png",
  Menagerie: "/symbols/menagerie.png",
  Allies: "/symbols/allies.png",
  Plunder: "/symbols/plunder.png",
  "Rising Sun": "/symbols/risingsun.png",
};

export function getExpansionSymbolSrc(name: string): string | null {
  return SYMBOL_MAP[name] ?? null;
}
