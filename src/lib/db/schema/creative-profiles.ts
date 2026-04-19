import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import {
  createdAtColumn,
  creativeAvailabilityStatusEnum,
} from "@/lib/db/schema/shared";

export const creativeProfiles = pgTable(
  "creative_profiles",
  {
    userId: uuid("user_id").primaryKey().notNull(),
    slug: text("slug").notNull(),
    displayName: text("display_name").notNull(),
    headline: text("headline"),
    bio: text("bio"),
    portfolioUrl: text("portfolio_url"),
    specialtiesJson: text("specialties_json"),
    toolsJson: text("tools_json"),
    industryFitJson: text("industry_fit_json"),
    availabilityStatus: creativeAvailabilityStatusEnum("availability_status")
      .default("available")
      .notNull(),
    capacityNotes: text("capacity_notes"),
    hourlyRate: integer("hourly_rate"),
    dayRate: integer("day_rate"),
    packageRate: integer("package_rate"),
    qualityScore: integer("quality_score"),
    createdAt: createdAtColumn(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugUniqueIndex: uniqueIndex("creative_profiles_slug_unique").on(table.slug),
    availabilityIndex: index("creative_profiles_availability_idx").on(table.availabilityStatus),
  }),
);
