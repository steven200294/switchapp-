import { apiFetch } from "@/shared/services/api";
import type { MatchListItem } from "../types/messages.types";

export async function listMyMatches(): Promise<MatchListItem[]> {
  return apiFetch<MatchListItem[]>("/matches");
}
