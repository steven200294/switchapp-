import prisma from '../../infra/prisma/client.js';
import * as repo from './swipes.repository.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';
import { swipesTotal, matchesTotal } from '../../infra/metrics/prometheus.js';

interface SwipeResult {
  swipe: Awaited<ReturnType<typeof repo.createSwipe>>;
  matched: boolean;
  match?: Awaited<ReturnType<typeof repo.createMatch>>;
  conversationId?: string;
}

export async function recordSwipe(userId: string, propertyId: string, action: string): Promise<SwipeResult> {
  if (!['like', 'nope', 'super_like'].includes(action)) {
    throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION]);
  }

  const propertyOwnerId = await repo.getPropertyOwnerId(propertyId);
  if (!propertyOwnerId) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  if (propertyOwnerId === userId) {
    throw new AppError(ERROR_CODES.VALIDATION, 400, CLIENT_MESSAGES[ERROR_CODES.VALIDATION], 'Cannot swipe on own property');
  }

  const existing = await repo.findExistingSwipe(userId, propertyId);
  if (existing) {
    throw new AppError(ERROR_CODES.CONFLICT, 409, CLIENT_MESSAGES[ERROR_CODES.CONFLICT], 'Duplicate swipe');
  }

  const dbAction = action === 'super_like' ? 'like' : action;
  const swipe = await repo.createSwipe(userId, propertyId, dbAction);
  swipesTotal.inc({ action });

  if (action === 'nope') {
    return { swipe, matched: false };
  }

  const mutualLike = await repo.findMutualLike(propertyOwnerId, userId);
  if (!mutualLike) {
    return { swipe, matched: false };
  }

  const swiperPropertyId = await repo.getUserFirstPropertyId(userId);
  if (!swiperPropertyId) {
    return { swipe, matched: false };
  }

  const { match, conversationId } = await repo.createMatchWithConversation(
    userId, propertyOwnerId, swiperPropertyId, propertyId,
  );
  matchesTotal.inc();

  return { swipe, matched: true, match, conversationId };
}

export async function undoLastSwipe(userId: string): Promise<{ undone: boolean }> {
  const deleted = await repo.deleteLastSwipeWithCleanup(userId);
  return { undone: !!deleted };
}

export async function getDeck(userId: string, limit: number = 20) {
  const profile = await prisma.userProfile.findUnique({
    where: { user_id: userId },
    select: {
      city: true,
      budget_min: true,
      budget_max: true,
      preferred_property_types: true,
      surface_min: true,
    },
  });

  const preferences: repo.DeckPreferences | undefined = profile ? {
    city: profile.city,
    budget_min: profile.budget_min,
    budget_max: profile.budget_max,
    preferred_property_types: profile.preferred_property_types,
    surface_min: profile.surface_min,
  } : undefined;

  return repo.getDeck(userId, limit, preferences);
}
