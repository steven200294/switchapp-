import { useQuery, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { DECK_SIZE, STALE_TIME } from "@/shared/constants/theme";
import { getSwipeDeck, recordSwipe, undoSwipe } from "../services/swipe.service";

export function useSwipeDeck(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.SWIPE_DECK,
    queryFn: () => getSwipeDeck(DECK_SIZE),
    enabled,
    staleTime: STALE_TIME,
  });
}

export function useSwipeMutation(onMatch?: () => void) {
  return useMutation({
    mutationFn: ({ propertyId, action }: { propertyId: string; action: "like" | "nope" | "super_like" }) =>
      recordSwipe(propertyId, action),
    onSuccess: (result) => {
      if (result.matched) onMatch?.();
    },
  });
}

export function useUndoSwipe(onUndo?: () => void) {
  return useMutation({
    mutationFn: undoSwipe,
    onSuccess: (result) => {
      if (result.undone) onUndo?.();
    },
  });
}
