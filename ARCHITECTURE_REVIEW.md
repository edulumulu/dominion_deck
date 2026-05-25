# Análisis de Arquitectura y Seguridad — Dominion Deck

> Fecha: 2026-05-25  
> Objetivo: Publicar el proyecto en producción como aplicación pública para construcción de mazos.

---

## 1. Visión general del stack

| Capa | Tecnología |
|------|-----------|
| Backend | FastAPI + SQLAlchemy ORM |
| Base de datos | PostgreSQL (Docker) / SQLite (dev) |
| Frontend | React 19 + TypeScript + Vite |
| Servidor web | nginx (proxy inverso) |
| Infraestructura | Docker Compose |
| Tests backend | pytest (36 tests) |
| Tests frontend | Vitest (54 tests) + Playwright E2E (6 tests) |
| CI/CD | GitHub Actions (solo en PRs) |

La arquitectura es sencilla y apropiada para el tamaño del proyecto. Las debilidades son principalmente de configuración y operación, no de diseño fundamental.

---

## 2. Problemas críticos

### 2.1 Las credenciales están en control de versiones

**Archivo:** `.gitignore` raíz  
**Problema:** El `.gitignore` solo excluye `.env.local` y `.env.*.local`, pero **NO excluye `.env`**. Esto significa que `backend/.env` (que contiene `DATABASE_URL`) y el `.env` raíz están siendo versionados con git.

Si este repo se hace público, las credenciales de la base de datos quedan expuestas en el historial de git para siempre, incluso si luego se añaden al `.gitignore`.

**Fix inmediato:**
```bash
# 1. Actualizar .gitignore
echo ".env" >> .gitignore
echo "backend/.env" >> .gitignore

# 2. Eliminar del índice de git (NO borra el archivo físico)
git rm --cached .env backend/.env 2>/dev/null

# 3. Si ya está en el historial, hay que reescribirlo:
git filter-repo --invert-paths --path .env --path backend/.env
```

Y crear un `.env.example` documentado:
```
DATABASE_URL=postgresql://user:CHANGE_ME@db:5432/dominion
CORS_ORIGINS=https://tudominio.com
DB_PASSWORD=CHANGE_ME
```

---

### 2.2 Contraseña de base de datos hardcodeada en docker-compose

**Archivo:** `docker-compose.yml`
```yaml
environment:
  POSTGRES_USER: dominion
  POSTGRES_DB: dominion
  POSTGRES_PASSWORD: dominion   # <- en texto plano en el repo
```

En producción, si alguien accede al servidor o al historial del repo, tiene las credenciales de la base de datos.

**Fix:**
```yaml
environment:
  POSTGRES_USER: ${DB_USER:-dominion}
  POSTGRES_DB: ${DB_NAME:-dominion}
  POSTGRES_PASSWORD: ${DB_PASSWORD}   # sin valor por defecto — obliga a definirlo
```

---

### 2.3 CORS demasiado permisivo

**Archivo:** `backend/app/main.py` y `.env`  
```python
CORS_ORIGINS=*
allow_credentials=True
```

Combinar `allow_origins=["*"]` con `allow_credentials=True` viola la especificación del protocolo CORS y es rechazado por los navegadores modernos, pero algunos setups lo permiten creando un vector de ataque CSRF. Para una aplicación pública, lo correcto es especificar el dominio exacto.

**Fix:**
```python
cors_origins = os.getenv("CORS_ORIGINS", "https://tudominio.com").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,   # dominio exacto
    allow_credentials=False,       # no se usan cookies, no hace falta
    allow_methods=["GET"],         # solo GET es necesario
    allow_headers=["*"],
)
```

---

## 3. Problemas altos

### 3.1 `dangerouslySetInnerHTML` para renderizar SVGs

**Archivo:** `frontend/src/App.tsx` (aprox. línea 281)
```tsx
dangerouslySetInnerHTML={{
  __html: getExpansionSymbol(exp.name),
}}
```

Hoy `getExpansionSymbol()` devuelve SVGs hardcodeados, así que el riesgo real es bajo. El problema es que este patrón es frágil: si en el futuro el nombre de la expansión viniera de la base de datos o de un parámetro de URL, sería un XSS directo.

**Fix:** Crear un componente React que renderice el SVG de forma controlada, sin innerHTML.

---

### 3.2 Sin cabeceras de seguridad HTTP

La aplicación no emite ninguna de las cabeceras de seguridad estándar. Para una aplicación pública, esto supone riesgos de clickjacking y MIME sniffing.

**Fix** — añadir middleware en FastAPI:
```python
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "img-src 'self' https://raw.githubusercontent.com; "
        "style-src 'self' 'unsafe-inline'"
    )
    return response
```

---

## 4. Problemas medios

### 4.1 Sin validación de entrada en el endpoint principal

**Archivo:** `backend/app/main.py`
```python
expansions: str = Query(..., description="Comma-separated expansion names"),
```

El parámetro `expansions` no tiene límite de longitud. Una petición con `?expansions=<cadena de 10MB>` parseará sin restricciones. Además, no se valida que los nombres sean expansiones conocidas antes de consultar la base de datos.

**Fix:**
```python
expansions: str = Query(..., max_length=500),

# Dentro del endpoint:
exp_names = [e.strip() for e in expansions.split(",") if e.strip()]
valid_names = {row[0] for row in db.query(Expansion.name).all()}
exp_names = [e for e in exp_names if e in valid_names]
if not exp_names:
    raise HTTPException(status_code=400, detail="No valid expansions provided")
```

---

### 4.2 Sin rate limiting

El endpoint `/api/cards/random` no tiene ningún límite de peticiones. Para una app pública cualquiera puede spamear la API.

**Fix** — añadir `slowapi`:
```python
# requirements.txt
slowapi==0.1.9

# main.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/cards/random")
@limiter.limit("20/minute")
def random_cards(...):
```

---

### 4.3 Contenedores Docker ejecutando como root

**Archivo:** `backend/Dockerfile`  
El proceso de uvicorn corre como root dentro del contenedor. Si hubiera una vulnerabilidad de ejecución de código, el atacante tendría privilegios de root en el contenedor.

**Fix:**
```dockerfile
# Al final del Dockerfile del backend
RUN useradd -m -u 1000 appuser
USER appuser
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

### 4.4 Sin herramienta de migraciones de base de datos

El esquema de la base de datos se aplica con `Base.metadata.create_all()` al arrancar, y los datos se cargan con `seed.py`. No hay Alembic ni ningún sistema de migraciones. Cuando se añada una nueva columna o tabla, habrá que tirar y recrear la base de datos manualmente.

**Fix:**
```bash
pip install alembic
alembic init alembic
# Configurar alembic.ini para leer DATABASE_URL desde .env
```

---

### 4.5 Imágenes de cartas dependientes de un repositorio GitHub externo

**Archivo:** `frontend/src/card-images.ts`
```typescript
const IMAGE_BASE = "https://raw.githubusercontent.com/connorburt/dominion-cards/master/cards";
```

Toda la app depende de un repo de terceros para cargar las imágenes. Si ese repo se borra, cambia de nombre o GitHub tiene un problema, la app queda sin imágenes. No hay verificación de integridad ni fallback.

**Opciones:**
1. Self-hostear las imágenes (subir al propio repo o un bucket S3/CDN).
2. Añadir una imagen de placeholder como fallback en el `<img onError>`.

---

## 5. Mejoras de operación y calidad

### 5.1 CI/CD solo cubre PRs

GitHub Actions solo ejecuta los tests en pull requests. No hay pipeline de deploy ni de tests en la rama `main` después de un merge. Para producción pública hay que añadir al menos:

- Build y test automático en push a `main`
- Escaneo de vulnerabilidades en dependencias (`pip audit`, `npm audit`)
- Build de la imagen Docker y push a un registry
- Deploy automático al servidor

---

### 5.2 Sin análisis estático de seguridad (SAST)

No hay ninguna herramienta de análisis de código estático en el CI. Para Python, **Bandit** detecta problemas de seguridad comunes en minutos. Para el frontend, **eslint-plugin-security** hace lo mismo.

```yaml
# Añadir a .github/workflows/
- name: Security scan (Python)
  run: pip install bandit && bandit -r backend/app/

- name: Dependency audit
  run: pip install pip-audit && pip-audit
```

---

### 5.3 Documentación de despliegue en producción ausente

No existe ningún documento que explique cómo desplegar la aplicación en un servidor real (variables de entorno necesarias, cómo gestionar los secretos, cómo configurar HTTPS, etc.). Para que el proyecto sea público y mantenible hay que documentar esto.

---

### 5.4 nginx sin HTTPS en producción

La configuración de nginx actual solo tiene HTTP (puerto 80). Para una aplicación pública es obligatorio HTTPS. La forma más sencilla es usar Certbot + Let's Encrypt con auto-renovación.

```nginx
# nginx debe incluir:
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

# Redirect HTTP → HTTPS
server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

---

## 6. Lo que está bien

Para no perder perspectiva, estas son las decisiones técnicas correctas que ya están en el proyecto:

- **SQLAlchemy ORM** — las queries están parametrizadas, no hay SQL crudo.
- **npm ci en Dockerfile** — instala exactamente lo del lockfile, reproducible.
- **Alpine/slim images** — imágenes Docker ligeras y con menos superficie de ataque.
- **Pre-commit hooks y pre-push con E2E** — buen gate de calidad antes de subir código.
- **Separación backend/frontend** — arquitectura limpia que escala bien.
- **Cobertura de tests razonable** — 36 tests de backend + 54 de frontend es un buen punto de partida.
- **Vite con TypeScript** — tipado estático reduce bugs en el frontend.

---

## 7. Plan de acción priorizado

### Esta semana (antes de hacer el repo público)

- [ ] Actualizar `.gitignore` para excluir `.env` y `backend/.env`
- [ ] Si ya hay credenciales en el historial de git, reescribir el historial con `git filter-repo`
- [ ] Crear `.env.example` con todas las variables documentadas
- [ ] Cambiar contraseña de base de datos por una generada aleatoriamente
- [ ] Fijar `CORS_ORIGINS` a un dominio concreto y eliminar `allow_credentials=True`
- [ ] Configurar HTTPS en nginx con Let's Encrypt

### A corto plazo (primer sprint post-lanzamiento)

- [ ] Añadir `max_length=500` y whitelist de expansiones en el endpoint
- [ ] Añadir cabeceras de seguridad HTTP como middleware
- [ ] Añadir USER no-root en el Dockerfile del backend
- [ ] Refactorizar `dangerouslySetInnerHTML` a un componente React

### A medio plazo

- [ ] Implementar rate limiting con `slowapi`
- [ ] Añadir Alembic para migraciones de base de datos
- [ ] Añadir Bandit + pip-audit al CI
- [ ] Pipeline de deploy automático en GitHub Actions
- [ ] Fallback para imágenes de cartas (o self-hosting)
- [ ] Documentar el proceso de despliegue en producción

---

## 8. Tabla resumen de riesgos

| Problema | Severidad | Esfuerzo de fix |
|----------|-----------|-----------------|
| `.env` en git / historial | **CRÍTICO** | Bajo |
| Contraseña DB hardcodeada | **CRÍTICO** | Bajo |
| CORS demasiado permisivo | **ALTO** | Bajo |
| Sin HTTPS en producción | **ALTO** | Bajo |
| `dangerouslySetInnerHTML` | **ALTO** | Medio |
| Sin cabeceras de seguridad | **MEDIO** | Bajo |
| Sin validación de entrada | **MEDIO** | Bajo |
| Sin rate limiting | **MEDIO** | Bajo |
| Docker corre como root | **MEDIO** | Bajo |
| Sin migraciones (Alembic) | **MEDIO** | Medio |
| Imágenes de CDN externo | **BAJO** | Medio |
| Sin SAST en CI | **BAJO** | Bajo |
