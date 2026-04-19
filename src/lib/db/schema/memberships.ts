import { pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { organizations } from "@/lib/db/schema/organizations";
import {
  membershipStatusEnum,
  workspaceRoleEnum,
  workspaceTypeEnum,
} from "@/lib/db/schema/shared";

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    // Supabase owns auth.users. Keep the user_id typed here without generating auth-schema migrations.
    userId: uuid("user_id").notNull(),
    role: workspaceRoleEnum("role").notNull(),
    workspaceType: workspaceTypeEnum("workspace_type").default("brand").notNull(),
    membershipStatus: membershipStatusEnum("membership_status")
      .default("active")
      .notNull(),
    invitedBy: uuid("invited_by"),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgUserUniqueIndex: uniqueIndex("memberships_org_user_unique").on(
      table.organizationId,
      table.userId,
    ),
  }),
);
