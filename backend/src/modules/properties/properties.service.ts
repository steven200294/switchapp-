import * as repo from './properties.repository.js';
import type { PropertyFilters } from './properties.repository.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';
import { geocode } from '../geocoding/geocoding.service.js';
import type { Property } from '@prisma/client';

interface CompletionField {
  weight: number;
  filled: boolean;
}

export function calculateCompletion(p: Property): number {
  const fields: CompletionField[] = [
    { weight: 10, filled: !!p.property_type },
    { weight: 13, filled: !!p.address && !!p.city },
    { weight: 10, filled: (p.surface_area ?? 0) > 0 },
    { weight: 8, filled: (p.rooms ?? 0) > 0 },
    { weight: 10, filled: (p.monthly_rent ?? 0) > 0 },
    { weight: 13, filled: p.photos.length > 0 },
    { weight: 10, filled: !!p.description && p.description.length > 0 },
    { weight: 5, filled: (p.bedrooms ?? 0) > 0 },
    { weight: 5, filled: (p.bathrooms ?? 0) > 0 },
    { weight: 8, filled: p.amenities.length > 0 },
    { weight: 8, filled: (p.deposit ?? 0) > 0 },
  ];
  return fields.reduce((sum, f) => sum + (f.filled ? f.weight : 0), 0);
}

export async function list(filters: PropertyFilters, page: number, limit: number) {
  const [properties, total] = await Promise.all([
    repo.findMany(filters, page, limit),
    repo.count(filters),
  ]);
  return { properties, total, page, limit };
}

export async function getById(id: string, requesterId?: string) {
  const property = await repo.findById(id);
  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  if (!property.published && property.owner_id !== requesterId) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  return property;
}

export async function create(ownerId: string, data: Record<string, unknown>) {
  const existing = await repo.findFirstByOwner(ownerId);

  const address = (data.address as string) || '';
  const city = (data.city as string) || '';
  const postalCode = (data.postal_code as string) || '';
  const isDraft = (data.status as string) === 'draft';

  const coords = await geocode(address, city, postalCode);

  const payload = {
    title: data.title as string,
    description: (data.description as string) || '',
    property_type: (data.property_type as string) || 'apartment',
    address,
    city,
    district: data.district as string | undefined,
    postal_code: postalCode,
    latitude: coords?.latitude,
    longitude: coords?.longitude,
    surface_area: (data.surface_area as number) || 0,
    rooms: (data.rooms as number) || 1,
    bedrooms: data.bedrooms as number | undefined,
    bathrooms: data.bathrooms as number | undefined,
    monthly_rent: (data.monthly_rent as number) || 0,
    deposit: data.deposit as number | undefined,
    utilities_included: data.utilities_included as boolean | undefined,
    furnished: data.furnished as boolean | undefined,
    smoking_allowed: data.smoking_allowed as boolean | undefined,
    pets_allowed: data.pets_allowed as boolean | undefined,
    photos: (data.photos as string[]) || [],
    photo_paths: (data.photo_paths as string[]) || [],
    cover_image: data.cover_image as string | undefined,
    cover_path: data.cover_path as string | undefined,
    amenities: (data.amenities as string[]) || [],
    available_from: data.available_from ? new Date(data.available_from as string) : undefined,
    available_until: data.available_until ? new Date(data.available_until as string) : undefined,
    status: isDraft ? 'draft' : 'published',
    published: !isDraft,
    updated_at: new Date(),
  };

  if (existing) {
    return repo.update(existing.id, payload);
  }

  return repo.create({ ...payload, owner_id: ownerId });
}

export async function saveDraft(ownerId: string, data: Record<string, unknown>) {
  const existing = await repo.findFirstByOwner(ownerId);

  const address = (data.address as string) || '';
  const city = (data.city as string) || '';
  const postalCode = (data.postal_code as string) || '';

  let latitude: number | undefined;
  let longitude: number | undefined;

  if (address || city) {
    const coords = await geocode(address, city, postalCode);
    latitude = coords?.latitude;
    longitude = coords?.longitude;
  }

  const payload = {
    title: (data.title as string) || '',
    description: (data.description as string) || '',
    property_type: (data.property_type as string) || 'apartment',
    address,
    city,
    district: data.district as string | undefined,
    postal_code: postalCode,
    latitude,
    longitude,
    surface_area: (data.surface_area as number) || 0,
    rooms: (data.rooms as number) || 0,
    bedrooms: data.bedrooms as number | undefined,
    bathrooms: data.bathrooms as number | undefined,
    monthly_rent: (data.monthly_rent as number) || 0,
    deposit: data.deposit as number | undefined,
    utilities_included: data.utilities_included as boolean | undefined,
    furnished: data.furnished as boolean | undefined,
    smoking_allowed: data.smoking_allowed as boolean | undefined,
    pets_allowed: data.pets_allowed as boolean | undefined,
    photos: (data.photos as string[]) || [],
    photo_paths: (data.photo_paths as string[]) || [],
    cover_image: data.cover_image as string | undefined,
    cover_path: data.cover_path as string | undefined,
    amenities: (data.amenities as string[]) || [],
    status: 'draft' as const,
    published: false,
    updated_at: new Date(),
  };

  if (existing) {
    return repo.update(existing.id, payload);
  }

  return repo.create({ ...payload, owner_id: ownerId });
}

export async function update(id: string, ownerId: string, data: Record<string, unknown>) {
  const existing = await repo.findById(id);
  if (!existing) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  if (existing.owner_id !== ownerId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 403, CLIENT_MESSAGES[ERROR_CODES.FORBIDDEN]);
  }
  const updateData: Record<string, unknown> = { ...data, updated_at: new Date() };
  if (data.available_from) updateData.available_from = new Date(data.available_from as string);
  if (data.available_until) updateData.available_until = new Date(data.available_until as string);

  if (data.status === 'published') {
    updateData.published = true;
  }

  const addressChanged =
    (data.address !== undefined && data.address !== existing.address) ||
    (data.city !== undefined && data.city !== existing.city) ||
    (data.postal_code !== undefined && data.postal_code !== existing.postal_code);

  if (addressChanged) {
    const newAddr = (data.address as string) ?? existing.address ?? '';
    const newCity = (data.city as string) ?? existing.city ?? '';
    const newPostal = (data.postal_code as string) ?? existing.postal_code ?? '';
    const coords = await geocode(newAddr, newCity, newPostal);
    if (coords) {
      updateData.latitude = coords.latitude;
      updateData.longitude = coords.longitude;
    }
  }

  return repo.update(id, updateData);
}

export async function remove(id: string, ownerId: string): Promise<void> {
  const existing = await repo.findById(id);
  if (!existing) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  if (existing.owner_id !== ownerId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 403, CLIENT_MESSAGES[ERROR_CODES.FORBIDDEN]);
  }
  await repo.remove(id);
}

export async function getMyProperty(ownerId: string) {
  const property = await repo.findFirstByOwner(ownerId);
  if (!property) return null;
  return {
    ...property,
    completion: calculateCompletion(property),
  };
}
