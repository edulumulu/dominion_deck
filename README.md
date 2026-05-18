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
uvicorn app.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
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
| Phase 2 | Pending | Frontend pure function tests (vitest) |
| Phase 3 | Pending | Frontend component tests (vitest + RTL) |
| Phase 4 | Pending | E2E tests (Playwright) |
| Phase 5 | Pending | Docker health checks |

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
│   │   ├── components/      # React components
│   │   └── index.css        # All styles
│   ├── Dockerfile
│   └── nginx.conf
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
