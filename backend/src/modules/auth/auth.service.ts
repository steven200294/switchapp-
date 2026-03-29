import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';
import { activeUsers } from '../../infra/metrics/prometheus.js';
import * as authRepo from './auth.repository.js';
import { isAdminUser } from '../admin/admin.repository.js';
import type { RegisterInput, LoginInput } from './auth.schemas.js';

function signToken(userId: string, email: string): string {
  return jwt.sign(
    { sub: userId, email, role: 'authenticated' },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn } as jwt.SignOptions,
  );
}

export async function register(input: RegisterInput) {
  const existing = await authRepo.findAuthUserByEmail(input.email);
  if (existing) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      409,
      CLIENT_MESSAGES[ERROR_CODES.CONFLICT],
      `Email already registered: ${input.email}`,
    );
  }

  const encryptedPassword = await bcrypt.hash(input.password, env.bcrypt.rounds);

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

export async function login(input: LoginInput) {
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

  const [profile, admin] = await Promise.all([
    authRepo.findUserProfileByUserId(authUser.id),
    isAdminUser(authUser.id),
  ]);
  const token = signToken(authUser.id, authUser.email!);
  activeUsers.inc();

  return {
    user: {
      id: authUser.id,
      email: authUser.email!,
      full_name: profile?.full_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      city: profile?.city ?? null,
      verified: profile?.verified ?? false,
      role: admin ? 'admin' : 'user',
    },
    token,
  };
}

export async function getMe(userId: string) {
  const authUser = await authRepo.findAuthUserById(userId);
  if (!authUser) {
    throw new AppError(
      ERROR_CODES.NOT_FOUND,
      404,
      CLIENT_MESSAGES[ERROR_CODES.NOT_FOUND],
      `User not found: ${userId}`,
    );
  }

  const [profile, admin] = await Promise.all([
    authRepo.findUserProfileByUserId(userId),
    isAdminUser(userId),
  ]);

  return {
    id: authUser.id,
    email: authUser.email ?? profile?.email ?? null,
    full_name: profile?.full_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
    city: profile?.city ?? null,
    verified: profile?.verified ?? false,
    role: admin ? 'admin' : 'user',
    created_at: profile?.created_at?.toISOString() ?? null,
  };
}
