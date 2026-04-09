import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { organizations } from "@/lib/db/schema/organizations";
import { createdAtColumn } from "@/lib/db/schema/shared";

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    briefId: uuid("brief_id"),
    name: text("name").notNull(),
    currentStage: text("current_stage").notNull(),
    packageTier: text("package_tier").notNull(),
    seededTemplateKey: text("seeded_template_key"),
    campaignGoal: text("campaign_goal"),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    organizationIndex: index("campaigns_organization_idx").on(table.organizationId),
  }),
);
