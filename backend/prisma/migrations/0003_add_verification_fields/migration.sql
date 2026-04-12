-- AlterTable
ALTER TABLE "public"."user_profiles" ADD COLUMN IF NOT EXISTS "registration_ip" TEXT;
ALTER TABLE "public"."user_profiles" ADD COLUMN IF NOT EXISTS "phone_verified_at" TIMESTAMPTZ(6);
ALTER TABLE "public"."user_profiles" ADD COLUMN IF NOT EXISTS "phone_country_code" TEXT;
ALTER TABLE "public"."user_profiles" ADD COLUMN IF NOT EXISTS "phone_number" TEXT;
