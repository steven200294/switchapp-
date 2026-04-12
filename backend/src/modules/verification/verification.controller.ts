import type { Request, Response, NextFunction } from 'express';
import * as verificationService from './verification.service.js';

export async function sendEmailVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await verificationService.sendVerificationEmail(req.userId!, req.body.email);
    res.json({ data: { sent: true } });
  } catch (err) { next(err); }
}

export async function confirmEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verificationService.confirmEmail(req.query.token as string);
    res.json({ data: result });
  } catch (err) { next(err); }
}

export async function sendPhoneOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone, country_code } = req.body;
    await verificationService.sendPhoneOtp(req.userId!, phone, country_code);
    res.json({ data: { sent: true } });
  } catch (err) { next(err); }
}

export async function verifyPhoneOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone, code } = req.body;
    await verificationService.verifyPhoneOtp(req.userId!, phone, code);
    res.json({ data: { verified: true } });
  } catch (err) { next(err); }
}
