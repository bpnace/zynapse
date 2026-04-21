import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export default function BrandProfilePage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Profile"
      title="Brand profile is now a first-class route."
      description="The shell-level settings entry now lands on a dedicated brand profile route while the existing onboarding flow continues to power the current brand-context form."
      checkpoints={[
        "Future home for profile, approvals, and legal context.",
        "Bridge from onboarding to persistent workspace settings.",
      ]}
      ctaHref={brandsWorkspaceRoutes.onboarding()}
      ctaLabel="Open current brand setup"
    />
  );
}
