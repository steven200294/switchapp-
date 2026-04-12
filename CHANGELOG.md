# Changelog

All notable changes to SwitchAppart will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Geocoding pipeline**: addresses are geocoded to lat/lng coordinates once on property creation/update via Nominatim API; results cached in `geocoding_cache` table; BullMQ job for async batch processing; backfill script for existing properties
- **Redis infra module** (`backend/src/infra/redis/`): shared IORedis connection + BullMQ queue factory
- **Mock database** (`DATABASE_MODE=mock`, `DATABASE_URL_MOCK`): separate `switchapp_mock` database auto-created by Docker init; Prisma client switches at runtime via `env.database.effectiveUrl`
- **Mock seed** (`data/seed-mock.ts`): 7 users (1 admin + 6 fictifs), 7 properties across 6 villes, 3 matches, 3 conversations, 11 messages, 11 swipes, 5 favorites; scripts `npm run seed:mock` / `db:migrate:mock`
- **Mock images** (`data/seed-mock-images.sh`): downloads 7 Unsplash apartment photos and uploads to MinIO `properties/mock/`
- **Admin user**: `abderrazaq@mail.com` / `admin123` with `admin_users` table entry and verified profile
- **AI compatibility endpoint** — GET `/api/v1/properties/:id/compatibility` (authenticated): GPT-4o-mini compares viewer preferences + own listing to viewed property; returns score 0–100, common/weak points, recommendation in French
- **AI configuration**: `AI_PROVIDER`, `AI_MODEL`, `AI_API_KEY` env vars (default `openai` / `gpt-4o-mini`)
- Explorer **property detail**: compatibility card (gauge, strengths, gaps, recommendation) displayed when logged in
- **Automated smoke tests** (`data/test-mock-plan.sh`): 28-test bash suite covering auth, properties, images, matches, conversations, AI compatibility, edge cases
- **i18n** (`next-intl`): locale-based routing (`/fr`, `/en`), automatic browser detection, language switch in settings, all UI text externalized to `messages/fr.json` and `messages/en.json`
- **Registration flow**: email + password signup with full-name, disposable-email blocking, Cloudflare Turnstile CAPTCHA, email confirmation (signed JWT link), phone OTP verification (stubbed with `0000`)
- **Post-registration onboarding modal**: collects user search preferences (city, budget, property types, surface, amenities) to personalize the swipe/explorer experience
- **Search preferences settings page** (`/profil/parametres/preferences`): edit preferences anytime after onboarding; entry in settings menu
- **Email verification badge** on profile page (replaces persistent banner)
- **Property creation chatbot**: conversational multi-step flow for creating a listing (address autocomplete via Photon API, DPE/GES fields, photo upload, draft saving to `localStorage`, publish to API); edit mode for published properties uses standard form, not chatbot
- **Explorer feed categories**: 6 universal categories (top picks, newest, budget-friendly, furnished & ready, large spaces, pet-friendly) + 4 personalized categories (for you, in budget, your type, near you) with `optionalAuth` middleware; `GET /api/v1/properties/feed` and `GET /api/v1/properties/feed/:slug`
- **Category listing pages** (`/explorer/category/[slug]`): paginated grid view for each category with SEO metadata
- **"See all" card**: visual card at the end of each horizontal scroll section linking to the full category page
- **Utilities-included badge**: prominent green badge on property detail page (bottom bar + info section) when `utilities_included` is true; chatbot rent question explicitly mentions "charges comprises"

### Changed
- **TanStack Query migration**: `getMe()` moved from Zustand side-effect to `useQuery`; login/register/email verification/phone OTP/preferences update all use `useMutation` hooks with proper cache invalidation; swipe mutations invalidate matches, conversations, and deck caches
- **AuthGate** keeps `ConnectionModal` mounted after auth state change so post-auth flows (onboarding, propose) execute correctly
- **AuthProvider** uses `useQuery(AUTH_ME)` + Zustand `hydrateToken()` instead of direct `loadFromStorage`
- Explorer page: removed "All properties" flat section, replaced by categorized feed
- Property listing card unified across explorer, favorites, and swipe pages
- `init.sql` scoped to `auth` schema only; Prisma migrations handle `public` schema with `IF NOT EXISTS` guards
- API healthcheck in Docker uses Node.js `fetch` instead of `wget`
- CAPTCHA middleware returns `503` in production when secret key is missing (fail-closed)

### Fixed
- Onboarding modal not appearing after registration when triggered from `AuthGate`-protected pages
- `@marsidev/react-turnstile` missing in Docker frontend build
- `TypeError: Cannot set property query` in validation middleware
- Properties endpoint 500 error due to unparsed query params
- Onboarding modal text unreadable (forced black text)
- Property detail map overlapping sticky bottom bar (z-index)

## [0.2.0] - 2026-03-30

### Added
- Standalone **admin** Next.js app (`admin/`) for CRM: users, properties, matches, swipes, messages, monitoring (Grafana embed), logs dashboard
- **Caddy** reverse proxy (`gateway/`) as single entry point: API, frontend, admin, Grafana, MinIO storage
- **Monitoring** stack under `monitoring/`: Prometheus, Loki, Grafana provisioning, Alloy; Grafana dashboards including unified logs view
- Explorer **horizontal sections**, compact cards, and **promo/tips** banners; property image carousel and related components
- **Centralized icon system** with Airbnb-style `viewBox` 32 scaling (`general`, `navigation`, `property` icon modules)
- `UserAvatar` shared component; `pickCover` / `resolveStorageUrl` helpers for MinIO-backed images
- Root `package.json` and scripts (e.g. version bump) where applicable
- `.dockerignore` and Docker improvements for Next.js standalone static `public/` copy

### Changed
- React Query: no retry on authentication errors; messages/matches queries **enabled only when logged in**
- Backend: Zod validation middleware, rate limiting, metrics, storage config; admin API extensions for CRM metrics and lists
- Frontend: profile and messages screens use centralized icons; explorer property detail uses photo paths and carousel

### Fixed
- MinIO image URLs and standalone Docker serving of `public/` assets (emojis, static files)

## [0.1.0] - 2026-03-29

### Added
- Express API with modular architecture (auth, properties, swipes, matches, messages, favorites, admin)
- Next.js 16 frontend with Tailwind CSS v4, React Query, Zustand
- Custom JWT authentication (bcrypt-compatible with Supabase legacy passwords)
- Swipe/match engine with mutual-like detection and auto-conversation creation
- Property explorer with search, detail pages, image carousel
- Favorites system with add/remove
- Real-time messaging UI wired to API
- Admin dashboard (users, properties)
- MinIO object storage for property photos and avatars
- Prisma ORM with PostgreSQL, init.sql seeding
- Docker Compose with all services (postgres, redis, minio, api, worker, frontend)
- Monitoring stack: Winston logging, Prometheus metrics, Loki log aggregation, Grafana dashboards, Alloy collector
- Typed environment config (`backend/src/config/env.ts`)
- Structured error handling with AppError and error codes
- Database backup script for Railway deployment
- Production-ready multi-stage Dockerfiles
