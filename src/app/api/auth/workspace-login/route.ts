import { and, eq, gt, ilike, isNotNull, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb, getSql } from "@/lib/db";
import { invites } from "@/lib/db/schema/invites";
import { memberships } from "@/lib/db/schema/memberships";

const workspaceLoginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
});

export async function POST(request: Request) {
  try {
    const payload = workspaceLoginSchema.parse(await request.json());
    const db = getDb();
    const sql = getSql();

    const existingUser = await sql<{ id: string }[]>`
      select id
      from auth.users
      where lower(email) = lower(${payload.email})
      limit 1
    `.then((rows) => rows[0] ?? null);

    const existingMembership = existingUser
      ? await db
          .select({ id: memberships.id })
          .from(memberships)
          .where(eq(memberships.userId, existingUser.id))
          .limit(1)
          .then((rows) => rows[0] ?? null)
      : null;

    const invite = await db
      .select({ id: invites.id })
      .from(invites)
      .where(
        and(
          ilike(invites.email, payload.email),
          or(
            isNotNull(invites.acceptedAt),
            gt(invites.expiresAt, new Date()),
          ),
        ),
      )
      .limit(1)
      .then((rows) => rows[0] ?? null);

    if (!invite && !existingMembership) {
      return NextResponse.json(
        {
          error:
            "Diese E-Mail hat noch keinen Workspace-Zugang. Nutze bitte eine eingeladene E-Mail-Adresse oder die Waitlist.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Der Login konnte gerade nicht vorbereitet werden." },
      { status: 400 },
    );
  }
}
