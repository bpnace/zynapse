import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { assets } from "@/lib/db/schema/assets";
import { campaigns } from "@/lib/db/schema/campaigns";
import {
  assetVersionSubmissionStatusEnum,
  createdAtColumn,
} from "@/lib/db/schema/shared";

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
    createdBy: text("created_by").notNull(),
    versionLabel: text("version_label").notNull(),
    storagePath: text("storage_path"),
    thumbnailPath: text("thumbnail_path"),
    submissionStatus: assetVersionSubmissionStatusEnum("submission_status")
      .default("draft")
      .notNull(),
    submissionNotes: text("submission_notes"),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    assetIndex: index("asset_versions_asset_idx").on(table.assetId),
    campaignIndex: index("asset_versions_campaign_idx").on(table.campaignId),
    submissionStatusIndex: index("asset_versions_submission_status_idx").on(
      table.submissionStatus,
    ),
  }),
);
