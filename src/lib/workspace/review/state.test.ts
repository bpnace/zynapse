import { describe, expect, it } from "vitest";
import { deriveCampaignReviewState } from "@/lib/workspace/review/state";

describe("deriveCampaignReviewState", () => {
  it("keeps campaign in review when any asset is still pending or needs changes", () => {
    expect(
      deriveCampaignReviewState(["approved", "pending", "changes_requested"]),
    ).toEqual({
      currentStage: "in_review",
      inReviewStatus: "in_progress",
      approvedStatus: "pending",
      handoverReadyStatus: "pending",
    });
  });

  it("moves campaign to approved when all assets are approved", () => {
    expect(deriveCampaignReviewState(["approved", "approved"])).toEqual({
      currentStage: "approved",
      inReviewStatus: "completed",
      approvedStatus: "in_progress",
      handoverReadyStatus: "pending",
    });
  });
});
