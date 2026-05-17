---
name: docker-workflow
description: Rebuild, restart, and health-check Docker containers for this project. Trigger when the user says "build docker", "reconstruye docker", "reinicia los contenedores", "rebuild", "docker compose", "restart containers", or any similar request to rebuild or restart the Docker infrastructure. Do NOT trigger when the user is only making small frontend changes they plan to test via `npm run dev`.
---

# Docker Workflow

Rebuild both Docker images from scratch, restart containers, and verify the API is healthy.

## Steps

1. **Rebuild both images** — always use `--no-cache` to force a fresh build (the SQLite DB is inside the container and needs to be re-seeded from the CSV):
   ```bash
   docker compose build --no-cache
   ```
   Run this from the project root (`docker-compose.yml` location).

2. **Restart containers**:
   ```bash
   docker compose up -d
   ```

3. **Wait and verify API is healthy**:
   ```bash
   sleep 3
   curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/expansions
   ```
   - If the response is `200`, report success.
   - If not, show the last 20 lines of logs from both services:
     ```bash
     docker compose logs --tail 20 backend
     docker compose logs --tail 20 frontend
     ```

4. **Tell the user** that the services are running and which endpoints are available:
   - Frontend: http://localhost/
   - API: http://localhost:8000/docs
