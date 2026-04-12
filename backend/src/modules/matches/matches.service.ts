import * as repo from './matches.repository.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function listMyMatches(userId: string) {
  const matches = await repo.findByUserId(userId);

  const otherUserIds = [...new Set(
    matches.map((m) => (m.user_a === userId ? m.user_b : m.user_a)),
  )];
  const profileMap = await repo.findUserProfilesBatch(otherUserIds);

  return matches.map((m) => {
    const otherUserId = m.user_a === userId ? m.user_b : m.user_a;
    return {
      id: m.id,
      created_at: m.created_at,
      otherUser: profileMap.get(otherUserId) ?? null,
      conversation: m.conversations[0] ?? null,
    };
  });
}

export async function getMatchById(id: string, userId: string) {
  const match = await repo.findById(id);
  if (!match) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  if (match.user_a !== userId && match.user_b !== userId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 403, CLIENT_MESSAGES[ERROR_CODES.FORBIDDEN]);
  }

  const details = await repo.findMatchDetails(match);

  return { match, ...details };
}
