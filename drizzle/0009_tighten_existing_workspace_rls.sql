CREATE OR REPLACE FUNCTION "private"."has_brand_or_ops_membership"(target_org_id uuid)
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
      AND membership.workspace_type IN ('brand', 'ops')
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."has_creative_campaign_assignment"(target_campaign_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaign_assignments AS assignment
    WHERE assignment.campaign_id = target_campaign_id
      AND assignment.user_id = auth.uid()
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_access_brand_profile"(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT private.has_brand_or_ops_membership(target_org_id)
    OR EXISTS (
      SELECT 1
      FROM public.campaign_assignments AS assignment
      INNER JOIN public.campaigns AS campaign ON campaign.id = assignment.campaign_id
      WHERE campaign.organization_id = target_org_id
        AND assignment.user_id = auth.uid()
    );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_access_campaign"(target_campaign_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaigns AS campaign
    WHERE campaign.id = target_campaign_id
      AND (
        private.has_brand_or_ops_membership(campaign.organization_id)
        OR private.has_creative_campaign_assignment(campaign.id)
      )
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_access_asset"(target_asset_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.assets AS asset
    INNER JOIN public.campaigns AS campaign ON campaign.id = asset.campaign_id
    WHERE asset.id = target_asset_id
      AND (
        private.has_brand_or_ops_membership(campaign.organization_id)
        OR private.has_creative_campaign_assignment(campaign.id)
      )
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_access_thread"(target_thread_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.review_threads AS thread
    INNER JOIN public.assets AS asset ON asset.id = thread.asset_id
    INNER JOIN public.campaigns AS campaign ON campaign.id = asset.campaign_id
    WHERE thread.id = target_thread_id
      AND (
        private.has_brand_or_ops_membership(campaign.organization_id)
        OR private.has_creative_campaign_assignment(campaign.id)
      )
  );
$$;--> statement-breakpoint

GRANT EXECUTE ON FUNCTION "private"."has_brand_or_ops_membership"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."has_creative_campaign_assignment"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_access_brand_profile"(uuid) TO authenticated;--> statement-breakpoint

DROP POLICY IF EXISTS "brand_profiles_select" ON "public"."brand_profiles";--> statement-breakpoint
CREATE POLICY "brand_profiles_select"
ON "public"."brand_profiles"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_brand_profile"("brand_profiles"."organization_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "briefs_select" ON "public"."briefs";--> statement-breakpoint
CREATE POLICY "briefs_select"
ON "public"."briefs"
FOR SELECT
TO authenticated
USING ((SELECT "private"."has_brand_or_ops_membership"("briefs"."organization_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "campaigns_select" ON "public"."campaigns";--> statement-breakpoint
CREATE POLICY "campaigns_select"
ON "public"."campaigns"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_campaign"("campaigns"."id")));--> statement-breakpoint

DROP POLICY IF EXISTS "campaign_stages_select" ON "public"."campaign_stages";--> statement-breakpoint
CREATE POLICY "campaign_stages_select"
ON "public"."campaign_stages"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_campaign"("campaign_stages"."campaign_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "assets_select" ON "public"."assets";--> statement-breakpoint
CREATE POLICY "assets_select"
ON "public"."assets"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_asset"("assets"."id")));--> statement-breakpoint

DROP POLICY IF EXISTS "review_threads_select" ON "public"."review_threads";--> statement-breakpoint
CREATE POLICY "review_threads_select"
ON "public"."review_threads"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_thread"("review_threads"."id")));--> statement-breakpoint

DROP POLICY IF EXISTS "comments_select" ON "public"."comments";--> statement-breakpoint
CREATE POLICY "comments_select"
ON "public"."comments"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_thread"("comments"."thread_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "pilot_requests_select" ON "public"."pilot_requests";--> statement-breakpoint
CREATE POLICY "pilot_requests_select"
ON "public"."pilot_requests"
FOR SELECT
TO authenticated
USING ((SELECT "private"."has_brand_or_ops_membership"("pilot_requests"."organization_id")));--> statement-breakpoint
