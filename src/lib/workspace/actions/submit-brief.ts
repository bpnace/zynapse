"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { workspaceCapabilities } from "@/lib/auth/roles";
import {
  assertSupabaseResult,
  mapBrief,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
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
  const capability =
    workspaceCapabilities[
      bootstrap.membership.role as keyof typeof workspaceCapabilities
    ];

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

  const supabase = requireServiceRoleClient();

  if (briefId) {
    const { data: existingRow, error: existingError } = await supabase
      .from("briefs")
      .select("*")
      .eq("id", briefId)
      .limit(1)
      .maybeSingle();

    assertSupabaseResult(existingError, "Failed to load submitted brief");

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
        message: "Dieses Briefing wurde bereits eingereicht.",
      };
    }

    const { error: updateError } = await supabase
      .from("briefs")
      .update({
        title: parsed.data.title,
        objective: parsed.data.objective,
        offer: parsed.data.offer,
        audience: parsed.data.audience,
        channels: parsed.data.channels,
        references_json: serializeBriefReferences(parsed.data),
        budget_range: parsed.data.budgetRange,
        timeline: parsed.data.timeline,
        approval_notes: parsed.data.approvalNotes,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", briefId);

    assertSupabaseResult(updateError, "Failed to submit brief");

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

  const { data: createdRow, error: createError } = await supabase
    .from("briefs")
    .insert({
      organization_id: bootstrap.organization.id,
      created_by: bootstrap.membership.userId,
      title: parsed.data.title,
      objective: parsed.data.objective,
      offer: parsed.data.offer,
      audience: parsed.data.audience,
      channels: parsed.data.channels,
      references_json: serializeBriefReferences(parsed.data),
      budget_range: parsed.data.budgetRange,
      timeline: parsed.data.timeline,
      approval_notes: parsed.data.approvalNotes,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  assertSupabaseResult(createError, "Failed to create submitted brief");

  if (!createdRow) {
    throw new Error("Failed to create submitted brief: missing inserted row.");
  }

  const created = mapBrief(createdRow);

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
