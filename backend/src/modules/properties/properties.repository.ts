import prisma from '../../infra/prisma/client.js';
import type { Prisma } from '@prisma/client';

export interface PropertyFilters {
  city?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_surface?: number;
  furnished?: boolean;
  pets_allowed?: boolean;
  q?: string;
}

function buildWhere(filters: PropertyFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { published: true, status: 'published' };

  if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
  if (filters.property_type) where.property_type = filters.property_type;
  if (filters.min_price || filters.max_price) {
    where.monthly_rent = {};
    if (filters.min_price) where.monthly_rent.gte = filters.min_price;
    if (filters.max_price) where.monthly_rent.lte = filters.max_price;
  }
  if (filters.min_surface) where.surface_area = { gte: filters.min_surface };
  if (filters.furnished !== undefined) where.furnished = filters.furnished;
  if (filters.pets_allowed !== undefined) where.pets_allowed = filters.pets_allowed;
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } },
      { city: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

const ownerSelect = { full_name: true, avatar_url: true, verified: true, user_id: true, profession: true, city: true } as const;

export async function findMany(filters: PropertyFilters, page: number, limit: number) {
  return prisma.property.findMany({
    where: buildWhere(filters),
    include: { owner: { select: ownerSelect } },
    orderBy: { created_at: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });
}

export async function count(filters: PropertyFilters): Promise<number> {
  return prisma.property.count({ where: buildWhere(filters) });
}

export async function findById(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: { owner: { select: ownerSelect } },
  });
}

export async function create(data: Prisma.PropertyUncheckedCreateInput) {
  return prisma.property.create({ data });
}

export async function update(id: string, data: Prisma.PropertyUpdateInput) {
  return prisma.property.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.property.delete({ where: { id } });
}

export async function findByOwnerId(ownerId: string) {
  return prisma.property.findMany({ where: { owner_id: ownerId }, orderBy: { created_at: 'desc' } });
}

export async function findFirstPublishedByOwner(ownerId: string) {
  return prisma.property.findFirst({
    where: { owner_id: ownerId, published: true, status: 'published' },
    orderBy: { created_at: 'desc' },
  });
}
