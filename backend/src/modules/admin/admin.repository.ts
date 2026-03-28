import prisma from '../../infra/prisma/client.js';

export async function getDashboardStats(): Promise<{
  userCount: number;
  propertyCount: number;
  recentUsers: unknown[];
}> {
  const [userCount, propertyCount, recentUsers] = await Promise.all([
    prisma.authUser.count(),
    prisma.property.count(),
    prisma.userProfile.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
    }),
  ]);

  return { userCount, propertyCount, recentUsers };
}

export async function listUsers(page: number, limit: number): Promise<{
  users: unknown[];
  total: number;
}> {
  const [users, total] = await Promise.all([
    prisma.userProfile.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.userProfile.count(),
  ]);

  return { users, total };
}

export async function getUserById(id: string): Promise<{
  authUser: unknown;
  profile: unknown;
  properties: unknown[];
} | null> {
  const [authUser, profile, properties] = await Promise.all([
    prisma.authUser.findUnique({ where: { id } }),
    prisma.userProfile.findUnique({ where: { user_id: id } }),
    prisma.property.findMany({ where: { owner_id: id } }),
  ]);

  if (!authUser) return null;

  return { authUser, profile, properties };
}

export async function listProperties(page: number, limit: number): Promise<{
  properties: unknown[];
  total: number;
}> {
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.property.count(),
  ]);

  return { properties, total };
}
