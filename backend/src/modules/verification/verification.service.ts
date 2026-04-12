import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import prisma from '../../infra/prisma/client.js';
import { AppError } from '../../shared/errors/AppError.js';
import { ERROR_CODES, CLIENT_MESSAGES } from '../../shared/errors/errorCodes.js';

const EMAIL_TOKEN_EXPIRY = '24h';

interface EmailVerifyPayload {
  sub: string;
  email: string;
  type: 'email_verify';
}

export async function sendVerificationEmail(userId: string, email: string): Promise<void> {
  const token = jwt.sign(
    { sub: userId, email, type: 'email_verify' } satisfies EmailVerifyPayload,
    env.emailVerify.secret,
    { expiresIn: EMAIL_TOKEN_EXPIRY } as jwt.SignOptions,
  );

  const verifyUrl = `${env.frontendUrl}/verify-email?token=${token}`;

  if (env.isDev) {
    logger.info(`[DEV] Email verification link for ${email}: ${verifyUrl}`);
  } else {
    // TODO: Send via Resend / SMTP when configured
    logger.info(`Verification email would be sent to ${email}`);
  }
}

export async function confirmEmail(token: string): Promise<{ email: string }> {
  let payload: EmailVerifyPayload;
  try {
    payload = jwt.verify(token, env.emailVerify.secret) as EmailVerifyPayload;
  } catch {
    throw new AppError(
      ERROR_CODES.AUTH_INVALID_TOKEN,
      400,
      CLIENT_MESSAGES[ERROR_CODES.AUTH_INVALID_TOKEN],
    );
  }

  if (payload.type !== 'email_verify') {
    throw new AppError(
      ERROR_CODES.AUTH_INVALID_TOKEN,
      400,
      CLIENT_MESSAGES[ERROR_CODES.AUTH_INVALID_TOKEN],
    );
  }

  await prisma.authUser.update({
    where: { id: payload.sub },
    data: { email_confirmed_at: new Date() },
  });

  return { email: payload.email };
}

export async function sendPhoneOtp(userId: string, phone: string, countryCode: string): Promise<void> {
  await prisma.userProfile.update({
    where: { user_id: userId },
    data: { phone_number: phone, phone_country_code: countryCode },
  });

  // Stubbed — always logs "0000"
  logger.info(`[STUB] Phone OTP for user ${userId} (${countryCode}${phone}): 0000`);
}

export async function verifyPhoneOtp(userId: string, phone: string, code: string): Promise<void> {
  // Stubbed — accept "0000" as valid OTP
  if (code !== '0000') {
    throw new AppError(
      ERROR_CODES.AUTH_INVALID_OTP,
      422,
      CLIENT_MESSAGES[ERROR_CODES.AUTH_INVALID_OTP],
    );
  }

  const profile = await prisma.userProfile.findUnique({ where: { user_id: userId } });
  if (!profile || profile.phone_number !== phone) {
    throw new AppError(
      ERROR_CODES.VALIDATION,
      400,
      CLIENT_MESSAGES[ERROR_CODES.VALIDATION],
    );
  }

  await prisma.userProfile.update({
    where: { user_id: userId },
    data: { phone_verified_at: new Date() },
  });
}
