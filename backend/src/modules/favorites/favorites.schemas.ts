import { z } from 'zod';

export const addFavoriteBodySchema = z.object({
  property_id: z.string().uuid(),
});

export const favoritesRemoveParamsSchema = z.object({
  propertyId: z.string().uuid(),
});

export type AddFavoriteBodyInput = z.infer<typeof addFavoriteBodySchema>;
