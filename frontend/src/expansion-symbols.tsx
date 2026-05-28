import type { ReactNode } from "react";

const SYMBOLS: Record<string, ReactNode> = {
  Dominion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
    </svg>
  ),
  Intrigue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="4"/>
      <circle cx="16" cy="16" r="4"/>
      <path d="M8 12v4M16 8v4"/>
    </svg>
  ),
  Seaside: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20c2-4 6-4 8 0s4-4 8-4"/>
      <path d="M2 16c3-3 6-2 8 1s4-3 7-2"/>
      <path d="M12 12v8"/>
      <path d="M9 2l3 4 3-4"/>
    </svg>
  ),
  Alchemy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v6l-4 6v2h12v-2l-4-6V2"/>
      <path d="M8 14c0 2 2 3 4 3s4-1 4-3"/>
      <path d="M7 2h10"/>
    </svg>
  ),
  Prosperity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
  ),
  Cornucopia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20c2-2 6-6 8-10 1.5-3 1-6 1-6s2 2 3 5c1 3 1 6-2 9"/>
      <path d="M5 19c-2 0-3-1-3-3s1-4 4-5"/>
      <path d="M16 8c1.5-1.5 4-2 5.5-.5s1 4-.5 5.5"/>
    </svg>
  ),
  Hinterlands: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  "Dark Ages": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 4 3 8 3 14c0 4 3 7 9 8 6-1 9-4 9-8 0-6-3.5-10-9-12z"/>
      <path d="M8 14c0-2 1-4 4-4s4 2 4 4"/>
      <path d="M12 10v6"/>
    </svg>
  ),
  Guilds: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 6v12M8 10h8M8 14h6"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  Adventures: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>
      <path d="M12 12l4-4M12 12l-4 4M12 12l4 4M12 12l-4-4"/>
    </svg>
  ),
  Empires: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
      <path d="M8 7a4 4 0 118 0 4 4 0 01-8 0"/>
      <path d="M12 3v2M12 9v2"/>
    </svg>
  ),
  Nocturne: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  Renaissance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 22c0-4 4-8 8-8s8 4 8 8"/>
      <path d="M12 12v10"/>
    </svg>
  ),
  Promo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"/>
    </svg>
  ),
  "Base Cards": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <path d="M8 7h8M8 12h8M8 17h5"/>
    </svg>
  ),
};

export function getExpansionSymbol(name: string): ReactNode {
  return SYMBOLS[name] || SYMBOLS["Dominion"];
}
