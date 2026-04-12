import { z } from 'zod';

export const sendEmailSchema = z.object({
  email: z.string().email(),
});

export const sendPhoneOtpSchema = z.object({
  phone: z.string().min(5).max(20),
  country_code: z.string().min(1).max(5),
});

export const verifyPhoneOtpSchema = z.object({
  phone: z.string().min(5).max(20),
  code: z.string().length(4),
});
