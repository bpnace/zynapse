REVOKE ALL ON FUNCTION "public"."workspace_login_eligible"(text) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "public"."workspace_login_eligible"(text) TO anon;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "public"."workspace_login_eligible"(text) TO authenticated;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "public"."workspace_login_eligible"(text) TO service_role;--> statement-breakpoint
