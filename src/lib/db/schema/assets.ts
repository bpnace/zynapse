import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { campaigns } from "@/lib/db/schema/campaigns";
import {
  assetReviewStatusEnum,
  assetScopeEnum,
  createdAtColumn,
} from "@/lib/db/schema/shared";

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    briefId: uuid("brief_id"),
    assetScope: assetScopeEnum("asset_scope").default("output").notNull(),
    assetType: text("asset_type").notNull(),
    title: text("title").notNull(),
    format: text("format"),
    durationSeconds: integer("duration_seconds"),
    storagePath: text("storage_path"),
    thumbnailPath: text("thumbnail_path"),
    source: text("source"),
    versionLabel: text("version_label"),
    reviewStatus: assetReviewStatusEnum("review_status").default("pending").notNull(),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    campaignIndex: index("assets_campaign_idx").on(table.campaignId),
  }),
);
