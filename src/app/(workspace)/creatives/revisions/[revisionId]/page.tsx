import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";

type CreativeRevisionDetailPageProps = {
  params: Promise<{
    revisionId: string;
  }>;
};

export default async function CreativeRevisionDetailPage({
  params,
}: CreativeRevisionDetailPageProps) {
  const { revisionId } = await params;

  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Revision Detail"
      title={`Revision ${revisionId} now resolves to a dedicated route.`}
      description="Revision detail deep links are now protected and stable so structured change requests can land cleanly in the next implementation slice."
      checkpoints={[
        "Phase 3 revision detail and resolution flows belong here.",
      ]}
      ctaHref={creativeWorkspaceRoutes.revisions.index()}
      ctaLabel="Back to revisions"
    />
  );
}
