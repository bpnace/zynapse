import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";

export default function CreativeHomePage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Home"
      title="Creative home is scaffolded for the new workspace."
      description="This route will become the summary layer for readiness, invitations, revisions, and active assignments while the current task board remains the working surface."
      checkpoints={[
        "Snapshot of workload, revisions, and readiness.",
        "Keeps task execution separate from overview context.",
      ]}
      ctaHref={creativeWorkspaceRoutes.tasks()}
      ctaLabel="Open current task board"
    />
  );
}
