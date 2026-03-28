import { apiFetch } from '@/shared/services/api';

export interface PropertyOwner {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  verified: boolean | null;
  city: string | null;
  profession: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string | null;
  property_type: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  postal_code: string | null;
  surface_area: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  monthly_rent: number | null;
  deposit: number | null;
  furnished: boolean | null;
  pets_allowed: boolean | null;
  smoking_allowed: boolean | null;
  utilities_included: boolean | null;
  photos: string[];
  cover_image: string | null;
  amenities: string[];
  available_from: string | null;
  available_until: string | null;
  created_at: string | null;
  owner: PropertyOwner;
}

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

export async function listProperties(params?: {
  page?: number;
  limit?: number;
  city?: string;
  q?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_surface?: number;
  furnished?: boolean;
}): Promise<PropertiesResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') searchParams.set(key, String(value));
    });
  }
  const qs = searchParams.toString();
  return apiFetch<PropertiesResponse>(`/properties${qs ? `?${qs}` : ''}`);
}

export async function getProperty(id: string): Promise<Property> {
  return apiFetch<Property>(`/properties/${id}`);
}
