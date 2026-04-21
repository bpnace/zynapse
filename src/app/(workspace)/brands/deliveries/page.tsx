import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export default function BrandDeliveriesPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Deliveries"
      title="Delivery packs now have a dedicated brand-facing route."
      description="The route is in place for approved outputs, delivery summaries, and next-iteration handoff once the delivery pack read model lands."
      checkpoints={[
        "Delivery-pack overview entry point.",
        "Stable shell navigation target.",
        "Keeps the handover experience brand-facing and calm.",
      ]}
      ctaHref={brandsWorkspaceRoutes.home()}
    />
  );
}
