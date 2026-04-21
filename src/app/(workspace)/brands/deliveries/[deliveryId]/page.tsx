import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type BrandDeliveryDetailPageProps = {
  params: Promise<{
    deliveryId: string;
  }>;
};

export default async function BrandDeliveryDetailPage({
  params,
}: BrandDeliveryDetailPageProps) {
  const { deliveryId } = await params;

  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Delivery Detail"
      title={`Delivery pack ${deliveryId} now resolves cleanly.`}
      description="Delivery pack detail routes are now scaffolded so future pack projections and download views do not 404 when linked from the refreshed workspace."
      checkpoints={[
        "Phase 2 delivery pack v1 can be implemented on this route.",
      ]}
      ctaHref={brandsWorkspaceRoutes.deliveries.index()}
      ctaLabel="Back to deliveries"
    />
  );
}
