import { z } from "zod";

export const brandInquirySchema = z.object({
  industry: z.string().trim().min(2, "Bitte eine Branche angeben."),
  productUrl: z.string().trim().url("Bitte einen gültigen Produktlink angeben."),
  goal: z.string().trim().min(3, "Bitte ein Ziel angeben."),
  channel: z.string().trim().min(2, "Bitte mindestens einen Kanal angeben."),
  budgetRange: z.string().trim().min(2, "Bitte eine Budget Range angeben."),
  timeline: z.string().trim().min(2, "Bitte eine Timeline angeben."),
  notes: z.string().trim().max(1500, "Bitte auf maximal 1500 Zeichen kürzen."),
  contactName: z.string().trim().min(2, "Bitte einen Namen angeben."),
  workEmail: z
    .string()
    .trim()
    .email("Bitte eine gültige E-Mail-Adresse angeben."),
  company: z.string().trim().min(2, "Bitte den Firmennamen angeben."),
  startedAt: z.number().int().positive(),
  website: z.string().trim(),
});

export type BrandInquiryInput = z.infer<typeof brandInquirySchema>;
