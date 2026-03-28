import prisma from '../../infra/prisma/client.js';
import type { Prisma } from '@prisma/client';

export async function findProfileByUserId(userId: string) {
  return prisma.userProfile.findUnique({
    where: { user_id: userId },
    include: { properties: { where: { published: true }, take: 5 } },
  });
}

export async function updateProfile(userId: string, data: Prisma.UserProfileUpdateInput) {
  return prisma.userProfile.update({
    where: { user_id: userId },
    data: { ...data, updated_at: new Date() },
  });
}

export async function findPublicProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      full_name: true,
      avatar_url: true,
      city: true,
      bio: true,
      profession: true,
      verified: true,
      user_type: true,
      created_at: true,
      properties: { where: { published: true }, take: 10 },
    },
  });
}
