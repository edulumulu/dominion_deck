# Dominion Deck — Agent Instructions

## Project
Web app that generates random Dominion Kingdom card decks.
- **Backend**: FastAPI + SQLAlchemy + SQLite (`backend/app/`)
- **Frontend**: React + TypeScript + Vite (`frontend/src/`)
- **Infrastructure**: Docker Compose (nginx → backend:8000)

## Commands (run from `frontend/`)
| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite HMR dev server on :5173 |
| `npm run build` | `tsc -b && vite build` (typecheck + production bundle) |
| `npm run lint` | ESLint |
| `docker compose build --no-cache && docker compose up -d` | Full rebuild & restart |

## Architecture facts an agent will miss

- **All CSS is in one file**: `frontend/src/index.css` — no CSS modules or style libs.
- **UI strings are bilingual** via a `UI` map in `App.tsx` (`App.tsx:8-53`). EN/ES toggle stored in localStorage key `"lang"`. Card text is translated client-side by `translate-card-text.ts` (regex). Do NOT look for locale files or i18n libs.
- **Dark mode** is a `.light` class on `.app` div. Toggle stored in localStorage key `"theme"`.
- **Card images** come from `connorburt/dominion-cards` GitHub repo at 1260×2016 (5:8 ratio). URL built in `card-images.ts`. The CSS uses `object-fit: contain` and `aspect-ratio: 5 / 8`.
- **DB is SQLite** inside the container at `/app/dominion.db`. No volume is mounted — it is destroyed on container recreate. Data auto-seeds from `backend/dominion_cards.csv` on first startup. To re-seed: rebuild the backend container.
- **28 non-supply cards** (Ruins, Shelters, Prizes, Traveller upgrades, Spirits, Spoils, Madman, Mercenary) are forced `is_kingdom_card=0` by both the CSV data and a safety filter in `seed.py`.
- **No test framework** exists. The only verification is `npm run build`.
- **API proxy**: nginx forwards `/api/` to `backend:8000`. In dev mode the Vite server does not proxy — you must call the backend directly.

## Git conventions
- Feature branches: `feature/SN-XXXX`
- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`
- PR via `gh pr create --base main --head <branch>`

## Skills in this project
Skills are loaded automatically when a task matches their description:

- `skills/auto-commit/` — Git add, build verify, commit, push, PR creation
- `skills/docker-workflow/` — Docker build, restart, and health-check
