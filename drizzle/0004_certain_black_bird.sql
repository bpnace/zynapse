CREATE TYPE "public"."pilot_request_handoff_mode" AS ENUM('webhook', 'log');--> statement-breakpoint
CREATE TYPE "public"."pilot_request_status" AS ENUM('submitted', 'failed');--> statement-breakpoint
CREATE TABLE "pilot_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"requested_by" text NOT NULL,
	"desired_tier" text NOT NULL,
	"start_window" text NOT NULL,
	"internal_stakeholders" text,
	"message" text NOT NULL,
	"status" "pilot_request_status" DEFAULT 'submitted' NOT NULL,
	"handoff_mode" "pilot_request_handoff_mode" NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pilot_requests" ADD CONSTRAINT "pilot_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilot_requests" ADD CONSTRAINT "pilot_requests_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pilot_requests_organization_idx" ON "pilot_requests" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "pilot_requests_campaign_idx" ON "pilot_requests" USING btree ("campaign_id");