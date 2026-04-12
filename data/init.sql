--
-- SwitchAppart — Postgres init (runs once on first volume creation)
--
-- This file ONLY manages the auth schema + auth.users table + real Supabase user data.
-- All public.* tables are managed exclusively by Prisma migrations (prisma migrate deploy).
--

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- ── Auth schema (not managed by Prisma) ──────────────────────────
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS public;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

CREATE TABLE IF NOT EXISTS auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::text,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- ── Admin user (bootstrap) ─────────────────────────────
INSERT INTO auth.users (id, email, encrypted_password, aud, role, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous)
VALUES (
    '858a52da-cbb0-41e6-be15-753da1ac29a3',
    'abderrazaq@mail.com',
    public.crypt('admin123', public.gen_salt('bf'::text, 10)),
    'authenticated', 'authenticated',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Abderrazaq"}',
    false, false
) ON CONFLICT (id) DO NOTHING;

-- ── Drop legacy tables from old Supabase dump ──────────
DROP TABLE IF EXISTS public.kv_store_515d6ac6 CASCADE;
DROP TABLE IF EXISTS public.city_districts CASCADE;
DROP TABLE IF EXISTS public.property_views CASCADE;
DROP TABLE IF EXISTS public.property_interactions CASCADE;
DROP TABLE IF EXISTS public.property_likes CASCADE;
DROP TABLE IF EXISTS public.landlords CASCADE;
DROP TABLE IF EXISTS public.user_identity_verifications CASCADE;
DROP TABLE IF EXISTS public.identity_verifications CASCADE;
DROP TABLE IF EXISTS public.user_documents CASCADE;
DROP TABLE IF EXISTS public.housing_documents CASCADE;
DROP TABLE IF EXISTS public.notification_unlocks CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.analytics_daily CASCADE;
DROP TABLE IF EXISTS public.exchange_contracts CASCADE;
DROP TABLE IF EXISTS public.exchange_requests CASCADE;
DROP TABLE IF EXISTS public.exchange_offers CASCADE;
DROP TABLE IF EXISTS public.contract_signatures CASCADE;
DROP TABLE IF EXISTS public.exchange_contract_signatures_backup CASCADE;
DROP TABLE IF EXISTS public.exchange_contract_signatures CASCADE;

-- Drop legacy types
DROP TYPE IF EXISTS public.document_status CASCADE;
DROP TYPE IF EXISTS public.identity_status CASCADE;
