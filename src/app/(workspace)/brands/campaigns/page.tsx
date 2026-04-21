import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export default function BrandCampaignsIndexPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Campaigns"
      title="Campaign navigation is in place for the new brand workspace."
      description="This route becomes the campaign index for the brand-facing workspace while the current campaign detail, review, and handover flows continue to power the active delivery path."
      checkpoints={[
        "Campaign list and archive entry point.",
        "Bridge the current delivery flow into the new workspace IA.",
        "Keep room for setup approval and next-iteration views.",
      ]}
      ctaHref={brandsWorkspaceRoutes.home()}
    />
  );
}
