import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { adminWorkspaceRoutes } from "@/lib/workspace/routes";

export default function AdminSetupsPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Admin / Setups"
      title="Setup proposals are scaffolded and ready for the next slice."
      description="This queue will hold setup reviews, approval staging, and pre-production routing once the Phase 2 campaign builder and proposal projections land."
      checkpoints={[
        "Review setup proposals before they reach brands.",
        "Track readiness, blockers, and escalation conditions.",
        "Keep approval history visible to internal operators.",
      ]}
      ctaHref={adminWorkspaceRoutes.requests()}
    />
  );
}
