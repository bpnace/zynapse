import {
  assertSupabaseResult,
  mapCampaign,
  mapCampaignAssignment,
  mapCampaignWorkflow,
  mapCreativeProfile,
  mapPilotRequest,
  mapRevisionItem,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
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

  const [
    { data: campaignRows, error: campaignError },
    { data: workflowRows, error: workflowError },
    { data: assignmentRows, error: assignmentError },
    { data: assetRows, error: assetError },
    { data: versionRows, error: versionError },
    { data: revisionRows, error: revisionError },
    { data: requestRows, error: requestError },
    { data: stageRows, error: stageError },
    { data: creativeProfileRows, error: creativeProfileError },
  ] = await Promise.all([
    supabase
      .from("campaigns")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false }),
    supabase
      .from("campaign_workflows")
      .select("*"),
    supabase
      .from("campaign_assignments")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("assets")
      .select("id,campaign_id,review_status")
      .order("created_at", { ascending: false }),
    supabase
      .from("asset_versions")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("revision_items")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("pilot_requests")
      .select("*")
      .order("submitted_at", { ascending: false }),
    supabase
      .from("campaign_stages")
      .select("campaign_id,stage_key,status"),
    supabase
      .from("creative_profiles")
      .select("*")
      .order("display_name", { ascending: true }),
  ]);

  assertSupabaseResult(campaignError, "Failed to load ops campaigns");
  assertSupabaseResult(workflowError, "Failed to load ops workflows");
  assertSupabaseResult(assignmentError, "Failed to load ops assignments");
  assertSupabaseResult(assetError, "Failed to load ops assets");
  assertSupabaseResult(versionError, "Failed to load ops submissions");
  assertSupabaseResult(revisionError, "Failed to load ops revisions");
  assertSupabaseResult(requestError, "Failed to load ops pilot requests");
  assertSupabaseResult(stageError, "Failed to load ops stages");
  assertSupabaseResult(creativeProfileError, "Failed to load creative profiles");

  const campaigns = (campaignRows ?? []).map(mapCampaign);
  const campaignIds = new Set(campaigns.map((campaign) => campaign.id));
  const workflows = (workflowRows ?? [])
    .map(mapCampaignWorkflow)
    .filter((workflow) => campaignIds.has(workflow.campaignId));
  const assignments = (assignmentRows ?? [])
    .map(mapCampaignAssignment)
    .filter((assignment) => campaignIds.has(assignment.campaignId));
  const versions = (versionRows ?? [])
    .map((row) => ({
      id: row.id,
      campaignId: row.campaign_id,
      versionLabel: row.version_label,
      submissionStatus: row.submission_status,
      createdAt: new Date(row.created_at),
    }))
    .filter((version) => campaignIds.has(version.campaignId));
  const revisions = (revisionRows ?? [])
    .map(mapRevisionItem)
    .filter((revision) => campaignIds.has(revision.campaignId));
  const pilotRequests = (requestRows ?? [])
    .map(mapPilotRequest)
    .filter((request) => campaignIds.has(request.campaignId));
  const creativeProfiles = (creativeProfileRows ?? []).map(mapCreativeProfile);

  const assetRowsInScope = (assetRows ?? []).filter((asset) => campaignIds.has(asset.campaign_id));
  const assetIds = assetRowsInScope.map((asset) => asset.id);
  const unresolvedReviewCountByCampaignId = new Map<string, number>();

  if (assetIds.length > 0) {
    const { data: reviewThreadRows, error: reviewThreadError } = await supabase
      .from("review_threads")
      .select("asset_id")
      .in("asset_id", assetIds)
      .is("resolved_at", null);

    assertSupabaseResult(reviewThreadError, "Failed to load ops review threads");

    const assetToCampaignId = new Map(assetRowsInScope.map((asset) => [asset.id, asset.campaign_id]));

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

  const stageItemsByCampaignId = new Map<string, Array<{ stageKey: string; status: string }>>();
  for (const row of stageRows ?? []) {
    const bucket = stageItemsByCampaignId.get(row.campaign_id) ?? [];
    bucket.push({ stageKey: row.stage_key, status: row.status });
    stageItemsByCampaignId.set(row.campaign_id, bucket);
  }

  const workflowByCampaignId = new Map(workflows.map((workflow) => [workflow.campaignId, workflow]));
  const assignmentsByCampaignId = new Map<string, ReturnType<typeof mapCampaignAssignment>[]>();
  const revisionsByCampaignId = new Map<string, ReturnType<typeof mapRevisionItem>[]>();
  const requestsByCampaignId = new Map<string, ReturnType<typeof mapPilotRequest>[]>();
  const latestSubmissionAtByCampaignId = new Map<string, Date>();

  for (const assignment of assignments) {
    const bucket = assignmentsByCampaignId.get(assignment.campaignId) ?? [];
    bucket.push(assignment);
    assignmentsByCampaignId.set(assignment.campaignId, bucket);
  }

  for (const revision of revisions) {
    const bucket = revisionsByCampaignId.get(revision.campaignId) ?? [];
    bucket.push(revision);
    revisionsByCampaignId.set(revision.campaignId, bucket);
  }

  for (const request of pilotRequests) {
    const bucket = requestsByCampaignId.get(request.campaignId) ?? [];
    bucket.push(request);
    requestsByCampaignId.set(request.campaignId, bucket);
  }

  for (const version of versions) {
    const current = latestSubmissionAtByCampaignId.get(version.campaignId);
    if (!current || current.getTime() < version.createdAt.getTime()) {
      latestSubmissionAtByCampaignId.set(version.campaignId, version.createdAt);
    }
  }

  const campaignSummaries: OpsCampaignSummary[] = campaigns.map((campaign) => {
    const latestAssets = assetRowsInScope
      .filter((asset) => asset.campaign_id === campaign.id)
      .map((asset) => ({ reviewStatus: asset.review_status }));
    const workflow = workflowByCampaignId.get(campaign.id) ?? null;
    const unresolvedReviewCount = unresolvedReviewCountByCampaignId.get(campaign.id) ?? 0;
    const campaignAssignments = assignmentsByCampaignId.get(campaign.id) ?? [];
    const campaignRevisions = revisionsByCampaignId.get(campaign.id) ?? [];
    const readiness = getBrandWorkspaceReadiness({
      stageItems: stageItemsByCampaignId.get(campaign.id) ?? [],
      latestAssets,
      openReviewCount: unresolvedReviewCount,
      workflowState: workflow,
    });
    const awaitingOpsReviewCount = versions.filter(
      (version) =>
        version.campaignId === campaign.id && version.submissionStatus === "submitted_for_ops_review",
    ).length;
    const awaitingBrandReviewCount = versions.filter(
      (version) =>
        version.campaignId === campaign.id && version.submissionStatus === "submitted_for_brand_review",
    ).length;
    const openRevisionCount = campaignRevisions.filter((revision) => revision.status !== "resolved").length;

    return {
      id: campaign.id,
      name: campaign.name,
      currentStage: campaign.currentStage,
      packageTier: campaign.packageTier,
      campaignGoal: campaign.campaignGoal,
      workflow,
      approvedAssetCount: readiness.approvedAssetCount,
      unresolvedReviewCount,
      assignmentCount: campaignAssignments.length,
      blockedAssignmentCount: campaignAssignments.filter((assignment) => assignment.status === "blocked").length,
      submittedAssignmentCount: campaignAssignments.filter((assignment) => assignment.status === "submitted").length,
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
    campaign: campaigns.find((campaign) => campaign.id === assignment.campaignId) ?? null,
    creativeProfile: creativeProfiles.find((profile) => profile.userId === assignment.userId) ?? null,
    openRevisionCount: revisions.filter(
      (revision) => revision.assignmentId === assignment.id && revision.status !== "resolved",
    ).length,
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
    summary: {
      activeCampaigns: campaignSummaries.length,
      campaignsInReview: campaignSummaries.filter((campaign) => campaign.reviewQueueStatus === "in_review").length,
      readyForHandover: campaignSummaries.filter((campaign) => campaign.commercialReady).length,
      pilotRequested: campaignSummaries.filter(
        (campaign) => campaign.lastPilotRequest?.status === "submitted",
      ).length,
      blockedAssignments: assignmentBoard.filter((assignment) => assignment.status === "blocked").length,
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
