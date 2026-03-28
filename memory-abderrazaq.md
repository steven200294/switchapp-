# Memory — Abderrazaq (Backend & Infrastructure)

## Role & Context

Backend/infra engineer on SwitchAppart. Taking over from a previous dev who left the project unfinished.

- Responsible for **backend, infrastructure, Docker, deployment, database**
- Strong on Docker, Express, Prisma, PostgreSQL
- Prefers plans before diving in — step by step
- First time using Claude Code (as of March 2026)

## Project Knowledge

**SwitchAppart** — peer-to-peer apartment exchange platform (Tinder-style swipe matching).

**Current state (2026-03-28):**
- Frontend (new): Next.js 16 + React 19 + TailwindCSS 4 + React Query — in `/frontend/`
- Old version: React + Vite + Supabase (direct) — in `/oldversion/` (OBSOLETE — do not use as reference)
- **Real users exist in Supabase** — must not lose auth/credentials on migration
- Supabase project ref: `aakdzvvwhvmbpjpmbpep`

**Architecture scaffolded:**
- `backend/` — Express.js + TypeScript + Prisma, layered (routes → controllers → services → repositories)
- `worker/` — BullMQ consumer
- `shared/` — DTOs, enums, API route constants
- `frontend/` — Next.js 16, App Router
- `docker-compose.yml` — postgres + redis + api + worker + frontend

**Monitoring stack (decided, not yet implemented):**
- Winston (structured logging)
- Prometheus (metrics)
- Grafana (dashboards + alerting)

## Technical Preferences

### No hardcoded env fallbacks
Never use fallback values for env vars (e.g. `process.env.X || "default"`). Always throw if missing.
All config centralized in `.env` — no hidden defaults.

### Never expose errors to clients
API must return generic error messages in production — full details go to logging/monitoring only.
Use AppError with a safe `clientMessage`. The `errorHandler` middleware logs full details server-side and returns only `{ error: { code, message } }` to clients.

## Supabase MCP Connection

- Project ref: `aakdzvvwhvmbpjpmbpep`
- MCP config: `~/.claude/mcp.json` with remote URL `https://mcp.supabase.com/mcp?project_ref=aakdzvvwhvmbpjpmbpep`
- For full data export: `pg_dump "CONNECTION_STRING" --no-owner --no-acl --schema=public --schema=auth > switchapp_dump.sql`

## Sprint Context (March 2026)

- **Goal:** Rebuild the full app in 6-7 days, deploy as PWA, then pivot to React Native
- **Partner:** Steven (frontend)
- See `docs/PRD.md` for full product spec
- See `CLAUDE.md` for coding rules
