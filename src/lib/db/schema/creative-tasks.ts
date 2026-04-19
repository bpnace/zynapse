import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { campaignAssignments } from "@/lib/db/schema/campaign-assignments";
import { campaigns } from "@/lib/db/schema/campaigns";
import {
  creativeTaskStatusEnum,
  createdAtColumn,
  workPriorityEnum,
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
    taskType: text("task_type").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    status: creativeTaskStatusEnum("status").default("todo").notNull(),
    priority: workPriorityEnum("priority").default("medium").notNull(),
    ownerUserId: uuid("owner_user_id"),
    createdBy: text("created_by").notNull(),
    blockedReason: text("blocked_reason"),
    dueAt: timestamp("due_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    campaignIndex: index("creative_tasks_campaign_idx").on(table.campaignId),
    assignmentIndex: index("creative_tasks_assignment_idx").on(table.assignmentId),
    ownerIndex: index("creative_tasks_owner_idx").on(table.ownerUserId),
    statusIndex: index("creative_tasks_status_idx").on(table.status),
  }),
);
