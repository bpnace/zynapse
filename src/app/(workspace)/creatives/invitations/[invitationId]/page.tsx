import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";

type CreativeInvitationDetailPageProps = {
  params: Promise<{
    invitationId: string;
  }>;
};

export default async function CreativeInvitationDetailPage({
  params,
}: CreativeInvitationDetailPageProps) {
  const { invitationId } = await params;

  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Invitation Detail"
      title={`Invitation ${invitationId} now has a canonical detail route.`}
      description="Accept/decline/question flows can now be built on top of a stable route without revisiting the shell wiring later."
      checkpoints={[
        "Future accept, decline, and question actions belong here.",
      ]}
      ctaHref={creativeWorkspaceRoutes.invitations.index()}
      ctaLabel="Back to invitations"
    />
  );
}
