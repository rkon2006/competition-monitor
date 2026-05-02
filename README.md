# Competition Monitor

Tracks competitor apps on Google Play by taking periodic screenshots of their store listings.

## Stack

- **Frontend**: React + React Query + Vite
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL
- **Screenshots**: Puppeteer + Chromium

## Deployed on the Railways service

Client is available at https://frontend-production-861c.up.railway.app/
Backend is available at https://backend-production-404c.up.railway.app/

## Local Development

### Prerequisites

- Node.js 24+
- Docker (for PostgreSQL)

### 1. Start PostgreSQL

```bash
docker run -d \
  --name competition-pg \
  -e POSTGRES_USER=monitor \
  -e POSTGRES_PASSWORD=changeme \
  -e POSTGRES_DB=competition_monitor \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Install dependencies

From the repo root:

```bash
npm install
```

### 3. Configure environment

`packages/backend/.env` is already set up for local development:

```
DATABASE_URL="postgresql://monitor:changeme@localhost:5432/competition_monitor"
```

### 4. Run migrations

```bash
cd packages/backend
npx prisma migrate deploy
```

### 5. Start the backend

```bash
# in packages/backend
npm run dev
```

Runs on `http://localhost:3000`.

### 6. Start the frontend

```bash
# in packages/frontend
npm run dev
```

Runs on `http://localhost:5173`. Vite proxies `/api` requests to the backend automatically.

### Stop PostgreSQL

```bash
docker stop competition-pg
```

## Deployment (Railway)

The app is configured for [Railway](https://railway.app) with separate services for backend, frontend, and PostgreSQL.

### Services

| Service  | Root directory      | Notes                             |
| -------- | ------------------- | --------------------------------- |
| postgres | —                   | Railway PostgreSQL plugin         |
| backend  | `packages/backend`  | Runs Prisma migrations on startup |
| frontend | `packages/frontend` | nginx, proxies `/api` to backend  |

### Environment variables (backend)

| Variable       | Value                                      |
| -------------- | ------------------------------------------ |
| `DATABASE_URL` | Reference from PostgreSQL service          |
| `NODE_ENV`     | `production`                               |
| `DATA_DIR`     | `/app/data`                                |
| `CORS_ORIGIN`  | Public URL of the frontend Railway service |

### Environment variables (frontend)

| Variable      | Value                                     |
| ------------- | ----------------------------------------- |
| `BACKEND_URL` | Public URL of the backend Railway service |

### Additional backend variables

| Variable          | Value                                 |
| ----------------- | ------------------------------------- |
| `SCREENSHOT_CRON` | Cron expression (default `0 * * * *`) |

## Production Improvements

Things I would add to make this production-grade:

| Area              | Improvement                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Security**      | Authentication/Authorization + rate limiting on mutating routes                                                      |
| **Storage**       | Move screenshots to Cloud Storage — local disk doesn't survive redeployments or horizontal scaling                   |
| **Reliability**   | Job queue (BullMQ + Redis) with Puppeteer worker pool — retry on failure, no duplicate captures on multiple replicas |
| **Observability** | Structured logging + metrics endpoint — capture success rate, queue depth, browser health                            |
| **Quality**       | Integration tests for API routes and screenshot service                                                              |
| **DX**            | `packages/shared` for TypeScript types + probably API versioning (`/api/v1/`)                                        |

## Project Structure

```
competition-monitor/
├── packages/
│   ├── backend/
│   │   ├── prisma/          # Schema and migrations
│   │   ├── src/
│   │   │   ├── routes/      # Express routers
│   │   │   ├── services/    # Screenshot + scheduler logic
│   │   │   └── index.ts     # Entry point
│   │   └── Dockerfile
│   └── frontend/
│       ├── src/
│       │   ├── features/    # Feature-based modules
│       │   ├── pages/       # Route-level components
│       │   └── shared/      # API client, shared components
│       ├── nginx.conf
│       └── Dockerfile
└── docker-compose.yml
```
