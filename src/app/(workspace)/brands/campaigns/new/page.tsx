import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export default function BrandNewCampaignPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / New Campaign"
      title="The new campaign entry point is scaffolded."
      description="Phase 1 establishes the route, shell, and navigation target so the future builder can drop into a stable brand-facing path without reworking the workspace chrome."
      checkpoints={[
        "Dedicated route for the future request builder.",
        "Stable entry in the shell navigation.",
        "Ready for section-by-section validation in Phase 2.",
      ]}
      ctaHref={brandsWorkspaceRoutes.campaigns.index()}
      ctaLabel="Open campaign overview"
    />
  );
}
