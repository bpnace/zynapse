import { pgEnum, timestamp } from "drizzle-orm/pg-core";

export const organizationStatusEnum = pgEnum("organization_status", [
  "invited",
  "active",
  "archived",
]);

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "brand_admin",
  "brand_owner",
  "brand_marketing_lead",
  "brand_reviewer",
  "brand_legal_reviewer",
  "brand_media_buyer",
  "creative",
  "creative_lead",
  "zynapse_ops",
  "ops",
  "ops_admin",
]);

export const workspaceTypeEnum = pgEnum("workspace_type", [
  "brand",
  "creative",
  "ops",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "invited",
  "active",
  "paused",
  "archived",
]);

export const stageKeyEnum = pgEnum("campaign_stage_key", [
  "brief_received",
  "setup_planned",
  "production_ready",
  "in_review",
  "approved",
  "handover_ready",
]);

export const stageStatusEnum = pgEnum("campaign_stage_status", [
  "pending",
  "in_progress",
  "completed",
]);

export const assetScopeEnum = pgEnum("asset_scope", ["input", "output"]);

export const assetReviewStatusEnum = pgEnum("asset_review_status", [
  "pending",
  "approved",
  "changes_requested",
  "rejected",
]);

export const briefStatusEnum = pgEnum("brief_status", ["draft", "submitted"]);

export const pilotRequestStatusEnum = pgEnum("pilot_request_status", [
  "submitted",
  "failed",
]);

export const pilotRequestHandoffModeEnum = pgEnum("pilot_request_handoff_mode", [
  "webhook",
  "log",
]);

export const campaignWorkflowStatusEnum = pgEnum("campaign_workflow_status", [
  "setup",
  "production",
  "review",
  "handover",
  "complete",
]);

export const campaignWorkflowReviewStatusEnum = pgEnum("campaign_workflow_review_status", [
  "not_ready",
  "in_review",
  "approved",
]);

export const campaignWorkflowDeliveryStatusEnum = pgEnum("campaign_workflow_delivery_status", [
  "not_ready",
  "preparing",
  "ready",
]);

export const campaignWorkflowCommercialStatusEnum = pgEnum("campaign_workflow_commercial_status", [
  "not_ready",
  "ready_for_pilot",
  "pilot_requested",
]);

export const assignmentRoleEnum = pgEnum("assignment_role", [
  "creative",
  "creative_lead",
  "editor",
  "motion",
  "designer",
  "copy",
]);

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "assigned",
  "accepted",
  "in_progress",
  "blocked",
  "submitted",
  "completed",
]);

export const creativeTaskTypeEnum = pgEnum("creative_task_type", [
  "concept",
  "production",
  "revision",
  "delivery",
]);

export const creativeTaskStatusEnum = pgEnum("creative_task_status", [
  "todo",
  "in_progress",
  "blocked",
  "submitted",
  "completed",
]);

export const creativeTaskPriorityEnum = pgEnum("creative_task_priority", [
  "low",
  "medium",
  "high",
]);

export const assetVersionStatusEnum = pgEnum("asset_version_status", [
  "draft",
  "submitted_for_ops_review",
  "submitted_for_brand_review",
  "approved",
  "rejected",
]);

export const revisionItemStatusEnum = pgEnum("revision_item_status", [
  "open",
  "submitted",
  "resolved",
]);

export function createdAtColumn() {
  return timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
}
