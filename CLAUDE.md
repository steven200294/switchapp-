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
  admin/              — Separate Next.js admin CRM (own Dockerfile, subdomain in production)
  backend/            — Express.js + TypeScript + Prisma + PostgreSQL
  worker/             — Heavy job processor (BullMQ consumers)
  gateway/            — Caddy reverse proxy (single local entry: web, API, admin, Grafana, storage)
  monitoring/         — Prometheus, Loki, Grafana, Alloy configs and dashboards
  shared/             — DTOs, enums, validators, constants shared across apps
  docs/               — PRD and specs
  memory-abderrazaq.md — Abderrazaq's Claude memory (backend/infra context)
  memory-steven.md     — Steven's Claude memory (frontend context)
  docker-compose.yml
  CLAUDE.md
  CHANGELOG.md        — Keep a Changelog; update on user-visible or infra changes
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

## Frontend architecture (colocated — no `modules/` folder)

Everything lives **inside its route folder** under `app/`. No separate `modules/` directory.

```
frontend/src/
  app/
    explorer/            — Property search & listing route
      components/        — PropertyCard, PropertyHero, CityFilters, etc.
      hooks/             — useProperties, useProperty
      services/          — properties.service.ts (API calls)
      types/             — properties.types.ts
      page.tsx           — thin wrapper composing components
      [id]/page.tsx      — property detail page
    swipe/
      components/        — SwipeCard, SwipeDeck, MatchOverlay, etc.
      hooks/             — useSwipe (deck, mutations, undo)
      services/          — swipe.service.ts
      types/             — swipe.types.ts
      page.tsx
    messages/
      components/        — ChatWindow, ChatHeader, ConversationList, etc.
      hooks/             — useMessages
      services/          — messages.service.ts
      types/             — messages.types.ts
      constants/         — messages.constants.ts (mock data)
      page.tsx
    favoris/
      components/        — FavoriteCard
      hooks/             — useFavorites
      services/          — favorites.service.ts
      types/             — favorites.types.ts
      page.tsx
    profil/
      components/        — ProfileCard, PremiumBanner, ProfileMenuSection
      constants/         — settings-sections.tsx
      types/             — profile-menu-types.ts
      layout.tsx
      page.tsx
      parametres/...     — sub-pages
    admin/
      components/        — AdminSidebar, StatCard, RecentUsersTable
      services/          — admin.service.ts
      layout.tsx, page.tsx
  components/            — layout-level shared components (Header, BottomNav, ConnectionModal, Footer)
    header/              — sub-components of Header
    connection/          — sub-components of ConnectionModal
    bottom-nav/          — sub-components of BottomNav
  shared/
    ui/                  — reusable design system (AuthGate, EmptyState, GradientButton, AmenityIcon)
    stores/              — Zustand global state
    auth/                — auth service + types (cross-cutting)
    services/            — shared API client (apiFetch)
    constants/           — theme.ts, queryKeys.ts
  providers/             — React Query, auth providers
```

### Frontend rules
- **No `modules/` folder** — everything colocated inside its `app/` route folder
- **File size limit: 90 lines max** — split into sub-components when exceeding
- Page files are **thin wrappers** — they import and compose components, never contain business logic
- Server state: **TanStack Query (React Query)** only — `useQuery` / `useMutation` in custom hooks
- Global UI state: **Zustand**
- API calls only in `services/` files — never inline in page/component JSX
- All magic values in constants files (see below)
- **No hardcoded colors or font sizes** — use theme tokens (see Design tokens section)
- **No CDN-hosted icons/emojis** — all assets stored locally in `public/` (e.g. `public/emojis/`)
- **Explorer is the home page** — no separate "Accueil" tab
- **5 bottom nav tabs:** Explorer, Favoris, Switch (floating), Messages, Profil
- Shared components used by 2+ routes go in `shared/ui/`
- Route-specific components stay in their route's `components/` folder

---

## Design tokens (mandatory — zero hardcoded values)

All colors and font sizes are defined as **CSS variables** in `frontend/src/app/globals.css` under `@theme inline`.
Tailwind auto-generates utility classes from them.

**Colors** (change ONE line in `:root` to rebrand):
- `--brand-cyan` → `text-brand-cyan`, `bg-brand-cyan`, `from-brand-cyan`
- `--brand-purple` → `text-brand-purple`, `bg-brand-purple`, `to-brand-purple`
- `--brand-dark`, `--brand-dark-alt`, `--brand-chat-bg`, `--brand-input-bg`

**Font sizes** (semantic names, all customizable):
- `text-body-2xs` (10px), `text-body-xs` (11px), `text-caption` (12px), `text-body-sm` (13px)
- `text-body` (14px), `text-body-md` (15px), `text-body-lg` (16px), `text-body-xl` (17px)
- `text-title-sm` (18px), `text-title-xs` (19px), `text-title` (20px), `text-title-md` (22px), `text-title-lg` (24px)
- `text-display-xs` (26px), `text-display-sm` (28px), `text-display` (32px), `text-display-md` (36px), `text-display-lg` (40px)

**Rules:**
- Never use `text-[14px]`, `bg-[#00BFFF]`, or any arbitrary Tailwind value for colors/sizes
- SVG `stopColor` attributes use `var(--brand-cyan)`, never raw hex
- JS-level constants (fallback URLs, thresholds) live in `frontend/src/shared/constants/theme.ts`

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
  theme.ts         — JS-level tokens (fallback URLs, swipe thresholds, stale times)
  queryKeys.ts     — React Query cache keys
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

---

## Documentation and releases

- **`CHANGELOG.md`**: Update when behavior, features, or notable infra changes ship. Use [Keep a Changelog](https://keepachangelog.com/) structure; bump SemVer via root `scripts/bump-version.mjs` when cutting a release.
- **Memory files**: Keep `memory-abderrazaq.md` / `memory-steven.md` aligned with current architecture after large batches (no secrets).

---

## Mock database (convention — when implemented)

- Use **`DATABASE_MODE`** (`real` \| `mock`) plus **`DATABASE_URL_MOCK`** pointing at a second Postgres database (e.g. `switchapp_mock` on the same server).
- Resolve the active Prisma URL in one place (`backend/src/config/env.ts` + Prisma client). Never hardcode two URLs in repositories.
- Mock seed must not touch production data; document seed commands in `backend/package.json` and `.env.example`.
- **Auth schema remains sacred** — mock DB still mirrors `auth` + `public` expectations; do not truncate real Supabase-backed DBs from app code.

---

## AI compatibility score (convention — when implemented)

- **Compatibility** compares the **logged-in user’s profile preferences** and **their own published property** (if any) against the **viewed property**; output is structured (score, common points, weak points, short recommendation).
- Configure provider and model via environment (e.g. **`AI_PROVIDER`**, **`AI_MODEL`**, **`AI_API_KEY`**). Support swapping providers behind a small internal interface (OpenAI first; others optional).
- **Never log or return raw API keys**; never send PII beyond what the product needs for the comparison. Log errors to Winston only; client gets generic messages on failure.
- Expose a dedicated authenticated route under `/api/v1/...` with Zod validation; frontend uses a hook + service under `app/explorer/`.
