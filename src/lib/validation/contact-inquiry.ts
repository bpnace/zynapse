import { z } from "zod";

export const contactInquirySchema = z.object({
  name: z.string().trim().min(2, "Bitte einen Namen angeben."),
  email: z
    .string()
    .trim()
    .email("Bitte eine gültige E-Mail-Adresse angeben."),
  company: z.string().trim().min(2, "Bitte den Team- oder Firmennamen angeben."),
  teamContext: z.string().trim().min(2, "Bitte kurz den Kontext einordnen."),
  topic: z.string().trim().min(2, "Bitte ein Anliegen auswählen."),
  message: z
    .string()
    .trim()
    .min(20, "Bitte das Anliegen kurz einordnen.")
    .max(2000, "Bitte auf maximal 2000 Zeichen kürzen."),
  datenschutzAccepted: z
    .boolean()
    .refine((value) => value, "Bitte der Datenschutzerklärung zustimmen."),
  startedAt: z.number().int().positive(),
  website: z.string().trim(),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
