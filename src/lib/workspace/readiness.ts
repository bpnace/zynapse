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
  workflowState?: {
    reviewStatus: string;
    deliveryStatus: string;
    commercialStatus: string;
  } | null;
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
  workflowState = null,
}: BrandWorkspaceReadinessInput): BrandWorkspaceReadiness {
  const approvedAssetCount = latestAssets.filter(
    (asset) => asset.reviewStatus === "approved",
  ).length;
  const reviewStageStatus = getStageStatus(stageItems, "in_review");
  const approvedStageStatus = getStageStatus(stageItems, "approved");
  const handoverReadyStatus = getStageStatus(stageItems, "handover_ready");
  const hasExplicitWorkflowState = workflowState !== null;
  const workflowCommercialReady =
    workflowState?.commercialStatus === "ready_for_pilot" ||
    workflowState?.commercialStatus === "pilot_requested";
  const approvedOrHandoverReady =
    workflowState?.reviewStatus === "approved" &&
    (workflowState?.deliveryStatus === "preparing" ||
      workflowState?.deliveryStatus === "ready");
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
        (workflowCommercialReady || approvedOrHandoverReady)
      : fallbackCommercialVisibility,
  };
}
