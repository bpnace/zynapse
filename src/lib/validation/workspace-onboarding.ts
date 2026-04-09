import { z } from "zod";

export const workspaceOnboardingSchema = z.object({
  website: z.string().trim().max(200),
  offerSummary: z.string().trim().min(10).max(500),
  targetAudience: z.string().trim().min(10).max(500),
  primaryChannels: z.string().trim().min(5).max(300),
  brandTone: z.string().trim().min(5).max(300),
  reviewNotes: z.string().trim().min(5).max(500),
  claimGuardrails: z.string().trim().min(5).max(500),
});

export type WorkspaceOnboardingInput = z.infer<typeof workspaceOnboardingSchema>;
export type WorkspaceOnboardingField = keyof WorkspaceOnboardingInput;
