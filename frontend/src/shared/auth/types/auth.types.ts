export type AuthUser = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  city?: string;
  verified?: boolean;
  role?: string;
  created_at?: string;
  email_confirmed_at?: string | null;
  phone_verified_at?: string | null;
};
