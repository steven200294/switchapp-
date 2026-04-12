import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { STALE_TIME } from "@/shared/constants/theme";
import { listMyMatches } from "../services/matches.service";

export function useMatches(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.MY_MATCHES,
    queryFn: listMyMatches,
    enabled,
    staleTime: STALE_TIME,
  });
}
