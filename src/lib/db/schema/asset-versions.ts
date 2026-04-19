import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { assets } from "@/lib/db/schema/assets";
import { campaignAssignments } from "@/lib/db/schema/campaign-assignments";
import { campaigns } from "@/lib/db/schema/campaigns";
import { assetVersionStatusEnum, createdAtColumn } from "@/lib/db/schema/shared";

export const assetVersions = pgTable(
  "asset_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    assignmentId: uuid("assignment_id").references(() => campaignAssignments.id, {
      onDelete: "set null",
    }),
    createdBy: uuid("created_by").notNull(),
    versionLabel: text("version_label").notNull(),
    storagePath: text("storage_path").notNull(),
    thumbnailPath: text("thumbnail_path"),
    notes: text("notes"),
    submissionStatus: assetVersionStatusEnum("submission_status")
      .default("submitted_for_ops_review")
      .notNull(),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    assetIndex: index("asset_versions_asset_idx").on(table.assetId),
    campaignIndex: index("asset_versions_campaign_idx").on(table.campaignId),
  }),
);
