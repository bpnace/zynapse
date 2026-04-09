import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { brandProfiles } from "@/lib/db/schema/brand-profiles";
import { memberships } from "@/lib/db/schema/memberships";
import { organizations } from "@/lib/db/schema/organizations";

export async function getWorkspaceBootstrap(userId: string) {
  const db = getDb();

  const membership = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, userId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!membership) {
    return null;
  }

  const organization = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, membership.organizationId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!organization) {
    return null;
  }

  const brandProfile = await db
    .select()
    .from(brandProfiles)
    .where(eq(brandProfiles.organizationId, membership.organizationId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  return {
    membership,
    organization,
    brandProfile,
  };
}
