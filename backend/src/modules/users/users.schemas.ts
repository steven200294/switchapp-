import { z } from 'zod';

export const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  profession: z.string().max(100).optional(),
  date_of_birth: z.string().optional(),
  avatar_url: z.string().url().optional(),
}).strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
