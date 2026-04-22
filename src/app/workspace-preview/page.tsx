import { AssetGrid } from "@/components/workspace/dashboard/asset-grid";
import { CampaignSummary } from "@/components/workspace/dashboard/campaign-summary";
import { DashboardOverview } from "@/components/workspace/dashboard/dashboard-overview";
import { NextActionCard } from "@/components/workspace/dashboard/next-action-card";
import { OverviewTopBar } from "@/components/workspace/dashboard/overview-topbar";
import { PreparedBlocks } from "@/components/workspace/dashboard/prepared-blocks";
import { ReviewThreadsPreview } from "@/components/workspace/dashboard/review-threads-preview";
import { StageTracker } from "@/components/workspace/dashboard/stage-tracker";
import { WorkspaceShell } from "@/components/workspace/shell/workspace-shell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Workspace Preview | Zynapse",
  description: "Internal noindex preview route for capturing the buyer workspace screenshot.",
  path: "/workspace-preview",
  indexable: false,
});

const previewCampaignId = "campaign-aurora-launch";

export default function WorkspacePreviewPage() {
  return (
    <WorkspaceShell
      organizationName="Aurelia Foods"
      role="marketing_lead"
      website="aureliafoods.com"
      activeCampaignId={previewCampaignId}
      pathnameOverride="/workspace"
    >
      <div className="grid gap-4">
        <OverviewTopBar
          organizationName="Aurelia Foods"
          campaignId={previewCampaignId}
          campaignName="Spring Protein Launch"
          currentStage="review"
          openReviewCount={3}
          approvedAssetCount={12}
        />
        <DashboardOverview
          organizationName="Aurelia Foods"
          audience="Performance teams in DTC food brands"
          primaryChannels="Meta Ads, TikTok, Instagram Reels"
          campaignCount={3}
          assetCount={12}
          onboardingCompletion={{
            completed: 7,
            total: 8,
            percent: 88,
            isComplete: false,
          }}
        />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
          <div className="grid gap-4">
            <CampaignSummary
              campaignName="Spring Protein Launch"
              campaignGoal="Launch a new protein line with clearer purchase triggers, stronger product proof, and faster hook testing across Meta Ads, TikTok, and Reels."
              packageTier="Growth Flow"
              currentStage="review"
            />
            <PreparedBlocks
              prepared="Zynapse Core turned the brief into three routes: Problem Hook, Product Proof, and Offer Push with clear CTA logic per channel."
              review="Three variants are ready for review, two still need tighter offer framing before they move into the final delivery pack."
              output="12 assets are already grouped by hook, format, and version so the media team can launch without re-sorting files."
              nextStep="Approve Route 2 or leave one clear comment thread so the next creative pass stays focused."
            />
            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
              <AssetGrid
                assets={[
                  {
                    id: "asset-1",
                    title: "Problem Hook — Low energy before lunch",
                    assetType: "video/ad",
                    format: "9:16",
                    versionLabel: "v3",
                    reviewStatus: "approved",
                  },
                  {
                    id: "asset-2",
                    title: "Product Proof — Ingredients close-up",
                    assetType: "video/ad",
                    format: "4:5",
                    versionLabel: "v2",
                    reviewStatus: "changes_requested",
                  },
                  {
                    id: "asset-3",
                    title: "Offer Push — Launch bundle",
                    assetType: "video/ad",
                    format: "1:1",
                    versionLabel: "v4",
                    reviewStatus: "approved",
                  },
                ]}
              />
              <ReviewThreadsPreview
                threads={[
                  {
                    threadId: "thread-1",
                    assetTitle: "Product Proof — Ingredients close-up",
                    createdBy: "marketing_lead",
                    comments: [
                      {
                        body: "Route 2 is close, but the opening claim still needs a clearer benefit before we approve it.",
                        commentType: "changes_requested",
                        createdAt: new Date("2026-04-22T09:30:00.000Z"),
                      },
                    ],
                  },
                  {
                    threadId: "thread-2",
                    assetTitle: "Offer Push — Launch bundle",
                    createdBy: "brand_manager",
                    comments: [
                      {
                        body: "This version is approved for Meta and Reels. Keep the CTA timing as is.",
                        commentType: "approved",
                        createdAt: new Date("2026-04-22T10:00:00.000Z"),
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>

          <div className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
            <StageTracker
              stages={[
                { key: "brief", status: "done" },
                { key: "creative_plan", status: "done" },
                { key: "production", status: "done" },
                { key: "review", status: "current" },
                { key: "delivery", status: "up_next" },
              ]}
              currentStage="review"
            />
            <NextActionCard
              campaignId={previewCampaignId}
              briefHref="/workspace/briefs/new"
              title="Approve Route 2 for final export"
              body="The workspace is ready for the next review decision. Once Route 2 is approved, the delivery pack can be finalized for launch."
            />
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
