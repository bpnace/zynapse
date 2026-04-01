import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { assets } from "@/lib/db/schema/assets";

export const reviewThreads = pgTable(
  "review_threads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    createdBy: text("created_by").notNull(),
    anchorJson: text("anchor_json"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => ({
    assetIndex: index("review_threads_asset_idx").on(table.assetId),
  }),
);
