import { apiFetch } from '@/shared/services/api';
import type { AuthUser } from '@/modules/auth/types/auth.types';

export type AdminStats = {
  totalUsers: number;
  totalProperties: number;
  recentSignups: number;
};

export type AdminProperty = {
  id: string;
  title: string;
  city: string;
  rent: number;
  status: string;
  owner_name: string;
  owner_id: string;
  created_at: string;
};

export function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>('/admin/stats');
}

export function getAdminUsers(): Promise<AuthUser[]> {
  return apiFetch<AuthUser[]>('/admin/users');
}

export function getAdminUser(id: string): Promise<{ user: AuthUser; properties: AdminProperty[] }> {
  return apiFetch<{ user: AuthUser; properties: AdminProperty[] }>(`/admin/users/${id}`);
}

export function getAdminProperties(): Promise<AdminProperty[]> {
  return apiFetch<AdminProperty[]>('/admin/properties');
}
