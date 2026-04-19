import { AssetGrid } from "@/components/workspace/dashboard/asset-grid";
import { CampaignSummary } from "@/components/workspace/dashboard/campaign-summary";
import { DashboardOverview } from "@/components/workspace/dashboard/dashboard-overview";
import { NextActionCard } from "@/components/workspace/dashboard/next-action-card";
import { OverviewTopBar } from "@/components/workspace/dashboard/overview-topbar";
import { PreparedBlocks } from "@/components/workspace/dashboard/prepared-blocks";
import { ReviewThreadsPreview } from "@/components/workspace/dashboard/review-threads-preview";
import { StageTracker } from "@/components/workspace/dashboard/stage-tracker";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getDashboardView } from "@/lib/workspace/queries/get-dashboard-view";
import { getBrandProfileCompletion } from "@/lib/workspace/profile-completion";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const bootstrap = await requireWorkspaceAccess();
  const dashboard = await getDashboardView(bootstrap.organization.id);
  const approvedAssetCount = dashboard.latestAssets.filter(
    (asset) => asset.reviewStatus === "approved",
  ).length;
  const onboardingCompletion = getBrandProfileCompletion(bootstrap.brandProfile);

  return (
    <div className="grid gap-4">
      <OverviewTopBar
        organizationName={bootstrap.organization.name}
        campaignId={dashboard.latestCampaign?.id ?? null}
        campaignName={dashboard.latestCampaign?.name ?? null}
        currentStage={dashboard.latestCampaign?.currentStage ?? null}
        openReviewCount={dashboard.reviewThreadCount}
        approvedAssetCount={approvedAssetCount}
      />
      <DashboardOverview
        organizationName={bootstrap.organization.name}
        audience={dashboard.profile?.targetAudience ?? null}
        primaryChannels={dashboard.profile?.primaryChannels ?? null}
        openReviewCount={dashboard.reviewThreadCount}
        approvedAssetCount={approvedAssetCount}
        onboardingCompletion={onboardingCompletion}
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        <div className="grid gap-4">
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
          <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
            <AssetGrid assets={dashboard.latestAssets} />
            <ReviewThreadsPreview threads={dashboard.reviewThreads} />
          </div>
        </div>

        <div className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
          <StageTracker
            stages={dashboard.stageItems.map((stage) => ({
              key: stage.stageKey,
              status: stage.status,
            }))}
            currentStage={dashboard.latestCampaign?.currentStage ?? null}
          />
          <NextActionCard
            campaignId={dashboard.latestCampaign?.id ?? null}
            briefHref="/workspace/briefs/new"
            title={dashboard.template?.nextAction.title ?? "Bereit für die Freigabe"}
            body={
              dashboard.template?.nextAction.body ??
              "Der geschützte Bereich ist bereit für die nächste Freigaberunde."
            }
          />
        </div>
      </div>
    </div>
  );
}
