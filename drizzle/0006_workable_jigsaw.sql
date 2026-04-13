CREATE OR REPLACE FUNCTION "public"."workspace_login_eligible"(target_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  WITH normalized AS (
    SELECT nullif(lower(trim(target_email)), '') AS email
  )
  SELECT EXISTS (
    SELECT 1
    FROM public.invites AS invite
    CROSS JOIN normalized
    WHERE normalized.email IS NOT NULL
      AND lower(invite.email) = normalized.email
      AND (
        invite.accepted_at IS NOT NULL
        OR invite.expires_at > now()
      )
  ) OR EXISTS (
    SELECT 1
    FROM auth.users AS auth_user
    INNER JOIN public.memberships AS membership ON membership.user_id = auth_user.id
    CROSS JOIN normalized
    WHERE normalized.email IS NOT NULL
      AND lower(auth_user.email) = normalized.email
  );
$$;--> statement-breakpoint
REVOKE ALL ON FUNCTION "public"."workspace_login_eligible"(text) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "public"."workspace_login_eligible"(text) TO service_role;--> statement-breakpoint
