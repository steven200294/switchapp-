import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { listFavorites, addFavorite, removeFavorite } from "../services/favorites.service";

export function useFavorites(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.FAVORITES,
    queryFn: listFavorites,
    enabled,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => addFavorite(propertyId),
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FAVORITES });
      const prev = queryClient.getQueryData(QUERY_KEYS.FAVORITES);
      queryClient.setQueryData(QUERY_KEYS.FAVORITES, (old: { property_id: string }[] | undefined) => [
        ...(old ?? []),
        { property_id: propertyId },
      ]);
      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) queryClient.setQueryData(QUERY_KEYS.FAVORITES, context.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES }),
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => removeFavorite(propertyId),
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.FAVORITES });
      const prev = queryClient.getQueryData(QUERY_KEYS.FAVORITES);
      queryClient.setQueryData(QUERY_KEYS.FAVORITES, (old: { property_id: string }[] | undefined) =>
        (old ?? []).filter((f) => f.property_id !== propertyId),
      );
      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) queryClient.setQueryData(QUERY_KEYS.FAVORITES, context.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES }),
  });
}
