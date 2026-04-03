"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { briefs } from "@/lib/db/schema/briefs";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { workspaceCapabilities } from "@/lib/auth/roles";
import { serializeBriefReferences } from "@/lib/workspace/briefs/form-helpers";
import {
  workspaceBriefSchema,
  type WorkspaceBriefField,
  type WorkspaceBriefInput,
} from "@/lib/validation/workspace-brief";

type SaveBriefResult =
  | {
      success: true;
      message: string;
      briefId: string;
      status: "draft";
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Partial<Record<WorkspaceBriefField, string>>;
    };

export async function saveBriefDraft(
  input: WorkspaceBriefInput,
  requiredFields: WorkspaceBriefField[],
  briefId?: string | null,
): Promise<SaveBriefResult> {
  const bootstrap = await requireWorkspaceAccess();
  const capability = workspaceCapabilities[bootstrap.membership.role];

  if (!capability.canCreateBriefs) {
    return {
      success: false,
      message: "Nur Workspace-Admins können Briefings erstellen oder bearbeiten.",
    };
  }

  const parsed = workspaceBriefSchema.safeParse(input);

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const fieldErrors = {
      title: flattened.title?.[0],
      objective: flattened.objective?.[0],
      offer: flattened.offer?.[0],
      audience: flattened.audience?.[0],
      channels: flattened.channels?.[0],
      hooks: flattened.hooks?.[0],
      creativeReferences: flattened.creativeReferences?.[0],
      budgetRange: flattened.budgetRange?.[0],
      timeline: flattened.timeline?.[0],
      approvalNotes: flattened.approvalNotes?.[0],
    };
    const hasBlockingError = requiredFields.some((field) => fieldErrors[field]);

    if (hasBlockingError) {
      return {
        success: false,
        message: "Bitte fülle die Pflichtfelder aus, bevor du diesen Schritt speicherst.",
        fieldErrors,
      };
    }
  }

  const data = parsed.success ? parsed.data : input;
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
        message: "Eingereichte Briefings sind schreibgeschützt.",
      };
    }

    await db
      .update(briefs)
      .set({
        title: data.title,
        objective: data.objective,
        offer: data.offer,
        audience: data.audience,
        channels: data.channels,
        referencesJson: serializeBriefReferences(data),
        budgetRange: data.budgetRange,
        timeline: data.timeline,
        approvalNotes: data.approvalNotes,
      })
      .where(eq(briefs.id, briefId));

    revalidatePath("/workspace");
    revalidatePath("/workspace/briefs/new");
    revalidatePath(`/workspace/briefs/${briefId}`);

    return {
      success: true,
      message: "Entwurf gespeichert.",
      briefId,
      status: "draft",
    };
  }

  const [created] = await db
    .insert(briefs)
    .values({
      organizationId: bootstrap.organization.id,
      createdBy: bootstrap.membership.userId,
      title: data.title,
      objective: data.objective,
      offer: data.offer,
      audience: data.audience,
      channels: data.channels,
      referencesJson: serializeBriefReferences(data),
      budgetRange: data.budgetRange,
      timeline: data.timeline,
      approvalNotes: data.approvalNotes,
    })
    .returning();

  revalidatePath("/workspace");
  revalidatePath("/workspace/briefs/new");
  revalidatePath(`/workspace/briefs/${created.id}`);

  return {
    success: true,
    message: "Entwurf gespeichert.",
    briefId: created.id,
    status: "draft",
  };
}
