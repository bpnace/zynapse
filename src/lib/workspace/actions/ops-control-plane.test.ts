import { describe, expect, it } from "vitest";
import { deriveOpsWorkflowStageState } from "@/lib/workspace/ops-workflow-state";

describe("deriveOpsWorkflowStageState", () => {
  it("keeps setup campaigns in setup_planned", () => {
    const state = deriveOpsWorkflowStageState({
      workflowStatus: "setup",
      reviewStatus: "not_ready",
      deliveryStatus: "not_ready",
      commercialStatus: "not_ready",
    });

    expect(state.currentStage).toBe("setup_planned");
    expect(state.statuses.get("setup_planned")).toBe("in_progress");
    expect(state.statuses.get("production_ready")).toBe("pending");
  });

  it("drives approved delivery toward handover readiness", () => {
    const state = deriveOpsWorkflowStageState({
      workflowStatus: "handover",
      reviewStatus: "approved",
      deliveryStatus: "ready",
      commercialStatus: "ready_for_pilot",
    });

    expect(state.currentStage).toBe("handover_ready");
    expect(state.statuses.get("in_review")).toBe("completed");
    expect(state.statuses.get("approved")).toBe("completed");
    expect(state.statuses.get("handover_ready")).toBe("in_progress");
  });
});
