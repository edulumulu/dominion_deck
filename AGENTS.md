# Dominion Deck — Agent Instructions

## Project
Web app that generates random Dominion Kingdom card decks.
- **Backend**: FastAPI + SQLAlchemy (`backend/app/`)
- **Frontend**: React 19 + TypeScript + Vite (`frontend/src/`)
- **Infrastructure**: Docker Compose — nginx (`:80`) → backend (`:8000`) → PostgreSQL (`:5432`)

## Database

- **Local dev** (no Docker): SQLite at `./dominion.db` — default when `DATABASE_URL` is unset.
- **Docker / production**: PostgreSQL 16, credentials from env vars (`DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- DB auto-seeds from `backend/dominion_cards.csv` on first startup (`seed.py`).
- No volume is mounted for the backend container — data lives in the `pgdata` Docker volume. To re-seed: rebuild the backend container.
- 28 non-supply cards (Ruins, Shelters, Prizes, Traveller upgrades, Spirits, Spoils, Madman, Mercenary) are forced `is_kingdom_card=0` by both the CSV and a safety filter in `seed.py`.

## Commands (run from `frontend/`)
| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite HMR dev server on :5173 (proxies `/api` → `localhost:8000`) |
| `npm run build` | `tsc -b && vite build` (typecheck + production bundle) |
| `npm run lint` | ESLint |
| `npm test` | vitest (unit + component tests) |
| `npm run test:e2e` | Playwright E2E tests (Docker must be running on :80) |
| `docker compose build --no-cache && docker compose up -d` | Full rebuild & restart |

## Versioning

The project follows **Semantic Versioning** (`MAJOR.MINOR.PATCH`). Version must be kept in sync across two files:

| File | Field |
|---|---|
| `frontend/package.json` | `"version"` |
| `backend/app/main.py` | `FastAPI(..., version="...")` |

**When to bump:**

- `PATCH` (x.x.**N**): bug fixes, no behavior change visible to users
- `MINOR` (x.**N**.0): new feature, backwards-compatible
- `MAJOR` (**N**.0.0): breaking change (API incompatible, major redesign)

**Rule**: whenever a change warrants a version bump, update both files in the same commit and create a git tag (`git tag vX.Y.Z`).

## Git hooks (husky)
- **pre-commit**: runs `frontend/`: lint → test → build. Fails the commit if any step fails.
- **pre-push**: runs `frontend/`: test:e2e. Requires Docker on :80. Use `git push --no-verify` to skip.

## Architecture facts an agent will miss

- **All CSS is in one file**: `frontend/src/index.css` — no CSS modules or style libs.
- **UI strings are bilingual** via a `UI` map in `App.tsx` (`App.tsx:8-53`). EN/ES toggle stored in localStorage key `"lang"`. Card text is stored in the DB column `card_text_es` (populated from the official Spanish PDF for sets up to Dark Ages, auto-translated for newer sets). The old client-side translator (`translate-card-text.ts`) has been removed.
- **Dark mode** is a `.light` class on `.app` div. Toggle stored in localStorage key `"theme"`.
- **Card images** come from `connorburt/dominion-cards` GitHub repo at 1260×2016 (5:8 ratio). URL built in `card-images.ts`. The CSS uses `object-fit: contain` and `aspect-ratio: 5 / 8`.
- **Unit/component tests**: vitest in `frontend/src/*.test.ts(x)`. Component tests use jsdom + RTL.
- **E2E tests**: Playwright in `frontend/e2e/`. Requires Docker running on :80.
- **API proxy**: nginx forwards `/api/` to `backend:8000` in production. In dev mode the Vite server proxies `/api` → `localhost:8000`.

## Git conventions
- Feature branches: `feature/SN-XXXX`
- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`
- PR via `gh pr create --base main --head <branch>`

## Security

- Never commit `.env` files or secrets.
- CORS origins configured via the `CORS_ORIGINS` env var.
- All endpoints have rate limiting via `slowapi`.
- The backend runs as a non-root user in Docker.

## Skills in this project
Skills are loaded automatically when a task matches their description:

- `skills/auto-commit/` — Git add, build verify, commit, push, PR creation
- `skills/docker-workflow/` — Docker build, restart, and health-check
