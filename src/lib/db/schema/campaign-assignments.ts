import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { campaigns } from "@/lib/db/schema/campaigns";
import {
  assignmentRoleEnum,
  assignmentStatusEnum,
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
    assignmentRole: assignmentRoleEnum("assignment_role").default("creative").notNull(),
    status: assignmentStatusEnum("status").default("assigned").notNull(),
    assignedBy: uuid("assigned_by"),
    scopeSummary: text("scope_summary"),
    dueAt: timestamp("due_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    campaignIndex: index("campaign_assignments_campaign_idx").on(table.campaignId),
    userIndex: index("campaign_assignments_user_idx").on(table.userId),
  }),
);
