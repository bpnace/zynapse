CREATE TYPE "public"."brief_status" AS ENUM('draft', 'submitted');--> statement-breakpoint
CREATE TABLE "briefs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"title" text NOT NULL,
	"status" "brief_status" DEFAULT 'draft' NOT NULL,
	"objective" text NOT NULL,
	"offer" text NOT NULL,
	"audience" text NOT NULL,
	"channels" text NOT NULL,
	"references_json" text NOT NULL,
	"budget_range" text NOT NULL,
	"timeline" text NOT NULL,
	"approval_notes" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "briefs" ADD CONSTRAINT "briefs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "briefs_organization_idx" ON "briefs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "briefs_status_idx" ON "briefs" USING btree ("status");