import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizations } from "@/lib/db/schema/organizations";
import { briefStatusEnum } from "@/lib/db/schema/shared";

export const briefs = pgTable(
  "briefs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    createdBy: text("created_by").notNull(),
    title: text("title").notNull(),
    status: briefStatusEnum("status").default("draft").notNull(),
    objective: text("objective").notNull(),
    offer: text("offer").notNull(),
    audience: text("audience").notNull(),
    channels: text("channels").notNull(),
    referencesJson: text("references_json").notNull(),
    budgetRange: text("budget_range").notNull(),
    timeline: text("timeline").notNull(),
    approvalNotes: text("approval_notes").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
  },
  (table) => ({
    organizationIndex: index("briefs_organization_idx").on(table.organizationId),
    statusIndex: index("briefs_status_idx").on(table.status),
  }),
);
