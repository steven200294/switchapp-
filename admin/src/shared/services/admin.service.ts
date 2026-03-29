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

export type AdminMatch = {
  id: string;
  user_a: string;
  user_b: string;
  property_a: string;
  property_b: string;
  created_at: string;
  user_a_name: string | null;
  user_b_name: string | null;
  property_a_title: string | null;
  property_b_title: string | null;
};

export type AdminSwipe = {
  id: string;
  user_id: string;
  property_id: string;
  action: string;
  created_at: string;
  user_name: string | null;
  property_title: string | null;
};

export type AdminSwipeStats = {
  totalSwipes: number;
  likes: number;
  dislikes: number;
  superLikes: number;
};

export type AdminConversation = {
  id: string;
  match_id: string | null;
  created_at: string;
  last_message_at: string | null;
  last_message_text: string | null;
  message_count: number;
  participant_names: string | null;
};

export type AdminMessage = {
  id: string;
  sender_id: string;
  sender_name: string | null;
  content: string | null;
  created_at: string;
};

export type MetricsSummary = {
  users: { total: number; verified: number; withAvatar: number; withProperty: number };
  properties: { total: number; published: number; draft: number };
  matches: { total: number; last24h: number; last7d: number };
  swipes: { total: number; likes: number; dislikes: number; last24h: number };
  conversations: { total: number; withMessages: number };
  messages: { total: number; last24h: number };
};

export const getAdminStats = (): Promise<AdminStats> =>
  apiFetch('/admin/dashboard');

export const getAdminUsers = (page = 1, limit = 20): Promise<{ users: AdminUser[]; total: number }> =>
  apiFetch(`/admin/users?page=${page}&limit=${limit}`);

export const getAdminUser = (id: string): Promise<{ user: AdminUser; properties: AdminProperty[] }> =>
  apiFetch(`/admin/users/${id}`);

export const getAdminProperties = (page = 1, limit = 20): Promise<{ properties: AdminProperty[]; total: number }> =>
  apiFetch(`/admin/properties?page=${page}&limit=${limit}`);

export const getAdminMatches = (page = 1, limit = 20): Promise<{ matches: AdminMatch[]; total: number }> =>
  apiFetch(`/admin/matches?page=${page}&limit=${limit}`);

export const getAdminSwipes = (page = 1, limit = 20): Promise<{ swipes: AdminSwipe[]; total: number }> =>
  apiFetch(`/admin/swipes?page=${page}&limit=${limit}`);

export const getAdminSwipeStats = (): Promise<AdminSwipeStats> =>
  apiFetch('/admin/swipes/stats');

export const getAdminConversations = (page = 1, limit = 20): Promise<{ conversations: AdminConversation[]; total: number }> =>
  apiFetch(`/admin/conversations?page=${page}&limit=${limit}`);

export const getConversationMessages = (id: string, page = 1, limit = 50): Promise<{ messages: AdminMessage[]; total: number }> =>
  apiFetch(`/admin/conversations/${id}?page=${page}&limit=${limit}`);

export const getMetricsSummary = (): Promise<MetricsSummary> =>
  apiFetch('/admin/metrics/summary');
