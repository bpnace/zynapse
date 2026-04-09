import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createdAtColumn, organizationStatusEnum } from "@/lib/db/schema/shared";

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    industry: text("industry"),
    status: organizationStatusEnum("status").default("invited").notNull(),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    slugUniqueIndex: uniqueIndex("organizations_slug_unique").on(table.slug),
  }),
);
