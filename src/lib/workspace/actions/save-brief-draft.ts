"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import {
  assertSupabaseResult,
  mapBrief,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
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
  const capability = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (!capability.canCreateBriefs) {
    return {
      success: false,
      message: bootstrap.demo.isDemoWorkspace
        ? bootstrap.demo.mutationMessage
        : "Nur Workspace-Admins können Briefings erstellen oder bearbeiten.",
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
  const supabase = requireServiceRoleClient();

  if (briefId) {
    const { data: existingRow, error: existingError } = await supabase
      .from("briefs")
      .select("*")
      .eq("id", briefId)
      .limit(1)
      .maybeSingle();

    assertSupabaseResult(existingError, "Failed to load brief draft");

    const existing = existingRow ? mapBrief(existingRow) : null;

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

    const { error: updateError } = await supabase
      .from("briefs")
      .update({
        title: data.title,
        objective: data.objective,
        offer: data.offer,
        audience: data.audience,
        channels: data.channels,
        references_json: serializeBriefReferences(data),
        budget_range: data.budgetRange,
        timeline: data.timeline,
        approval_notes: data.approvalNotes,
      })
      .eq("id", briefId);

    assertSupabaseResult(updateError, "Failed to update brief draft");

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

  const { data: createdRow, error: createError } = await supabase
    .from("briefs")
    .insert({
      organization_id: bootstrap.organization.id,
      created_by: bootstrap.membership.userId,
      title: data.title,
      objective: data.objective,
      offer: data.offer,
      audience: data.audience,
      channels: data.channels,
      references_json: serializeBriefReferences(data),
      budget_range: data.budgetRange,
      timeline: data.timeline,
      approval_notes: data.approvalNotes,
    })
    .select("*")
    .single();

  assertSupabaseResult(createError, "Failed to create brief draft");

  if (!createdRow) {
    throw new Error("Failed to create brief draft: missing inserted row.");
  }

  const created = mapBrief(createdRow);

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
