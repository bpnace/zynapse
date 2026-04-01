import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizations } from "@/lib/db/schema/organizations";

export const brandProfiles = pgTable("brand_profiles", {
  organizationId: uuid("organization_id")
    .primaryKey()
    .references(() => organizations.id, { onDelete: "cascade" }),
  website: text("website"),
  offerSummary: text("offer_summary"),
  targetAudience: text("target_audience"),
  primaryChannels: text("primary_channels"),
  brandTone: text("brand_tone"),
  reviewNotes: text("review_notes"),
  claimGuardrails: text("claim_guardrails"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
