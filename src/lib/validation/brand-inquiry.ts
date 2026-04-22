import { z } from "zod";

export const brandInquirySchema = z.object({
  industry: z.string().trim().min(2, "Bitte eine Branche angeben."),
  productUrl: z.string().trim().url("Bitte einen gültigen Produktlink angeben."),
  goal: z.string().trim().min(3, "Bitte ein Ziel angeben."),
  targetAudience: z
    .string()
    .trim()
    .max(300, "Bitte auf maximal 300 Zeichen kürzen.")
    .optional(),
  keyBarrier: z
    .string()
    .trim()
    .max(300, "Bitte auf maximal 300 Zeichen kürzen.")
    .optional(),
  channels: z
    .array(z.string().trim().min(2))
    .min(1, "Bitte mindestens einen Kanal angeben."),
  budgetRange: z.string().trim().min(2, "Bitte eine Budget Range angeben."),
  styleDirection: z
    .string()
    .trim()
    .max(500, "Bitte auf maximal 500 Zeichen kürzen.")
    .optional(),
  timeline: z.string().trim().min(2, "Bitte eine Timeline angeben."),
  reviewContext: z
    .string()
    .trim()
    .max(500, "Bitte auf maximal 500 Zeichen kürzen.")
    .optional(),
  notes: z.string().trim().max(1500, "Bitte auf maximal 1500 Zeichen kürzen."),
  contactName: z.string().trim().min(2, "Bitte einen Namen angeben."),
  workEmail: z
    .string()
    .trim()
    .email("Bitte eine gültige E-Mail-Adresse angeben."),
  company: z.string().trim().min(2, "Bitte den Firmennamen angeben."),
  datenschutzAccepted: z
    .boolean()
    .refine((value) => value, "Bitte bestätige die Datenschutzerklärung."),
  startedAt: z.number().int().positive(),
  website: z.string().trim(),
});

export type BrandInquiryInput = z.infer<typeof brandInquirySchema>;
