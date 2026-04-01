import { AssetGrid } from "@/components/workspace/dashboard/asset-grid";
import { CampaignSummary } from "@/components/workspace/dashboard/campaign-summary";
import { DashboardOverview } from "@/components/workspace/dashboard/dashboard-overview";
import { NextActionCard } from "@/components/workspace/dashboard/next-action-card";
import { PreparedBlocks } from "@/components/workspace/dashboard/prepared-blocks";
import { ReviewThreadsPreview } from "@/components/workspace/dashboard/review-threads-preview";
import { StageTracker } from "@/components/workspace/dashboard/stage-tracker";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getDashboardView } from "@/lib/workspace/queries/get-dashboard-view";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const bootstrap = await requireWorkspaceAccess();
  const dashboard = await getDashboardView(bootstrap.organization.id);

  return (
    <div className="grid gap-6">
      <DashboardOverview
        organizationName={bootstrap.organization.name}
        audience={dashboard.profile?.targetAudience ?? null}
        primaryChannels={dashboard.profile?.primaryChannels ?? null}
        packageTier={dashboard.latestCampaign?.packageTier ?? null}
        campaignCount={dashboard.campaigns.length}
        assetCount={dashboard.latestAssets.length}
      />
      {dashboard.latestCampaign ? (
        <CampaignSummary
          campaignName={dashboard.latestCampaign.name}
          campaignGoal={dashboard.latestCampaign.campaignGoal ?? ""}
          packageTier={dashboard.latestCampaign.packageTier}
          currentStage={dashboard.latestCampaign.currentStage}
        />
      ) : null}
      {dashboard.template ? (
        <PreparedBlocks
          prepared={dashboard.template.preparedBlocks.prepared}
          review={dashboard.template.preparedBlocks.review}
          output={dashboard.template.preparedBlocks.output}
          nextStep={dashboard.template.preparedBlocks.nextStep}
        />
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <AssetGrid
          assets={dashboard.latestAssets.map((asset) => ({
            id: asset.id,
            title: asset.title,
            assetType: asset.assetType,
            format: asset.format,
            versionLabel: asset.versionLabel,
            reviewStatus: asset.reviewStatus,
          }))}
        />
        <div className="grid gap-6">
          <StageTracker
            stages={dashboard.stageItems.map((stage) => ({
              key: stage.stageKey,
              status: stage.status,
            }))}
            currentStage={dashboard.latestCampaign?.currentStage ?? null}
          />
          <NextActionCard
            title={dashboard.template?.nextAction.title ?? "Workspace ready"}
            body={
              dashboard.template?.nextAction.body ??
              "The workspace is ready for the next review pass."
            }
          />
        </div>
      </div>
      <ReviewThreadsPreview threads={dashboard.reviewThreads} />
    </div>
  );
}
