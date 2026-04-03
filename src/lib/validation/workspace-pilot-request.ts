import { z } from "zod";

export const workspacePilotRequestSchema = z.object({
  desiredTier: z.string().trim().min(2).max(100),
  startWindow: z.string().trim().min(2).max(200),
  internalStakeholders: z.string().trim().max(500).optional().default(""),
  message: z.string().trim().min(5).max(1500),
});

export type WorkspacePilotRequestInput = z.infer<typeof workspacePilotRequestSchema>;
