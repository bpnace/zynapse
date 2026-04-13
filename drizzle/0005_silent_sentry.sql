CREATE SCHEMA IF NOT EXISTS "private";--> statement-breakpoint
GRANT USAGE ON SCHEMA "private" TO authenticated;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "private"."current_user_email"()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT nullif(lower(trim(auth.jwt() ->> 'email')), '');
$$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "private"."has_org_membership"(target_org_id uuid)
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
  );
$$;--> statement-breakpoint
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
      AND membership.role IN ('brand_admin', 'zynapse_ops')
  );
$$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "private"."can_edit_profile"(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT private.can_manage_org(target_org_id);
$$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "private"."can_create_brief"(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT private.can_manage_org(target_org_id);
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
      AND private.has_org_membership(campaign.organization_id)
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
      AND private.has_org_membership(campaign.organization_id)
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
      AND private.has_org_membership(campaign.organization_id)
  );
$$;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."current_user_email"() TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."has_org_membership"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_manage_org"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_edit_profile"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_create_brief"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_access_campaign"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_access_asset"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_access_thread"(uuid) TO authenticated;--> statement-breakpoint

ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."invites" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."memberships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."brand_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."briefs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."campaigns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."campaign_stages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."review_threads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."pilot_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

DROP POLICY IF EXISTS "organizations_member_select" ON "public"."organizations";--> statement-breakpoint
CREATE POLICY "organizations_member_select"
ON "public"."organizations"
FOR SELECT
TO authenticated
USING ((SELECT "private"."has_org_membership"("organizations"."id")));--> statement-breakpoint

DROP POLICY IF EXISTS "invites_select" ON "public"."invites";--> statement-breakpoint
CREATE POLICY "invites_select"
ON "public"."invites"
FOR SELECT
TO authenticated
USING (
  (SELECT "private"."can_manage_org"("invites"."organization_id"))
  OR lower("invites"."email") = (SELECT "private"."current_user_email"())
);--> statement-breakpoint
DROP POLICY IF EXISTS "invites_insert" ON "public"."invites";--> statement-breakpoint
CREATE POLICY "invites_insert"
ON "public"."invites"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT "private"."can_manage_org"("invites"."organization_id")));--> statement-breakpoint
DROP POLICY IF EXISTS "invites_update" ON "public"."invites";--> statement-breakpoint
CREATE POLICY "invites_update"
ON "public"."invites"
FOR UPDATE
TO authenticated
USING ((SELECT "private"."can_manage_org"("invites"."organization_id")))
WITH CHECK ((SELECT "private"."can_manage_org"("invites"."organization_id")));--> statement-breakpoint
DROP POLICY IF EXISTS "invites_delete" ON "public"."invites";--> statement-breakpoint
CREATE POLICY "invites_delete"
ON "public"."invites"
FOR DELETE
TO authenticated
USING ((SELECT "private"."can_manage_org"("invites"."organization_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "memberships_select" ON "public"."memberships";--> statement-breakpoint
CREATE POLICY "memberships_select"
ON "public"."memberships"
FOR SELECT
TO authenticated
USING (
  "memberships"."user_id" = (SELECT auth.uid())
  OR (SELECT "private"."can_manage_org"("memberships"."organization_id"))
);--> statement-breakpoint

DROP POLICY IF EXISTS "brand_profiles_select" ON "public"."brand_profiles";--> statement-breakpoint
CREATE POLICY "brand_profiles_select"
ON "public"."brand_profiles"
FOR SELECT
TO authenticated
USING ((SELECT "private"."has_org_membership"("brand_profiles"."organization_id")));--> statement-breakpoint
DROP POLICY IF EXISTS "brand_profiles_insert" ON "public"."brand_profiles";--> statement-breakpoint
CREATE POLICY "brand_profiles_insert"
ON "public"."brand_profiles"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT "private"."can_edit_profile"("brand_profiles"."organization_id")));--> statement-breakpoint
DROP POLICY IF EXISTS "brand_profiles_update" ON "public"."brand_profiles";--> statement-breakpoint
CREATE POLICY "brand_profiles_update"
ON "public"."brand_profiles"
FOR UPDATE
TO authenticated
USING ((SELECT "private"."can_edit_profile"("brand_profiles"."organization_id")))
WITH CHECK ((SELECT "private"."can_edit_profile"("brand_profiles"."organization_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "briefs_select" ON "public"."briefs";--> statement-breakpoint
CREATE POLICY "briefs_select"
ON "public"."briefs"
FOR SELECT
TO authenticated
USING ((SELECT "private"."has_org_membership"("briefs"."organization_id")));--> statement-breakpoint
DROP POLICY IF EXISTS "briefs_insert" ON "public"."briefs";--> statement-breakpoint
CREATE POLICY "briefs_insert"
ON "public"."briefs"
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT "private"."can_create_brief"("briefs"."organization_id"))
  AND "briefs"."created_by" = ((SELECT auth.uid())::text)
);--> statement-breakpoint
DROP POLICY IF EXISTS "briefs_update" ON "public"."briefs";--> statement-breakpoint
CREATE POLICY "briefs_update"
ON "public"."briefs"
FOR UPDATE
TO authenticated
USING ((SELECT "private"."can_create_brief"("briefs"."organization_id")))
WITH CHECK ((SELECT "private"."can_create_brief"("briefs"."organization_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "campaigns_select" ON "public"."campaigns";--> statement-breakpoint
CREATE POLICY "campaigns_select"
ON "public"."campaigns"
FOR SELECT
TO authenticated
USING ((SELECT "private"."has_org_membership"("campaigns"."organization_id")));--> statement-breakpoint

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
USING ((SELECT "private"."can_access_campaign"("assets"."campaign_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "review_threads_select" ON "public"."review_threads";--> statement-breakpoint
CREATE POLICY "review_threads_select"
ON "public"."review_threads"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_asset"("review_threads"."asset_id")));--> statement-breakpoint

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
USING ((SELECT "private"."has_org_membership"("pilot_requests"."organization_id")));--> statement-breakpoint
