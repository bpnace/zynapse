import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { campaigns } from "@/lib/db/schema/campaigns";
import { organizations } from "@/lib/db/schema/organizations";
import {
  pilotRequestHandoffModeEnum,
  pilotRequestStatusEnum,
} from "@/lib/db/schema/shared";

export const pilotRequests = pgTable(
  "pilot_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    requestedBy: text("requested_by").notNull(),
    desiredTier: text("desired_tier").notNull(),
    startWindow: text("start_window").notNull(),
    internalStakeholders: text("internal_stakeholders"),
    message: text("message").notNull(),
    status: pilotRequestStatusEnum("status").default("submitted").notNull(),
    handoffMode: pilotRequestHandoffModeEnum("handoff_mode").notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    organizationIndex: index("pilot_requests_organization_idx").on(table.organizationId),
    campaignIndex: index("pilot_requests_campaign_idx").on(table.campaignId),
  }),
);
