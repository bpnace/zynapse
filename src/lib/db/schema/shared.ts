import { pgEnum, timestamp } from "drizzle-orm/pg-core";

export const organizationStatusEnum = pgEnum("organization_status", [
  "invited",
  "active",
  "archived",
]);

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "brand_admin",
  "brand_reviewer",
  "zynapse_ops",
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

export const creativeAvailabilityStatusEnum = pgEnum("creative_availability_status", [
  "available",
  "limited",
  "unavailable",
]);

export const campaignAssignmentStatusEnum = pgEnum("campaign_assignment_status", [
  "invited",
  "active",
  "paused",
  "completed",
  "archived",
]);

export const creativeTaskStatusEnum = pgEnum("creative_task_status", [
  "todo",
  "in_progress",
  "in_review",
  "blocked",
  "completed",
]);

export const workPriorityEnum = pgEnum("work_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const assetVersionSubmissionStatusEnum = pgEnum("asset_version_submission_status", [
  "draft",
  "submitted",
  "changes_requested",
  "approved",
]);

export const revisionSourceRoleEnum = pgEnum("revision_source_role", [
  "brand",
  "creative",
  "ops",
]);

export const revisionItemStatusEnum = pgEnum("revision_item_status", [
  "open",
  "in_progress",
  "resolved",
  "cancelled",
]);

export function createdAtColumn() {
  return timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
}
