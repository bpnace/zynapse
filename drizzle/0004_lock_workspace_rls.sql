CREATE OR REPLACE FUNCTION public.workspace_membership_role(target_organization_id uuid)
RETURNS public.workspace_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT m.role
  FROM public.memberships AS m
  WHERE m.organization_id = target_organization_id
    AND m.user_id = auth.uid()
  LIMIT 1
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.is_workspace_member(target_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.workspace_membership_role(target_organization_id) IS NOT NULL
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.can_manage_workspace(target_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.workspace_membership_role(target_organization_id) IN ('brand_admin', 'zynapse_ops')
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.campaign_organization_id(target_campaign_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT c.organization_id
  FROM public.campaigns AS c
  WHERE c.id = target_campaign_id
  LIMIT 1
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.asset_organization_id(target_asset_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT c.organization_id
  FROM public.assets AS a
  INNER JOIN public.campaigns AS c ON c.id = a.campaign_id
  WHERE a.id = target_asset_id
  LIMIT 1
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.review_thread_organization_id(target_thread_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.asset_organization_id(rt.asset_id)
  FROM public.review_threads AS rt
  WHERE rt.id = target_thread_id
  LIMIT 1
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.workspace_membership_role(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_workspace_member(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_manage_workspace(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.campaign_organization_id(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.asset_organization_id(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.review_thread_organization_id(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.workspace_membership_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_workspace_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_workspace(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.campaign_organization_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.asset_organization_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.review_thread_organization_id(uuid) TO authenticated;
--> statement-breakpoint
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
REVOKE ALL ON TABLE public.organizations, public.invites, public.memberships, public.brand_profiles, public.campaigns, public.campaign_stages, public.assets, public.review_threads, public.comments, public.briefs FROM anon, authenticated;
GRANT SELECT ON TABLE public.organizations, public.memberships, public.brand_profiles, public.campaigns, public.campaign_stages, public.assets, public.review_threads, public.comments, public.briefs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.invites TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.memberships, public.brand_profiles, public.campaigns, public.campaign_stages, public.assets, public.review_threads, public.comments, public.briefs TO authenticated;
--> statement-breakpoint
CREATE POLICY "organizations_select_workspace_member"
ON public.organizations
FOR SELECT
TO authenticated
USING (public.is_workspace_member(id));
--> statement-breakpoint
CREATE POLICY "organizations_update_workspace_admin"
ON public.organizations
FOR UPDATE
TO authenticated
USING (public.can_manage_workspace(id))
WITH CHECK (public.can_manage_workspace(id));
--> statement-breakpoint
CREATE POLICY "memberships_select_workspace_admin_or_self"
ON public.memberships
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "memberships_insert_workspace_admin"
ON public.memberships
FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "memberships_update_workspace_admin"
ON public.memberships
FOR UPDATE
TO authenticated
USING (public.can_manage_workspace(organization_id))
WITH CHECK (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "memberships_delete_workspace_admin"
ON public.memberships
FOR DELETE
TO authenticated
USING (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "invites_select_workspace_admin"
ON public.invites
FOR SELECT
TO authenticated
USING (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "invites_insert_workspace_admin"
ON public.invites
FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "invites_update_workspace_admin"
ON public.invites
FOR UPDATE
TO authenticated
USING (public.can_manage_workspace(organization_id))
WITH CHECK (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "invites_delete_workspace_admin"
ON public.invites
FOR DELETE
TO authenticated
USING (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "brand_profiles_select_workspace_member"
ON public.brand_profiles
FOR SELECT
TO authenticated
USING (public.is_workspace_member(organization_id));
--> statement-breakpoint
CREATE POLICY "brand_profiles_write_workspace_admin"
ON public.brand_profiles
FOR ALL
TO authenticated
USING (public.can_manage_workspace(organization_id))
WITH CHECK (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "campaigns_select_workspace_member"
ON public.campaigns
FOR SELECT
TO authenticated
USING (public.is_workspace_member(organization_id));
--> statement-breakpoint
CREATE POLICY "campaigns_write_workspace_admin"
ON public.campaigns
FOR ALL
TO authenticated
USING (public.can_manage_workspace(organization_id))
WITH CHECK (public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "campaign_stages_select_workspace_member"
ON public.campaign_stages
FOR SELECT
TO authenticated
USING (public.is_workspace_member(public.campaign_organization_id(campaign_id)));
--> statement-breakpoint
CREATE POLICY "campaign_stages_write_workspace_admin"
ON public.campaign_stages
FOR ALL
TO authenticated
USING (public.can_manage_workspace(public.campaign_organization_id(campaign_id)))
WITH CHECK (public.can_manage_workspace(public.campaign_organization_id(campaign_id)));
--> statement-breakpoint
CREATE POLICY "assets_select_workspace_member"
ON public.assets
FOR SELECT
TO authenticated
USING (public.is_workspace_member(public.asset_organization_id(id)));
--> statement-breakpoint
CREATE POLICY "assets_write_workspace_admin"
ON public.assets
FOR ALL
TO authenticated
USING (public.can_manage_workspace(public.asset_organization_id(id)))
WITH CHECK (public.can_manage_workspace(public.campaign_organization_id(campaign_id)));
--> statement-breakpoint
CREATE POLICY "review_threads_select_workspace_member"
ON public.review_threads
FOR SELECT
TO authenticated
USING (public.is_workspace_member(public.asset_organization_id(asset_id)));
--> statement-breakpoint
CREATE POLICY "review_threads_insert_workspace_member"
ON public.review_threads
FOR INSERT
TO authenticated
WITH CHECK (public.is_workspace_member(public.asset_organization_id(asset_id)));
--> statement-breakpoint
CREATE POLICY "review_threads_update_author_or_admin"
ON public.review_threads
FOR UPDATE
TO authenticated
USING (created_by = auth.uid()::text OR public.can_manage_workspace(public.asset_organization_id(asset_id)))
WITH CHECK (created_by = auth.uid()::text OR public.can_manage_workspace(public.asset_organization_id(asset_id)));
--> statement-breakpoint
CREATE POLICY "review_threads_delete_author_or_admin"
ON public.review_threads
FOR DELETE
TO authenticated
USING (created_by = auth.uid()::text OR public.can_manage_workspace(public.asset_organization_id(asset_id)));
--> statement-breakpoint
CREATE POLICY "comments_select_workspace_member"
ON public.comments
FOR SELECT
TO authenticated
USING (public.is_workspace_member(public.review_thread_organization_id(thread_id)));
--> statement-breakpoint
CREATE POLICY "comments_insert_workspace_member"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (public.is_workspace_member(public.review_thread_organization_id(thread_id)));
--> statement-breakpoint
CREATE POLICY "comments_update_author_or_admin"
ON public.comments
FOR UPDATE
TO authenticated
USING (author_id = auth.uid()::text OR public.can_manage_workspace(public.review_thread_organization_id(thread_id)))
WITH CHECK (author_id = auth.uid()::text OR public.can_manage_workspace(public.review_thread_organization_id(thread_id)));
--> statement-breakpoint
CREATE POLICY "comments_delete_author_or_admin"
ON public.comments
FOR DELETE
TO authenticated
USING (author_id = auth.uid()::text OR public.can_manage_workspace(public.review_thread_organization_id(thread_id)));
--> statement-breakpoint
CREATE POLICY "briefs_select_workspace_member"
ON public.briefs
FOR SELECT
TO authenticated
USING (public.is_workspace_member(organization_id));
--> statement-breakpoint
CREATE POLICY "briefs_insert_workspace_member"
ON public.briefs
FOR INSERT
TO authenticated
WITH CHECK (public.is_workspace_member(organization_id));
--> statement-breakpoint
CREATE POLICY "briefs_update_author_or_admin"
ON public.briefs
FOR UPDATE
TO authenticated
USING (created_by = auth.uid()::text OR public.can_manage_workspace(organization_id))
WITH CHECK (created_by = auth.uid()::text OR public.can_manage_workspace(organization_id));
--> statement-breakpoint
CREATE POLICY "briefs_delete_author_or_admin"
ON public.briefs
FOR DELETE
TO authenticated
USING (created_by = auth.uid()::text OR public.can_manage_workspace(organization_id));
