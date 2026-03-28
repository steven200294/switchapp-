import * as repo from './properties.repository.js';
import type { PropertyFilters } from './properties.repository.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function list(filters: PropertyFilters, page: number, limit: number) {
  const [properties, total] = await Promise.all([
    repo.findMany(filters, page, limit),
    repo.count(filters),
  ]);
  return { properties, total, page, limit };
}

export async function getById(id: string) {
  const property = await repo.findById(id);
  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  return property;
}

export async function create(ownerId: string, data: Record<string, unknown>) {
  return repo.create({
    owner_id: ownerId,
    title: data.title as string,
    description: (data.description as string) || '',
    property_type: (data.property_type as string) || 'apartment',
    address: (data.address as string) || '',
    city: (data.city as string) || '',
    district: data.district as string | undefined,
    postal_code: (data.postal_code as string) || '',
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
    cover_image: data.cover_image as string | undefined,
    amenities: (data.amenities as string[]) || [],
    available_from: data.available_from ? new Date(data.available_from as string) : undefined,
    available_until: data.available_until ? new Date(data.available_until as string) : undefined,
    status: 'published',
    published: true,
  });
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

export async function getByOwnerId(ownerId: string) {
  return repo.findByOwnerId(ownerId);
}
