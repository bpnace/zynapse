import { notFound } from "next/navigation";
import { HandoverCenter } from "@/components/workspace/handover/handover-center";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getHandoverView } from "@/lib/workspace/queries/get-handover-view";

export const dynamic = "force-dynamic";

type HandoverPageProps = {
  params: Promise<{ campaignId: string }>;
};

export default async function HandoverPage({ params }: HandoverPageProps) {
  const bootstrap = await requireWorkspaceAccess();
  const { campaignId } = await params;

  const handover = await getHandoverView({
    organizationId: bootstrap.organization.id,
    campaignId,
  });

  if (!handover) {
    notFound();
  }

  return (
    <HandoverCenter
      campaign={handover.campaign}
      stageItems={handover.stageItems}
      approvedAssets={handover.approvedAssets}
      groupedAssets={handover.groupedAssets}
      usageSummary={handover.usageSummary}
      campaignNotes={handover.campaignNotes}
      nextStep={handover.nextStep}
    />
  );
}
