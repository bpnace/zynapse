import {
  assertSupabaseResult,
  mapCampaign,
  mapCampaignAssignment,
  mapCampaignWorkflow,
  mapCreativeProfile,
  mapMembership,
  mapPilotRequest,
  mapRevisionItem,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { deriveOpsCreativeOptions } from "@/lib/workspace/ops-creative-options";
import { deriveOpsWorkflowStageState } from "@/lib/workspace/ops-workflow-state";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";

export type OpsAuditFeedItem = {
  id: string;
  campaignId: string;
  kind: "workflow" | "assignment" | "submission" | "revision" | "pilot_request";
  headline: string;
  detail: string;
  at: Date;
};

export type OpsCampaignSummary = {
  id: string;
  name: string;
  currentStage: string;
  packageTier: string;
  campaignGoal: string | null;
  workflow: ReturnType<typeof mapCampaignWorkflow> | null;
  approvedAssetCount: number;
  unresolvedReviewCount: number;
  assignmentCount: number;
  blockedAssignmentCount: number;
  submittedAssignmentCount: number;
  awaitingOpsReviewCount: number;
  awaitingBrandReviewCount: number;
  openRevisionCount: number;
  commercialReady: boolean;
  lastPilotRequest: ReturnType<typeof mapPilotRequest> | null;
  latestSubmissionAt: Date | null;
  reviewQueueStatus: "ready" | "blocked" | "in_review" | "approved";
};

function getReviewQueueStatus(input: {
  commercialReady: boolean;
  unresolvedReviewCount: number;
  awaitingOpsReviewCount: number;
  awaitingBrandReviewCount: number;
  openRevisionCount: number;
}) {
  if (input.commercialReady) {
    return "approved" as const;
  }

  if (input.awaitingOpsReviewCount > 0 || input.awaitingBrandReviewCount > 0) {
    return "in_review" as const;
  }

  if (input.unresolvedReviewCount > 0 || input.openRevisionCount > 0) {
    return "blocked" as const;
  }

  return "ready" as const;
}

export function deriveOpsAuditFeed(input: {
  campaigns: Array<{ id: string; name: string }>;
  workflows: ReturnType<typeof mapCampaignWorkflow>[];
  assignments: ReturnType<typeof mapCampaignAssignment>[];
  versions: Array<{
    id: string;
    campaignId: string;
    versionLabel: string;
    submissionStatus: string;
    createdAt: Date;
  }>;
  revisions: ReturnType<typeof mapRevisionItem>[];
  requests: ReturnType<typeof mapPilotRequest>[];
  creativeProfiles?: Array<{ userId: string; displayName: string }>;
}) {
  const campaignNames = new Map(input.campaigns.map((campaign) => [campaign.id, campaign.name]));
  const profileNames = new Map(
    (input.creativeProfiles ?? []).map((profile) => [profile.userId, profile.displayName]),
  );

  const items: OpsAuditFeedItem[] = [
    ...input.workflows.map((workflow) => ({
      id: `workflow:${workflow.id}`,
      campaignId: workflow.campaignId,
      kind: "workflow" as const,
      headline: `${campaignNames.get(workflow.campaignId) ?? "Campaign"} · Workflow`,
      detail: `${workflow.workflowStatus} · Review ${workflow.reviewStatus} · Delivery ${workflow.deliveryStatus} · Commercial ${workflow.commercialStatus}`,
      at: workflow.lastTransitionAt,
    })),
    ...input.assignments.map((assignment) => ({
      id: `assignment:${assignment.id}`,
      campaignId: assignment.campaignId,
      kind: "assignment" as const,
      headline: `${campaignNames.get(assignment.campaignId) ?? "Campaign"} · Assignment`,
      detail: `${profileNames.get(assignment.userId) ?? assignment.userId} · ${assignment.assignmentRole} · ${assignment.status}`,
      at: assignment.submittedAt ?? assignment.acceptedAt ?? assignment.createdAt,
    })),
    ...input.versions.map((version) => ({
      id: `submission:${version.id}`,
      campaignId: version.campaignId,
      kind: "submission" as const,
      headline: `${campaignNames.get(version.campaignId) ?? "Campaign"} · Asset version`,
      detail: `${version.versionLabel} · ${version.submissionStatus}`,
      at: version.createdAt,
    })),
    ...input.revisions.map((revision) => ({
      id: `revision:${revision.id}`,
      campaignId: revision.campaignId,
      kind: "revision" as const,
      headline: `${campaignNames.get(revision.campaignId) ?? "Campaign"} · Revision`,
      detail: `${revision.title} · ${revision.status}`,
      at: revision.resolvedAt ?? revision.createdAt,
    })),
    ...input.requests.map((request) => ({
      id: `pilot_request:${request.id}`,
      campaignId: request.campaignId,
      kind: "pilot_request" as const,
      headline: `${campaignNames.get(request.campaignId) ?? "Campaign"} · Pilot request`,
      detail: `${request.desiredTier} · ${request.status} · ${request.handoffMode}`,
      at: request.submittedAt,
    })),
  ];

  return items.sort((left, right) => right.at.getTime() - left.at.getTime());
}

type GetOpsOverviewParams = {
  organizationId: string;
};

export async function getOpsOverview({ organizationId }: GetOpsOverviewParams) {
  const supabase = requireServiceRoleClient();

  const { data: campaignRows, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  assertSupabaseResult(campaignError, "Failed to load ops campaigns");

  const campaigns = (campaignRows ?? []).map(mapCampaign);
  const campaignIds = campaigns.map((campaign) => campaign.id);

  const [
    workflowRowsResult,
    assignmentRowsResult,
    assetRowsResult,
    versionRowsResult,
    revisionRowsResult,
    requestRowsResult,
    stageRowsResult,
    membershipRowsResult,
  ] = await Promise.all([
    campaignIds.length > 0
      ? supabase.from("campaign_workflows").select("*").in("campaign_id", campaignIds)
      : supabase.from("campaign_workflows").select("*").limit(0),
    campaignIds.length > 0
      ? supabase
          .from("campaign_assignments")
          .select("*")
          .in("campaign_id", campaignIds)
          .order("created_at", { ascending: false })
      : supabase.from("campaign_assignments").select("*").limit(0),
    campaignIds.length > 0
      ? supabase
          .from("assets")
          .select("id,campaign_id,review_status")
          .in("campaign_id", campaignIds)
          .order("created_at", { ascending: false })
      : supabase.from("assets").select("id,campaign_id,review_status").limit(0),
    campaignIds.length > 0
      ? supabase
          .from("asset_versions")
          .select("*")
          .in("campaign_id", campaignIds)
          .order("created_at", { ascending: false })
      : supabase.from("asset_versions").select("*").limit(0),
    campaignIds.length > 0
      ? supabase
          .from("revision_items")
          .select("*")
          .in("campaign_id", campaignIds)
          .order("created_at", { ascending: false })
      : supabase.from("revision_items").select("*").limit(0),
    campaignIds.length > 0
      ? supabase
          .from("pilot_requests")
          .select("*")
          .in("campaign_id", campaignIds)
          .order("submitted_at", { ascending: false })
      : supabase.from("pilot_requests").select("*").limit(0),
    campaignIds.length > 0
      ? supabase
          .from("campaign_stages")
          .select("campaign_id,stage_key,status")
          .in("campaign_id", campaignIds)
      : supabase.from("campaign_stages").select("campaign_id,stage_key,status").limit(0),
    supabase
      .from("memberships")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("workspace_type", "creative")
      .eq("membership_status", "active"),
  ]);

  assertSupabaseResult(workflowRowsResult.error, "Failed to load ops workflows");
  assertSupabaseResult(assignmentRowsResult.error, "Failed to load ops assignments");
  assertSupabaseResult(assetRowsResult.error, "Failed to load ops assets");
  assertSupabaseResult(versionRowsResult.error, "Failed to load ops submissions");
  assertSupabaseResult(revisionRowsResult.error, "Failed to load ops revisions");
  assertSupabaseResult(requestRowsResult.error, "Failed to load ops pilot requests");
  assertSupabaseResult(stageRowsResult.error, "Failed to load ops stages");
  assertSupabaseResult(membershipRowsResult.error, "Failed to load creative memberships");

  const workflows = (workflowRowsResult.data ?? []).map(mapCampaignWorkflow);
  const assignments = (assignmentRowsResult.data ?? []).map(mapCampaignAssignment);
  const versions = (versionRowsResult.data ?? []).map((row) => ({
    id: row.id,
    campaignId: row.campaign_id,
    versionLabel: row.version_label,
    submissionStatus: row.submission_status,
    createdAt: new Date(row.created_at),
  }));
  const revisions = (revisionRowsResult.data ?? []).map(mapRevisionItem);
  const pilotRequests = (requestRowsResult.data ?? []).map(mapPilotRequest);
  const creativeMemberships = (membershipRowsResult.data ?? []).map(mapMembership);

  const creativeUserIds = Array.from(
    new Set(creativeMemberships.map((membership) => membership.userId)),
  );
  const { data: creativeProfileRows, error: creativeProfileError } =
    creativeUserIds.length > 0
      ? await supabase
          .from("creative_profiles")
          .select("*")
          .in("user_id", creativeUserIds)
          .order("display_name", { ascending: true })
      : { data: [], error: null };

  assertSupabaseResult(creativeProfileError, "Failed to load creative profiles");

  const creativeProfiles = (creativeProfileRows ?? []).map(mapCreativeProfile);
  const availableCreatives = deriveOpsCreativeOptions({
    memberships: creativeMemberships,
    creativeProfiles,
  });

  const campaignById = new Map(campaigns.map((campaign) => [campaign.id, campaign]));
  const workflowByCampaignId = new Map(
    workflows.map((workflow) => [workflow.campaignId, workflow]),
  );
  const profileByUserId = new Map(
    creativeProfiles.map((profile) => [profile.userId, profile]),
  );
  const assignmentsByCampaignId = new Map<string, ReturnType<typeof mapCampaignAssignment>[]>();
  const revisionsByCampaignId = new Map<string, ReturnType<typeof mapRevisionItem>[]>();
  const requestsByCampaignId = new Map<string, ReturnType<typeof mapPilotRequest>[]>();
  const stageItemsByCampaignId = new Map<
    string,
    Array<{ stageKey: string; status: string }>
  >();
  const latestSubmissionAtByCampaignId = new Map<string, Date>();
  const awaitingOpsReviewCountByCampaignId = new Map<string, number>();
  const awaitingBrandReviewCountByCampaignId = new Map<string, number>();
  const openRevisionCountByCampaignId = new Map<string, number>();
  const openRevisionCountByAssignmentId = new Map<string, number>();
  const assetReviewStatusesByCampaignId = new Map<
    string,
    Array<{ reviewStatus: string }>
  >();

  for (const assignment of assignments) {
    const bucket = assignmentsByCampaignId.get(assignment.campaignId) ?? [];
    bucket.push(assignment);
    assignmentsByCampaignId.set(assignment.campaignId, bucket);
  }

  for (const revision of revisions) {
    const bucket = revisionsByCampaignId.get(revision.campaignId) ?? [];
    bucket.push(revision);
    revisionsByCampaignId.set(revision.campaignId, bucket);

    if (revision.status !== "resolved") {
      openRevisionCountByCampaignId.set(
        revision.campaignId,
        (openRevisionCountByCampaignId.get(revision.campaignId) ?? 0) + 1,
      );

      if (revision.assignmentId) {
        openRevisionCountByAssignmentId.set(
          revision.assignmentId,
          (openRevisionCountByAssignmentId.get(revision.assignmentId) ?? 0) + 1,
        );
      }
    }
  }

  for (const request of pilotRequests) {
    const bucket = requestsByCampaignId.get(request.campaignId) ?? [];
    bucket.push(request);
    requestsByCampaignId.set(request.campaignId, bucket);
  }

  for (const row of stageRowsResult.data ?? []) {
    const bucket = stageItemsByCampaignId.get(row.campaign_id) ?? [];
    bucket.push({ stageKey: row.stage_key, status: row.status });
    stageItemsByCampaignId.set(row.campaign_id, bucket);
  }

  for (const version of versions) {
    const current = latestSubmissionAtByCampaignId.get(version.campaignId);
    if (!current || current.getTime() < version.createdAt.getTime()) {
      latestSubmissionAtByCampaignId.set(version.campaignId, version.createdAt);
    }

    if (version.submissionStatus === "submitted_for_ops_review") {
      awaitingOpsReviewCountByCampaignId.set(
        version.campaignId,
        (awaitingOpsReviewCountByCampaignId.get(version.campaignId) ?? 0) + 1,
      );
    }

    if (version.submissionStatus === "submitted_for_brand_review") {
      awaitingBrandReviewCountByCampaignId.set(
        version.campaignId,
        (awaitingBrandReviewCountByCampaignId.get(version.campaignId) ?? 0) + 1,
      );
    }
  }

  const assetRowsInScope = assetRowsResult.data ?? [];
  const assetIds = assetRowsInScope.map((asset) => asset.id);
  const assetToCampaignId = new Map(
    assetRowsInScope.map((asset) => [asset.id, asset.campaign_id]),
  );

  for (const asset of assetRowsInScope) {
    const bucket = assetReviewStatusesByCampaignId.get(asset.campaign_id) ?? [];
    bucket.push({ reviewStatus: asset.review_status });
    assetReviewStatusesByCampaignId.set(asset.campaign_id, bucket);
  }

  const unresolvedReviewCountByCampaignId = new Map<string, number>();

  if (assetIds.length > 0) {
    const { data: reviewThreadRows, error: reviewThreadError } = await supabase
      .from("review_threads")
      .select("asset_id")
      .in("asset_id", assetIds)
      .is("resolved_at", null);

    assertSupabaseResult(reviewThreadError, "Failed to load ops review threads");

    for (const row of reviewThreadRows ?? []) {
      const campaignId = assetToCampaignId.get(row.asset_id);
      if (!campaignId) {
        continue;
      }

      unresolvedReviewCountByCampaignId.set(
        campaignId,
        (unresolvedReviewCountByCampaignId.get(campaignId) ?? 0) + 1,
      );
    }
  }

  const campaignSummaries: OpsCampaignSummary[] = campaigns.map((campaign) => {
    const workflow = workflowByCampaignId.get(campaign.id) ?? null;
    const unresolvedReviewCount =
      unresolvedReviewCountByCampaignId.get(campaign.id) ?? 0;
    const campaignAssignments = assignmentsByCampaignId.get(campaign.id) ?? [];
    const awaitingOpsReviewCount =
      awaitingOpsReviewCountByCampaignId.get(campaign.id) ?? 0;
    const awaitingBrandReviewCount =
      awaitingBrandReviewCountByCampaignId.get(campaign.id) ?? 0;
    const openRevisionCount = openRevisionCountByCampaignId.get(campaign.id) ?? 0;
    const readiness = getBrandWorkspaceReadiness({
      stageItems: stageItemsByCampaignId.get(campaign.id) ?? [],
      latestAssets: assetReviewStatusesByCampaignId.get(campaign.id) ?? [],
      openReviewCount: unresolvedReviewCount,
      workflowState: workflow,
    });

    return {
      id: campaign.id,
      name: campaign.name,
      currentStage: workflow
        ? deriveOpsWorkflowStageState({
            workflowStatus: workflow.workflowStatus,
            reviewStatus: workflow.reviewStatus,
            deliveryStatus: workflow.deliveryStatus,
            commercialStatus: workflow.commercialStatus,
          }).currentStage
        : campaign.currentStage,
      packageTier: campaign.packageTier,
      campaignGoal: campaign.campaignGoal,
      workflow,
      approvedAssetCount: readiness.approvedAssetCount,
      unresolvedReviewCount,
      assignmentCount: campaignAssignments.length,
      blockedAssignmentCount: campaignAssignments.filter(
        (assignment) => assignment.status === "blocked",
      ).length,
      submittedAssignmentCount: campaignAssignments.filter(
        (assignment) => assignment.status === "submitted",
      ).length,
      awaitingOpsReviewCount,
      awaitingBrandReviewCount,
      openRevisionCount,
      commercialReady: readiness.showCommercialStep,
      lastPilotRequest: (requestsByCampaignId.get(campaign.id) ?? [])[0] ?? null,
      latestSubmissionAt: latestSubmissionAtByCampaignId.get(campaign.id) ?? null,
      reviewQueueStatus: getReviewQueueStatus({
        commercialReady: readiness.showCommercialStep,
        unresolvedReviewCount,
        awaitingOpsReviewCount,
        awaitingBrandReviewCount,
        openRevisionCount,
      }),
    };
  });

  const assignmentBoard = assignments.map((assignment) => ({
    ...assignment,
    campaign: campaignById.get(assignment.campaignId) ?? null,
    creativeProfile: profileByUserId.get(assignment.userId) ?? null,
    openRevisionCount: openRevisionCountByAssignmentId.get(assignment.id) ?? 0,
  }));

  const auditFeed = deriveOpsAuditFeed({
    campaigns: campaigns.map((campaign) => ({ id: campaign.id, name: campaign.name })),
    workflows,
    assignments,
    versions,
    revisions,
    requests: pilotRequests,
    creativeProfiles,
  }).slice(0, 12);

  return {
    campaigns: campaignSummaries,
    availableCreatives,
    summary: {
      activeCampaigns: campaignSummaries.length,
      campaignsInReview: campaignSummaries.filter(
        (campaign) => campaign.reviewQueueStatus === "in_review",
      ).length,
      readyForHandover: campaignSummaries.filter(
        (campaign) => campaign.commercialReady,
      ).length,
      pilotRequested: campaignSummaries.filter(
        (campaign) => campaign.lastPilotRequest?.status === "submitted",
      ).length,
      blockedAssignments: assignmentBoard.filter(
        (assignment) => assignment.status === "blocked",
      ).length,
      pendingOpsReview: campaignSummaries.reduce(
        (sum, campaign) => sum + campaign.awaitingOpsReviewCount,
        0,
      ),
    },
    reviewReadinessQueue: campaignSummaries.filter(
      (campaign) => campaign.reviewQueueStatus !== "approved",
    ),
    commercialQueue: campaignSummaries.filter(
      (campaign) => campaign.commercialReady || campaign.awaitingBrandReviewCount > 0,
    ),
    assignmentBoard,
    auditFeed,
  };
}
