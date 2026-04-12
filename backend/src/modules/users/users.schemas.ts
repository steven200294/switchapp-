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
  user_type: z.enum(['tenant', 'owner', 'both']).optional(),
  budget_min: z.number().int().min(0).optional(),
  budget_max: z.number().int().min(0).optional(),
  preferred_property_types: z.array(z.string()).optional(),
  preferred_amenities: z.array(z.string()).optional(),
  surface_min: z.number().int().min(0).optional(),
  preferred_district: z.string().max(100).optional(),
  preferred_neighborhood: z.string().max(100).optional(),
}).strict();

export const updatePreferencesSchema = z.object({
  city: z.string().max(100).optional(),
  budget_min: z.number().int().min(0).optional(),
  budget_max: z.number().int().min(0).optional(),
  preferred_property_types: z.array(z.string()).optional(),
  preferred_amenities: z.array(z.string()).optional(),
  surface_min: z.number().int().min(0).optional(),
  preferred_district: z.string().max(100).optional(),
  preferred_neighborhood: z.string().max(100).optional(),
}).strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
