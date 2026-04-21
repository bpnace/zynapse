import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export default function BrandReviewsPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Reviews"
      title="Review navigation now points to a dedicated brand route."
      description="Brands can keep using the current campaign review rooms while this new route anchors the long-term reviews queue inside the refreshed workspace IA."
      checkpoints={[
        "Dedicated queue entry for approvals and change requests.",
        "Bridge current review rooms without exposing ops mechanics.",
      ]}
      ctaHref={brandsWorkspaceRoutes.home()}
    />
  );
}
