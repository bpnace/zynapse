UPDATE "public"."memberships"
SET "role" = CASE
  WHEN "role" = 'brand_admin' THEN 'brand_owner'::workspace_role
  WHEN "role" = 'zynapse_ops' THEN 'ops'::workspace_role
  ELSE "role"
END
WHERE "role" IN ('brand_admin', 'zynapse_ops');--> statement-breakpoint

UPDATE "public"."invites"
SET "role" = CASE
  WHEN "role" = 'brand_admin' THEN 'brand_owner'::workspace_role
  WHEN "role" = 'zynapse_ops' THEN 'ops'::workspace_role
  ELSE "role"
END
WHERE "role" IN ('brand_admin', 'zynapse_ops');--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "campaign_workflows" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" uuid NOT NULL REFERENCES "campaigns"("id") ON DELETE cascade ON UPDATE no action,
  "ops_owner_user_id" uuid,
  "workflow_status" "campaign_workflow_status" DEFAULT 'setup' NOT NULL,
  "review_status" "campaign_workflow_review_status" DEFAULT 'not_ready' NOT NULL,
  "delivery_status" "campaign_workflow_delivery_status" DEFAULT 'not_ready' NOT NULL,
  "commercial_status" "campaign_workflow_commercial_status" DEFAULT 'not_ready' NOT NULL,
  "blocked_reason" text,
  "sla_due_at" timestamp with time zone,
  "last_transition_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "campaign_workflows_campaign_unique" ON "campaign_workflows" ("campaign_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "campaign_workflows_commercial_status_idx" ON "campaign_workflows" ("commercial_status");--> statement-breakpoint

INSERT INTO "public"."campaign_workflows" (
  "campaign_id",
  "workflow_status",
  "review_status",
  "delivery_status",
  "commercial_status",
  "last_transition_at"
)
SELECT
  campaign.id,
  CASE
    WHEN campaign.current_stage = 'handover_ready' THEN 'handover'::campaign_workflow_status
    WHEN campaign.current_stage IN ('approved', 'in_review') THEN 'review'::campaign_workflow_status
    ELSE 'production'::campaign_workflow_status
  END,
  CASE
    WHEN campaign.current_stage IN ('approved', 'handover_ready') THEN 'approved'::campaign_workflow_review_status
    WHEN campaign.current_stage = 'in_review' THEN 'in_review'::campaign_workflow_review_status
    ELSE 'not_ready'::campaign_workflow_review_status
  END,
  CASE
    WHEN campaign.current_stage = 'handover_ready' THEN 'ready'::campaign_workflow_delivery_status
    WHEN campaign.current_stage = 'approved' THEN 'preparing'::campaign_workflow_delivery_status
    ELSE 'not_ready'::campaign_workflow_delivery_status
  END,
  CASE
    WHEN campaign.current_stage IN ('approved', 'handover_ready') THEN 'ready_for_pilot'::campaign_workflow_commercial_status
    ELSE 'not_ready'::campaign_workflow_commercial_status
  END,
  now()
FROM "public"."campaigns" AS campaign
ON CONFLICT ("campaign_id") DO NOTHING;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_manage_org"(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships AS membership
    WHERE membership.organization_id = target_org_id
      AND membership.user_id = auth.uid()
      AND membership.role IN (
        'brand_owner',
        'brand_marketing_lead',
        'ops',
        'ops_admin',
        'brand_admin',
        'zynapse_ops'
      )
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."is_ops_user"()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships AS membership
    WHERE membership.user_id = auth.uid()
      AND membership.role IN ('ops', 'ops_admin', 'zynapse_ops')
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."is_ops_for_org"(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships AS membership
    WHERE membership.organization_id = target_org_id
      AND membership.user_id = auth.uid()
      AND membership.role IN ('ops', 'ops_admin', 'zynapse_ops')
  );
$$;--> statement-breakpoint

ALTER TABLE "public"."campaign_workflows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

DROP POLICY IF EXISTS "campaign_workflows_select" ON "public"."campaign_workflows";--> statement-breakpoint
CREATE POLICY "campaign_workflows_select"
ON "public"."campaign_workflows"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_campaign"("campaign_workflows"."campaign_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "campaign_workflows_insert" ON "public"."campaign_workflows";--> statement-breakpoint
CREATE POLICY "campaign_workflows_insert"
ON "public"."campaign_workflows"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT "private"."can_manage_campaign_assignment"("campaign_workflows"."campaign_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "campaign_workflows_update" ON "public"."campaign_workflows";--> statement-breakpoint
CREATE POLICY "campaign_workflows_update"
ON "public"."campaign_workflows"
FOR UPDATE
TO authenticated
USING ((SELECT "private"."can_manage_campaign_assignment"("campaign_workflows"."campaign_id")))
WITH CHECK ((SELECT "private"."can_manage_campaign_assignment"("campaign_workflows"."campaign_id")));--> statement-breakpoint
