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

export async function deleteLastSwipeWithCleanup(userId: string) {
  return prisma.$transaction(async (tx) => {
    const last = await tx.swipe.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    if (!last) return null;

    if (last.action === 'like') {
      const match = await tx.match.findFirst({
        where: {
          OR: [
            { user_a: userId, property_b: last.property_id },
            { user_b: userId, property_a: last.property_id },
          ],
        },
        orderBy: { created_at: 'desc' },
      });

      if (match) {
        const conversations = await tx.conversation.findMany({
          where: { match_id: match.id },
          select: { id: true },
        });
        const convIds = conversations.map((c) => c.id);
        if (convIds.length > 0) {
          await tx.message.deleteMany({ where: { conversation_id: { in: convIds } } });
          await tx.conversationParticipant.deleteMany({ where: { conversation_id: { in: convIds } } });
          await tx.conversation.deleteMany({ where: { id: { in: convIds } } });
        }
        await tx.match.delete({ where: { id: match.id } });
      }
    }

    return tx.swipe.delete({ where: { id: last.id } });
  });
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

export interface DeckPreferences {
  city?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferred_property_types?: string[];
  surface_min?: number | null;
}

const MIN_FILTERED_RESULTS = 5;

export async function getDeck(userId: string, limit: number, preferences?: DeckPreferences) {
  const swipedIds = await getSwipedPropertyIds(userId);

  const baseWhere = {
    published: true,
    status: 'published' as const,
    owner_id: { not: userId },
    ...(swipedIds.length > 0 ? { id: { notIn: swipedIds } } : {}),
  };

  const prefWhere = buildPreferenceFilters(preferences);
  const filteredWhere = { ...baseWhere, ...prefWhere };

  const ownerSelect = {
    select: { full_name: true, avatar_url: true, verified: true, user_id: true, city: true } as const,
  };

  const filtered = await prisma.property.findMany({
    where: filteredWhere,
    include: { owner: ownerSelect },
    orderBy: { created_at: 'desc' },
    take: limit,
  });

  if (filtered.length >= MIN_FILTERED_RESULTS || !preferences) {
    return filtered;
  }

  return prisma.property.findMany({
    where: baseWhere,
    include: { owner: ownerSelect },
    orderBy: { created_at: 'desc' },
    take: limit,
  });
}

function buildPreferenceFilters(prefs?: DeckPreferences): Record<string, unknown> {
  if (!prefs) return {};
  const where: Record<string, unknown> = {};

  if (prefs.city) {
    where.city = { equals: prefs.city, mode: 'insensitive' };
  }
  if (prefs.budget_min != null || prefs.budget_max != null) {
    const rentFilter: Record<string, number> = {};
    if (prefs.budget_min != null) rentFilter.gte = prefs.budget_min;
    if (prefs.budget_max != null) rentFilter.lte = prefs.budget_max;
    where.monthly_rent = rentFilter;
  }
  if (prefs.preferred_property_types && prefs.preferred_property_types.length > 0) {
    where.property_type = { in: prefs.preferred_property_types };
  }
  if (prefs.surface_min != null) {
    where.surface_area = { gte: prefs.surface_min };
  }
  return where;
}

export async function getPropertyOwnerId(propertyId: string): Promise<string | null> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId, published: true, status: 'published' },
    select: { owner_id: true },
  });
  return property?.owner_id ?? null;
}

export async function getUserFirstPropertyId(userId: string): Promise<string | null> {
  const property = await prisma.property.findFirst({
    where: { owner_id: userId, published: true, status: 'published' },
    select: { id: true },
  });
  return property?.id ?? null;
}

export async function createMatch(userA: string, userB: string, propertyA: string, propertyB: string) {
  return prisma.match.create({
    data: { user_a: userA, user_b: userB, property_a: propertyA, property_b: propertyB },
  });
}

export async function createMatchWithConversation(
  userA: string, userB: string, propertyA: string, propertyB: string,
) {
  return prisma.$transaction(async (tx) => {
    const match = await tx.match.create({
      data: { user_a: userA, user_b: userB, property_a: propertyA, property_b: propertyB },
    });

    const conversation = await tx.conversation.create({
      data: { match_id: match.id },
    });

    await tx.conversationParticipant.createMany({
      data: [
        { conversation_id: conversation.id, user_id: userA },
        { conversation_id: conversation.id, user_id: userB },
      ],
    });

    return { match, conversationId: conversation.id };
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
