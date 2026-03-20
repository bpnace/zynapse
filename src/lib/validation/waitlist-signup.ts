import { z } from "zod";

export const waitlistSignupSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Bitte gib eine gültige E-Mail-Adresse an."),
  startedAt: z.number().int().positive(),
  website: z.string().trim(),
});

export type WaitlistSignupInput = z.infer<typeof waitlistSignupSchema>;
