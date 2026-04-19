import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { campaigns } from "@/lib/db/schema/campaigns";
import {
  campaignAssignmentStatusEnum,
  createdAtColumn,
} from "@/lib/db/schema/shared";

export const campaignAssignments = pgTable(
  "campaign_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    assignmentRole: text("assignment_role").notNull(),
    status: campaignAssignmentStatusEnum("status").default("invited").notNull(),
    assignedBy: text("assigned_by").notNull(),
    invitedAt: timestamp("invited_at", { withTimezone: true }).defaultNow().notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    dueAt: timestamp("due_at", { withTimezone: true }),
    scopeSummary: text("scope_summary"),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    campaignIndex: index("campaign_assignments_campaign_idx").on(table.campaignId),
    userIndex: index("campaign_assignments_user_idx").on(table.userId),
    statusIndex: index("campaign_assignments_status_idx").on(table.status),
    activeAssignmentUniqueIndex: uniqueIndex("campaign_assignments_campaign_user_role_unique").on(
      table.campaignId,
      table.userId,
      table.assignmentRole,
    ),
  }),
);
