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
      AND membership.role = 'zynapse_ops'
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
      AND membership.role = 'zynapse_ops'
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_access_campaign_assignment"(target_assignment_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.campaign_assignments AS assignment
    INNER JOIN public.campaigns AS campaign ON campaign.id = assignment.campaign_id
    WHERE assignment.id = target_assignment_id
      AND (
        assignment.user_id = auth.uid()
        OR private.is_ops_for_org(campaign.organization_id)
      )
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_manage_campaign_assignment"(target_campaign_id uuid)
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
      AND private.is_ops_for_org(campaign.organization_id)
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_access_creative_task"(target_task_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.creative_tasks AS task
    INNER JOIN public.campaigns AS campaign ON campaign.id = task.campaign_id
    WHERE task.id = target_task_id
      AND (
        task.owner_user_id = auth.uid()
        OR private.is_ops_for_org(campaign.organization_id)
      )
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_access_asset_version"(target_version_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.asset_versions AS version
    INNER JOIN public.campaigns AS campaign ON campaign.id = version.campaign_id
    LEFT JOIN public.campaign_assignments AS assignment ON assignment.id = version.assignment_id
    WHERE version.id = target_version_id
      AND (
        version.created_by = auth.uid()
        OR assignment.user_id = auth.uid()
        OR private.is_ops_for_org(campaign.organization_id)
      )
  );
$$;--> statement-breakpoint

CREATE OR REPLACE FUNCTION "private"."can_access_revision_item"(target_revision_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.revision_items AS revision
    INNER JOIN public.campaigns AS campaign ON campaign.id = revision.campaign_id
    LEFT JOIN public.campaign_assignments AS assignment ON assignment.id = revision.assignment_id
    WHERE revision.id = target_revision_id
      AND (
        assignment.user_id = auth.uid()
        OR private.is_ops_for_org(campaign.organization_id)
      )
  );
$$;--> statement-breakpoint

GRANT EXECUTE ON FUNCTION "private"."is_ops_user"() TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."is_ops_for_org"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_access_campaign_assignment"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_manage_campaign_assignment"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_access_creative_task"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_access_asset_version"(uuid) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "private"."can_access_revision_item"(uuid) TO authenticated;--> statement-breakpoint

ALTER TABLE "public"."creative_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."campaign_assignments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."creative_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."asset_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."revision_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

DROP POLICY IF EXISTS "creative_profiles_select" ON "public"."creative_profiles";--> statement-breakpoint
CREATE POLICY "creative_profiles_select"
ON "public"."creative_profiles"
FOR SELECT
TO authenticated
USING (
  "creative_profiles"."user_id" = auth.uid()
  OR (SELECT "private"."is_ops_user"())
);--> statement-breakpoint

DROP POLICY IF EXISTS "creative_profiles_insert" ON "public"."creative_profiles";--> statement-breakpoint
CREATE POLICY "creative_profiles_insert"
ON "public"."creative_profiles"
FOR INSERT
TO authenticated
WITH CHECK (
  "creative_profiles"."user_id" = auth.uid()
  OR (SELECT "private"."is_ops_user"())
);--> statement-breakpoint

DROP POLICY IF EXISTS "creative_profiles_update" ON "public"."creative_profiles";--> statement-breakpoint
CREATE POLICY "creative_profiles_update"
ON "public"."creative_profiles"
FOR UPDATE
TO authenticated
USING (
  "creative_profiles"."user_id" = auth.uid()
  OR (SELECT "private"."is_ops_user"())
)
WITH CHECK (
  "creative_profiles"."user_id" = auth.uid()
  OR (SELECT "private"."is_ops_user"())
);--> statement-breakpoint

DROP POLICY IF EXISTS "campaign_assignments_select" ON "public"."campaign_assignments";--> statement-breakpoint
CREATE POLICY "campaign_assignments_select"
ON "public"."campaign_assignments"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_campaign_assignment"("campaign_assignments"."id")));--> statement-breakpoint

DROP POLICY IF EXISTS "campaign_assignments_insert" ON "public"."campaign_assignments";--> statement-breakpoint
CREATE POLICY "campaign_assignments_insert"
ON "public"."campaign_assignments"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT "private"."can_manage_campaign_assignment"("campaign_assignments"."campaign_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "campaign_assignments_update" ON "public"."campaign_assignments";--> statement-breakpoint
CREATE POLICY "campaign_assignments_update"
ON "public"."campaign_assignments"
FOR UPDATE
TO authenticated
USING ((SELECT "private"."can_access_campaign_assignment"("campaign_assignments"."id")))
WITH CHECK (
  "campaign_assignments"."user_id" = auth.uid()
  OR (SELECT "private"."can_manage_campaign_assignment"("campaign_assignments"."campaign_id"))
);--> statement-breakpoint

DROP POLICY IF EXISTS "creative_tasks_select" ON "public"."creative_tasks";--> statement-breakpoint
CREATE POLICY "creative_tasks_select"
ON "public"."creative_tasks"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_creative_task"("creative_tasks"."id")));--> statement-breakpoint

DROP POLICY IF EXISTS "creative_tasks_insert" ON "public"."creative_tasks";--> statement-breakpoint
CREATE POLICY "creative_tasks_insert"
ON "public"."creative_tasks"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT "private"."can_manage_campaign_assignment"("creative_tasks"."campaign_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "creative_tasks_update" ON "public"."creative_tasks";--> statement-breakpoint
CREATE POLICY "creative_tasks_update"
ON "public"."creative_tasks"
FOR UPDATE
TO authenticated
USING ((SELECT "private"."can_access_creative_task"("creative_tasks"."id")))
WITH CHECK (
  "creative_tasks"."owner_user_id" = auth.uid()
  OR (SELECT "private"."can_manage_campaign_assignment"("creative_tasks"."campaign_id"))
);--> statement-breakpoint

DROP POLICY IF EXISTS "asset_versions_select" ON "public"."asset_versions";--> statement-breakpoint
CREATE POLICY "asset_versions_select"
ON "public"."asset_versions"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_asset_version"("asset_versions"."id")));--> statement-breakpoint

DROP POLICY IF EXISTS "asset_versions_insert" ON "public"."asset_versions";--> statement-breakpoint
CREATE POLICY "asset_versions_insert"
ON "public"."asset_versions"
FOR INSERT
TO authenticated
WITH CHECK (
  "asset_versions"."created_by" = auth.uid()
  OR (SELECT "private"."can_manage_campaign_assignment"("asset_versions"."campaign_id"))
);--> statement-breakpoint

DROP POLICY IF EXISTS "asset_versions_update" ON "public"."asset_versions";--> statement-breakpoint
CREATE POLICY "asset_versions_update"
ON "public"."asset_versions"
FOR UPDATE
TO authenticated
USING ((SELECT "private"."can_access_asset_version"("asset_versions"."id")))
WITH CHECK (
  "asset_versions"."created_by" = auth.uid()
  OR (SELECT "private"."can_manage_campaign_assignment"("asset_versions"."campaign_id"))
);--> statement-breakpoint

DROP POLICY IF EXISTS "revision_items_select" ON "public"."revision_items";--> statement-breakpoint
CREATE POLICY "revision_items_select"
ON "public"."revision_items"
FOR SELECT
TO authenticated
USING ((SELECT "private"."can_access_revision_item"("revision_items"."id")));--> statement-breakpoint

DROP POLICY IF EXISTS "revision_items_insert" ON "public"."revision_items";--> statement-breakpoint
CREATE POLICY "revision_items_insert"
ON "public"."revision_items"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT "private"."can_manage_campaign_assignment"("revision_items"."campaign_id")));--> statement-breakpoint

DROP POLICY IF EXISTS "revision_items_update" ON "public"."revision_items";--> statement-breakpoint
CREATE POLICY "revision_items_update"
ON "public"."revision_items"
FOR UPDATE
TO authenticated
USING ((SELECT "private"."can_access_revision_item"("revision_items"."id")))
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.campaign_assignments AS assignment
    WHERE assignment.id = "revision_items"."assignment_id"
      AND assignment.user_id = auth.uid()
  )
  OR (SELECT "private"."can_manage_campaign_assignment"("revision_items"."campaign_id"))
);--> statement-breakpoint
