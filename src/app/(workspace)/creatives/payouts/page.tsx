import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";

export default function CreativePayoutsPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Payouts"
      title="Payout visibility is scaffolded for the creative workspace."
      description="This route reserves space for payout state, compensation visibility, and future settlement details without overloading the task execution screens."
      checkpoints={[
        "Payout summary and status visibility.",
      ]}
    />
  );
}
