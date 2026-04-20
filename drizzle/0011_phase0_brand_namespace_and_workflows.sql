ALTER TYPE "public"."workspace_role" ADD VALUE IF NOT EXISTS 'brand_owner';--> statement-breakpoint
ALTER TYPE "public"."workspace_role" ADD VALUE IF NOT EXISTS 'brand_marketing_lead';--> statement-breakpoint
ALTER TYPE "public"."workspace_role" ADD VALUE IF NOT EXISTS 'brand_legal_reviewer';--> statement-breakpoint
ALTER TYPE "public"."workspace_role" ADD VALUE IF NOT EXISTS 'brand_media_buyer';--> statement-breakpoint
ALTER TYPE "public"."workspace_role" ADD VALUE IF NOT EXISTS 'ops';--> statement-breakpoint
ALTER TYPE "public"."workspace_role" ADD VALUE IF NOT EXISTS 'ops_admin';--> statement-breakpoint

DO $$
BEGIN
  CREATE TYPE "public"."campaign_workflow_status" AS ENUM(
    'setup',
    'production',
    'review',
    'handover',
    'complete'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint

DO $$
BEGIN
  CREATE TYPE "public"."campaign_workflow_review_status" AS ENUM(
    'not_ready',
    'in_review',
    'approved'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint

DO $$
BEGIN
  CREATE TYPE "public"."campaign_workflow_delivery_status" AS ENUM(
    'not_ready',
    'preparing',
    'ready'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint

DO $$
BEGIN
  CREATE TYPE "public"."campaign_workflow_commercial_status" AS ENUM(
    'not_ready',
    'ready_for_pilot',
    'pilot_requested'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
