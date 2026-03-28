import * as repo from './matches.repository.js';
import prisma from '../../infra/prisma/client.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function listMyMatches(userId: string) {
  return repo.findByUserId(userId);
}

export async function getMatchById(id: string, userId: string) {
  const match = await repo.findById(id);
  if (!match) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  if (match.user_a !== userId && match.user_b !== userId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 403, CLIENT_MESSAGES[ERROR_CODES.FORBIDDEN]);
  }

  const profileSelect = { full_name: true, avatar_url: true, city: true, user_id: true } as const;

  const [userAProfile, userBProfile, propertyA, propertyB] = await Promise.all([
    prisma.userProfile.findUnique({ where: { user_id: match.user_a }, select: profileSelect }),
    prisma.userProfile.findUnique({ where: { user_id: match.user_b }, select: profileSelect }),
    prisma.property.findUnique({ where: { id: match.property_a } }),
    prisma.property.findUnique({ where: { id: match.property_b } }),
  ]);

  return { match, userAProfile, userBProfile, propertyA, propertyB };
}
