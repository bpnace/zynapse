import { z } from "zod";

export const brandInquirySchema = z.object({
  industry: z
    .string()
    .trim()
    .max(120, "Bitte auf maximal 120 Zeichen kürzen.")
    .default(""),
  productUrl: z
    .string()
    .trim()
    .min(2, "Bitte Produkt, Website oder Link angeben.")
    .max(300, "Bitte auf maximal 300 Zeichen kürzen."),
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
    .default([]),
  budgetRange: z
    .string()
    .trim()
    .max(120, "Bitte auf maximal 120 Zeichen kürzen.")
    .default(""),
  styleDirection: z
    .string()
    .trim()
    .max(500, "Bitte auf maximal 500 Zeichen kürzen.")
    .optional(),
  timeline: z
    .string()
    .trim()
    .max(120, "Bitte auf maximal 120 Zeichen kürzen.")
    .default(""),
  reviewContext: z
    .string()
    .trim()
    .max(500, "Bitte auf maximal 500 Zeichen kürzen.")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1500, "Bitte auf maximal 1500 Zeichen kürzen.")
    .default(""),
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
  website: z.string().trim().default(""),
});

export type BrandInquiryInput = z.output<typeof brandInquirySchema>;
export type BrandInquiryFormInput = z.input<typeof brandInquirySchema>;
