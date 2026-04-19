import type { CampaignStageKey, CampaignStageStatus } from "@/lib/workspace/data/types";

type ReadinessStage = {
  stageKey: CampaignStageKey | string;
  status: CampaignStageStatus | string;
};

type ReadinessAsset = {
  reviewStatus: string;
};

type BrandWorkspaceReadinessInput = {
  stageItems: ReadinessStage[];
  latestAssets: ReadinessAsset[];
  openReviewCount: number;
};

export type BrandWorkspaceReadiness = {
  approvedAssetCount: number;
  openReviewCount: number;
  reviewStageStatus: CampaignStageStatus | null;
  approvedStageStatus: CampaignStageStatus | null;
  handoverReadyStatus: CampaignStageStatus | null;
  readinessSource: "workflow_state" | "heuristic";
  showCommercialStep: boolean;
};

function getStageStatus(
  stageItems: ReadinessStage[],
  stageKey: CampaignStageKey,
): CampaignStageStatus | null {
  const match = stageItems.find((stage) => stage.stageKey === stageKey);
  return match ? (match.status as CampaignStageStatus) : null;
}

export function getBrandWorkspaceReadiness({
  stageItems,
  latestAssets,
  openReviewCount,
}: BrandWorkspaceReadinessInput): BrandWorkspaceReadiness {
  const approvedAssetCount = latestAssets.filter(
    (asset) => asset.reviewStatus === "approved",
  ).length;
  const reviewStageStatus = getStageStatus(stageItems, "in_review");
  const approvedStageStatus = getStageStatus(stageItems, "approved");
  const handoverReadyStatus = getStageStatus(stageItems, "handover_ready");
  const hasExplicitWorkflowState =
    approvedStageStatus !== null || handoverReadyStatus !== null;
  const approvedOrHandoverReady =
    approvedStageStatus === "in_progress" ||
    approvedStageStatus === "completed" ||
    handoverReadyStatus === "in_progress" ||
    handoverReadyStatus === "completed";
  const fallbackCommercialVisibility =
    approvedAssetCount > 0 && openReviewCount === 0;

  return {
    approvedAssetCount,
    openReviewCount,
    reviewStageStatus,
    approvedStageStatus,
    handoverReadyStatus,
    readinessSource: hasExplicitWorkflowState ? "workflow_state" : "heuristic",
    showCommercialStep: hasExplicitWorkflowState
      ? approvedAssetCount > 0 &&
        openReviewCount === 0 &&
        approvedOrHandoverReady
      : fallbackCommercialVisibility,
  };
}
