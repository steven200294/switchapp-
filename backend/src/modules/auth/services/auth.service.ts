import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../../shared/errors/errorCodes.js';
import * as authRepo from '../repositories/auth.repository.js';
import type { RegisterInput, LoginInput } from '../validators/auth.schemas.js';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
}

function signToken(userId: string, email: string): string {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { sub: userId, email, role: 'authenticated' },
    getJwtSecret(),
    { expiresIn } as jwt.SignOptions,
  );
}

export async function register(input: RegisterInput): Promise<{ user: { id: string; email: string; full_name: string }; token: string }> {
  const existing = await authRepo.findAuthUserByEmail(input.email);
  if (existing) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      409,
      CLIENT_MESSAGES[ERROR_CODES.CONFLICT],
      `Email already registered: ${input.email}`,
    );
  }

  const encryptedPassword = await bcrypt.hash(input.password, 10);

  const authUser = await authRepo.createAuthUser({
    email: input.email,
    encryptedPassword,
    fullName: input.full_name,
  });

  await authRepo.createUserProfile(authUser.id, input.email, input.full_name);
  await authRepo.createUserSwitchPass(authUser.id);

  const token = signToken(authUser.id, input.email);

  return {
    user: { id: authUser.id, email: input.email, full_name: input.full_name },
    token,
  };
}

export async function login(input: LoginInput): Promise<{ user: { id: string; email: string }; token: string }> {
  const authUser = await authRepo.findAuthUserByEmail(input.email);
  if (!authUser || !authUser.encrypted_password) {
    throw new AppError(
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      401,
      CLIENT_MESSAGES[ERROR_CODES.AUTH_INVALID_CREDENTIALS],
      `Login failed for email: ${input.email}`,
    );
  }

  const valid = await bcrypt.compare(input.password, authUser.encrypted_password);
  if (!valid) {
    throw new AppError(
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      401,
      CLIENT_MESSAGES[ERROR_CODES.AUTH_INVALID_CREDENTIALS],
      `Invalid password for email: ${input.email}`,
    );
  }

  const token = signToken(authUser.id, authUser.email!);

  return {
    user: { id: authUser.id, email: authUser.email! },
    token,
  };
}

export async function getMe(userId: string): Promise<{ id: string; email: string | null; profile: unknown }> {
  const authUser = await authRepo.findAuthUserById(userId);
  if (!authUser) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      404,
      CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND],
      `User not found: ${userId}`,
    );
  }

  const profile = await authRepo.findUserProfileByUserId(userId);

  return {
    id: authUser.id,
    email: authUser.email,
    profile,
  };
}
