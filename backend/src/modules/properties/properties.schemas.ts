import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  property_type: z.enum(['apartment', 'studio', 'house', 'loft', 'room']).optional(),
  address: z.string().max(500).optional(),
  city: z.string().min(1).max(100),
  district: z.string().max(100).optional(),
  postal_code: z.string().max(10).optional(),
  surface_area: z.number().int().min(1),
  rooms: z.number().int().min(1),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  monthly_rent: z.number().int().min(0),
  deposit: z.number().int().min(0).optional(),
  utilities_included: z.boolean().optional(),
  furnished: z.boolean().optional(),
  smoking_allowed: z.boolean().optional(),
  pets_allowed: z.boolean().optional(),
  photos: z.array(z.string().url()).optional(),
  photo_paths: z.array(z.string()).optional(),
  cover_image: z.string().url().optional(),
  cover_path: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  available_from: z.string().datetime().optional(),
  available_until: z.string().datetime().optional(),
  status: z.enum(['draft', 'published']).optional(),
}).strip();

export const saveDraftSchema = z.object({
  property_type: z.enum(['apartment', 'studio', 'house', 'loft', 'room']).optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  postal_code: z.string().max(10).optional(),
  surface_area: z.number().int().min(0).optional(),
  rooms: z.number().int().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  monthly_rent: z.number().int().min(0).optional(),
  deposit: z.number().int().min(0).optional(),
  utilities_included: z.boolean().optional(),
  furnished: z.boolean().optional(),
  smoking_allowed: z.boolean().optional(),
  pets_allowed: z.boolean().optional(),
  photos: z.array(z.string().url()).optional(),
  photo_paths: z.array(z.string()).optional(),
  cover_image: z.string().url().optional(),
  cover_path: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  available_from: z.string().datetime().optional(),
  available_until: z.string().datetime().optional(),
}).strip();

export const updatePropertySchema = createPropertySchema.partial().strip();

export const categoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  city: z.string().optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  city: z.string().optional(),
  property_type: z.enum(['apartment', 'studio', 'house', 'loft', 'room']).optional(),
  min_price: z.coerce.number().int().optional(),
  max_price: z.coerce.number().int().optional(),
  min_surface: z.coerce.number().int().optional(),
  furnished: z.coerce.boolean().optional(),
  pets_allowed: z.coerce.boolean().optional(),
  q: z.string().optional(),
});
