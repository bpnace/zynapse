import { z } from "zod";

const assignmentRoles = [
  "creative",
  "creative_lead",
  "editor",
  "motion",
  "designer",
  "copy",
] as const;

const workflowStatuses = ["setup", "production", "review", "handover", "complete"] as const;
const reviewStatuses = ["not_ready", "in_review", "approved"] as const;
const deliveryStatuses = ["not_ready", "preparing", "ready"] as const;
const commercialStatuses = ["not_ready", "ready_for_pilot", "pilot_requested"] as const;

export const opsAssignmentSchema = z.object({
  campaignId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  assignmentRole: z.enum(assignmentRoles),
  scopeSummary: z.string().trim().min(12).max(1500),
  dueAt: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : "")),
});

export const opsWorkflowUpdateSchema = z.object({
  campaignId: z.string().trim().min(1),
  workflowStatus: z.enum(workflowStatuses),
  reviewStatus: z.enum(reviewStatuses),
  deliveryStatus: z.enum(deliveryStatuses),
  commercialStatus: z.enum(commercialStatuses),
  blockedReason: z
    .string()
    .trim()
    .max(600)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : "")),
});

export type OpsAssignmentInput = z.infer<typeof opsAssignmentSchema>;
export type OpsWorkflowUpdateInput = z.infer<typeof opsWorkflowUpdateSchema>;
