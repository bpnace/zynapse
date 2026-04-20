import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { campaigns } from "@/lib/db/schema/campaigns";
import {
  campaignWorkflowCommercialStatusEnum,
  campaignWorkflowDeliveryStatusEnum,
  campaignWorkflowReviewStatusEnum,
  campaignWorkflowStatusEnum,
} from "@/lib/db/schema/shared";

export const campaignWorkflows = pgTable(
  "campaign_workflows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    opsOwnerUserId: uuid("ops_owner_user_id"),
    workflowStatus: campaignWorkflowStatusEnum("workflow_status")
      .default("setup")
      .notNull(),
    reviewStatus: campaignWorkflowReviewStatusEnum("review_status")
      .default("not_ready")
      .notNull(),
    deliveryStatus: campaignWorkflowDeliveryStatusEnum("delivery_status")
      .default("not_ready")
      .notNull(),
    commercialStatus: campaignWorkflowCommercialStatusEnum("commercial_status")
      .default("not_ready")
      .notNull(),
    blockedReason: text("blocked_reason"),
    slaDueAt: timestamp("sla_due_at", { withTimezone: true }),
    lastTransitionAt: timestamp("last_transition_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    campaignUniqueIndex: uniqueIndex("campaign_workflows_campaign_unique").on(table.campaignId),
    commercialStatusIndex: index("campaign_workflows_commercial_status_idx").on(
      table.commercialStatus,
    ),
  }),
);
