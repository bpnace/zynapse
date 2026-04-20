import type {
  CampaignStageKey,
  CampaignStageStatus,
  CampaignWorkflowCommercialStatus,
  CampaignWorkflowDeliveryStatus,
  CampaignWorkflowReviewStatus,
  CampaignWorkflowStatus,
} from "@/lib/workspace/data/types";

export const opsStageOrder: CampaignStageKey[] = [
  "brief_received",
  "setup_planned",
  "production_ready",
  "in_review",
  "approved",
  "handover_ready",
];

export function deriveOpsWorkflowStageState(input: {
  workflowStatus: CampaignWorkflowStatus;
  reviewStatus: CampaignWorkflowReviewStatus;
  deliveryStatus: CampaignWorkflowDeliveryStatus;
  commercialStatus: CampaignWorkflowCommercialStatus;
}) {
  const statuses = new Map<CampaignStageKey, CampaignStageStatus>(
    opsStageOrder.map((key) => [key, "pending"]),
  );

  statuses.set("brief_received", "completed");

  let currentStage: CampaignStageKey = "setup_planned";

  if (input.workflowStatus === "setup") {
    statuses.set("setup_planned", "in_progress");
    return { currentStage, statuses };
  }

  statuses.set("setup_planned", "completed");
  statuses.set("production_ready", "in_progress");
  currentStage = "production_ready";

  if (input.workflowStatus === "production") {
    return { currentStage, statuses };
  }

  statuses.set("production_ready", "completed");
  statuses.set("in_review", "in_progress");
  currentStage = "in_review";

  if (input.reviewStatus !== "approved") {
    return { currentStage, statuses };
  }

  statuses.set("in_review", "completed");
  statuses.set("approved", "in_progress");
  currentStage = "approved";

  if (input.deliveryStatus === "ready" || input.workflowStatus === "complete") {
    statuses.set("approved", "completed");
    statuses.set(
      "handover_ready",
      input.workflowStatus === "complete" ? "completed" : "in_progress",
    );
    currentStage = "handover_ready";
    return { currentStage, statuses };
  }

  if (
    input.commercialStatus === "ready_for_pilot" ||
    input.commercialStatus === "pilot_requested" ||
    input.deliveryStatus === "preparing" ||
    input.workflowStatus === "handover"
  ) {
    return { currentStage, statuses };
  }

  return { currentStage, statuses };
}
