# SwitchAppart — Claude Code Rules

## Team & Memory files

Two developers work on this project. Each has a memory file at the repo root:

- **`memory-abderrazaq.md`** — Backend & infra (Abderrazaq). Contains technical preferences, Supabase refs, and context.
- **`memory-steven.md`** — Frontend (Steven). **⚠️ Steven: if this file is still the template, fill it in with your Claude memory/context so our AIs stay in sync.**

Read both memory files before starting work to understand each person's preferences and current focus.

---

## Project overview

Peer-to-peer apartment exchange platform (Tinder-style swipe matching).
Three workspaces: `frontend/` (Next.js), `backend/` (Express), `worker/` (heavy jobs).
Real users exist in Supabase — **never drop or truncate auth data**.

**Product spec:** see `docs/PRD.md` (the single source of truth for features, flows, and data model).

**The `oldversion/` folder is OBSOLETE.** Do not use it as reference for new code. It was a prototype, not production code.

---

## Current sprint (March–April 2026)

**Goal:** Rebuild the full app in **6-7 days**, fully functional, deployed as a **PWA**.
After the PWA is live and stable, the next phase is **React Native** for native mobile.

**Division of work:**
- **Abderrazaq:** Backend API, database, Docker, deployment, infra
- **Steven:** Frontend UI, pages, components, PWA config

**Priority order:**
1. Core API (auth, properties, swipe, matches, messages)
2. Frontend pages wired to real API (no more mocks)
3. PWA manifest + service worker + offline support
4. Deploy (Vercel frontend + Railway/Fly backend + managed Postgres)
5. Polish & testing

---

## Repository structure

```
switchapp-/
  frontend/           — Next.js 16 + React 19 + TailwindCSS 4 + TanStack Query + Zustand
  backend/            — Express.js + TypeScript + Prisma + PostgreSQL
  worker/             — Heavy job processor (BullMQ consumers)
  shared/             — DTOs, enums, validators, constants shared across apps
  docs/               — PRD and specs
  memory-abderrazaq.md — Abderrazaq's Claude memory (backend/infra context)
  memory-steven.md     — Steven's Claude memory (frontend context)
  docker-compose.yml
  CLAUDE.md
```

---

## Backend architecture (strict layering)

```
backend/src/
  bootstrap/         — app factory, middleware wiring, server entry
  modules/
    <domain>/
      routes/        — route declaration + middleware only
      controllers/   — HTTP mapping only (req → service → res)
      services/      — business rules, orchestration, no req/res
      repositories/  — Prisma queries only, no HTTP logic
      validators/    — zod schemas for input validation
      dto/           — input/output types
      constants/
      index.ts
  shared/
    middlewares/     — auth, rate-limit, error handler
    errors/          — AppError classes and error codes
    utils/
  infra/
    prisma/          — client singleton, migrations
    redis/           — BullMQ connection
    email/           — email adapter (SMTP/Resend)
    storage/         — S3/MinIO adapter
```

### Layering rules
1. **routes** — no business logic, no Prisma, no external calls
2. **controllers** — extract input, call service, return response. No Prisma access.
3. **services** — business rules only. No Express `req`/`res`.
4. **repositories** — Prisma operations only. No HTTP logic.
5. **infra adapters** — external providers isolated behind service interfaces

---

## Frontend architecture

```
frontend/src/
  app/             — Next.js App Router pages and layouts
  modules/
    <feature>/
      pages/
      components/
      services/    — API calls only here, never in JSX
      constants/
      types/
  shared/
    ui/            — reusable design system components
    stores/        — Zustand global state
    services/      — shared API client
    constants/     — colors, routes, query keys, limits, breakpoints
    lib/           — utilities
  providers/       — React Query, theme, auth providers
```

### Frontend rules
- Server state: **TanStack Query (React Query)** only — all API data fetching and caching goes through `useQuery` / `useMutation`
- Global UI state: **Zustand**
- Use **Zustand** for any shared frontend state; do not introduce React Context or ad hoc global state for that purpose
- API calls only in `services/` files — never inline in page/component JSX
- No `hooks/` or `helpers/` folders — use services, stores, module utilities
- All magic values in constants files (see below)
- **Explorer is the home page** — there is no separate "Accueil" tab. The app opens on the Explorer (search + listings)
- **4 bottom nav tabs:** Explorer, Switch, Messages, Profil

---

## Constants-first policy (mandatory)

Every magic value must live in a constants file before use:

```
shared/src/constants/
  colors.ts        — design tokens (primary, secondary, text, bg, etc.)
  routes.ts        — all API route fragments + buildPath helpers
  queryKeys.ts     — React Query cache keys
  limits.ts        — pagination, file sizes, max lengths
  enums.ts         — domain enums (UserRole, MatchStatus, PropertyType, etc.)

frontend/src/shared/constants/
  theme.ts         — Tailwind color aliases, spacing tokens
  nav.ts           — bottom nav items, route labels
```

**Why:** colors, routes, and limits change often. One edit, zero hunt.

---

## Shared package rules

`shared/` is the single source of truth for cross-app contracts:
- Domain enums
- DTO and API response types
- Zod validators reused across backend and frontend
- Route fragments, query keys, limits

**Duplication policy:** if a type/validator is used in both frontend and backend, it belongs in `shared/src`. Never define competing versions.

---

## API conventions

### Response envelope (stable — never change shape)
```ts
// success
{ data: T }

// error
{ error: { code: string, message: string, details?: unknown } }
```

### Versioning
- All routes under `/api/v1/...` until an explicit version bump is requested

### Validation
- Validate every external input with Zod before controller business calls
- Auth + RBAC enforced at middleware level, not inside services

### Error handling (security)
- **Never expose internal error details to the client in production**
- API responses return generic messages: `"Something went wrong"`, `"Not found"`, etc.
- Full error details (stack traces, DB errors, env info) go to **structured logging only** (visible to us in monitoring, invisible to users)
- Use error codes (`AUTH_INVALID_TOKEN`, `PROPERTY_NOT_FOUND`) for client-side handling — never raw error messages
- In development mode (`NODE_ENV=development`), detailed errors may be shown for debugging

### Logging & Monitoring stack
- **Winston** for structured logging (JSON format in prod, pretty-print in dev)
- **Prometheus** for metrics collection (request duration, error rates, queue depth)
- **Grafana** for dashboards and alerting
- All logs and metrics must be structured — no `console.log` in production code, use Winston logger
- Error handler middleware logs via Winston, never `console.error`

---

## TypeScript standards

- `strict: true` — no exceptions
- No `any` unless explicitly justified with a comment
- Explicit return types on all exported functions
- Use `import type` for type-only imports
- Path aliases: `@/` for app-local, `@shared/` for shared package
- Catch `unknown`, normalize to `AppError`, never swallow silently

---

## Docker gates (run before finishing any batch)

```bash
docker compose config          # compose file must be valid
docker compose build           # all images must build
```

Service names in `docker-compose.yml` are stable — do not rename them.

### Services
| name       | purpose                        |
|------------|--------------------------------|
| `postgres` | main database                  |
| `redis`    | job queue (BullMQ)             |
| `api`      | Express backend                |
| `worker`   | BullMQ job consumers           |

---

## Database / Prisma rules

- All schema changes via Prisma migrations — never manual `ALTER TABLE`
- Migration names must be descriptive: `add_match_status_enum`, not `migration1`
- **Never drop tables or columns without an explicit user instruction**
- The `auth` schema (migrated from Supabase) is sacred — no destructive changes

---

## Auth migration constraints

- Existing passwords are bcrypt hashes from Supabase — preserve them
- On login: verify with `bcryptjs.compare`, issue your own JWT
- Do not force a password reset for existing users
- Supabase `auth.users.id` becomes the canonical `user_id` in all tables

---

## Refactor execution protocol

When doing architecture work:
1. **Baseline first** — inventory affected endpoints and contracts
2. **One domain at a time** — migrate one module, validate, then continue
3. **Never rename endpoints** or change DTO shapes during architecture moves
4. **Report format** after each batch:
   - What was moved
   - How behavior is preserved
   - Checks run
   - Remaining debt

---

## Non-negotiable constraints

1. No functional regression on: auth (login/register/refresh), swipe/matching, messaging
2. `docker compose up --build` must work after every significant change
3. All code, comments, commits, and docs in **English**
4. Keep `/api/v1` prefix stable
5. Never commit `.env` files — use `.env.example`
