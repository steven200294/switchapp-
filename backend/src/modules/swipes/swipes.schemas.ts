import { z } from 'zod';

export const swipeBodySchema = z.object({
  property_id: z.string().uuid(),
  action: z.enum(['like', 'nope', 'super_like']),
});

export type SwipeInput = z.infer<typeof swipeBodySchema>;
