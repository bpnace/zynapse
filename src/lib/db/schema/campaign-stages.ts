import { index, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { campaigns } from "@/lib/db/schema/campaigns";
import { stageKeyEnum, stageStatusEnum } from "@/lib/db/schema/shared";

export const campaignStages = pgTable(
  "campaign_stages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    stageKey: stageKeyEnum("stage_key").notNull(),
    stageOrder: integer("stage_order").notNull(),
    status: stageStatusEnum("status").default("pending").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => ({
    campaignIndex: index("campaign_stages_campaign_idx").on(table.campaignId),
  }),
);
