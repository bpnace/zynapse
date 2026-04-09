"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { brandProfiles } from "@/lib/db/schema/brand-profiles";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
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
        message: "Please complete the required fields before saving this step.",
        fieldErrors,
      };
    }
  }

  const db = getDb();
  const safeData = parsed.success ? parsed.data : input;
  const values = {
    website: safeData.website,
    offerSummary: safeData.offerSummary,
    targetAudience: safeData.targetAudience,
    primaryChannels: safeData.primaryChannels,
    brandTone: safeData.brandTone,
    reviewNotes: safeData.reviewNotes,
    claimGuardrails: safeData.claimGuardrails,
    updatedAt: new Date(),
  };

  const existingProfile = await db
    .select()
    .from(brandProfiles)
    .where(eq(brandProfiles.organizationId, bootstrap.organization.id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (existingProfile) {
    await db
      .update(brandProfiles)
      .set(values)
      .where(eq(brandProfiles.organizationId, bootstrap.organization.id));
  } else {
    await db.insert(brandProfiles).values({
      organizationId: bootstrap.organization.id,
      ...values,
    });
  }

  revalidatePath("/workspace");
  revalidatePath("/workspace/onboarding");

  return {
    success: true,
    message: "Draft saved.",
    completion: getBrandProfileCompletion(values),
  };
}
