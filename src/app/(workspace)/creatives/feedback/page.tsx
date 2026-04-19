import { CreativeFeedbackList } from "@/components/workspace/creative/creative-feedback-list";
import { requireCreativeWorkspaceAccess } from "@/lib/auth/guards";
import { getCreativeFeedbackView } from "@/lib/workspace/queries/get-creative-feedback-view";

export const dynamic = "force-dynamic";

export default async function CreativeFeedbackPage() {
  const bootstrap = await requireCreativeWorkspaceAccess();
  const view = await getCreativeFeedbackView({
    organizationId: bootstrap.organization.id,
    userId: bootstrap.membership.userId,
  });

  return <CreativeFeedbackList revisions={view.revisions} />;
}
