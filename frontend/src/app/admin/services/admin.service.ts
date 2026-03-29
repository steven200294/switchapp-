import { apiFetch } from '@/shared/services/api';

export type AdminUser = {
  user_id: string;
  email: string;
  email_confirmed: boolean;
  last_sign_in_at: string | null;
  created_at: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  city: string | null;
  phone: string | null;
  bio: string | null;
  profession: string | null;
  verified: boolean;
};

export type AdminProperty = {
  id: string;
  owner_id: string;
  owner_full_name: string | null;
  owner_email: string | null;
  title: string;
  city: string | null;
  monthly_rent: number | null;
  surface_area: number | null;
  rooms: number | null;
  bedrooms: number | null;
  published: boolean;
  photos: string[];
  cover_image: string | null;
  cover_path: string | null;
  created_at: string | null;
};

export type AdminStats = {
  userCount: number;
  propertyCount: number;
  verifiedEmailCount: number;
  withAvatarCount: number;
  withPropertyCount: number;
};

export type AdminUsersResult = {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
};

export type AdminPropertiesResult = {
  properties: AdminProperty[];
  total: number;
};

export type AdminUserDetailResult = {
  user: AdminUser;
  properties: AdminProperty[];
};

export function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>('/admin/dashboard');
}

export function getAdminUsers(): Promise<AdminUsersResult> {
  return apiFetch<AdminUsersResult>('/admin/users');
}

export function getAdminUser(id: string): Promise<AdminUserDetailResult> {
  return apiFetch<AdminUserDetailResult>(`/admin/users/${id}`);
}

export function getAdminProperties(): Promise<AdminPropertiesResult> {
  return apiFetch<AdminPropertiesResult>('/admin/properties');
}
