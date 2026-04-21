import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";

type CreativeTaskDetailPageProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function CreativeTaskDetailPage({
  params,
}: CreativeTaskDetailPageProps) {
  const { taskId } = await params;

  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Task Detail"
      title={`Task ${taskId} is scaffolded for the task-first workspace.`}
      description="This route now exists so task deep links, execution handoffs, and future workbench screens land on a stable protected path instead of 404ing."
      checkpoints={[
        "Task-specific room and workbench will land here in Phase 3.",
        "Route helper deep links are now valid.",
      ]}
      ctaHref={creativeWorkspaceRoutes.tasks()}
      ctaLabel="Back to task queue"
    />
  );
}
