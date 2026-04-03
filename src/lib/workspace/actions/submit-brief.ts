"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { briefs } from "@/lib/db/schema/briefs";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { workspaceCapabilities } from "@/lib/auth/roles";
import { serializeBriefReferences } from "@/lib/workspace/briefs/form-helpers";
import { workspaceBriefSchema, type WorkspaceBriefInput } from "@/lib/validation/workspace-brief";

type SubmitBriefResult =
  | {
      success: true;
      message: string;
      briefId: string;
      status: "submitted";
    }
  | {
      success: false;
      message: string;
    };

export async function submitBrief(
  input: WorkspaceBriefInput,
  briefId?: string | null,
): Promise<SubmitBriefResult> {
  const bootstrap = await requireWorkspaceAccess();
  const capability = workspaceCapabilities[bootstrap.membership.role];

  if (!capability.canCreateBriefs) {
    return {
      success: false,
      message: "Nur Workspace-Admins können ein Briefing einreichen.",
    };
  }

  const parsed = workspaceBriefSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte vervollständige das Briefing, bevor du es einreichst.",
    };
  }

  const db = getDb();

  if (briefId) {
    const existing = await db
      .select()
      .from(briefs)
      .where(eq(briefs.id, briefId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    if (!existing || existing.organizationId !== bootstrap.organization.id) {
      return {
        success: false,
        message: "Dieses Briefing ist im aktuellen Workspace nicht verfügbar.",
      };
    }

    if (existing.status === "submitted") {
      return {
        success: false,
        message: "Dieses Briefing wurde bereits eingereicht.",
      };
    }

    await db
      .update(briefs)
      .set({
        title: parsed.data.title,
        objective: parsed.data.objective,
        offer: parsed.data.offer,
        audience: parsed.data.audience,
        channels: parsed.data.channels,
        referencesJson: serializeBriefReferences(parsed.data),
        budgetRange: parsed.data.budgetRange,
        timeline: parsed.data.timeline,
        approvalNotes: parsed.data.approvalNotes,
        status: "submitted",
        submittedAt: new Date(),
      })
      .where(eq(briefs.id, briefId));

    revalidatePath("/workspace");
    revalidatePath("/workspace/briefs/new");
    revalidatePath(`/workspace/briefs/${briefId}`);

    return {
      success: true,
      message: "Briefing eingereicht. Das Team kann jetzt mit diesem schreibgeschützten Input arbeiten.",
      briefId,
      status: "submitted",
    };
  }

  const [created] = await db
    .insert(briefs)
    .values({
      organizationId: bootstrap.organization.id,
      createdBy: bootstrap.membership.userId,
      title: parsed.data.title,
      objective: parsed.data.objective,
      offer: parsed.data.offer,
      audience: parsed.data.audience,
      channels: parsed.data.channels,
      referencesJson: serializeBriefReferences(parsed.data),
      budgetRange: parsed.data.budgetRange,
      timeline: parsed.data.timeline,
      approvalNotes: parsed.data.approvalNotes,
      status: "submitted",
      submittedAt: new Date(),
    })
    .returning();

  revalidatePath("/workspace");
  revalidatePath("/workspace/briefs/new");
  revalidatePath(`/workspace/briefs/${created.id}`);

  return {
    success: true,
    message: "Briefing eingereicht. Das Team kann jetzt mit diesem schreibgeschützten Input arbeiten.",
    briefId: created.id,
    status: "submitted",
  };
}
