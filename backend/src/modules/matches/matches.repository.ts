import prisma from '../../infra/prisma/client.js';

export async function findUserProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { user_id: userId },
    select: { user_id: true, full_name: true, avatar_url: true, city: true },
  });
}

export async function findByUserId(userId: string) {
  return prisma.match.findMany({
    where: {
      OR: [{ user_a: userId }, { user_b: userId }],
    },
    include: {
      conversations: {
        select: { id: true, last_message_at: true, last_message_text: true },
        take: 1,
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function findById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      conversations: {
        select: { id: true, last_message_at: true },
        take: 1,
      },
    },
  });
}

export async function findMatchDetails(match: {
  user_a: string;
  user_b: string;
  property_a: string | null;
  property_b: string | null;
}) {
  const profileSelect = { full_name: true, avatar_url: true, city: true, user_id: true } as const;
  const [userAProfile, userBProfile, propertyA, propertyB] = await Promise.all([
    prisma.userProfile.findUnique({ where: { user_id: match.user_a }, select: profileSelect }),
    prisma.userProfile.findUnique({ where: { user_id: match.user_b }, select: profileSelect }),
    match.property_a ? prisma.property.findUnique({ where: { id: match.property_a } }) : null,
    match.property_b ? prisma.property.findUnique({ where: { id: match.property_b } }) : null,
  ]);
  return { userAProfile, userBProfile, propertyA, propertyB };
}
