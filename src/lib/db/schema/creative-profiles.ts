import { text, uniqueIndex, uuid, pgTable } from "drizzle-orm/pg-core";
import { createdAtColumn } from "@/lib/db/schema/shared";

export const creativeProfiles = pgTable(
  "creative_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    slug: text("slug").notNull(),
    displayName: text("display_name").notNull(),
    headline: text("headline"),
    bio: text("bio"),
    specialties: text("specialties"),
    portfolioUrl: text("portfolio_url"),
    availabilityStatus: text("availability_status").default("available").notNull(),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    userUniqueIndex: uniqueIndex("creative_profiles_user_unique").on(table.userId),
    slugUniqueIndex: uniqueIndex("creative_profiles_slug_unique").on(table.slug),
  }),
);
