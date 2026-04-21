import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";

export default function CreativeInvitationsPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Invitations"
      title="Invitation handling now has a dedicated route."
      description="The refreshed creative shell can now point to a stable invitation queue before accept/decline/question flows are implemented in the next phase."
      checkpoints={[
        "Future queue for pending invitations.",
        "Room for accept, decline, and clarification actions.",
      ]}
      ctaHref={creativeWorkspaceRoutes.tasks()}
      ctaLabel="Open current tasks"
    />
  );
}
