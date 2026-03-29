import { z } from "zod";

export const compatibilityAiResultSchema = z.object({
  score: z.number().min(0).max(100),
  commonPoints: z.array(z.string()).max(12),
  weakPoints: z.array(z.string()).max(12),
  recommendation: z.string().max(2000),
});

export type CompatibilityResult = z.infer<typeof compatibilityAiResultSchema>;
