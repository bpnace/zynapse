export function deriveCampaignReviewState(reviewStatuses: string[]) {
  const approvedCount = reviewStatuses.filter((status) => status === "approved").length;
  const hasAssets = reviewStatuses.length > 0;
  const allApproved = hasAssets && approvedCount === reviewStatuses.length;

  if (allApproved) {
    return {
      currentStage: "approved" as const,
      inReviewStatus: "completed" as const,
      approvedStatus: "in_progress" as const,
      handoverReadyStatus: "pending" as const,
    };
  }

  return {
    currentStage: "in_review" as const,
    inReviewStatus: "in_progress" as const,
    approvedStatus: "pending" as const,
    handoverReadyStatus: "pending" as const,
  };
}
