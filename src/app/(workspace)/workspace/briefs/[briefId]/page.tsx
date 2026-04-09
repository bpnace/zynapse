import { notFound } from "next/navigation";
import { BriefFlow } from "@/components/workspace/briefs/brief-flow";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getBriefView, getBriefsList } from "@/lib/workspace/queries/get-brief-view";

export const dynamic = "force-dynamic";

type BriefPageProps = {
  params: Promise<{ briefId: string }>;
};

export default async function BriefPage({ params }: BriefPageProps) {
  const bootstrap = await requireWorkspaceAccess();
  const { briefId } = await params;

  const [briefView, recentBriefs] = await Promise.all([
    getBriefView(bootstrap.organization.id, briefId),
    getBriefsList(bootstrap.organization.id),
  ]);

  if (!briefView) {
    notFound();
  }

  return (
    <BriefFlow
      briefId={briefView.brief.id}
      status={briefView.brief.status}
      initialValues={briefView.values}
      recentBriefs={recentBriefs.map((brief) => ({
        id: brief.id,
        title: brief.title,
        status: brief.status,
        startedAt: brief.startedAt,
      }))}
    />
  );
}
