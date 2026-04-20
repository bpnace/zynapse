import {
  assertSupabaseResult,
  mapAsset,
  mapAssetVersion,
  mapCampaign,
  mapCampaignAssignment,
  mapCampaignStage,
  mapCampaignWorkflow,
  mapCreativeProfile,
  mapCreativeTask,
  mapMembership,
  mapPilotRequest,
  mapRevisionItem,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { deriveOpsCreativeOptions } from "@/lib/workspace/ops-creative-options";
import { decorateWorkspaceAssetMedia } from "@/lib/workspace/media";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";
import { deriveOpsAuditFeed } from "@/lib/workspace/queries/get-ops-overview";

type GetOpsCampaignDetailParams = {
  organizationId: string;
  campaignId: string;
};

export async function getOpsCampaignDetail({
  organizationId,
  campaignId,
}: GetOpsCampaignDetailParams) {
  const supabase = requireServiceRoleClient();

  const [
    { data: campaignRow, error: campaignError },
    { data: workflowRow, error: workflowError },
    { data: assignmentRows, error: assignmentError },
    { data: stageRows, error: stageError },
    { data: assetRows, error: assetError },
    { data: versionRows, error: versionError },
    { data: taskRows, error: taskError },
    { data: revisionRows, error: revisionError },
    { data: requestRows, error: requestError },
    { data: membershipRows, error: membershipError },
  ] = await Promise.all([
    supabase.from("campaigns").select("*").eq("id", campaignId).limit(1).maybeSingle(),
    supabase
      .from("campaign_workflows")
      .select("*")
      .eq("campaign_id", campaignId)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("campaign_assignments")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("campaign_stages")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("stage_order", { ascending: true }),
    supabase
      .from("assets")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("asset_versions")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("creative_tasks")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("revision_items")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("pilot_requests")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("submitted_at", { ascending: false }),
    supabase
      .from("memberships")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("workspace_type", "creative")
      .eq("membership_status", "active"),
  ]);

  assertSupabaseResult(campaignError, "Failed to load ops campaign detail");
  assertSupabaseResult(workflowError, "Failed to load ops workflow detail");
  assertSupabaseResult(assignmentError, "Failed to load ops assignment detail");
  assertSupabaseResult(stageError, "Failed to load ops stage detail");
  assertSupabaseResult(assetError, "Failed to load ops asset detail");
  assertSupabaseResult(versionError, "Failed to load ops version detail");
  assertSupabaseResult(taskError, "Failed to load ops task detail");
  assertSupabaseResult(revisionError, "Failed to load ops revision detail");
  assertSupabaseResult(requestError, "Failed to load ops request detail");
  assertSupabaseResult(membershipError, "Failed to load ops creative memberships");

  const campaign = campaignRow ? mapCampaign(campaignRow) : null;
  if (!campaign || campaign.organizationId !== organizationId) {
    return null;
  }

  const creativeMemberships = (membershipRows ?? []).map(mapMembership);
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

  assertSupabaseResult(
    creativeProfileError,
    "Failed to load ops creative profile detail",
  );

  const workflow = workflowRow ? mapCampaignWorkflow(workflowRow) : null;
  const stages = (stageRows ?? []).map(mapCampaignStage);
  const assignments = (assignmentRows ?? []).map(mapCampaignAssignment);
  const tasks = (taskRows ?? []).map(mapCreativeTask);
  const versions = (versionRows ?? []).map(mapAssetVersion);
  const revisions = (revisionRows ?? []).map(mapRevisionItem);
  const pilotRequests = (requestRows ?? []).map(mapPilotRequest);
  const creativeProfiles = (creativeProfileRows ?? []).map(mapCreativeProfile);
  const assets = (assetRows ?? []).map(mapAsset).map(decorateWorkspaceAssetMedia);
  const availableCreatives = deriveOpsCreativeOptions({
    memberships: creativeMemberships,
    creativeProfiles,
  });

  const profileByUserId = new Map(
    creativeProfiles.map((profile) => [profile.userId, profile]),
  );
  const tasksByAssignmentId = new Map<string, ReturnType<typeof mapCreativeTask>[]>();
  const revisionsByAssignmentId = new Map<string, ReturnType<typeof mapRevisionItem>[]>();
  const versionsByAssetId = new Map<string, ReturnType<typeof mapAssetVersion>[]>();
  const revisionsByAssetId = new Map<string, ReturnType<typeof mapRevisionItem>[]>();
  const tasksByAssetId = new Map<string, ReturnType<typeof mapCreativeTask>[]>();

  for (const task of tasks) {
    if (task.assignmentId) {
      const bucket = tasksByAssignmentId.get(task.assignmentId) ?? [];
      bucket.push(task);
      tasksByAssignmentId.set(task.assignmentId, bucket);
    }

    if (task.assetId) {
      const bucket = tasksByAssetId.get(task.assetId) ?? [];
      bucket.push(task);
      tasksByAssetId.set(task.assetId, bucket);
    }
  }

  for (const revision of revisions) {
    if (revision.assignmentId) {
      const bucket = revisionsByAssignmentId.get(revision.assignmentId) ?? [];
      bucket.push(revision);
      revisionsByAssignmentId.set(revision.assignmentId, bucket);
    }

    if (revision.assetId) {
      const bucket = revisionsByAssetId.get(revision.assetId) ?? [];
      bucket.push(revision);
      revisionsByAssetId.set(revision.assetId, bucket);
    }
  }

  for (const version of versions) {
    const bucket = versionsByAssetId.get(version.assetId) ?? [];
    bucket.push(version);
    versionsByAssetId.set(version.assetId, bucket);
  }

  const assetIds = assets.map((asset) => asset.id);
  const unresolvedReviewCount =
    assetIds.length > 0
      ? await supabase
          .from("review_threads")
          .select("id", { count: "exact", head: true })
          .in("asset_id", assetIds)
          .is("resolved_at", null)
          .then(({ count, error }) => {
            assertSupabaseResult(error, "Failed to load ops unresolved review threads");
            return count ?? 0;
          })
      : 0;

  const readiness = getBrandWorkspaceReadiness({
    stageItems: stages,
    latestAssets: assets,
    openReviewCount: unresolvedReviewCount,
    workflowState: workflow,
  });

  const assignmentsDetailed = assignments.map((assignment) => ({
    ...assignment,
    creativeProfile: profileByUserId.get(assignment.userId) ?? null,
    tasks: tasksByAssignmentId.get(assignment.id) ?? [],
    revisions: revisionsByAssignmentId.get(assignment.id) ?? [],
  }));

  const assetsDetailed = assets.map((asset) => ({
    ...asset,
    versions: versionsByAssetId.get(asset.id) ?? [],
    revisions: revisionsByAssetId.get(asset.id) ?? [],
    tasks: tasksByAssetId.get(asset.id) ?? [],
  }));

  const auditFeed = deriveOpsAuditFeed({
    campaigns: [{ id: campaign.id, name: campaign.name }],
    workflows: workflow ? [workflow] : [],
    assignments,
    versions: versions.map((version) => ({
      id: version.id,
      campaignId: version.campaignId,
      versionLabel: version.versionLabel,
      submissionStatus: version.submissionStatus,
      createdAt: version.createdAt,
    })),
    revisions,
    requests: pilotRequests,
    creativeProfiles,
  });

  return {
    campaign,
    workflow,
    stages,
    readiness,
    assignments: assignmentsDetailed,
    tasks,
    assets: assetsDetailed,
    versions,
    revisions,
    pilotRequests,
    availableCreatives,
    summary: {
      unresolvedReviewCount,
      approvedAssetCount: readiness.approvedAssetCount,
      openRevisionCount: revisions.filter((revision) => revision.status !== "resolved").length,
      blockedTaskCount: tasks.filter((task) => task.status === "blocked").length,
      awaitingOpsReviewCount: versions.filter(
        (version) => version.submissionStatus === "submitted_for_ops_review",
      ).length,
      awaitingBrandReviewCount: versions.filter(
        (version) => version.submissionStatus === "submitted_for_brand_review",
      ).length,
      submittedAssignmentCount: assignments.filter(
        (assignment) => assignment.status === "submitted",
      ).length,
      commercialReady: readiness.showCommercialStep,
    },
    auditFeed,
  };
}
