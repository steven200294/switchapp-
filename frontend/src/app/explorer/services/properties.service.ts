import { apiFetch } from "@/shared/services/api";
import type { Property, PropertiesResponse, PropertiesFilters } from "../types/properties.types";

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
