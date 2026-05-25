# Dominion Deck

Web app that generates random Dominion Kingdom card decks.

**Backend**: FastAPI + SQLAlchemy + SQLite  
**Frontend**: React + TypeScript + Vite  
**Infrastructure**: Docker Compose (nginx → backend:8000)

## Quick Start

### With Docker

```bash
docker compose build --no-cache && docker compose up -d
```

- Frontend: http://localhost
- API: http://localhost/api/expansions

### Development (without Docker)

**Backend**:
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (proxies `/api` to `localhost:8000`):
```bash
cd frontend
npm install
npm run dev   # → http://localhost:5173
```

## Running Tests

### Backend (pytest)

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python -m pytest tests/ -v
```

### Frontend (vitest)

```bash
cd frontend
npm install
npm test
```

### E2E (Playwright)

```bash
cd frontend
npx playwright test
```

## Test Plan

See [tests.md](tests.md) for the complete test plan with all phases and test cases.

| Phase | Status | Description |
|---|---|---|
| Phase 1 | Done | Backend API tests (pytest) — 36 tests |
| Phase 2 | Done | Frontend pure function tests (vitest) — card-images, translate-card-text, expansion-symbols |
| Phase 3 | Done | Frontend component tests (vitest + RTL) — App, CardSearchSidebar, CardDetailModal, ManualCardSelector |
| Phase 4 | Done | E2E tests (Playwright) — 6 tests |
| Phase 5 | Done | Docker health checks |

## Project Structure

```
dominion_deck/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI routes
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # DB connection
│   │   ├── seed.py          # CSV seeder
│   │   └── translations.py  # EN→ES translations
│   ├── tests/               # pytest tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── dominion_cards.csv
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main component
│   │   ├── api.ts           # API client
│   │   ├── types.ts         # TypeScript types
│   │   ├── card-images.ts   # Card image URLs
│   │   ├── expansion-symbols.ts  # SVG expansion symbols
│   │   ├── translate-card-text.ts # EN→ES text translation
│   │   ├── test-setup.ts    # Vitest setup (jest-dom matchers, mocks)
│   │   ├── components/      # React components
│   │   │   ├── CardSearchSidebar.tsx
│   │   │   ├── CardDetailModal.tsx
│   │   │   └── ManualCardSelector.tsx
│   │   └── index.css        # All styles
│   ├── e2e/                 # Playwright E2E tests
│   ├── Dockerfile
│   └── nginx.conf
├── .husky/
│   ├── pre-commit           # lint + test + build
│   └── pre-push             # test:e2e
├── docker-compose.yml
├── tests.md                 # Test plan
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expansions` | List all expansions |
| GET | `/api/cards?expansion=...&kingdom_only=true` | List cards |
| GET | `/api/cards/random?expansions=...&count=10` | Generate random deck |

## Commands Reference

### Frontend (`cd frontend/`)
| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server on :5173 (proxies `/api` → `:8000`) |
| `npm run build` | `tsc -b && vite build` — typecheck + production bundle |
| `npm run lint` | ESLint — check code style |
| `npm test` | Vitest — run unit + component tests (54 tests) |
| `npm run test:e2e` | Playwright E2E tests (requires Docker on :80) |
| `npx playwright test --ui` | Playwright UI mode (interactive debug) |

### Backend (`cd backend/`)
| Command | What it does |
|---------|-------------|
| `source venv/bin/activate` | Activate Python virtualenv |
| `uvicorn app.main:app --reload --port 8000` | Start dev server with hot reload |
| `python -m pytest tests/ -v` | Run all backend tests |
| `python -m pytest tests/ -v -k "test_name"` | Run specific test |

### Docker (project root `./`)
| Command | What it does |
|---------|-------------|
| `docker compose up -d` | Start containers (frontend on :80, backend on :8000) |
| `docker compose down` | Stop and remove containers |
| `docker compose down --rmi all --volumes` | Stop, remove containers, images, and volumes |
| `docker compose build --no-cache && docker compose up -d` | Full rebuild from scratch (re-seeds DB) |
| `docker compose restart` | Restart containers without rebuild |
| `docker compose logs -f` | Tail logs from all services |
| `docker compose logs -f backend` | Tail logs from backend only |
| `docker compose ps` | List running containers and their status |
| `docker compose exec backend curl http://localhost:8000/api/expansions` | Health check from inside the container |
| `docker image prune -f` | Remove dangling images |

### Git Hooks (automatic, via husky)
| Trigger | What runs |
|---------|-----------|
| `git commit` | `npm run lint && npm test && npm run build` (from `frontend/`) |
| `git push` | `npm run test:e2e` (requires Docker on :80) |
| `git push --no-verify` | Skip hooks (bypass e2e if Docker is down) |
