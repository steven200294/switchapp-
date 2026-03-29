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

**Current state (2026-03-29):**
- Frontend (new): Next.js 16 + React 19 + TailwindCSS 4 + TanStack Query + Zustand — in `/frontend/`
- Old version: React + Vite + Supabase (direct) — in `/oldversion/` (OBSOLETE — do not use as reference)
- **Real users exist in Supabase** — must not lose auth/credentials on migration
- Supabase project ref: `aakdzvvwhvmbpjpmbpep`

**Architecture scaffolded:**
- `backend/` — Express.js + TypeScript + Prisma, flat module structure (all files in module root)
- `worker/` — BullMQ consumer
- `shared/` — DTOs, enums, API route constants
- `frontend/` — Next.js 16, App Router, colocated architecture (no `modules/` folder)
- `docker-compose.yml` — postgres + redis + api + worker + frontend

## Git Workflow

- **`main` branch** — frozen at commit `4a998b3d` (Steven's last fix). **DO NOT TOUCH** until explicit merge request.
- **`dev` branch** — all active development happens here. Both Abderrazaq and Steven work on dev.
- Merge to main only when everything is complete and tested.
- Steven will push his design work to dev. We push backend + frontend logic to dev.

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
    ui/              — AuthGate, AmenityIcon, EmptyState, GradientButton
    auth/            — auth service, types
    stores/          — auth.store (Zustand)
    constants/       — theme.ts, query-keys.ts
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
- **CDN emoji/icons allowed** for Steven's design elements (animated fluent emojis)
- **No hardcoded hex colors in className** except for third-party brand colors (Google, Facebook, Apple buttons)

## Backend Architecture (flat modules)

- Each module: `<module>.routes.ts`, `<module>.controller.ts`, `<module>.service.ts`, `<module>.repository.ts`, `<module>.schema.ts`
- No nested folders (no `controllers/`, `services/` dirs inside modules)
- Strict layering: routes → controllers → services → repositories

**Monitoring stack (decided, not yet implemented):**
- Winston (structured logging)
- Prometheus (metrics)
- Grafana (dashboards + alerting)

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

## Technical Preferences

### No hardcoded env fallbacks
Never use fallback values for env vars (e.g. `process.env.X || "default"`). Always throw if missing.
All config centralized in `.env` — no hidden defaults.

### Never expose errors to clients
API must return generic error messages in production — full details go to logging/monitoring only.
Use AppError with a safe `clientMessage`. The `errorHandler` middleware logs full details server-side and returns only `{ error: { code, message } }` to clients.

### Partner context
- **Steven** handles: login/auth page design, profil design (layout + sub-pages), messages UI, some UI polish
- **We** handle: backend, swipe logic, explorer, API connections, Docker, database
- Steven pushes his work to `dev` — we do NOT touch his designs, just adapt to API
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

## Recent Refactoring (2026-03-29)

- Moved all files from `modules/` into colocated `app/` route folders
- Fixed all color tokens: reverted `text-foreground` → `text-gray-900`, `bg-background` → `bg-white`, etc.
- Restored Steven's exact ConnectionModal design (CDN emojis, decorative bubbles, brand SVG colors)
- Restored original Google (#4285F4, #34A853, #FBBC05, #EA4335), Apple (bg-black), Facebook (bg-[#1877F2]) brand colors
- Decomposed all large files to stay under 90 lines
- All pages verified returning 200 via Docker
