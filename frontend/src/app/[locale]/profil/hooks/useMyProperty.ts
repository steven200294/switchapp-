"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getMyProperty } from "../services/property.service";
import { useAuthStore } from "@/shared/stores/auth.store";

export function useMyProperty() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.MY_PROPERTY,
    queryFn: getMyProperty,
    enabled: !!user,
    staleTime: 30_000,
  });
}
