# Changelog

All notable changes to SwitchAppart will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Optional mock database (`DATABASE_MODE` / `DATABASE_URL_MOCK`) with rich seed data for demos
- AI-powered property compatibility score (viewer preferences + own listing vs viewed property) with configurable provider and model via environment

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
