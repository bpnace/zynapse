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

export function createdAtColumn() {
  return timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
}
