import { apiFetch } from "@/shared/services/api";
import type { CompatibilityResult } from "../types/compatibility.types";

export async function getPropertyCompatibility(propertyId: string): Promise<CompatibilityResult> {
  return apiFetch<CompatibilityResult>(`/properties/${propertyId}/compatibility`);
}
