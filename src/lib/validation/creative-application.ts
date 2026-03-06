import { z } from "zod";

export const creativeApplicationSchema = z.object({
  name: z.string().trim().min(2, "Bitte einen Namen angeben."),
  email: z
    .string()
    .trim()
    .email("Bitte eine gültige E-Mail-Adresse angeben."),
  portfolioUrl: z.string().trim().url("Bitte einen gültigen Portfolio-Link angeben."),
  focusChannels: z
    .array(z.string().trim().min(2))
    .min(1, "Bitte mindestens einen Fokuskanal wählen."),
  caseSummary: z.string().trim().min(30, "Bitte kurz relevante Erfahrung beschreiben."),
  availability: z.string().trim().min(2, "Bitte Verfügbarkeit angeben."),
  compensationNotes: z.string().trim().max(1200, "Bitte auf maximal 1200 Zeichen kürzen."),
  location: z.string().trim().min(2, "Bitte Standort oder Zeitzone angeben."),
  startedAt: z.number().int().positive(),
  website: z.string().trim(),
});

export type CreativeApplicationInput = z.infer<typeof creativeApplicationSchema>;
