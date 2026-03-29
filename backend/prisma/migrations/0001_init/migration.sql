npm warn Unknown env config "devdir". This will stop working in the next major version of npm.
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255),
    "encrypted_password" VARCHAR(255),
    "email_confirmed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "raw_app_meta_data" JSONB,
    "raw_user_meta_data" JSONB,
    "aud" VARCHAR(255),
    "role" VARCHAR(255),
    "is_sso_user" BOOLEAN NOT NULL DEFAULT false,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "age" INTEGER,
    "profession" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "display_name" TEXT,
    "email" TEXT,
    "full_name" TEXT,
    "date_of_birth" DATE,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID DEFAULT gen_random_uuid(),
    "email" TEXT,
    "full_name" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'France',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "budget_min" INTEGER DEFAULT 0,
    "budget_max" INTEGER DEFAULT 100000,
    "preferred_property_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferred_amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "surface_min" INTEGER,
    "preferred_district" TEXT,
    "preferred_neighborhood" TEXT,
    "user_id" UUID NOT NULL,
    "avatar_url" TEXT,
    "age" INTEGER,
    "profession" TEXT,
    "phone" TEXT,
    "birthdate" DATE,
    "bio" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "date_of_birth" DATE,
    "languages" TEXT DEFAULT '{}',
    "verified" BOOLEAN DEFAULT false,
    "last_seen_at" TIMESTAMPTZ(6),
    "user_type" TEXT DEFAULT 'tenant',

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "property_type" TEXT DEFAULT 'apartment',
    "address" TEXT DEFAULT '',
    "city" TEXT DEFAULT '',
    "postal_code" TEXT DEFAULT '',
    "country" TEXT DEFAULT 'France',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "surface_area" INTEGER DEFAULT 0,
    "rooms" INTEGER DEFAULT 1,
    "bedrooms" INTEGER DEFAULT 1,
    "bathrooms" INTEGER DEFAULT 1,
    "max_occupants" INTEGER DEFAULT 1,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "monthly_rent" INTEGER DEFAULT 0,
    "deposit" INTEGER DEFAULT 0,
    "utilities_included" BOOLEAN DEFAULT false,
    "furnished" BOOLEAN DEFAULT false,
    "smoking_allowed" BOOLEAN DEFAULT false,
    "pets_allowed" BOOLEAN DEFAULT false,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "available_from" TIMESTAMPTZ(6),
    "available_until" TIMESTAMPTZ(6),
    "minimum_stay" INTEGER DEFAULT 7,
    "maximum_stay" INTEGER,
    "instant_booking" BOOLEAN DEFAULT false,
    "status" TEXT DEFAULT 'published',
    "roommates" INTEGER DEFAULT 0,
    "max_roommates" INTEGER DEFAULT 1,
    "cover_image" TEXT,
    "compatibility_score" INTEGER DEFAULT 80,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "district" TEXT,
    "neighborhood" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "occupancy_status" TEXT DEFAULT 'tenant',
    "lease_type" TEXT DEFAULT 'classic',
    "exchange_authorization_status" TEXT DEFAULT 'not_declared',
    "equipment" JSONB DEFAULT '{}',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "photo_paths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cover_path" TEXT,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matching_swipes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matching_swipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_a" UUID NOT NULL,
    "user_b" UUID NOT NULL,
    "property_a" UUID NOT NULL,
    "property_b" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMPTZ(6),
    "last_message_text" TEXT,
    "match_id" UUID,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_read_at" TIMESTAMPTZ(6),

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("conversation_id","user_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "content" TEXT,
    "attachment_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_switch_passes" (
    "user_id" UUID NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_switch_passes_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "user_id" UUID NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "data" JSONB NOT NULL DEFAULT '{}',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMPTZ(6),
    "content" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_profiles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matching_swipes" ADD CONSTRAINT "matching_swipes_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

