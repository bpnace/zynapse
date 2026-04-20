import { describe, expect, it } from "vitest";
import { deriveOpsAuditFeed } from "@/lib/workspace/queries/get-ops-overview";

describe("deriveOpsAuditFeed", () => {
  it("sorts explicit workflow, assignment, submission, revision, and pilot request entries by time", () => {
    const feed = deriveOpsAuditFeed({
      campaigns: [{ id: "campaign-1", name: "Launch sprint" }],
      workflows: [
        {
          id: "workflow-1",
          campaignId: "campaign-1",
          opsOwnerUserId: null,
          workflowStatus: "review",
          reviewStatus: "in_review",
          deliveryStatus: "preparing",
          commercialStatus: "not_ready",
          blockedReason: null,
          slaDueAt: null,
          lastTransitionAt: new Date("2026-04-20T09:00:00.000Z"),
        },
      ],
      assignments: [
        {
          id: "assignment-1",
          campaignId: "campaign-1",
          userId: "user-1",
          assignmentRole: "creative",
          status: "in_progress",
          assignedBy: null,
          scopeSummary: "Own the next asset cut",
          dueAt: null,
          acceptedAt: new Date("2026-04-20T10:00:00.000Z"),
          submittedAt: null,
          createdAt: new Date("2026-04-20T08:00:00.000Z"),
        },
      ],
      versions: [
        {
          id: "version-1",
          campaignId: "campaign-1",
          versionLabel: "v2",
          submissionStatus: "submitted_for_ops_review",
          createdAt: new Date("2026-04-20T11:00:00.000Z"),
        },
      ],
      revisions: [
        {
          id: "revision-1",
          campaignId: "campaign-1",
          assignmentId: "assignment-1",
          assetId: "asset-1",
          reviewThreadId: "thread-1",
          sourceCommentId: "comment-1",
          createdBy: "ops",
          title: "Shorten opener",
          detail: "Need a faster first second",
          status: "open",
          priority: "high",
          createdAt: new Date("2026-04-20T12:00:00.000Z"),
          resolvedAt: null,
        },
      ],
      requests: [
        {
          id: "request-1",
          organizationId: "org-1",
          campaignId: "campaign-1",
          requestedBy: "brand_owner",
          desiredTier: "Growth",
          startWindow: "Next month",
          internalStakeholders: null,
          message: "Ready for pilot",
          status: "submitted",
          handoffMode: "webhook",
          submittedAt: new Date("2026-04-20T13:00:00.000Z"),
        },
      ],
      creativeProfiles: [{ userId: "user-1", displayName: "Alex Motion" }],
    });

    expect(feed.map((item) => item.kind)).toEqual([
      "pilot_request",
      "revision",
      "submission",
      "assignment",
      "workflow",
    ]);
    expect(feed[1]?.detail).toContain("Shorten opener");
    expect(feed[3]?.detail).toContain("Alex Motion");
  });
});
