import { and, eq, gt, isNull } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";
import { getDb } from "@/lib/db";
import { invites } from "@/lib/db/schema/invites";
import { memberships } from "@/lib/db/schema/memberships";

export async function ensureMembershipForCurrentUser(user: User) {
  const db = getDb();

  const existingMembership = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, user.id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (existingMembership) {
    return existingMembership;
  }

  const email = user.email;

  if (!email) {
    return null;
  }

  return db.transaction(async (tx) => {
    const transactionMembership = await tx
      .select()
      .from(memberships)
      .where(eq(memberships.userId, user.id))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    if (transactionMembership) {
      return transactionMembership;
    }

    const activeInvite = await tx
      .select()
      .from(invites)
      .where(
        and(
          eq(invites.email, email),
          isNull(invites.acceptedAt),
          gt(invites.expiresAt, new Date()),
        ),
      )
      .limit(1)
      .then((rows) => rows[0] ?? null);

    if (!activeInvite) {
      return null;
    }

    const [membership] = await tx
      .insert(memberships)
      .values({
        organizationId: activeInvite.organizationId,
        userId: user.id,
        role: activeInvite.role,
      })
      .onConflictDoNothing({
        target: memberships.userId,
      })
      .returning();

    if (!membership) {
      return tx
        .select()
        .from(memberships)
        .where(eq(memberships.userId, user.id))
        .limit(1)
        .then((rows) => rows[0] ?? null);
    }

    await tx
      .update(invites)
      .set({
        acceptedAt: new Date(),
      })
      .where(eq(invites.id, activeInvite.id));

    return membership;
  });
}
