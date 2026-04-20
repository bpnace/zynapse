import { OnboardingFlow } from "@/components/workspace/onboarding/onboarding-flow";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getBrandProfileCompletion } from "@/lib/workspace/profile-completion";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const bootstrap = await requireWorkspaceAccess();
  const profile = bootstrap.brandProfile;

  return (
    <OnboardingFlow
      organizationName={bootstrap.organization.name}
      demo={bootstrap.demo}
      initialValues={{
        website: profile?.website ?? "",
        offerSummary: profile?.offerSummary ?? "",
        targetAudience: profile?.targetAudience ?? "",
        primaryChannels: profile?.primaryChannels ?? "",
        brandTone: profile?.brandTone ?? "",
        reviewNotes: profile?.reviewNotes ?? "",
        claimGuardrails: profile?.claimGuardrails ?? "",
      }}
      initialCompletion={getBrandProfileCompletion(profile)}
    />
  );
}
