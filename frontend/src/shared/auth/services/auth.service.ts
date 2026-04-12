import { apiFetch } from '@/shared/services/api';
import type { AuthUser } from '../types/auth.types';

interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  captcha_token: string;
}

export function registerUser(data: RegisterPayload): Promise<{ user: AuthUser; token: string }> {
  return apiFetch<{ user: AuthUser; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function loginUser(data: { email: string; password: string }): Promise<{ user: AuthUser; token: string }> {
  return apiFetch<{ user: AuthUser; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMe(): Promise<{ user: AuthUser }> {
  return apiFetch<{ user: AuthUser }>('/auth/me');
}

export function sendEmailVerification(email: string): Promise<{ sent: boolean }> {
  return apiFetch<{ sent: boolean }>('/verification/email/send', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function sendPhoneOtp(phone: string, countryCode: string): Promise<{ sent: boolean }> {
  return apiFetch<{ sent: boolean }>('/verification/phone/send', {
    method: 'POST',
    body: JSON.stringify({ phone, country_code: countryCode }),
  });
}

export function verifyPhoneOtp(phone: string, code: string): Promise<{ verified: boolean }> {
  return apiFetch<{ verified: boolean }>('/verification/phone/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
}

export function updatePreferences(data: Record<string, unknown>): Promise<unknown> {
  return apiFetch('/users/me/preferences', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export interface UserProfile {
  user_id: string;
  city?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferred_property_types?: string[];
  preferred_amenities?: string[];
  surface_min?: number | null;
  [key: string]: unknown;
}

export function getMyProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/me/profile');
}
