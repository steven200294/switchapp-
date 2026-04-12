import { apiFetch } from "@/shared/services/api";
import type { MyProperty } from "../types/property.types";

export async function getMyProperty(): Promise<MyProperty | null> {
  return apiFetch<MyProperty | null>("/properties/me");
}

export async function publishPropertyById(id: string): Promise<void> {
  await apiFetch(`/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status: "published", published: true }),
  });
}

export async function unpublishPropertyById(id: string): Promise<void> {
  await apiFetch(`/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status: "draft", published: false }),
  });
}

export async function deletePropertyById(id: string): Promise<void> {
  await apiFetch(`/properties/${id}`, { method: "DELETE" });
}

export async function updateProperty(id: string, data: Record<string, unknown>): Promise<void> {
  await apiFetch(`/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
