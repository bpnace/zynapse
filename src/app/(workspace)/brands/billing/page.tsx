import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";

export default function BrandBillingPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Billing"
      title="Billing is wired into the refreshed brand shell."
      description="The route exists now so commercial readiness, pilots, and package visibility can move into a dedicated brand-facing surface in a later phase."
      checkpoints={[
        "Future home for billing, package state, and pilot conversion context.",
      ]}
    />
  );
}
