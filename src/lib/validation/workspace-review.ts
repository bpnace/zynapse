import { z } from "zod";

export const workspaceCommentSchema = z.object({
  body: z.string().trim().min(3).max(1500),
});

export const workspaceDecisionSchema = z.object({
  note: z.string().trim().max(1500).optional().default(""),
  decision: z.enum(["approved", "changes_requested"]),
});

export type WorkspaceCommentInput = z.infer<typeof workspaceCommentSchema>;
export type WorkspaceDecisionInput = z.infer<typeof workspaceDecisionSchema>;
