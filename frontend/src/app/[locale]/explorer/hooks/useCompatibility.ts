import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getPropertyCompatibility } from "@/app/[locale]/explorer/services/compatibility.service";

export function useCompatibility(propertyId: string, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.COMPATIBILITY(propertyId),
    queryFn: () => getPropertyCompatibility(propertyId),
    enabled: enabled && Boolean(propertyId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
