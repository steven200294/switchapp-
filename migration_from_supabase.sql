-- ============================================================================
-- SwitchAppart: Supabase → Local PostgreSQL Migration (Schema Only)
-- Target: postgres://switchapp:changeme@localhost:5432/switchapp
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. Custom enums
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE identity_status AS ENUM ('not_submitted','pending','verified','rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE document_status AS ENUM ('missing','uploaded','pending_review','rejected','approved');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 2. Auth schema and auth.users table
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  instance_id uuid,
  id uuid NOT NULL PRIMARY KEY,
  aud varchar(255),
  role varchar(255),
  email varchar(255),
  encrypted_password varchar(255),
  email_confirmed_at timestamptz,
  invited_at timestamptz,
  confirmation_token varchar(255),
  confirmation_sent_at timestamptz,
  recovery_token varchar(255),
  recovery_sent_at timestamptz,
  email_change_token_new varchar(255),
  email_change varchar(255),
  email_change_sent_at timestamptz,
  last_sign_in_at timestamptz,
  raw_app_meta_data jsonb,
  raw_user_meta_data jsonb,
  is_super_admin boolean,
  created_at timestamptz,
  updated_at timestamptz,
  phone text DEFAULT NULL,
  phone_confirmed_at timestamptz,
  phone_change text DEFAULT '',
  phone_change_token varchar(255) DEFAULT '',
  phone_change_sent_at timestamptz,
  confirmed_at timestamptz,
  email_change_token_current varchar(255) DEFAULT '',
  email_change_confirm_status smallint DEFAULT 0,
  banned_until timestamptz,
  reauthentication_token varchar(255) DEFAULT '',
  reauthentication_sent_at timestamptz,
  is_sso_user boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  is_anonymous boolean NOT NULL DEFAULT false
);

-- ============================================================================
-- 3. Sequences for auto-increment columns
-- ============================================================================

CREATE SEQUENCE IF NOT EXISTS city_districts_id_seq;
CREATE SEQUENCE IF NOT EXISTS property_views_id_seq;

-- ============================================================================
-- 4. Public tables (ordered by FK dependencies)
-- ============================================================================

-- ----- users -----
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL PRIMARY KEY,
  first_name text,
  last_name text,
  age integer,
  profession text,
  phone text,
  bio text,
  avatar_url text,
  updated_at timestamp DEFAULT now(),
  username text,
  is_verified boolean NOT NULL DEFAULT false,
  display_name text,
  email text,
  full_name text,
  date_of_birth date,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id)
);

-- ----- user_profiles -----
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid DEFAULT gen_random_uuid(),
  email text UNIQUE,
  full_name text,
  city text,
  country text DEFAULT 'France',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  budget_min integer DEFAULT 0,
  budget_max integer DEFAULT 100000,
  preferred_property_types text[] DEFAULT '{}',
  preferred_amenities text[] DEFAULT '{}',
  surface_min integer,
  preferred_district text,
  preferred_neighborhood text,
  user_id uuid NOT NULL PRIMARY KEY UNIQUE,
  avatar_url text,
  age integer,
  profession text,
  phone text,
  birthdate date,
  bio text,
  first_name text,
  last_name text,
  date_of_birth date,
  languages text DEFAULT '{}',
  verified boolean DEFAULT false,
  last_seen_at timestamptz,
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- properties -----
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  property_type text DEFAULT 'apartment',
  address text DEFAULT '',
  city text DEFAULT '',
  postal_code text DEFAULT '',
  country text DEFAULT 'France',
  latitude double precision,
  longitude double precision,
  surface_area integer DEFAULT 0,
  rooms integer DEFAULT 1,
  bedrooms integer DEFAULT 1,
  bathrooms integer DEFAULT 1,
  max_occupants integer DEFAULT 1,
  amenities text[] DEFAULT '{}',
  monthly_rent integer DEFAULT 0,
  deposit integer DEFAULT 0,
  utilities_included boolean DEFAULT false,
  furnished boolean DEFAULT false,
  smoking_allowed boolean DEFAULT false,
  pets_allowed boolean DEFAULT false,
  photos text[] DEFAULT '{}',
  available_from timestamptz,
  available_until timestamptz,
  minimum_stay integer DEFAULT 7,
  maximum_stay integer,
  instant_booking boolean DEFAULT false,
  status text DEFAULT 'published',
  roommates integer DEFAULT 0,
  max_roommates integer DEFAULT 1,
  cover_image text,
  compatibility_score integer DEFAULT 80,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  district text,
  neighborhood text,
  is_available boolean NOT NULL DEFAULT true,
  occupancy_status text DEFAULT 'tenant',
  lease_type text DEFAULT 'classic',
  exchange_authorization_status text DEFAULT 'not_declared',
  equipment jsonb DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  photo_paths text[] NOT NULL DEFAULT '{}',
  cover_path text,
  CONSTRAINT properties_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users (id)
);

-- ----- user_switch_passes -----
CREATE TABLE IF NOT EXISTS public.user_switch_passes (
  user_id uuid NOT NULL PRIMARY KEY UNIQUE,
  balance integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_switch_passes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- notifications -----
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  data jsonb NOT NULL DEFAULT '{}',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz,
  content text,
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- city_districts -----
CREATE TABLE IF NOT EXISTS public.city_districts (
  id bigint NOT NULL PRIMARY KEY DEFAULT nextval('city_districts_id_seq'),
  city text NOT NULL,
  district text NOT NULL,
  label text NOT NULL
);
ALTER SEQUENCE city_districts_id_seq OWNED BY public.city_districts.id;

-- ----- favorites -----
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- analytics_events -----
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL,
  actor_user_id uuid,
  target_user_id uuid,
  property_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}',
  session_id text,
  user_agent text,
  CONSTRAINT analytics_events_actor_fk FOREIGN KEY (actor_user_id) REFERENCES auth.users (id),
  CONSTRAINT analytics_events_target_fk FOREIGN KEY (target_user_id) REFERENCES auth.users (id),
  CONSTRAINT analytics_events_property_fk FOREIGN KEY (property_id) REFERENCES public.properties (id),
  CONSTRAINT analytics_events_event_type_check CHECK (event_type = ANY (ARRAY['profile_view','property_view','property_like','property_favorite','match_created','message_received']))
);

-- ----- analytics_daily -----
CREATE TABLE IF NOT EXISTS public.analytics_daily (
  day date NOT NULL,
  user_id uuid NOT NULL,
  property_id uuid NOT NULL,
  metric text NOT NULL,
  value integer NOT NULL DEFAULT 0,
  PRIMARY KEY (day, user_id, property_id, metric),
  CONSTRAINT analytics_daily_user_fk FOREIGN KEY (user_id) REFERENCES auth.users (id),
  CONSTRAINT analytics_daily_property_fk FOREIGN KEY (property_id) REFERENCES public.properties (id),
  CONSTRAINT analytics_daily_metric_check CHECK (metric = ANY (ARRAY['profile_views','property_views','likes_received','favorites_received','matches','messages_received']))
);

-- ----- landlords -----
CREATE TABLE IF NOT EXISTS public.landlords (
  user_id uuid NOT NULL PRIMARY KEY,
  landlord_name text NOT NULL,
  landlord_email text NOT NULL,
  landlord_phone text,
  informed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  landlord_user_id uuid,
  CONSTRAINT landlords_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- notification_unlocks -----
CREATE TABLE IF NOT EXISTS public.notification_unlocks (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  notification_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notification_unlocks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id),
  CONSTRAINT notification_unlocks_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications (id)
);

-- ----- identity_verifications -----
CREATE TABLE IF NOT EXISTS public.identity_verifications (
  user_id uuid NOT NULL PRIMARY KEY UNIQUE,
  status identity_status NOT NULL DEFAULT 'not_submitted',
  id_front_path text,
  id_back_path text,
  selfie_path text,
  rejection_reason text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT identity_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id),
  CONSTRAINT identity_verifications_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users (id)
);

-- ----- property_likes -----
CREATE TABLE IF NOT EXISTS public.property_likes (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id uuid NOT NULL,
  property_id uuid NOT NULL,
  property_owner_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT property_likes_liker_id_fkey FOREIGN KEY (liker_id) REFERENCES auth.users (id),
  CONSTRAINT property_likes_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties (id),
  CONSTRAINT property_likes_property_owner_id_fkey FOREIGN KEY (property_owner_id) REFERENCES auth.users (id)
);

-- ----- matches -----
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a uuid NOT NULL,
  user_b uuid NOT NULL,
  property_a uuid NOT NULL,
  property_b uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT matches_user_a_fkey FOREIGN KEY (user_a) REFERENCES auth.users (id),
  CONSTRAINT matches_user_b_fkey FOREIGN KEY (user_b) REFERENCES auth.users (id),
  CONSTRAINT matches_property_a_fkey FOREIGN KEY (property_a) REFERENCES public.properties (id),
  CONSTRAINT matches_property_b_fkey FOREIGN KEY (property_b) REFERENCES public.properties (id)
);

-- ----- conversations (depends on matches) -----
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_message_at timestamptz,
  last_message_text text,
  match_id uuid,
  CONSTRAINT conversations_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches (id)
);

-- ----- housing_documents -----
CREATE TABLE IF NOT EXISTS public.housing_documents (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  doc_type text NOT NULL DEFAULT 'other',
  title text NOT NULL,
  file_path text NOT NULL,
  mime_type text,
  file_size bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT housing_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- kv_store_515d6ac6 -----
CREATE TABLE IF NOT EXISTS public.kv_store_515d6ac6 (
  key text NOT NULL PRIMARY KEY,
  value jsonb
);

-- ----- user_search_preferences -----
CREATE TABLE IF NOT EXISTS public.user_search_preferences (
  user_id uuid NOT NULL PRIMARY KEY,
  destination text,
  budget_max integer,
  surface_min integer,
  updated_at timestamptz DEFAULT now(),
  preferred_locations text,
  property_type text,
  bedrooms_min integer,
  bathrooms_min integer,
  guests_min integer,
  amenities text[],
  furnished_only boolean,
  balcony boolean,
  terrace boolean,
  garden boolean,
  parking boolean,
  elevator boolean,
  pmr_access boolean,
  pets_allowed boolean,
  non_smoker_only boolean,
  kids_allowed boolean,
  min_nights integer,
  furnished boolean,
  air_conditioning boolean,
  smoking_allowed boolean,
  equipment text[],
  filters jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  rules jsonb DEFAULT '{}',
  preferred_city text,
  criteria jsonb DEFAULT '{}',
  CONSTRAINT user_search_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- admin_users -----
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid NOT NULL PRIMARY KEY,
  CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- property_views -----
CREATE TABLE IF NOT EXISTS public.property_views (
  id bigint NOT NULL PRIMARY KEY DEFAULT nextval('property_views_id_seq'),
  user_id uuid NOT NULL,
  property_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT property_views_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties (id)
);
ALTER SEQUENCE property_views_id_seq OWNED BY public.property_views.id;

-- ----- user_identity_verifications -----
CREATE TABLE IF NOT EXISTS public.user_identity_verifications (
  user_id uuid NOT NULL PRIMARY KEY,
  status text NOT NULL DEFAULT 'not_started',
  doc_front_path text,
  doc_back_path text,
  selfie_path text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid,
  reject_reason text,
  CONSTRAINT user_identity_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id),
  CONSTRAINT user_identity_verifications_status_check CHECK (status = ANY (ARRAY['not_started','pending','verified','rejected']))
);

-- ----- user_documents -----
CREATE TABLE IF NOT EXISTS public.user_documents (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  doc_type text NOT NULL,
  status document_status NOT NULL DEFAULT 'uploaded',
  file_path text NOT NULL,
  file_name text,
  file_mime text,
  file_size integer,
  rejection_reason text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- matching_swipes -----
CREATE TABLE IF NOT EXISTS public.matching_swipes (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid NOT NULL,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT matching_swipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id),
  CONSTRAINT matching_swipes_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties (id),
  CONSTRAINT matching_swipes_action_check CHECK (action = ANY (ARRAY['like','nope']))
);

-- ----- exchange_offers (depends on conversations, properties, auth.users) -----
CREATE TABLE IF NOT EXISTS public.exchange_offers (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  proposer_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  property_offered uuid NOT NULL,
  property_requested uuid NOT NULL,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  exchange_date date,
  property_from_id uuid,
  property_to_id uuid,
  CONSTRAINT exchange_offers_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations (id),
  CONSTRAINT exchange_offers_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES auth.users (id),
  CONSTRAINT exchange_offers_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES auth.users (id),
  CONSTRAINT exchange_offers_property_offered_fkey FOREIGN KEY (property_offered) REFERENCES public.properties (id),
  CONSTRAINT exchange_offers_property_requested_fkey FOREIGN KEY (property_requested) REFERENCES public.properties (id),
  CONSTRAINT exchange_offers_status_check CHECK (status = ANY (ARRAY['pending','accepted','rejected','cancelled']))
);

-- ----- exchange_contracts (depends on conversations, exchange_offers, auth.users) -----
CREATE TABLE IF NOT EXISTS public.exchange_contracts (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a uuid NOT NULL,
  user_b uuid NOT NULL,
  property_a uuid,
  property_b uuid,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  signed_at timestamptz,
  conversation_id uuid,
  offer_id uuid,
  exchange_date date,
  draft_pdf_path text,
  signed_pdf_path text,
  prop_a_title text,
  prop_a_address text,
  prop_a_city text,
  prop_a_surface numeric,
  prop_a_rooms integer,
  prop_a_rent numeric,
  prop_a_photos text[],
  prop_b_title text,
  prop_b_address text,
  prop_b_city text,
  prop_b_surface numeric,
  prop_b_rooms integer,
  prop_b_rent numeric,
  prop_b_photos text[],
  user_a_name text,
  user_a_email text,
  user_a_phone text,
  user_b_name text,
  user_b_email text,
  user_b_phone text,
  landlord_a_name text,
  landlord_a_email text,
  landlord_a_phone text,
  landlord_b_name text,
  landlord_b_email text,
  landlord_b_phone text,
  CONSTRAINT exchange_contracts_user_a_fkey FOREIGN KEY (user_a) REFERENCES auth.users (id),
  CONSTRAINT exchange_contracts_user_b_fkey FOREIGN KEY (user_b) REFERENCES auth.users (id),
  CONSTRAINT exchange_contracts_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations (id),
  CONSTRAINT exchange_contracts_offer_fk FOREIGN KEY (offer_id) REFERENCES public.exchange_offers (id)
);

-- ----- exchange_requests (depends on matches, exchange_contracts, auth.users) -----
CREATE TABLE IF NOT EXISTS public.exchange_requests (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL,
  proposer_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  accepted_by_proposer boolean NOT NULL DEFAULT true,
  accepted_by_receiver boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  contract_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT exchange_requests_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches (id),
  CONSTRAINT exchange_requests_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES auth.users (id),
  CONSTRAINT exchange_requests_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES auth.users (id),
  CONSTRAINT exchange_requests_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.exchange_contracts (id),
  CONSTRAINT exchange_requests_status_check CHECK (status = ANY (ARRAY['pending','accepted','declined','canceled']))
);

-- ----- exchange_contract_signatures -----
CREATE TABLE IF NOT EXISTS public.exchange_contract_signatures (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid,
  signer_user_id uuid,
  user_id uuid,
  typed_name text,
  signed_at timestamptz DEFAULT now(),
  user_agent text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT exchange_contract_signatures_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.exchange_contracts (id)
);

-- ----- exchange_contract_signatures_backup (no PK, backup table) -----
CREATE TABLE IF NOT EXISTS public.exchange_contract_signatures_backup (
  id uuid,
  contract_id uuid,
  signer_user_id uuid,
  signer_role text,
  accepted boolean,
  typed_name text,
  accepted_at timestamptz,
  ip_address inet,
  user_agent text,
  created_at timestamptz,
  user_id uuid,
  signed_at timestamptz
);

-- ----- contract_signatures -----
CREATE TABLE IF NOT EXISTS public.contract_signatures (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL,
  user_id uuid NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contract_signatures_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.exchange_contracts (id),
  CONSTRAINT contract_signatures_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- conversation_participants -----
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  last_read_at timestamptz,
  PRIMARY KEY (conversation_id, user_id),
  CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations (id),
  CONSTRAINT conversation_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
);

-- ----- messages -----
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content text,
  attachment_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations (id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users (id)
);

-- ----- property_interactions -----
CREATE TABLE IF NOT EXISTS public.property_interactions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid NOT NULL,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT property_interactions_action_check CHECK (action = ANY (ARRAY['like','dislike']))
);

COMMIT;

-- DATA INSERTS WILL BE ADDED BELOW
-- Run: docker compose exec -T postgres psql -U switchapp -d switchapp < migration_from_supabase.sql
