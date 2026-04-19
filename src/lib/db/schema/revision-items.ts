import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { assets } from "@/lib/db/schema/assets";
import { campaignAssignments } from "@/lib/db/schema/campaign-assignments";
import { campaigns } from "@/lib/db/schema/campaigns";
import { comments } from "@/lib/db/schema/comments";
import { reviewThreads } from "@/lib/db/schema/review-threads";
import {
  createdAtColumn,
  creativeTaskPriorityEnum,
  revisionItemStatusEnum,
} from "@/lib/db/schema/shared";

export const revisionItems = pgTable(
  "revision_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    assignmentId: uuid("assignment_id").references(() => campaignAssignments.id, {
      onDelete: "set null",
    }),
    assetId: uuid("asset_id").references(() => assets.id, { onDelete: "set null" }),
    reviewThreadId: uuid("review_thread_id").references(() => reviewThreads.id, {
      onDelete: "set null",
    }),
    sourceCommentId: uuid("source_comment_id").references(() => comments.id, {
      onDelete: "set null",
    }),
    createdBy: text("created_by"),
    title: text("title").notNull(),
    detail: text("detail").notNull(),
    status: revisionItemStatusEnum("status").default("open").notNull(),
    priority: creativeTaskPriorityEnum("priority").default("medium").notNull(),
    createdAt: createdAtColumn(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => ({
    campaignIndex: index("revision_items_campaign_idx").on(table.campaignId),
    assignmentIndex: index("revision_items_assignment_idx").on(table.assignmentId),
    statusIndex: index("revision_items_status_idx").on(table.status),
  }),
);
