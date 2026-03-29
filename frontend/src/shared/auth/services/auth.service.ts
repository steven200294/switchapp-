import { apiFetch } from '@/shared/services/api';
import type { AuthUser } from '../types/auth.types';

export function registerUser(data: { email: string; password: string; full_name: string }): Promise<{ user: AuthUser; token: string }> {
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
