import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { assets } from "@/lib/db/schema/assets";
import { campaignAssignments } from "@/lib/db/schema/campaign-assignments";
import { campaigns } from "@/lib/db/schema/campaigns";
import {
  createdAtColumn,
  creativeTaskPriorityEnum,
  creativeTaskStatusEnum,
  creativeTaskTypeEnum,
} from "@/lib/db/schema/shared";

export const creativeTasks = pgTable(
  "creative_tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    assignmentId: uuid("assignment_id").references(() => campaignAssignments.id, {
      onDelete: "set null",
    }),
    assetId: uuid("asset_id").references(() => assets.id, { onDelete: "set null" }),
    ownerUserId: uuid("owner_user_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    taskType: creativeTaskTypeEnum("task_type").default("production").notNull(),
    status: creativeTaskStatusEnum("status").default("todo").notNull(),
    priority: creativeTaskPriorityEnum("priority").default("medium").notNull(),
    blockedReason: text("blocked_reason"),
    dueAt: timestamp("due_at", { withTimezone: true }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    campaignIndex: index("creative_tasks_campaign_idx").on(table.campaignId),
    assignmentIndex: index("creative_tasks_assignment_idx").on(table.assignmentId),
    ownerIndex: index("creative_tasks_owner_idx").on(table.ownerUserId),
  }),
);
