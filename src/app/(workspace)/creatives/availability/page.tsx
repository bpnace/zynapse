import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";

export default function CreativeAvailabilityPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Availability"
      title="Availability is scaffolded in the creative shell."
      description="This route holds the future capacity and timing controls that support matching and assignment decisions."
      checkpoints={[
        "Current capacity and availability windows.",
        "Future intake guardrails for assignment routing.",
      ]}
    />
  );
}
