"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import {
  assertSupabaseResult,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import {
  workspaceOnboardingSchema,
  type WorkspaceOnboardingField,
  type WorkspaceOnboardingInput,
} from "@/lib/validation/workspace-onboarding";
import { getBrandProfileCompletion } from "@/lib/workspace/profile-completion";

type SaveBrandProfileResult =
  | {
      success: true;
      message: string;
      completion: ReturnType<typeof getBrandProfileCompletion>;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Partial<Record<keyof WorkspaceOnboardingInput, string>>;
    };

export async function saveBrandProfileDraft(
  input: WorkspaceOnboardingInput,
  requiredFields: WorkspaceOnboardingField[],
): Promise<SaveBrandProfileResult> {
  const bootstrap = await requireWorkspaceAccess();
  const capability = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (!capability.canEditBrandProfile) {
    return {
      success: false,
      message: bootstrap.demo.isDemoWorkspace
        ? bootstrap.demo.mutationMessage
        : "Nur Workspace-Admins können das Brand-Profil bearbeiten.",
    };
  }

  const parsed = workspaceOnboardingSchema.safeParse(input);

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    const fieldErrors = {
      website: flattened.website?.[0],
      offerSummary: flattened.offerSummary?.[0],
      targetAudience: flattened.targetAudience?.[0],
      primaryChannels: flattened.primaryChannels?.[0],
      brandTone: flattened.brandTone?.[0],
      reviewNotes: flattened.reviewNotes?.[0],
      claimGuardrails: flattened.claimGuardrails?.[0],
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

  const supabase = requireServiceRoleClient();
  const safeData = parsed.success ? parsed.data : input;
  const values = {
    website: safeData.website,
    offer_summary: safeData.offerSummary,
    target_audience: safeData.targetAudience,
    primary_channels: safeData.primaryChannels,
    brand_tone: safeData.brandTone,
    review_notes: safeData.reviewNotes,
    claim_guardrails: safeData.claimGuardrails,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("brand_profiles").upsert({
    organization_id: bootstrap.organization.id,
    ...values,
  });

  assertSupabaseResult(error, "Failed to save brand profile draft");

  revalidatePath("/workspace");
  revalidatePath("/workspace/onboarding");

  return {
    success: true,
    message: "Entwurf gespeichert.",
    completion: getBrandProfileCompletion(values),
  };
}
