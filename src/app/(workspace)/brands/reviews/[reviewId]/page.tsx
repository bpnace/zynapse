import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type BrandReviewDetailPageProps = {
  params: Promise<{
    reviewId: string;
  }>;
};

export default async function BrandReviewDetailPage({
  params,
}: BrandReviewDetailPageProps) {
  const { reviewId } = await params;

  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Review Detail"
      title={`Review ${reviewId} now has a dedicated protected route.`}
      description="The queue-level review route can now safely deepen into per-review screens without changing the workspace navigation contract."
      checkpoints={[
        "Phase 2 review-room improvements can land here.",
      ]}
      ctaHref={brandsWorkspaceRoutes.reviews.index()}
      ctaLabel="Back to reviews"
    />
  );
}
