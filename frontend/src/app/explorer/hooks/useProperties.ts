import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { listProperties, getProperty } from "../services/properties.service";

export function useProperties(city?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PROPERTIES, city ?? ""],
    queryFn: () => listProperties({
      limit: 20,
      ...(city ? { city } : {}),
    }),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PROPERTY(id),
    queryFn: () => getProperty(id),
    enabled: !!id,
  });
}
