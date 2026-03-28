import { apiFetch } from '@/shared/services/api';

export interface FavoriteItem {
  id: string;
  property_id: string;
  created_at: string | null;
  property: {
    id: string;
    title: string;
    city: string | null;
    district: string | null;
    surface_area: number | null;
    rooms: number | null;
    monthly_rent: number | null;
    cover_image: string | null;
    photos: string[];
    owner: {
      full_name: string | null;
      avatar_url: string | null;
      city: string | null;
      user_id: string;
    };
  };
}

export async function listFavorites(): Promise<FavoriteItem[]> {
  return apiFetch<FavoriteItem[]>('/favorites');
}

export async function addFavorite(propertyId: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ property_id: propertyId }),
  });
}

export async function removeFavorite(propertyId: string): Promise<void> {
  return apiFetch<void>(`/favorites/${propertyId}`, { method: 'DELETE' });
}
