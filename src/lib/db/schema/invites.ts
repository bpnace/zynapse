import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { organizations } from "@/lib/db/schema/organizations";
import { workspaceRoleEnum } from "@/lib/db/schema/shared";

export const invites = pgTable(
  "invites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: workspaceRoleEnum("role").notNull(),
    seedTemplateKey: text("seed_template_key").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  },
  (table) => ({
    orgEmailUniqueIndex: uniqueIndex("invites_org_email_unique").on(
      table.organizationId,
      table.email,
    ),
    emailIndex: index("invites_email_idx").on(table.email),
  }),
);
