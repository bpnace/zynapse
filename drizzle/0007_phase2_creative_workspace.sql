ALTER TYPE "public"."workspace_role" ADD VALUE IF NOT EXISTS 'creative';--> statement-breakpoint
ALTER TYPE "public"."workspace_role" ADD VALUE IF NOT EXISTS 'creative_lead';--> statement-breakpoint
CREATE TYPE "public"."workspace_type" AS ENUM('brand', 'creative', 'ops');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('invited', 'active', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "public"."assignment_role" AS ENUM('creative', 'creative_lead', 'editor', 'motion', 'designer', 'copy');--> statement-breakpoint
CREATE TYPE "public"."assignment_status" AS ENUM('assigned', 'accepted', 'in_progress', 'blocked', 'submitted', 'completed');--> statement-breakpoint
CREATE TYPE "public"."creative_task_type" AS ENUM('concept', 'production', 'revision', 'delivery');--> statement-breakpoint
CREATE TYPE "public"."creative_task_status" AS ENUM('todo', 'in_progress', 'blocked', 'submitted', 'completed');--> statement-breakpoint
CREATE TYPE "public"."creative_task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."asset_version_status" AS ENUM('draft', 'submitted_for_ops_review', 'submitted_for_brand_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."revision_item_status" AS ENUM('open', 'submitted', 'resolved');--> statement-breakpoint

ALTER TABLE "memberships"
  ADD COLUMN "workspace_type" "workspace_type" DEFAULT 'brand' NOT NULL,
  ADD COLUMN "membership_status" "membership_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint

UPDATE "memberships"
SET "workspace_type" = CASE
  WHEN "role" = 'zynapse_ops' THEN 'ops'::workspace_type
  ELSE 'brand'::workspace_type
END;--> statement-breakpoint

DROP INDEX IF EXISTS "memberships_user_unique";--> statement-breakpoint

CREATE TABLE "creative_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "slug" text NOT NULL,
  "display_name" text NOT NULL,
  "headline" text,
  "bio" text,
  "specialties" text,
  "portfolio_url" text,
  "availability_status" text DEFAULT 'available' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX "creative_profiles_user_unique" ON "creative_profiles" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "creative_profiles_slug_unique" ON "creative_profiles" ("slug");--> statement-breakpoint

CREATE TABLE "campaign_assignments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" uuid NOT NULL REFERENCES "campaigns"("id") ON DELETE cascade ON UPDATE no action,
  "user_id" uuid NOT NULL,
  "assignment_role" "assignment_role" DEFAULT 'creative' NOT NULL,
  "status" "assignment_status" DEFAULT 'assigned' NOT NULL,
  "assigned_by" uuid,
  "scope_summary" text,
  "due_at" timestamp with time zone,
  "accepted_at" timestamp with time zone,
  "submitted_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "campaign_assignments_campaign_idx" ON "campaign_assignments" ("campaign_id");--> statement-breakpoint
CREATE INDEX "campaign_assignments_user_idx" ON "campaign_assignments" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "campaign_assignments_campaign_user_unique" ON "campaign_assignments" ("campaign_id","user_id");--> statement-breakpoint

CREATE TABLE "creative_tasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" uuid NOT NULL REFERENCES "campaigns"("id") ON DELETE cascade ON UPDATE no action,
  "assignment_id" uuid REFERENCES "campaign_assignments"("id") ON DELETE set null ON UPDATE no action,
  "asset_id" uuid REFERENCES "assets"("id") ON DELETE set null ON UPDATE no action,
  "owner_user_id" uuid NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "task_type" "creative_task_type" DEFAULT 'production' NOT NULL,
  "status" "creative_task_status" DEFAULT 'todo' NOT NULL,
  "priority" "creative_task_priority" DEFAULT 'medium' NOT NULL,
  "blocked_reason" text,
  "due_at" timestamp with time zone,
  "submitted_at" timestamp with time zone,
  "completed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "creative_tasks_campaign_idx" ON "creative_tasks" ("campaign_id");--> statement-breakpoint
CREATE INDEX "creative_tasks_assignment_idx" ON "creative_tasks" ("assignment_id");--> statement-breakpoint
CREATE INDEX "creative_tasks_owner_idx" ON "creative_tasks" ("owner_user_id");--> statement-breakpoint

CREATE TABLE "asset_versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "asset_id" uuid NOT NULL REFERENCES "assets"("id") ON DELETE cascade ON UPDATE no action,
  "campaign_id" uuid NOT NULL REFERENCES "campaigns"("id") ON DELETE cascade ON UPDATE no action,
  "assignment_id" uuid REFERENCES "campaign_assignments"("id") ON DELETE set null ON UPDATE no action,
  "created_by" uuid NOT NULL,
  "version_label" text NOT NULL,
  "storage_path" text NOT NULL,
  "thumbnail_path" text,
  "notes" text,
  "submission_status" "asset_version_status" DEFAULT 'submitted_for_ops_review' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "asset_versions_asset_idx" ON "asset_versions" ("asset_id");--> statement-breakpoint
CREATE INDEX "asset_versions_campaign_idx" ON "asset_versions" ("campaign_id");--> statement-breakpoint

CREATE TABLE "revision_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" uuid NOT NULL REFERENCES "campaigns"("id") ON DELETE cascade ON UPDATE no action,
  "assignment_id" uuid REFERENCES "campaign_assignments"("id") ON DELETE set null ON UPDATE no action,
  "asset_id" uuid REFERENCES "assets"("id") ON DELETE set null ON UPDATE no action,
  "review_thread_id" uuid REFERENCES "review_threads"("id") ON DELETE set null ON UPDATE no action,
  "source_comment_id" uuid REFERENCES "comments"("id") ON DELETE set null ON UPDATE no action,
  "created_by" text,
  "title" text NOT NULL,
  "detail" text NOT NULL,
  "status" "revision_item_status" DEFAULT 'open' NOT NULL,
  "priority" "creative_task_priority" DEFAULT 'medium' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "resolved_at" timestamp with time zone
);--> statement-breakpoint
CREATE INDEX "revision_items_campaign_idx" ON "revision_items" ("campaign_id");--> statement-breakpoint
CREATE INDEX "revision_items_assignment_idx" ON "revision_items" ("assignment_id");--> statement-breakpoint
CREATE INDEX "revision_items_status_idx" ON "revision_items" ("status");--> statement-breakpoint
