import * as repo from './users.repository.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

const ALLOWED_FIELDS = [
  'full_name', 'first_name', 'last_name', 'avatar_url', 'city', 'phone',
  'bio', 'profession', 'date_of_birth', 'user_type',
  'budget_min', 'budget_max', 'preferred_property_types', 'preferred_amenities',
  'surface_min', 'preferred_district', 'preferred_neighborhood',
];

export async function getMyProfile(userId: string) {
  const profile = await repo.findProfileByUserId(userId);
  if (!profile) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  return profile;
}

export async function updateMyProfile(userId: string, data: Record<string, unknown>) {
  const sanitized: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (data[key] !== undefined) sanitized[key] = data[key];
  }
  if (sanitized.date_of_birth && typeof sanitized.date_of_birth === 'string') {
    sanitized.date_of_birth = new Date(sanitized.date_of_birth);
  }
  return repo.updateProfile(userId, sanitized);
}

export async function getPublicProfile(userId: string) {
  const profile = await repo.findPublicProfile(userId);
  if (!profile) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND]);
  }
  return profile;
}
