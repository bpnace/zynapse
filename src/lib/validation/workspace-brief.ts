import { z } from "zod";

export const workspaceBriefSchema = z.object({
  title: z.string().trim().min(5).max(120),
  objective: z.string().trim().min(10).max(500),
  offer: z.string().trim().min(10).max(500),
  audience: z.string().trim().min(10).max(500),
  channels: z.string().trim().min(5).max(300),
  hooks: z.string().trim().min(5).max(500),
  creativeReferences: z.string().trim().min(5).max(1000),
  budgetRange: z.string().trim().min(2).max(200),
  timeline: z.string().trim().min(2).max(200),
  approvalNotes: z.string().trim().min(5).max(500),
});

export type WorkspaceBriefInput = z.infer<typeof workspaceBriefSchema>;
export type WorkspaceBriefField = keyof WorkspaceBriefInput;
