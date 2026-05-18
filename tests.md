# Dominion Deck — Test Plan

## Architecture
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Frontend**: React + TypeScript + Vite
- **Infrastructure**: Docker Compose (nginx → backend:8000)

---

## Phases

### Phase 1 — Backend API Tests (pytest) ✅ COMPLETED
**Goal**: Cover the core API endpoints and business logic.
**Status**: 36 tests passing in 0.8s.

| Test | Endpoint / Module | What it verifies |
|---|---|---|
| `test_list_expansions` | `GET /api/expansions` | Returns all expansions with correct fields |
| `test_list_cards` | `GET /api/cards` | Returns all kingdom cards |
| `test_list_cards_by_expansion` | `GET /api/cards?expansion=Dominion` | Filters cards by set |
| `test_list_cards_kingdom_only_excludes` | `GET /api/cards?kingdom_only=true` | Excludes Ruins, Shelters, Prizes, Spoils, Madman, Mercenary |
| `test_list_cards_all_includes` | `GET /api/cards?kingdom_only=false` | Includes non-kingdom cards |
| `test_random_cards_count` | `GET /api/cards/random?...&count=10` | Returns exactly 10 cards |
| `test_random_cards_no_duplicates` | `GET /api/cards/random?...` | All returned cards have unique IDs |
| `test_random_cards_kingdom_only` | `GET /api/cards/random?...` | Only kingdom cards returned |
| `test_random_cards_from_selected_expansions` | `GET /api/cards/random?...` | All cards belong to requested expansions |
| `test_random_cards_too_many` | `GET /api/cards/random?...&count=999` | Returns 400 with error message |
| `test_random_cards_count_validation` | `GET /api/cards/random?...&count=0` | Returns 422 (validation) |
| `test_random_cards_special_rules` | `GET /api/cards/random?...` | Special rules appear for selected expansions |
| `test_random_cards_witch_rule` | `GET /api/cards/random?...` | Witch rule appears when Witch is in result |
| `test_random_cards_response_shape` | `GET /api/cards/random?...` | Response has `cards`, `active_expansions`, `special_rules` |
| `test_seed_no_duplicates` | `seed.py` | Calling `seed_database()` twice doesn't duplicate data |
| `test_seed_non_supply_cards` | `seed.py` | Ruins, Shelters, Prizes have `is_kingdom_card=False` |
| `test_seed_translations` | `seed.py` | Card names have Spanish translations |
| `test_expansion_schema` | `schemas.py` | `ExpansionOut` serializes from ORM |
| `test_card_schema` | `schemas.py` | `CardOut` serializes from ORM |
| `test_random_response_schema` | `schemas.py` | `RandomCardsResponse` has correct structure |

---

### Phase 2 — Frontend Pure Function Tests (vitest)
**Goal**: Test deterministic utility functions with no side effects.

| Test | Module | What it verifies |
|---|---|---|
| `getCardImageUrl("Witch")` | `card-images.ts` | Returns URL ending with `witch.jpg` |
| `getCardImageUrl("King's Court")` | `card-images.ts` | Returns URL ending with `kings-court.jpg` |
| `getCardImageUrl` strips apostrophes and normalizes | `card-images.ts` | URL-safe slug |
| `getExpansionSymbol("Dominion")` | `expansion-symbols.ts` | Returns valid SVG string |
| `getExpansionSymbol("Unknown")` | `expansion-symbols.ts` | Falls back to Dominion SVG |
| `translateCardText` translates phrases | `translate-card-text.ts` | "Draw a card" → "Roba una carta" |
| `translateCardText` handles +N Card(s) | `translate-card-text.ts` | `+2 Card(s)` → `+2 Cartas` |
| `translateCardText` handles +N Action(s) | `translate-card-text.ts` | `+1 Action` → `+1 Acción` |
| `translateCardText` handles +N Buy(s) | `translate-card-text.ts` | `+1 Buy` → `+1 Compra` |
| `translateCardText` handles +N VP | `translate-card-text.ts` | `+2VP` → `+2 PV` |
| `translateCardText` preserves English if no match | `translate-card-text.ts` | Unknown text stays unchanged |
| `translateCardText` handles escaped newlines | `translate-card-text.ts` | `\\n` → newline, `\\d` → `—` |
| `translateCardText` translates card types | `translate-card-text.ts` | "Action-Attack" → "Acción-Ataque" |

---

### Phase 3 — Frontend Component Tests (vitest + RTL)
**Goal**: Test React components render and interact correctly.

| Test | Component | What it verifies |
|---|---|---|
| App renders title and expansion grid | `App.tsx` | UI loads with expansions |
| Select/deselect expansion toggles state | `App.tsx` | Click updates selection |
| "Select All" marks every expansion | `App.tsx` | All checkboxes checked |
| "Clear" deselects everything | `App.tsx` | No expansions selected |
| Generate without selection shows error | `App.tsx` | Error message displayed |
| Language toggle switches EN ↔ ES | `App.tsx` | UI strings change |
| Theme toggle toggles `.light` class on `<html>` | `App.tsx` | Class applied immediately |
| Search filters cards by name | `CardSearchSidebar.tsx` | Input filters list |
| Search shows "No results" when empty | `CardSearchSidebar.tsx` | Empty state renders |
| Modal closes on ESC key | `CardDetailModal.tsx` | Keyboard event works |
| Modal closes on overlay click | `CardDetailModal.tsx` | Click outside works |
| Modal shows translated text in ES | `CardDetailModal.tsx` | Card text is Spanish |

---

### Phase 4 — E2E Tests (Playwright)
**Goal**: Full browser flows through Docker-served app.

| Flow | What it verifies |
|---|---|
| Full deck generation | Select expansions → generate → 10 cards visible with images |
| Language toggle | Toggle language → all UI + card names change |
| Theme toggle | Toggle theme → background changes |
| Card search → detail modal | Search → click → modal opens → ESC closes |
| Network error handling | Backend down → user-friendly error shown |
| Empty state | No action taken → empty state message shown |

---

### Phase 5 — Docker Health Checks
**Goal**: CI/CD and runtime infrastructure verification.

| Check | What it verifies |
|---|---|
| `GET /api/expansions` returns 200 | Backend is running |
| `GET /` returns HTML | Frontend nginx is serving |
| `/api/` proxy works | nginx routes to backend correctly |
| DB has cards after startup | Seed ran successfully |

---

## Implementation order

1. **Phase 1** ✅ — Backend tests (pytest) — 36 tests, 0.8s
2. **Phase 2** — Frontend pure functions (vitest) — easy wins, bug-prone code
3. **Phase 3** — Frontend components (vitest + RTL) — UI interaction
4. **Phase 4** — E2E (Playwright) — full flows
5. **Phase 5** — Docker health checks — CI/CD
