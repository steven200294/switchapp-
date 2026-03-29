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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES }),
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => removeFavorite(propertyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES }),
  });
}
