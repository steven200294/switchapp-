import { apiFetch } from "@/shared/services/api";
import type { FavoriteItem } from "../types/favorites.types";

export type { FavoriteItem } from "../types/favorites.types";

export async function listFavorites(): Promise<FavoriteItem[]> {
  return apiFetch<FavoriteItem[]>("/favorites");
}

export async function addFavorite(propertyId: string): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/favorites", {
    method: "POST",
    body: JSON.stringify({ property_id: propertyId }),
  });
}

export async function removeFavorite(propertyId: string): Promise<void> {
  return apiFetch<void>(`/favorites/${propertyId}`, { method: "DELETE" });
}
