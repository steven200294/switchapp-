# Memory — Abderrazaq (Backend & Infrastructure)

## Role & Context

Backend/infra engineer on SwitchAppart. Taking over from a previous dev who left the project unfinished.

- Responsible for **backend, infrastructure, Docker, deployment, database**
- Also handles: **swipe, explorer, API connections** on the frontend
- Strong on Docker, Express, Prisma, PostgreSQL
- Prefers plans before diving in — step by step
- First time using Claude Code (as of March 2026)

## Project Knowledge

**SwitchAppart** — peer-to-peer apartment exchange platform (Tinder-style swipe matching).

**Current state (2026-03-30):**
- Frontend: Next.js 16 + React 19 + TailwindCSS 4 + TanStack Query + Zustand — in `/frontend/`
- Admin CRM: separate Next.js app — in `/admin/` (own Dockerfile; production: subdomain e.g. `admin.switchappart.com`)
- Backend: Express.js + TypeScript + Prisma 6.19.2 + PostgreSQL + Winston — in `/backend/`
- Worker: BullMQ consumer — in `/worker/`
- Gateway: Caddy — in `/gateway/` (routes `/api`, `/grafana`, `/storage`, `/admin`, default frontend)
- Monitoring: configs in `/monitoring/` (Prometheus, Loki, Grafana provisioning, Alloy)
- Shared: DTOs, enums, validators, API route constants — in `/shared/`
- **`oldversion/` has been deleted** (merged from Steven's dev branch)
- **Real users exist in Supabase** — must not lose auth/credentials on migration
- Supabase project ref: `aakdzvvwhvmbpjpmbpep`
- **CHANGELOG**: `CHANGELOG.md` follows Keep a Changelog; **0.2.0** documents admin, gateway, monitoring, explorer sections, icons, query/auth fixes.
- **Mock DB (implemented)**: `DATABASE_MODE=mock` + `DATABASE_URL_MOCK` switches Prisma runtime to `switchapp_mock`; seeded with 7 users (1 admin `abderrazaq@mail.com`/`admin123`, 6 fictifs), 7 properties, 3 matches, 3 convos, images in MinIO `mock/`
- **AI compatibility (implemented)**: GET `/api/v1/properties/:id/compatibility` — GPT-4o-mini scores viewer vs property; `AI_PROVIDER` / `AI_MODEL` / `AI_API_KEY` configurable via `.env`
- **Smoke tests**: `data/test-mock-plan.sh` — 28 automated curl tests (auth, properties, images, matches, messages, AI, edge cases)

**Architecture:**
- `backend/` — Express.js + TypeScript + Prisma, flat module structure (all files in module root)
- `worker/` — BullMQ consumer
- `shared/` — DTOs, enums, API route constants
- `frontend/` — Next.js 16, App Router, colocated architecture (no `modules/` folder), standalone output
- `docker-compose.yml` — postgres + redis + minio + api + worker + frontend + admin + gateway + prometheus + loki + alloy + grafana (+ optional services per `.env`)

## Git Workflow

- **`main` branch** — frozen at commit `4a998b3d` (Steven's last fix). **DO NOT TOUCH** until explicit merge request.
- **`dev` branch** — all active development happens here. Both Abderrazaq and Steven work on dev.
- Merge to main only when everything is complete and tested.
- Steven will push his design work to dev. We push backend + frontend logic to dev.
- **Last merge with Steven:** commit `50e7b5f9` — PropertyCard redesign, BottomNav adjustments, oldversion deletion, docker-compose port fixes. Merged 2026-03-29 with 0 conflicts (after stash-pop conflict resolution on PropertyCard, PropertyCardSkeleton, BottomNav).

## App Versioning

- **SemVer** (MAJOR.MINOR.PATCH) starting at `0.1.0`
- Root `package.json` holds the canonical version
- `scripts/bump-version.mjs` propagates version to all child `package.json` files, commits, and creates a git tag
- `CHANGELOG.md` tracks all changes per version

## Frontend Architecture (colocated — no `modules/` folder)

Everything lives **inside its route folder** under `app/`. No separate `modules/` directory.

```
frontend/src/
  app/
    explorer/
      components/    — PropertyCard, PropertyHero, PropertyInfo, etc.
      hooks/         — useProperties
      types/         — properties.types.ts
      services/      — properties.service.ts
      [id]/page.tsx  — property detail (thin wrapper)
      page.tsx       — explorer list (thin wrapper)
    swipe/
      components/    — SwipeCard, SwipeDeck, MatchOverlay, etc.
      hooks/         — useSwipe
      page.tsx
    messages/
      components/    — ChatWindow, ChatHeader, ChatInput, etc.
      hooks/         — useMessages
      page.tsx
    favoris/
      components/    — FavoriteCard
      hooks/         — useFavorites
      page.tsx
    profil/          — Steven's design (don't touch)
      components/    — ProfileCard, ProfileMenuSection, PremiumBanner
      constants/     — settings-sections.tsx
      parametres/    — settings sub-pages
    admin/
      components/    — AdminSidebar, StatCard, etc.
  components/        — Header, BottomNav, ConnectionModal
    header/          — DesktopNav, DesktopSearchBar, MobileHeader
    bottom-nav/      — NavIcons
    connection/      — DecorativeBubbles, AuthFormHeader, AuthFormInputs, SocialLoginButtons, AuthFormFooter
  shared/
    ui/              — AuthGate, EmptyState, GradientButton, UserAvatar
      icons/         — custom SVG icon components (centralized; `viewBox` 0 0 32 32 with inner translate for stroke style aligned with bottom nav)
        amenities.tsx — amenity-specific icons
        index.ts     — MapPin, Maximize, Bed, Heart, FavoriteHeart, etc.
    auth/            — auth service, types
    stores/          — auth.store (Zustand)
    constants/       — theme.ts (resolveStorageUrl, design tokens), query-keys.ts
    services/        — apiFetch utility
```

### Frontend rules
- **No `modules/` folder** — everything colocated inside its `app/` route folder
- **File size limit: 90 lines max** — split into sub-components when exceeding
- Page files are **thin wrappers** — import and compose components, never contain business logic
- Server state: **TanStack Query** only (custom hooks in `hooks/`)
- Global UI state: **Zustand**
- API calls only in `services/` files — never inline in pages/components
- Swipe detail view navigates to `/explorer/[id]` — same detail page as explorer
- Auth gating via `AuthGate` component — Explorer publicly accessible, Swipe/Messages/Profil gated
- **Use standard Tailwind colors** (text-gray-900, bg-white, etc.) — NOT custom foreground/background tokens
- **Brand colors via CSS variables**: `from-brand-cyan`, `to-brand-purple`, `text-brand-cyan`, `text-brand-purple`
- **Animated emojis**: host under `frontend/public/emojis/` (not MinIO); CDN usage discouraged per `CLAUDE.md` — prefer local assets for production.
- **No hardcoded hex colors in className** except for third-party brand colors (Google, Facebook, Apple buttons)

## Backend Architecture (flat modules)

- Each module: `<module>.routes.ts`, `<module>.controller.ts`, `<module>.service.ts`, `<module>.repository.ts`, `<module>.schemas.ts`
- No nested folders (no `controllers/`, `services/` dirs inside modules)
- Strict layering: routes → controllers → services → repositories
- Shared middleware: `validate.ts` (Zod validation), `rateLimiter.ts` (express-rate-limit), `auth.middleware.ts`
- Shared schemas: `pagination.schema.ts` (paginationSchema, uuidParamSchema)
- Typed environment config: `backend/src/config/env.ts`
- Structured error handling: `AppError` with error codes, generic client messages in production

**Monitoring stack (implemented):**
- **Winston** — structured logging (JSON in prod, pretty-print in dev)
- **Prometheus** — metrics collection via `prom-client` (HTTP duration, request counts, error rates, business metrics: logins, swipes, matches)
- **Loki** — log aggregation
- **Grafana** — dashboards + alerting, preconfigured with Prometheus + Loki datasources
- **Grafana Alloy** — Docker container log/metric collection agent
- Metrics endpoint at `/api/v1/metrics`
- Config files in `monitoring/` (prometheus.yml, loki-config.yml, config.alloy, grafana provisioning)

**Security:**
- `express-rate-limit`: `apiLimiter` (200 req/15min) on all `/api/v1`, `authLimiter` (20 req/15min) on auth routes
- `express.json({ limit: "1mb" })` for body size limits
- `helmet()` for HTTP security headers
- Zod validation via `validate` middleware on all routes (body, query, params)
- Generic error messages in production — full details to Winston only

## Design Tokens

Colors and brand values are defined in `globals.css` as CSS variables and registered via `@theme inline` for Tailwind:

```
:root {
  --brand-cyan: #00BFFF;
  --brand-purple: #8A2BE2;
  --brand-dark: #111111;
  --brand-dark-alt: #222222;
  --brand-chat-bg: #f8f9fa;
  --brand-input-bg: #f1f3f5;
}
```

In Tailwind classes: `bg-brand-cyan`, `text-brand-purple`, `from-brand-cyan to-brand-purple`, etc.

**Standard Tailwind colors** for text/backgrounds: `text-gray-900`, `text-gray-500`, `bg-white`, `bg-gray-100`, `border-gray-200`, etc. Do NOT replace these with custom foreground/background tokens.

## Storage (MinIO)

- **MinIO** replaces Supabase storage for property photos and avatars
- Buckets: `properties`, `avatars` (both public-read)
- `NEXT_PUBLIC_STORAGE_URL=http://localhost:9000` (env var)
- `resolveStorageUrl(path, bucket)` in `frontend/src/shared/constants/theme.ts` handles URL resolution:
  - Strips Supabase storage URL prefixes and reconstructs with MinIO base
  - Falls back to `FALLBACK_COVER_HQ` for empty paths
- `UserAvatar` component in `frontend/src/shared/ui/UserAvatar.tsx` centralizes avatar rendering with `resolveStorageUrl(avatarUrl, "avatars")`
- Images were migrated from Supabase to MinIO (download + upload to matching paths)

## Docker Configuration

- All ports parameterized via `.env` variables (`POSTGRES_PORT`, `REDIS_PORT`, `MINIO_PORT`, `MINIO_CONSOLE_PORT`, `FRONTEND_PORT`, `API_PORT`, `GRAFANA_PORT`, `PROMETHEUS_PORT`, `LOKI_PORT`)
- `.dockerignore` excludes `**/node_modules`, `**/.next`, `**/dist`, `**/backups`, `**/monitoring`, `docs`, `.env`, `*.md`
- Frontend uses `output: "standalone"` in `next.config.ts`
- Frontend Dockerfile copies static assets to both `/app/.next/static/` and `/app/frontend/.next/static/` (Next.js standalone quirk)
- Frontend Dockerfile passes `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_STORAGE_URL` as build args
- Deployment target: **Railway** with MinIO on Railway + Railway managed Postgres

## Technical Preferences

### No hardcoded env fallbacks
Never use fallback values for env vars (e.g. `process.env.X || "default"`). Always throw if missing.
All config centralized in `.env` — no hidden defaults.

### Never expose errors to clients
API must return generic error messages in production — full details go to logging/monitoring only.
Use AppError with a safe `clientMessage`. The `errorHandler` middleware logs full details server-side and returns only `{ error: { code, message } }` to clients.

### Icons
All icons live in `frontend/src/shared/ui/icons/` (no `lucide-react`). Stroke icons use a consistent `viewBox` 32 pattern where applicable to match Steven’s Airbnb-style nav icons.

### Tailwind CSS v4
Use v4 class names: `bg-linear-to-*` (not `bg-gradient-to-*`), `shrink-0` (not `flex-shrink-0`), `z-100` (not `z-[100]`), `aspect-4/3` (not `aspect-[4/3]`).

### Partner context
- **Steven** handles: login/auth page design, profil design (layout + sub-pages), messages UI, some UI polish
- **We** handle: backend, swipe logic, explorer, API connections, Docker, database
- Steven pushes his work to `dev` — we do NOT touch his designs, just adapt to API
- **Merge strategy**: Take Steven's design (sizes, colors, layout), re-apply our technical fixes on top (resolveStorageUrl, TW v4 classes, etc.)
- ConnectionModal uses Steven's exact design: CDN animated emojis, decorative apartment bubbles, same SVG icons, same Google/Apple/Facebook brand colors

## Supabase MCP Connection

- Project ref: `aakdzvvwhvmbpjpmbpep`
- MCP config: `~/.claude/mcp.json` with remote URL `https://mcp.supabase.com/mcp?project_ref=aakdzvvwhvmbpjpmbpep`
- For full data export: `pg_dump "CONNECTION_STRING" --no-owner --no-acl --schema=public --schema=auth > switchapp_dump.sql`

## Sprint Context (March 2026)

- **Goal:** Rebuild the full app in 6-7 days, deploy as PWA, then pivot to React Native
- **Partner:** Steven (frontend design)
- See `docs/PRD.md` for full product spec
- See `CLAUDE.md` for coding rules

## Recent Work (2026-03-28 to 2026-03-29)

### Frontend refactoring
- Moved all files from `modules/` into colocated `app/` route folders
- Fixed all color tokens: reverted `text-foreground` → `text-gray-900`, `bg-background` → `bg-white`, etc.
- Restored Steven's exact ConnectionModal design (CDN emojis, decorative bubbles, brand SVG colors)
- Restored original Google (#4285F4, #34A853, #FBBC05, #EA4335), Apple (bg-black), Facebook (bg-[#1877F2]) brand colors
- Decomposed all large files to stay under 90 lines
- Replaced `lucide-react` with custom SVG icon components
- Tailwind CSS v4 migration: `bg-gradient-to-*` → `bg-linear-to-*`, `flex-shrink-0` → `shrink-0`, `z-[N]` → `z-N`, `aspect-[4/3]` → `aspect-4/3`
- Created `UserAvatar` shared component for centralized avatar rendering
- All images now resolve via `resolveStorageUrl` from MinIO

### Backend refactoring
- Centralized Zod validation with reusable `validate` middleware
- Added shared `paginationSchema` and `uuidParamSchema`
- Added `express-rate-limit` (apiLimiter + authLimiter)
- Implemented Prometheus metrics (HTTP + business metrics)
- Implemented Winston structured logging
- Deduplicated `isAdminUser` to `admin.repository.ts`
- Typed environment config (`backend/src/config/env.ts`)

### Infrastructure
- Full monitoring stack: Winston + Prometheus + Loki + Grafana + Alloy
- MinIO setup: buckets created, images migrated from Supabase
- Docker optimization: `.dockerignore`, standalone Next.js builds, parameterized ports
- App versioning: SemVer 0.1.0, bump script, CHANGELOG.md

### Merge with Steven (2026-03-29)
- Merged commit `50e7b5f9` from `origin/dev`
- Steven's changes: PropertyCard redesign (aspect-square, Airbnb-style), BottomNav adjustments, oldversion deletion
- Conflict resolution: kept Steven's design, re-applied `resolveStorageUrl` and TW v4 class fixes
- All 3 Docker images (API, frontend, worker) build successfully after merge

### Infra and docs (2026-03-30)
- Documented **0.2.0** in `CHANGELOG.md` (admin app, gateway, monitoring, explorer UX, icons, React Query auth behavior)
- Extended **`CLAUDE.md`**: repo map (`admin/`, `gateway/`, `monitoring/`), changelog discipline, mock DB + AI compatibility conventions

### Mock database & AI compatibility (2026-03-30)
- Created `switchapp_mock` database (Docker init SQL + manual creation for existing volumes)
- Seed script: 7 users (admin `abderrazaq@mail.com` / `admin123`, 6 mock users / `mock12345`), 7 properties (Paris, Lyon, Bordeaux, Marseille, Toulouse, Nice), 3 matches, 3 conversations, 11 messages, 11 swipes, 5 favorites
- 7 Unsplash images downloaded and uploaded to MinIO via `data/seed-mock-images.sh`
- `backend/src/modules/compatibility/` — AI module: provider (OpenAI), service (prompt builder), schemas (Zod validation of AI JSON output)
- Frontend: `CompatibilityGauge`, `PropertyCompatibilityCard`, `useCompatibility` hook on property detail page
- Fixed corrupted `migration.sql` (npm warning baked into line 1)
- 28/28 automated smoke tests pass (`data/test-mock-plan.sh`)
