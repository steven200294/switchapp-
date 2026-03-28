import * as repo from './swipes.repository.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

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
    throw new AppError(ERROR_CODES.VALIDATION, 400, 'Cannot swipe on your own property');
  }

  const existing = await repo.findExistingSwipe(userId, propertyId);
  if (existing) {
    throw new AppError(ERROR_CODES.CONFLICT, 409, 'Already swiped on this property');
  }

  const dbAction = action === 'super_like' ? 'like' : action;
  const swipe = await repo.createSwipe(userId, propertyId, dbAction);

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

  const match = await repo.createMatch(userId, propertyOwnerId, swiperPropertyId, propertyId);
  const conversationId = await repo.createConversationForMatch(match.id, userId, propertyOwnerId);

  return { swipe, matched: true, match, conversationId };
}

export async function undoLastSwipe(userId: string): Promise<{ undone: boolean }> {
  const deleted = await repo.deleteLastSwipe(userId);
  return { undone: !!deleted };
}

export async function getDeck(userId: string, limit: number = 20) {
  return repo.getDeck(userId, limit);
}
