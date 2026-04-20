import { describe, expect, it } from "vitest";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";

describe("getBrandWorkspaceReadiness", () => {
  it("uses explicit workflow state when available and commercially ready", () => {
    const readiness = getBrandWorkspaceReadiness({
      stageItems: [
        { stageKey: "in_review", status: "completed" },
        { stageKey: "approved", status: "in_progress" },
      ],
      latestAssets: [{ reviewStatus: "approved" }],
      openReviewCount: 0,
      workflowState: {
        reviewStatus: "approved",
        deliveryStatus: "ready",
        commercialStatus: "ready_for_pilot",
      },
    });

    expect(readiness.readinessSource).toBe("workflow_state");
    expect(readiness.showCommercialStep).toBe(true);
    expect(readiness.approvedAssetCount).toBe(1);
  });

  it("falls back to the legacy heuristic when no workflow state is present", () => {
    const readiness = getBrandWorkspaceReadiness({
      stageItems: [],
      latestAssets: [{ reviewStatus: "approved" }],
      openReviewCount: 0,
    });

    expect(readiness.readinessSource).toBe("heuristic");
    expect(readiness.showCommercialStep).toBe(true);
  });

  it("hides the commercial step when nothing is approved", () => {
    const readiness = getBrandWorkspaceReadiness({
      stageItems: [],
      latestAssets: [{ reviewStatus: "pending" }],
      openReviewCount: 0,
    });

    expect(readiness.showCommercialStep).toBe(false);
  });

  it("hides the commercial step while review threads are still open", () => {
    const readiness = getBrandWorkspaceReadiness({
      stageItems: [
        { stageKey: "approved", status: "in_progress" },
      ],
      latestAssets: [{ reviewStatus: "approved" }],
      openReviewCount: 2,
      workflowState: {
        reviewStatus: "approved",
        deliveryStatus: "ready",
        commercialStatus: "ready_for_pilot",
      },
    });

    expect(readiness.showCommercialStep).toBe(false);
  });

  it("returns safe defaults for sparse state", () => {
    const readiness = getBrandWorkspaceReadiness({
      stageItems: [],
      latestAssets: [],
      openReviewCount: 0,
    });

    expect(readiness.approvedAssetCount).toBe(0);
    expect(readiness.showCommercialStep).toBe(false);
    expect(readiness.reviewStageStatus).toBeNull();
  });
});
