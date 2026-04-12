import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { listProperties, getProperty, getFeed, getCategoryPage } from "../services/properties.service";

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

export function useFeed() {
  return useQuery({
    queryKey: QUERY_KEYS.PROPERTIES_FEED,
    queryFn: getFeed,
    staleTime: 60_000,
  });
}

export function useCategoryPage(slug: string, page: number, city?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PROPERTIES_FEED, slug, page, city ?? ""],
    queryFn: () => getCategoryPage(slug, page, 20, city),
    staleTime: 60_000,
    enabled: !!slug,
  });
}
