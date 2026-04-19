import { z } from "zod";

export const creativeSubmissionSchema = z.object({
  campaignId: z.string().uuid(),
  assetId: z.string().uuid(),
  assignmentId: z.string().uuid(),
  taskId: z.string().uuid().optional(),
  versionLabel: z.string().trim().min(2).max(80),
  storagePath: z.string().trim().min(3).max(500),
  thumbnailPath: z.string().trim().max(500).optional().or(z.literal("")),
  notes: z.string().trim().max(1500).optional().or(z.literal("")),
});

export type CreativeSubmissionInput = z.infer<typeof creativeSubmissionSchema>;
