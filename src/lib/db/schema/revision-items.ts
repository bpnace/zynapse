import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { assets } from "@/lib/db/schema/assets";
import { campaigns } from "@/lib/db/schema/campaigns";
import { creativeTasks } from "@/lib/db/schema/creative-tasks";
import {
  revisionItemStatusEnum,
  revisionSourceRoleEnum,
  workPriorityEnum,
} from "@/lib/db/schema/shared";

export const revisionItems = pgTable(
  "revision_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id").references(() => assets.id, { onDelete: "set null" }),
    taskId: uuid("task_id").references(() => creativeTasks.id, { onDelete: "set null" }),
    sourceRole: revisionSourceRoleEnum("source_role").notNull(),
    sourceType: text("source_type").notNull(),
    category: text("category").notNull(),
    priority: workPriorityEnum("priority").default("medium").notNull(),
    body: text("body").notNull(),
    status: revisionItemStatusEnum("status").default("open").notNull(),
    dueAt: timestamp("due_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolvedBy: text("resolved_by"),
  },
  (table) => ({
    campaignIndex: index("revision_items_campaign_idx").on(table.campaignId),
    assetIndex: index("revision_items_asset_idx").on(table.assetId),
    taskIndex: index("revision_items_task_idx").on(table.taskId),
    statusIndex: index("revision_items_status_idx").on(table.status),
  }),
);
