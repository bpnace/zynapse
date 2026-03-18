import { z } from "zod";

export const contactInquirySchema = z.object({
  name: z.string().trim().min(2, "Gib bitte deinen Namen an."),
  email: z
    .string()
    .trim()
    .email("Gib bitte eine gültige E-Mail-Adresse an."),
  company: z.string().trim().min(2, "Gib bitte deinen Team- oder Firmennamen an."),
  teamContext: z.string().trim().min(2, "Ordne bitte kurz ein, worum es geht."),
  topic: z.string().trim().min(2, "Wähle bitte ein Anliegen aus."),
  message: z
    .string()
    .trim()
    .min(20, "Schreib bitte kurz, worum es geht.")
    .max(2000, "Kürze deine Nachricht bitte auf maximal 2000 Zeichen."),
  datenschutzAccepted: z
    .boolean()
    .refine((value) => value, "Bitte bestätige die Datenschutzerklärung."),
  startedAt: z.number().int().positive(),
  website: z.string().trim(),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
