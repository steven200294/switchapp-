import prisma from '../../infra/prisma/client.js';

export async function findPropertyById(id: string) {
  return prisma.property.findUnique({ where: { id } });
}

export async function findByUserId(userId: string) {
  return prisma.favorite.findMany({
    where: { user_id: userId },
    include: {
      property: {
        include: {
          owner: { select: { full_name: true, avatar_url: true, city: true, user_id: true } },
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function findExisting(userId: string, propertyId: string) {
  return prisma.favorite.findFirst({
    where: { user_id: userId, property_id: propertyId },
  });
}

export async function create(userId: string, propertyId: string) {
  return prisma.favorite.create({
    data: { user_id: userId, property_id: propertyId },
  });
}

export async function remove(userId: string, propertyId: string) {
  const fav = await prisma.favorite.findFirst({
    where: { user_id: userId, property_id: propertyId },
  });
  if (!fav) return null;
  return prisma.favorite.delete({ where: { id: fav.id } });
}
