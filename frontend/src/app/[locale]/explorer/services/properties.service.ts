import { apiFetch } from "@/shared/services/api";
import type { Property, PropertiesResponse, PropertiesFilters, FeedResponse, CategoryPageResponse } from "../types/properties.types";

export type { Property, PropertiesResponse, PropertyOwner } from "../types/properties.types";

export async function listProperties(params?: PropertiesFilters): Promise<PropertiesResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") searchParams.set(key, String(value));
    });
  }
  const qs = searchParams.toString();
  return apiFetch<PropertiesResponse>(`/properties${qs ? `?${qs}` : ""}`);
}

export async function getProperty(id: string): Promise<Property> {
  return apiFetch<Property>(`/properties/${id}`);
}

export async function getFeed(): Promise<FeedResponse> {
  return apiFetch<FeedResponse>("/properties/feed");
}

export async function getCategoryPage(slug: string, page = 1, limit = 20, city?: string): Promise<CategoryPageResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (city) params.set("city", city);
  return apiFetch<CategoryPageResponse>(`/properties/feed/${slug}?${params}`);
}
