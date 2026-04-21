import { AssetGrid } from "@/components/workspace/dashboard/asset-grid";
import { CampaignSummary } from "@/components/workspace/dashboard/campaign-summary";
import { NextActionCard } from "@/components/workspace/dashboard/next-action-card";
import { OverviewTopBar } from "@/components/workspace/dashboard/overview-topbar";
import { ReviewThreadsPreview } from "@/components/workspace/dashboard/review-threads-preview";
import { StageTracker } from "@/components/workspace/dashboard/stage-tracker";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getDashboardView } from "@/lib/workspace/queries/get-dashboard-view";
import { getBrandProfileCompletion } from "@/lib/workspace/profile-completion";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const bootstrap = await requireWorkspaceAccess();
  const dashboard = await getDashboardView(bootstrap.organization.id);
  const readiness = getBrandWorkspaceReadiness({
    stageItems: dashboard.stageItems,
    latestAssets: dashboard.latestAssets,
    openReviewCount: dashboard.reviewThreadCount,
    workflowState: dashboard.latestCampaignWorkflow,
  });
  const onboardingCompletion = getBrandProfileCompletion(bootstrap.brandProfile);

  return (
    <div className="workspace-page-stack">
      <OverviewTopBar
        organizationName={bootstrap.organization.name}
        campaignId={dashboard.latestCampaign?.id ?? null}
        campaignName={dashboard.latestCampaign?.name ?? null}
        currentStage={dashboard.latestCampaign?.currentStage ?? null}
        openReviewCount={readiness.openReviewCount}
        approvedAssetCount={readiness.approvedAssetCount}
        demo={bootstrap.demo}
      />
      <div className="workspace-story-grid">
        <div className="grid gap-4">
          {dashboard.latestCampaign ? (
            <CampaignSummary
              campaignName={dashboard.latestCampaign.name}
              campaignGoal={dashboard.latestCampaign.campaignGoal ?? ""}
              packageTier={dashboard.latestCampaign.packageTier}
              currentStage={dashboard.latestCampaign.currentStage}
              audience={dashboard.profile?.targetAudience ?? null}
              primaryChannels={dashboard.profile?.primaryChannels ?? null}
              openReviewCount={readiness.openReviewCount}
              approvedAssetCount={readiness.approvedAssetCount}
            />
          ) : null}
          <ReviewThreadsPreview threads={dashboard.reviewThreads} />
          <AssetGrid assets={dashboard.latestAssets} />
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
            briefHref={brandsWorkspaceRoutes.briefs.new()}
            title={dashboard.template?.nextAction.title ?? "Bereit für die Freigabe"}
            body={
              dashboard.template?.nextAction.body ??
              "Der geschützte Bereich ist bereit für die nächste Freigaberunde."
            }
            onboardingCompletion={onboardingCompletion}
          />
        </div>
      </div>
    </div>
  );
}
