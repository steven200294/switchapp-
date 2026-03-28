import prisma from '../../infra/prisma/client.js';

export async function createSwipe(userId: string, propertyId: string, action: string) {
  return prisma.swipe.create({
    data: { user_id: userId, property_id: propertyId, action },
  });
}

export async function findExistingSwipe(userId: string, propertyId: string) {
  return prisma.swipe.findFirst({
    where: { user_id: userId, property_id: propertyId },
  });
}

export async function deleteLastSwipe(userId: string) {
  const last = await prisma.swipe.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });
  if (!last) return null;
  return prisma.swipe.delete({ where: { id: last.id } });
}

export async function findMutualLike(propertyOwnerId: string, swiperId: string) {
  const swiperProperties = await prisma.property.findMany({
    where: { owner_id: swiperId, published: true },
    select: { id: true },
  });
  if (swiperProperties.length === 0) return null;

  return prisma.swipe.findFirst({
    where: {
      user_id: propertyOwnerId,
      property_id: { in: swiperProperties.map(p => p.id) },
      action: 'like',
    },
  });
}

export async function getSwipedPropertyIds(userId: string): Promise<string[]> {
  const swipes = await prisma.swipe.findMany({
    where: { user_id: userId },
    select: { property_id: true },
  });
  return swipes.map(s => s.property_id);
}

export async function getDeck(userId: string, limit: number) {
  const swipedIds = await getSwipedPropertyIds(userId);

  return prisma.property.findMany({
    where: {
      published: true,
      status: 'published',
      owner_id: { not: userId },
      ...(swipedIds.length > 0 ? { id: { notIn: swipedIds } } : {}),
    },
    include: {
      owner: { select: { full_name: true, avatar_url: true, verified: true, user_id: true, city: true } },
    },
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

export async function getPropertyOwnerId(propertyId: string): Promise<string | null> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { owner_id: true },
  });
  return property?.owner_id ?? null;
}

export async function getUserFirstPropertyId(userId: string): Promise<string | null> {
  const property = await prisma.property.findFirst({
    where: { owner_id: userId, published: true },
    select: { id: true },
  });
  return property?.id ?? null;
}

export async function createMatch(userA: string, userB: string, propertyA: string, propertyB: string) {
  return prisma.match.create({
    data: { user_a: userA, user_b: userB, property_a: propertyA, property_b: propertyB },
  });
}

export async function createConversationForMatch(matchId: string, userA: string, userB: string): Promise<string> {
  const conversation = await prisma.conversation.create({
    data: { match_id: matchId },
  });

  await prisma.conversationParticipant.createMany({
    data: [
      { conversation_id: conversation.id, user_id: userA },
      { conversation_id: conversation.id, user_id: userB },
    ],
  });

  return conversation.id;
}
