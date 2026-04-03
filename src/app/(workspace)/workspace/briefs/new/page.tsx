import { BriefFlow } from "@/components/workspace/briefs/brief-flow";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { createEmptyBriefInput } from "@/lib/workspace/briefs/form-helpers";
import { getBriefsList } from "@/lib/workspace/queries/get-brief-view";

export const dynamic = "force-dynamic";

export default async function NewBriefPage() {
  const bootstrap = await requireWorkspaceAccess();
  const recentBriefs = await getBriefsList(bootstrap.organization.id);

  return (
    <BriefFlow
      initialValues={createEmptyBriefInput()}
      recentBriefs={recentBriefs.map((brief) => ({
        id: brief.id,
        title: brief.title,
        status: brief.status,
        startedAt: brief.startedAt,
      }))}
    />
  );
}
