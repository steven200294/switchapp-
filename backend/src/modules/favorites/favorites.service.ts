import * as repo from './favorites.repository.js';
import prisma from '../../infra/prisma/client.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

export async function listMyFavorites(userId: string) {
  return repo.findByUserId(userId);
}

export async function addFavorite(userId: string, propertyId: string) {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }

  const existing = await repo.findExisting(userId, propertyId);
  if (existing) {
    throw new AppError(ERROR_CODES.CONFLICT, 409, 'Already in favorites');
  }

  return repo.create(userId, propertyId);
}

export async function removeFavorite(userId: string, propertyId: string) {
  const removed = await repo.remove(userId, propertyId);
  if (!removed) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  return removed;
}
