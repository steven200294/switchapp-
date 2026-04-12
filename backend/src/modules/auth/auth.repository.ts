import { randomUUID } from 'crypto';
import prisma from '../../infra/prisma/client.js';

export interface CreateAuthUserData {
  email: string;
  encryptedPassword: string;
  fullName: string;
  registrationIp?: string;
}

export async function findAuthUserByEmail(email: string) {
  return prisma.authUser.findFirst({
    where: { email },
  });
}

export async function findAuthUserById(id: string) {
  return prisma.authUser.findUnique({
    where: { id },
  });
}

export async function createAuthUser(data: CreateAuthUserData) {
  const id = randomUUID();
  const now = new Date();

  return prisma.authUser.create({
    data: {
      id,
      email: data.email,
      encrypted_password: data.encryptedPassword,
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: null,
      created_at: now,
      updated_at: now,
      raw_app_meta_data: { provider: 'email', providers: ['email'] },
      raw_user_meta_data: { full_name: data.fullName },
      is_sso_user: false,
      is_anonymous: false,
    },
  });
}

export async function createUserWithProfile(data: CreateAuthUserData) {
  const id = randomUUID();
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const authUser = await tx.authUser.create({
      data: {
        id,
        email: data.email,
        encrypted_password: data.encryptedPassword,
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: null,
        created_at: now,
        updated_at: now,
        raw_app_meta_data: { provider: 'email', providers: ['email'] },
        raw_user_meta_data: { full_name: data.fullName },
        is_sso_user: false,
        is_anonymous: false,
      },
    });

    await tx.userProfile.create({
      data: {
        user_id: authUser.id,
        email: data.email,
        full_name: data.fullName,
        registration_ip: data.registrationIp ?? null,
      },
    });

    await tx.userSwitchPass.create({
      data: { user_id: authUser.id, balance: 0 },
    });

    return authUser;
  });
}

export async function createUserProfile(
  userId: string,
  email: string,
  fullName: string,
) {
  return prisma.userProfile.create({
    data: {
      user_id: userId,
      email,
      full_name: fullName,
    },
  });
}

export async function findUserProfileByUserId(userId: string) {
  return prisma.userProfile.findUnique({
    where: { user_id: userId },
  });
}

export async function createUserSwitchPass(userId: string) {
  return prisma.userSwitchPass.create({
    data: {
      user_id: userId,
      balance: 0,
    },
  });
}
