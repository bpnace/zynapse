import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { briefs } from "@/lib/db/schema/briefs";
import { parseBriefReferences } from "@/lib/workspace/briefs/form-helpers";

export async function getBriefsList(organizationId: string) {
  const db = getDb();

  return db
    .select()
    .from(briefs)
    .where(eq(briefs.organizationId, organizationId))
    .orderBy(desc(briefs.startedAt));
}

export async function getBriefView(organizationId: string, briefId: string) {
  const db = getDb();

  const brief = await db
    .select()
    .from(briefs)
    .where(eq(briefs.id, briefId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!brief || brief.organizationId !== organizationId) {
    return null;
  }

  const references = parseBriefReferences(brief.referencesJson);

  return {
    brief,
    values: {
      title: brief.title,
      objective: brief.objective,
      offer: brief.offer,
      audience: brief.audience,
      channels: brief.channels,
      hooks: references.hooks,
      creativeReferences: references.creativeReferences,
      budgetRange: brief.budgetRange,
      timeline: brief.timeline,
      approvalNotes: brief.approvalNotes,
    },
  };
}
